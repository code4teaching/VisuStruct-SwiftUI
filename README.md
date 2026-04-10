# VisuStruct-SwiftUI

SwiftUI-iOS-Editor für Nassi–Shneiderman-Struktogramme (XML/.visustruct, kompatibel zur Java-Version).

Details und Build-Anleitung: **[VisuStruct-iOS/README.md](VisuStruct-iOS/README.md)**

## Auf GitHub laden

Remote **`origin`:** [github.com/code4teaching/VisuStruct-SwiftUI](https://github.com/code4teaching/VisuStruct-SwiftUI)

1. In der Organisation **code4teaching** ein **leeres** Repository **`VisuStruct-SwiftUI`** anlegen (ohne README, ohne .gitignore), oder es muss dort schon existieren.
2. Im Projektroot:

```bash
git push -u origin main
```

**Alternative** mit GitHub CLI (einmalig `gh auth login`, Berechtigung für die Org):

```bash
gh repo create code4teaching/VisuStruct-SwiftUI --public --source=. --remote=origin --push
```

Falls `origin` schon gesetzt ist und `gh` meckert: `git remote remove origin` vor dem `gh`-Befehl, oder nur `git push -u origin main` nach manueller Repo-Erstellung.
