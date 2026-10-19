import SwiftUI
#if canImport(UIKit)
import UIKit
#endif
#if canImport(AppKit)
import AppKit
#endif

// MARK: - Code editor (Return to apply, Shift+Return newline)

struct CodeLineEditor: View {
    @Binding var text: String
    let minHeight: CGFloat
    let maxHeight: CGFloat
    let focusToken: UUID
    let onCommit: () -> Void
    /// Monospace-Größe für `UITextView` / `NSTextView`. `nil` = bisheriges Verhalten (14 pt + Dynamic Type).
    var monospacedFontSize: CGFloat? = nil

    var body: some View {
        editor
            .frame(minHeight: minHeight, maxHeight: maxHeight)
    }

    @ViewBuilder
    private var editor: some View {
        #if canImport(UIKit)
        // iPhone: früher `TextEditor` — der spiegelt den laufenden Text oft erst ins Binding, wenn der Fokus endet
        // („Text übernehmen“ wirkte erst nach „Fertig“). `UITextView` + `textViewDidChange` hält Binding und View synchron.
        CodeLineEditorUIKit(
            text: $text,
            minHeight: minHeight,
            maxHeight: maxHeight,
            focusToken: focusToken,
            onCommit: onCommit,
            monospacedFontSize: monospacedFontSize,
            commitOnReturn: UIDevice.current.userInterfaceIdiom != .phone
        )
        #elseif canImport(AppKit)
        CodeLineEditorAppKit(
            text: $text,
            minHeight: minHeight,
            maxHeight: maxHeight,
            focusToken: focusToken,
            onCommit: onCommit,
            monospacedFontSize: monospacedFontSize
        )
        #else
        TextEditor(text: $text)
        #endif
    }
}

#if canImport(UIKit)
private final class CommitKeyTextView: UITextView {
    var onCommit: (() -> Void)?
    /// Auf dem iPhone: `false`, damit Return eine neue Zeile einfügt (wie bei `TextEditor`). Auf dem iPad: `true` = Return übernimmt.
    var commitOnReturn: Bool = true

    override var keyCommands: [UIKeyCommand]? {
        guard commitOnReturn else { return nil }
        return [
            UIKeyCommand(input: "\r", modifierFlags: [], action: #selector(commit)),
            UIKeyCommand(input: "\r", modifierFlags: [.shift], action: #selector(insertNewline)),
        ]
    }

    @objc private func commit() {
        onCommit?()
    }

    @objc private func insertNewline() {
        insertText("\n")
    }
}

private struct CodeLineEditorUIKit: UIViewRepresentable {
    @Binding var text: String
    let minHeight: CGFloat
    let maxHeight: CGFloat
    let focusToken: UUID
    let onCommit: () -> Void
    let monospacedFontSize: CGFloat?
    let commitOnReturn: Bool

    private static let defaultEditorFontSize: CGFloat = 14

    private func resolvedUIFont() -> UIFont {
        if let s = monospacedFontSize {
            return UIFont.monospacedSystemFont(ofSize: s, weight: .regular)
        }
        let base = UIFont.monospacedSystemFont(ofSize: Self.defaultEditorFontSize, weight: .regular)
        return UIFontMetrics(forTextStyle: .body).scaledFont(for: base)
    }

    func makeUIView(context: Context) -> CommitKeyTextView {
        let tv = CommitKeyTextView()
        tv.backgroundColor = .clear
        tv.isScrollEnabled = true
        tv.autocorrectionType = .no
        tv.autocapitalizationType = .none
        tv.smartQuotesType = .no
        tv.smartDashesType = .no
        tv.smartInsertDeleteType = .no
        tv.spellCheckingType = .no
        let desired = resolvedUIFont()
        tv.font = desired
        tv.typingAttributes[.font] = desired
        tv.textContainerInset = UIEdgeInsets(top: 8, left: 6, bottom: 8, right: 6)
        tv.commitOnReturn = commitOnReturn
        tv.onCommit = onCommit
        tv.delegate = context.coordinator
        // Beim Erzeugen nicht fokussieren: Nur ein späterer Token-Wechsel holt die Tastatur.
        context.coordinator.lastFocusToken = focusToken
        return tv
    }

    func updateUIView(_ uiView: CommitKeyTextView, context: Context) {
        // Coordinator lebt länger als einzelne Body-Pässe — Binding jeweils aktuell halten.
        context.coordinator.text = $text
        uiView.commitOnReturn = commitOnReturn
        if uiView.text != text {
            uiView.text = text
        }
        // Schrift hier setzen — SwiftUI `.font` greift auf `UITextView` nicht; Inspector-Skalierung über `monospacedFontSize`.
        let desired = resolvedUIFont()
        if uiView.font != desired { uiView.font = desired }
        // Wichtig: Ohne typingAttributes kann UIKit beim ersten Zeichen wieder Default-Font nehmen.
        if (uiView.typingAttributes[.font] as? UIFont) != desired {
            uiView.typingAttributes[.font] = desired
        }
        if context.coordinator.lastFocusToken != focusToken {
            context.coordinator.lastFocusToken = focusToken
            if uiView.window != nil {
                uiView.becomeFirstResponder()
            } else {
                DispatchQueue.main.async {
                    uiView.becomeFirstResponder()
                }
            }
        }
    }

    func makeCoordinator() -> Coordinator { Coordinator(text: $text) }

    final class Coordinator: NSObject, UITextViewDelegate {
        var text: Binding<String>
        var lastFocusToken: UUID = UUID()
        init(text: Binding<String>) { self.text = text }
        func textViewDidChange(_ textView: UITextView) {
            text.wrappedValue = textView.text ?? ""
        }

        func textViewDidEndEditing(_ textView: UITextView) {
            text.wrappedValue = textView.text ?? ""
        }
    }
}
#endif

#if canImport(AppKit)
private final class CommitKeyTextViewMac: NSTextView {
    var onCommit: (() -> Void)?

    override func keyDown(with event: NSEvent) {
        // Return = apply; Shift+Return = newline
        if event.keyCode == 36 {
            if event.modifierFlags.contains(.shift) {
                super.keyDown(with: event)
            } else {
                onCommit?()
            }
            return
        }
        super.keyDown(with: event)
    }
}

private struct CodeLineEditorAppKit: NSViewRepresentable {
    @Binding var text: String
    let minHeight: CGFloat
    let maxHeight: CGFloat
    let focusToken: UUID
    let onCommit: () -> Void
    let monospacedFontSize: CGFloat?

    private static let defaultEditorFontSize: CGFloat = 14

    private func resolvedNSFont() -> NSFont {
        let size = monospacedFontSize ?? Self.defaultEditorFontSize
        return NSFont.monospacedSystemFont(ofSize: size, weight: .regular)
    }

    func makeNSView(context: Context) -> NSScrollView {
        let scroll = NSScrollView()
        scroll.hasVerticalScroller = true
        scroll.drawsBackground = false

        let tv = CommitKeyTextViewMac()
        tv.isRichText = false
        tv.importsGraphics = false
        tv.allowsUndo = true
        tv.isEditable = true
        tv.isSelectable = true
        tv.drawsBackground = false
        tv.isAutomaticSpellingCorrectionEnabled = false
        tv.isAutomaticTextCompletionEnabled = false
        tv.isAutomaticQuoteSubstitutionEnabled = false
        tv.isAutomaticDashSubstitutionEnabled = false
        tv.isAutomaticDataDetectionEnabled = false
        tv.isAutomaticLinkDetectionEnabled = false
        tv.isAutomaticTextReplacementEnabled = false
        let desired = resolvedNSFont()
        tv.font = desired
        tv.typingAttributes[.font] = desired
        tv.textContainerInset = NSSize(width: 6, height: 6)
        tv.onCommit = onCommit
        tv.delegate = context.coordinator
        scroll.documentView = tv
        return scroll
    }

    func updateNSView(_ nsView: NSScrollView, context: Context) {
        context.coordinator.text = $text
        guard let tv = nsView.documentView as? NSTextView else { return }
        if tv.string != text {
            tv.string = text
        }
        let desired = resolvedNSFont()
        if tv.font != desired { tv.font = desired }
        if (tv.typingAttributes[.font] as? NSFont) != desired {
            tv.typingAttributes[.font] = desired
        }
        if context.coordinator.lastFocusToken != focusToken {
            context.coordinator.lastFocusToken = focusToken
            DispatchQueue.main.async {
                tv.window?.makeFirstResponder(tv)
            }
        }
    }

    func makeCoordinator() -> Coordinator { Coordinator(text: $text) }

    final class Coordinator: NSObject, NSTextViewDelegate {
        var text: Binding<String>
        var lastFocusToken: UUID = UUID()
        init(text: Binding<String>) { self.text = text }
        func textDidChange(_ notification: Notification) {
            guard let tv = notification.object as? NSTextView else { return }
            text.wrappedValue = tv.string
        }

        func textDidEndEditing(_ notification: Notification) {
            guard let tv = notification.object as? NSTextView else { return }
            text.wrappedValue = tv.string
        }
    }
}
#endif
