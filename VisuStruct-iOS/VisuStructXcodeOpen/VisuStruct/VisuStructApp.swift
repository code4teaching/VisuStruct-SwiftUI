import SwiftUI

@main
struct VisuStructApp: App {
    // Hinweis: Kein `UITextField.appearance().smartQuotesType` / `UITextView.appearance()` hier —
    // unter SwiftUI kann das zu Laufzeitfehlern führen („setSmartQuotesType: … off the main thread“ / UIKit-Assertion).
    // Gerade Anführungszeichen im Diagramm erreichen wir mit `Text(verbatim:)` im Canvas; Eingaben ggf. Systemeinstellung.

    var body: some Scene {
        WindowGroup {
            AppRootView()
        }
    }
}

/// Synchronisiert `appLanguage` mit `UserDefaults`, wenn die App nach einem Besuch in den Systemeinstellungen wieder aktiv wird.
private struct AppRootView: View {
    @AppStorage(AppLanguage.storageKey) private var languageCode: String = AppLanguage.javaLike.rawValue
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        ContentView()
            .environment(\.appLanguage, AppLanguage(rawValue: languageCode) ?? .javaLike)
            .onChange(of: scenePhase) { _, phase in
                guard phase == .active else { return }
                let fromDefaults = UserDefaults.standard.string(forKey: AppLanguage.storageKey) ?? AppLanguage.javaLike.rawValue
                if fromDefaults != languageCode {
                    languageCode = fromDefaults
                }
            }
    }
}
