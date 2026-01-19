#!/bin/bash
clear

# Colours
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
PURPLE="\033[0;35m"
CYAN="\033[0;36m"
WHITE="\033[1;37m"
RESET="\033[0m"

echo -e "${PURPLE}==================================${RESET}"
echo -e "${WHITE}   DXNDRE WordPress Deploy Menu${RESET}"
echo -e "${PURPLE}==================================${RESET}"
echo ""
echo -e "${GREEN}1️⃣  Deploy to LIVE${RESET} ${CYAN}[dxndre.co.uk]${RESET}"
echo -e "${YELLOW}2️⃣  Deploy (dry run)${RESET}"
echo -e "${BLUE}3️⃣  Pull LIVE → LOCAL${RESET}"
echo -e "${PURPLE}4️⃣  Rollback LOCAL Database${RESET}"
echo -e "${RED}5️⃣  Exit${RESET}"
echo ""
echo -e "${PURPLE}______________________________________${RESET}"
read -p "Choose an option [1-5]: " CHOICE

case $CHOICE in
  1) bash deploy/deploy.sh ;;
  2) bash deploy/deploy.sh --dry-run ;;
  3) bash deploy/pull-live.sh ;;
  4) bash deploy/rollback-local.sh ;;
  5) exit 0 ;;
  *) echo -e "${RED}Invalid choice${RESET}"; sleep 1; bash deploy/menu.sh ;;
esac