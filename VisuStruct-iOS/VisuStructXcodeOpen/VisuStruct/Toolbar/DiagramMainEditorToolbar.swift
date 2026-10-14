import SwiftUI

/// Hauptfenster-Toolbar: Titel, Undo/Redo, Datei-Menü, Aktionen (Touch-Leiste), Tastatur „Fertig“.
/// Diagramm-Reiter liegen in `DiagramTabStrip`.
struct DiagramMainEditorToolbar: ToolbarContent {
    @Environment(\.appLanguage) private var lang

    let principalTitle: String
    let principalShowsUnsaved: Bool
    let principalAccessibilityLabel: String

    let canUndo: Bool
    let canRedo: Bool
    let onUndo: () -> Void
    let onRedo: () -> Void

    let isSimulationMode: Bool
    /// iPhone und schmales iPad: Simulation, Code und Teilen liegen hier, die Bausteine in der Leiste unten.
    let showsTouchActions: Bool
    let canDeleteSelection: Bool
    let codeGeneratorLocked: Bool
    let onToggleSimulation: () -> Void
    let onGenerateCode: () -> Void
    let onDeleteSelection: () -> Void
    let onSharePNG: () -> Void
    let onShareDocument: () -> Void
    let onExportPDF: () -> Void
    let onShowAbout: () -> Void

    let recentFiles: [RecentVisuStructFile]
    let onOpenImporter: () -> Void
    let onPickRecent: (RecentVisuStructFile) -> Void
    let onClearRecent: () -> Void

    let onSave: () -> Void
    let onSaveAs: () -> Void

    /// Nur unter UIKit (Druck); sonst `nil` und kein Eintrag.
    let onPrint: (() -> Void)?

    let onKeyboardDismiss: () -> Void

    var body: some ToolbarContent {
        ToolbarItem(placement: .principal) {
            HStack(spacing: 6) {
                Text(verbatim: principalTitle)
                    .lineLimit(1)
                    .minimumScaleFactor(0.65)
                    .font(.headline)
                if principalShowsUnsaved {
                    Circle()
                        .fill(Color.accentColor)
                        .frame(width: 7, height: 7)
                        .accessibilityHidden(true)
                }
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel(principalAccessibilityLabel)
        }
        ToolbarItemGroup(placement: .topBarLeading) {
            Button(lang.tr("toolbar_undo"), systemImage: "arrow.uturn.backward", action: onUndo)
                .disabled(!canUndo)
                .help(lang.tr("toolbar_undo"))
                .keyboardShortcut("z", modifiers: .command)
            Button(lang.tr("toolbar_redo"), systemImage: "arrow.uturn.forward", action: onRedo)
                .disabled(!canRedo)
                .help(lang.tr("toolbar_redo"))
                .keyboardShortcut("z", modifiers: [.command, .shift])
        }
        ToolbarItemGroup(placement: .topBarTrailing) {
            Button(action: onSave) {
                Label(lang.tr("menu_save"), systemImage: "arrow.down.doc")
                    .foregroundStyle(isSimulationMode ? .tertiary : .primary)
            }
            .help(lang.tr("menu_save"))
            .keyboardShortcut("s", modifiers: .command)
            .disabledAndDimmed(isSimulationMode)
            if showsTouchActions {
                Menu {
                    Button(action: onToggleSimulation) {
                        Label(
                            isSimulationMode ? lang.tr("action_diagram") : lang.tr("action_simulation"),
                            systemImage: isSimulationMode ? "rectangle.split.3x1" : "play.circle"
                        )
                    }
                    Button(action: onGenerateCode) {
                        Label(
                            lang.tr("action_generate_code"),
                            systemImage: codeGeneratorLocked ? "lock.fill" : "chevron.left.forwardslash.chevron.right"
                        )
                    }
                    .disabled(isSimulationMode)
                    Button(action: onDeleteSelection) {
                        Label(lang.tr("action_delete_selection"), systemImage: "trash")
                    }
                    .disabled(isSimulationMode || !canDeleteSelection)
                    Divider()
                    Button(action: onSharePNG) {
                        Label(lang.tr("action_share_png"), systemImage: "square.and.arrow.up")
                    }
                    .disabled(isSimulationMode)
                    Button(action: onShareDocument) {
                        Label(lang.tr("action_share_document"), systemImage: "square.and.arrow.up.on.square")
                    }
                    .disabled(isSimulationMode)
                    Button(action: onExportPDF) {
                        Label(lang.tr("action_export_pdf"), systemImage: "doc.text.magnifyingglass")
                    }
                    .disabled(isSimulationMode)
                    Divider()
                    Button(action: onShowAbout) {
                        Label(lang.tr("action_about"), systemImage: "info.circle")
                    }
                } label: {
                    Label(lang.tr("touch_actions_menu"), systemImage: "ellipsis.circle")
                }
                .labelStyle(.iconOnly)
                .accessibilityLabel(lang.tr("touch_actions_menu"))
            }
            Menu {
                Button(action: onOpenImporter) {
                    Label(lang.tr("menu_open"), systemImage: "square.and.arrow.down")
                        .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                }
                Menu {
                    if recentFiles.isEmpty {
                        Text(lang.tr("recent_files_empty"))
                    } else {
                        ForEach(recentFiles) { file in
                            Button {
                                onPickRecent(file)
                            } label: {
                                Label(file.displayName, systemImage: "clock.arrow.circlepath")
                            }
                        }
                        Divider()
                        Button(role: .destructive, action: onClearRecent) {
                            Label(lang.tr("recent_files_clear"), systemImage: "trash")
                        }
                    }
                } label: {
                    Label(lang.tr("recent_files_menu"), systemImage: "clock")
                }
                Divider()
                Button(action: onSave) {
                    Label(lang.tr("menu_save"), systemImage: "arrow.down.doc")
                }
                Button(action: onSaveAs) {
                    Label(lang.tr("menu_save_as"), systemImage: "square.and.arrow.up")
                }
                #if canImport(UIKit)
                if let onPrint {
                    Divider()
                    Button(action: onPrint) {
                        Label(lang.tr("menu_print"), systemImage: "printer")
                    }
                }
                #endif
            } label: {
                Label(lang.tr("menu_file"), systemImage: "folder")
                    .foregroundStyle(isSimulationMode ? .tertiary : .primary)
            }
            .disabledAndDimmed(isSimulationMode)
        }
        #if canImport(UIKit)
        ToolbarItemGroup(placement: .keyboard) {
            Spacer()
            Button(lang.tr("about_done")) {
                onKeyboardDismiss()
            }
        }
        #endif
    }
}
