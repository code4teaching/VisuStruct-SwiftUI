import SwiftUI
import UniformTypeIdentifiers
import VisuStructCore
#if canImport(UIKit)
import UIKit
#endif

struct CodeGeneratorPaywallSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang

    var body: some View {
        NavigationStack {
            ScrollView {
                Text(lang.tr("codegen_gate_body"))
                    .font(.body)
                    .lineSpacing(5)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(24)
            }
            .navigationTitle(lang.tr("codegen_gate_title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(lang.tr("codegen_gate_ok")) { dismiss() }
                }
            }
        }
        .presentationDragIndicator(.visible)
    }
}

struct CodeGeneratorPlaceholderSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang
    @Binding var document: VisuStructDocument
    /// Wird bei jedem Tipp auf „Code erzeugen“ erhöht, damit der Text erneut aus dem aktuellen Dokument erzeugt wird.
    var regenerationToken: Int
    /// Wenn gesetzt (schwebendes Panel): schließt die äußere Präsentation statt `dismiss()`.
    var onDismissExternal: (() -> Void)? = nil
    /// `true`: kein Sheet-Ziehharmonika-Indikator (nur relevant im Vollbild-Sheet).
    var isInFloatingPanel: Bool = false

    /// Letzte Zielsprache für den Code-Generator (Java/Python/JavaScript); bleibt erhalten bis zur nächsten Umschaltung.
    @AppStorage("visustruct.codegen.target") private var codegenTarget: String = "java"
    @AppStorage("visustruct.codegen.javaOutputMode") private var javaOutputMode: String = "snippet"
    /// Wie in den iOS-Systemeinstellungen → VisuStruct (gleicher `UserDefaults`-Key).
    @AppStorage("visustruct.codegen.includeDiagramComments") private var includeDiagramComments = false
    @AppStorage("visustruct.codegen.includeEmptyElse") private var includeEmptyElse = true

    @State private var generatedCode = ""
    private static let javaTag = "java"
    private static let pythonTag = "python"
    private static let javascriptTag = "javascript"
    private static let javaSnippetTag = "snippet"
    private static let javaClassTag = "class"

    private var target: VisuStructCodeGenerator.Target {
        switch codegenTarget {
        case Self.pythonTag:
            return .python
        case Self.javascriptTag:
            return .javascript
        default:
            return .java
        }
    }

    private var codegenOptions: VisuStructCodeGenerator.Options {
        .init(
            baseIndent: 0,
            indentPerLevel: 4,
            includeDiagramTextAsComments: includeDiagramComments,
            includeEmptyElseBranch: includeEmptyElse
        )
    }

    @State private var showJavaScriptRunner = false
    @State private var javaScriptRunnerHTML = ""
    @State private var showJavaExporter = false
    @State private var javaExportDocument = JavaSourceExportDocument(source: "")
    @State private var javaExportDefaultName = "Main.java"

    private func normalizeCodegenTarget() {
        if codegenTarget != Self.javaTag,
           codegenTarget != Self.pythonTag,
           codegenTarget != Self.javascriptTag {
            codegenTarget = Self.javaTag
        }
    }

    private func normalizeJavaOutputMode() {
        if javaOutputMode != Self.javaSnippetTag,
           javaOutputMode != Self.javaClassTag {
            javaOutputMode = Self.javaSnippetTag
        }
    }

    private func refreshGeneratedCode() {
        normalizeJavaOutputMode()
        if target == .java, javaOutputMode == Self.javaClassTag {
            generatedCode = VisuStructCodeGenerator.generateJavaClassFile(
                document: document,
                options: codegenOptions,
                className: stemForJavaClassName()
            )
        } else {
            generatedCode = VisuStructCodeGenerator.generate(
                document: document,
                target: target,
                options: codegenOptions
            )
        }
    }

    private func stemForJavaClassName() -> String {
        let c = document.caption.trimmingCharacters(in: .whitespacesAndNewlines)
        if !c.isEmpty { return c }
        return "Main"
    }

    private func beginJavaExport() {
        let stem = stemForJavaClassName()
        let className = VisuStructCodeGenerator.sanitizedJavaClassName(stem)
        javaExportDocument = JavaSourceExportDocument(source: generatedCode)
        javaExportDefaultName = "\(className).java"
        showJavaExporter = true
    }

    /// Chrome für den eingebetteten JS-Runner: **Deutsch** nur bei App-Sprache Deutsch, sonst **Englisch** (alle anderen Locales / Java-Preset). Button: **Run** (einheitlich).
    private func javaScriptRunnerPageChrome() -> (htmlLang: String, title: String, heading: String, hintHTML: String) {
        if lang == .german {
            return (
                "de",
                "VisuStruct – JavaScript-Test",
                "VisuStruct – JavaScript-Test",
                #"Der Code läuft im Browser. <code>console.log</code> wird unten angezeigt. Endlosschleifen werden im Testlauf automatisch gestoppt."#
            )
        }
        return (
            "en",
            "VisuStruct – JavaScript Test",
            "VisuStruct – JavaScript Test",
            #"The code runs in the browser. <code>console.log</code> output appears below. Endless loops are stopped automatically during test runs."#
        )
    }

    private func javaScriptRunnerExecutableCode(_ js: String) -> String {
        let guardedJS = javaScriptWithEndlessLoopGuard(js)
        return javaScriptWithPromptCancelGuard(guardedJS)
    }

    private func javaScriptWithEndlessLoopGuard(_ js: String) -> String {
        let pattern = #"(?m)^(\s*)while\s*\(\s*true\s*\)(?:\s*/\*.*?\*/)?\s*\{"#
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return js }

        let ns = js as NSString
        let matches = regex.matches(in: js, range: NSRange(location: 0, length: ns.length))
        guard !matches.isEmpty else { return js }

        let stopMessage = lang == .german
            ? "Ausführung gestoppt: mögliche Endlosschleife."
            : "Execution stopped: possible endless loop."
        var result = ""
        var last = 0

        for (index, match) in matches.enumerated() {
            result += ns.substring(with: NSRange(location: last, length: match.range.location - last))
            let indent = match.numberOfRanges > 1 ? ns.substring(with: match.range(at: 1)) : ""
            result += "\(indent)for (let __visuStructLoopGuard\(index) = 0; __visuStructLoopGuard\(index) < 100000 || (() => { throw new Error(\"\(stopMessage)\"); })(); __visuStructLoopGuard\(index)++) {"
            last = match.range.location + match.range.length
        }

        result += ns.substring(from: last)
        return result
    }

    private func javaScriptWithPromptCancelGuard(_ js: String) -> String {
        guard let regex = try? NSRegularExpression(pattern: #"\bprompt\s*\("#) else { return js }
        return regex.stringByReplacingMatches(
            in: js,
            range: NSRange(location: 0, length: (js as NSString).length),
            withTemplate: "__visuStructPrompt("
        )
    }

    private func openJavaScriptRunner(_ js: String) {
        // In-App Runner (WKWebView): zuverlässiger als Safari/data: auf iOS.
        let chrome = javaScriptRunnerPageChrome()
        let runnerJS = javaScriptRunnerExecutableCode(js)
        javaScriptRunnerHTML = """
        <!doctype html>
        <html lang="\(chrome.htmlLang)">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>\(chrome.title)</title>
          <style>
            body { margin: 0; font-family: -apple-system, system-ui, sans-serif; background: #0b1220; color: #e5e7eb; }
            header { padding: 14px 16px; background: #111827; border-bottom: 1px solid rgba(255,255,255,.08); }
            h1 { margin: 0; font-size: 14px; font-weight: 700; letter-spacing: .01em; }
            main { padding: 14px 16px; display: grid; gap: 12px; }
            pre { margin: 0; padding: 12px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; overflow: auto; }
            button { padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,.12); background: rgba(59,130,246,.22); color: #fff; font-weight: 700; }
            .hint { font-size: 12px; color: rgba(229,231,235,.75); line-height: 1.45; }
          </style>
        </head>
        <body>
          <header><h1>\(chrome.heading)</h1></header>
          <main>
            <div class="hint">\(chrome.hintHTML)</div>
            <button id="run">Run</button>
            <pre id="out"></pre>
            <script>
              const out = document.getElementById('out');
              const print = (s) => { out.textContent += s + "\\n"; };
              const old = console.log;
              console.log = (...args) => { old(...args); print(args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')); };
              const __visuStructPrompt = (...args) => {
                const value = prompt(...args);
                if (value === null) { throw new Error("Execution cancelled."); }
                return value;
              };
            </script>
            <script id="usercode" type="text/plain">
        \(runnerJS)
            </script>
            <script>
              document.getElementById('run').addEventListener('click', () => {
                out.textContent = '';
                try {
                  // Re-run by evaluating the code block again
                  (0, eval)(document.getElementById('usercode').textContent);
                } catch (e) {
                  print(String(e));
                }
              });
            </script>
          </main>
        </body>
        </html>
        """
        showJavaScriptRunner = true
    }

    private func dismissPanel() {
        if let onDismissExternal {
            onDismissExternal()
        } else {
            dismiss()
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Picker("", selection: $codegenTarget) {
                        Text(lang.tr("codegen_target_java")).tag(Self.javaTag)
                        Text(lang.tr("codegen_target_python")).tag(Self.pythonTag)
                        Text(lang.tr("codegen_target_javascript")).tag(Self.javascriptTag)
                    }
                    .pickerStyle(.segmented)
                    .onAppear {
                        normalizeCodegenTarget()
                        normalizeJavaOutputMode()
                        refreshGeneratedCode()
                    }

                    if target == .java {
                        Picker(lang.tr("codegen_java_output_mode"), selection: $javaOutputMode) {
                            Text(lang.tr("codegen_java_output_snippet")).tag(Self.javaSnippetTag)
                            Text(lang.tr("codegen_java_output_class")).tag(Self.javaClassTag)
                        }
                        .pickerStyle(.segmented)
                        .accessibilityLabel(lang.tr("codegen_java_output_mode"))
                    }

                    Text(verbatim: generatedCode)
                        .font(.system(.body, design: .monospaced))
                        .textSelection(.enabled)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(Color(uiColor: .secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(24)
            }
            .navigationTitle(lang.tr("codegen_placeholder_title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                #if canImport(UIKit)
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        UIPasteboard.general.string = generatedCode
                    } label: {
                        Label(lang.tr("codegen_copy"), systemImage: "doc.on.doc")
                    }
                }
                if target == .java {
                    ToolbarItem(placement: .primaryAction) {
                        Button {
                            beginJavaExport()
                        } label: {
                            Label(lang.tr("codegen_save_java"), systemImage: "square.and.arrow.down")
                        }
                    }
                }
                if target == .javascript {
                    ToolbarItem(placement: .primaryAction) {
                        Button {
                            openJavaScriptRunner(generatedCode)
                        } label: {
                            Label(lang.tr("codegen_run_in_browser"), systemImage: "globe")
                        }
                    }
                }
                #endif
                ToolbarItem(placement: .confirmationAction) {
                    Button(lang.tr("codegen_gate_ok")) { dismissPanel() }
                }
            }
        }
        .codeGeneratorPresentationChrome(isFloatingPanel: isInFloatingPanel)
        .fileExporter(
            isPresented: $showJavaExporter,
            document: javaExportDocument,
            contentType: .plainText,
            defaultFilename: javaExportDefaultName
        ) { _ in }
        .sheet(isPresented: $showJavaScriptRunner) {
            JavaScriptRunnerSheet(html: javaScriptRunnerHTML)
        }
        .onChange(of: regenerationToken) { _, _ in
            refreshGeneratedCode()
        }
        .onChange(of: codegenTarget) { _, _ in
            normalizeCodegenTarget()
            refreshGeneratedCode()
        }
        .onChange(of: javaOutputMode) { _, _ in
            normalizeJavaOutputMode()
            refreshGeneratedCode()
        }
        .onChange(of: includeDiagramComments) { _, _ in
            refreshGeneratedCode()
        }
        .onChange(of: includeEmptyElse) { _, _ in
            refreshGeneratedCode()
        }
    }
}

struct DraggableCodeGeneratorFloatingPanel: View {
    @Environment(\.appLanguage) private var lang
    @Binding var isPresented: Bool
    @Binding var document: VisuStructDocument
    /// Bei jeder erneuten „Code erzeugen“-Aktion hochzählen — Anzeige soll den aktuellen Stand reflektieren.
    var regenerationToken: Int

    @State private var dragOffset: CGSize = .zero
    @State private var dragBase: CGSize = .zero
    @State private var isDraggingPanel = false

    private let dragBarHeight: CGFloat = 28

    var body: some View {
        GeometryReader { geo in
            let panelW = min(620, geo.size.width - 40)
            let panelH = min(geo.size.height * 0.82, geo.size.height - 48)
            let margin: CGFloat = 10
            let maxOffsetX = max(0, geo.size.width / 2 - margin - panelW / 2)
            let maxOffsetY = max(0, geo.size.height / 2 - margin - panelH / 2)

            ZStack {
                Color.black.opacity(0.22)
                    .ignoresSafeArea()
                    .contentShape(Rectangle())
                    .onTapGesture { isPresented = false }

                VStack(spacing: 0) {
                    RoundedRectangle(cornerRadius: 2.5, style: .continuous)
                        .fill(Color.secondary.opacity(0.45))
                        .frame(width: 40, height: 5)
                        .padding(.vertical, (dragBarHeight - 5) / 2)
                        .frame(maxWidth: .infinity)
                        .contentShape(Rectangle())
                        .accessibilityLabel(lang.tr("a11y_codegen_panel_drag"))
                        .gesture(
                            DragGesture()
                                .onChanged { value in
                                    let nx = dragBase.width + value.translation.width
                                    let ny = dragBase.height + value.translation.height
                                    var transaction = Transaction()
                                    transaction.animation = nil
                                    withTransaction(transaction) {
                                        isDraggingPanel = true
                                        dragOffset = CGSize(
                                            width: min(maxOffsetX, max(-maxOffsetX, nx)),
                                            height: min(maxOffsetY, max(-maxOffsetY, ny))
                                        )
                                    }
                                }
                                .onEnded { _ in
                                    var transaction = Transaction()
                                    transaction.animation = nil
                                    withTransaction(transaction) {
                                        dragBase = dragOffset
                                        isDraggingPanel = false
                                    }
                                }
                        )

                    CodeGeneratorPlaceholderSheet(
                        document: $document,
                        regenerationToken: regenerationToken,
                        onDismissExternal: { isPresented = false },
                        isInFloatingPanel: true
                    )
                    .frame(width: panelW, height: panelH - dragBarHeight)
                    .clipped()
                }
                .frame(width: panelW, height: panelH)
                .background(Color(.systemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .shadow(color: .black.opacity(0.28), radius: 22, y: 10)
                .opacity(isDraggingPanel ? 0.08 : 1)
                .offset(dragBase)
                .transaction { transaction in
                    transaction.animation = nil
                }

                if isDraggingPanel {
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color(.systemBackground).opacity(0.12))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .strokeBorder(Color.accentColor.opacity(0.9), lineWidth: 2)
                        )
                        .shadow(color: .black.opacity(0.16), radius: 10, y: 4)
                        .frame(width: panelW, height: panelH)
                        .offset(dragOffset)
                        .allowsHitTesting(false)
                        .transaction { transaction in
                            transaction.animation = nil
                        }
                }
            }
        }
        .onChange(of: isPresented) { _, on in
            if on {
                dragOffset = .zero
                dragBase = .zero
                isDraggingPanel = false
            }
        }
    }
}

