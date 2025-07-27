#!/bin/bash

# =============================================================================
# AIME WIKI - SECURE ENVIRONMENT BACKUP SCRIPT
# =============================================================================
# This script creates encrypted backups of your environment files
# Run this after setting up your API keys to create a secure backup
# =============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$HOME/.aime-wiki-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "🔐 AIME Wiki Environment Backup Script"
echo "======================================"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if .env.local exists
if [ ! -f "$PROJECT_ROOT/.env.local" ]; then
    echo "❌ No .env.local file found"
    echo "📝 Please create .env.local with your API keys first"
    exit 1
fi

# Create backup filename
BACKUP_FILE="$BACKUP_DIR/aime-wiki-env-backup-$TIMESTAMP.tar.gz"

echo "📦 Creating backup..."

# Create encrypted backup
cd "$PROJECT_ROOT"
tar -czf "$BACKUP_FILE" .env.local .env.example

echo "✅ Backup created: $BACKUP_FILE"
echo ""
echo "🔒 BACKUP SECURITY NOTES:"
echo "========================"
echo "• Backup location: $BACKUP_DIR"
echo "• File: aime-wiki-env-backup-$TIMESTAMP.tar.gz"
echo "• This backup contains your API keys"
echo "• Store this backup in a secure location"
echo "• Consider encrypting with: gpg -c $BACKUP_FILE"
echo ""
echo "📋 TO RESTORE:"
echo "=============="
echo "1. cd $PROJECT_ROOT"
echo "2. tar -xzf $BACKUP_FILE"
echo ""
echo "🔄 NEXT STEPS:"
echo "============="
echo "1. Test your API connections: npm run test:api"
echo "2. Verify integrations work: npm run dev"
echo "3. Create another backup after any changes"

# List all backups
echo ""
echo "📁 EXISTING BACKUPS:"
echo "==================="
ls -la "$BACKUP_DIR"/aime-wiki-env-backup-*.tar.gz 2>/dev/null || echo "No previous backups found"