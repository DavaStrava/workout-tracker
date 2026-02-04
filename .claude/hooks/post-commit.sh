#!/bin/bash
# Post-tool hook: detect git commit and prompt post-commit-summary skill

# Read JSON input from stdin
input=$(cat)

# Extract the tool input (the command that was run)
tool_input=$(echo "$input" | grep -o '"tool_input"[[:space:]]*:[[:space:]]*{[^}]*}' | head -1)
command_value=$(echo "$input" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('tool_input', {}).get('command', ''))
except:
    print('')
" 2>/dev/null)

# Check if the command was a git commit (not amend, not just git add)
if echo "$command_value" | grep -qE 'git commit'; then
    echo '{"decision": "allow", "message": "Git commit detected. Please run the post-commit-summary skill to update .claude/last-commit-summary.md"}'
else
    echo '{"decision": "allow"}'
fi
