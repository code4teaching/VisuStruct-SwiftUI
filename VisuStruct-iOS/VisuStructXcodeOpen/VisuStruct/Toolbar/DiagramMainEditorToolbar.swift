import SwiftUI

/// Hauptfenster-Toolbar: Titel, Undo/Redo, Datei-Menü (inkl. Teilen/Export und Info), Palette (iPhone), Tastatur „Fertig“.
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
    let isPhone: Bool
    let onTogglePalettePhone: () -> Void

    let recentFiles: [RecentVisuStructFile]
    let onOpenImporter: () -> Void
    let onPickRecent: (RecentVisuStructFile) -> Void
    let onClearRecent: () -> Void

    let onSave: () -> Void
    let onSaveAs: () -> Void

    /// Nur unter UIKit (Druck); sonst `nil` und kein Eintrag.
    let onPrint: (() -> Void)?

    let onSharePNG: () -> Void
    let onShareDocument: () -> Void
    let onExportPDF: () -> Void
    /// Nur solange der Kurs angeboten wird (`CoursePurchaseGate.isOffered`); sonst `nil` und kein Eintrag.
    let onShowCourse: (() -> Void)?
    let onShowAbout: () -> Void

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
            if isPhone {
                Button(action: onTogglePalettePhone) {
                    Label(lang.tr("palette_header"), systemImage: "square.grid.2x2")
                }
                .labelStyle(.iconOnly)
                .accessibilityLabel(lang.tr("palette_header"))
            }
            Menu {
                Button(action: onOpenImporter) {
                    Label(lang.tr("menu_open"), systemImage: "square.and.arrow.down")
                }
                .disabled(isSimulationMode)
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
                .disabled(isSimulationMode)
                Divider()
                Group {
                    Button(action: onSave) {
                        Label(lang.tr("menu_save"), systemImage: "arrow.down.doc")
                    }
                    Button(action: onSaveAs) {
                        Label(lang.tr("menu_save_as"), systemImage: "square.and.arrow.up")
                    }
                }
                .disabled(isSimulationMode)
                Section {
                    Button(action: onShareDocument) {
                        Label(lang.tr("action_share_document"), systemImage: "square.and.arrow.up.on.square")
                    }
                    Button(action: onSharePNG) {
                        Label(lang.tr("action_share_png"), systemImage: "photo")
                    }
                    Button(action: onExportPDF) {
                        Label(lang.tr("action_export_pdf"), systemImage: "doc.text.magnifyingglass")
                    }
                    #if canImport(UIKit)
                    if let onPrint {
                        Button(action: onPrint) {
                            Label(lang.tr("menu_print"), systemImage: "printer")
                        }
                    }
                    #endif
                }
                .disabled(isSimulationMode)
                Divider()
                if let onShowCourse {
                    Button(action: onShowCourse) {
                        Label(lang.tr("course_title"), systemImage: "graduationcap")
                    }
                }
                Button(action: onShowAbout) {
                    Label(lang.tr("action_about"), systemImage: "info.circle")
                }
            } label: {
                Label(lang.tr("menu_file"), systemImage: "folder")
            }
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
