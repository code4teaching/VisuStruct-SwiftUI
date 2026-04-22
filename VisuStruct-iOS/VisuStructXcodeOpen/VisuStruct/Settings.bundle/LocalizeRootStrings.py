#!/usr/bin/env python3
# One-off maintenance: write localized Settings.bundle Root.strings.
# Run from repo: python3 VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/Settings.bundle/LocalizeRootStrings.py
from pathlib import Path

BUNDLE = Path(__file__).resolve().parent

# fmt: off
STRINGS: dict[str, str] = {
"fr": r'''/* VisuStruct — Réglages (système) */
"GROUP_LANGUAGE_TITLE" = "Langue";
"PREF_APP_LANGUAGE_TITLE" = "Langue de l’app";
"LANGUAGE_NAME_DE" = "Allemand";
"LANGUAGE_NAME_EN" = "Anglais";
"LANGUAGE_NAME_ES" = "Espagnol";
"LANGUAGE_NAME_FR" = "Français";
"LANGUAGE_NAME_IT" = "Italien";
"LANGUAGE_NAME_PL" = "Polonais";
"LANGUAGE_NAME_TR" = "Turc";
"LANGUAGE_NAME_KO" = "Coréen";
"LANGUAGE_NAME_JA" = "Japonais";
"LANGUAGE_NAME_EL" = "Grec";
"LANGUAGE_NAME_UK" = "Ukrainien";
"LANGUAGE_NAME_AR" = "Arabe";
"LANGUAGE_NAME_RU" = "Russe";
"LANGUAGE_NAME_HE" = "Hébreu";
"LANGUAGE_NAME_NL" = "Néerlandais";
"LANGUAGE_NAME_SV" = "Suédois";
"LANGUAGE_NAME_DA" = "Danois";
"LANGUAGE_NAME_NB" = "Norvégien (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Chinois (simplifié)";
"LANGUAGE_NAME_ZH_HANT" = "Chinois (traditionnel)";
"LANGUAGE_NAME_PT_PT" = "Portugais";
"LANGUAGE_NAME_JAVA" = "Java (mots-clés)";

"GROUP_UI_SCALE" = "Taille du texte";
"PREF_CANVAS_SCALE" = "Organigramme";
"PREF_INSPECTOR_SCALE" = "Saisie de texte en bas";
"SCALE_S_SMALL" = "Petit";
"SCALE_S_MEDIUM" = "Moyen";
"SCALE_S_LARGE" = "Grand";
"SCALE_S_XL" = "Très grand";

"GROUP_EXPORT" = "Nom de fichier proposé";
"PREF_EXPORT_FORMAT" = "Format";
"EXPORT_VAL_WITH_DATE" = "Avec la date";
"EXPORT_VAL_TITLE_ONLY" = "Sans la date";

"GROUP_CODEGEN_TITLE" = "Génération de code";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Inclure la branche else vide dans le code généré";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Texte du schéma en commentaires";
''',

"es": r'''/* VisuStruct — Ajustes (sistema) */
"GROUP_LANGUAGE_TITLE" = "Idioma";
"PREF_APP_LANGUAGE_TITLE" = "Idioma de la app";
"LANGUAGE_NAME_DE" = "Alemán";
"LANGUAGE_NAME_EN" = "Inglés";
"LANGUAGE_NAME_ES" = "Español";
"LANGUAGE_NAME_FR" = "Francés";
"LANGUAGE_NAME_IT" = "Italiano";
"LANGUAGE_NAME_PL" = "Polaco";
"LANGUAGE_NAME_TR" = "Turco";
"LANGUAGE_NAME_KO" = "Coreano";
"LANGUAGE_NAME_JA" = "Japonés";
"LANGUAGE_NAME_EL" = "Griego";
"LANGUAGE_NAME_UK" = "Ucraniano";
"LANGUAGE_NAME_AR" = "Árabe";
"LANGUAGE_NAME_RU" = "Ruso";
"LANGUAGE_NAME_HE" = "Hebreo";
"LANGUAGE_NAME_NL" = "Neerlandés";
"LANGUAGE_NAME_SV" = "Sueco";
"LANGUAGE_NAME_DA" = "Danés";
"LANGUAGE_NAME_NB" = "Noruego (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Chino (simplificado)";
"LANGUAGE_NAME_ZH_HANT" = "Chino (tradicional)";
"LANGUAGE_NAME_PT_PT" = "Portugués";
"LANGUAGE_NAME_JAVA" = "Java (palabras clave)";

"GROUP_UI_SCALE" = "Tamaño del texto";
"PREF_CANVAS_SCALE" = "Diagrama de estructura";
"PREF_INSPECTOR_SCALE" = "Entrada de texto abajo";
"SCALE_S_SMALL" = "Pequeño";
"SCALE_S_MEDIUM" = "Mediano";
"SCALE_S_LARGE" = "Grande";
"SCALE_S_XL" = "Muy grande";

"GROUP_EXPORT" = "Sugerencia de nombre de archivo";
"PREF_EXPORT_FORMAT" = "Formato";
"EXPORT_VAL_WITH_DATE" = "Con fecha";
"EXPORT_VAL_TITLE_ONLY" = "Sin fecha";

"GROUP_CODEGEN_TITLE" = "Generación de código";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Incluir rama else vacía en el código generado";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Texto del diagrama como comentarios";
''',

"it": r'''/* VisuStruct — Impostazioni (sistema) */
"GROUP_LANGUAGE_TITLE" = "Lingua";
"PREF_APP_LANGUAGE_TITLE" = "Lingua dell’app";
"LANGUAGE_NAME_DE" = "Tedesco";
"LANGUAGE_NAME_EN" = "Inglese";
"LANGUAGE_NAME_ES" = "Spagnolo";
"LANGUAGE_NAME_FR" = "Francese";
"LANGUAGE_NAME_IT" = "Italiano";
"LANGUAGE_NAME_PL" = "Polacco";
"LANGUAGE_NAME_TR" = "Turco";
"LANGUAGE_NAME_KO" = "Coreano";
"LANGUAGE_NAME_JA" = "Giapponese";
"LANGUAGE_NAME_EL" = "Greco";
"LANGUAGE_NAME_UK" = "Ucraino";
"LANGUAGE_NAME_AR" = "Arabo";
"LANGUAGE_NAME_RU" = "Russo";
"LANGUAGE_NAME_HE" = "Ebraico";
"LANGUAGE_NAME_NL" = "Olandese";
"LANGUAGE_NAME_SV" = "Svedese";
"LANGUAGE_NAME_DA" = "Danese";
"LANGUAGE_NAME_NB" = "Norvegese (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Cinese (semplificato)";
"LANGUAGE_NAME_ZH_HANT" = "Cinese (tradizionale)";
"LANGUAGE_NAME_PT_PT" = "Portoghese";
"LANGUAGE_NAME_JAVA" = "Java (parole chiave)";

"GROUP_UI_SCALE" = "Dimensione testo";
"PREF_CANVAS_SCALE" = "Diagramma strutturale";
"PREF_INSPECTOR_SCALE" = "Inserimento testo sotto";
"SCALE_S_SMALL" = "Piccolo";
"SCALE_S_MEDIUM" = "Medio";
"SCALE_S_LARGE" = "Grande";
"SCALE_S_XL" = "Molto grande";

"GROUP_EXPORT" = "Suggerimento nome file";
"PREF_EXPORT_FORMAT" = "Formato";
"EXPORT_VAL_WITH_DATE" = "Con data";
"EXPORT_VAL_TITLE_ONLY" = "Senza data";

"GROUP_CODEGEN_TITLE" = "Generazione codice";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Includi il ramo else vuoto nel codice generato";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Testo del diagramma come commenti";
''',

"pl": r'''/* VisuStruct — Ustawienia (systemowe) */
"GROUP_LANGUAGE_TITLE" = "Język";
"PREF_APP_LANGUAGE_TITLE" = "Język aplikacji";
"LANGUAGE_NAME_DE" = "Niemiecki";
"LANGUAGE_NAME_EN" = "Angielski";
"LANGUAGE_NAME_ES" = "Hiszpański";
"LANGUAGE_NAME_FR" = "Francuski";
"LANGUAGE_NAME_IT" = "Włoski";
"LANGUAGE_NAME_PL" = "Polski";
"LANGUAGE_NAME_TR" = "Turecki";
"LANGUAGE_NAME_KO" = "Koreański";
"LANGUAGE_NAME_JA" = "Japoński";
"LANGUAGE_NAME_EL" = "Grecki";
"LANGUAGE_NAME_UK" = "Ukraiński";
"LANGUAGE_NAME_AR" = "Arabski";
"LANGUAGE_NAME_RU" = "Rosyjski";
"LANGUAGE_NAME_HE" = "Hebrajski";
"LANGUAGE_NAME_NL" = "Niderlandzki";
"LANGUAGE_NAME_SV" = "Szwedzki";
"LANGUAGE_NAME_DA" = "Duński";
"LANGUAGE_NAME_NB" = "Norweski (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Chiński (uproszczony)";
"LANGUAGE_NAME_ZH_HANT" = "Chiński (tradycyjny)";
"LANGUAGE_NAME_PT_PT" = "Portugalski";
"LANGUAGE_NAME_JAVA" = "Java (słowa kluczowe)";

"GROUP_UI_SCALE" = "Rozmiar tekstu";
"PREF_CANVAS_SCALE" = "Schemat strukturalny";
"PREF_INSPECTOR_SCALE" = "Pole tekstowe u dołu";
"SCALE_S_SMALL" = "Mały";
"SCALE_S_MEDIUM" = "Średni";
"SCALE_S_LARGE" = "Duży";
"SCALE_S_XL" = "Bardzo duży";

"GROUP_EXPORT" = "Proponowana nazwa pliku";
"PREF_EXPORT_FORMAT" = "Format";
"EXPORT_VAL_WITH_DATE" = "Z datą";
"EXPORT_VAL_TITLE_ONLY" = "Bez daty";

"GROUP_CODEGEN_TITLE" = "Generowanie kodu";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Uwzględnij pustą gałąź else w generowanym kodzie";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Tekst diagramu jako komentarze";
''',

"tr": r'''/* VisuStruct — Ayarlar (sistem) */
"GROUP_LANGUAGE_TITLE" = "Dil";
"PREF_APP_LANGUAGE_TITLE" = "Uygulama dili";
"LANGUAGE_NAME_DE" = "Almanca";
"LANGUAGE_NAME_EN" = "İngilizce";
"LANGUAGE_NAME_ES" = "İspanyolca";
"LANGUAGE_NAME_FR" = "Fransızca";
"LANGUAGE_NAME_IT" = "İtalyanca";
"LANGUAGE_NAME_PL" = "Lehçe";
"LANGUAGE_NAME_TR" = "Türkçe";
"LANGUAGE_NAME_KO" = "Korece";
"LANGUAGE_NAME_JA" = "Japonca";
"LANGUAGE_NAME_EL" = "Yunanca";
"LANGUAGE_NAME_UK" = "Ukraynaca";
"LANGUAGE_NAME_AR" = "Arapça";
"LANGUAGE_NAME_RU" = "Rusça";
"LANGUAGE_NAME_HE" = "İbranice";
"LANGUAGE_NAME_NL" = "Felemenkçe";
"LANGUAGE_NAME_SV" = "İsveççe";
"LANGUAGE_NAME_DA" = "Danca";
"LANGUAGE_NAME_NB" = "Norveççe (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Çince (basitleştirilmiş)";
"LANGUAGE_NAME_ZH_HANT" = "Çince (geleneksel)";
"LANGUAGE_NAME_PT_PT" = "Portekizce";
"LANGUAGE_NAME_JAVA" = "Java (anahtar kelimeler)";

"GROUP_UI_SCALE" = "Metin boyutu";
"PREF_CANVAS_SCALE" = "Yapı şeması";
"PREF_INSPECTOR_SCALE" = "Alttaki metin alanı";
"SCALE_S_SMALL" = "Küçük";
"SCALE_S_MEDIUM" = "Orta";
"SCALE_S_LARGE" = "Büyük";
"SCALE_S_XL" = "Çok büyük";

"GROUP_EXPORT" = "Dosya adı önerisi";
"PREF_EXPORT_FORMAT" = "Biçim";
"EXPORT_VAL_WITH_DATE" = "Tarihle";
"EXPORT_VAL_TITLE_ONLY" = "Tarihsiz";

"GROUP_CODEGEN_TITLE" = "Kod üretimi";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Üretilen koda boş else dalını dahil et";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Diyagram metnini yorum olarak ekle";
''',

"ko": r'''/* VisuStruct — 설정(시스템) */
"GROUP_LANGUAGE_TITLE" = "언어";
"PREF_APP_LANGUAGE_TITLE" = "앱 언어";
"LANGUAGE_NAME_DE" = "독일어";
"LANGUAGE_NAME_EN" = "영어";
"LANGUAGE_NAME_ES" = "스페인어";
"LANGUAGE_NAME_FR" = "프랑스어";
"LANGUAGE_NAME_IT" = "이탈리아어";
"LANGUAGE_NAME_PL" = "폴란드어";
"LANGUAGE_NAME_TR" = "터키어";
"LANGUAGE_NAME_KO" = "한국어";
"LANGUAGE_NAME_JA" = "일본어";
"LANGUAGE_NAME_EL" = "그리스어";
"LANGUAGE_NAME_UK" = "우크라이나어";
"LANGUAGE_NAME_AR" = "아랍어";
"LANGUAGE_NAME_RU" = "러시아어";
"LANGUAGE_NAME_HE" = "히브리어";
"LANGUAGE_NAME_NL" = "네덜란드어";
"LANGUAGE_NAME_SV" = "스웨덴어";
"LANGUAGE_NAME_DA" = "덴마크어";
"LANGUAGE_NAME_NB" = "노르웨이어(보크몰)";
"LANGUAGE_NAME_ZH_HANS" = "중국어(간체)";
"LANGUAGE_NAME_ZH_HANT" = "중국어(번체)";
"LANGUAGE_NAME_PT_PT" = "포르투갈어";
"LANGUAGE_NAME_JAVA" = "Java(키워드)";

"GROUP_UI_SCALE" = "텍스트 크기";
"PREF_CANVAS_SCALE" = "구조도";
"PREF_INSPECTOR_SCALE" = "하단 텍스트 입력";
"SCALE_S_SMALL" = "작게";
"SCALE_S_MEDIUM" = "보통";
"SCALE_S_LARGE" = "크게";
"SCALE_S_XL" = "아주 크게";

"GROUP_EXPORT" = "파일 이름 제안";
"PREF_EXPORT_FORMAT" = "형식";
"EXPORT_VAL_WITH_DATE" = "날짜 포함";
"EXPORT_VAL_TITLE_ONLY" = "날짜 없음";

"GROUP_CODEGEN_TITLE" = "코드 생성";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "생성된 코드에 빈 else 분기 포함";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "다이어그램 텍스트를 주석으로";
''',

"ja": r'''/* VisuStruct — 設定（システム） */
"GROUP_LANGUAGE_TITLE" = "言語";
"PREF_APP_LANGUAGE_TITLE" = "アプリの言語";
"LANGUAGE_NAME_DE" = "ドイツ語";
"LANGUAGE_NAME_EN" = "英語";
"LANGUAGE_NAME_ES" = "スペイン語";
"LANGUAGE_NAME_FR" = "フランス語";
"LANGUAGE_NAME_IT" = "イタリア語";
"LANGUAGE_NAME_PL" = "ポーランド語";
"LANGUAGE_NAME_TR" = "トルコ語";
"LANGUAGE_NAME_KO" = "韓国語";
"LANGUAGE_NAME_JA" = "日本語";
"LANGUAGE_NAME_EL" = "ギリシャ語";
"LANGUAGE_NAME_UK" = "ウクライナ語";
"LANGUAGE_NAME_AR" = "アラビア語";
"LANGUAGE_NAME_RU" = "ロシア語";
"LANGUAGE_NAME_HE" = "ヘブライ語";
"LANGUAGE_NAME_NL" = "オランダ語";
"LANGUAGE_NAME_SV" = "スウェーデン語";
"LANGUAGE_NAME_DA" = "デンマーク語";
"LANGUAGE_NAME_NB" = "ノルウェー語（ブークモール）";
"LANGUAGE_NAME_ZH_HANS" = "中国語（簡体）";
"LANGUAGE_NAME_ZH_HANT" = "中国語（繁体）";
"LANGUAGE_NAME_PT_PT" = "ポルトガル語";
"LANGUAGE_NAME_JAVA" = "Java（キーワード）";

"GROUP_UI_SCALE" = "文字サイズ";
"PREF_CANVAS_SCALE" = "ストラクチャ図";
"PREF_INSPECTOR_SCALE" = "下部のテキスト入力";
"SCALE_S_SMALL" = "小";
"SCALE_S_MEDIUM" = "中";
"SCALE_S_LARGE" = "大";
"SCALE_S_XL" = "特大";

"GROUP_EXPORT" = "ファイル名の候補";
"PREF_EXPORT_FORMAT" = "形式";
"EXPORT_VAL_WITH_DATE" = "日付付き";
"EXPORT_VAL_TITLE_ONLY" = "日付なし";

"GROUP_CODEGEN_TITLE" = "コード生成";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "生成コードに空の else 分岐を含める";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "図のテキストをコメントとして出力";
''',

"el": r'''/* VisuStruct — Ρυθμίσεις (συστήματος) */
"GROUP_LANGUAGE_TITLE" = "Γλώσσα";
"PREF_APP_LANGUAGE_TITLE" = "Γλώσσα εφαρμογής";
"LANGUAGE_NAME_DE" = "Γερμανικά";
"LANGUAGE_NAME_EN" = "Αγγλικά";
"LANGUAGE_NAME_ES" = "Ισπανικά";
"LANGUAGE_NAME_FR" = "Γαλλικά";
"LANGUAGE_NAME_IT" = "Ιταλικά";
"LANGUAGE_NAME_PL" = "Πολωνικά";
"LANGUAGE_NAME_TR" = "Τουρκικά";
"LANGUAGE_NAME_KO" = "Κορεατικά";
"LANGUAGE_NAME_JA" = "Ιαπωνικά";
"LANGUAGE_NAME_EL" = "Ελληνικά";
"LANGUAGE_NAME_UK" = "Ουκρανικά";
"LANGUAGE_NAME_AR" = "Αραβικά";
"LANGUAGE_NAME_RU" = "Ρωσικά";
"LANGUAGE_NAME_HE" = "Εβραϊκά";
"LANGUAGE_NAME_NL" = "Ολλανδικά";
"LANGUAGE_NAME_SV" = "Σουηδικά";
"LANGUAGE_NAME_DA" = "Δανικά";
"LANGUAGE_NAME_NB" = "Νορβηγικά (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Κινεζικά (απλοποιημένα)";
"LANGUAGE_NAME_ZH_HANT" = "Κινεζικά (παραδοσιακά)";
"LANGUAGE_NAME_PT_PT" = "Πορτογαλικά";
"LANGUAGE_NAME_JAVA" = "Java (λέξεις-κλειδιά)";

"GROUP_UI_SCALE" = "Μέγεθος κειμένου";
"PREF_CANVAS_SCALE" = "Χάρτης δομής";
"PREF_INSPECTOR_SCALE" = "Καταχώριση κειμένου κάτω";
"SCALE_S_SMALL" = "Μικρό";
"SCALE_S_MEDIUM" = "Μεσαίο";
"SCALE_S_LARGE" = "Μεγάλο";
"SCALE_S_XL" = "Πολύ μεγάλο";

"GROUP_EXPORT" = "Πρόταση ονόματος αρχείου";
"PREF_EXPORT_FORMAT" = "Μορφή";
"EXPORT_VAL_WITH_DATE" = "Με ημερομηνία";
"EXPORT_VAL_TITLE_ONLY" = "Χωρίς ημερομηνία";

"GROUP_CODEGEN_TITLE" = "Δημιουργία κώδικα";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Συμπερίληψη κενού else στον παραγόμενο κώδικα";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Κείμενο διαγράμματος ως σχόλια";
''',

"uk": r'''/* VisuStruct — Налаштування (система) */
"GROUP_LANGUAGE_TITLE" = "Мова";
"PREF_APP_LANGUAGE_TITLE" = "Мова програми";
"LANGUAGE_NAME_DE" = "Німецька";
"LANGUAGE_NAME_EN" = "Англійська";
"LANGUAGE_NAME_ES" = "Іспанська";
"LANGUAGE_NAME_FR" = "Французька";
"LANGUAGE_NAME_IT" = "Італійська";
"LANGUAGE_NAME_PL" = "Польська";
"LANGUAGE_NAME_TR" = "Турецька";
"LANGUAGE_NAME_KO" = "Корейська";
"LANGUAGE_NAME_JA" = "Японська";
"LANGUAGE_NAME_EL" = "Грецька";
"LANGUAGE_NAME_UK" = "Українська";
"LANGUAGE_NAME_AR" = "Арабська";
"LANGUAGE_NAME_RU" = "Російська";
"LANGUAGE_NAME_HE" = "Іврит";
"LANGUAGE_NAME_NL" = "Нідерландська";
"LANGUAGE_NAME_SV" = "Шведська";
"LANGUAGE_NAME_DA" = "Данська";
"LANGUAGE_NAME_NB" = "Норвезька (бокмол)";
"LANGUAGE_NAME_ZH_HANS" = "Китайська (спрощена)";
"LANGUAGE_NAME_ZH_HANT" = "Китайська (традиційна)";
"LANGUAGE_NAME_PT_PT" = "Португальська";
"LANGUAGE_NAME_JAVA" = "Java (ключові слова)";

"GROUP_UI_SCALE" = "Розмір тексту";
"PREF_CANVAS_SCALE" = "Структурна діаграма";
"PREF_INSPECTOR_SCALE" = "Введення тексту внизу";
"SCALE_S_SMALL" = "Малий";
"SCALE_S_MEDIUM" = "Середній";
"SCALE_S_LARGE" = "Великий";
"SCALE_S_XL" = "Дуже великий";

"GROUP_EXPORT" = "Пропонована назва файлу";
"PREF_EXPORT_FORMAT" = "Формат";
"EXPORT_VAL_WITH_DATE" = "З датою";
"EXPORT_VAL_TITLE_ONLY" = "Без дати";

"GROUP_CODEGEN_TITLE" = "Генерація коду";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Додавати порожню гілку else в згенерований код";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Текст діаграми як коментарі";
''',

"ar": r'''/* VisuStruct — الإعدادات (النظام) */
"GROUP_LANGUAGE_TITLE" = "اللغة";
"PREF_APP_LANGUAGE_TITLE" = "لغة التطبيق";
"LANGUAGE_NAME_DE" = "الألمانية";
"LANGUAGE_NAME_EN" = "الإنجليزية";
"LANGUAGE_NAME_ES" = "الإسبانية";
"LANGUAGE_NAME_FR" = "الفرنسية";
"LANGUAGE_NAME_IT" = "الإيطالية";
"LANGUAGE_NAME_PL" = "البولندية";
"LANGUAGE_NAME_TR" = "التركية";
"LANGUAGE_NAME_KO" = "الكورية";
"LANGUAGE_NAME_JA" = "اليابانية";
"LANGUAGE_NAME_EL" = "اليونانية";
"LANGUAGE_NAME_UK" = "الأوكرانية";
"LANGUAGE_NAME_AR" = "العربية";
"LANGUAGE_NAME_RU" = "الروسية";
"LANGUAGE_NAME_HE" = "العبرية";
"LANGUAGE_NAME_NL" = "الهولندية";
"LANGUAGE_NAME_SV" = "السويدية";
"LANGUAGE_NAME_DA" = "الدنماركية";
"LANGUAGE_NAME_NB" = "النرويجية (بوكمول)";
"LANGUAGE_NAME_ZH_HANS" = "الصينية (المبسّطة)";
"LANGUAGE_NAME_ZH_HANT" = "الصينية (التقليدية)";
"LANGUAGE_NAME_PT_PT" = "البرتغالية";
"LANGUAGE_NAME_JAVA" = "Java (كلمات مفتاحية)";

"GROUP_UI_SCALE" = "حجم النص";
"PREF_CANVAS_SCALE" = "مخطط البنية";
"PREF_INSPECTOR_SCALE" = "إدخال النص في الأسفل";
"SCALE_S_SMALL" = "صغير";
"SCALE_S_MEDIUM" = "متوسط";
"SCALE_S_LARGE" = "كبير";
"SCALE_S_XL" = "كبير جدًا";

"GROUP_EXPORT" = "اقتراح اسم الملف";
"PREF_EXPORT_FORMAT" = "الصيغة";
"EXPORT_VAL_WITH_DATE" = "مع التاريخ";
"EXPORT_VAL_TITLE_ONLY" = "بدون تاريخ";

"GROUP_CODEGEN_TITLE" = "إنشاء الشفرة";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "تضمين فرع else الفارغ في الشفرة المُنشأة";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "نص المخطط كتعليقات";
''',

"he": r'''/* VisuStruct — הגדרות (מערכת) */
"GROUP_LANGUAGE_TITLE" = "שפה";
"PREF_APP_LANGUAGE_TITLE" = "שפת האפליקציה";
"LANGUAGE_NAME_DE" = "גרמנית";
"LANGUAGE_NAME_EN" = "אנגלית";
"LANGUAGE_NAME_ES" = "ספרדית";
"LANGUAGE_NAME_FR" = "צרפתית";
"LANGUAGE_NAME_IT" = "איטלקית";
"LANGUAGE_NAME_PL" = "פולנית";
"LANGUAGE_NAME_TR" = "טורקית";
"LANGUAGE_NAME_KO" = "קוריאנית";
"LANGUAGE_NAME_JA" = "יפנית";
"LANGUAGE_NAME_EL" = "יוונית";
"LANGUAGE_NAME_UK" = "אוקראינית";
"LANGUAGE_NAME_AR" = "ערבית";
"LANGUAGE_NAME_RU" = "רוסית";
"LANGUAGE_NAME_HE" = "עברית";
"LANGUAGE_NAME_NL" = "הולנדית";
"LANGUAGE_NAME_SV" = "שוודית";
"LANGUAGE_NAME_DA" = "דנית";
"LANGUAGE_NAME_NB" = "נורווגית (בוקמול)";
"LANGUAGE_NAME_ZH_HANS" = "סינית (מפושטת)";
"LANGUAGE_NAME_ZH_HANT" = "סינית (מסורתית)";
"LANGUAGE_NAME_PT_PT" = "פורטוגזית";
"LANGUAGE_NAME_JAVA" = "Java (מילות מפתח)";

"GROUP_UI_SCALE" = "גודל טקסט";
"PREF_CANVAS_SCALE" = "תרשים מבנה";
"PREF_INSPECTOR_SCALE" = "הקלדה בתחתית";
"SCALE_S_SMALL" = "קטן";
"SCALE_S_MEDIUM" = "בינוני";
"SCALE_S_LARGE" = "גדול";
"SCALE_S_XL" = "גדול מאוד";

"GROUP_EXPORT" = "הצעה לשם קובץ";
"PREF_EXPORT_FORMAT" = "תבנית";
"EXPORT_VAL_WITH_DATE" = "עם תאריך";
"EXPORT_VAL_TITLE_ONLY" = "ללא תאריך";

"GROUP_CODEGEN_TITLE" = "יצירת קוד";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "לכלול ענף else ריק בקוד שנוצר";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "טקסט התרשים כהערות";
''',

"nl": r'''/* VisuStruct — Instellingen (systeem) */
"GROUP_LANGUAGE_TITLE" = "Taal";
"PREF_APP_LANGUAGE_TITLE" = "App-taal";
"LANGUAGE_NAME_DE" = "Duits";
"LANGUAGE_NAME_EN" = "Engels";
"LANGUAGE_NAME_ES" = "Spaans";
"LANGUAGE_NAME_FR" = "Frans";
"LANGUAGE_NAME_IT" = "Italiaans";
"LANGUAGE_NAME_PL" = "Pools";
"LANGUAGE_NAME_TR" = "Turks";
"LANGUAGE_NAME_KO" = "Koreaans";
"LANGUAGE_NAME_JA" = "Japans";
"LANGUAGE_NAME_EL" = "Grieks";
"LANGUAGE_NAME_UK" = "Oekraïens";
"LANGUAGE_NAME_AR" = "Arabisch";
"LANGUAGE_NAME_RU" = "Russisch";
"LANGUAGE_NAME_HE" = "Hebreeuws";
"LANGUAGE_NAME_NL" = "Nederlands";
"LANGUAGE_NAME_SV" = "Zweeds";
"LANGUAGE_NAME_DA" = "Deens";
"LANGUAGE_NAME_NB" = "Noors (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Chinees (vereenvoudigd)";
"LANGUAGE_NAME_ZH_HANT" = "Chinees (traditioneel)";
"LANGUAGE_NAME_PT_PT" = "Portugees";
"LANGUAGE_NAME_JAVA" = "Java (trefwoorden)";

"GROUP_UI_SCALE" = "Tekstgrootte";
"PREF_CANVAS_SCALE" = "Structuurdiagram";
"PREF_INSPECTOR_SCALE" = "Tekstinvoer onderaan";
"SCALE_S_SMALL" = "Klein";
"SCALE_S_MEDIUM" = "Gemiddeld";
"SCALE_S_LARGE" = "Groot";
"SCALE_S_XL" = "Extra groot";

"GROUP_EXPORT" = "Bestandsnaamsuggestie";
"PREF_EXPORT_FORMAT" = "Formaat";
"EXPORT_VAL_WITH_DATE" = "Met datum";
"EXPORT_VAL_TITLE_ONLY" = "Zonder datum";

"GROUP_CODEGEN_TITLE" = "Code genereren";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Lege else-tak in gegenereerde code opnemen";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Diagramtekst als opmerkingen";
''',

"sv": r'''/* VisuStruct — Inställningar (system) */
"GROUP_LANGUAGE_TITLE" = "Språk";
"PREF_APP_LANGUAGE_TITLE" = "Appens språk";
"LANGUAGE_NAME_DE" = "Tyska";
"LANGUAGE_NAME_EN" = "Engelska";
"LANGUAGE_NAME_ES" = "Spanska";
"LANGUAGE_NAME_FR" = "Franska";
"LANGUAGE_NAME_IT" = "Italienska";
"LANGUAGE_NAME_PL" = "Polska";
"LANGUAGE_NAME_TR" = "Turkiska";
"LANGUAGE_NAME_KO" = "Koreanska";
"LANGUAGE_NAME_JA" = "Japanska";
"LANGUAGE_NAME_EL" = "Grekiska";
"LANGUAGE_NAME_UK" = "Ukrainska";
"LANGUAGE_NAME_AR" = "Arabiska";
"LANGUAGE_NAME_RU" = "Ryska";
"LANGUAGE_NAME_HE" = "Hebreiska";
"LANGUAGE_NAME_NL" = "Nederländska";
"LANGUAGE_NAME_SV" = "Svenska";
"LANGUAGE_NAME_DA" = "Danska";
"LANGUAGE_NAME_NB" = "Norska (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Kinesiska (förenklad)";
"LANGUAGE_NAME_ZH_HANT" = "Kinesiska (traditionell)";
"LANGUAGE_NAME_PT_PT" = "Portugisiska";
"LANGUAGE_NAME_JAVA" = "Java (nyckelord)";

"GROUP_UI_SCALE" = "Textstorlek";
"PREF_CANVAS_SCALE" = "Strukturdiagram";
"PREF_INSPECTOR_SCALE" = "Textinmatning nedan";
"SCALE_S_SMALL" = "Liten";
"SCALE_S_MEDIUM" = "Mellan";
"SCALE_S_LARGE" = "Stor";
"SCALE_S_XL" = "Extra stor";

"GROUP_EXPORT" = "Förslag på filnamn";
"PREF_EXPORT_FORMAT" = "Format";
"EXPORT_VAL_WITH_DATE" = "Med datum";
"EXPORT_VAL_TITLE_ONLY" = "Utan datum";

"GROUP_CODEGEN_TITLE" = "Kodgenerering";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Inkludera tom else-gren i genererad kod";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Diagramtext som kommentarer";
''',

"da": r'''/* VisuStruct — Indstillinger (system) */
"GROUP_LANGUAGE_TITLE" = "Sprog";
"PREF_APP_LANGUAGE_TITLE" = "Appens sprog";
"LANGUAGE_NAME_DE" = "Tysk";
"LANGUAGE_NAME_EN" = "Engelsk";
"LANGUAGE_NAME_ES" = "Spansk";
"LANGUAGE_NAME_FR" = "Fransk";
"LANGUAGE_NAME_IT" = "Italiensk";
"LANGUAGE_NAME_PL" = "Polsk";
"LANGUAGE_NAME_TR" = "Tyrkisk";
"LANGUAGE_NAME_KO" = "Koreansk";
"LANGUAGE_NAME_JA" = "Japansk";
"LANGUAGE_NAME_EL" = "Græsk";
"LANGUAGE_NAME_UK" = "Ukrainsk";
"LANGUAGE_NAME_AR" = "Arabisk";
"LANGUAGE_NAME_RU" = "Russisk";
"LANGUAGE_NAME_HE" = "Hebraisk";
"LANGUAGE_NAME_NL" = "Hollandsk";
"LANGUAGE_NAME_SV" = "Svensk";
"LANGUAGE_NAME_DA" = "Dansk";
"LANGUAGE_NAME_NB" = "Norsk (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Kinesisk (forenklet)";
"LANGUAGE_NAME_ZH_HANT" = "Kinesisk (traditionel)";
"LANGUAGE_NAME_PT_PT" = "Portugisisk";
"LANGUAGE_NAME_JAVA" = "Java (nøgleord)";

"GROUP_UI_SCALE" = "Tekststørrelse";
"PREF_CANVAS_SCALE" = "Strukturdiagram";
"PREF_INSPECTOR_SCALE" = "Tekstindtastning nedenfor";
"SCALE_S_SMALL" = "Lille";
"SCALE_S_MEDIUM" = "Mellem";
"SCALE_S_LARGE" = "Stor";
"SCALE_S_XL" = "Meget stor";

"GROUP_EXPORT" = "Forslag til filnavn";
"PREF_EXPORT_FORMAT" = "Format";
"EXPORT_VAL_WITH_DATE" = "Med dato";
"EXPORT_VAL_TITLE_ONLY" = "Uden dato";

"GROUP_CODEGEN_TITLE" = "Kodegenerering";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Medtag tom else-gren i genereret kode";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Diagramtekst som kommentarer";
''',

"nb": r'''/* VisuStruct — Innstillinger (system) */
"GROUP_LANGUAGE_TITLE" = "Språk";
"PREF_APP_LANGUAGE_TITLE" = "Appens språk";
"LANGUAGE_NAME_DE" = "Tysk";
"LANGUAGE_NAME_EN" = "Engelsk";
"LANGUAGE_NAME_ES" = "Spansk";
"LANGUAGE_NAME_FR" = "Fransk";
"LANGUAGE_NAME_IT" = "Italiensk";
"LANGUAGE_NAME_PL" = "Polsk";
"LANGUAGE_NAME_TR" = "Tyrkisk";
"LANGUAGE_NAME_KO" = "Koreansk";
"LANGUAGE_NAME_JA" = "Japansk";
"LANGUAGE_NAME_EL" = "Gresk";
"LANGUAGE_NAME_UK" = "Ukrainsk";
"LANGUAGE_NAME_AR" = "Arabisk";
"LANGUAGE_NAME_RU" = "Russisk";
"LANGUAGE_NAME_HE" = "Hebraisk";
"LANGUAGE_NAME_NL" = "Nederlandsk";
"LANGUAGE_NAME_SV" = "Svensk";
"LANGUAGE_NAME_DA" = "Dansk";
"LANGUAGE_NAME_NB" = "Norsk (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Kinesisk (forenklet)";
"LANGUAGE_NAME_ZH_HANT" = "Kinesisk (tradisjonell)";
"LANGUAGE_NAME_PT_PT" = "Portugisisk";
"LANGUAGE_NAME_JAVA" = "Java (nøkkelord)";

"GROUP_UI_SCALE" = "Tekststørrelse";
"PREF_CANVAS_SCALE" = "Strukturdiagram";
"PREF_INSPECTOR_SCALE" = "Tekstinndata nederst";
"SCALE_S_SMALL" = "Liten";
"SCALE_S_MEDIUM" = "Middels";
"SCALE_S_LARGE" = "Stor";
"SCALE_S_XL" = "Ekstra stor";

"GROUP_EXPORT" = "Foreslått filnavn";
"PREF_EXPORT_FORMAT" = "Format";
"EXPORT_VAL_WITH_DATE" = "Med dato";
"EXPORT_VAL_TITLE_ONLY" = "Uten dato";

"GROUP_CODEGEN_TITLE" = "Kodegenerering";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Ta med tom else-gren i generert kode";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Diagramtekst som kommentarer";
''',

"pt-PT": r'''/* VisuStruct — Definições (sistema) */
"GROUP_LANGUAGE_TITLE" = "Idioma";
"PREF_APP_LANGUAGE_TITLE" = "Idioma da aplicação";
"LANGUAGE_NAME_DE" = "Alemão";
"LANGUAGE_NAME_EN" = "Inglês";
"LANGUAGE_NAME_ES" = "Espanhol";
"LANGUAGE_NAME_FR" = "Francês";
"LANGUAGE_NAME_IT" = "Italiano";
"LANGUAGE_NAME_PL" = "Polaco";
"LANGUAGE_NAME_TR" = "Turco";
"LANGUAGE_NAME_KO" = "Coreano";
"LANGUAGE_NAME_JA" = "Japonês";
"LANGUAGE_NAME_EL" = "Grego";
"LANGUAGE_NAME_UK" = "Ucraniano";
"LANGUAGE_NAME_AR" = "Árabe";
"LANGUAGE_NAME_RU" = "Russo";
"LANGUAGE_NAME_HE" = "Hebraico";
"LANGUAGE_NAME_NL" = "Neerlandês";
"LANGUAGE_NAME_SV" = "Sueco";
"LANGUAGE_NAME_DA" = "Dinamarquês";
"LANGUAGE_NAME_NB" = "Norueguês (bokmål)";
"LANGUAGE_NAME_ZH_HANS" = "Chinês (simplificado)";
"LANGUAGE_NAME_ZH_HANT" = "Chinês (tradicional)";
"LANGUAGE_NAME_PT_PT" = "Português";
"LANGUAGE_NAME_JAVA" = "Java (palavras-chave)";

"GROUP_UI_SCALE" = "Tamanho do texto";
"PREF_CANVAS_SCALE" = "Diagrama de estrutura";
"PREF_INSPECTOR_SCALE" = "Entrada de texto em baixo";
"SCALE_S_SMALL" = "Pequeno";
"SCALE_S_MEDIUM" = "Médio";
"SCALE_S_LARGE" = "Grande";
"SCALE_S_XL" = "Muito grande";

"GROUP_EXPORT" = "Sugestão de nome de ficheiro";
"PREF_EXPORT_FORMAT" = "Formato";
"EXPORT_VAL_WITH_DATE" = "Com data";
"EXPORT_VAL_TITLE_ONLY" = "Sem data";

"GROUP_CODEGEN_TITLE" = "Geração de código";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Incluir ramo else vazio no código gerado";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Texto do diagrama como comentários";
''',

"ru": r'''/* VisuStruct — Настройки (система) */
"GROUP_LANGUAGE_TITLE" = "Язык";
"PREF_APP_LANGUAGE_TITLE" = "Язык приложения";
"LANGUAGE_NAME_DE" = "Немецкий";
"LANGUAGE_NAME_EN" = "Английский";
"LANGUAGE_NAME_ES" = "Испанский";
"LANGUAGE_NAME_FR" = "Французский";
"LANGUAGE_NAME_IT" = "Итальянский";
"LANGUAGE_NAME_PL" = "Польский";
"LANGUAGE_NAME_TR" = "Турецкий";
"LANGUAGE_NAME_KO" = "Корейский";
"LANGUAGE_NAME_JA" = "Японский";
"LANGUAGE_NAME_EL" = "Греческий";
"LANGUAGE_NAME_UK" = "Украинский";
"LANGUAGE_NAME_AR" = "Арабский";
"LANGUAGE_NAME_RU" = "Русский";
"LANGUAGE_NAME_HE" = "Иврит";
"LANGUAGE_NAME_NL" = "Нидерландский";
"LANGUAGE_NAME_SV" = "Шведский";
"LANGUAGE_NAME_DA" = "Датский";
"LANGUAGE_NAME_NB" = "Норвежский (бокмол)";
"LANGUAGE_NAME_ZH_HANS" = "Китайский (упрощённый)";
"LANGUAGE_NAME_ZH_HANT" = "Китайский (традиционный)";
"LANGUAGE_NAME_PT_PT" = "Португальский";
"LANGUAGE_NAME_JAVA" = "Java (ключевые слова)";

"GROUP_UI_SCALE" = "Размер текста";
"PREF_CANVAS_SCALE" = "Структурная диаграмма";
"PREF_INSPECTOR_SCALE" = "Ввод текста внизу";
"SCALE_S_SMALL" = "Маленький";
"SCALE_S_MEDIUM" = "Средний";
"SCALE_S_LARGE" = "Крупный";
"SCALE_S_XL" = "Очень крупный";

"GROUP_EXPORT" = "Предлагаемое имя файла";
"PREF_EXPORT_FORMAT" = "Формат";
"EXPORT_VAL_WITH_DATE" = "С датой";
"EXPORT_VAL_TITLE_ONLY" = "Без даты";

"GROUP_CODEGEN_TITLE" = "Генерация кода";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "Включать пустую ветвь else в генерируемый код";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "Текст схемы в виде комментариев";
''',

"zh-Hans": r'''/* VisuStruct — 设置（系统） */
"GROUP_LANGUAGE_TITLE" = "语言";
"PREF_APP_LANGUAGE_TITLE" = "应用语言";
"LANGUAGE_NAME_DE" = "德语";
"LANGUAGE_NAME_EN" = "英语";
"LANGUAGE_NAME_ES" = "西班牙语";
"LANGUAGE_NAME_FR" = "法语";
"LANGUAGE_NAME_IT" = "意大利语";
"LANGUAGE_NAME_PL" = "波兰语";
"LANGUAGE_NAME_TR" = "土耳其语";
"LANGUAGE_NAME_KO" = "韩语";
"LANGUAGE_NAME_JA" = "日语";
"LANGUAGE_NAME_EL" = "希腊语";
"LANGUAGE_NAME_UK" = "乌克兰语";
"LANGUAGE_NAME_AR" = "阿拉伯语";
"LANGUAGE_NAME_RU" = "俄语";
"LANGUAGE_NAME_HE" = "希伯来语";
"LANGUAGE_NAME_NL" = "荷兰语";
"LANGUAGE_NAME_SV" = "瑞典语";
"LANGUAGE_NAME_DA" = "丹麦语";
"LANGUAGE_NAME_NB" = "挪威语（书面挪威语）";
"LANGUAGE_NAME_ZH_HANS" = "中文（简体）";
"LANGUAGE_NAME_ZH_HANT" = "中文（繁体）";
"LANGUAGE_NAME_PT_PT" = "葡萄牙语";
"LANGUAGE_NAME_JAVA" = "Java（关键字）";

"GROUP_UI_SCALE" = "文字大小";
"PREF_CANVAS_SCALE" = "结构图";
"PREF_INSPECTOR_SCALE" = "下方文本输入";
"SCALE_S_SMALL" = "小";
"SCALE_S_MEDIUM" = "中";
"SCALE_S_LARGE" = "大";
"SCALE_S_XL" = "特大";

"GROUP_EXPORT" = "文件名建议";
"PREF_EXPORT_FORMAT" = "格式";
"EXPORT_VAL_WITH_DATE" = "带日期";
"EXPORT_VAL_TITLE_ONLY" = "不带日期";

"GROUP_CODEGEN_TITLE" = "代码生成";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "在生成的代码中包含空的 else 分支";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "将图表文本作为注释";
''',

"zh-Hant": r'''/* VisuStruct — 設定（系統） */
"GROUP_LANGUAGE_TITLE" = "語言";
"PREF_APP_LANGUAGE_TITLE" = "App 語言";
"LANGUAGE_NAME_DE" = "德語";
"LANGUAGE_NAME_EN" = "英語";
"LANGUAGE_NAME_ES" = "西班牙語";
"LANGUAGE_NAME_FR" = "法語";
"LANGUAGE_NAME_IT" = "義大利語";
"LANGUAGE_NAME_PL" = "波蘭語";
"LANGUAGE_NAME_TR" = "土耳其語";
"LANGUAGE_NAME_KO" = "韓語";
"LANGUAGE_NAME_JA" = "日語";
"LANGUAGE_NAME_EL" = "希臘語";
"LANGUAGE_NAME_UK" = "烏克蘭語";
"LANGUAGE_NAME_AR" = "阿拉伯語";
"LANGUAGE_NAME_RU" = "俄語";
"LANGUAGE_NAME_HE" = "希伯來語";
"LANGUAGE_NAME_NL" = "荷蘭語";
"LANGUAGE_NAME_SV" = "瑞典語";
"LANGUAGE_NAME_DA" = "丹麥語";
"LANGUAGE_NAME_NB" = "挪威語（書面挪威語）";
"LANGUAGE_NAME_ZH_HANS" = "中文（簡體）";
"LANGUAGE_NAME_ZH_HANT" = "中文（繁體）";
"LANGUAGE_NAME_PT_PT" = "葡萄牙語";
"LANGUAGE_NAME_JAVA" = "Java（關鍵字）";

"GROUP_UI_SCALE" = "文字大小";
"PREF_CANVAS_SCALE" = "結構圖";
"PREF_INSPECTOR_SCALE" = "下方文字輸入";
"SCALE_S_SMALL" = "小";
"SCALE_S_MEDIUM" = "中";
"SCALE_S_LARGE" = "大";
"SCALE_S_XL" = "特大";

"GROUP_EXPORT" = "檔名建議";
"PREF_EXPORT_FORMAT" = "格式";
"EXPORT_VAL_WITH_DATE" = "含日期";
"EXPORT_VAL_TITLE_ONLY" = "不含日期";

"GROUP_CODEGEN_TITLE" = "產生程式碼";
"PREF_CODEGEN_INCLUDE_EMPTY_ELSE" = "在產生的程式碼中加入空的 else 分支";
"PREF_CODEGEN_DIAGRAM_COMMENTS" = "將圖表文字作為註解";
''',
}
# fmt: on


def main() -> None:
    for name, text in STRINGS.items():
        path = BUNDLE / f"{name}.lproj" / "Root.strings"
        path.write_text(text.strip() + "\n", encoding="utf-8")
        print("wrote", path.relative_to(BUNDLE))

    for keep in ("en", "de"):
        p = BUNDLE / f"{keep}.lproj" / "Root.strings"
        assert p.exists(), p


if __name__ == "__main__":
    main()
