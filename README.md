# ARC Physical Helper – v0.3.0

Offline-PWA zur Durchführung und Nachbereitung des ARC Physical Survey. Alle Daten bleiben lokal auf dem Gerät (IndexedDB).

## Installation (GitHub Pages)
1. Inhalt dieses Ordners in ein Repo hochladen, Pages aktivieren.
2. Auf dem iPhone in **Safari** öffnen → Teilen → **Zum Home-Bildschirm**. Nur so ist der Speicher dauerhaft.
3. Einmal online öffnen, danach läuft alles offline.

## Update
Dateien ersetzen und in `sw.js` die `CACHE`-Version erhöhen. Die App bietet dann „Neu laden“ an.

## Prüfliste anpassen
`CHECKLIST` am Anfang von `app.js`. Neue Physicals verwenden die neue Vorlage, bestehende behalten ihre Kopie.
Pflichtfotos je Punkt: `minPhotos` (Standard 1).

## Export (ZIP)
```
<Datum>_<Reg>_ARC-Physical/
  1 AC Placards & Markings/1_001.jpg …
  5 AC Exterior Inspection/5.3 Exterior - Engine Condition/5.3_001.jpg …
  Findings/F01_5.3_WO123456/F01_5.3_WO123456_01.jpg   ← hier die WO-PDF ablegen
  Findings.csv         (Excel, Semikolon, Spalten für WO-Wortlaut/Rectification)
  Pruefprotokoll.html  (Status aller Prüfpunkte, Findings, Foto-Galerie; druckbar als PDF)
  session.json         (Rohdaten)
```
