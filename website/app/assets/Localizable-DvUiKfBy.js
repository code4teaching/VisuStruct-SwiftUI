const e=`/* Paleta */
"palette_header" = "Elementos";
"inspector_header" = "Inspetor de objetos";

/* Ações */
"action_share_png" = "Partilhar gráfico…";
"action_share_document" = "Partilhar ficheiro…";
"action_export_pdf" = "Pré-visualizar PDF…";
"action_generate_code" = "Gerar código…";
"action_simulation" = "Simulação";
"action_diagram" = "Diagrama";
"simulation_placeholder_body" = "O modo de simulação executa o diagrama passo a passo, destaca o elemento atual e mostra os valores das variáveis e a saída.";
"simulation_controls" = "Controlos";
"simulation_highlight_label" = "Destaque";
"simulation_highlight_last" = "Último passo";
"simulation_highlight_next" = "Próximo passo";
"simulation_not_available" = "Play executa a simulação automaticamente com uma pausa de 0,5 segundos por passo.";
"simulation_play" = "Reproduzir";
"simulation_pause" = "Pausa";
"simulation_step" = "Passo";
"simulation_stop" = "Parar";
"simulation_input" = "Entrada";
"simulation_input_placeholder" = "Nenhuma entrada necessária.";
"simulation_input_submit" = "OK";
"simulation_input_invalid_int" = "Introduza um número inteiro.";
"simulation_trace" = "Último passo";
"simulation_trace_placeholder" = "Ainda não foi executado nenhum passo.";
"simulation_variables" = "Variáveis";
"simulation_variables_placeholder" = "Ainda não há variáveis.";
"simulation_output" = "Saída";
"simulation_output_placeholder" = "Ainda não há saída.";
"action_delete_selection" = "Eliminar seleção";
"ctx_copy" = "Copiar";
"ctx_cut" = "Cortar";
"ctx_paste" = "Colar";
"action_settings" = "Definições";
"action_about" = "Acerca do VisuStruct";
"recent_files_menu" = "Recentes";
"recent_files_empty" = "Sem ficheiros recentes";
"recent_files_clear" = "Limpar lista";
"recent_files_unavailable" = "O ficheiro já não está disponível.";

/* Definições (na app) */
"settings_language_title" = "Idioma";
"settings_language_de" = "Alemão";
"settings_language_en" = "Inglês";
"settings_language_es" = "Espanhol";
"settings_language_fr" = "Francês";
"settings_language_it" = "Italiano";
"settings_language_pl" = "Polaco";
"settings_language_tr" = "Turco";
"settings_language_ko" = "Coreano";
"settings_language_ja" = "Japonês";
"settings_language_el" = "Grego";
"settings_language_uk" = "Ucraniano";
"settings_language_ar" = "Árabe";
"settings_language_ru" = "Russo";
"settings_language_he" = "Hebraico";
"settings_language_zh_hans" = "Chinês (simplificado)";
"settings_language_zh_hant" = "Chinês (tradicional)";
"settings_language_ptpt" = "Português";
"settings_language_java" = "Java (palavras-chave)";



/* Erro */
"error_title" = "Erro";
"error_back_editor" = "Voltar ao editor";

/* Barra de ferramentas */
"toolbar_undo" = "Anular";
"toolbar_redo" = "Refazer";
"toolbar_new" = "Novo";
"menu_open" = "Abrir…";
"menu_save" = "Guardar";
"menu_save_as" = "Guardar como…";
"menu_print" = "Imprimir…";
"menu_file" = "Ficheiro";
"menu_new" = "Novo";
"menu_close" = "Fechar";

/* Acessibilidade */
"a11y_generate_code" = "Gerar código a partir do diagrama";
"a11y_generate_code_locked" = "Gerar código, disponível após comprar";
"a11y_unsaved_changes" = "Alterações não guardadas";

/* Gerador de código (compra na app em breve) */
"codegen_gate_title" = "Gerar código";
"codegen_gate_body" = "O código Java, Python e JavaScript a partir do diagrama ficará disponível com uma compra na aplicação (em breve).";
"codegen_gate_ok" = "OK";
"codegen_placeholder_title" = "Gerador de código";
"codegen_placeholder_body" = "O código gerado aparecerá aqui.";
"codegen_placeholder_compare" = "Alterne entre Java, Python e JavaScript para comparar a sintaxe (exemplo abaixo).";
"codegen_target_java" = "Java";
"codegen_target_python" = "Python";
"codegen_target_javascript" = "JavaScript";
"codegen_preview_java" = "if (condicao) {\\n    instrucao();\\n} else {\\n    alternativa();\\n}";
"codegen_preview_python" = "if condicao:\\n    instrucao()\\nelse:\\n    alternativa()";
"codegen_generated_hint" = "Pré-visualização a partir do diagrama atual (Java 17, Python 3.10+, JavaScript moderno).";
"codegen_copy" = "Copiar";
"codegen_run_in_browser" = "Testar no navegador";
"codegen_save_java" = "Guardar Java…";
"codegen_java_output_mode" = "Saída Java";
"codegen_java_output_snippet" = "Excerto";
"codegen_java_output_class" = "Classe";
"a11y_new_diagram_tab" = "Novo separador de diagrama";
"a11y_close_tab" = "Fechar separador";

"close_unsaved_title" = "Alterações não guardadas";
"close_unsaved_message" = "Este diagrama contém alterações não guardadas. Pretende guardá-las antes de fechar?";
"close_unsaved_discard" = "Descartar";
"close_unsaved_cancel" = "Cancelar";
"a11y_placeholder_drop" = "Largue aqui um elemento para substituir o marcador. Mantenha premido para arrastar e mover.";
"a11y_node_drop" = "Mantenha premido um bloco e arraste: largue na borda superior ou inferior do destino (antes/depois). No centro só em marcador ø.";
"a11y_codegen_panel_drag" = "Arraste para mover o painel do gerador de código";

/* Diagrama */
"diagram_title_label" = "Título";
"diagram_title_placeholder" = "Sem título";

/* Inspetor */
"inspector_no_selection" = "Nenhum elemento selecionado — toque num bloco.";
"inspector_apply_text" = "Aplicar texto";
"inspector_for_init" = "Início";
"inspector_for_condition" = "Condição";
"inspector_for_step" = "Passo";
"inspector_for_placeholder_init" = "int i = 0";
"inspector_for_placeholder_condition" = "i < 5";
"inspector_for_placeholder_step" = "i++";

"inspector_io_mode_title" = "Tipo";
"inspector_io_mode_statement" = "Instrução";
"inspector_io_mode_input" = "Entrada";
"inspector_io_mode_output" = "Saída";
"inspector_io_mode_help_java_like" = "Entrada: input: … | Saída: output: …";
"inspector_add_case" = "Adicionar caso";
"inspector_remove_case" = "Remover caso";
"inspector_group_element" = "Texto do elemento";
"inspector_placeholder_statement" = "int sum = number1 + number2";
"inspector_placeholder_condition" = "Inserir condição…";
"inspector_placeholder_selector" = "Inserir seletor…";
"inspector_placeholder_call" = "Inserir chamada…";
"inspector_placeholder_break" = "Comentário (opcional)";

/* Tipos de elemento */
"element_anweisung" = "Instrução";
"element_verzweigung" = "Decisão";
"element_fallauswahl" = "Seleção";
"element_forSchleife" = "Ciclo for";
"element_whileSchleife" = "Ciclo while";
"element_doUntilSchleife" = "Ciclo do-while";
"element_endlosschleife" = "Ciclo infinito";
"element_aussprung" = "Interrupção";
"element_aufruf" = "Chamada";
"element_leerElement" = "Elemento vazio";

/* Separadores */
"tab_title_format" = "Diagrama %d";

/* Ecrã vazio */
"canvas_empty_title" = "Diagrama vazio";
"canvas_empty_hint" = "Arraste um elemento de «Elementos» para aqui.";

/* Diagrama: textos de elementos novos e cabeçalhos de coluna (exibição) */
"canvas_stub_fallauswahl" = "Seleção";
"canvas_stub_anweisung" = "Instrução";
"canvas_stub_condition" = "Condição";
"canvas_stub_for" = "for 0 < i < quantidade";
"canvas_stub_while" = "enquanto …";
"canvas_stub_until" = "até …";
"canvas_stub_endless" = "infinito";
"canvas_stub_break" = "parar";
"canvas_stub_call" = "Chamada()";

/* Acerca */
"about_version_fmt" = "Versão %@ (%@)";
"about_nav_title" = "Acerca do VisuStruct";
"about_features_heading" = "Funcionalidades";
"about_bullet_palette" = "Inserir blocos a partir da paleta ou arrastá-los para o diagrama";
"about_bullet_edit" = "Editar o diagrama: alterar textos, selecionar elementos e removê-los se necessário";
"about_bullet_tabs" = "Vários diagramas em separadores — cada um com o seu título";
"about_bullet_file" = "Guardar e reabrir diagramas como ficheiros .visustruct";
"about_bullet_share" = "Partilhar o diagrama estruturado como imagem (PNG)";
"about_dateiformat_heading" = "Formato do ficheiro";
"about_dateiformat_part1" = "O formato nativo do VisuStruct utiliza a extensão ";
"about_dateiformat_part2" = ". Pode guardar diagramas e trocá-los com outras apps que suportem o mesmo formato.";
"about_dateiformat_strk" = "Também é possível abrir ficheiros com a extensão .strk.";
"about_project_github_label" = "App Java (código-fonte e releases):";
"about_web_label" = "Web:";
"about_developer_label" = "Programador:";
"about_lineage_heading" = "Origem";
"about_lineage_body" = "VisuStruct originally began as a Java desktop app and remains available across platforms for use in schools. The current Swift/SwiftUI version is the modern native app for Mac, iPad, and iPhone and remains compatible with the .visustruct file format. It builds on the original open-source work by Kevin Krummenauer (MIT).";
"about_lineage_upstream_label" = "Upstream Java:";
"about_done" = "Concluído";
"about_copyright" = "Copyright © 2026 Holger Sebastiao";

/* iPhone: inserir por toque */
"phone_insert_cancel" = "Cancelar inserção";
"phone_show_text_editor" = "Editar texto";
"phone_hide_text_editor" = "Recolher";
"phone_title_done" = "OK";

/* Alertas */
"err_save_failed_fmt" = "Não foi possível guardar: %@";
"err_share_prepare_failed_fmt" = "Não foi possível preparar a partilha: %@";
"err_diagram_too_small_export" = "O diagrama é demasiado pequeno — nada para exportar.";
"err_image_render_failed" = "Não foi possível criar a imagem.";
"err_diagram_too_small_print" = "O diagrama é demasiado pequeno — nada para imprimir.";
"err_print_unavailable" = "A impressão não está disponível neste dispositivo.";

"settings_ui_scale_section" = "Tamanho do texto";
"settings_ui_scale_canvas" = "Diagrama";
"settings_ui_scale_inspector" = "Introdução de texto em baixo";
"settings_ui_scale_small" = "Pequeno";
"settings_ui_scale_medium" = "Médio";
"settings_ui_scale_large" = "Grande";
"settings_ui_scale_extra_large" = "Muito grande";

"settings_export_filename_section" = "Sugestão de nome de ficheiro";
"settings_export_filename_picker" = "Formato";
"settings_export_filename_date_title" = "Com data";
"settings_export_filename_title_only" = "Sem data";
"settings_export_filename_footer_with_date" = "Com data: yyyy-mm-dd-Filename.visustruct";
"settings_export_filename_footer_without_date" = "Sem data: Filename.visustruct";


/* Simulation: Meldungen */
"sim_notice_finished" = "Simulação terminada.";
"sim_notice_infinite_loop_empty" = "O ciclo infinito não tem corpo.";
"sim_notice_unsupported_statement_fmt" = "Instrução não suportada: %@";
"sim_notice_invalid_expression_fmt" = "Expressão inválida: %@";
"sim_notice_unknown_variable_fmt" = "Variável desconhecida: %@";
"sim_notice_division_by_zero" = "Divisão por zero.";
"sim_notice_whole_number_expected" = "Introduza um número inteiro.";
"sim_notice_number_expected" = "Introduza um número.";
"sim_notice_boolean_expected" = "Introduza true ou false.";
"sim_notice_subprogram_not_found_fmt" = "Nenhum diagrama aberto se chama %@. A chamada foi ignorada.";
"sim_notice_call_too_deep" = "Demasiadas chamadas aninhadas. Um subprograma chama-se a si próprio?";

"codegen_pseudocode_toggle" = "Pseudocódigo (código não executável)";
"codegen_pseudocode_note" = "Pseudocódigo – não é um programa executável";
"codegen_pseudocode_hint" = "Este diagrama está marcado como pseudocódigo. O código é apenas um esboço e não pode ser executado.";
`;export{e as default};
