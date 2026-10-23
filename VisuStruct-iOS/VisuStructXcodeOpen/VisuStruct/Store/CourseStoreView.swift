import StoreKit
import SwiftUI

// MARK: - Kurs kaufen

/// Sheet „Kurs“: was drin ist, Kaufknopf (Preis aus dem App Store) und „Käufe wiederherstellen“.
struct CourseStoreView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang
    @ObservedObject private var store = CourseStore.shared

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    HStack(alignment: .top, spacing: 16) {
                        Image(systemName: "graduationcap.fill")
                            .font(.system(size: 42))
                            .foregroundStyle(Color.accentColor)
                        VStack(alignment: .leading, spacing: 8) {
                            Text(lang.tr("course_title"))
                                .font(.title2.weight(.semibold))
                            Text(lang.tr("course_intro"))
                                .foregroundStyle(.secondary)
                        }
                    }

                    VStack(alignment: .leading, spacing: 10) {
                        bullet("course_bullet_lessons", systemImage: "book")
                        bullet("course_bullet_java", systemImage: "chevron.left.forwardslash.chevron.right")
                        bullet("course_bullet_games", systemImage: "gamecontroller")
                        bullet("course_bullet_once", systemImage: "checkmark.seal")
                    }

                    if store.isUnlocked {
                        Label(lang.tr("course_unlocked"), systemImage: "checkmark.circle.fill")
                            .font(.headline)
                            .foregroundStyle(.green)
                    } else {
                        ProductView(id: CoursePurchaseGate.productID) {
                            Image(systemName: "graduationcap")
                                .font(.largeTitle)
                                .foregroundStyle(Color.accentColor)
                        }
                        .productViewStyle(.large)
                        .onInAppPurchaseCompletion { _, _ in
                            await store.refresh()
                        }
                    }

                    Text(lang.tr("course_free_note"))
                        .font(.footnote)
                        .foregroundStyle(.secondary)

                    if !store.isUnlocked {
                        Button {
                            Task { await store.restore(language: lang) }
                        } label: {
                            if store.isRestoring {
                                ProgressView()
                            } else {
                                Text(lang.tr("course_restore"))
                            }
                        }
                        .disabled(store.isRestoring)
                    }
                }
                .frame(maxWidth: 560, alignment: .leading)
                .padding(24)
                .frame(maxWidth: .infinity)
            }
            .navigationTitle(lang.tr("course_title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(lang.tr("about_done")) { dismiss() }
                }
            }
            .alert(
                lang.tr("course_restore"),
                isPresented: Binding(
                    get: { store.restoreMessage != nil },
                    set: { if !$0 { store.restoreMessage = nil } }
                )
            ) {
                Button(lang.tr("about_done")) { store.restoreMessage = nil }
            } message: {
                Text(store.restoreMessage ?? "")
            }
        }
        .task { await store.refresh() }
        .presentationDragIndicator(.visible)
    }

    private func bullet(_ key: String, systemImage: String) -> some View {
        Label {
            Text(lang.tr(key))
        } icon: {
            Image(systemName: systemImage)
                .foregroundStyle(Color.accentColor)
        }
    }
}
