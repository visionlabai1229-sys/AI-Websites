#!/bin/bash
# Wrapper that loads nvm before running any node command.
# Usage: bash run.sh node serve.mjs
#        bash run.sh node screenshot.mjs http://localhost:3000
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
exec "$@"
