import SwiftUI

/// Horizontale Leiste mit Diagramm-Reitern und „+“. Auswahl und Schließen werden über Callbacks an `ContentView` gebunden.
struct DiagramTabStrip: View {
    @Environment(\.appLanguage) private var lang

    let tabs: [DiagramSheetTab]
    let selectedTabId: UUID
    let displayTitle: (DiagramSheetTab) -> String
    let hasUnsavedChanges: (DiagramSheetTab) -> Bool
    let onSelectTab: (UUID) -> Void
    let onAddTab: () -> Void
    let onRequestCloseTab: (UUID) -> Void

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(tabs) { tab in
                    DiagramTabStripPill(
                        displayTitle: displayTitle(tab),
                        isSelected: tab.id == selectedTabId,
                        showsUnsavedDot: hasUnsavedChanges(tab),
                        accessibilityLabel: accessibilityLabel(for: tab),
                        showsCloseButton: tabs.count > 1,
                        onSelect: { onSelectTab(tab.id) },
                        onClose: { onRequestCloseTab(tab.id) }
                    )
                }
                Button(action: onAddTab) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title3)
                        .foregroundStyle(Color.accentColor)
                        .symbolRenderingMode(.hierarchical)
                }
                .buttonStyle(.borderless)
                .accessibilityLabel(lang.tr("a11y_new_diagram_tab"))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 11)
        }
        .frame(maxWidth: .infinity)
        .background(Color(.secondarySystemGroupedBackground))
    }

    private func accessibilityLabel(for tab: DiagramSheetTab) -> String {
        let t = displayTitle(tab)
        return hasUnsavedChanges(tab) ? "\(t), \(lang.tr("a11y_unsaved_changes"))" : t
    }
}

// MARK: - Einzelner Reiter

private struct DiagramTabStripPill: View {
    @Environment(\.appLanguage) private var lang

    let displayTitle: String
    let isSelected: Bool
    let showsUnsavedDot: Bool
    let accessibilityLabel: String
    let showsCloseButton: Bool
    let onSelect: () -> Void
    let onClose: () -> Void

    var body: some View {
        HStack(spacing: 2) {
            Button(action: onSelect) {
                HStack(spacing: 6) {
                    Text(verbatim: displayTitle)
                        .lineLimit(1)
                    if showsUnsavedDot {
                        Circle()
                            .fill(Color.accentColor)
                            .frame(width: 7, height: 7)
                            .accessibilityHidden(true)
                    }
                }
                .font(.subheadline.weight(isSelected ? .semibold : .regular))
                .foregroundStyle(isSelected ? Color.primary : Color.secondary)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(accessibilityLabel)
            if showsCloseButton {
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.caption)
                        .foregroundStyle(.tertiary)
                }
                .buttonStyle(.plain)
                .padding(.trailing, 6)
                .accessibilityLabel(lang.tr("a11y_close_tab"))
            }
        }
        .background(isSelected ? Color.blue.opacity(0.2) : Color(.tertiarySystemFill))
        .clipShape(Capsule())
    }
}
