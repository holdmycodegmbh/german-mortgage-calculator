# German Mortgage Calculator

Ein eleganter und benutzerfreundlicher Hypothekenrechner für den deutschen Markt, entwickelt mit Next.js und React.

## 📋 Über das Projekt

Dieser Hypothekenrechner ermöglicht es Nutzern, verschiedene Aspekte einer Immobilienfinanzierung zu berechnen:

- **Gesamtkosten der Immobilie** inklusive Nebenkosten
- **Darlehenssumme** basierend auf Eigenkapital
- **Monatliche Rate** mit Zins- und Tilgungsanteil
- **Amortisationsverlauf** über die gesamte Laufzeit

Das Tool berücksichtigt deutsche Besonderheiten wie Grunderwerbsteuer, Notarkosten und Käufernebenkosten.

## 🚀 Installation und Start

### Voraussetzungen

- Node.js (Version 18 oder höher)
- pnpm (empfohlen) oder npm

### Lokale Entwicklung

1. Repository klonen:

```bash
git clone <repository-url>
cd german-mortgage-calculator
```

2. Abhängigkeiten installieren:

```bash
pnpm install
# oder
npm install
```

3. Entwicklungsserver starten:

```bash
pnpm dev
# oder
npm run dev
```

4. Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser.

### Produktionsversion

```bash
# Build erstellen
pnpm build

# Produktionsserver starten
pnpm start
```

## 🛠 Technologie Stack

- **Framework:** Next.js 15
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Charts:** Chart.js & React-Chartjs-2
- **Forms:** React Hook Form mit Zod Validation
- **TypeScript:** Vollständig typisiert

## 📊 Features

- ✅ Responsive Design für alle Gerätegrößen
- ✅ Echtzeit-Berechnungen bei Eingabeänderungen
- ✅ Interaktive Amortisationsdiagramme
- ✅ Deutsche Lokalisierung (Währung, Prozente)
- ✅ Berücksichtigung aller relevanten Nebenkosten
- ✅ Moderne und intuitive Benutzeroberfläche

## 🔄 Wiederverwendung

Dieses Projekt steht unter der MIT-Lizenz und kann gerne für eigene Projekte verwendet und angepasst werden.

Sie können:

- Den Code für eigene Projekte verwenden
- Anpassungen für andere Märkte vornehmen
- Die UI-Komponenten in anderen Projekten wiederverwenden
- Das Design als Vorlage für ähnliche Rechner nutzen

## 🤝 Verbesserungen und Beiträge

Falls Sie Verbesserungsvorschläge haben oder Bugs entdecken:

- **Kurze Nachricht:** Schreiben Sie uns gerne eine kurze Nachricht über [holdmycode.com](https://holdmycode.com)
- **Pull Request:** Erstellen Sie gerne einen Pull Request mit Ihren Verbesserungen
- **Issues:** Öffnen Sie ein Issue für Diskussionen über neue Features

### Entwicklung beitragen

1. Fork des Repositories erstellen
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) Datei für Details.

## 👨‍💻 Autor

**Gregor Doroschenko @ Hold My Code GmbH**

- Website: [holdmycode.com](https://holdmycode.com)
- Demo: [german-mortgage-calculator.holdmycode.io](https://german-mortgage-calculator.holdmycode.io)

---

Made with ❤️ by Gregor Doroschenko @ [Hold My Code GmbH](https://holdmycode.com)

_Alle Angaben ohne Gewähr_
