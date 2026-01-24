#!/bin/bash

TITLE="CLAUDE FINI $(tty)"

# Son
ffplay -nodisp -autoexit -loglevel quiet ~/bip.mp3

# Renomme l'onglet
kitty @ set-tab-title "$TITLE"

# Notification (commentée pour le moment)
# notify-send "Claude" "Réponse prête"

# Focus automatique sur l'onglet
kitty @ focus-tab --match title:"$TITLE"
