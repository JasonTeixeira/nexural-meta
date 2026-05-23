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
@click.pass_context
def serve(ctx: click.Context, persona_path: Path, env_file: Path) -> None:
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
    agents.cli.run_app(make_worker(persona))


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


def main() -> None:
    cli()


if __name__ == "__main__":
    main()
