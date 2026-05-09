import SwiftUI

// MARK: - Export: Dateiname (Einstellung)

enum ExportFilenameStyle: String, CaseIterable, Identifiable {
    /// `yyyy-MM-dd-<Titel>.visustruct`
    case dateAndTitle = "dateTitle"
    /// `<Titel>.visustruct`
    case titleOnly = "titleOnly"

    var id: String { rawValue }

    static let appStorageKey = "visustruct.export.filenameStyle"

    static func fromStored(_ raw: String) -> Self {
        Self(rawValue: raw) ?? .dateAndTitle
    }
}

// MARK: - Code-Generator: Kaufzwang (IAP)

/// Wenn `true`, ist „Code erzeugen“ ohne Kauf/Freischaltung (`visustruct.codegen.unlocked`) nur ein Hinweis-Sheet.
/// Solange es noch nichts Käufliches gibt: `false` — später auf `true` stellen und StoreKit anbinden.
enum CodeGeneratorPurchaseGate {
    static let requiresPurchase = false
}

// MARK: - Simulation (Einstellungen / UserDefaults)

enum SimulationStepDelayOption: String, CaseIterable, Identifiable {
    case seconds02 = "0.2"
    case seconds05 = "0.5"
    case seconds10 = "1.0"
    case seconds15 = "1.5"
    case seconds20 = "2.0"

    var id: String { rawValue }

    static let appStorageKey = "visustruct.simulation.stepDelay"
    static let defaultRawValue = Self.seconds05.rawValue

    static func fromStored(_ raw: String) -> Self {
        Self(rawValue: raw) ?? .seconds05
    }

    var nanoseconds: UInt64 {
        switch self {
        case .seconds02: return 200_000_000
        case .seconds05: return 500_000_000
        case .seconds10: return 1_000_000_000
        case .seconds15: return 1_500_000_000
        case .seconds20: return 2_000_000_000
        }
    }
}

enum SimulationHighlightMode: String, CaseIterable, Identifiable {
    case lastExecuted
    case nextToExecute

    var id: String { rawValue }

    static let appStorageKey = "visustruct.simulation.highlightMode"
    static let defaultRawValue = Self.lastExecuted.rawValue

    static func fromStored(_ raw: String) -> Self {
        Self(rawValue: raw) ?? .lastExecuted
    }
}
