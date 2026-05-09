import SwiftUI
#if canImport(UIKit)
import UIKit
#endif
#if canImport(WebKit)
import WebKit
#endif

// MARK: - JavaScript Runner (In-App)

struct JavaScriptRunnerSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang
    let html: String

    var body: some View {
        NavigationStack {
            JavaScriptRunnerWebView(html: html)
                .navigationTitle(lang.tr("codegen_run_in_browser"))
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .confirmationAction) {
                        Button(lang.tr("about_done")) { dismiss() }
                    }
                }
        }
        .presentationDragIndicator(.visible)
    }
}

#if canImport(UIKit) && canImport(WebKit)
struct JavaScriptRunnerWebView: UIViewRepresentable {
    let html: String
    
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        cfg.defaultWebpagePreferences.allowsContentJavaScript = true
        cfg.preferences.javaScriptCanOpenWindowsAutomatically = true
        let v = WKWebView(frame: .zero, configuration: cfg)
        v.uiDelegate = context.coordinator
        v.isOpaque = false
        v.backgroundColor = .clear
        v.scrollView.backgroundColor = .clear
        return v
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        webView.loadHTMLString(html, baseURL: nil)
    }
    
    final class Coordinator: NSObject, WKUIDelegate {
        func webView(
            _ webView: WKWebView,
            runJavaScriptAlertPanelWithMessage message: String,
            initiatedByFrame frame: WKFrameInfo,
            completionHandler: @escaping () -> Void
        ) {
            presentAlert(on: webView, title: "Alert", message: message, completion: completionHandler)
        }
        
        func webView(
            _ webView: WKWebView,
            runJavaScriptConfirmPanelWithMessage message: String,
            initiatedByFrame frame: WKFrameInfo,
            completionHandler: @escaping (Bool) -> Void
        ) {
            presentConfirm(on: webView, title: "Confirm", message: message, completion: completionHandler)
        }
        
        func webView(
            _ webView: WKWebView,
            runJavaScriptTextInputPanelWithPrompt prompt: String,
            defaultText: String?,
            initiatedByFrame frame: WKFrameInfo,
            completionHandler: @escaping (String?) -> Void
        ) {
            presentPrompt(on: webView, title: prompt, defaultText: defaultText, completion: completionHandler)
        }
        
        private func topViewController() -> UIViewController? {
            guard let scene = UIApplication.shared.connectedScenes
                .compactMap({ $0 as? UIWindowScene })
                .first(where: { $0.activationState == .foregroundActive }) else { return nil }
            return scene.windows.first(where: { $0.isKeyWindow })?.rootViewController?.topMostPresented()
        }
        
        private func presentAlert(on webView: WKWebView, title: String, message: String, completion: @escaping () -> Void) {
            DispatchQueue.main.async {
                let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completion() })
                self.topViewController()?.present(alert, animated: true, completion: nil)
            }
        }
        
        private func presentConfirm(on webView: WKWebView, title: String, message: String, completion: @escaping (Bool) -> Void) {
            DispatchQueue.main.async {
                let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completion(false) })
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completion(true) })
                self.topViewController()?.present(alert, animated: true, completion: nil)
            }
        }
        
        private func presentPrompt(on webView: WKWebView, title: String, defaultText: String?, completion: @escaping (String?) -> Void) {
            DispatchQueue.main.async {
                let alert = UIAlertController(title: title, message: nil, preferredStyle: .alert)
                alert.addTextField { tf in
                    tf.text = defaultText
                    tf.autocorrectionType = .no
                    tf.autocapitalizationType = .none
                }
                alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completion(nil) })
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                    completion(alert.textFields?.first?.text)
                })
                self.topViewController()?.present(alert, animated: true, completion: nil)
            }
        }
    }
}
#else
struct JavaScriptRunnerWebView: View {
    let html: String
    var body: some View {
        Text("WebView not available.")
    }
}
#endif

#if canImport(UIKit)
extension UIViewController {
    func topMostPresented() -> UIViewController {
        var top: UIViewController = self
        while let presented = top.presentedViewController {
            top = presented
        }
        if let nav = top as? UINavigationController, let visible = nav.visibleViewController {
            return visible.topMostPresented()
        }
        if let tab = top as? UITabBarController, let sel = tab.selectedViewController {
            return sel.topMostPresented()
        }
        return top
    }
}
#endif

