import Foundation

public enum VisuStructSimulationValue: Equatable, Sendable, CustomStringConvertible {
    case int(Int)
    case double(Double)
    case string(String)
    case bool(Bool)
    case intArray([Int])
    case doubleArray([Double])
    case stringArray([String])

    public var description: String {
        switch self {
        case .int(let value):
            return String(value)
        case .double(let value):
            return Self.formatDouble(value)
        case .string(let value):
            return value
        case .bool(let value):
            return value ? "true" : "false"
        case .intArray(let values):
            return "[" + values.map(String.init).joined(separator: ", ") + "]"
        case .doubleArray(let values):
            return "[" + values.map(Self.formatDouble).joined(separator: ", ") + "]"
        case .stringArray(let values):
            return "[" + values.joined(separator: ", ") + "]"
        }
    }

    fileprivate var asDouble: Double {
        switch self {
        case .int(let value): return Double(value)
        case .double(let value): return value
        case .string, .bool, .intArray, .doubleArray, .stringArray: return .nan
        }
    }

    private static func formatDouble(_ value: Double) -> String {
        if value.isFinite, value.rounded() == value {
            return String(format: "%.1f", locale: Locale(identifier: "en_US_POSIX"), value)
        }
        return String(format: "%.12g", locale: Locale(identifier: "en_US_POSIX"), value)
    }
}

public enum VisuStructSimulationValueType: Equatable, Sendable {
    case int
    case double
    case string
    case bool
}

public enum VisuStructSimulationStepKind: Equatable, Sendable {
    case statement
    case branch
    case switchSelection
    case forLoopStart
    case forLoopCondition
    case forLoopIncrement
    case whileLoop
    case doUntilLoop
    case doUntilCondition
    case infiniteLoop
    case jump
    case call
    case callEnd

    var isLoopContinuation: Bool {
        switch self {
        case .forLoopIncrement, .forLoopCondition, .whileLoop, .doUntilCondition, .infiniteLoop: return true
        default: return false
        }
    }
}

public struct VisuStructSimulationStep: Equatable, Sendable {
    public var path: [Int]
    public var text: String
    public var kind: VisuStructSimulationStepKind
    public var cases: [VisuStructCase]?
    public var loopBody: [VisuStructElement]?
    public var forParts: [String]?
    /// Aufrufebene: 0 ist das Hauptprogramm, jeder Aufruf bekommt eine neue Nummer.
    public var frame: Int
    /// Im Unterprogramm: Pfad des Aufruf-Kastens im Hauptprogramm, der markiert bleibt.
    public var callPath: [Int]?

    public init(
        path: [Int],
        text: String,
        kind: VisuStructSimulationStepKind = .statement,
        cases: [VisuStructCase]? = nil,
        loopBody: [VisuStructElement]? = nil,
        forParts: [String]? = nil,
        frame: Int = 0,
        callPath: [Int]? = nil
    ) {
        self.path = path
        self.text = text
        self.kind = kind
        self.cases = cases
        self.loopBody = loopBody
        self.forParts = forParts
        self.frame = frame
        self.callPath = callPath
    }
}

public struct VisuStructSimulationInputRequest: Equatable, Sendable {
    public var variableName: String
    public var valueType: VisuStructSimulationValueType
    public var prompt: String

    public init(variableName: String, valueType: VisuStructSimulationValueType, prompt: String) {
        self.variableName = variableName
        self.valueType = valueType
        self.prompt = prompt
    }
}

public struct VisuStructSimulationState: Equatable, Sendable {
    public var stepIndex: Int
    public var variables: [String: VisuStructSimulationValue]
    public var outputLines: [String]
    public var inputRequest: VisuStructSimulationInputRequest?
    /// Fehler zur letzten Eingabe (z. B. keine Zahl); Text in der App über `VisuStructSimulationNotice` lokalisieren.
    public var inputErrorNotice: VisuStructSimulationNotice?
    public var lastTrace: String?
    /// Hinweis nach dem letzten Schritt (Ende, Fehler); `nil` während die Simulation normal läuft.
    public var notice: VisuStructSimulationNotice?
    /// Nach einem Fehler bleibt die Simulation auf dem fehlerhaften Schritt stehen, bis sie zurückgesetzt wird.
    public var isHalted: Bool

    public init(
        stepIndex: Int = 0,
        variables: [String: VisuStructSimulationValue] = [:],
        outputLines: [String] = [],
        inputRequest: VisuStructSimulationInputRequest? = nil,
        inputErrorNotice: VisuStructSimulationNotice? = nil,
        lastTrace: String? = nil,
        notice: VisuStructSimulationNotice? = nil,
        isHalted: Bool = false
    ) {
        self.stepIndex = stepIndex
        self.variables = variables
        self.outputLines = outputLines
        self.inputRequest = inputRequest
        self.inputErrorNotice = inputErrorNotice
        self.lastTrace = lastTrace
        self.notice = notice
        self.isHalted = isHalted
    }
}

extension VisuStructSimulationState {
    /// Englischer Text von `notice` (Tests, Protokolle).
    public var message: String? { notice?.englishText }
    /// Englischer Text von `inputErrorNotice`.
    public var inputError: String? { inputErrorNotice?.englishText }
}

public struct VisuStructSimulationEngine: Equatable, Sendable {
    /// Ab dieser Tiefe bricht die Simulation ab (vermutlich ein Aufruf, der sich selbst aufruft).
    public static let maxCallDepth = 100

    public private(set) var steps: [VisuStructSimulationStep]
    public private(set) var state: VisuStructSimulationState
    /// Diagramme für Aufrufe, Schlüssel aus `subprogramKey` (z. B. die anderen offenen Reiter).
    public var subprograms: [String: VisuStructDocument]
    private var nextFrame = 1
    private var callDepth = 0

    /// Im Unterprogramm bleibt der Aufruf-Kasten im Hauptprogramm markiert.
    public var currentStepPath: [Int]? {
        guard state.stepIndex < steps.count else { return nil }
        return steps[state.stepIndex].callPath ?? steps[state.stepIndex].path
    }

    /// `zeigeTitel()` und `zeigeTitel();` heißen beide `zeigetitel`.
    public static func subprogramKey(_ text: String) -> String {
        var name = stripTrailingSemicolon(text)
        if name.hasSuffix(")"), let open = name.lastIndex(of: "("),
           name[name.index(after: open)..<name.index(before: name.endIndex)].allSatisfy(\.isWhitespace) {
            name = String(name[..<open])
        }
        return name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    }

    public var canStep: Bool {
        !state.isHalted && state.inputRequest == nil && state.stepIndex < steps.count
    }

    public init(document: VisuStructDocument, subprograms: [String: VisuStructDocument] = [:]) {
        self.steps = Self.steps(in: document.elements)
        self.state = VisuStructSimulationState()
        self.subprograms = subprograms
    }

    public mutating func reset(document: VisuStructDocument? = nil) {
        if let document {
            steps = Self.steps(in: document.elements)
        }
        state = VisuStructSimulationState()
        nextFrame = 1
        callDepth = 0
    }

    public mutating func step() {
        guard canStep else {
            if state.inputRequest == nil && !state.isHalted {
                state.notice = .finished
            }
            return
        }

        let step = steps[state.stepIndex]
        do {
            switch step.kind {
            case .statement:
                try execute(statement: step.text)
            case .branch:
                try execute(branch: step)
                return
            case .switchSelection:
                try executeSwitchSelection(step)
                return
            case .forLoopStart:
                try executeForLoopStart(step)
                return
            case .forLoopCondition:
                try executeForLoopCondition(step)
                return
            case .forLoopIncrement:
                try executeForLoopIncrement(step)
                return
            case .whileLoop:
                try executeWhileLoop(step)
                return
            case .doUntilLoop:
                try enterDoUntilLoop(step)
                return
            case .doUntilCondition:
                try executeDoUntilCondition(step)
                return
            case .infiniteLoop:
                enterInfiniteLoop(step)
                return
            case .jump:
                executeJump(step)
                return
            case .call:
                try executeCall(step)
                return
            case .callEnd:
                executeCallEnd(step)
                return
            }
            if state.inputRequest != nil {
                state.notice = nil
                return
            }
            state.stepIndex += 1
            state.notice = state.stepIndex >= steps.count ? .finished : nil
        } catch {
            state.notice = VisuStructSimulationNotice(error)
            state.isHalted = true
        }
    }

    public mutating func provideInput(_ rawValue: String) {
        guard let request = state.inputRequest else { return }
        do {
            let value = try Self.parseInputValue(rawValue, as: request.valueType)
            try assignValue(value, to: request.variableName)
            state.lastTrace = "\(request.variableName) = input -> \(value.description)"
        } catch {
            state.inputErrorNotice = VisuStructSimulationNotice(error)
            return
        }
        state.inputRequest = nil
        state.inputErrorNotice = nil
        state.stepIndex += 1
        state.notice = state.stepIndex >= steps.count ? .finished : nil
    }

    private static func parseInputValue(_ rawValue: String, as valueType: VisuStructSimulationValueType) throws -> VisuStructSimulationValue {
        let trimmed = rawValue
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: ",", with: ".")
        switch valueType {
        case .int:
            guard let value = Int(trimmed) else {
                throw SimulationError.invalidInput(.wholeNumberExpected)
            }
            return .int(value)
        case .double:
            guard let value = Double(trimmed) else {
                throw SimulationError.invalidInput(.numberExpected)
            }
            return .double(value)
        case .string:
            return .string(rawValue)
        case .bool:
            switch trimmed.lowercased() {
            case "true", "wahr": return .bool(true)
            case "false", "falsch": return .bool(false)
            default: throw SimulationError.invalidInput(.booleanExpected)
            }
        }
    }

    private static func steps(
        in elements: [VisuStructElement],
        pathPrefix: [Int] = [],
        frame: Int = 0,
        callPath: [Int]? = nil
    ) -> [VisuStructSimulationStep] {
        elements.enumerated().compactMap { index, element -> VisuStructSimulationStep? in
            guard var step = Self.step(for: element, path: pathPrefix + [index]) else { return nil }
            step.frame = frame
            step.callPath = callPath
            return step
        }
    }

    private static func step(for element: VisuStructElement, path: [Int]) -> VisuStructSimulationStep? {
        let text = element.textLines
            .joined(separator: " ")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        switch element.type {
        case .anweisung:
            // Leere Anweisung und Platzhalter „ø“ werden übersprungen
            guard !text.isEmpty, text != "ø" else { return nil }
            return VisuStructSimulationStep(path: path, text: text)
        case .verzweigung:
            return VisuStructSimulationStep(
                path: path,
                text: text.isEmpty ? "true" : text,
                kind: .branch,
                cases: element.cases
            )
        case .fallauswahl:
            return VisuStructSimulationStep(
                path: path,
                text: text.isEmpty ? "0" : text,
                kind: .switchSelection,
                cases: element.cases
            )
        case .forSchleife:
            return VisuStructSimulationStep(
                path: path,
                text: text,
                kind: .forLoopStart,
                loopBody: element.loopBody,
                forParts: normalizedForParts(element.textLines)
            )
        case .whileSchleife:
            return VisuStructSimulationStep(
                path: path,
                text: text.isEmpty ? "true" : text,
                kind: .whileLoop,
                loopBody: element.loopBody
            )
        case .doUntilSchleife:
            return VisuStructSimulationStep(
                path: path,
                text: text.isEmpty ? "true" : text,
                kind: .doUntilLoop,
                loopBody: element.loopBody
            )
        case .endlosschleife:
            return VisuStructSimulationStep(
                path: path,
                text: text.isEmpty ? "true" : text,
                kind: .infiniteLoop,
                loopBody: element.loopBody
            )
        case .aussprung:
            return VisuStructSimulationStep(path: path, text: text, kind: .jump)
        case .aufruf:
            guard !text.isEmpty, text != "ø" else { return nil }
            return VisuStructSimulationStep(path: path, text: text, kind: .call)
        default:
            return nil
        }
    }

    private static func normalizedForParts(_ rawParts: [String]) -> [String] {
        let stripped = rawParts
            .map { stripTrailingSemicolon($0).trimmingCharacters(in: .whitespacesAndNewlines) }
        if stripped.count == 1, stripped[0].contains(";") {
            return paddedForParts(stripped[0]
                .split(separator: ";", omittingEmptySubsequences: false)
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) })
        }
        return paddedForParts(stripped)
    }

    private static func paddedForParts(_ parts: [String]) -> [String] {
        var result = Array(parts.prefix(3))
        while result.count < 3 {
            result.append("")
        }
        return result
    }

    private static func stripTrailingSemicolon(_ text: String) -> String {
        var result = text.trimmingCharacters(in: .whitespacesAndNewlines)
        while result.hasSuffix(";") {
            result = String(result.dropLast()).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return result
    }

    private mutating func execute(branch step: VisuStructSimulationStep) throws {
        guard let cases = step.cases, cases.count >= 2 else {
            throw SimulationError.unsupportedStatement(step.text)
        }
        let condition = Self.stripConditionKeyword(step.text)
        let result = try evaluateBoolExpression(condition)
        let selectedCaseIndex = result ? 0 : 1
        let branchSteps = Self.steps(
            in: cases[selectedCaseIndex].elements,
            pathPrefix: step.path + [selectedCaseIndex],
            frame: step.frame,
            callPath: step.callPath
        )
        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: branchSteps, at: state.stepIndex)
        state.lastTrace = "\(condition) -> \(result ? "true" : "false")"
        state.notice = !branchSteps.isEmpty ? nil : (state.stepIndex >= steps.count ? .finished : nil)
    }

    private mutating func executeSwitchSelection(_ step: VisuStructSimulationStep) throws {
        guard let cases = step.cases, !cases.isEmpty else {
            throw SimulationError.unsupportedStatement(step.text)
        }

        let selector = Self.stripConditionKeyword(step.text)
        let selectorValue = try evaluateSwitchSelector(selector)
        let selectedCaseIndex = Self.matchingCaseIndex(for: selectorValue, in: cases) ?? (cases.count - 1)
        let selectedCase = cases[selectedCaseIndex]
        let caseSteps = Self.steps(
            in: selectedCase.elements,
            pathPrefix: step.path + [selectedCaseIndex],
            frame: step.frame,
            callPath: step.callPath
        )

        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: caseSteps, at: state.stepIndex)
        state.lastTrace = "\(selector) -> \(selectedCase.name)"
        state.notice = !caseSteps.isEmpty ? nil : (state.stepIndex >= steps.count ? .finished : nil)
    }

    private mutating func executeForLoopStart(_ step: VisuStructSimulationStep) throws {
        let parts = Self.normalizedForParts(step.forParts ?? [step.text])
        guard parts.count >= 3 else {
            throw SimulationError.unsupportedStatement(step.text)
        }
        if !parts[0].isEmpty {
            try execute(statement: parts[0])
        }
        let conditionStep = VisuStructSimulationStep(
            path: step.path,
            text: parts[1],
            kind: .forLoopCondition,
            loopBody: step.loopBody,
            forParts: parts,
            frame: step.frame,
            callPath: step.callPath
        )
        steps.remove(at: state.stepIndex)
        steps.insert(conditionStep, at: state.stepIndex)
    }

    private mutating func executeForLoopCondition(_ step: VisuStructSimulationStep) throws {
        let parts = Self.normalizedForParts(step.forParts ?? [step.text])
        guard parts.count >= 3 else {
            throw SimulationError.unsupportedStatement(step.text)
        }
        let condition = parts[1].isEmpty ? "true" : parts[1]
        let shouldEnter = try evaluateBoolExpression(condition)
        state.lastTrace = "\(condition) -> \(shouldEnter ? "true" : "false")"
        if shouldEnter {
            let bodySteps = Self.steps(
                in: step.loopBody ?? [],
                pathPrefix: step.path + [0],
                frame: step.frame,
                callPath: step.callPath
            )
            let incrementStep = VisuStructSimulationStep(
                path: step.path,
                text: parts[2],
                kind: .forLoopIncrement,
                loopBody: step.loopBody,
                forParts: parts,
                frame: step.frame,
                callPath: step.callPath
            )
            let conditionStep = VisuStructSimulationStep(
                path: step.path,
                text: parts[1],
                kind: .forLoopCondition,
                loopBody: step.loopBody,
                forParts: parts,
                frame: step.frame,
                callPath: step.callPath
            )
            steps.remove(at: state.stepIndex)
            steps.insert(contentsOf: bodySteps + [incrementStep, conditionStep], at: state.stepIndex)
        } else {
            steps.remove(at: state.stepIndex)
            state.notice = state.stepIndex >= steps.count ? .finished : nil
        }
    }

    private mutating func executeForLoopIncrement(_ step: VisuStructSimulationStep) throws {
        let increment = step.text.trimmingCharacters(in: .whitespacesAndNewlines)
        if !increment.isEmpty {
            try execute(incrementStatement: increment)
        }
        steps.remove(at: state.stepIndex)
    }

    private mutating func executeWhileLoop(_ step: VisuStructSimulationStep) throws {
        let condition = Self.stripConditionKeyword(step.text)
        let shouldEnter = try evaluateBoolExpression(condition)
        state.lastTrace = "\(condition) -> \(shouldEnter ? "true" : "false")"

        if shouldEnter {
            let bodySteps = Self.steps(
                in: step.loopBody ?? [],
                pathPrefix: step.path + [0],
                frame: step.frame,
                callPath: step.callPath
            )
            let conditionStep = VisuStructSimulationStep(
                path: step.path,
                text: step.text,
                kind: .whileLoop,
                loopBody: step.loopBody,
                frame: step.frame,
                callPath: step.callPath
            )
            steps.remove(at: state.stepIndex)
            steps.insert(contentsOf: bodySteps + [conditionStep], at: state.stepIndex)
            state.notice = !bodySteps.isEmpty ? nil : (state.stepIndex >= steps.count ? .finished : nil)
        } else {
            steps.remove(at: state.stepIndex)
            state.notice = state.stepIndex >= steps.count ? .finished : nil
        }
    }

    private mutating func enterDoUntilLoop(_ step: VisuStructSimulationStep) throws {
        let bodySteps = Self.steps(
            in: step.loopBody ?? [],
            pathPrefix: step.path + [0],
            frame: step.frame,
            callPath: step.callPath
        )
        let conditionStep = VisuStructSimulationStep(
            path: step.path,
            text: step.text,
            kind: .doUntilCondition,
            loopBody: step.loopBody,
            frame: step.frame,
            callPath: step.callPath
        )
        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: bodySteps + [conditionStep], at: state.stepIndex)
        state.notice = !bodySteps.isEmpty ? nil : (state.stepIndex >= steps.count ? .finished : nil)
    }

    private mutating func executeDoUntilCondition(_ step: VisuStructSimulationStep) throws {
        let condition = Self.stripConditionKeyword(step.text)
        let shouldRepeat = try evaluateBoolExpression(condition)
        state.lastTrace = "\(condition) -> \(shouldRepeat ? "true" : "false")"
        if shouldRepeat {
            let bodySteps = Self.steps(
                in: step.loopBody ?? [],
                pathPrefix: step.path + [0],
                frame: step.frame,
                callPath: step.callPath
            )
            let conditionStep = VisuStructSimulationStep(
                path: step.path,
                text: step.text,
                kind: .doUntilCondition,
                loopBody: step.loopBody,
                frame: step.frame,
                callPath: step.callPath
            )
            steps.remove(at: state.stepIndex)
            steps.insert(contentsOf: bodySteps + [conditionStep], at: state.stepIndex)
        } else {
            steps.remove(at: state.stepIndex)
            state.notice = state.stepIndex >= steps.count ? .finished : nil
        }
    }

    private mutating func enterInfiniteLoop(_ step: VisuStructSimulationStep) {
        let bodySteps = Self.steps(
            in: step.loopBody ?? [],
            pathPrefix: step.path + [0],
            frame: step.frame,
            callPath: step.callPath
        )
        let loopStep = VisuStructSimulationStep(
            path: step.path,
            text: step.text,
            kind: .infiniteLoop,
            loopBody: step.loopBody,
            frame: step.frame,
            callPath: step.callPath
        )
        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: bodySteps + [loopStep], at: state.stepIndex)
        state.lastTrace = "true -> true"
        state.notice = !bodySteps.isEmpty ? nil : .infiniteLoopWithoutBody
    }

    // MARK: Aussprung und Aufruf

    /// Wie `break`: verlässt die innerste Schleife, in der der Aussprung steht. Außerhalb jeder Schleife endet
    /// das Unterprogramm bzw. im Hauptprogramm das ganze Programm.
    private mutating func executeJump(_ step: VisuStructSimulationStep) {
        func isPrefix(_ p: [Int]) -> Bool {
            p.count < step.path.count && Array(step.path.prefix(p.count)) == p
        }
        var end = steps.count
        var outcome = "end"
        var i = state.stepIndex + 1
        while i < steps.count {
            let s = steps[i]
            if s.frame == step.frame {
                if s.kind == .callEnd {
                    end = i + 1
                    outcome = "return"
                    break
                }
                if s.kind.isLoopContinuation, isPrefix(s.path) {
                    end = i + 1
                    // Bei der For-Schleife folgt auf das Hochzählen noch die Bedingung
                    while end < steps.count, steps[end].frame == s.frame, steps[end].path == s.path {
                        end += 1
                    }
                    outcome = "break"
                    break
                }
            }
            i += 1
        }
        if outcome == "return" { callDepth -= 1 }
        steps.removeSubrange(state.stepIndex..<end)
        state.lastTrace = "\(step.text.isEmpty ? "break" : step.text) -> \(outcome)"
        state.notice = state.stepIndex >= steps.count ? .finished : nil
    }

    /// Führt das Diagramm mit dem Namen aus dem Aufruf-Kasten aus und macht danach hier weiter.
    private mutating func executeCall(_ step: VisuStructSimulationStep) throws {
        guard let document = subprograms[Self.subprogramKey(step.text)] else {
            steps.remove(at: state.stepIndex)
            state.lastTrace = "\(step.text) -> ?"
            state.notice = state.stepIndex >= steps.count ? .finished : .subprogramNotFound(step.text)
            return
        }
        guard callDepth < Self.maxCallDepth else { throw SimulationError.callTooDeep }
        callDepth += 1
        let frame = nextFrame
        nextFrame += 1
        let callPath = step.callPath ?? step.path
        let bodySteps = Self.steps(in: document.elements, frame: frame, callPath: callPath)
        let endStep = VisuStructSimulationStep(path: step.path, text: step.text, kind: .callEnd, frame: frame, callPath: callPath)
        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: bodySteps + [endStep], at: state.stepIndex)
        state.lastTrace = "\(step.text) -> call"
    }

    private mutating func executeCallEnd(_ step: VisuStructSimulationStep) {
        callDepth -= 1
        steps.remove(at: state.stepIndex)
        state.lastTrace = "\(step.text) -> return"
        state.notice = state.stepIndex >= steps.count ? .finished : nil
    }

    private mutating func execute(statement rawText: String) throws {
        let text = rawText.trimmingCharacters(in: .whitespacesAndNewlines)
        if text.lowercased().hasPrefix("input:") {
            state.inputRequest = try parseInputRequest(text)
            state.inputErrorNotice = nil
            return
        }

        let lowercasedText = text.lowercased()
        if lowercasedText.hasPrefix("output:") || lowercasedText.hasPrefix("print:") {
            let prefixLength = lowercasedText.hasPrefix("output:") ? "output:".count : "print:".count
            let expression = String(text.dropFirst(prefixLength))
            let renderedExpression = try renderOutputExpression(expression)
            let output = try evaluateOutputExpression(expression)
            state.outputLines.append(output)
            state.lastTrace = "\(renderedExpression) -> \(output)"
            return
        }

        if text.hasSuffix("++") || text.hasSuffix("--") || text.contains("+=") || text.contains("-=") {
            try execute(incrementStatement: text)
            return
        }

        guard let equalsIndex = text.firstIndex(of: "=") else {
            throw SimulationError.unsupportedStatement(text)
        }

        let left = text[..<equalsIndex]
            .trimmingCharacters(in: .whitespacesAndNewlines)
        let expression = String(text[text.index(after: equalsIndex)...])
        if let arrayDeclaration = try parseArrayDeclaration(left: String(left), expression: expression) {
            state.variables[arrayDeclaration.name] = arrayDeclaration.value
            state.lastTrace = "\(arrayDeclaration.name) = new \(arrayDeclaration.typeName)[\(arrayDeclaration.count)]"
            return
        }

        let assignment = try parseAssignmentTarget(String(left))
        let renderedExpression = (try? renderNumericExpression(expression)) ?? expression.trimmingCharacters(in: .whitespacesAndNewlines)
        let targetType = assignment.valueType ?? (try? inferTargetValueType(assignment.variableName)) ?? .int
        let value = try evaluateExpression(expression, as: targetType)
        try assignValue(value, to: assignment.variableName)
        state.lastTrace = "\(assignment.variableName) = \(renderedExpression) -> \(value.description)"
    }

    private mutating func execute(incrementStatement text: String) throws {
        if text.hasSuffix("++") {
            let name = String(text.dropLast(2)).trimmingCharacters(in: .whitespacesAndNewlines)
            guard Self.isIdentifier(name), let oldValue = state.variables[name] else {
                throw SimulationError.unsupportedStatement(text)
            }
            switch oldValue {
            case .int(let value):
                state.variables[name] = .int(value + 1)
                state.lastTrace = "\(name) = \(value) + 1 -> \(value + 1)"
                return
            case .double(let value):
                let result = value + 1
                state.variables[name] = .double(result)
                state.lastTrace = "\(name) = \(oldValue.description) + 1 -> \(VisuStructSimulationValue.double(result).description)"
                return
            default:
                throw SimulationError.unsupportedStatement(text)
            }
        }

        if text.hasSuffix("--") {
            let name = String(text.dropLast(2)).trimmingCharacters(in: .whitespacesAndNewlines)
            guard Self.isIdentifier(name), let oldValue = state.variables[name] else {
                throw SimulationError.unsupportedStatement(text)
            }
            switch oldValue {
            case .int(let value):
                state.variables[name] = .int(value - 1)
                state.lastTrace = "\(name) = \(value) - 1 -> \(value - 1)"
                return
            case .double(let value):
                let result = value - 1
                state.variables[name] = .double(result)
                state.lastTrace = "\(name) = \(oldValue.description) - 1 -> \(VisuStructSimulationValue.double(result).description)"
                return
            default:
                throw SimulationError.unsupportedStatement(text)
            }
        }

        if let range = text.range(of: "+=") {
            let name = text[..<range.lowerBound].trimmingCharacters(in: .whitespacesAndNewlines)
            let rhs = String(text[range.upperBound...])
            guard Self.isIdentifier(name), let oldValue = state.variables[name] else {
                throw SimulationError.unsupportedStatement(text)
            }
            switch oldValue {
            case .int(let value):
                let increment = try evaluateIntExpression(rhs)
                state.variables[name] = .int(value + increment)
                state.lastTrace = "\(name) = \(value) + \(increment) -> \(value + increment)"
                return
            case .double(let value):
                let increment = try evaluateDoubleExpression(rhs)
                let result = value + increment
                state.variables[name] = .double(result)
                state.lastTrace = "\(name) = \(oldValue.description) + \(VisuStructSimulationValue.double(increment).description) -> \(VisuStructSimulationValue.double(result).description)"
                return
            default:
                throw SimulationError.unsupportedStatement(text)
            }
        }

        if let range = text.range(of: "-=") {
            let name = text[..<range.lowerBound].trimmingCharacters(in: .whitespacesAndNewlines)
            let rhs = String(text[range.upperBound...])
            guard Self.isIdentifier(name), let oldValue = state.variables[name] else {
                throw SimulationError.unsupportedStatement(text)
            }
            switch oldValue {
            case .int(let value):
                let decrement = try evaluateIntExpression(rhs)
                state.variables[name] = .int(value - decrement)
                state.lastTrace = "\(name) = \(value) - \(decrement) -> \(value - decrement)"
                return
            case .double(let value):
                let decrement = try evaluateDoubleExpression(rhs)
                let result = value - decrement
                state.variables[name] = .double(result)
                state.lastTrace = "\(name) = \(oldValue.description) - \(VisuStructSimulationValue.double(decrement).description) -> \(VisuStructSimulationValue.double(result).description)"
                return
            default:
                throw SimulationError.unsupportedStatement(text)
            }
        }

        try execute(statement: text)
    }

    private struct AssignmentTarget {
        var variableName: String
        var valueType: VisuStructSimulationValueType?
    }

    private func parseAssignmentTarget(_ text: String) throws -> AssignmentTarget {
        // Ein Arrayfach darf Leerzeichen im Index haben: `karten[i + 1] = hilf`.
        if Self.parseArrayElementAccess(text) != nil {
            return AssignmentTarget(variableName: text.trimmingCharacters(in: .whitespacesAndNewlines), valueType: nil)
        }
        let parts = text.split(whereSeparator: { $0.isWhitespace }).map(String.init)
        let name: String
        let valueType: VisuStructSimulationValueType?
        if parts.count == 1 {
            name = parts[0]
            valueType = nil
        } else if parts.count == 2, let type = Self.valueTypeKeyword(parts[0]) {
            name = parts[1]
            valueType = type
        } else if parts.count == 3, parts[0] == "const", let type = Self.valueTypeKeyword(parts[1]) {
            name = parts[2]
            valueType = type
        } else {
            throw SimulationError.unsupportedStatement(text)
        }

        guard Self.isAssignableTarget(name) else {
            throw SimulationError.unsupportedStatement(text)
        }
        return AssignmentTarget(variableName: name, valueType: valueType)
    }

    private func parseInputRequest(_ text: String) throws -> VisuStructSimulationInputRequest {
        let afterColon = String(text.dropFirst("input:".count))
            .trimmingCharacters(in: .whitespacesAndNewlines)
        let parts = afterColon.split(maxSplits: 2, whereSeparator: { $0.isWhitespace }).map(String.init)
        let target: String
        let valueType: VisuStructSimulationValueType
        let promptRaw: String
        if parts.count >= 2, let explicitType = Self.valueTypeKeyword(parts[0]) {
            target = parts[1]
            valueType = explicitType
            promptRaw = parts.count >= 3 ? parts[2].trimmingCharacters(in: .whitespacesAndNewlines) : ""
        } else if let first = parts.first {
            target = first
            valueType = try inferTargetValueType(first)
            promptRaw = parts.count >= 2 ? parts[1].trimmingCharacters(in: .whitespacesAndNewlines) : ""
        } else {
            throw SimulationError.unsupportedStatement(text)
        }
        guard Self.isAssignableTarget(target) else {
            throw SimulationError.unsupportedStatement(text)
        }
        let prompt = Self.unquotedString(promptRaw) ?? promptRaw
        return VisuStructSimulationInputRequest(
            variableName: target,
            valueType: valueType,
            prompt: prompt.isEmpty ? "\(target):" : prompt
        )
    }

    private struct ArrayDeclaration {
        var name: String
        var typeName: String
        var count: Int
        var value: VisuStructSimulationValue
    }

    private func parseArrayDeclaration(left: String, expression: String) throws -> ArrayDeclaration? {
        let leftParts = left.split(whereSeparator: { $0.isWhitespace }).map(String.init)
        guard leftParts.count == 2, leftParts[0].hasSuffix("[]") else { return nil }
        let typeName = String(leftParts[0].dropLast(2))
        guard let valueType = Self.valueTypeKeyword(typeName), valueType != .bool, Self.isIdentifier(leftParts[1]) else {
            throw SimulationError.unsupportedStatement(left)
        }

        let trimmedExpression = expression.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmedExpression.hasPrefix("{"), trimmedExpression.hasSuffix("}") {
            let inner = String(trimmedExpression.dropFirst().dropLast())
            let rawItems = inner.split(separator: ",", omittingEmptySubsequences: false)
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            let value: VisuStructSimulationValue
            switch valueType {
            case .int:
                value = .intArray(try rawItems.map { try evaluateIntExpression($0) })
            case .double:
                value = .doubleArray(try rawItems.map { try evaluateDoubleExpression($0) })
            case .string:
                value = .stringArray(try rawItems.map { item in
                    if let stringValue = Self.unquotedString(item) {
                        return stringValue
                    }
                    return try evaluateOutputExpression(item)
                })
            case .bool:
                throw SimulationError.unsupportedStatement(left)
            }
            return ArrayDeclaration(name: leftParts[1], typeName: typeName, count: rawItems.count, value: value)
        }

        let prefix = "new \(typeName)["
        guard trimmedExpression.hasPrefix(prefix), trimmedExpression.hasSuffix("]") else {
            throw SimulationError.unsupportedStatement(expression)
        }
        let sizeExpression = String(trimmedExpression.dropFirst(prefix.count).dropLast())
        let count = try evaluateIntExpression(sizeExpression)
        guard count >= 0 else { throw SimulationError.invalidExpression(sizeExpression) }

        let value: VisuStructSimulationValue
        switch valueType {
        case .int:
            value = .intArray(Array(repeating: 0, count: count))
        case .double:
            value = .doubleArray(Array(repeating: 0, count: count))
        case .string:
            value = .stringArray(Array(repeating: "", count: count))
        case .bool:
            throw SimulationError.unsupportedStatement(left)
        }
        return ArrayDeclaration(name: leftParts[1], typeName: typeName, count: count, value: value)
    }

    private struct ArrayElementAccess {
        var arrayName: String
        var indexExpression: String
    }

    private static func parseArrayElementAccess(_ text: String) -> ArrayElementAccess? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.hasSuffix("]"), let open = trimmed.firstIndex(of: "[") else { return nil }
        let name = String(trimmed[..<open]).trimmingCharacters(in: .whitespacesAndNewlines)
        guard isIdentifier(name) else { return nil }
        // Die Klammer nach dem Namen muss erst am Ende schließen, sonst ist es z. B. `a[i] > a[i + 1]`.
        var depth = 0
        for character in trimmed[open..<trimmed.index(before: trimmed.endIndex)] {
            if character == "[" {
                depth += 1
            } else if character == "]" {
                depth -= 1
                if depth == 0 { return nil }
            }
        }
        let afterOpen = trimmed.index(after: open)
        let indexExpression = String(trimmed[afterOpen..<trimmed.index(before: trimmed.endIndex)])
        return ArrayElementAccess(arrayName: name, indexExpression: indexExpression)
    }

    private func arrayIndex(from expression: String) throws -> Int {
        let index = try evaluateIntExpression(expression)
        guard index >= 0 else { throw SimulationError.invalidExpression(expression) }
        return index
    }

    private func evaluateReference(_ text: String) throws -> VisuStructSimulationValue? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if let value = state.variables[trimmed] {
            return value
        }
        guard let access = Self.parseArrayElementAccess(trimmed) else { return nil }
        let index = try arrayIndex(from: access.indexExpression)
        return try valueInArray(named: access.arrayName, at: index)
    }

    private func valueInArray(named name: String, at index: Int) throws -> VisuStructSimulationValue {
        guard let value = state.variables[name] else {
            throw SimulationError.unknownVariable(name)
        }
        switch value {
        case .intArray(let values):
            guard values.indices.contains(index) else { throw SimulationError.invalidExpression("\(name)[\(index)]") }
            return .int(values[index])
        case .doubleArray(let values):
            guard values.indices.contains(index) else { throw SimulationError.invalidExpression("\(name)[\(index)]") }
            return .double(values[index])
        case .stringArray(let values):
            guard values.indices.contains(index) else { throw SimulationError.invalidExpression("\(name)[\(index)]") }
            return .string(values[index])
        default:
            throw SimulationError.invalidExpression(name)
        }
    }

    private func inferTargetValueType(_ target: String) throws -> VisuStructSimulationValueType {
        let trimmed = target.trimmingCharacters(in: .whitespacesAndNewlines)
        if let value = state.variables[trimmed] {
            return Self.valueType(of: value)
        }
        if let access = Self.parseArrayElementAccess(trimmed) {
            guard let value = state.variables[access.arrayName] else {
                throw SimulationError.unknownVariable(access.arrayName)
            }
            switch value {
            case .intArray:
                return .int
            case .doubleArray:
                return .double
            case .stringArray:
                return .string
            default:
                throw SimulationError.invalidExpression(access.arrayName)
            }
        }
        throw SimulationError.unsupportedStatement(target)
    }

    private mutating func assignValue(_ value: VisuStructSimulationValue, to target: String) throws {
        let trimmed = target.trimmingCharacters(in: .whitespacesAndNewlines)
        if let access = Self.parseArrayElementAccess(trimmed) {
            let index = try arrayIndex(from: access.indexExpression)
            guard let oldValue = state.variables[access.arrayName] else {
                throw SimulationError.unknownVariable(access.arrayName)
            }
            switch (oldValue, value) {
            case (.intArray(var values), .int(let newValue)):
                guard values.indices.contains(index) else { throw SimulationError.invalidExpression(trimmed) }
                values[index] = newValue
                state.variables[access.arrayName] = .intArray(values)
            case (.doubleArray(var values), .double(let newValue)):
                guard values.indices.contains(index) else { throw SimulationError.invalidExpression(trimmed) }
                values[index] = newValue
                state.variables[access.arrayName] = .doubleArray(values)
            case (.doubleArray(var values), .int(let newValue)):
                guard values.indices.contains(index) else { throw SimulationError.invalidExpression(trimmed) }
                values[index] = Double(newValue)
                state.variables[access.arrayName] = .doubleArray(values)
            case (.stringArray(var values), .string(let newValue)):
                guard values.indices.contains(index) else { throw SimulationError.invalidExpression(trimmed) }
                values[index] = newValue
                state.variables[access.arrayName] = .stringArray(values)
            default:
                throw SimulationError.invalidExpression(trimmed)
            }
            return
        }
        state.variables[trimmed] = value
    }

    private func evaluateOutputExpression(_ expression: String) throws -> String {
        try splitByPlusOutsideQuotes(expression).map { part in
            let trimmed = part.trimmingCharacters(in: .whitespacesAndNewlines)
            if let stringValue = Self.unquotedString(trimmed) {
                return stringValue
            }
            if let value = try evaluateReference(trimmed) {
                return value.description
            }
            return try evaluateNumericExpression(trimmed).description
        }.joined()
    }

    private func renderOutputExpression(_ expression: String) throws -> String {
        try splitByPlusOutsideQuotes(expression).map { part in
            let trimmed = part.trimmingCharacters(in: .whitespacesAndNewlines)
            if Self.unquotedString(trimmed) != nil {
                return trimmed
            }
            if let value = try evaluateReference(trimmed) {
                return value.description
            }
            return (try? renderNumericExpression(trimmed)) ?? trimmed
        }.joined(separator: " + ")
    }

    private func evaluateExpression(_ expression: String, as valueType: VisuStructSimulationValueType) throws -> VisuStructSimulationValue {
        switch valueType {
        case .int:
            return .int(try evaluateIntExpression(expression))
        case .double:
            return .double(try evaluateDoubleExpression(expression))
        case .string:
            let trimmed = expression.trimmingCharacters(in: .whitespacesAndNewlines)
            if let stringValue = Self.unquotedString(trimmed) {
                return .string(stringValue)
            }
            if let value = try evaluateReference(trimmed) {
                return .string(value.description)
            }
            return .string(try evaluateOutputExpression(expression))
        case .bool:
            return .bool(try evaluateBoolExpression(expression))
        }
    }

    private func evaluateNumericExpression(_ expression: String) throws -> VisuStructSimulationValue {
        var parser = NumericExpressionParser(
            tokens: try NumericExpressionTokenizer.tokenize(Self.normalizeNumericExpression(expression)),
            variables: state.variables
        )
        let result = try parser.parseNumber()
        let value = result.value
        return result.isInt || (value.isFinite && value.rounded() == value) ? .int(Int(value)) : .double(value)
    }

    private func evaluateIntExpression(_ expression: String) throws -> Int {
        var parser = NumericExpressionParser(
            tokens: try NumericExpressionTokenizer.tokenize(Self.normalizeNumericExpression(expression)),
            variables: state.variables
        )
        let value = try parser.parseInt()
        return value
    }

    private func evaluateDoubleExpression(_ expression: String) throws -> Double {
        var parser = NumericExpressionParser(
            tokens: try NumericExpressionTokenizer.tokenize(Self.normalizeNumericExpression(expression)),
            variables: state.variables
        )
        return try parser.parseDouble()
    }

    /// Bedingungen wie in Java: `||` vor `&&` vor `!`, Klammern, Vergleiche von Zahlen und Strings, `a.equals(b)`.
    private func evaluateBoolExpression(_ expression: String) throws -> Bool {
        let trimmed = expression.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed == "true" { return true }
        if trimmed == "false" { return false }
        if let value = try evaluateReference(trimmed), case .bool(let flag) = value {
            return flag
        }

        let orParts = Self.splitTopLevel(trimmed, separator: "||")
        if orParts.count > 1 {
            for part in orParts where try evaluateBoolExpression(part) {
                return true
            }
            return false
        }

        let andParts = Self.splitTopLevel(trimmed, separator: "&&")
        if andParts.count > 1 {
            for part in andParts where try !evaluateBoolExpression(part) {
                return false
            }
            return true
        }

        if trimmed.hasPrefix("!"), !trimmed.hasPrefix("!=") {
            return try !evaluateBoolExpression(String(trimmed.dropFirst()))
        }

        if let inner = Self.innerOfOuterParentheses(trimmed) {
            return try evaluateBoolExpression(inner)
        }

        if let call = Self.parseEqualsCall(trimmed) {
            return try evaluateComparison(lhs: call.lhs, op: "==", rhs: call.rhs)
        }

        if let comparison = Self.splitComparison(trimmed) {
            return try evaluateComparison(lhs: comparison.lhs, op: comparison.op, rhs: comparison.rhs)
        }

        if try stringOperand(trimmed) != nil {
            throw SimulationError.invalidExpression(trimmed)
        }
        return try evaluateDoubleExpression(trimmed) != 0
    }

    private func evaluateComparison(lhs: String, op: String, rhs: String) throws -> Bool {
        let leftBool = try boolOperand(lhs)
        let rightBool = try boolOperand(rhs)
        if leftBool != nil || rightBool != nil, op == "==" || op == "!=" {
            let left = try leftBool ?? evaluateBoolExpression(lhs)
            let right = try rightBool ?? evaluateBoolExpression(rhs)
            return op == "==" ? left == right : left != right
        }

        let leftString = try stringOperand(lhs)
        let rightString = try stringOperand(rhs)
        if leftString != nil || rightString != nil {
            guard let left = leftString, let right = rightString else {
                throw SimulationError.invalidExpression("\(lhs) \(op) \(rhs)")
            }
            switch op {
            case "==": return left == right
            case "!=": return left != right
            case "<": return left < right
            case "<=": return left <= right
            case ">": return left > right
            case ">=": return left >= right
            default: throw SimulationError.invalidExpression("\(lhs) \(op) \(rhs)")
            }
        }

        let leftValue = try evaluateDoubleExpression(lhs)
        let rightValue = try evaluateDoubleExpression(rhs)
        switch op {
        case "==": return leftValue == rightValue
        case "!=": return leftValue != rightValue
        case "<": return leftValue < rightValue
        case "<=": return leftValue <= rightValue
        case ">": return leftValue > rightValue
        case ">=": return leftValue >= rightValue
        default: throw SimulationError.invalidExpression("\(lhs) \(op) \(rhs)")
        }
    }

    /// `true`, `false` oder eine bool-Variable; sonst `nil`.
    private func boolOperand(_ text: String) throws -> Bool? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed == "true" { return true }
        if trimmed == "false" { return false }
        if let value = try evaluateReference(trimmed), case .bool(let flag) = value {
            return flag
        }
        return nil
    }

    /// String-Literal oder String-Variable (auch Element eines String-Arrays); sonst `nil`.
    private func stringOperand(_ text: String) throws -> String? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if let literal = Self.unquotedString(trimmed) {
            return literal
        }
        if let value = try evaluateReference(trimmed), case .string(let string) = value {
            return string
        }
        return nil
    }

    private enum SwitchSelectorValue: Equatable {
        case int(Int)
        case text(String)
    }

    private func evaluateSwitchSelector(_ selector: String) throws -> SwitchSelectorValue {
        let trimmed = selector.trimmingCharacters(in: .whitespacesAndNewlines)
        if let text = Self.unquotedString(trimmed) {
            return .text(text)
        }
        if let variableValue = state.variables[trimmed] {
            switch variableValue {
            case .int(let value):
                return .int(value)
            case .double(let value):
                return .int(Int(value))
            case .string(let value):
                return .text(value)
            case .bool, .intArray, .doubleArray, .stringArray:
                throw SimulationError.invalidExpression(trimmed)
            }
        }
        if let intValue = Int(trimmed) {
            return .int(intValue)
        }
        return .int(try evaluateIntExpression(trimmed))
    }

    private static func matchingCaseIndex(
        for selector: SwitchSelectorValue,
        in cases: [VisuStructCase]
    ) -> Int? {
        for (index, branchCase) in cases.enumerated() {
            let label = branchCase.name.trimmingCharacters(in: .whitespacesAndNewlines)
            guard label.lowercased() != "default" else { continue }
            switch selector {
            case .int(let value):
                if Int(label) == value { return index }
            case .text(let value):
                if unquotedString(label) == value || label == value { return index }
            }
        }
        return nil
    }

    /// Für jedes Zeichen: liegt es außerhalb von Klammern und String-Literalen?
    private static func topLevelMask(_ chars: [Character]) -> [Bool] {
        var mask = [Bool](repeating: false, count: chars.count)
        var depth = 0
        var inString = false
        var escaped = false
        for (index, char) in chars.enumerated() {
            if inString {
                if escaped {
                    escaped = false
                } else if char == "\\" {
                    escaped = true
                } else if char == "\"" {
                    inString = false
                }
                continue
            }
            switch char {
            case "\"": inString = true
            case "(", "[": depth += 1
            case ")", "]": depth -= 1
            default: mask[index] = depth == 0
            }
        }
        return mask
    }

    private static func splitTopLevel(_ expression: String, separator: String) -> [String] {
        let chars = Array(expression)
        let separatorChars = Array(separator)
        let mask = topLevelMask(chars)
        var parts: [String] = []
        var current: [Character] = []
        var index = 0
        while index < chars.count {
            let end = index + separatorChars.count
            if end <= chars.count, Array(chars[index..<end]) == separatorChars, mask[index..<end].allSatisfy({ $0 }) {
                parts.append(String(current).trimmingCharacters(in: .whitespacesAndNewlines))
                current = []
                index = end
                continue
            }
            current.append(chars[index])
            index += 1
        }
        parts.append(String(current).trimmingCharacters(in: .whitespacesAndNewlines))
        return parts
    }

    /// Erster Vergleichsoperator außerhalb von Klammern und Strings.
    private static func splitComparison(_ expression: String) -> (lhs: String, op: String, rhs: String)? {
        let chars = Array(expression)
        let mask = topLevelMask(chars)
        for index in chars.indices where mask[index] {
            var op: String?
            if index + 1 < chars.count, mask[index + 1] {
                let pair = String(chars[index...index + 1])
                if [">=", "<=", "==", "!="].contains(pair) {
                    op = pair
                }
            }
            if op == nil, chars[index] == "<" || chars[index] == ">" {
                op = String(chars[index])
            }
            guard let op else { continue }
            let lhs = String(chars[..<index]).trimmingCharacters(in: .whitespacesAndNewlines)
            let rhs = String(chars[(index + op.count)...]).trimmingCharacters(in: .whitespacesAndNewlines)
            return (lhs, op, rhs)
        }
        return nil
    }

    /// Index der `)`, die die `(` bei `openIndex` schließt.
    private static func matchingCloseParenthesis(in chars: [Character], from openIndex: Int) -> Int? {
        var depth = 0
        var inString = false
        var escaped = false
        for index in openIndex..<chars.count {
            let char = chars[index]
            if inString {
                if escaped {
                    escaped = false
                } else if char == "\\" {
                    escaped = true
                } else if char == "\"" {
                    inString = false
                }
                continue
            }
            switch char {
            case "\"": inString = true
            case "(": depth += 1
            case ")":
                depth -= 1
                if depth == 0 { return index }
            default: break
            }
        }
        return nil
    }

    /// `(a || b)` → `a || b`; `(a) && (b)` bleibt unverändert.
    private static func innerOfOuterParentheses(_ text: String) -> String? {
        let chars = Array(text)
        guard chars.first == "(", chars.last == ")",
              matchingCloseParenthesis(in: chars, from: 0) == chars.count - 1 else {
            return nil
        }
        return String(chars[1..<(chars.count - 1)]).trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Java-Stil `name.equals("Anna")`.
    private static func parseEqualsCall(_ text: String) -> (lhs: String, rhs: String)? {
        let chars = Array(text)
        let marker = Array(".equals(")
        guard chars.last == ")" else { return nil }
        let mask = topLevelMask(chars)
        for index in chars.indices where mask[index] && index + marker.count <= chars.count {
            guard Array(chars[index..<(index + marker.count)]) == marker else { continue }
            let openIndex = index + marker.count - 1
            guard matchingCloseParenthesis(in: chars, from: openIndex) == chars.count - 1 else { continue }
            let lhs = String(chars[..<index]).trimmingCharacters(in: .whitespacesAndNewlines)
            let rhs = String(chars[(openIndex + 1)..<(chars.count - 1)]).trimmingCharacters(in: .whitespacesAndNewlines)
            return (lhs, rhs)
        }
        return nil
    }

    private func renderNumericExpression(_ expression: String) throws -> String {
        try NumericExpressionTokenizer.tokenize(Self.normalizeNumericExpression(expression))
            .map { token in
                switch token {
                case .number(let literal, _):
                    return literal
                case .identifier(let name):
                    guard let value = state.variables[name] else {
                        throw SimulationError.unknownVariable(name)
                    }
                    return value.description
                case .plus:
                    return "+"
                case .minus:
                    return "-"
                case .multiply:
                    return "*"
                case .divide:
                    return "/"
                case .modulo:
                    return "%"
                case .dot:
                    return "."
                case .leftParen:
                    return "("
                case .rightParen:
                    return ")"
                case .leftBracket:
                    return "["
                case .rightBracket:
                    return "]"
                }
            }
            .joined(separator: " ")
            .replacingOccurrences(of: "( ", with: "(")
            .replacingOccurrences(of: " )", with: ")")
            .replacingOccurrences(of: " . ", with: ".")
            .replacingOccurrences(of: "[ ", with: "[")
            .replacingOccurrences(of: " ]", with: "]")
    }

    private func splitByPlusOutsideQuotes(_ expression: String) throws -> [String] {
        var parts: [String] = []
        var current = ""
        var isInsideString = false
        var isEscaped = false

        for char in expression {
            if isEscaped {
                current.append(char)
                isEscaped = false
                continue
            }
            if char == "\\" {
                current.append(char)
                isEscaped = true
                continue
            }
            if char == "\"" {
                isInsideString.toggle()
                current.append(char)
                continue
            }
            if char == "+", !isInsideString {
                parts.append(current)
                current = ""
                continue
            }
            current.append(char)
        }

        guard !isInsideString else {
            throw SimulationError.invalidExpression(expression)
        }
        parts.append(current)
        return parts
    }

    private static func isIdentifier(_ text: String) -> Bool {
        guard let first = text.first, first.isLetter || first == "_" else { return false }
        return text.allSatisfy { $0.isLetter || $0.isNumber || $0 == "_" }
    }

    private static func normalizeNumericExpression(_ expression: String) -> String {
        expression
            .replacingOccurrences(of: "(int)", with: "")
            .replacingOccurrences(of: "(double)", with: "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private static func isAssignableTarget(_ text: String) -> Bool {
        isIdentifier(text) || parseArrayElementAccess(text) != nil
    }

    private static func valueTypeKeyword(_ text: String) -> VisuStructSimulationValueType? {
        switch text.lowercased() {
        case "int":
            return .int
        case "double":
            return .double
        case "string":
            return .string
        case "boolean", "bool":
            return .bool
        default:
            return nil
        }
    }

    private static func valueType(of value: VisuStructSimulationValue) -> VisuStructSimulationValueType {
        switch value {
        case .int:
            return .int
        case .double:
            return .double
        case .string:
            return .string
        case .bool:
            return .bool
        case .intArray, .doubleArray, .stringArray:
            return .string
        }
    }

    private static func unquotedString(_ text: String) -> String? {
        guard text.count >= 2, text.first == "\"", text.last == "\"" else { return nil }
        let inner = text.dropFirst().dropLast()
        return inner
            .replacingOccurrences(of: "\\\"", with: "\"")
            .replacingOccurrences(of: "\\n", with: "\n")
    }

    private static func stripConditionKeyword(_ text: String) -> String {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        for keyword in ["if", "while", "until", "switch"] {
            guard trimmed.hasPrefix(keyword) else { continue }
            let afterKeyword = trimmed.dropFirst(keyword.count)
            guard afterKeyword.isEmpty || afterKeyword.first?.isWhitespace == true || afterKeyword.first == "(" else {
                continue
            }
            var stripped = String(afterKeyword).trimmingCharacters(in: .whitespacesAndNewlines)
            if let inner = innerOfOuterParentheses(stripped) {
                stripped = inner
            }
            return stripped.isEmpty ? "true" : stripped
        }
        return trimmed.isEmpty ? "true" : trimmed
    }
}

private enum SimulationError: LocalizedError, Equatable {
    case unsupportedStatement(String)
    case invalidExpression(String)
    case unknownVariable(String)
    case divisionByZero
    case callTooDeep
    case invalidInput(VisuStructSimulationNotice)

    var notice: VisuStructSimulationNotice {
        switch self {
        case .unsupportedStatement(let text): return .unsupportedStatement(text)
        case .invalidExpression(let text): return .invalidExpression(text)
        case .unknownVariable(let name): return .unknownVariable(name)
        case .divisionByZero: return .divisionByZero
        case .callTooDeep: return .callTooDeep
        case .invalidInput(let notice): return notice
        }
    }

    var errorDescription: String? { notice.englishText }
}

/// Meldungen der Simulation, unabhängig von der Sprache; die App übersetzt sie.
public enum VisuStructSimulationNotice: Equatable, Sendable {
    case finished
    case infiniteLoopWithoutBody
    case unsupportedStatement(String)
    case invalidExpression(String)
    case unknownVariable(String)
    case divisionByZero
    case wholeNumberExpected
    case numberExpected
    case booleanExpected
    case subprogramNotFound(String)
    case callTooDeep
    /// Fehler aus einer anderen Quelle, nur als Text bekannt.
    case other(String)

    init(_ error: Error) {
        if let simulationError = error as? SimulationError {
            self = simulationError.notice
        } else {
            self = .other(error.localizedDescription)
        }
    }

    public var englishText: String {
        switch self {
        case .finished: return "Simulation finished."
        case .infiniteLoopWithoutBody: return "Infinite loop has no body."
        case .unsupportedStatement(let text): return "Unsupported statement: \(text)"
        case .invalidExpression(let text): return "Invalid expression: \(text)"
        case .unknownVariable(let name): return "Unknown variable: \(name)"
        case .divisionByZero: return "Division by zero."
        case .wholeNumberExpected: return "Please enter a whole number."
        case .numberExpected: return "Please enter a number."
        case .booleanExpected: return "Please enter true or false."
        case .subprogramNotFound(let name): return "No open diagram is called \(name). The call was skipped."
        case .callTooDeep: return "Too many nested calls. Does a subprogram call itself?"
        case .other(let text): return text
        }
    }
}

private enum NumericExpressionToken: Equatable {
    case number(String, Double)
    case identifier(String)
    case plus
    case minus
    case multiply
    case divide
    case modulo
    case dot
    case leftParen
    case rightParen
    case leftBracket
    case rightBracket
}

private enum NumericExpressionTokenizer {
    static func tokenize(_ expression: String) throws -> [NumericExpressionToken] {
        var tokens: [NumericExpressionToken] = []
        var index = expression.startIndex

        while index < expression.endIndex {
            let char = expression[index]
            if char.isWhitespace {
                index = expression.index(after: index)
                continue
            }
            if char.isNumber || (char == "." && expression.index(after: index) < expression.endIndex && expression[expression.index(after: index)].isNumber) {
                let start = index
                var dotCount = 0
                while index < expression.endIndex {
                    let current = expression[index]
                    if current == "." {
                        dotCount += 1
                        guard dotCount <= 1 else { throw SimulationError.invalidExpression(expression) }
                    } else if !current.isNumber {
                        break
                    }
                    index = expression.index(after: index)
                }
                let literal = String(expression[start..<index])
                guard literal != ".", let value = Double(literal) else {
                    throw SimulationError.invalidExpression(expression)
                }
                tokens.append(.number(literal, value))
                continue
            }
            if char.isLetter || char == "_" {
                let start = index
                while index < expression.endIndex {
                    let current = expression[index]
                    guard current.isLetter || current.isNumber || current == "_" else { break }
                    index = expression.index(after: index)
                }
                tokens.append(.identifier(String(expression[start..<index])))
                continue
            }

            switch char {
            case "+":
                tokens.append(.plus)
            case "-":
                tokens.append(.minus)
            case "*":
                tokens.append(.multiply)
            case "/":
                tokens.append(.divide)
            case "%":
                tokens.append(.modulo)
            case ".":
                tokens.append(.dot)
            case "(":
                tokens.append(.leftParen)
            case ")":
                tokens.append(.rightParen)
            case "[":
                tokens.append(.leftBracket)
            case "]":
                tokens.append(.rightBracket)
            default:
                throw SimulationError.invalidExpression(expression)
            }
            index = expression.index(after: index)
        }

        return tokens
    }
}

struct NumericResult {
    var value: Double
    var isInt: Bool
}

private struct NumericExpressionParser {
    var tokens: [NumericExpressionToken]
    var variables: [String: VisuStructSimulationValue]
    var index = 0

    mutating func parseInt() throws -> Int {
        let value = try parseDoubleExpression().value
        guard index == tokens.count else {
            throw SimulationError.invalidExpression("")
        }
        guard value.isFinite else { throw SimulationError.invalidExpression("") }
        return Int(value)
    }

    mutating func parseDouble() throws -> Double {
        try parseNumber().value
    }

    /// Wert samt Angabe, ob er wie in Java ganzzahlig ist (nur `int`-Werte und Literale ohne Punkt).
    mutating func parseNumber() throws -> NumericResult {
        let value = try parseDoubleExpression()
        guard index == tokens.count else {
            throw SimulationError.invalidExpression("")
        }
        return value
    }

    private mutating func parseDoubleExpression() throws -> NumericResult {
        var value = try parseDoubleTerm()
        while let token = current, token == .plus || token == .minus {
            index += 1
            let rhs = try parseDoubleTerm()
            value = NumericResult(
                value: token == .plus ? value.value + rhs.value : value.value - rhs.value,
                isInt: value.isInt && rhs.isInt
            )
        }
        return value
    }

    private mutating func parseDoubleTerm() throws -> NumericResult {
        var value = try parseDoubleFactor()
        while let token = current, token == .multiply || token == .divide || token == .modulo {
            index += 1
            let rhs = try parseDoubleFactor()
            let bothInt = value.isInt && rhs.isInt
            if token == .multiply {
                value = NumericResult(value: value.value * rhs.value, isInt: bothInt)
            } else if token == .divide {
                guard rhs.value != 0 else { throw SimulationError.divisionByZero }
                // Wie in Java: int / int schneidet Richtung null ab (7 / 2 = 3, -7 / 2 = -3)
                let quotient = value.value / rhs.value
                value = NumericResult(value: bothInt ? quotient.rounded(.towardZero) : quotient, isInt: bothInt)
            } else {
                guard rhs.value != 0 else { throw SimulationError.divisionByZero }
                value = NumericResult(value: value.value.truncatingRemainder(dividingBy: rhs.value), isInt: bothInt)
            }
        }
        return value
    }

    private mutating func parseDoubleFactor() throws -> NumericResult {
        guard let token = current else {
            throw SimulationError.invalidExpression("")
        }
        index += 1
        switch token {
        case .number(let literal, let value):
            return NumericResult(value: value, isInt: !literal.contains("."))
        case .identifier(let name):
            if name == "Math", current == .dot {
                index += 1
                guard current == .identifier("random") else {
                    throw SimulationError.invalidExpression(name)
                }
                index += 1
                guard current == .leftParen else {
                    throw SimulationError.invalidExpression("Math.random")
                }
                index += 1
                guard current == .rightParen else {
                    throw SimulationError.invalidExpression("Math.random")
                }
                index += 1
                return NumericResult(value: Double.random(in: 0..<1), isInt: false)
            }
            guard let value = variables[name] else {
                throw SimulationError.unknownVariable(name)
            }
            if current == .dot {
                index += 1
                guard current == .identifier("length") else {
                    throw SimulationError.invalidExpression(name)
                }
                index += 1
                if current == .leftParen {
                    index += 1
                    guard current == .rightParen else {
                        throw SimulationError.invalidExpression("\(name).length")
                    }
                    index += 1
                }
                switch value {
                case .intArray(let values):
                    return NumericResult(value: Double(values.count), isInt: true)
                case .doubleArray(let values):
                    return NumericResult(value: Double(values.count), isInt: true)
                case .stringArray(let values):
                    return NumericResult(value: Double(values.count), isInt: true)
                default:
                    throw SimulationError.invalidExpression(name)
                }
            }
            if current == .leftBracket {
                index += 1
                let elementIndex = Int(try parseDoubleExpression().value)
                guard current == .rightBracket else {
                    throw SimulationError.invalidExpression(name)
                }
                index += 1
                switch value {
                case .intArray(let values):
                    guard values.indices.contains(elementIndex) else { throw SimulationError.invalidExpression("\(name)[\(elementIndex)]") }
                    return NumericResult(value: Double(values[elementIndex]), isInt: true)
                case .doubleArray(let values):
                    guard values.indices.contains(elementIndex) else { throw SimulationError.invalidExpression("\(name)[\(elementIndex)]") }
                    return NumericResult(value: values[elementIndex], isInt: false)
                default:
                    throw SimulationError.invalidExpression(name)
                }
            }
            let numericValue = value.asDouble
            guard numericValue.isFinite else {
                throw SimulationError.invalidExpression(name)
            }
            if case .int = value {
                return NumericResult(value: numericValue, isInt: true)
            }
            return NumericResult(value: numericValue, isInt: false)
        case .minus:
            let inner = try parseDoubleFactor()
            return NumericResult(value: -inner.value, isInt: inner.isInt)
        case .leftParen:
            let value = try parseDoubleExpression()
            guard current == .rightParen else {
                throw SimulationError.invalidExpression("")
            }
            index += 1
            return value
        default:
            throw SimulationError.invalidExpression("")
        }
    }

    private var current: NumericExpressionToken? {
        guard index < tokens.count else { return nil }
        return tokens[index]
    }
}
