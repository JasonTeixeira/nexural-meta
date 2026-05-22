/**
 * `nx health` Ink dashboard.
 *
 * Renders federation registries + decay + scorecard summary in a TTY-friendly table.
 */

import { Box, Text } from "ink";
import type React from "react";
void {} as React.JSXElementConstructor<never> | undefined; // type-only ref to satisfy verbatimModuleSyntax

export interface HealthData {
  readonly federations: ReadonlyArray<{
    readonly name: "factory" | "lifeops";
    readonly count: number;
    readonly registry_path: string;
    readonly present: boolean;
  }>;
  readonly scorecard: {
    readonly present: boolean;
    readonly meanScore?: number;
    readonly below80?: number;
  };
  readonly decay: {
    readonly stale: number;
    readonly quarantined: number;
  };
  readonly externalMcps: ReadonlyArray<{ readonly name: string; readonly score: number }>;
}

const Sep: React.FC = () => <Text dimColor>──────────────────────────────────────────</Text>;

export const HealthDashboard: React.FC<{ data: HealthData }> = ({ data }) => (
  <Box flexDirection="column" paddingX={1}>
    <Box>
      <Text bold color="cyan">
        Nexural Health
      </Text>
      <Text dimColor> · {new Date().toLocaleString()}</Text>
    </Box>
    <Sep />

    <Box marginTop={1} flexDirection="column">
      <Text bold>Federations</Text>
      {data.federations.map((f) => (
        <Text key={f.name}>
          {"  "}
          {f.present ? "✓" : "—"} {f.name.padEnd(10)} {String(f.count).padStart(3)} warehouses
          {!f.present && <Text dimColor> ({f.registry_path} missing)</Text>}
        </Text>
      ))}
    </Box>

    <Box marginTop={1} flexDirection="column">
      <Text bold>Scorecard</Text>
      {data.scorecard.present ? (
        <Text>
          {"  "}
          Mean:{" "}
          <Text color={(data.scorecard.meanScore ?? 0) >= 90 ? "green" : "yellow"}>
            {data.scorecard.meanScore ?? "—"}
          </Text>
          {"  ·  "}Below 80:{" "}
          <Text color={(data.scorecard.below80 ?? 0) > 0 ? "red" : "green"}>
            {data.scorecard.below80 ?? 0}
          </Text>
        </Text>
      ) : (
        <Text dimColor>{"  "}scorecard.json not present (run `pnpm verify-all`)</Text>
      )}
    </Box>

    <Box marginTop={1} flexDirection="column">
      <Text bold>Decay</Text>
      <Text>
        {"  "}
        Stale: <Text color={data.decay.stale > 0 ? "yellow" : "green"}>{data.decay.stale}</Text>
        {"  ·  "}Quarantined:{" "}
        <Text color={data.decay.quarantined > 0 ? "red" : "green"}>{data.decay.quarantined}</Text>
      </Text>
    </Box>

    <Box marginTop={1} flexDirection="column">
      <Text bold>External MCPs</Text>
      {data.externalMcps.length === 0 ? (
        <Text dimColor>{"  "}none configured</Text>
      ) : (
        data.externalMcps.map((m) => (
          <Text key={m.name}>
            {"  "}✓ {m.name.padEnd(20)} score{" "}
            <Text color={m.score >= 90 ? "green" : "yellow"}>{m.score}</Text>
          </Text>
        ))
      )}
    </Box>

    <Sep />
  </Box>
);
