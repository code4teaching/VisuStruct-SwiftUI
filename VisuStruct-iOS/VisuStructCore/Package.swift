// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VisuStructCore",
    platforms: [
        .iOS(.v17),
        .macOS(.v13)
    ],
    products: [
        .library(name: "VisuStructCore", targets: ["VisuStructCore"])
    ],
    targets: [
        .target(
            name: "VisuStructCore",
            path: "Sources/VisuStructCore"
        )
    ]
)

