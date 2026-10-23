const e=`/* VisuStruct Java-Desktop-Preset (kein .lproj — gültig für App Store; Tabelle „Java“). */

/* Palette — short labels like Java */
"palette_header" = "Blocks";

/* Actions */
"action_share_png" = "Share Graphic…";
"action_share_document" = "Share File…";
"action_export_pdf" = "Preview PDF…";
"action_generate_code" = "Generate Code…";
"action_simulation" = "Simulation";
"action_diagram" = "Diagram";
"simulation_placeholder_body" = "The simulation mode will run the diagram step by step, highlight the current element, and show variable values and output.";
"simulation_controls" = "Controls";
"simulation_highlight_label" = "Highlight";
"simulation_highlight_last" = "Last step";
"simulation_highlight_next" = "Next step";
"simulation_not_available" = "Play runs the simulation automatically with a 0.5 second pause per step.";
"simulation_play" = "Play";
"simulation_pause" = "Pause";
"simulation_step" = "Step";
"simulation_stop" = "Stop";
"simulation_input" = "Input";
"simulation_input_placeholder" = "No input required.";
"simulation_input_submit" = "OK";
"simulation_input_invalid_int" = "Please enter a whole number.";
"simulation_trace" = "Last Step";
"simulation_trace_placeholder" = "The last executed step will be explained here.";
"simulation_variables" = "Variables";
"simulation_variables_placeholder" = "Current variable values will be shown here later.";
"simulation_output" = "Output";
"simulation_output_placeholder" = "The simulation output will appear here later.";
"action_delete_selection" = "Delete Selection";
"ctx_copy" = "Copy";
"ctx_cut" = "Cut";
"ctx_paste" = "Paste";
"action_settings" = "Settings";
"action_about" = "About VisuStruct";
"recent_files_menu" = "Recent Files";
"recent_files_empty" = "No recent files";
"recent_files_clear" = "Clear List";
"recent_files_unavailable" = "File is no longer available.";

/* In-app settings */
"settings_language_title" = "Language";
"settings_language_de" = "German";
"settings_language_en" = "English";
"settings_language_es" = "Spanish";
"settings_language_fr" = "French";
"settings_language_it" = "Italian";
"settings_language_pl" = "Polish";
"settings_language_tr" = "Turkish";
"settings_language_ko" = "Korean";
"settings_language_ja" = "Japanese";
"settings_language_el" = "Greek";
"settings_language_uk" = "Ukrainian";
"settings_language_ar" = "Arabic";
"settings_language_ru" = "Russian";
"settings_language_he" = "Hebrew";
"settings_language_zh_hans" = "Chinese (Simplified)";
"settings_language_zh_hant" = "Chinese (Traditional)";
"settings_language_ptpt" = "Portuguese";
"settings_language_java" = "Java (keywords)";



"settings_ui_scale_section" = "Text size";
"settings_ui_scale_canvas" = "Structure chart";
"settings_ui_scale_inspector" = "Text entry below";
"settings_ui_scale_small" = "Small";
"settings_ui_scale_medium" = "Medium";
"settings_ui_scale_large" = "Large";
"settings_ui_scale_extra_large" = "Extra large";

"settings_export_filename_section" = "File name suggestion";
"settings_export_filename_picker" = "Format";
"settings_export_filename_date_title" = "With date";
"settings_export_filename_title_only" = "Without date";
"settings_export_filename_footer_with_date" = "With date: yyyy-mm-dd-Filename.visustruct";
"settings_export_filename_footer_without_date" = "Without date: Filename.visustruct";


/* Error overlay */
"error_title" = "Error";
"error_back_editor" = "Back to Editor";

/* Toolbar */
"toolbar_undo" = "Undo";
"toolbar_redo" = "Redo";
"toolbar_new" = "New";
"menu_open" = "Open…";
"menu_save" = "Save";
"menu_save_as" = "Save As…";
"menu_print" = "Print…";
"menu_file" = "File";
"menu_new" = "New";
"menu_close" = "Close";

/* Accessibility */
"a11y_generate_code" = "Generate code from the structure chart";
"a11y_generate_code_locked" = "Generate code, available after purchase";
"a11y_unsaved_changes" = "Unsaved changes";

/* Code generator (IAP to follow) */
"codegen_gate_title" = "Generate code";
"codegen_gate_body" = "Java, Python, and JavaScript code from your diagram will unlock via in-app purchase (coming soon).";
"codegen_gate_ok" = "OK";
"codegen_placeholder_title" = "Code generator";
"codegen_placeholder_body" = "Generated code will appear here.";
"codegen_placeholder_compare" = "Switch between Java, Python, and JavaScript to compare syntax (sample below).";
"codegen_target_java" = "Java";
"codegen_target_python" = "Python";
"codegen_target_javascript" = "JavaScript";
"codegen_preview_java" = "if (condition) {\\n    statement();\\n} else {\\n    alternative();\\n}";
"codegen_preview_python" = "if condition:\\n    statement()\\nelse:\\n    alternative()";
"codegen_generated_hint" = "Preview from the current structure chart (Java 17, Python 3.10+, modern JavaScript).";
"codegen_copy" = "Copy";
"codegen_run_in_browser" = "Test in browser";
"codegen_save_java" = "Save Java…";
"codegen_java_output_mode" = "Java output";
"codegen_java_output_snippet" = "Snippet";
"codegen_java_output_class" = "Class";
"a11y_new_diagram_tab" = "New diagram tab";
"a11y_close_tab" = "Close tab";

"close_unsaved_title" = "Unsaved Changes";
"close_unsaved_message" = "This diagram contains unsaved changes. Do you want to save them before closing?";
"close_unsaved_discard" = "Discard";
"close_unsaved_cancel" = "Cancel";
"a11y_placeholder_drop" = "Drop an element here to replace the placeholder. Press and hold to drag and move.";
"a11y_node_drop" = "Press and hold a block, then drag: drop on the top or bottom edge of a target to insert before or after. Center drop only on a ø placeholder.";
"a11y_codegen_panel_drag" = "Drag to move code generator panel";

/* Diagram */
"diagram_title_label" = "Title";
"diagram_title_placeholder" = "No title";

/* Inspector */
"inspector_no_selection" = "No element selected — tap a tile.";
"inspector_apply_text" = "Apply Text";
"inspector_for_init" = "Init";
"inspector_for_condition" = "Condition";
"inspector_for_step" = "Step";
"inspector_for_placeholder_init" = "int i = 0";
"inspector_for_placeholder_condition" = "i < 5";
"inspector_for_placeholder_step" = "i++";
"inspector_io_mode_title" = "Kind";
"inspector_io_mode_statement" = "Statement";
"inspector_io_mode_input" = "Input";
"inspector_io_mode_output" = "Output";
"inspector_io_mode_help_java_like" = "Input: input: … | Output: output: …";
"inspector_add_case" = "Add Case";
"inspector_remove_case" = "Remove Case";
"inspector_group_element" = "Element text";
"inspector_placeholder_statement" = "int sum = number1 + number2";
"inspector_placeholder_condition" = "Insert condition…";
"inspector_placeholder_selector" = "Insert selector…";
"inspector_placeholder_call" = "Insert call…";
"inspector_placeholder_break" = "Comment (optional)";

/* Element types — JAVA_STANDARD_PALETTE_LABELS (palette + inspector title) */
"element_anweisung" = "Statement";
"element_verzweigung" = "if";
"element_fallauswahl" = "switch";
"element_forSchleife" = "for";
"element_whileSchleife" = "while";
"element_doUntilSchleife" = "do";
"element_endlosschleife" = "while(true)";
"element_aussprung" = "break";
"element_aufruf" = "call";
"element_leerElement" = "ø";

/* Tabs */
"tab_title_format" = "Diagram %d";

/* Empty canvas */
"canvas_empty_title" = "Empty structure chart";
"canvas_empty_hint" = "Drag a block from “Blocks” here.";

/* New block stubs — PRESETS[PRESET_ENGLISH_JAVA] */
"canvas_stub_anweisung" = "Statement";
"canvas_stub_condition" = "condition";
"canvas_stub_fallauswahl" = "selector";
"canvas_stub_for" = "i = 0; i < n; i++";
"canvas_stub_while" = "condition";
"canvas_stub_until" = "condition";
"canvas_stub_endless" = "∞";
"canvas_stub_break" = "break";
"canvas_stub_call" = "method()";

/* About */
"about_version_fmt" = "Version %@ (%@)";
"about_nav_title" = "About VisuStruct";
"about_features_heading" = "Features";
"about_bullet_palette" = "Insert blocks from the palette or drag them into the diagram";
"about_bullet_edit" = "Edit the chart: change text, select elements, and remove them if needed";
"about_bullet_tabs" = "Several diagrams in tabs — each with its own title";
"about_bullet_file" = "Save and reopen diagrams as .visustruct files";
"about_bullet_share" = "Share the structure chart as an image (PNG)";
"about_dateiformat_heading" = "File format";
"about_dateiformat_part1" = "VisuStruct’s native format uses the extension ";
"about_dateiformat_part2" = ". You can keep diagrams and exchange them with other apps that support the same format.";
"about_dateiformat_strk" = "Files with the .strk extension can also be opened.";
"about_project_github_label" = "Java app (source & releases):";
"about_web_label" = "Web:";
"about_developer_label" = "Developer:";
"about_lineage_heading" = "Lineage";
"about_lineage_body" = "VisuStruct originally began as a Java desktop app and remains available across platforms for use in schools. The current Swift/SwiftUI version is the modern native app for Mac, iPad, and iPhone and remains compatible with the .visustruct file format. It builds on the original open-source work by Kevin Krummenauer (MIT).";
"about_lineage_upstream_label" = "Java upstream:";
"about_done" = "Done";
"about_copyright" = "Copyright © 2026 Holger Sebastiao";

/* iPhone: tap-to-insert */
"phone_insert_cancel" = "Cancel insert";
"phone_show_text_editor" = "Edit text";

/* Alerts */
"err_save_failed_fmt" = "Could not save: %@";
"err_share_prepare_failed_fmt" = "Could not prepare sharing: %@";
"err_diagram_too_small_export" = "The diagram is too small — nothing to export.";
"err_image_render_failed" = "Could not create the image.";
"err_diagram_too_small_print" = "The diagram is too small — nothing to print.";
"err_print_unavailable" = "Printing is not available on this device.";

"inspector_header" = "Object Inspector";
`;export{e as default};
