#!/usr/bin/env bash

set -euo pipefail

CWD=$(dirname "${BASH_SOURCE[0]}")
SCRIPT_DIR=$(cd "${CWD}" >/dev/null 2>&1 && pwd)

function usage() {
  local COMMAND_FILES="$SCRIPT_DIR/*.sh"
  local COMMAND
  local COMMAND_USAGE

  printf "usage: %s <command> [arguments]\n\n" "$(basename "$0" ".sh")"

  for COMMAND_FILE in $(echo "${COMMAND_FILES}" | sort); do
    COMMAND=$(basename "${COMMAND_FILE}" ".sh")
    
    if [[ $COMMAND != "cfpush" ]]; then
      COMMAND_USAGE=$(echo $(cat "${COMMAND_FILE}" | grep "cfpush:usage" || true) | cut -d" " -f2-)
      printf "%-10s\t\t%s\n" "$COMMAND" "$COMMAND_USAGE"
    fi
  done
}

SUB_COMMAND="${1:-UNKNOWN}"

if [[ -f "$SCRIPT_DIR/$SUB_COMMAND.sh" ]]; then
  "$SCRIPT_DIR/$SUB_COMMAND.sh" "${@:2}"
  exit "$?"
fi

usage
exit 1
