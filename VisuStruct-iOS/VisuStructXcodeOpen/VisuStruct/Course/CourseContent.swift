import Foundation
import VisuStructCore

// MARK: - Kursinhalt (aus `Course/Content/course-<Sprache>.json`)

/// Lektionen und Aufgaben einer Sprache. Die Dateien erzeugt `npm run build:course` in `web/` aus `web/lessons`
/// mit demselben Parser wie die Web-App; der Markdown-Text ist dort schon in einfache Blöcke zerlegt.
struct CourseContent: Decodable {
    let language: String
    /// Texte der Lern-Oberfläche (`web_learn_*` ohne Vorsilbe, dazu `app_*`).
    let strings: [String: String]
    let lessons: [CourseLesson]
    let tasks: [CourseTask]
    /// `.visustruct`-XML nach Dateiname (schon in der richtigen Sprache).
    let diagrams: [String: String]
    let images: [String: CourseImage]

    func t(_ key: String) -> String {
        strings[key] ?? key
    }

    func t(_ key: String, _ args: CVarArg...) -> String {
        String(format: t(key), locale: Locale(identifier: language), arguments: args)
    }

    func diagram(_ file: String) -> VisuStructDocument? {
        guard let xml = diagrams[file] else { return nil }
        return try? VisuStructXMLCodec.decode(data: Data(xml.utf8))
    }

    /// Startdiagramm der Übung, sonst ein leeres.
    func startDocument(for exercise: CourseExercise) -> VisuStructDocument {
        var doc = exercise.start.flatMap(diagram) ?? VisuStructDocumentEditing.newEmpty()
        if doc.caption.isEmpty { doc.caption = exercise.title }
        return doc
    }
}

struct CourseLesson: Decodable, Identifiable {
    let id: String
    let number: Int
    let title: String
    let section: String
    let summary: String
    let steps: [CourseStep]
}

struct CourseStep: Decodable {
    let title: String
    let blocks: [CourseBlock]
}

struct CourseTask: Decodable, Identifiable {
    let id: String
    let title: String
    /// Lektion, die man vorher abgeschlossen haben sollte.
    let after: Int?
    let level: Int
    let blocks: [CourseBlock]
}

struct CourseImage: Decodable {
    let svg: String?
    let base64: String?
    let width: Double?
    let height: Double?
}

struct CourseExercise: Decodable, Identifiable {
    struct Test: Decodable {
        struct ExpectedFile: Decodable {
            let name: String
            let lines: [String]
        }

        let inputs: [String]
        let expected: [String]
        let files: [ExpectedFile]?
    }

    let id: String
    let title: String
    let task: [CourseBlock]
    let start: String?
    let tests: [Test]
    let requires: [String]
    let hints: [String]
    /// Musterlösung: nicht sichtbar, nur um zu prüfen, ob die Swift-Simulation die Übung schon kann.
    let solution: String?
    let subprograms: [String]?
    /// Wird in Java gelöst (nur auf visustruct.org).
    let java: Bool?
}

struct CourseChecklistItem: Decodable {
    let text: String
    /// Schritt, in dem der Punkt erklärt wird.
    let step: Int?
}

struct CourseQuizQuestion: Decodable {
    struct Option: Decodable {
        let text: String
        let correct: Bool
    }

    struct Pair: Decodable {
        let left: String
        let right: String
    }

    let question: String
    let options: [Option]
    let pairs: [Pair]?
    let explanation: String?
}

indirect enum CourseBlock: Decodable {
    case paragraph(String)
    case heading(String)
    case list(ordered: Bool, items: [String])
    case code(String)
    case note([CourseBlock])
    case table(head: [String], rows: [[String]])
    case diagram(file: String, caption: String)
    case exercise(CourseExercise)
    case checklist([CourseChecklistItem])
    case quiz([CourseQuizQuestion])
    case brag(tip: Bool, blocks: [CourseBlock])
    case images(files: [String], caption: String)
    case textFile(name: String, content: String)
    case caesar
    case game
    /// Neuere Blockart, die diese App-Version noch nicht kennt.
    case unknown

    private enum CodingKeys: String, CodingKey {
        case type, text, ordered, items, blocks, head, rows, file, caption, exercise, questions, tip, files, name, content
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        switch try c.decode(String.self, forKey: .type) {
        case "paragraph": self = .paragraph(try c.decode(String.self, forKey: .text))
        case "heading": self = .heading(try c.decode(String.self, forKey: .text))
        case "list": self = .list(ordered: try c.decode(Bool.self, forKey: .ordered), items: try c.decode([String].self, forKey: .items))
        case "code": self = .code(try c.decode(String.self, forKey: .text))
        case "note": self = .note(try c.decode([CourseBlock].self, forKey: .blocks))
        case "table": self = .table(head: try c.decode([String].self, forKey: .head), rows: try c.decode([[String]].self, forKey: .rows))
        case "diagram": self = .diagram(file: try c.decode(String.self, forKey: .file), caption: try c.decode(String.self, forKey: .caption))
        case "exercise": self = .exercise(try c.decode(CourseExercise.self, forKey: .exercise))
        case "checklist": self = .checklist(try c.decode([CourseChecklistItem].self, forKey: .items))
        case "quiz": self = .quiz(try c.decode([CourseQuizQuestion].self, forKey: .questions))
        case "brag":
            self = .brag(tip: try c.decodeIfPresent(Bool.self, forKey: .tip) ?? false, blocks: try c.decode([CourseBlock].self, forKey: .blocks))
        case "images": self = .images(files: try c.decode([String].self, forKey: .files), caption: try c.decode(String.self, forKey: .caption))
        case "textFile": self = .textFile(name: try c.decode(String.self, forKey: .name), content: try c.decode(String.self, forKey: .content))
        case "caesar": self = .caesar
        case "game": self = .game
        default: self = .unknown
        }
    }
}

// MARK: - Laden

@MainActor
enum CourseLibrary {
    private static var cache: [String: CourseContent] = [:]

    /// Deutsch für Deutsch, Portugiesisch für Portugiesisch, sonst Englisch (wie im Web).
    static func contentLanguage(for lang: AppLanguage) -> String {
        switch lang {
        case .german: return "de"
        case .portuguesePortugal: return "pt"
        default: return "en"
        }
    }

    static func content(for lang: AppLanguage) -> CourseContent? {
        let code = contentLanguage(for: lang)
        if let cached = cache[code] { return cached }
        guard let url = Bundle.main.url(forResource: "course-\(code)", withExtension: "json"),
              let data = try? Data(contentsOf: url) else { return nil }
        do {
            let content = try JSONDecoder().decode(CourseContent.self, from: data)
            cache[code] = content
            return content
        } catch {
            assertionFailure("Kurs \(code) nicht lesbar: \(error)")
            return nil
        }
    }

    /// Lektion 1 bis 3 sind frei, der Rest gehört zum Kurs.
    static let freeLessonCount = 3

    static func isLocked(lesson: CourseLesson, unlocked: Bool) -> Bool {
        !unlocked && lesson.number > freeLessonCount
    }

    static func isLocked(task: CourseTask, unlocked: Bool) -> Bool {
        !unlocked && (task.after ?? 0) > freeLessonCount
    }
}

// MARK: - Was die App schon prüfen kann

@MainActor
enum CourseExerciseSupport {
    enum Status {
        case checkable
        case java
        case notYet
    }

    private static var cache: [String: Status] = [:]

    /// Prüfbar, wenn die Swift-Simulation die Musterlösung besteht. So werden mit jeder besseren Simulation mehr Übungen prüfbar.
    static func status(of exercise: CourseExercise, in content: CourseContent) -> Status {
        let key = "\(content.language)/\(exercise.id)"
        if let cached = cache[key] { return cached }
        let status: Status
        if exercise.java == true {
            status = .java
        } else if exercise.tests.contains(where: { $0.files != nil }) {
            status = .notYet
        } else if let file = exercise.solution, let solution = content.diagram(file) {
            var subprograms: [String: VisuStructDocument] = [:]
            for subFile in exercise.subprograms ?? [] {
                guard let sub = content.diagram(subFile) else { continue }
                for name in [sub.caption, subFile.replacingOccurrences(of: ".visustruct", with: "")] {
                    let k = VisuStructSimulationEngine.subprogramKey(name)
                    if !k.isEmpty, subprograms[k] == nil { subprograms[k] = sub }
                }
            }
            let outcomes = VisuStructExerciseCheck.check(solution, tests: exercise.checkTests, subprograms: subprograms)
            status = outcomes.allSatisfy(\.passed) ? .checkable : .notYet
        } else {
            status = .checkable
        }
        cache[key] = status
        return status
    }
}

extension CourseExercise {
    var checkTests: [VisuStructExerciseCheck.Test] {
        tests.map { .init(inputs: $0.inputs, expected: $0.expected) }
    }
}
