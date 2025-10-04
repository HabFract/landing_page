#!/usr/bin/env bash
# Smart Claude Code Launcher with MCP Config Selection
# Part of the context-tui scaffolding system
#
# Usage:
#   ./scripts/launch.sh           # Interactive selection
#   ./scripts/launch.sh no-mcp    # Direct launch with NO-MCP
#   ./scripts/launch.sh rag       # Direct launch with RAG only
#   ./scripts/launch.sh tasks     # Direct launch with tasks only
#   ./scripts/launch.sh minimal   # Direct launch with minimal (tasks + RAG)
#   ./scripts/launch.sh full      # Direct launch with full Archon

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project root detection
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MCP_CONFIG_DIR="$PROJECT_ROOT/.claude/mcp-configs"

# Check if .claude/mcp-configs directory exists
if [!  -d "$MCP_CONFIG_DIR" ]; then
  echo -e "${YELLOW}Warning: .claude/mcp-configs directory not found!${NC}"
  echo "Have you run the scaffolding tool (context-tui) yet?"
  exit 1
fi

# Function to display MCP config options
show_menu() {
  echo -e "${GREEN}=== Claude Code MCP Configuration Launcher ===${NC}"
  echo ""
  echo "Select MCP configuration based on your workflow:"
  echo ""

  local counter=1

  # Always show NO-MCP first
  if [ -f "$MCP_CONFIG_DIR/NO-MCP.json" ]; then
    echo -e "${BLUE}${counter})${NC} no-mcp      - ${GREEN}Maximum context efficiency${NC} (0 tokens)"
    echo "               Use for: Pure coding without external tools"
    echo ""
    ((counter++))
  fi

  # Show minimal if exists
  if [ -f "$MCP_CONFIG_DIR/minimal.json" ]; then
    echo -e "${BLUE}${counter})${NC} minimal     - ${GREEN}General development${NC} (~22k tokens)"
    echo "               Use for: Archon task management, RAG queries"
    echo ""
    ((counter++))
  fi

  # Show gemini if exists
  if [ -f "$MCP_CONFIG_DIR/gemini.json" ]; then
    echo -e "${BLUE}${counter})${NC} gemini      - ${GREEN}AI-powered coding${NC} (~12k tokens)"
    echo "               Use for: Zen MCP with Gemini AI assistance"
    echo ""
    ((counter++))
  fi

  # Show e2e if exists
  if [ -f "$MCP_CONFIG_DIR/e2e.json" ]; then
    echo -e "${BLUE}${counter})${NC} e2e         - ${GREEN}Testing & design${NC} (~15k tokens)"
    echo "               Use for: Playwright browser testing, Figma integration"
    echo ""
    ((counter++))
  fi

  # Show problem-solver if exists
  if [ -f "$MCP_CONFIG_DIR/problem-solver.json" ]; then
    echo -e "${BLUE}${counter})${NC} solver      - ${GREEN}Complex reasoning${NC} (~25k tokens)"
    echo "               Use for: Archon + Sequential Thinking for hard problems"
    echo ""
    ((counter++))
  fi

  # Show full if exists
  if [ -f "$MCP_CONFIG_DIR/full.json" ]; then
    echo -e "${BLUE}${counter})${NC} full        - ${YELLOW}All MCP servers${NC} (~60k tokens)"
    echo "               Use for: Full-stack with all tools (use sparingly)"
    echo ""
    ((counter++))
  fi

  echo -e "${BLUE}${counter})${NC} exit        - Cancel and exit"
  echo ""
}

# Function to map choice to config file
get_config_name() {
  case $1 in
    1|no-mcp|nomcp|none)
      echo "NO-MCP"
      ;;
    2|minimal|min)
      echo "minimal"
      ;;
    3|gemini|zen)
      echo "gemini"
      ;;
    4|e2e|test|testing)
      echo "e2e"
      ;;
    5|solver|problem-solver|thinking)
      echo "problem-solver"
      ;;
    6|full|all)
      echo "full"
      ;;
    7|exit|quit)
      echo "EXIT"
      ;;
    *)
      echo "INVALID"
      ;;
  esac
}

# Function to get description for config
get_config_description() {
  case $1 in
    NO-MCP)
      echo "No MCP servers (maximum context efficiency)"
      ;;
    minimal)
      echo "Archon only (task management + RAG)"
      ;;
    gemini)
      echo "Zen MCP with Gemini AI (AI-powered coding)"
      ;;
    e2e)
      echo "Playwright + Figma (testing & design)"
      ;;
    problem-solver)
      echo "Archon + Sequential Thinking (complex reasoning)"
      ;;
    full)
      echo "All MCP servers (kitchen sink)"
      ;;
  esac
}

# Function to load and export environment variables from .env
load_env() {
  local env_file="$PROJECT_ROOT/.env"

  if [ -f "$env_file" ]; then
    echo -e "${BLUE}Loading environment variables from .env${NC}"
    # Export variables from .env file
    set -a
    source "$env_file"
    set +a
  fi
}

# Function to substitute environment variables in JSON config
substitute_env_vars() {
  local config_file=$1
  local temp_file="${config_file}.tmp"

  # Use envsubst to replace ${VAR} placeholders with actual values
  if command -v envsubst &> /dev/null; then
    envsubst < "$config_file" > "$temp_file"
    mv "$temp_file" "$config_file"
  else
    # Fallback: simple sed-based substitution
    cp "$config_file" "$temp_file"
    # Replace ${GEMINI_API_KEY} and similar patterns
    for var in GEMINI_API_KEY; do
      if [ -n "${!var}" ]; then
        sed -i "s|\${$var}|${!var}|g" "$temp_file"
      fi
    done
    mv "$temp_file" "$config_file"
  fi
}

# Function to launch Claude Code
launch_claude() {
  local config_name=$1
  local config_path="$MCP_CONFIG_DIR/${config_name}.json"

  # Verify config file exists
  if [ ! -f "$config_path" ]; then
    echo -e "${YELLOW}Error: Config file not found: $config_path${NC}"
    echo "Available configs:"
    ls -1 "$MCP_CONFIG_DIR"/*.json 2>/dev/null || echo "  (none found)"
    exit 1
  fi

  local description=$(get_config_description "$config_name")

  echo -e "${GREEN}Launching Claude Code...${NC}"
  echo -e "Config: ${BLUE}$config_name${NC}"
  echo -e "Description: $description"
  echo ""

  # Load environment variables from .env if it exists
  load_env

  # Copy selected config to project root as .mcp.json
  # Claude Code automatically loads .mcp.json from project root
  cp "$config_path" "$PROJECT_ROOT/.mcp.json"

  # Substitute environment variables in the config
  substitute_env_vars "$PROJECT_ROOT/.mcp.json"

  echo -e "${BLUE}MCP configuration installed:${NC} .mcp.json"

  # Check if GEMINI_API_KEY is required and missing
  if grep -q -E "(gemini|zen)" "$PROJECT_ROOT/.mcp.json" 2>/dev/null; then
    if [ -z "$GEMINI_API_KEY" ]; then
      echo -e "${YELLOW}⚠️  Warning: GEMINI_API_KEY not found in .env${NC}"
      echo -e "   Create a .env file with: GEMINI_API_KEY=your_api_key_here"
    fi
  fi

  echo ""

  # Launch Claude Code (will automatically load .mcp.json)
  cd "$PROJECT_ROOT"
  claude
}

# Main logic
main() {
  # Check for init mode first
  if [[ "$1" == "init" ]]; then
    echo -e "${GREEN}🚀 Running project initialization in YOLO mode...${NC}"
    echo ""
    cd "$PROJECT_ROOT"
    claude --dangerously-skip-permissions "/init"
    echo ""
    echo -e "${GREEN}✅ Initialization complete.${NC}"
    exit 0
  fi

  # Check if argument provided (direct launch)
  if [ $# -gt 0 ]; then
    CONFIG_NAME=$(get_config_name "$1")

    if [ "$CONFIG_NAME" = "INVALID" ]; then
      echo -e "${YELLOW}Invalid option: $1${NC}"
      echo "Valid options: no-mcp, minimal, gemini, e2e, solver, full, init"
      exit 1
    elif [ "$CONFIG_NAME" = "EXIT" ]; then
      echo "Cancelled."
      exit 0
    fi

    launch_claude "$CONFIG_NAME"
    exit 0
  fi

  # Interactive mode
  while true; do
    show_menu
    read -p "Choice [1-6]: " choice

    CONFIG_NAME=$(get_config_name "$choice")

    if [ "$CONFIG_NAME" = "INVALID" ]; then
      echo -e "${YELLOW}Invalid choice. Please select 1-7.${NC}"
      echo ""
      continue
    elif [ "$CONFIG_NAME" = "EXIT" ]; then
      echo "Cancelled."
      exit 0
    fi

    # Confirm choice
    description=$(get_config_description "$CONFIG_NAME")
    echo ""
    echo -e "You selected: ${BLUE}$CONFIG_NAME${NC}"
    echo -e "Description: $description"
    read -p "Continue? [Y/n]: " confirm

    if [[ $confirm =~ ^[Nn] ]]; then
      echo "Selection cancelled."
      echo ""
      continue
    fi

    launch_claude "$CONFIG_NAME"
    break
  done
}

# Run main
main "$@"
