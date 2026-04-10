# VisuStruct-SwiftUI

SwiftUI-iOS-Editor für Nassi–Shneiderman-Struktogramme (XML/.visustruct, kompatibel zur Java-Version).

Details und Build-Anleitung: **[VisuStruct-iOS/README.md](VisuStruct-iOS/README.md)**

## Auf GitHub laden

Das lokale Repository ist auf Branch **`main`** vorbereitet. Remote-Name: **`origin`** → `https://github.com/gatolindo79/VisuStruct-SwiftUI.git`  
(Wenn dein GitHub-Account anders heißt: `git remote set-url origin https://github.com/<Account>/VisuStruct-SwiftUI.git`.)

1. Auf [github.com/new](https://github.com/new) ein **leeres** Repository **`VisuStruct-SwiftUI`** anlegen (ohne README, ohne .gitignore).
2. Dann im Projektroot:

```bash
git push -u origin main
```

**Alternative** mit GitHub CLI (einmalig `gh auth login`):

```bash
gh repo create VisuStruct-SwiftUI --public --source=. --remote=origin --push
```

Falls `origin` schon gesetzt ist und `gh` meckert: `git remote remove origin` vor dem `gh`-Befehl, oder nur `git push -u origin main` nach manueller Repo-Erstellung.
