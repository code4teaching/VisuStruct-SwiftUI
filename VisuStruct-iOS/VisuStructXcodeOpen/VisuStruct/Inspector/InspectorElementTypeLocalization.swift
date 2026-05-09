import VisuStructCore

enum InspectorElementTypeLocalization {
    static func title(for type: VisuStructElementType, lang: AppLanguage) -> String {
        switch type {
        case .anweisung: return lang.tr("element_anweisung")
        case .verzweigung: return lang.tr("element_verzweigung")
        case .fallauswahl: return lang.tr("element_fallauswahl")
        case .forSchleife: return lang.tr("element_forSchleife")
        case .whileSchleife: return lang.tr("element_whileSchleife")
        case .doUntilSchleife: return lang.tr("element_doUntilSchleife")
        case .endlosschleife: return lang.tr("element_endlosschleife")
        case .aussprung: return lang.tr("element_aussprung")
        case .aufruf: return lang.tr("element_aufruf")
        case .leerElement: return lang.tr("element_leerElement")
        }
    }
}
