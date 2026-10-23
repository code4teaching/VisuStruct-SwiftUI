import SwiftUI
import UIKit
import WebKit

// MARK: - Lernen und Programmieren (eingebettete Web-App)

/// Lernbereich und „Programmieren“ aus der Web-App (`web/`, gebaut mit `npm run build:app` nach
/// `WebApp/VisuStructWeb.html`), offline im WKWebView. Ohne Kurs-Kauf sind nur die ersten Lektionen offen
/// (`web/src/ui/appHost.ts`); „Echtes Java (mit Swing)“ blendet die Web-App in der App aus.
struct WebAppScreen: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang
    @ObservedObject private var store = CourseStore.shared
    @State private var showCourseStore = false

    var body: some View {
        NavigationStack {
            WebAppView(
                language: lang,
                courseUnlocked: store.isUnlocked,
                onBuyCourse: { showCourseStore = true }
            )
            .ignoresSafeArea(edges: .bottom)
            .navigationTitle(lang.tr("webapp_title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(lang.tr("about_done")) { dismiss() }
                }
                if !store.isUnlocked {
                    ToolbarItem(placement: .primaryAction) {
                        Button {
                            showCourseStore = true
                        } label: {
                            Label(lang.tr("course_title"), systemImage: "graduationcap")
                        }
                        .help(lang.tr("course_title"))
                    }
                }
            }
        }
        .sheet(isPresented: $showCourseStore) {
            CourseStoreView()
        }
    }
}

/// WKWebView mit der gebündelten Web-App. Die App teilt ihr per Skript den Kaufstatus und die Sprache mit;
/// die Web-App meldet „Kurs freischalten“ über den Message-Handler `visustruct`.
struct WebAppView: UIViewRepresentable {
    /// Lektionen 1 bis 3 sind ohne Kauf offen (Vorschau).
    static let freeLessons = 3

    let language: AppLanguage
    let courseUnlocked: Bool
    let onBuyCourse: () -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(onBuyCourse: onBuyCourse)
    }

    func makeUIView(context: Context) -> WKWebView {
        let controller = WKUserContentController()
        controller.addUserScript(WKUserScript(
            source: Self.bootstrapScript(language: language, courseUnlocked: courseUnlocked),
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        ))
        controller.add(WeakScriptMessageHandler(context.coordinator), name: Coordinator.messageName)

        let configuration = WKWebViewConfiguration()
        configuration.userContentController = controller
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        #if DEBUG
        webView.isInspectable = true
        #endif
        context.coordinator.lastUnlocked = courseUnlocked

        if let url = Bundle.main.url(forResource: "VisuStructWeb", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        context.coordinator.onBuyCourse = onBuyCourse
        guard context.coordinator.lastUnlocked != courseUnlocked else { return }
        context.coordinator.lastUnlocked = courseUnlocked
        webView.evaluateJavaScript("window.visustructSetCourseUnlocked && window.visustructSetCourseUnlocked(\(courseUnlocked))")
    }

    /// Läuft vor dem Skript der Web-App: Kaufstatus und Sprache (gleicher Schlüssel `appLanguageCode` wie in der App).
    private static func bootstrapScript(language: AppLanguage, courseUnlocked: Bool) -> String {
        let code = language == .javaLike ? AppLanguage.english.rawValue : language.rawValue
        return """
        window.visustructHost = { courseUnlocked: \(courseUnlocked), freeLessons: \(freeLessons) };
        try { localStorage.setItem('\(AppLanguage.storageKey)', '\(code)'); } catch (e) {}
        """
    }

    @MainActor
    final class Coordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate, WKDownloadDelegate {
        static let messageName = "visustruct"

        var onBuyCourse: () -> Void
        var lastUnlocked = false

        init(onBuyCourse: @escaping () -> Void) {
            self.onBuyCourse = onBuyCourse
        }

        // MARK: Nachrichten der Web-App

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard let body = message.body as? [String: Any], body["type"] as? String == "buyCourse" else { return }
            onBuyCourse()
        }

        // MARK: Links und Downloads

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
            if navigationAction.shouldPerformDownload { return .download }
            // Internetseiten (Impressum, Java-Doku …) im Browser öffnen, die Web-App selbst bleibt hier.
            if let url = navigationAction.request.url, url.scheme == "http" || url.scheme == "https" {
                await UIApplication.shared.open(url)
                return .cancel
            }
            return .allow
        }

        func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {
            download.delegate = self
        }

        /// Links mit `target="_blank"`: Internetseiten im Browser, mitgelieferte Dateien (licenses.txt) hier.
        func webView(
            _ webView: WKWebView,
            createWebViewWith configuration: WKWebViewConfiguration,
            for navigationAction: WKNavigationAction,
            windowFeatures: WKWindowFeatures
        ) -> WKWebView? {
            if let url = navigationAction.request.url {
                if url.isFileURL {
                    webView.load(navigationAction.request)
                } else {
                    UIApplication.shared.open(url)
                }
            }
            return nil
        }

        /// Gespeicherte Dateien (.visustruct, PNG, ZIP …) landen im Temp-Ordner und gehen dann ins Teilen-Menü.
        func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String) async -> URL? {
            let folder = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
            try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
            let target = folder.appendingPathComponent(suggestedFilename.isEmpty ? "VisuStruct" : suggestedFilename)
            pendingDownloads[ObjectIdentifier(download)] = target
            return target
        }

        func downloadDidFinish(_ download: WKDownload) {
            guard let url = pendingDownloads.removeValue(forKey: ObjectIdentifier(download)),
                  let webView = download.webView else { return }
            let share = UIActivityViewController(activityItems: [url], applicationActivities: nil)
            share.popoverPresentationController?.sourceView = webView
            share.popoverPresentationController?.sourceRect = CGRect(x: webView.bounds.midX, y: webView.bounds.minY + 44, width: 1, height: 1)
            Self.topViewController(from: webView)?.present(share, animated: true)
        }

        func download(_ download: WKDownload, didFailWithError error: Error, resumeData: Data?) {
            pendingDownloads.removeValue(forKey: ObjectIdentifier(download))
        }

        private var pendingDownloads: [ObjectIdentifier: URL] = [:]

        private static func topViewController(from view: UIView) -> UIViewController? {
            var top = view.window?.rootViewController
            while let presented = top?.presentedViewController {
                top = presented
            }
            return top
        }
    }
}

/// `WKUserContentController` hält seine Handler stark; ohne diesen Umweg bliebe der Coordinator für immer im Speicher.
@MainActor
private final class WeakScriptMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?

    init(_ target: WKScriptMessageHandler) {
        self.target = target
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(userContentController, didReceive: message)
    }
}
