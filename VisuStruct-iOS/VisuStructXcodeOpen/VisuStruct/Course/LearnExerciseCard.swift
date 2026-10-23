import SwiftUI
import VisuStructCore

/// Verbindung der Lern-Spalte zum Editor (umgesetzt in `ContentView`).
struct LearnHost {
    /// Übung in einem eigenen Reiter öffnen (oder zu ihm wechseln).
    var openExercise: (CourseExercise, VisuStructDocument) -> Void
    /// Aktueller Stand der Übung, falls ihr Reiter offen ist.
    var exerciseDocument: (String) -> VisuStructDocument?
    /// Die anderen Reiter als Unterprogramme für Aufrufe.
    var subprograms: (String) -> [String: VisuStructDocument]
    /// Reiter der Übung auf das Startdiagramm zurücksetzen.
    var resetExercise: (String, VisuStructDocument) -> Void
    /// Beispieldiagramm aus der Lektion in einem neuen Reiter öffnen.
    var openDiagram: (VisuStructDocument, String) -> Void
    var stopSimulation: () -> Void
    var showCourseStore: () -> Void
}

struct LearnExerciseCard: View {
    @Environment(\.appLanguage) private var lang
    @ObservedObject private var progress = CourseProgress.shared
    let exercise: CourseExercise
    let context: LearnBlockContext

    @State private var shownHints = 0
    @State private var result: CheckResult?
    @State private var info: String?
    @State private var confirmReset = false

    private struct CheckResult {
        var outcomes: [VisuStructExerciseCheck.Outcome]
        var missing: [VisuStructElementType]
        var passed: Bool
    }

    private var content: CourseContent { context.content }
    private var status: CourseExerciseSupport.Status { CourseExerciseSupport.status(of: exercise, in: content) }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .firstTextBaseline) {
                Text("\(content.t("exercise")): \(exercise.title)")
                    .font(.headline)
                    .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 4)
                if progress.exercise(exercise.id).done {
                    Label(content.t("solved"), systemImage: "checkmark.seal.fill")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.green)
                }
            }
            ForEach(Array(exercise.task.enumerated()), id: \.offset) { index, block in
                LearnBlockView(block: block, context: context.nested("t\(index)"))
            }

            switch status {
            case .java:
                LearnWebOnlyNote(text: content.t("app_java"))
            case .notYet:
                actions(canCheck: false)
                LearnWebOnlyNote(text: content.t("app_not_checkable"))
            case .checkable:
                actions(canCheck: true)
            }

            ForEach(0..<min(shownHints, exercise.hints.count), id: \.self) { index in
                let label = exercise.hints.count > 1 ? "**\(content.t("hint_fmt", index + 1, exercise.hints.count)):** " : ""
                LearnBlockView(block: .note([.paragraph(label + exercise.hints[index])]), context: context.nested("h\(index)"))
            }

            if let info {
                Text(info)
                    .font(.callout)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            if let result {
                resultView(result)
            }
        }
        .padding(14)
        .background(Color.accentColor.opacity(0.06), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 12, style: .continuous).strokeBorder(Color.accentColor.opacity(0.25))
        }
    }

    @ViewBuilder
    private func actions(canCheck: Bool) -> some View {
        ViewThatFits(in: .horizontal) {
            HStack(spacing: 8) { actionButtons(canCheck: canCheck) }
            VStack(alignment: .leading, spacing: 8) { actionButtons(canCheck: canCheck) }
        }
    }

    @ViewBuilder
    private func actionButtons(canCheck: Bool) -> some View {
        Button {
            openInEditor()
        } label: {
            Label(content.t("open_exercise"), systemImage: "square.and.pencil")
        }
        .buttonStyle(.borderedProminent)
        if canCheck {
            Button {
                check()
            } label: {
                Label(content.t("check"), systemImage: "checkmark.circle")
            }
            .buttonStyle(.bordered)
        }
        if !exercise.hints.isEmpty {
            Button(shownHints == 0 ? content.t("hint") : content.t("hint_more")) {
                shownHints = min(shownHints + 1, exercise.hints.count)
            }
            .buttonStyle(.bordered)
            .disabled(shownHints >= exercise.hints.count)
        }
        Button(confirmReset ? content.t("reset_confirm") : content.t("reset"), role: .destructive) {
            if confirmReset {
                reset()
            } else {
                confirmReset = true
                Task {
                    try? await Task.sleep(for: .seconds(4))
                    confirmReset = false
                }
            }
        }
        .buttonStyle(.borderless)
    }

    private func openInEditor() {
        var doc = content.startDocument(for: exercise)
        if let xml = progress.exercise(exercise.id).xml,
           let saved = try? VisuStructXMLCodec.decode(data: Data(xml.utf8)) {
            doc = saved
        }
        context.host.openExercise(exercise, doc)
        info = nil
    }

    private func reset() {
        confirmReset = false
        progress.resetExercise(exercise.id)
        context.host.resetExercise(exercise.id, content.startDocument(for: exercise))
        result = nil
        info = nil
    }

    private func check() {
        guard let doc = context.host.exerciseDocument(exercise.id) else {
            result = nil
            info = content.t("open_first")
            return
        }
        if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
            result = nil
            info = content.t("empty")
            return
        }
        context.host.stopSimulation()
        let outcomes = VisuStructExerciseCheck.check(doc, tests: exercise.checkTests, subprograms: context.host.subprograms(exercise.id))
        let used = VisuStructExerciseCheck.usedElementTypes(doc)
        let missing = exercise.requires.compactMap(VisuStructExerciseCheck.elementType(forKey:)).filter { !used.contains($0) }
        let passed = outcomes.allSatisfy(\.passed) && missing.isEmpty
        info = nil
        result = CheckResult(outcomes: outcomes, missing: missing, passed: passed)
        if passed {
            progress.updateExercise(exercise.id) { $0.done = true }
        }
    }

    private func resultView(_ result: CheckResult) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(result.passed ? "🎉 \(content.t("passed"))" : content.t("failed"))
                .font(.callout.weight(.semibold))
                .fixedSize(horizontal: false, vertical: true)
            ForEach(result.missing, id: \.self) { type in
                Text("✗ \(content.t("missing_fmt", InspectorElementTypeLocalization.title(for: type, lang: lang)))")
                    .font(.callout)
            }
            ForEach(Array(result.outcomes.enumerated()), id: \.offset) { _, outcome in
                VStack(alignment: .leading, spacing: 2) {
                    let input = outcome.test.inputs.isEmpty
                        ? content.t("no_input")
                        : content.t("input_fmt", outcome.test.inputs.joined(separator: ", "))
                    Text("\(outcome.passed ? "✓" : "✗") \(input)")
                        .font(.callout.weight(.medium))
                        .foregroundStyle(outcome.passed ? .green : .red)
                    if !outcome.passed {
                        detail(content.t("expected"), outcome.test.expected)
                        detail(content.t("actual"), outcome.result.outputs)
                        if let error = outcome.result.error {
                            Text(error.localized(in: lang)).font(.caption).foregroundStyle(.red)
                        }
                        if outcome.result.missingInput {
                            Text(content.t("missing_input")).font(.caption).foregroundStyle(.red)
                        }
                        if outcome.result.tooManySteps {
                            Text(content.t("too_many_steps")).font(.caption).foregroundStyle(.red)
                        }
                        if outcome.result.unusedInputs > 0 {
                            Text(content.t("unused_input")).font(.caption).foregroundStyle(.red)
                        }
                    }
                }
            }
        }
        .padding(10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            (result.passed ? Color.green : Color.orange).opacity(0.1),
            in: RoundedRectangle(cornerRadius: 8, style: .continuous)
        )
    }

    private func detail(_ label: String, _ lines: [String]) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 4) {
            Text("\(label):").font(.caption).foregroundStyle(.secondary)
            Text(verbatim: lines.isEmpty ? "–" : lines.joined(separator: " | "))
                .font(.system(.caption, design: .monospaced))
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}
