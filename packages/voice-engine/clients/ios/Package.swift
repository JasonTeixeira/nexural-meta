// swift-tools-version:5.9
//
// NexuralVoiceEngine — Swift Package wrapping LiveKit + a token-endpoint client.
// Add via Xcode → Add Package Dependency → file path or git URL.

import PackageDescription

let package = Package(
    name: "NexuralVoiceEngine",
    platforms: [.iOS(.v15), .macOS(.v12)],
    products: [
        .library(name: "NexuralVoiceEngine", targets: ["NexuralVoiceEngine"]),
    ],
    dependencies: [
        // Track LiveKit Swift SDK 2.x. Pin to a specific minor in production.
        .package(url: "https://github.com/livekit/client-sdk-swift", from: "2.0.0"),
    ],
    targets: [
        .target(
            name: "NexuralVoiceEngine",
            dependencies: [
                .product(name: "LiveKit", package: "client-sdk-swift"),
            ],
            path: "Sources/VoiceEngine"
        ),
    ]
)
