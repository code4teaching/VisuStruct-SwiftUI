import SwiftUI
import VisuStructCore

/// Palette (Strukturelemente zum Einfügen/Ziehen) und Aktionen darunter: Löschen, Simulation, Code. Teilen, Export und Info stehen im Ablage-Menü.
struct PaletteActionList: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.appLanguage) private var lang

    let isSimulationMode: Bool
    let canDeleteSelection: Bool
    let codeGeneratorAccessGranted: Bool
    let onInsertItem: (ElementPalette.PaletteItem) -> Void
    let onDeleteSelection: () -> Void
    let onToggleSimulation: () -> Void
    let onGenerateCode: () -> Void

    var body: some View {
        let isCompact = horizontalSizeClass != .regular
        List {
            Section {
                ForEach(ElementPalette.PaletteItem.paletteOrder) { item in
                    paletteStructureRow(item, isCompact: isCompact)
                }
            }
            Section {
                Button {
                    onDeleteSelection()
                } label: {
                    Label(lang.tr("action_delete_selection"), systemImage: "trash")
                }
                .buttonStyle(PaletteListElementButtonStyle(emphasis: .destructive))
                .disabledAndDimmed(isSimulationMode)
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 4, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 8, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                .disabled(isSimulationMode || !canDeleteSelection)
                Button {
                    onToggleSimulation()
                } label: {
                    Label(
                        isSimulationMode ? lang.tr("action_diagram") : lang.tr("action_simulation"),
                        systemImage: isSimulationMode ? "rectangle.split.3x1" : "play.circle"
                    )
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                .accessibilityLabel(isSimulationMode ? lang.tr("action_diagram") : lang.tr("action_simulation"))
                Button {
                    onGenerateCode()
                } label: {
                    HStack(spacing: 10) {
                        Label(lang.tr("action_generate_code"), systemImage: "chevron.left.forwardslash.chevron.right")
                            .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                        Spacer(minLength: 8)
                        if !codeGeneratorAccessGranted {
                            Image(systemName: "lock.fill")
                                .font(.body)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .disabledAndDimmed(isSimulationMode)
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                .accessibilityLabel(
                    codeGeneratorAccessGranted ? lang.tr("a11y_generate_code") : lang.tr("a11y_generate_code_locked")
                )
            }
        }
        .listStyle(.insetGrouped)
        .listSectionSpacing(isCompact ? 8 : 18)
        .environment(\.defaultMinListRowHeight, isCompact ? 34 : 48)
        .scrollContentBackground(.hidden)
    }

    @ViewBuilder
    private func paletteStructureRow(_ item: ElementPalette.PaletteItem, isCompact: Bool) -> some View {
        let rowInsets = isCompact
            ? EdgeInsets(top: 1, leading: 10, bottom: 1, trailing: 10)
            : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)

        if isSimulationMode {
            Button {
                onInsertItem(item)
            } label: {
                Label(item.localizedTitle(in: lang), systemImage: item.symbolName)
                    .foregroundStyle(.tertiary)
                    .multilineTextAlignment(.leading)
            }
            .buttonStyle(PaletteListElementButtonStyle())
            .accessibilityAddTraits(.isButton)
            .disabled(true)
            .opacity(0.55)
            .listRowInsets(rowInsets)
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
        } else {
            Button {
                onInsertItem(item)
            } label: {
                Label(item.localizedTitle(in: lang), systemImage: item.symbolName)
                    .foregroundStyle(.primary)
                    .multilineTextAlignment(.leading)
            }
            .buttonStyle(PaletteListElementButtonStyle())
            .draggable(DiagramDragPayload(raw: ElementPalette.paletteDragIdentifier(item))) {
                paletteDragPreview(for: item)
            }
            .accessibilityAddTraits(.isButton)
            .listRowInsets(rowInsets)
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
        }
    }

    // MARK: - Palette Drag-Vorschau

    @ViewBuilder
    private func paletteDragPreview(for item: ElementPalette.PaletteItem) -> some View {
        HStack(spacing: 8) {
            Image(systemName: item.symbolName)
            Text(item.localizedTitle(in: lang))
                .font(.callout.weight(.medium))
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .strokeBorder(Color.blue.opacity(0.9), lineWidth: 2)
        )
        .shadow(color: .black.opacity(0.22), radius: 8, x: 0, y: 4)
    }
}
