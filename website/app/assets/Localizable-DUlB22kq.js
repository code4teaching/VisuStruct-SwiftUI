const e=`/* Palette */
"palette_header" = "Elemente";

/* Aktionen */
"action_share_png" = "Grafik teilen …";
"action_share_document" = "Datei teilen …";
"action_export_pdf" = "PDF-Vorschau …";
"action_generate_code" = "Code erzeugen …";
"action_simulation" = "Simulation";
"action_diagram" = "Diagramm";
"simulation_placeholder_body" = "Der Simulationsmodus führt das Diagramm Schritt für Schritt aus, markiert das aktuelle Element und zeigt Variablenwerte und Ausgaben.";
"simulation_controls" = "Steuerung";
"simulation_highlight_label" = "Markierung";
"simulation_highlight_last" = "Letzter Schritt";
"simulation_highlight_next" = "Nächster Schritt";
"simulation_not_available" = "Play führt die Simulation automatisch mit 0,5 Sekunden Pause pro Schritt aus.";
"simulation_play" = "Start";
"simulation_pause" = "Pause";
"simulation_step" = "Schritt";
"simulation_stop" = "Stopp";
"simulation_input" = "Eingabe";
"simulation_input_placeholder" = "Keine Eingabe erforderlich.";
"simulation_input_submit" = "OK";
"simulation_input_invalid_int" = "Bitte eine ganze Zahl eingeben.";
"simulation_trace" = "Letzter Schritt";
"simulation_trace_placeholder" = "Noch kein Schritt ausgeführt.";
"simulation_variables" = "Variablen";
"simulation_variables_placeholder" = "Noch keine Variablen.";
"simulation_output" = "Ausgabe";
"simulation_output_placeholder" = "Noch keine Ausgabe.";
"action_delete_selection" = "Auswahl löschen";
"ctx_copy" = "Kopieren";
"ctx_cut" = "Ausschneiden";
"ctx_paste" = "Einfügen";
"action_settings" = "Einstellungen";
"action_about" = "Über VisuStruct";
"recent_files_menu" = "Zuletzt verwendet";
"recent_files_empty" = "Keine zuletzt verwendeten Dateien";
"recent_files_clear" = "Liste leeren";
"recent_files_unavailable" = "Datei ist nicht mehr verfügbar.";

/* Einstellungen (In-App) */
"settings_language_title" = "Sprache";
"settings_language_de" = "Deutsch";
"settings_language_en" = "Englisch";
"settings_language_es" = "Spanisch";
"settings_language_fr" = "Französisch";
"settings_language_it" = "Italienisch";
"settings_language_pl" = "Polnisch";
"settings_language_tr" = "Türkisch";
"settings_language_ko" = "Koreanisch";
"settings_language_ja" = "Japanisch";
"settings_language_el" = "Griechisch";
"settings_language_uk" = "Ukrainisch";
"settings_language_ar" = "Arabisch";
"settings_language_ru" = "Russisch";
"settings_language_he" = "Hebräisch";
"settings_language_zh_hans" = "Chinesisch (vereinfacht)";
"settings_language_zh_hant" = "Chinesisch (traditionell)";
"settings_language_ptpt" = "Portugiesisch";
"settings_language_java" = "Java (Schlüsselwörter)";



"settings_ui_scale_section" = "Textgröße";
"settings_ui_scale_canvas" = "Struktogramm";
"settings_ui_scale_inspector" = "Eingabe unten";
"settings_ui_scale_small" = "Klein";
"settings_ui_scale_medium" = "Mittel";
"settings_ui_scale_large" = "Groß";
"settings_ui_scale_extra_large" = "Sehr groß";

"settings_export_filename_section" = "Dateivorschlag";
"settings_export_filename_picker" = "Format";
"settings_export_filename_date_title" = "Mit Datum";
"settings_export_filename_title_only" = "Ohne Datum";
"settings_export_filename_footer_with_date" = "Mit Datum: yyyy-mm-dd-Filename.visustruct";
"settings_export_filename_footer_without_date" = "Ohne Datum: Filename.visustruct";


/* Fehler-Overlay */
"error_title" = "Fehler";
"error_back_editor" = "Zurück zum Editor";

/* Toolbar */
"toolbar_undo" = "Rückgängig";
"toolbar_redo" = "Wiederholen";
"toolbar_new" = "Neu";
"menu_open" = "Öffnen …";
"menu_save" = "Speichern";
"menu_save_as" = "Speichern unter …";
"menu_print" = "Drucken …";
"menu_file" = "Ablage";
"menu_new" = "Neu";
"menu_close" = "Schließen";

/* Barrierefreiheit */
"a11y_generate_code" = "Code aus dem Struktogramm erzeugen";
"a11y_generate_code_locked" = "Code erzeugen, nach dem Kauf verfügbar";
"a11y_unsaved_changes" = "Ungespeicherte Änderungen";

/* Code-Generator (IAP folgt) */
"codegen_gate_title" = "Code erzeugen";
"codegen_gate_body" = "Java-, Python- und JavaScript-Code aus dem Struktogramm wird über einen In-App-Kauf freigeschaltet (demnächst).";
"codegen_gate_ok" = "OK";
"codegen_placeholder_title" = "Code-Generator";
"codegen_placeholder_body" = "Hier erscheint später der erzeugte Code.";
"codegen_placeholder_compare" = "Zwischen Java, Python und JavaScript wechseln, um die Syntax zu vergleichen (Beispiel unten).";
"codegen_target_java" = "Java";
"codegen_target_python" = "Python";
"codegen_target_javascript" = "JavaScript";
"codegen_preview_java" = "if (bedingung) {\\n    anweisung();\\n} else {\\n    alternative();\\n}";
"codegen_preview_python" = "if bedingung:\\n    anweisung()\\nelse:\\n    alternative()";
"codegen_generated_hint" = "Vorschau aus dem aktuellen Struktogramm (Java 17, Python 3.10+, modernes JavaScript).";
"codegen_copy" = "Kopieren";
"codegen_run_in_browser" = "Im Browser testen";
"codegen_save_java" = "Java speichern …";
"codegen_java_output_mode" = "Java output";
"codegen_java_output_snippet" = "Snippet";
"codegen_java_output_class" = "Class";
"a11y_new_diagram_tab" = "Weiteres Struktogramm";
"a11y_close_tab" = "Reiter schließen";

"close_unsaved_title" = "Ungespeicherte Änderungen";
"close_unsaved_message" = "Dieses Diagramm enthält ungespeicherte Änderungen. Möchtest du sie vor dem Schließen speichern?";
"close_unsaved_discard" = "Verwerfen";
"close_unsaved_cancel" = "Abbrechen";
"a11y_placeholder_drop" = "Element hier ablegen, um den Platzhalter zu ersetzen. Lang drücken und ziehen zum Verschieben.";
"a11y_node_drop" = "Block lang drücken, dann ziehen: am Ziel am oberen oder unteren Rand ablegen (davor/danach). In die Mitte nur auf Platzhalter ø.";
"a11y_codegen_panel_drag" = "Codegenerator-Panel verschieben";

/* Diagramm */
"diagram_title_label" = "Titel";
"diagram_title_placeholder" = "Ohne Titel";

/* Inspector */
"inspector_no_selection" = "Kein Element gewählt — tippe auf eine Kachel.";
"inspector_apply_text" = "Text übernehmen";
"inspector_for_init" = "Start";
"inspector_for_condition" = "Bedingung";
"inspector_for_step" = "Schritt";
"inspector_for_placeholder_init" = "int i = 0";
"inspector_for_placeholder_condition" = "i < 5";
"inspector_for_placeholder_step" = "i++";
"inspector_io_mode_title" = "Art";
"inspector_io_mode_statement" = "Anweisung";
"inspector_io_mode_input" = "Eingabe";
"inspector_io_mode_output" = "Ausgabe";
"inspector_io_mode_help_java_like" = "Eingabe: input: … | Ausgabe: output: …";
"inspector_add_case" = "Weiteren Fall hinzufügen";
"inspector_remove_case" = "Fall entfernen";
"inspector_group_element" = "Elementtext";
"inspector_placeholder_statement" = "int sum = number1 + number2";
"inspector_placeholder_condition" = "Bedingung einfügen …";
"inspector_placeholder_selector" = "Auswahl einfügen …";
"inspector_placeholder_call" = "Aufruf einfügen …";
"inspector_placeholder_break" = "Kommentar (optional)";

/* Elementtypen (Palette + Inspector) */
"element_anweisung" = "Anweisung";
"element_verzweigung" = "Verzweigung";
"element_fallauswahl" = "Fallauswahl";
"element_forSchleife" = "For-Schleife";
"element_whileSchleife" = "While-Schleife";
"element_doUntilSchleife" = "Do-while-Schleife";
"element_endlosschleife" = "Endlosschleife";
"element_aussprung" = "Aussprung";
"element_aufruf" = "Aufruf";
"element_leerElement" = "Leeres Element";

/* Tabs */
"tab_title_format" = "Diagramm %d";

/* Leeres Canvas */
"canvas_empty_title" = "Leeres Struktogramm";
"canvas_empty_hint" = "Element aus „Elemente“ hierher ziehen.";

/* Diagramm: Texte neuer Elemente & Spaltenköpfe (Anzeige) */
"canvas_stub_fallauswahl" = "Fallauswahl";
"canvas_stub_anweisung" = "Anweisung";
"canvas_stub_condition" = "Bedingung";
"canvas_stub_for" = "for 0 < i < anzahl";
"canvas_stub_while" = "while …";
"canvas_stub_until" = "until …";
"canvas_stub_endless" = "endless";
"canvas_stub_break" = "break";
"canvas_stub_call" = "Aufruf()";

/* Über */
"about_version_fmt" = "Version %@ (%@)";
"about_nav_title" = "Über VisuStruct";
"about_features_heading" = "Funktionen";
"about_bullet_palette" = "Bausteine aus der Palette einfügen oder per Drag & Drop ins Diagramm ziehen";
"about_bullet_edit" = "Struktogramm bearbeiten: Texte anpassen, Elemente auswählen und bei Bedarf entfernen";
"about_bullet_tabs" = "Mehrere Diagramme in Tabs – jeweils mit eigenem Titel";
"about_bullet_file" = "Diagramme als .visustruct-Datei speichern und wieder öffnen";
"about_bullet_share" = "Struktogramm als Grafik teilen (PNG)";
"about_dateiformat_heading" = "Dateiformat";
"about_dateiformat_part1" = "Das native Dateiformat von VisuStruct nutzt die Endung ";
"about_dateiformat_part2" = ". So kannst du Diagramme sichern und mit anderen Programmen austauschen, die dasselbe Format unterstützen.";
"about_dateiformat_strk" = "Zusätzlich können Dateien mit der Endung .strk geöffnet werden.";
"about_project_github_label" = "Java-App (Quellen & Releases):";
"about_web_label" = "Web:";
"about_developer_label" = "Entwickler:";
"about_lineage_heading" = "Herkunft";
"about_lineage_body" = "VisuStruct entstand ursprünglich als Java-Desktop-App und bleibt für den schulischen Einsatz plattformübergreifend verfügbar. Die aktuelle Swift/SwiftUI-Version ist die moderne native App für Mac, iPad und iPhone und bleibt kompatibel mit dem .visustruct-Dateiformat. Sie basiert auf der ursprünglichen Open-Source-Arbeit von Kevin Krummenauer (MIT).";
"about_lineage_upstream_label" = "Java-Upstream:";
"about_done" = "Fertig";
"about_copyright" = "Copyright © 2026 Holger Sebastiao";

/* iPhone: Einfügen per Tap */
"phone_insert_cancel" = "Einfügen abbrechen";
"phone_show_text_editor" = "Text bearbeiten";
"phone_hide_text_editor" = "Einklappen";
"phone_title_done" = "Fertig";

/* Meldungen */
"err_save_failed_fmt" = "Speichern fehlgeschlagen: %@";
"err_share_prepare_failed_fmt" = "Teilen konnte nicht vorbereitet werden: %@";
"err_diagram_too_small_export" = "Diagramm ist zu klein — nichts zu exportieren.";
"err_image_render_failed" = "Grafik konnte nicht erzeugt werden.";
"err_diagram_too_small_print" = "Diagramm ist zu klein — nichts zu drucken.";
"err_print_unavailable" = "Drucken ist auf diesem Gerät nicht verfügbar.";

/* Simulation: Meldungen */
"sim_notice_finished" = "Simulation beendet.";
"sim_notice_infinite_loop_empty" = "Die Endlosschleife hat keinen Rumpf.";
"sim_notice_unsupported_statement_fmt" = "Nicht unterstützte Anweisung: %@";
"sim_notice_invalid_expression_fmt" = "Ungültiger Ausdruck: %@";
"sim_notice_unknown_variable_fmt" = "Unbekannte Variable: %@";
"sim_notice_division_by_zero" = "Division durch null.";
"sim_notice_whole_number_expected" = "Bitte eine ganze Zahl eingeben.";
"sim_notice_number_expected" = "Bitte eine Zahl eingeben.";
"sim_notice_boolean_expected" = "Bitte true oder false eingeben.";
"sim_notice_subprogram_not_found_fmt" = "Kein offenes Diagramm heißt %@. Der Aufruf wurde übersprungen.";
"sim_notice_call_too_deep" = "Zu viele verschachtelte Aufrufe. Ruft sich ein Unterprogramm selbst auf?";

"codegen_pseudocode_toggle" = "Pseudocode (kein lauffähiger Code)";
"codegen_pseudocode_note" = "Pseudocode – kein lauffähiges Programm";
"codegen_pseudocode_hint" = "Dieses Diagramm ist als Pseudocode markiert. Der Code ist nur eine Skizze und lässt sich nicht ausführen.";
`;export{e as default};
