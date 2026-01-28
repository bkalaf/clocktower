#!/usr/bin/env bash

set -euo pipefail

# Required environment variables
: "${XSTATE_LOG_DIR:?Missing XSTATE_LOG_DIR}"
: "${SCREENSHOT_LOG_DIR:?Missing SCREENSHOT_LOG_DIR}"
: "${SOCKET_LOG_DIR:?Missing SOCKET_LOG_DIR}"
: "${LOG_FILENAME:?Missing LOG_FILENAME}"

XSTATE_LOG_FILE="${XSTATE_LOG_DIR}/${LOG_FILENAME}"
SCREENSHOT_LOG_FILE="${SCREENSHOT_LOG_DIR}/${LOG_FILENAME}"
SOCKET_LOG_FILE="${SOCKET_LOG_DIR}/${LOG_FILENAME}"

# Ensure log files exist so tail doesn't choke
mkdir -p "$XSTATE_LOG_DIR" "$SCREENSHOT_LOG_DIR" "$SOCKET_LOG_DIR"
touch "$XSTATE_LOG_FILE" "$SCREENSHOT_LOG_FILE" "$SOCKET_LOG_FILE"

# Tail all logs with clear prefixes
tail -n 0 -F "$XSTATE_LOG_FILE" | sed 's/^/XSTATE    : /' &
PID_XSTATE=$!

tail -n 0 -F "$SCREENSHOT_LOG_FILE" | sed 's/^/PUPPETER  : /' &
PID_PUPPETER=$!

tail -n 0 -F "$SOCKET_LOG_FILE" | sed 's/^/SOCKETIO  : /' &
PID_SOCKETIO=$!

# Clean shutdown
trap "kill $PID_XSTATE $PID_PUPPETER $PID_SOCKETIO" EXIT

wait
