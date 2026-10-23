import SwiftUI
import UIKit
import VisuStructCore
import WebKit

// MARK: - Inline-Markdown

/// Absatz mit **fett**, *kursiv*, `Code` und Links (der Rest ist schon beim Export zerlegt).
struct LearnInlineText: View {
    let markdown: String
    var font: Font = .body

    var body: some View {
        Text(Self.attributed(markdown))
            .font(font)
            .fixedSize(horizontal: false, vertical: true)
            .frame(maxWidth: .infinity, alignment: .leading)
            .textSelection(.enabled)
    }

    static func attributed(_ markdown: String) -> AttributedString {
        let options = AttributedString.MarkdownParsingOptions(interpretedSyntax: .inlineOnlyPreservingWhitespace)
        return (try? AttributedString(markdown: markdown, options: options)) ?? AttributedString(markdown)
    }
}

// MARK: - Blöcke

/// Was die Blöcke von außen brauchen: Inhalt, Fortschritt, Editor.
struct LearnBlockContext {
    let content: CourseContent
    let host: LearnHost
    /// Lektion, zu der Quiz und Checkliste ihren Stand speichern (bei Aufgaben `nil`).
    let lessonID: String?
    /// Eindeutiger Schlüssel des Blocks in der Lektion (für Quiz und Checkliste, wie im Web).
    let key: String
    /// Zu einem Schritt springen (Checkliste „Nachlesen“).
    var goToStep: ((Int) -> Void)?
}

struct LearnBlockView: View {
    let block: CourseBlock
    let context: LearnBlockContext

    var body: some View {
        switch block {
        case .paragraph(let text):
            LearnInlineText(markdown: text)
        case .heading(let text):
            LearnInlineText(markdown: text, font: .headline)
                .padding(.top, 4)
        case .list(let ordered, let items):
            VStack(alignment: .leading, spacing: 6) {
                ForEach(Array(items.enumerated()), id: \.offset) { index, item in
                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                        Text(ordered ? "\(index + 1)." : "•")
                            .foregroundStyle(.secondary)
                            .monospacedDigit()
                        LearnInlineText(markdown: item)
                    }
                }
            }
        case .code(let text):
            LearnCodeBox(text: text)
        case .note(let blocks):
            VStack(alignment: .leading, spacing: 8) {
                ForEach(Array(blocks.enumerated()), id: \.offset) { index, inner in
                    LearnBlockView(block: inner, context: context.nested("n\(index)"))
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.accentColor.opacity(0.08), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
            .overlay(alignment: .leading) {
                Rectangle().fill(Color.accentColor.opacity(0.6)).frame(width: 3)
            }
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        case .table(let head, let rows):
            LearnTableView(head: head, rows: rows)
        case .diagram(let file, let caption):
            LearnDiagramView(file: file, caption: caption, context: context)
        case .exercise(let exercise):
            LearnExerciseCard(exercise: exercise, context: context)
        case .checklist(let items):
            LearnChecklistView(items: items, context: context)
        case .quiz(let questions):
            LearnQuizView(questions: questions, context: context)
        case .brag(let tip, let blocks):
            LearnBragView(tip: tip, blocks: blocks, context: context)
        case .images(let files, let caption):
            LearnImagesView(files: files, caption: caption, content: context.content)
        case .textFile(let name, let text):
            VStack(alignment: .leading, spacing: 4) {
                Label("\(context.content.t("app_file")): \(name)", systemImage: "doc.text")
                    .font(.subheadline.weight(.semibold))
                LearnCodeBox(text: text)
            }
        case .caesar:
            LearnWebOnlyNote(text: context.content.t("app_caesar"))
        case .game:
            LearnWebOnlyNote(text: context.content.t("app_game"))
        case .unknown:
            EmptyView()
        }
    }
}

extension LearnBlockContext {
    func nested(_ suffix: String) -> LearnBlockContext {
        LearnBlockContext(content: content, host: host, lessonID: lessonID, key: "\(key)-\(suffix)", goToStep: goToStep)
    }
}

struct LearnCodeBox: View {
    let text: String

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            Text(verbatim: text)
                .font(.system(.callout, design: .monospaced))
                .textSelection(.enabled)
                .padding(10)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
        .environment(\.layoutDirection, .leftToRight)
    }
}

struct LearnWebOnlyNote: View {
    let text: String

    var body: some View {
        Label {
            Text(text).fixedSize(horizontal: false, vertical: true)
        } icon: {
            Image(systemName: "globe")
        }
        .font(.callout)
        .foregroundStyle(.secondary)
        .padding(10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
}

struct LearnTableView: View {
    let head: [String]
    let rows: [[String]]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            Grid(alignment: .leading, horizontalSpacing: 14, verticalSpacing: 6) {
                GridRow {
                    ForEach(Array(head.enumerated()), id: \.offset) { _, cell in
                        Text(LearnInlineText.attributed(cell)).font(.subheadline.weight(.semibold))
                    }
                }
                Divider()
                ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                    GridRow {
                        ForEach(Array(row.enumerated()), id: \.offset) { _, cell in
                            Text(LearnInlineText.attributed(cell)).font(.subheadline)
                        }
                    }
                }
            }
            .padding(10)
        }
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
}

// MARK: - Ludwig

struct LearnBragView: View {
    let tip: Bool
    let blocks: [CourseBlock]
    let context: LearnBlockContext

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(context.content.t(tip ? "ludwig_tip" : "brag"), systemImage: tip ? "lightbulb" : "sparkles")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.orange)
            ForEach(Array(blocks.enumerated()), id: \.offset) { index, inner in
                LearnBlockView(block: inner, context: context.nested("b\(index)"))
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.orange.opacity(0.1), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
    }
}

// MARK: - Diagramm

struct LearnDiagramView: View {
    let file: String
    let caption: String
    let context: LearnBlockContext

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let doc = context.content.diagram(file) {
                LearnDiagramPreview(document: doc)
                Button {
                    context.host.openDiagram(doc, file.replacingOccurrences(of: ".visustruct", with: ""))
                } label: {
                    Label(context.content.t("open_in_editor"), systemImage: "square.and.pencil")
                }
                .buttonStyle(.bordered)
            }
            if !caption.isEmpty {
                LearnInlineText(markdown: caption, font: .callout)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

/// Vorschau eines Diagramms als Bild (gleiche Darstellung wie der Export).
struct LearnDiagramPreview: View {
    @Environment(\.appLanguage) private var lang
    @Environment(\.displayScale) private var displayScale
    let document: VisuStructDocument
    @State private var image: UIImage?

    var body: some View {
        Group {
            if let image {
                ScrollView(.horizontal, showsIndicators: true) {
                    Image(uiImage: image)
                        .resizable()
                        .interpolation(.high)
                        .frame(width: image.size.width * 0.8, height: image.size.height * 0.8)
                }
                .environment(\.layoutDirection, .leftToRight)
            } else {
                Color(white: 0.98).frame(height: 120)
            }
        }
        .background(Color(white: 0.98), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 8, style: .continuous).strokeBorder(Color.primary.opacity(0.08))
        }
        .task(id: VisuStructXMLCodec.encode(document)) {
            image = DiagramSnapshotExport.renderedDiagramUIImage(
                document: document,
                horizontalSizeClass: .regular,
                canvasScaleStep: .small,
                lang: lang,
                displayScale: displayScale
            )
        }
    }
}

// MARK: - Bilder und Grafiken

struct LearnImagesView: View {
    let files: [String]
    let caption: String
    let content: CourseContent

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ForEach(files, id: \.self) { file in
                if let image = content.images[file] {
                    LearnImageView(image: image)
                }
            }
            if !caption.isEmpty {
                LearnInlineText(markdown: caption, font: .callout)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

struct LearnImageView: View {
    let image: CourseImage

    var body: some View {
        if let svg = image.svg {
            let ratio = (image.width ?? 4) / max(1, image.height ?? 3)
            LearnSVGView(svg: svg)
                .aspectRatio(ratio, contentMode: .fit)
                .frame(maxWidth: min(560, image.width ?? 560))
                .background(Color.white, in: RoundedRectangle(cornerRadius: 8, style: .continuous))
                .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
        } else if let base64 = image.base64, let data = Data(base64Encoded: base64), let ui = UIImage(data: data) {
            Image(uiImage: ui)
                .resizable()
                .scaledToFit()
                .frame(maxWidth: 360)
                .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
        }
    }
}

/// SVG-Grafik der Lektionen. SwiftUI zeigt SVG-Daten nicht direkt an, darum eine kleine WebView ohne Scrollen.
struct LearnSVGView: UIViewRepresentable {
    let svg: String

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .nonPersistent()
        let view = WKWebView(frame: .zero, configuration: configuration)
        view.isOpaque = false
        view.backgroundColor = .clear
        view.scrollView.isScrollEnabled = false
        view.scrollView.backgroundColor = .clear
        view.isUserInteractionEnabled = false
        return view
    }

    func updateUIView(_ view: WKWebView, context: Context) {
        guard context.coordinator.loaded != svg else { return }
        context.coordinator.loaded = svg
        let html = """
        <!doctype html><html><head><meta charset="utf-8">\
        <meta name="viewport" content="width=device-width, initial-scale=1">\
        <style>html,body{margin:0;padding:0;background:transparent}svg{display:block;width:100%;height:auto}</style>\
        </head><body>\(svg)</body></html>
        """
        view.loadHTMLString(html, baseURL: nil)
    }

    func makeCoordinator() -> Coordinator { Coordinator() }

    final class Coordinator {
        var loaded: String?
    }
}

// MARK: - Checkliste

struct LearnChecklistView: View {
    @ObservedObject private var progress = CourseProgress.shared
    let items: [CourseChecklistItem]
    let context: LearnBlockContext

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ForEach(Array(items.enumerated()), id: \.offset) { index, item in
                let id = "\(context.key)-\(index)"
                HStack(alignment: .firstTextBaseline, spacing: 10) {
                    Button {
                        guard let lesson = context.lessonID else { return }
                        progress.updateLesson(lesson) { $0.checks[id] = !($0.checks[id] ?? false) }
                    } label: {
                        Image(systemName: isChecked(id) ? "checkmark.square.fill" : "square")
                            .foregroundStyle(isChecked(id) ? Color.accentColor : Color.secondary)
                    }
                    .buttonStyle(.plain)
                    LearnInlineText(markdown: item.text)
                    if let step = item.step, let goToStep = context.goToStep {
                        Button(context.content.t("review")) { goToStep(step) }
                            .font(.caption)
                            .buttonStyle(.borderless)
                    }
                }
            }
        }
        .padding(12)
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
    }

    private func isChecked(_ id: String) -> Bool {
        guard let lesson = context.lessonID else { return false }
        return progress.lesson(lesson).checks[id] ?? false
    }
}

// MARK: - Quiz

struct LearnQuizView: View {
    @ObservedObject private var progress = CourseProgress.shared
    let questions: [CourseQuizQuestion]
    let context: LearnBlockContext
    /// Ohne Lektion (Aufgaben) bleiben die Antworten nur in der Ansicht.
    @State private var localAnswers: [String: Int] = [:]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            ForEach(Array(questions.enumerated()), id: \.offset) { qi, question in
                VStack(alignment: .leading, spacing: 8) {
                    LearnInlineText(markdown: question.question, font: .body.weight(.semibold))
                    if let pairs = question.pairs {
                        matchQuestion(question, pairs: pairs, id: "\(context.key)-\(qi)")
                    } else {
                        choiceQuestion(question, id: "\(context.key)-\(qi)")
                    }
                }
            }
            if let score {
                Text(score).font(.callout.weight(.semibold))
            }
        }
        .padding(12)
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
    }

    private func answer(_ id: String) -> Int? {
        if let lesson = context.lessonID { return progress.lesson(lesson).quiz[id] }
        return localAnswers[id]
    }

    private func setAnswer(_ id: String, _ value: Int) {
        if let lesson = context.lessonID {
            progress.updateLesson(lesson) { $0.quiz[id] = value }
        } else {
            localAnswers[id] = value
        }
    }

    @ViewBuilder
    private func choiceQuestion(_ question: CourseQuizQuestion, id: String) -> some View {
        let chosen = answer(id)
        ForEach(Array(question.options.enumerated()), id: \.offset) { oi, option in
            Button {
                setAnswer(id, oi)
            } label: {
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Image(systemName: symbol(chosen: chosen, index: oi, correct: option.correct))
                        .foregroundStyle(color(chosen: chosen, index: oi, correct: option.correct))
                    Text(LearnInlineText.attributed(option.text))
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(8)
                .background(Color(.systemBackground), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
            }
            .buttonStyle(.plain)
        }
        if chosen != nil, let explanation = question.explanation, !explanation.isEmpty {
            LearnInlineText(markdown: explanation, font: .callout)
                .foregroundStyle(.secondary)
        }
    }

    private func symbol(chosen: Int?, index: Int, correct: Bool) -> String {
        guard let chosen else { return "circle" }
        if correct { return "checkmark.circle.fill" }
        return chosen == index ? "xmark.circle.fill" : "circle"
    }

    private func color(chosen: Int?, index: Int, correct: Bool) -> Color {
        guard chosen != nil else { return .secondary }
        if correct { return .green }
        return chosen == index ? .red : .secondary
    }

    /// Rechte Seiten in fester, sortierter Reihenfolge (die Auswahl speichert den Index darin, wie im Web).
    private func rights(_ pairs: [CourseQuizQuestion.Pair]) -> [String] {
        pairs.map(\.right).sorted()
    }

    @ViewBuilder
    private func matchQuestion(_ question: CourseQuizQuestion, pairs: [CourseQuizQuestion.Pair], id: String) -> some View {
        let options = rights(pairs)
        ForEach(Array(pairs.enumerated()), id: \.offset) { pi, pair in
            let pick = answer("\(id)-\(pi)")
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Text(LearnInlineText.attributed(pair.left))
                    .frame(maxWidth: .infinity, alignment: .leading)
                Menu {
                    ForEach(Array(options.enumerated()), id: \.offset) { ri, right in
                        Button(right) { setAnswer("\(id)-\(pi)", ri) }
                    }
                } label: {
                    Text(pick.map { options[$0] } ?? "…")
                        .lineLimit(2)
                }
                .menuStyle(.button)
                .buttonStyle(.bordered)
                if let pick {
                    Image(systemName: options[pick] == pair.right ? "checkmark.circle.fill" : "xmark.circle.fill")
                        .foregroundStyle(options[pick] == pair.right ? .green : .red)
                }
            }
        }
        if pairs.indices.allSatisfy({ answer("\(id)-\($0)") != nil }), let explanation = question.explanation, !explanation.isEmpty {
            LearnInlineText(markdown: explanation, font: .callout)
                .foregroundStyle(.secondary)
        }
    }

    private var score: String? {
        var right = 0
        for (qi, question) in questions.enumerated() {
            let id = "\(context.key)-\(qi)"
            if let pairs = question.pairs {
                let options = rights(pairs)
                let picks = pairs.indices.map { answer("\(id)-\($0)") }
                if picks.contains(where: { $0 == nil }) { return nil }
                if zip(picks, pairs).allSatisfy({ pick, pair in options[pick!] == pair.right }) { right += 1 }
            } else {
                guard let chosen = answer(id) else { return nil }
                if question.options.indices.contains(chosen), question.options[chosen].correct { right += 1 }
            }
        }
        return context.content.t("score_fmt", right, questions.count)
    }
}
