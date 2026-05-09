import SwiftUI

// MARK: - Über VisuStruct

struct AboutVisuStructView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang

    private var versionLine: String {
        let short = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "—"
        let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "—"
        return String(format: lang.tr("about_version_fmt"), short, build)
    }

    private let authorName = "Holger Sebastiao"
    // Öffentliches Java-Repo: maßgebliche Quelle & Releases (aktueller als dieses SwiftUI-Repo).
    private let projectDisplay = "code4teaching/VisuStruct"
    private let projectURL = URL(string: "https://github.com/code4teaching/VisuStruct")
    private let webDisplay = "www.visustruct.org"
    private let webURL = URL(string: "https://www.visustruct.org")
    private let developerDisplay = "www.sebastiao.org"
    private let developerURL = URL(string: "https://www.sebastiao.org")
    // Java-Referenzrepo (aktuell gepflegt): code4teaching/VisuStruct
    private let upstreamDisplay = "code4teaching/VisuStruct"
    private let upstreamURL = URL(string: "https://github.com/code4teaching/VisuStruct")

    /// Erklärtext mit hervorgehobener Endung `.visustruct`.
    private var aboutDateiformatExplainer: Text {
        Text(lang.tr("about_dateiformat_part1"))
            .font(.subheadline)
            .foregroundStyle(.secondary)
            + Text(".visustruct")
            .font(.subheadline.monospaced().weight(.semibold))
            .foregroundStyle(.primary)
            + Text(lang.tr("about_dateiformat_part2"))
            .font(.subheadline)
            .foregroundStyle(.secondary)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    HStack(alignment: .top, spacing: 16) {
                        Image(systemName: "info.circle.fill")
                            .font(.system(size: 42))
                            .foregroundStyle(Color.accentColor)
                            .padding(.top, 2)
                        VStack(alignment: .leading, spacing: 10) {
                            Text("VisuStruct")
                                .font(.title2.weight(.semibold))
                            Text(versionLine)
                                .font(.subheadline)
                                .monospacedDigit()
                                .foregroundStyle(.secondary)
                            Text(authorName)
                                .font(.title3.weight(.semibold))
                                .foregroundStyle(.primary)
                                .padding(.top, 2)

                            VStack(alignment: .leading, spacing: 6) {
                                if let projectURL {
                                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                                        Text(lang.tr("about_project_github_label"))
                                            .foregroundStyle(.secondary)
                                        Link(projectDisplay, destination: projectURL)
                                    }
                                }
                                if let webURL {
                                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                                        Text(lang.tr("about_web_label"))
                                            .foregroundStyle(.secondary)
                                        Link(webDisplay, destination: webURL)
                                    }
                                }
                                if let developerURL {
                                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                                        Text(lang.tr("about_developer_label"))
                                            .foregroundStyle(.secondary)
                                        Link(developerDisplay, destination: developerURL)
                                    }
                                }
                            }
                            .font(.subheadline)
                        }
                    }

                    Divider()
                        .padding(.vertical, 4)

                    VStack(alignment: .leading, spacing: 12) {
                        Text(lang.tr("about_dateiformat_heading"))
                            .font(.headline)
                        aboutDateiformatExplainer
                    }

                    Divider()
                        .padding(.vertical, 8)

                    VStack(alignment: .leading, spacing: 10) {
                        Text(lang.tr("about_lineage_heading"))
                            .font(.headline)
                        Text(lang.tr("about_lineage_body"))
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .lineSpacing(4)
                        if let upstreamURL {
                            HStack(alignment: .firstTextBaseline, spacing: 6) {
                                Text(lang.tr("about_lineage_upstream_label"))
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                                Link(upstreamDisplay, destination: upstreamURL)
                                    .font(.subheadline)
                            }
                        }
                    }

                    Text(lang.tr("about_copyright"))
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .padding(.top, 8)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(28)
                .padding(.bottom, 16)
            }
            .navigationTitle(lang.tr("about_nav_title"))
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

