#!/usr/bin/env bash
# Post-slash-command hook - logs sub-agent delegation

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
LOG_FILE=".claude/delegation-log.txt"

# Extract command arguments if available
COMMAND_ARGS="${1:-No args provided}"

echo "[$TIMESTAMP] Sub-agent delegated via /tech: $COMMAND_ARGS" >> "$LOG_FILE"
