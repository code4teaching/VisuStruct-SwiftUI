import SwiftUI
import VisuStructCore
#if canImport(UIKit)
import UIKit
#endif

struct SimulationStatePanel: View {
    @Environment(\.appLanguage) private var lang
    let engine: VisuStructSimulationEngine
    let isPlaying: Bool
    @Binding var inputText: String
    @Binding var highlightModeRaw: String
    let onPlay: () -> Void
    let onPause: () -> Void
    let onStep: () -> Void
    let onSubmitInput: () -> Void
    let onStop: () -> Void
    /// Hochkant auf dem iPad: Steuerung links, Schritt/Variablen/Ausgabe rechts statt alles untereinander.
    var usesWideLayout: Bool = false

    private var sortedVariables: [(String, VisuStructSimulationValue)] {
        engine.state.variables
            .map { ($0.key, $0.value) }
            .sorted { $0.0.localizedStandardCompare($1.0) == .orderedAscending }
    }

    private var isWaitingForInput: Bool { engine.state.inputRequest != nil }

    var body: some View {
        Group {
            if usesWideLayout {
                wideStack
            } else if isWaitingForInput {
                ScrollView {
                    panelStack(flexibleCardsFillHeight: false)
                }
                .scrollBounceBehavior(.basedOnSize)
            } else {
                panelStack(flexibleCardsFillHeight: true)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color(.secondarySystemBackground))
        }
        .overlay {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.08), lineWidth: 1)
        }
    }

    @ViewBuilder
    private func panelStack(flexibleCardsFillHeight: Bool) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            controlsSection
            inputCard
            traceCard(flexibleCardsFillHeight: flexibleCardsFillHeight)
            variablesCard(flexibleCardsFillHeight: flexibleCardsFillHeight)
            outputCard(flexibleCardsFillHeight: flexibleCardsFillHeight)
                .layoutPriority(flexibleCardsFillHeight ? 1 : 0)
            noticeText
        }
    }

    private var wideStack: some View {
        HStack(alignment: .top, spacing: 16) {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    controlsSection
                    inputCard
                    noticeText
                }
            }
            .scrollBounceBehavior(.basedOnSize)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)

            VStack(alignment: .leading, spacing: 16) {
                traceCard(flexibleCardsFillHeight: false)
                HStack(alignment: .top, spacing: 16) {
                    variablesCard(flexibleCardsFillHeight: true)
                    outputCard(flexibleCardsFillHeight: true)
                }
                .frame(maxHeight: .infinity)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
    }

    private var controlsSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(lang.tr("simulation_controls"), systemImage: "slider.horizontal.3")
                .font(.headline)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                SimulationControlButton(title: lang.tr("simulation_play"), systemImage: "play.fill", isDisabled: isPlaying || !engine.canStep, action: onPlay)
                SimulationControlButton(title: lang.tr("simulation_pause"), systemImage: "pause.fill", isDisabled: !isPlaying, action: onPause)
                SimulationControlButton(title: lang.tr("simulation_step"), systemImage: "arrow.right.circle", isDisabled: isPlaying || !engine.canStep, action: onStep)
                SimulationControlButton(title: lang.tr("simulation_stop"), systemImage: "stop.fill", isDisabled: false, action: onStop)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(lang.tr("simulation_highlight_label"))
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Picker(lang.tr("simulation_highlight_label"), selection: $highlightModeRaw) {
                    Text(lang.tr("simulation_highlight_last")).tag(SimulationHighlightMode.lastExecuted.rawValue)
                    Text(lang.tr("simulation_highlight_next")).tag(SimulationHighlightMode.nextToExecute.rawValue)
                }
                .pickerStyle(.segmented)
            }
        }
    }

    private var inputCard: some View {
        SimulationInputCard(
            prompt: engine.state.inputRequest?.prompt,
            variableName: engine.state.inputRequest?.variableName,
            valueType: engine.state.inputRequest?.valueType,
            inputError: engine.state.inputErrorNotice?.localized(in: lang),
            inputText: $inputText,
            onSubmit: onSubmitInput
        )
    }

    private func traceCard(flexibleCardsFillHeight: Bool) -> some View {
        SimulationPlaceholderCard(
            title: lang.tr("simulation_trace"),
            systemImage: "arrow.left.arrow.right",
            minHeight: flexibleCardsFillHeight ? 130 : 88
        ) {
            if let trace = engine.state.lastTrace {
                Text(trace)
                    .font(.body.monospaced())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .fixedSize(horizontal: false, vertical: true)
            } else {
                Text(lang.tr("simulation_trace_placeholder"))
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private func variablesCard(flexibleCardsFillHeight: Bool) -> some View {
        SimulationPlaceholderCard(
            title: lang.tr("simulation_variables"),
            systemImage: "curlybraces",
            minHeight: flexibleCardsFillHeight ? 190 : 96,
            contentFillsHeight: flexibleCardsFillHeight
        ) {
            if sortedVariables.isEmpty {
                Text(lang.tr("simulation_variables_placeholder"))
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(sortedVariables, id: \.0) { name, value in
                            HStack(alignment: .firstTextBaseline) {
                                Text(name)
                                    .font(.body.monospaced().weight(.semibold))
                                Spacer(minLength: 12)
                                Text(value.description)
                                    .font(.body.monospaced())
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    .padding(.trailing, 14)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
        }
    }

    private func outputCard(flexibleCardsFillHeight: Bool) -> some View {
        SimulationPlaceholderCard(
            title: lang.tr("simulation_output"),
            systemImage: "terminal",
            minHeight: flexibleCardsFillHeight ? 170 : 96,
            contentFillsHeight: flexibleCardsFillHeight
        ) {
            if engine.state.outputLines.isEmpty {
                Text(lang.tr("simulation_output_placeholder"))
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 6) {
                        ForEach(Array(engine.state.outputLines.enumerated()), id: \.offset) { _, line in
                            Text(line)
                                .font(.body.monospaced())
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                    .padding(.trailing, 4)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
        }
    }

    @ViewBuilder
    private var noticeText: some View {
        if let message = engine.state.notice?.localized(in: lang) {
            Text(message)
                .font(.caption)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

}

private struct SimulationInputCard: View {
    @Environment(\.appLanguage) private var lang
    let prompt: String?
    let variableName: String?
    let valueType: VisuStructSimulationValueType?
    let inputError: String?
    @Binding var inputText: String
    let onSubmit: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Label(lang.tr("simulation_input"), systemImage: "keyboard")
                .font(.headline)

            if let prompt, let variableName, let valueType {
                Text(prompt)
                    .font(.body)
                    .fixedSize(horizontal: false, vertical: true)

                TextField(variableName, text: $inputText)
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(keyboardType(for: valueType))
                    .frame(minHeight: 44)
                    .onSubmit(onSubmit)

                Button(action: onSubmit) {
                    Text(lang.tr("simulation_input_submit"))
                        .font(.body.weight(.semibold))
                        .frame(maxWidth: .infinity, minHeight: 40)
                }
                .buttonStyle(.borderedProminent)

                if let inputError {
                    Text(inputError)
                        .font(.caption)
                        .foregroundStyle(.red)
                        .fixedSize(horizontal: false, vertical: true)
                }
            } else {
                Text(lang.tr("simulation_input_placeholder"))
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(Color(.tertiarySystemBackground))
        }
        .overlay {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.06), lineWidth: 1)
        }
    }

    private func keyboardType(for valueType: VisuStructSimulationValueType) -> UIKeyboardType {
        switch valueType {
        case .int:
            return .numberPad
        case .double:
            return .decimalPad
        case .string:
            return .default
        }
    }
}

struct SimulationControlButton: View {
    let title: String
    let systemImage: String
    let isDisabled: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Label(title, systemImage: systemImage)
                .font(.subheadline.weight(.medium))
                .frame(maxWidth: .infinity, minHeight: 34)
        }
        .buttonStyle(.bordered)
        .disabled(isDisabled)
    }
}

struct SimulationPlaceholderCard<Content: View>: View {
    let title: String
    let systemImage: String
    let minHeight: CGFloat
    let contentFillsHeight: Bool
    @ViewBuilder var content: () -> Content

    init(
        title: String,
        systemImage: String,
        minHeight: CGFloat = 130,
        contentFillsHeight: Bool = false,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.title = title
        self.systemImage = systemImage
        self.minHeight = minHeight
        self.contentFillsHeight = contentFillsHeight
        self.content = content
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(title, systemImage: systemImage)
                .font(.headline)
            content()
                .frame(maxHeight: contentFillsHeight ? .infinity : nil, alignment: .topLeading)
            if !contentFillsHeight {
                Spacer(minLength: 0)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, minHeight: minHeight, alignment: .topLeading)
        .background {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(Color(.tertiarySystemBackground))
        }
        .overlay {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.06), lineWidth: 1)
        }
    }
}


// MARK: - Meldungen der Simulation

extension VisuStructSimulationNotice {
    /// Meldung der Simulation in der App-Sprache.
    func localized(in lang: AppLanguage) -> String {
        switch self {
        case .finished:
            return lang.tr("sim_notice_finished")
        case .infiniteLoopWithoutBody:
            return lang.tr("sim_notice_infinite_loop_empty")
        case .unsupportedStatement(let text):
            return String(format: lang.tr("sim_notice_unsupported_statement_fmt"), text)
        case .invalidExpression(let text):
            return String(format: lang.tr("sim_notice_invalid_expression_fmt"), text)
        case .unknownVariable(let name):
            return String(format: lang.tr("sim_notice_unknown_variable_fmt"), name)
        case .divisionByZero:
            return lang.tr("sim_notice_division_by_zero")
        case .wholeNumberExpected:
            return lang.tr("sim_notice_whole_number_expected")
        case .numberExpected:
            return lang.tr("sim_notice_number_expected")
        case .other(let text):
            return text
        }
    }
}
