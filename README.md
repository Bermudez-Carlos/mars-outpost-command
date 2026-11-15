# Ares Horizon: Mars Outpost Commander

**Play Live:** [https://github.io](https://bermudez-carlos.github.io/mars-outpost-command/)

An interactive, bilingual (English / Spanish) Mars habitat survival and engineering simulator built for the **NASA International Space Apps Challenge**. Players command a 4-person NASA surface habitat across 15 Sols, balancing a 100 kW Kilopower + solar grid across life-support subsystems while responding to real Martian hazards.

## Official Space Agency Data Used
- **NASA DONKI Space Weather API (`https://nasa.gov`):** Fetches live Coronal Mass Ejection (CME) speeds and Mars impact predictions on launch, with a verified Mars CME archive fallback (`726 km/s`) for offline reliability.
- **NASA Mars Trek Terrain Data:** Models real elevation and atmospheric differences between **Jezero Crater** (`-2,570 m`, +25% biosignature science bonus) and **Hellas Planitia** (`-7,152 m`, +20% MOXIE O₂ efficiency, stronger dust storms).
- **NASA OSDR RadLab Dosimetry:** Grounds baseline surface radiation (`0.64 mSv/Sol`) and water-wall shielding trade-offs.
- **CSA Space Food Toolkit:** Guides closed-loop hydroponics and Sol-15 Starship cargo resupply manifests.

## Key Features
- **Two Difficulty Modes:** Junior Cadet (ages 7–9) and Mission Commander (ages 10–12+).
- **Live Telemetry Forecasts:** Real-time next-Sol predictions for Oxygen (MOXIE), Food (Hydroponics), Radiation/Thermal Shielding, and Crew Morale.
- **Bilingual & Accessible:** Instant English/Spanish toggle, interactive space-science glossary, exterior/interior POV switching, and a downloadable Mission Certificate.

## Run Locally
Open `index.html` directly in any modern browser or serve the folder locally:
```bash
python3 -m http.server 8000
```
