import Foundation

/// Vier Stufen für Struktogramm und unteren Textbereich.
enum VisuStructUIScaleStep: String, CaseIterable, Identifiable {
    case small
    case medium
    case large
    case extraLarge

    var id: String { rawValue }

    /// Relativ zur bisherigen Standardgröße („small“ = 1). Stufen stärker auseinander als früher.
    var multiplier: Double {
        switch self {
        case .small: 1
        case .medium: 1.22
        case .large: 1.5
        case .extraLarge: 1.82
        }
    }

    var localizationKey: String {
        switch self {
        case .small: "settings_ui_scale_small"
        case .medium: "settings_ui_scale_medium"
        case .large: "settings_ui_scale_large"
        case .extraLarge: "settings_ui_scale_extra_large"
        }
    }

    static let appStorageKeyCanvas = "visustruct.ui.scale.canvas"
    static let appStorageKeyInspector = "visustruct.ui.scale.inspector"
}
