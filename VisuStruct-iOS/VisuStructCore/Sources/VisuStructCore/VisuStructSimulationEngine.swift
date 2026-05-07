import Foundation

public enum VisuStructSimulationValue: Equatable, Sendable, CustomStringConvertible {
    case int(Int)
    case double(Double)
    case string(String)
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
        case .string, .intArray, .doubleArray, .stringArray: return .nan
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
}

public struct VisuStructSimulationStep: Equatable, Sendable {
    public var path: [Int]
    public var text: String
    public var kind: VisuStructSimulationStepKind
    public var cases: [VisuStructCase]?
    public var loopBody: [VisuStructElement]?
    public var forParts: [String]?

    public init(
        path: [Int],
        text: String,
        kind: VisuStructSimulationStepKind = .statement,
        cases: [VisuStructCase]? = nil,
        loopBody: [VisuStructElement]? = nil,
        forParts: [String]? = nil
    ) {
        self.path = path
        self.text = text
        self.kind = kind
        self.cases = cases
        self.loopBody = loopBody
        self.forParts = forParts
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
    public var inputError: String?
    public var lastTrace: String?
    public var message: String?

    public init(
        stepIndex: Int = 0,
        variables: [String: VisuStructSimulationValue] = [:],
        outputLines: [String] = [],
        inputRequest: VisuStructSimulationInputRequest? = nil,
        inputError: String? = nil,
        lastTrace: String? = nil,
        message: String? = nil
    ) {
        self.stepIndex = stepIndex
        self.variables = variables
        self.outputLines = outputLines
        self.inputRequest = inputRequest
        self.inputError = inputError
        self.lastTrace = lastTrace
        self.message = message
    }
}

public struct VisuStructSimulationEngine: Equatable, Sendable {
    public private(set) var steps: [VisuStructSimulationStep]
    public private(set) var state: VisuStructSimulationState

    public var currentStepPath: [Int]? {
        guard state.stepIndex < steps.count else { return nil }
        return steps[state.stepIndex].path
    }

    public var canStep: Bool {
        state.inputRequest == nil && state.stepIndex < steps.count
    }

    public init(document: VisuStructDocument) {
        self.steps = Self.steps(in: document.elements)
        self.state = VisuStructSimulationState()
    }

    public mutating func reset(document: VisuStructDocument? = nil) {
        if let document {
            steps = Self.steps(in: document.elements)
        }
        state = VisuStructSimulationState()
    }

    public mutating func step() {
        guard canStep else {
            if state.inputRequest == nil {
                state.message = "Simulation finished."
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
            }
            if state.inputRequest != nil {
                state.message = nil
                return
            }
            state.stepIndex += 1
            state.message = state.stepIndex >= steps.count ? "Simulation finished." : nil
        } catch {
            state.message = error.localizedDescription
            state.stepIndex += 1
        }
    }

    public mutating func provideInput(_ rawValue: String) {
        guard let request = state.inputRequest else { return }
        do {
            let value = try Self.parseInputValue(rawValue, as: request.valueType)
            try assignValue(value, to: request.variableName)
            state.lastTrace = "\(request.variableName) = input -> \(value.description)"
        } catch {
            state.inputError = error.localizedDescription
            return
        }
        state.inputRequest = nil
        state.inputError = nil
        state.stepIndex += 1
        state.message = state.stepIndex >= steps.count ? "Simulation finished." : nil
    }

    private static func parseInputValue(_ rawValue: String, as valueType: VisuStructSimulationValueType) throws -> VisuStructSimulationValue {
        let trimmed = rawValue
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: ",", with: ".")
        switch valueType {
        case .int:
            guard let value = Int(trimmed) else {
                throw SimulationError.invalidInput("Please enter a whole number.")
            }
            return .int(value)
        case .double:
            guard let value = Double(trimmed) else {
                throw SimulationError.invalidInput("Please enter a number.")
            }
            return .double(value)
        case .string:
            return .string(rawValue)
        }
    }

    private static func steps(
        in elements: [VisuStructElement],
        pathPrefix: [Int] = []
    ) -> [VisuStructSimulationStep] {
        elements.enumerated().compactMap { index, element in
            let path = pathPrefix + [index]
            let text = element.textLines
                .joined(separator: " ")
                .trimmingCharacters(in: .whitespacesAndNewlines)
            switch element.type {
            case .anweisung:
                guard !text.isEmpty else { return nil }
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
            default:
                return nil
            }
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
            pathPrefix: step.path + [selectedCaseIndex]
        )
        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: branchSteps, at: state.stepIndex)
        state.lastTrace = "\(condition) -> \(result ? "true" : "false")"
        state.message = !branchSteps.isEmpty ? nil : (state.stepIndex >= steps.count ? "Simulation finished." : nil)
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
            pathPrefix: step.path + [selectedCaseIndex]
        )

        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: caseSteps, at: state.stepIndex)
        state.lastTrace = "\(selector) -> \(selectedCase.name)"
        state.message = !caseSteps.isEmpty ? nil : (state.stepIndex >= steps.count ? "Simulation finished." : nil)
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
            forParts: parts
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
                pathPrefix: step.path + [0]
            )
            let incrementStep = VisuStructSimulationStep(
                path: step.path,
                text: parts[2],
                kind: .forLoopIncrement,
                loopBody: step.loopBody,
                forParts: parts
            )
            let conditionStep = VisuStructSimulationStep(
                path: step.path,
                text: parts[1],
                kind: .forLoopCondition,
                loopBody: step.loopBody,
                forParts: parts
            )
            steps.remove(at: state.stepIndex)
            steps.insert(contentsOf: bodySteps + [incrementStep, conditionStep], at: state.stepIndex)
        } else {
            steps.remove(at: state.stepIndex)
            state.message = state.stepIndex >= steps.count ? "Simulation finished." : nil
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
                pathPrefix: step.path + [0]
            )
            let conditionStep = VisuStructSimulationStep(
                path: step.path,
                text: step.text,
                kind: .whileLoop,
                loopBody: step.loopBody
            )
            steps.remove(at: state.stepIndex)
            steps.insert(contentsOf: bodySteps + [conditionStep], at: state.stepIndex)
            state.message = !bodySteps.isEmpty ? nil : (state.stepIndex >= steps.count ? "Simulation finished." : nil)
        } else {
            steps.remove(at: state.stepIndex)
            state.message = state.stepIndex >= steps.count ? "Simulation finished." : nil
        }
    }

    private mutating func enterDoUntilLoop(_ step: VisuStructSimulationStep) throws {
        let bodySteps = Self.steps(
            in: step.loopBody ?? [],
            pathPrefix: step.path + [0]
        )
        let conditionStep = VisuStructSimulationStep(
            path: step.path,
            text: step.text,
            kind: .doUntilCondition,
            loopBody: step.loopBody
        )
        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: bodySteps + [conditionStep], at: state.stepIndex)
        state.message = !bodySteps.isEmpty ? nil : (state.stepIndex >= steps.count ? "Simulation finished." : nil)
    }

    private mutating func executeDoUntilCondition(_ step: VisuStructSimulationStep) throws {
        let condition = Self.stripConditionKeyword(step.text)
        let shouldRepeat = try evaluateBoolExpression(condition)
        state.lastTrace = "\(condition) -> \(shouldRepeat ? "true" : "false")"
        if shouldRepeat {
            let bodySteps = Self.steps(
                in: step.loopBody ?? [],
                pathPrefix: step.path + [0]
            )
            let conditionStep = VisuStructSimulationStep(
                path: step.path,
                text: step.text,
                kind: .doUntilCondition,
                loopBody: step.loopBody
            )
            steps.remove(at: state.stepIndex)
            steps.insert(contentsOf: bodySteps + [conditionStep], at: state.stepIndex)
        } else {
            steps.remove(at: state.stepIndex)
            state.message = state.stepIndex >= steps.count ? "Simulation finished." : nil
        }
    }

    private mutating func enterInfiniteLoop(_ step: VisuStructSimulationStep) {
        let bodySteps = Self.steps(
            in: step.loopBody ?? [],
            pathPrefix: step.path + [0]
        )
        let loopStep = VisuStructSimulationStep(
            path: step.path,
            text: step.text,
            kind: .infiniteLoop,
            loopBody: step.loopBody
        )
        steps.remove(at: state.stepIndex)
        steps.insert(contentsOf: bodySteps + [loopStep], at: state.stepIndex)
        state.lastTrace = "true -> true"
        state.message = !bodySteps.isEmpty ? nil : "Infinite loop has no body."
    }

    private mutating func execute(statement rawText: String) throws {
        let text = rawText.trimmingCharacters(in: .whitespacesAndNewlines)
        if text.lowercased().hasPrefix("input:") {
            state.inputRequest = try parseInputRequest(text)
            state.inputError = nil
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
        guard let valueType = Self.valueTypeKeyword(typeName), Self.isIdentifier(leftParts[1]) else {
            throw SimulationError.unsupportedStatement(left)
        }

        let trimmedExpression = expression.trimmingCharacters(in: .whitespacesAndNewlines)
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
        }
    }

    private func evaluateNumericExpression(_ expression: String) throws -> VisuStructSimulationValue {
        let value = try evaluateDoubleExpression(expression)
        return value.rounded() == value ? .int(Int(value)) : .double(value)
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

    private func evaluateBoolExpression(_ expression: String) throws -> Bool {
        let trimmed = expression.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed == "true" { return true }
        if trimmed == "false" { return false }

        let orParts = splitBoolExpression(trimmed, separator: "||")
        if orParts.count > 1 {
            for part in orParts where try evaluateBoolExpression(part) {
                return true
            }
            return false
        }

        let andParts = splitBoolExpression(trimmed, separator: "&&")
        if andParts.count > 1 {
            for part in andParts where try !evaluateBoolExpression(part) {
                return false
            }
            return true
        }

        let operators = [">=", "<=", "==", "!=", ">", "<"]
        for op in operators {
            if let range = trimmed.range(of: op) {
                let lhs = String(trimmed[..<range.lowerBound])
                let rhs = String(trimmed[range.upperBound...])
                let leftValue = try evaluateDoubleExpression(lhs)
                let rightValue = try evaluateDoubleExpression(rhs)
                switch op {
                case ">=": return leftValue >= rightValue
                case "<=": return leftValue <= rightValue
                case "==": return leftValue == rightValue
                case "!=": return leftValue != rightValue
                case ">": return leftValue > rightValue
                case "<": return leftValue < rightValue
                default: break
                }
            }
        }

        return try evaluateDoubleExpression(trimmed) != 0
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
            case .intArray, .doubleArray, .stringArray:
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

    private func splitBoolExpression(_ expression: String, separator: String) -> [String] {
        expression
            .components(separatedBy: separator)
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }
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
            if stripped.first == "(", stripped.last == ")" {
                stripped = String(stripped.dropFirst().dropLast())
                    .trimmingCharacters(in: .whitespacesAndNewlines)
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
    case invalidInput(String)

    var errorDescription: String? {
        switch self {
        case .unsupportedStatement(let text):
            return "Unsupported statement: \(text)"
        case .invalidExpression(let text):
            return "Invalid expression: \(text)"
        case .unknownVariable(let name):
            return "Unknown variable: \(name)"
        case .divisionByZero:
            return "Division by zero."
        case .invalidInput(let message):
            return message
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

private struct NumericExpressionParser {
    var tokens: [NumericExpressionToken]
    var variables: [String: VisuStructSimulationValue]
    var index = 0

    mutating func parseInt() throws -> Int {
        let value = try parseDoubleExpression()
        guard index == tokens.count else {
            throw SimulationError.invalidExpression("")
        }
        guard value.isFinite else { throw SimulationError.invalidExpression("") }
        return Int(value)
    }

    mutating func parseDouble() throws -> Double {
        let value = try parseDoubleExpression()
        guard index == tokens.count else {
            throw SimulationError.invalidExpression("")
        }
        return value
    }

    private mutating func parseIntExpression() throws -> Int {
        var value = try parseIntTerm()
        while let token = current, token == .plus || token == .minus {
            index += 1
            let rhs = try parseIntTerm()
            value = token == .plus ? value + rhs : value - rhs
        }
        return value
    }

    private mutating func parseIntTerm() throws -> Int {
        var value = try parseIntFactor()
        while let token = current, token == .multiply || token == .divide || token == .modulo {
            index += 1
            let rhs = try parseIntFactor()
            if token == .multiply {
                value *= rhs
            } else if token == .divide {
                guard rhs != 0 else { throw SimulationError.divisionByZero }
                value /= rhs
            } else {
                guard rhs != 0 else { throw SimulationError.divisionByZero }
                value %= rhs
            }
        }
        return value
    }

    private mutating func parseIntFactor() throws -> Int {
        guard let token = current else {
            throw SimulationError.invalidExpression("")
        }
        index += 1
        switch token {
        case .number(let literal, let value):
            guard value.rounded() == value, !literal.contains(".") else {
                throw SimulationError.invalidExpression(literal)
            }
            return Int(value)
        case .identifier(let name):
            guard let value = variables[name] else {
                throw SimulationError.unknownVariable(name)
            }
            switch value {
            case .int(let intValue):
                return intValue
            case .double, .string, .intArray, .doubleArray, .stringArray:
                throw SimulationError.invalidExpression(name)
            }
        case .minus:
            return try -parseIntFactor()
        case .leftParen:
            let value = try parseIntExpression()
            guard current == .rightParen else {
                throw SimulationError.invalidExpression("")
            }
            index += 1
            return value
        default:
            throw SimulationError.invalidExpression("")
        }
    }

    private mutating func parseDoubleExpression() throws -> Double {
        var value = try parseDoubleTerm()
        while let token = current, token == .plus || token == .minus {
            index += 1
            let rhs = try parseDoubleTerm()
            value = token == .plus ? value + rhs : value - rhs
        }
        return value
    }

    private mutating func parseDoubleTerm() throws -> Double {
        var value = try parseDoubleFactor()
        while let token = current, token == .multiply || token == .divide || token == .modulo {
            index += 1
            let rhs = try parseDoubleFactor()
            if token == .multiply {
                value *= rhs
            } else if token == .divide {
                guard rhs != 0 else { throw SimulationError.divisionByZero }
                value /= rhs
            } else {
                guard rhs != 0 else { throw SimulationError.divisionByZero }
                value = value.truncatingRemainder(dividingBy: rhs)
            }
        }
        return value
    }

    private mutating func parseDoubleFactor() throws -> Double {
        guard let token = current else {
            throw SimulationError.invalidExpression("")
        }
        index += 1
        switch token {
        case .number(_, let value):
            return value
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
                return Double.random(in: 0..<1)
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
                switch value {
                case .intArray(let values):
                    return Double(values.count)
                case .doubleArray(let values):
                    return Double(values.count)
                case .stringArray(let values):
                    return Double(values.count)
                default:
                    throw SimulationError.invalidExpression(name)
                }
            }
            if current == .leftBracket {
                index += 1
                let elementIndex = Int(try parseDoubleExpression())
                guard current == .rightBracket else {
                    throw SimulationError.invalidExpression(name)
                }
                index += 1
                switch value {
                case .intArray(let values):
                    guard values.indices.contains(elementIndex) else { throw SimulationError.invalidExpression("\(name)[\(elementIndex)]") }
                    return Double(values[elementIndex])
                case .doubleArray(let values):
                    guard values.indices.contains(elementIndex) else { throw SimulationError.invalidExpression("\(name)[\(elementIndex)]") }
                    return values[elementIndex]
                default:
                    throw SimulationError.invalidExpression(name)
                }
            }
            let numericValue = value.asDouble
            guard numericValue.isFinite else {
                throw SimulationError.invalidExpression(name)
            }
            return numericValue
        case .minus:
            return try -parseDoubleFactor()
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
