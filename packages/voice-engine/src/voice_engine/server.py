"""CLI entrypoint.

Two commands:
  nx-voice validate <persona.yaml>           — validate without running
  nx-voice serve [--persona ...] [-- ...]    — start a LiveKit worker

Anything after `--` is forwarded to LiveKit's own CLI (e.g. `dev`, `start`,
`download-files`).  Example:
    nx-voice serve --persona personas/tutor.yaml -- dev
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import click
from dotenv import load_dotenv
from livekit import agents

from voice_engine.agent import _configure_logging, make_worker
from voice_engine.config import load_persona
from voice_engine.doctor import report as doctor_report
from voice_engine.orchestration import PersonaRegistry, build_router_agent


@click.group()
def cli() -> None:
    """Nexural Voice Engine — one premium core, infinite personas."""


@cli.command(
    context_settings={"ignore_unknown_options": True, "allow_extra_args": True},
)
@click.option(
    "--persona",
    "persona_path",
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
    default=lambda: os.getenv("VOICE_PERSONA", "personas/voice_coach.yaml"),
    help="Path to persona YAML. Defaults to $VOICE_PERSONA.",
)
@click.option(
    "--env",
    "env_file",
    type=click.Path(dir_okay=False, path_type=Path),
    default=".env",
    help="Path to .env file (skipped if missing).",
)
@click.option(
    "--registry-dir",
    "registry_dir",
    type=click.Path(file_okay=False, path_type=Path),
    default="personas",
    help="Persona directory used for handoff_to() targets.",
)
@click.pass_context
def serve(
    ctx: click.Context,
    persona_path: Path,
    env_file: Path,
    registry_dir: Path,
) -> None:
    """Start a LiveKit worker bound to a persona.

    Forward LiveKit subcommands after `--`, e.g.:
        nx-voice serve --persona my.yaml -- dev
    """
    if env_file.exists():
        load_dotenv(env_file)
    _configure_logging()

    persona = load_persona(persona_path)
    click.echo(f"▸ persona  : {persona.name} (v{persona.version})")
    click.echo(f"▸ mode     : {persona.mode.value}")
    if persona.mode.value == "cascaded":
        click.echo(
            f"▸ stack    : {persona.stt.provider.value}/{persona.stt.model}"
            f"  →  {persona.llm.provider.value}/{persona.llm.model}"
            f"  →  {persona.tts.provider.value}/{persona.tts.model}"
        )
    else:
        click.echo(f"▸ realtime : {persona.realtime.provider.value}/{persona.realtime.model}")
    click.echo(f"▸ mcp      : {len(persona.mcp_servers)} server(s)")
    click.echo(f"▸ memory   : {'on' if persona.memory.enabled else 'off'}")

    # Forward LiveKit-specific args (anything Click didn't consume).
    forwarded = list(ctx.args)
    if not forwarded:
        forwarded = ["dev"]
    sys.argv = [sys.argv[0], *forwarded]
    reg_dir = registry_dir if registry_dir.is_dir() else None
    agents.cli.run_app(
        make_worker(persona, persona_path=persona_path, registry_dir=reg_dir)
    )


@cli.command()
@click.argument(
    "persona_path",
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
)
def validate(persona_path: Path) -> None:
    """Validate a persona YAML without starting a worker."""
    persona = load_persona(persona_path)
    click.echo(f"✓ {persona.name} (v{persona.version}) — valid")
    click.echo(f"  mode={persona.mode.value}, mcp_servers={len(persona.mcp_servers)}")


@cli.command(name="list")
@click.option(
    "--dir",
    "persona_dir",
    type=click.Path(exists=True, file_okay=False, path_type=Path),
    default="personas",
)
def list_cmd(persona_dir: Path) -> None:
    """List all personas in a directory."""
    reg = PersonaRegistry(persona_dir)
    rows = list(reg.describe())
    if not rows:
        click.echo("(no personas)")
        return
    name_w = max(len(r.get("name", "")) for r in rows) + 2
    for r in rows:
        if "error" in r:
            click.echo(f"  ⚠  {r['name']:{name_w}s} ({r['error']})")
            continue
        click.echo(
            f"  {r['name']:{name_w}s} {r['mode']:<8s} — {r['description'][:60]}"
        )


@cli.command()
@click.option(
    "--dir",
    "persona_dir",
    type=click.Path(exists=True, file_okay=False, path_type=Path),
    default="personas",
)
@click.option(
    "--out",
    "out_path",
    type=click.Path(dir_okay=False, path_type=Path),
    default=None,
    help="Where to write the generated router YAML. Default: <dir>/router.yaml",
)
def generate_router(persona_dir: Path, out_path: Path | None) -> None:
    """Generate a `router.yaml` persona that routes between all others in --dir."""
    reg = PersonaRegistry(persona_dir)
    router = build_router_agent(reg)
    targets = [n for n in reg.names() if n != "router"]
    router.orchestration.handoff_targets = targets
    out = out_path or (persona_dir / "router.yaml")
    out.write_text(_persona_to_yaml(router), encoding="utf-8")
    click.echo(f"✓ wrote {out}  (handoffs: {len(targets)})")


@cli.command()
@click.option(
    "--dir",
    "persona_dir",
    type=click.Path(exists=True, file_okay=False, path_type=Path),
    default="personas",
)
@click.option(
    "--env",
    "env_file",
    type=click.Path(dir_okay=False, path_type=Path),
    default=".env",
)
def doctor(persona_dir: Path, env_file: Path) -> None:
    """Pre-flight check — what's installed, what's keyed, what's runnable."""
    if env_file.exists():
        load_dotenv(env_file)
    r = doctor_report(persona_dir)

    # ── LiveKit ────────────────────────────────────────────────
    if r["livekit_env_ok"] and r["livekit_auth_ok"]:
        click.echo(click.style("✓", fg="green") + " LiveKit env + token mint OK")
    else:
        click.echo(click.style("✗", fg="red") + " LiveKit env: missing " + ", ".join(r["livekit_env_missing"]))
        if not r["livekit_auth_ok"]:
            click.echo(f"  token mint: {r['livekit_auth_note']}")

    # ── Plugins ────────────────────────────────────────────────
    bad = [n for n, ok in r["plugins"].items() if not ok]
    if not bad:
        click.echo(click.style("✓", fg="green") + " all 11 plugins importable")
    else:
        click.echo(click.style("✗", fg="red") + " plugins failing import: " + ", ".join(bad))

    # ── Personas ───────────────────────────────────────────────
    click.echo("")
    ready_count = sum(1 for p in r["personas"] if p.ready)
    click.echo(f"Personas ({ready_count}/{len(r['personas'])} ready to run):")
    for p in r["personas"]:
        mark = click.style("✓", fg="green") if p.ready else click.style("✗", fg="yellow")
        line = f"  {mark} {p.name}"
        if p.missing:
            line += click.style(f"  — missing: {', '.join(p.missing)}", fg="yellow")
        click.echo(line)
        for note in p.notes:
            click.echo(click.style(f"      ⓘ  {note}", fg="cyan"))

    # ── Exit status ────────────────────────────────────────────
    click.echo("")
    if r["livekit_env_ok"] and ready_count > 0:
        click.echo(click.style(
            f"Ready — try:  nx-voice serve --persona personas/{r['personas'][0].name}.yaml -- dev",
            fg="green",
        ))
    else:
        click.echo(click.style(
            "Fill missing keys in .env, then re-run `nx-voice doctor`.",
            fg="yellow",
        ))


@cli.command()
@click.argument("name")
@click.option(
    "--base",
    type=click.Choice(["cascaded", "realtime"]),
    default="cascaded",
    help="Which base persona to extend.",
)
@click.option(
    "--dir",
    "persona_dir",
    type=click.Path(exists=True, file_okay=False, path_type=Path),
    default="personas",
)
@click.option(
    "--description",
    "description",
    default="",
    help="One-line description for the new persona.",
)
def init(name: str, base: str, persona_dir: Path, description: str) -> None:
    """Scaffold a new persona file with sensible defaults.

    Example: nx-voice init chess_coach --base cascaded
    """
    if not name.replace("_", "").isalnum():
        raise click.BadParameter(f"name must be alphanumeric or _: {name!r}")
    target = persona_dir / f"{name}.yaml"
    if target.exists():
        raise click.UsageError(f"{target} already exists")
    content = f"""# Generated by nx-voice init.
extends: _base/{base}.yaml

name: {name}
description: |
  {description or "TODO — one-line description."}
version: 0.1.0

system_prompt: |
  TODO — describe the persona's role, how they talk, the procedure they
  follow on every turn, hard rules.

greeting: |
  TODO — what they say when the call connects.

# Inherits everything else from _base/{base}.yaml.
# Override anything below — e.g. `llm.model`, `tts.voice`, `turn_detection.*`.

metadata:
  product: {name}
"""
    target.write_text(content, encoding="utf-8")
    click.echo(f"✓ created {target}")
    click.echo(f"  edit:    $EDITOR {target}")
    click.echo(f"  validate: nx-voice validate {target}")


def _persona_to_yaml(p) -> str:
    """Dump a PersonaConfig to clean YAML (preserves prompt formatting)."""
    import yaml as _yaml

    data = p.model_dump(mode="json", exclude_defaults=False)
    return _yaml.safe_dump(data, sort_keys=False, allow_unicode=True, width=88)


@cli.command(name="eval")
@click.argument(
    "scenario_file",
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
)
@click.option(
    "--dir",
    "persona_dir",
    type=click.Path(exists=True, file_okay=False, path_type=Path),
    default="personas",
)
@click.option(
    "--env",
    "env_file",
    type=click.Path(dir_okay=False, path_type=Path),
    default=".env",
)
def eval_cmd(scenario_file: Path, persona_dir: Path, env_file: Path) -> None:
    """Run a scenario YAML against its persona(s) and print pass/fail."""
    if env_file.exists():
        load_dotenv(env_file)
    _configure_logging()
    import asyncio

    from voice_engine.eval import run_scenario_file

    report = asyncio.run(run_scenario_file(scenario_file, persona_dir=persona_dir))
    click.echo(report.summary())
    if report.failed:
        raise click.exceptions.Exit(1)


def main() -> None:
    cli()


if __name__ == "__main__":
    main()
