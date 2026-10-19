import SwiftUI

/// In-App-Sprache inkl. Java-Desktop-Preset („Java (Default)“: Schlüsselwörter wie `if` / `while` / `selector` …).
enum AppLanguage: String, CaseIterable, Identifiable {
    case german = "de"
    case english = "en"
    case spanish = "es"
    case french = "fr"
    case italian = "it"
    case polish = "pl"
    case turkish = "tr"
    case korean = "ko"
    case japanese = "ja"
    case greek = "el"
    case ukrainian = "uk"
    case arabic = "ar"
    case russian = "ru"
    case hebrew = "he"
    case dutch = "nl"
    case swedish = "sv"
    case danish = "da"
    case norwegianBokmal = "nb"
    /// 中文（简体）— BCP‑47: zh-Hans (`zh-Hans.lproj`)
    case chineseSimplified = "zh-Hans"
    /// 中文（繁體）— BCP‑47: zh-Hant (`zh-Hant.lproj`)
    case chineseTraditional = "zh-Hant"
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

    /// Übersetzung zu `key`; fehlt sie in dieser Sprache, der englische Text (nie der Schlüssel selbst).
    func tr(_ key: String) -> String {
        let text: String
        if self == .javaLike {
            text = NSLocalizedString(key, tableName: Self.javaStringsTable, bundle: Bundle.main, value: key, comment: "")
        } else {
            text = NSLocalizedString(key, tableName: nil, bundle: bundle, value: key, comment: "")
        }
        if text == key, self != .english {
            return AppLanguage.english.tr(key)
        }
        return text
    }

    /// Sprache des Geräts (bzw. die für VisuStruct in den Systemeinstellungen gewählte), sofern die App sie anbietet; sonst Englisch.
    static var deviceDefault: AppLanguage {
        for code in Bundle.main.preferredLocalizations {
            if let lang = AppLanguage(rawValue: code), lang != .javaLike { return lang }
        }
        return .english
    }

    /// Erster Start ohne gespeicherte Sprache: Gerätesprache übernehmen, damit auch die Systemeinstellungen sie anzeigen.
    static func storeDeviceDefaultIfNeeded() {
        guard UserDefaults.standard.string(forKey: storageKey) == nil else { return }
        UserDefaults.standard.set(deviceDefault.rawValue, forKey: storageKey)
    }

    /// Für `ContentView.init`, bevor `Environment` steht.
    static func currentFromDefaults() -> AppLanguage {
        let code = UserDefaults.standard.string(forKey: storageKey) ?? AppLanguage.deviceDefault.rawValue
        return AppLanguage(rawValue: code) ?? .english
    }
}

private struct AppLanguageKey: EnvironmentKey {
    static let defaultValue = AppLanguage.english
}

extension EnvironmentValues {
    var appLanguage: AppLanguage {
        get { self[AppLanguageKey.self] }
        set { self[AppLanguageKey.self] = newValue }
    }
}
