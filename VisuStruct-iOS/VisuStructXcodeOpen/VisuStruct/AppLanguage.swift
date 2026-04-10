import SwiftUI

/// In-App-Sprache inkl. Java-Desktop-Preset („Java (Default)“: Schlüsselwörter wie `if` / `while` / `selector` …).
enum AppLanguage: String, CaseIterable, Identifiable {
    case german = "de"
    case english = "en"
    /// Português europeu (`pt-PT.lproj`).
    case portuguesePortugal = "pt-PT"
    /// Wie VisuStruct Java: `ElementBeschriftungPresets.PRESET_ENGLISH_JAVA` + `javaStandardPaletteButtonLabel`.
    /// Speicherwert `java` ist kein BCP-47-Locale — Texte liegen in `Java.strings` (kein `java.lproj`, App-Store-konform).
    case javaLike = "java"

    var id: String { rawValue }

    static let storageKey = "appLanguageCode"

    /// Für `String(format:locale:…)` / `Locale` — `java` ist kein BCP-47-Locale.
    var localeIdentifierForFormatting: String {
        if case .javaLike = self { return "en" }
        return rawValue
    }

    /// String-Tabelle für das Java-Preset (ohne ungültiges `java.lproj`).
    private static let javaStringsTable = "Java"

    /// Bundle für `de.lproj` / `en.lproj` / `pt-PT.lproj` (Fallback: `Bundle.main`). Java-Preset: `Java.strings`.
    var bundle: Bundle {
        if self == .javaLike { return .main }
        guard let path = Bundle.main.path(forResource: rawValue, ofType: "lproj"),
              let b = Bundle(path: path) else { return .main }
        return b
    }

    func tr(_ key: String) -> String {
        if self == .javaLike {
            return NSLocalizedString(key, tableName: Self.javaStringsTable, bundle: Bundle.main, value: key, comment: "")
        }
        return NSLocalizedString(key, tableName: nil, bundle: bundle, value: key, comment: "")
    }

    /// Für `ContentView.init`, bevor `Environment` steht.
    static func currentFromDefaults() -> AppLanguage {
        let code = UserDefaults.standard.string(forKey: storageKey) ?? AppLanguage.javaLike.rawValue
        return AppLanguage(rawValue: code) ?? .javaLike
    }
}

private struct AppLanguageKey: EnvironmentKey {
    static let defaultValue = AppLanguage.javaLike
}

extension EnvironmentValues {
    var appLanguage: AppLanguage {
        get { self[AppLanguageKey.self] }
        set { self[AppLanguageKey.self] = newValue }
    }
}
