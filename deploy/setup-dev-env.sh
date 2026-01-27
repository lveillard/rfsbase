#!/bin/bash
# RFSbase Dev Environment Setup
# Run this after SSM connection to set up dev tools like ec2-dev
set -e

echo "🚀 Setting up RFSbase dev environment..."

# Update system
sudo yum update -y

# Install essential tools
sudo yum install -y \
    git \
    tmux \
    jq \
    htop \
    vim \
    curl \
    wget \
    unzip \
    tar \
    make \
    gcc

# Install Node.js 20 (for Claude Code CLI)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

# Install Rust (for backend development)
if ! command -v rustc &> /dev/null; then
    echo "🦀 Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi

# Setup tmux config (same as ec2-dev)
cat > ~/.tmux.conf << 'EOF'
set -g default-shell /bin/bash
set -g default-command /bin/bash
set -g mouse on
set -g history-limit 50000
set -g default-terminal "tmux-256color"
set -ga terminal-overrides ",xterm-256color:Tc"
set -g status-right "#H | %H:%M"
set -g mouse on

# Better prefix
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# Split panes with | and -
bind | split-window -h
bind - split-window -v

# Reload config
bind r source-file ~/.tmux.conf \; display "Config reloaded!"

# Status bar
set -g status-bg colour235
set -g status-fg white
set -g status-left-length 30
set -g status-left '#[fg=green](#S) '
EOF

# Setup bash aliases
cat >> ~/.bashrc << 'EOF'

# RFSbase aliases
alias dc='docker compose'
alias dcup='docker compose -f docker-compose.ec2.yml up -d'
alias dcdown='docker compose -f docker-compose.ec2.yml down'
alias dclogs='docker compose -f docker-compose.ec2.yml logs -f'
alias dcps='docker compose -f docker-compose.ec2.yml ps'
alias dcbuild='docker compose -f docker-compose.ec2.yml build'

# Docker aliases
alias dps='docker ps'
alias dlog='docker logs -f'

# Navigation
alias proj='cd ~/rfsbase'
alias logs='tail -f /var/log/rfsbase-setup.log'

# Git
alias gs='git status'
alias gp='git pull'
alias gc='git commit'

# Colors
alias ls='ls --color=auto'
alias ll='ls -alF'
alias la='ls -A'

# Load cargo if available
[[ -f "$HOME/.cargo/env" ]] && source "$HOME/.cargo/env"
EOF

# Setup inputrc for better terminal
cat > ~/.inputrc << 'EOF'
set editing-mode vi
set show-mode-in-prompt on
set vi-ins-mode-string \1\e[6 q\2
set vi-cmd-mode-string \1\e[2 q\2
EOF

# Setup git config
git config --global user.name "Loic Veillard"
git config --global user.email "loic@veillard.com"
git config --global init.defaultBranch main
git config --global pull.rebase false

# Install Claude Code CLI (optional)
if command -v npm &> /dev/null; then
    echo "📦 Installing Claude Code CLI..."
    npm install -g @anthropic-ai/claude-code 2>/dev/null || echo "Claude Code CLI install skipped"
fi

# Create convenient project directory structure
mkdir -p ~/projects

# Source the new bashrc
source ~/.bashrc

echo ""
echo "✅ Dev environment setup complete!"
echo ""
echo "Quick commands:"
echo "  proj     - cd to rfsbase"
echo "  dcup     - start containers"
echo "  dcdown   - stop containers"
echo "  dclogs   - view logs"
echo "  dcps     - container status"
echo ""
echo "Start tmux session:"
echo "  tmux new -s rfsbase"
echo ""
