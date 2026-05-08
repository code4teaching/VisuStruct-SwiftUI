import Foundation

struct RecentVisuStructFile: Identifiable, Codable, Equatable {
    var id: String
    var displayName: String
    var bookmarkData: Data?
    var filePath: String?
    var lastOpened: Date
}

@MainActor
final class RecentFilesStore: ObservableObject {
    @Published private(set) var files: [RecentVisuStructFile]

    private static let defaultsKey = "visustruct.recentFiles"
    private static let maxCount = 10

    init() {
        files = Self.loadFromDefaults()
    }

    func record(url: URL, displayName: String) {
        let entry = RecentVisuStructFile(
            id: url.path,
            displayName: displayName.isEmpty ? url.lastPathComponent : displayName,
            bookmarkData: makeBookmarkData(for: url),
            filePath: url.path,
            lastOpened: Date()
        )
        var updated = files.filter { !matches($0, entry) }
        updated.insert(entry, at: 0)
        if updated.count > Self.maxCount {
            updated = Array(updated.prefix(Self.maxCount))
        }
        files = updated
        Self.saveToDefaults(updated)
    }

    func remove(id: String) {
        let updated = files.filter { $0.id != id }
        files = updated
        Self.saveToDefaults(updated)
    }

    func clear() {
        files = []
        Self.saveToDefaults([])
    }

    func resolveURL(for recentFile: RecentVisuStructFile) throws -> URL {
        var stale = false
        if let bookmarkData = recentFile.bookmarkData {
            #if os(macOS)
            return try URL(
                resolvingBookmarkData: bookmarkData,
                options: [.withSecurityScope],
                relativeTo: nil,
                bookmarkDataIsStale: &stale
            )
            #else
            return try URL(
                resolvingBookmarkData: bookmarkData,
                options: [],
                relativeTo: nil,
                bookmarkDataIsStale: &stale
            )
            #endif
        }
        if let filePath = recentFile.filePath {
            return URL(fileURLWithPath: filePath)
        }
        throw RecentFilesStoreError.unavailable
    }

    func makeBookmarkData(for url: URL) -> Data? {
        let didAccess = url.startAccessingSecurityScopedResource()
        defer { if didAccess { url.stopAccessingSecurityScopedResource() } }

        #if os(macOS)
        if let data = try? url.bookmarkData(
            options: [.withSecurityScope, .minimalBookmark],
            includingResourceValuesForKeys: nil,
            relativeTo: nil
        ) {
            return data
        }
        #endif

        return try? url.bookmarkData(
            options: [],
            includingResourceValuesForKeys: nil,
            relativeTo: nil
        )
    }

    private func matches(_ lhs: RecentVisuStructFile, _ rhs: RecentVisuStructFile) -> Bool {
        if let lhsPath = lhs.filePath, let rhsPath = rhs.filePath {
            return lhsPath == rhsPath
        }
        if let lhsBookmark = lhs.bookmarkData, let rhsBookmark = rhs.bookmarkData {
            return lhsBookmark == rhsBookmark
        }
        return false
    }

    private static func loadFromDefaults() -> [RecentVisuStructFile] {
        guard let data = UserDefaults.standard.data(forKey: defaultsKey),
              let decoded = try? JSONDecoder().decode([RecentVisuStructFile].self, from: data) else {
            return []
        }
        return decoded.sorted { $0.lastOpened > $1.lastOpened }
    }

    private static func saveToDefaults(_ files: [RecentVisuStructFile]) {
        if let data = try? JSONEncoder().encode(files) {
            UserDefaults.standard.set(data, forKey: defaultsKey)
            UserDefaults.standard.synchronize()
        }
    }
}

enum RecentFilesStoreError: Error {
    case unavailable
}

