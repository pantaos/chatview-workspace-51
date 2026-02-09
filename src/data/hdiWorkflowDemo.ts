export interface DemoStep {
  id: number;
  title: string;
  type: 'input' | 'ai-processing' | 'preview' | 'approval';
  description: string;
  content: string[];
}

export const hdiWorkflowSteps: DemoStep[] = [
  {
    id: 1,
    title: "Versicherungsthema wählen",
    type: "input",
    description: "Der Nutzer wählt das Versicherungsthema aus, zu dem Content erstellt werden soll.",
    content: [
      "Haftpflichtversicherung 2026: Wichtige Änderungen",
      "Neue Regelungen und optimale Vorbereitung",
      "Area: Haftpflichtversicherung"
    ]
  },
  {
    id: 2,
    title: "Content-Ideen finden",
    type: "ai-processing",
    description: "KI analysiert Marktquellen (RSS & Competitor Scan) und generiert Ideen für den Artikel.",
    content: [
      "Einführung in die Änderungen",
      "Im Jahr 2026 stehen bedeutende Änderungen im Bereich der Haftpflichtversicherung bevor. Diese neuen gesetzlichen Regelungen sind darauf ausgelegt, den Versicherungsschutz für Verbraucher zu verbessern und den Schutz im Schadensfall zu erweitern.",
      "Doch was bedeutet das konkret für Sie? In diesem Artikel erfahren Sie, wie sich die Änderungen auf Ihre bestehende Versicherung auswirken und wie Sie sich darauf vorbereiten können."
    ]
  },
  {
    id: 3,
    title: "Ersten Artikel-Entwurf erstellen",
    type: "ai-processing",
    description: "Die KI erstellt automatisch einen vollständigen Artikelentwurf basierend auf den Ideen.",
    content: [
      "Wichtige Details der neuen Regelungen:",
      "• Erhöhung der Mindestdeckungssummen: Um einen umfassenderen Schutz zu gewährleisten, werden die Mindestdeckungssummen für Haftpflichtversicherungen erhöht.",
      "• Erweiterung des Versicherungsschutzes: Bestimmte Schadensarten, die bisher nicht abgedeckt waren, sind künftig im Standardversicherungsschutz enthalten.",
      "• Verpflichtende Anpassung bestehender Verträge: Alle Versicherungsverträge müssen bis Ende 2026 an die neuen Regelungen angepasst werden."
    ]
  },
  {
    id: 4,
    title: "Tipps zur Anpassung",
    type: "preview",
    description: "Konkrete Handlungsempfehlungen für den Versicherungsnehmer.",
    content: [
      "Um von den neuen Regelungen optimal zu profitieren, sollten Sie Ihre bestehenden Versicherungsverträge überprüfen und gegebenenfalls anpassen:",
      "• Prüfen Sie Ihre aktuelle Deckungssumme und stellen Sie sicher, dass Ihre Haftpflichtversicherung die neuen Mindestanforderungen erfüllt.",
      "• Überarbeiten Sie Ihren Versicherungsschutz und stellen Sie sicher, dass alle relevanten Schadensarten abgedeckt sind.",
      "• Kontaktieren Sie Ihren Versicherungsberater – Ihr Berater kann Ihnen helfen, die besten Anpassungen vorzunehmen."
    ]
  },
  {
    id: 5,
    title: "Final Preview & Approval",
    type: "approval",
    description: "Finale Qualitäts- und Compliance-Prüfung im echten Seitenlayout vor der Veröffentlichung.",
    content: [
      "Final quality and compliance check in the real page layout before anything goes live.",
      "Der Artikel wird im Live-Format angezeigt, damit Qualität, Branding und Compliance geprüft werden können.",
      "Ein Approver kann den Artikel freigeben oder zur Überarbeitung zurücksenden."
    ]
  },
  {
    id: 6,
    title: "Vorteile der neuen Bestimmungen",
    type: "preview",
    description: "Darstellung der Vorteile für den Endkunden.",
    content: [
      "Die neuen Bestimmungen bieten zahlreiche Vorteile für Versicherungsnehmer:",
      "• Erhöhter Schutz: Die angehobenen Deckungssummen bieten Ihnen mehr Sicherheit im Schadensfall.",
      "• Umfassender Versicherungsschutz: Durch die Erweiterung der abgedeckten Schadensarten sind Sie gegen eine Vielzahl von Risiken besser gewappnet.",
      "• Transparenz und Klarheit: Die neuen Regelungen sorgen für eine klarere Kommunikation und bessere Verständlichkeit Ihrer Versicherungsbedingungen."
    ]
  },
  {
    id: 7,
    title: "Ausblick & Handlungsempfehlungen",
    type: "preview",
    description: "Zusammenfassung und nächste Schritte.",
    content: [
      "2026 wird ein entscheidendes Jahr für die Haftpflichtversicherung. Die neuen Regelungen bieten Ihnen mehr Sicherheit und Klarheit.",
      "Damit Sie von diesen Änderungen profitieren, ist es wichtig, rechtzeitig zu handeln und Ihre Versicherungsverträge entsprechend anzupassen.",
      "Jetzt ist die Zeit, sich mit Ihrem Versicherungsanbieter in Verbindung zu setzen und die notwendigen Schritte zu besprechen.",
      "Ihr HDI Berater steht Ihnen dabei jederzeit zur Seite."
    ]
  }
];
