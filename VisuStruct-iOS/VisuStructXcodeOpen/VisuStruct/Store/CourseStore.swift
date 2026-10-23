import Foundation
import StoreKit

// MARK: - Kurs-Kauf (StoreKit 2)

/// Freischaltung des Kurses (Lernbereich) über einen einmaligen In-App-Kauf.
/// Editor, Simulation und Code bleiben frei; nur der Kurs kostet.
enum CoursePurchaseGate {
    /// Produkt in App Store Connect: nicht verbrauchbar, Familienfreigabe an.
    static let productID = "org.visustruct.VisuStruct.kurs"

    /// „Lernen & Programmieren“ und „Kurs“ anzeigen (geplant für Version 2.0). Bis App Store Connect eingerichtet ist,
    /// nur in Debug-Builds (Test in Xcode); für die Veröffentlichung hier `true` zurückgeben.
    static var isOffered: Bool {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }
}

/// Kennt den Kaufstatus und hört auf neue Transaktionen (Kauf auf anderem Gerät, Familienfreigabe, Erstattung).
@MainActor
final class CourseStore: ObservableObject {
    static let shared = CourseStore()

    /// Letzter bekannter Status, damit der Kurs auch offline sofort frei ist.
    private static let cacheKey = "visustruct.course.unlocked"

    @Published private(set) var isUnlocked: Bool
    @Published private(set) var isRestoring = false
    @Published var restoreMessage: String?

    private var updatesTask: Task<Void, Never>?

    private init() {
        isUnlocked = UserDefaults.standard.bool(forKey: Self.cacheKey)
    }

    /// Beim App-Start einmal aufrufen.
    func start() {
        guard updatesTask == nil else { return }
        updatesTask = Task { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let transaction) = result {
                    await transaction.finish()
                }
                await self?.refresh()
            }
        }
        Task { await refresh() }
    }

    /// Liest die aktuellen Berechtigungen (ohne Anmeldung, ohne Dialog).
    func refresh() async {
        var unlocked = false
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result,
                  transaction.productID == CoursePurchaseGate.productID,
                  transaction.revocationDate == nil else { continue }
            unlocked = true
        }
        setUnlocked(unlocked)
    }

    /// „Käufe wiederherstellen“: gleicht mit dem App Store ab (kann nach dem Apple-Account fragen).
    func restore(language lang: AppLanguage) async {
        isRestoring = true
        defer { isRestoring = false }
        do {
            try await AppStore.sync()
            await refresh()
            restoreMessage = lang.tr(isUnlocked ? "course_restore_done" : "course_restore_none")
        } catch {
            restoreMessage = error.localizedDescription
        }
    }

    private func setUnlocked(_ value: Bool) {
        if isUnlocked != value { isUnlocked = value }
        UserDefaults.standard.set(value, forKey: Self.cacheKey)
    }
}
