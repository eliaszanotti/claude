#!/bin/bash

TYPE="${1:-finished}"
TIME=$(date +%H:%M)

if [ "$TYPE" = "finished" ]; then
    TITLE="CLAUDE_FINI_$TIME"
    SOUND=~/.claude/song/finish.mp3
    notify-send "Claude" "Réponse prête" --app-name="kitty" --hint="string:desktop-entry:kitty"
elif [ "$TYPE" = "need-human" ]; then
    TITLE="CLAUDE_ATTENTION_$TIME"
    SOUND=~/.claude/song/need-human.mp3
    notify-send "Claude" "Besoin de votre attention" --app-name="kitty" --hint="string:desktop-entry:kitty"
fi

# Renomme l'onglet
kitty @ set-tab-title "$TITLE"

# Joue le son
ffplay -nodisp -autoexit -loglevel quiet "$SOUND"

# Focus automatique sur l'onglet
# kitty @ focus-tab --match title:"$TITLE"
