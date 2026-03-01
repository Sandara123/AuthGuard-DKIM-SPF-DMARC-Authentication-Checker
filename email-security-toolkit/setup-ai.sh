#!/bin/bash

# AuthGuard AI Setup Script
# This script helps configure AI features for AuthGuard

echo "🛡️  AuthGuard - AI Integration Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✓ .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Edit .env manually to add your API key."
        exit 0
    fi
fi

# Copy .env.example to .env
if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "✓ Created .env file from template"
else
    echo "⚠️  .env.example not found. Creating new .env file..."
    cat > .env << 'EOF'
# Anthropic Claude API Configuration
VITE_ANTHROPIC_API_KEY=
EOF
fi

echo ""
echo "📝 Configuration Steps:"
echo ""
echo "1. Visit: https://console.anthropic.com/"
echo "2. Sign up or log in to your account"
echo "3. Navigate to 'API Keys' section"
echo "4. Click 'Create Key'"
echo "5. Copy your API key (starts with sk-ant-api03-...)"
echo ""
read -p "Paste your Anthropic API key here: " api_key

if [ -z "$api_key" ]; then
    echo "⚠️  No API key provided. You can add it later in .env file"
    echo ""
    echo "To add it manually:"
    echo "1. Open .env file"
    echo "2. Set VITE_ANTHROPIC_API_KEY=your-key-here"
else
    # Update .env with the API key
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|VITE_ANTHROPIC_API_KEY=.*|VITE_ANTHROPIC_API_KEY=$api_key|" .env
    else
        # Linux
        sed -i "s|VITE_ANTHROPIC_API_KEY=.*|VITE_ANTHROPIC_API_KEY=$api_key|" .env
    fi
    echo "✓ API key configured in .env"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Install dependencies:  npm install"
echo "2. Start dev server:      npm run dev"
echo "3. Open http://localhost:5173"
echo ""
echo "📖 For more information, see AI_INTEGRATION.md"
echo ""
