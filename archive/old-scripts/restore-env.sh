#!/bin/bash

# =============================================================================
# AIME WIKI - ENVIRONMENT RESTORATION SCRIPT
# =============================================================================
# This script helps restore environment files from backups
# =============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$HOME/.aime-wiki-backups"

echo "🔓 AIME Wiki Environment Restoration Script"
echo "==========================================="

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ No backup directory found at: $BACKUP_DIR"
    echo "📝 Run ./scripts/backup-env.sh first to create backups"
    exit 1
fi

# List available backups
echo "📁 Available backups:"
echo "===================="
BACKUPS=($(ls -t "$BACKUP_DIR"/aime-wiki-env-backup-*.tar.gz 2>/dev/null))

if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo "❌ No backups found in $BACKUP_DIR"
    exit 1
fi

# Show backups with numbers
for i in "${!BACKUPS[@]}"; do
    BACKUP_FILE="${BACKUPS[$i]}"
    BACKUP_NAME=$(basename "$BACKUP_FILE")
    BACKUP_DATE=$(echo "$BACKUP_NAME" | sed 's/aime-wiki-env-backup-\([0-9]*_[0-9]*\).tar.gz/\1/' | sed 's/_/ /')
    echo "$((i+1)). $BACKUP_NAME (Created: $BACKUP_DATE)"
done

echo ""
read -p "🔢 Select backup number (1-${#BACKUPS[@]}): " SELECTION

# Validate selection
if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt ${#BACKUPS[@]} ]; then
    echo "❌ Invalid selection"
    exit 1
fi

SELECTED_BACKUP="${BACKUPS[$((SELECTION-1))]}"
echo "📦 Selected: $(basename "$SELECTED_BACKUP")"

# Warn about overwriting
if [ -f "$PROJECT_ROOT/.env.local" ]; then
    echo ""
    echo "⚠️  WARNING: This will overwrite your current .env.local file"
    read -p "🤔 Continue? (y/N): " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 0
    fi
    
    # Backup current .env.local
    CURRENT_BACKUP="$PROJECT_ROOT/.env.local.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$PROJECT_ROOT/.env.local" "$CURRENT_BACKUP"
    echo "💾 Current .env.local backed up to: $(basename "$CURRENT_BACKUP")"
fi

# Restore
echo "🔄 Restoring environment files..."
cd "$PROJECT_ROOT"
tar -xzf "$SELECTED_BACKUP"

echo "✅ Environment files restored!"
echo ""
echo "🔍 VERIFICATION:"
echo "==============="
echo "• .env.local restored: $([ -f .env.local ] && echo "✅" || echo "❌")"
echo "• .env.example restored: $([ -f .env.example ] && echo "✅" || echo "❌")"
echo ""
echo "🚀 NEXT STEPS:"
echo "============="
echo "1. Verify API keys: cat .env.local"
echo "2. Test integrations: npm run dev"
echo "3. Check API connections work"