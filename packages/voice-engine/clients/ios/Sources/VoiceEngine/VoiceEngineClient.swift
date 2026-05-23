//
//  VoiceEngineClient.swift
//
//  iOS / macOS client for Nexural voice agents. Mints a token from your
//  backend, joins the LiveKit room, publishes mic, subscribes to the
//  agent's audio. Same backend, same personas, same engine — just iOS.
//

import Foundation
import LiveKit

/// One-line connect: hands you a `Room` and a `mute()` / `disconnect()` API.
public final class VoiceEngineClient {

    public struct Config {
        /// Your backend endpoint that returns `{ token, url, room, identity, agent }`.
        public let tokenEndpoint: URL
        /// Persona name registered on the agent worker (e.g. "voice_coach").
        public let persona: String
        /// Stable per-user id — used for memory namespacing.
        public let identity: String

        public init(tokenEndpoint: URL, persona: String, identity: String) {
            self.tokenEndpoint = tokenEndpoint
            self.persona = persona
            self.identity = identity
        }
    }

    public struct MintedToken: Decodable {
        public let token: String
        public let url: String
        public let room: String
        public let identity: String
        public let agent: String
    }

    public let room: Room
    private let config: Config

    public init(config: Config, room: Room = Room()) {
        self.config = config
        self.room = room
    }

    /// Mint a token from your backend, then connect.
    public func connect() async throws {
        var components = URLComponents(url: config.tokenEndpoint, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "identity", value: config.identity),
            URLQueryItem(name: "agent", value: config.persona),
        ]
        guard let url = components.url else { throw URLError(.badURL) }

        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw NSError(
                domain: "NexuralVoiceEngine",
                code: (response as? HTTPURLResponse)?.statusCode ?? -1,
                userInfo: [NSLocalizedDescriptionKey: "token endpoint failed"]
            )
        }
        let minted = try JSONDecoder().decode(MintedToken.self, from: data)

        try await room.connect(url: minted.url, token: minted.token)

        // Publish the mic so the agent can hear us.
        try await room.localParticipant.setMicrophone(enabled: true)
    }

    public func mute(_ muted: Bool) async throws {
        try await room.localParticipant.setMicrophone(enabled: !muted)
    }

    public func disconnect() async {
        await room.disconnect()
    }
}
