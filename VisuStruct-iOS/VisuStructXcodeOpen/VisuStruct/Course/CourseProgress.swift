import Foundation

// MARK: - Lernfortschritt

/// Fortschritt im Lernbereich der App, wie `web/src/learn/progress.ts`, gespeichert in `UserDefaults`.
@MainActor
final class CourseProgress: ObservableObject {
    static let shared = CourseProgress()

    struct LessonState: Codable, Equatable {
        var step = 0
        var done = false
        var checks: [String: Bool] = [:]
        /// Gewählte Antwort je Frage („Block-Frage“ → Antwortindex bzw. Zuordnung).
        var quiz: [String: Int] = [:]
    }

    struct ExerciseState: Codable, Equatable {
        var done = false
        /// Letzter Stand des Diagramms als `.visustruct`-XML.
        var xml: String?
    }

    private struct Store: Codable {
        var lessons: [String: LessonState] = [:]
        var exercises: [String: ExerciseState] = [:]
        var openLesson: String?
        var openTask: String?
    }

    private static let key = "visustruct.learn.progress"

    private var store: Store

    private init() {
        if let data = UserDefaults.standard.data(forKey: Self.key),
           let saved = try? JSONDecoder().decode(Store.self, from: data) {
            store = saved
        } else {
            store = Store()
        }
    }

    private func save(notify: Bool = true) {
        if notify { objectWillChange.send() }
        if let data = try? JSONEncoder().encode(store) {
            UserDefaults.standard.set(data, forKey: Self.key)
        }
    }

    func lesson(_ id: String) -> LessonState {
        store.lessons[id] ?? LessonState()
    }

    func updateLesson(_ id: String, _ change: (inout LessonState) -> Void) {
        var state = lesson(id)
        change(&state)
        guard state != store.lessons[id] else { return }
        store.lessons[id] = state
        save()
    }

    func exercise(_ id: String) -> ExerciseState {
        store.exercises[id] ?? ExerciseState()
    }

    func updateExercise(_ id: String, _ change: (inout ExerciseState) -> Void) {
        var state = exercise(id)
        change(&state)
        guard state != store.exercises[id] else { return }
        store.exercises[id] = state
        save()
    }

    /// Stand des Diagramms merken, ohne die Lern-Spalte neu zu zeichnen (bei jeder Änderung im Editor).
    func saveDraft(_ id: String, xml: String) {
        guard store.exercises[id]?.xml != xml else { return }
        store.exercises[id, default: ExerciseState()].xml = xml
        save(notify: false)
    }

    func resetExercise(_ id: String) {
        store.exercises[id] = nil
        save()
    }

    /// Zuletzt geöffnete Lektion bzw. Aufgabe, damit der Lernbereich dort wieder aufgeht.
    var openLesson: String? {
        get { store.openLesson }
        set {
            store.openLesson = newValue
            save()
        }
    }

    var openTask: String? {
        get { store.openTask }
        set {
            store.openTask = newValue
            save()
        }
    }
}
