import SwiftUI
import VisuStructCore

/// Kontext für „Fall hinzufügen“ / „Fall entfernen“ im Inspector (Fallauswahl).
struct InspectorFallauswahlToolbarContext {
    let caseCount: Int
    let removeCaseIndex: Int?
    let onAdd: () -> Void
    let onRemove: () -> Void
}

/// Hauptteil des Inspektors unter dem Canvas (GroupBox-Inhalt).
struct InspectorPanelBody<ForLoopColumn: View>: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.appLanguage) private var lang

    /// Muss `FocusState`-Projektion sein (nicht `Binding`), damit `.focused(_:equals:)` kompiliert.
    var focusedField: FocusState<DiagramEditorFocusTarget?>.Binding

    let selectedPath: [Int]?
    let captionFont: Font
    let inspectorHintFont: Font
    let editorFont: Font
    let editorMonoPt: CGFloat
    let editorMinHeight: CGFloat
    let editorMaxHeight: CGFloat

    let ioModeBinding: Binding<StatementIOMode>?
    let caseLabelBinding: Binding<String>?
    let inspectorShowsForLoopThreeFields: Bool

    @ViewBuilder let forLoopColumn: (Int, Font, Font) -> ForLoopColumn

    let lineEditorVisibleTextBinding: Binding<String>
    let editorFocusToken: UUID
    let lineEditorFixedPrefixLabel: String?
    let inspectorConditionEditorHintLine: String?
    let inspectorLineEditorPlaceholder: String?
    let fallauswahl: InspectorFallauswahlToolbarContext?
    let onApplyLineEditor: () -> Void
    let onApplyRespectingFocus: () -> Void
    let groupBoxTitle: String

    var body: some View {
        GroupBox {
            VStack(alignment: .leading, spacing: 12) {
                if selectedPath == nil {
                    Text(lang.tr("inspector_no_selection"))
                        .foregroundStyle(.secondary)
                        .font(captionFont)
                        .lineSpacing(3)
                }
                if let ioModeBinding {
                    VStack(alignment: .leading, spacing: 6) {
                        Picker("", selection: ioModeBinding) {
                            Text(lang.tr("inspector_io_mode_statement")).tag(StatementIOMode.statement)
                            Text(lang.tr("inspector_io_mode_input")).tag(StatementIOMode.input)
                            Text(lang.tr("inspector_io_mode_output")).tag(StatementIOMode.output)
                        }
                        #if canImport(AppKit)
                        .pickerStyle(.radioGroup)
                        #else
                        .pickerStyle(.segmented)
                        #endif
                        .labelsHidden()
                        if ioModeBinding.wrappedValue == .statement {
                            Text(verbatim: "int number = 5  |  double x = 1.5  |  String text = \"Your text\"  |  boolean ok = true  |  char letter = 'A'  |  const double PI = 3.14")
                                .font(inspectorHintFont)
                                .foregroundStyle(.secondary)
                                .fixedSize(horizontal: false, vertical: true)
                        } else if ioModeBinding.wrappedValue == .input {
                            Text(verbatim: "input: int age \"Enter age\" | input: double price \"Enter price\" | input: String name \"Enter name\"")
                                .font(inspectorHintFont)
                                .foregroundStyle(.secondary)
                        } else if ioModeBinding.wrappedValue == .output {
                            Text(verbatim: "output: number  |  output: \"Your text\"  |  output: \"Your age: \" + age")
                                .font(inspectorHintFont)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.bottom, 2)
                }
                if let labelBind = caseLabelBinding {
                    TextField("z. B. 1, ok, default", text: labelBind)
                        .font(editorFont)
                        .textFieldStyle(.roundedBorder)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled(true)
                        .focused(focusedField, equals: DiagramEditorFocusTarget.caseLabel)
                }
                if inspectorShowsForLoopThreeFields {
                    if horizontalSizeClass == .regular {
                        HStack(alignment: .top, spacing: 12) {
                            ForEach(0 ..< 3, id: \.self) { i in
                                forLoopColumn(i, captionFont, editorFont)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        }
                    } else {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(alignment: .top, spacing: 12) {
                                ForEach(0 ..< 3, id: \.self) { i in
                                    forLoopColumn(i, captionFont, editorFont)
                                        .frame(minWidth: 128, alignment: .leading)
                                }
                            }
                        }
                    }
                } else {
                    VStack(alignment: .leading, spacing: 6) {
                        if let condHint = inspectorConditionEditorHintLine {
                            Text(verbatim: condHint)
                                .font(inspectorHintFont)
                                .foregroundStyle(.secondary)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        HStack(alignment: .top, spacing: 8) {
                            if let prefixLabel = lineEditorFixedPrefixLabel {
                                Text(verbatim: prefixLabel)
                                    .font(.system(size: editorMonoPt, weight: .regular, design: .monospaced))
                                    .foregroundStyle(.secondary)
                                    .padding(.top, 10)
                                    .allowsHitTesting(false)
                            }
                            ZStack(alignment: .topLeading) {
                                CodeLineEditor(
                                    text: lineEditorVisibleTextBinding,
                                    minHeight: editorMinHeight,
                                    maxHeight: editorMaxHeight,
                                    focusToken: editorFocusToken,
                                    onCommit: onApplyLineEditor,
                                    monospacedFontSize: editorMonoPt
                                )
                                .scrollContentBackground(.hidden)
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled(true)
                                .overlay(RoundedRectangle(cornerRadius: 6).stroke(.quaternary))
                                .focused(focusedField, equals: DiagramEditorFocusTarget.textEditor)

                                if selectedPath != nil,
                                   lineEditorVisibleTextBinding.wrappedValue.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                                   let placeholder = inspectorLineEditorPlaceholder {
                                    Text(placeholder)
                                        .font(inspectorHintFont)
                                        .foregroundStyle(.secondary)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 10)
                                        .allowsHitTesting(false)
                                }
                            }
                            .frame(maxWidth: .infinity)
                        }
                    }
                    Button(lang.tr("inspector_apply_text")) {
                        onApplyRespectingFocus()
                    }
                    .disabled(selectedPath == nil)
                }
                if let fa = fallauswahl {
                    HStack(spacing: 16) {
                        Button {
                            fa.onAdd()
                        } label: {
                            Label(lang.tr("inspector_add_case"), systemImage: "plus.rectangle.on.rectangle")
                        }
                        .buttonStyle(.bordered)
                        Button(role: .destructive) {
                            fa.onRemove()
                        } label: {
                            Label(lang.tr("inspector_remove_case"), systemImage: "minus.rectangle")
                        }
                        .buttonStyle(.bordered)
                        .disabled(fa.caseCount <= 2 || fa.removeCaseIndex == nil)
                    }
                }
            }
        } label: {
            Text(groupBoxTitle)
                .font(.headline)
        }
    }
}

/// iPhone: Inspector nur bei Bedarf; Abbruch Einfügemarke / „Texteditor einblenden“.
struct InspectorPhoneChrome<Inspector: View>: View {
    @Environment(\.appLanguage) private var lang

    let isPhone: Bool
    let insertTargetActive: Bool
    let hideInspectorOnPhone: Bool
    let onCancelInsert: () -> Void
    let onShowInspector: () -> Void
    let onHideInspector: () -> Void
    @ViewBuilder let inspector: () -> Inspector

    var body: some View {
        if !isPhone {
            inspector()
        } else {
            if insertTargetActive {
                // Auch während eine Einfügemarke gesetzt ist, bleibt der Text des ausgewählten Elements erreichbar.
                HStack(spacing: 10) {
                    Button {
                        onCancelInsert()
                    } label: {
                        Label(lang.tr("phone_insert_cancel"), systemImage: "xmark.circle")
                    }
                    .buttonStyle(.bordered)
                    Button {
                        onShowInspector()
                    } label: {
                        Label(lang.tr("phone_show_text_editor"), systemImage: "pencil")
                    }
                    .buttonStyle(.bordered)
                }
            } else if hideInspectorOnPhone {
                Button {
                    onShowInspector()
                } label: {
                    Label(lang.tr("phone_show_text_editor"), systemImage: "chevron.up")
                }
                .buttonStyle(.bordered)
            } else {
                VStack(alignment: .trailing, spacing: 4) {
                    Button {
                        onHideInspector()
                    } label: {
                        Label(lang.tr("phone_hide_text_editor"), systemImage: "chevron.down")
                            .font(.subheadline)
                    }
                    .buttonStyle(.borderless)
                    inspector()
                }
            }
        }
    }
}
