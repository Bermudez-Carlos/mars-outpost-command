// === 1. ADJUSTABLE MISSION PARAMETERS ===
const MISSION_TUNING = Object.freeze({
  startingOxygen: 80,
  startingFood: 80,
  startingShielding: 85,
  startingMorale: 85,
  dailyDrain: {
    oxygenJunior: 14,
    oxygenCommander: 18,
    foodJunior: 11,
    foodCommander: 15,
    shieldingJunior: 9,
    shieldingCommander: 12,
    moraleJunior: 1,
    moraleCommander: 2
  },
  productionPer10kW: { oxygen: 6.5, food: 4.5, shielding: 4, morale: 2 },
  dustStorm: {
    jezeroPowerCap: 75,
    hellasPowerCap: 65,
    stowedMoraleLoss: 5,
    exposedShieldLoss: 16,
    exposedMoraleLoss: 8,
    recoverySols: 2
  },
  radiationStorm: {
    shieldGain: 18,
    moraleGain: 8,
    shelterScienceLoss: 12,
    evaShieldLoss: 20,
    evaMoraleLoss: 12,
    evaScienceGain: 25
  },
  greenhouseHazard: {
    quarantineFoodLoss: 12,
    quarantineShieldGain: 10,
    rerouteFoodGain: 10,
    rerouteScienceLoss: 18
  },
  scienceMultiplier: { jezero: 1.25, hellas: 1 },
  viewportCycleSeconds: 90
});

const NASA_API_KEY = "nr8f8tnzgLDr9Jfwc9tjtQGwKG8LG8wRqtP8d9hz";
const GEMINI_API_KEY = "";
const GEMINI_MODEL = "gemini-2.5-flash";
let currentLanguage = "en";
let nasaStatusKey = "apiConnecting";
let nasaStatusVariables = {};

const TRANSLATIONS = {
  en: {
    ui: {
      briefingTitle: "Junior Astronaut Mission Trainer",
      briefingInstructions: "Welcome, Cadet. A Martian {{term:sol}} lasts 24 hours, 39 minutes. Your mission is to keep a 4-person NASA habitat alive for 15 {{term:sol|Sols}} by balancing a limited 100 kW power grid against real Martian hazards.",
      commanderLabel: "Enter Commander Name:",
      commanderPlaceholder: "e.g., Jay",
      certificateTitle: "Mars Mission Certificate",
      certificateIntro: "You completed all 15 Sols. Download your printable astronaut certificate.",
      certificateButton: "Download Astronaut Certificate",
      certificateDownloaded: "Your certificate has been downloaded.",
      certificateAwarded: "CERTIFICATE OF MARS EXPLORATION",
      certificatePresentedTo: "This certificate is proudly presented to",
      certificateRank: "Mission rank: {{rank}}",
      certificateSite: "Outpost: {{site}}",
      certificateSols: "Mission duration: {{sols}} / 15 Sols",
      certificateScience: "Science score: {{score}} PTS",
      certificateDate: "ISSUED {{date}}",
      jezeroName: "Ares Horizon Station",
      jezeroSubtitle: "Surface station beside Jezero Crater",
      hellasName: "Olympus Deep Outpost",
      hellasSubtitle: "Deep-basin outpost inside Hellas Planitia",
      difficultyTitle: "Choose mission level",
      juniorMode: "Junior Cadet",
      juniorModeDescription: "Ages 7–9 · guided hints · gentler drains",
      commanderMode: "Mission Commander",
      commanderModeDescription: "Ages 10–12+ · full engineering trade-offs",
      landingPrompt: "Select a {{term:mars-trek}} landing site:",
      jezeroTag: "BALANCED · SURFACE OUTPOST",
      jezeroSubtitle: "Surface habitat near Jezero Crater",
      jezeroBonus: "+25% Science Points from biosignature sampling.",
      hellasTag: "HIGH RISK · DEEP BASIN SEARCH",
      hellasSubtitle: "Deep ravine station within the Hellas impact basin",
      hellasBonus: "Higher air pressure boosts {{term:moxie}} oxygen efficiency by 20%, but dust storms are stronger.",
      sourcesStrip: "Grounded in Official Open Data:",
      launchButton: "LAUNCH MISSION TO MARS →",
      commander: "COMMANDER",
      missionSol: "MISSION {{term:sol|SOL}}",
      powerCapacity: "POWER CAPACITY",
      surfaceRadiation: "SURFACE RADIATION",
      scienceScore: "SCIENCE SCORE",
      habitatTitle: "Habitat Exterior",
      solPhaseDay: "SOL PHASE: DAY",
      solPhaseNight: "SOL PHASE: NIGHT",
      povExteriorTitle: "Exterior Outpost View",
      povInteriorTitle: "Command Deck Window",
      povExteriorButton: "👁️ Switch POV: Exterior Outpost / Command Deck Window",
      povInteriorButton: "👁️ Switch POV: Command Deck Window / Exterior Outpost",
      vitalsTitle: "Habitat Life Support Vitals",
      cmeAlert: "{{term:cme}} SPACE WEATHER ALERT",
      oxygenLabel: "🫁 Oxygen ({{term:moxie}} CO₂ Splitter)",
      foodLabel: "🌱 Food & Water ({{term:hydroponics}})",
      shieldingLabel: "🛡️ Radiation & Thermal Shielding",
      moraleLabel: "🧠 Crew Morale & Focus",
      vitalsHelper: "Keep all systems above 0% to survive. Predictions update live as you adjust power.",
      advisorTitle: "🛰️ Mission Control Advisor",
      hintButton: "Request Telemetry Hint",
      signalDelay: "Earth-Mars signal delay: 14 minutes each way",
      advisorWelcome: "Mission Control can analyze your habitat without an internet connection.",
      powerTitle: "Power Grid Allocation",
      powerHelper: "Distribute your {{term:kilopower}} + solar energy across subsystems (5 kW steps).",
      oxygenSubsystem: "{{term:moxie}} Oxygen Generator",
      oxygenDescription: "Splits 95.3% Martian CO₂ into O₂ at 800°C (+6.5% O₂ per 10 kW)",
      foodSubsystem: "{{term:hydroponics}} Greenhouse",
      foodDescription: "LED grow-lights & water filtration (+4.5% Food per 10 kW)",
      shieldingSubsystem: "Water-Wall Shield & Heaters",
      shieldingDescription: "Counters cold nights and cosmic radiation (+4% Shield per 10 kW). Keep {{term:perchlorates}} out of the habitat dust.",
      scienceSubsystem: "Science Lab & Earth Comms",
      scienceDescription: "Earns +15 Science Pts & boosts Crew Morale (+2% per 10 kW)",
      advanceButton: "ADVANCE TO SOL {{nextSol}} →",
      completeSolButton: "COMPLETE SOL {{sol}} →",
      systemsNominal: "SYSTEMS NOMINAL",
      vitalsLow: "VITALS LOW",
      vitalsCritical: "VITALS CRITICAL",
      dustStatus: "DUST FRONT",
      radiationStatus: "RADIATION ALERT",
      greenhouseStatus: "GREENHOUSE ALERT",
      clearSkies: "CLEAR SKIES",
      debriefComplete: "MISSION COMPLETE",
      debriefFailed: "MISSION FAILED",
      juniorVictoryTitle: "Junior Cadet Mission Complete",
      commanderVictoryTitle: "Mission Commander Rank: Mars Commander",
      missionLostTitle: "Mission Lost at Sol {{sol}}",
      victorySummary: "The crew completed the 15-Sol surface mission with {{science}} science points.",
      failureSummary: "The habitat could not sustain the crew. Review the telemetry and engineering log below.",
      solsSurvived: "Sols Survived",
      totalScience: "Total Science",
      landingSite: "Landing Site",
      cargoKicker: "ARRIVED ON SOL 15",
      cargoTitle: "Starship cargo resupply",
      cargoLanding: "Landing Sol {{sol}}",
      cargoDeclaredMass: "{{mass}} kg declared payload",
      cargoMassNote: "{{listedMass}} kg itemized across {{count}} cargo types. {{unitemizedMass}} kg of the declared total is not itemized in the supplied manifest.",
      cargoNotes: "Realistic early-mission cargo load focused on life support, power, and farming. Masses are based on typical astronaut needs and Starship capacity.",
      cargoQuantity: "Qty {{quantity}} · {{mass}} kg",
      historyTitle: "Habitat vital history",
      legendOxygen: "Oxygen",
      legendFood: "Food",
      legendShielding: "Shielding",
      legendMorale: "Morale",
      engineeringLog: "Engineering Debrief: What Happened & Why",
      resetButton: "RUN NEW SIMULATION ↻",
      nasaScience: "🔬 Real NASA Science:",
      glossaryKicker: "MISSION WORD",
      glossaryClose: "Close definition",
      sourceDetails: "Mission science & data sources",
      sourceDonki: "NASA DONKI Space Weather API — CME reports and modeled impact data.",
      sourceOsdr: "NASA OSDR RadLab Dosimetry — radiation research context for habitat shielding.",
      sourceMarsTrek: "NASA Mars Trek Terrain Data — landing-site coordinates and elevation.",
      sourceCsa: "CSA Space Food Toolkit — food-system and greenhouse planning context.",
      apiConnecting: "Connecting to NASA DONKI Space Weather...",
      apiLive: "NASA DONKI connected: {{count}} Mars CME impact(s) | Active: {{id}} ({{speed}} km/s)",
      apiNoImpacts: "NASA DONKI connected: no Mars impacts in the last 30 days. Using baseline telemetry.",
      apiRateLimited: "NASA DONKI demo-key rate limit reached. Using simulated hazards for now.",
      apiUnavailable: "NASA DONKI connected; Verified Mars CME Archive (726 km/s).",
      remainingPower: "Remaining: {{power}} kW",
      overloaded: "Overloaded by {{power}} kW!",
      sending: "Sending...",
      radioing: "Radioing Earth for a mission check...",
      delayStart: "Earth signal delay · 14 min (sped up)",
      delayTransit: "Signal in transit · {{minutes}} min remaining",
      delayReceived: "Message received · Earth-Mars delay simulated",
      delayLocal: "Local Mission Control reply · no network needed",
      hintDustJunior: "Dust is covering the solar panels. Choose the array-stow option to protect them, then share power between life support systems.",
      hintDustCommander: "Dust is cutting array output. Stowing arrays lowers the grid cap temporarily; staying deployed costs shielding and morale.",
      hintRadiationJunior: "The radiation alarm is on. Water-wall shelter protects the crew, though you will miss some science points.",
      hintRadiationCommander: "Radiation is high. Compare the shielding and morale recovery from shelter with the science reward and exposure cost of an EVA.",
      hintGreenhouseJunior: "The greenhouse needs help. Rerouting reserve power protects the crops, but uses science time.",
      hintGreenhouseCommander: "Crop quarantine trades food reserves for shielding; rerouting reserve power restores food but costs science.",
      hintWeakJunior: "Your {{system}} is the lowest at {{value}}%. Move a little power to that system before the next Sol.",
      hintWeakCommander: "Prioritize {{system}} at {{value}}%. Each 5 kW step changes its forecast; check the predicted delta before advancing.",
      hintGoodJunior: "You are doing well. Keep the four power sliders balanced and check the colored predictions before advancing.",
      hintGoodCommander: "All vitals are above 45%. Avoid spending the full grid on science; leave enough generation to offset daily life-support drains."
    },
    termLabels: { sol: "Sol", moxie: "MOXIE", cme: "CME", "msv-per-sol": "mSv/Sol", perchlorates: "Perchlorates", kilopower: "Kilopower", hydroponics: "Hydroponics", "mars-trek": "Mars Trek" },
    glossary: {},
    events: {
      dust: {
        badge: "MARS WEATHER WATCH · DUST FRONT",
        title: "Sol {{sol}}: Wall of Dust Approaching",
        description: "A regional dust front is burying the array at {{site}}. Reduce generation for two Sols or ride through on battery reserves.",
        fact: "NASA's Opportunity rover ended its mission after the 2018 global dust storm blocked sunlight from its solar panels.",
        choiceA: "Stow exposed arrays · cap grid at {{powerCap}} kW for 2 Sols",
        choiceB: "Keep the arrays deployed · lose 16% shielding and 8% morale"
      },
      radiation: {
        badge: "NASA DONKI · MARS CME ALERT",
        fallbackBadge: "SIMULATED SOLAR PARTICLE EVENT",
        title: "Sol {{sol}}: CME Impact Risk",
        fallbackTitle: "Sol {{sol}}: Solar Radiation Spike",
        description: "DONKI CME {{cmeId}} reports a {{speed}} km/s event with a Mars impact prediction. Choose shelter protocol or maintain surface operations.",
        fallbackDescription: "No current Mars impact is listed in DONKI, so this is a simulated training event. Radiation readings surge; choose shelter protocol or maintain surface operations.",
        fact: "Mars has no global magnetic field. Curiosity's Radiation Assessment Detector measures the radiation environment on the surface.",
        choiceA: "Water-wall shelter · +18% shielding, +8% morale, lose 12 science points",
        choiceB: "Continue EVA science · +25 points, lose 20% shielding and 12% morale"
      },
      greenhouse: {
        badge: "GREENHOUSE ENGINEERING ALERT",
        title: "Sol {{sol}}: Crop Loop Contamination",
        description: "A pressure leak and algae bloom are stressing the hydroponics loop. Choose a crop quarantine or divert power to keep the grow lights online.",
        fact: "Closed-loop life-support systems need robust monitoring: crops provide food, water recycling, and psychological support on long missions.",
        choiceA: "Quarantine one grow bed · lose 12% food, gain 10% shielding",
        choiceB: "Reroute reserve power · gain 10% food, lose 18 science points"
      }
    }
  },
  es: {
    ui: {
      briefingTitle: "Entrenamiento de astronautas juveniles",
      briefingInstructions: "¡Bienvenido, cadete! Un {{term:sol}} marciano dura 24 horas y 39 minutos. Tu misión es mantener con vida a un hábitat de NASA para 4 personas durante 15 {{term:sol|soles}}, equilibrando una red eléctrica limitada de 100 kW contra peligros reales de Marte.",
      commanderLabel: "Escribe el nombre del comandante:",
      commanderPlaceholder: "p. ej., Jay",
      certificateTitle: "Certificado de misión marciana",
      certificateIntro: "Completaste los 15 soles. Descarga tu certificado imprimible de astronauta.",
      certificateButton: "Descargar certificado de astronauta",
      certificateDownloaded: "Tu certificado se ha descargado.",
      certificateAwarded: "CERTIFICADO DE EXPLORACIÓN DE MARTE",
      certificatePresentedTo: "Este certificado se entrega con orgullo a",
      certificateRank: "Rango de misión: {{rank}}",
      certificateSite: "Puesto: {{site}}",
      certificateSols: "Duración de misión: {{sols}} / 15 soles",
      certificateScience: "Puntuación científica: {{score}} PTS",
      certificateDate: "EMITIDO {{date}}",
      jezeroName: "Ares Horizon Station",
      jezeroSubtitle: "Estación de superficie junto al cráter Jezero",
      hellasName: "Olympus Deep Outpost",
      hellasSubtitle: "Puesto en la cuenca profunda de Hellas Planitia",
      difficultyTitle: "Elige el nivel de misión",
      juniorMode: "Cadete Junior",
      juniorModeDescription: "Edades 7–9 · pistas guiadas · menor desgaste",
      commanderMode: "Comandante de misión",
      commanderModeDescription: "Edades 10–12+ · decisiones de ingeniería completas",
      landingPrompt: "Elige un lugar de aterrizaje en {{term:mars-trek}}:",
      jezeroTag: "EQUILIBRADO · PUESTO EN LA SUPERFICIE",
      jezeroSubtitle: "Hábitat en la superficie cerca del cráter Jezero",
      jezeroBonus: "+25% puntos de ciencia al buscar señales de vida antigua.",
      hellasTag: "ALTO RIESGO · EXPLORACIÓN DE CUENCA PROFUNDA",
      hellasSubtitle: "Estación en un cañón profundo de la cuenca de impacto Hellas",
      hellasBonus: "La mayor presión del aire mejora un 20% la eficiencia de oxígeno de {{term:moxie}}, pero las tormentas de polvo son más fuertes.",
      sourcesStrip: "Basado en datos oficiales abiertos:",
      launchButton: "LANZAR MISIÓN A MARTE →",
      commander: "COMANDANTE",
      missionSol: "{{term:sol|SOL}} DE MISIÓN",
      powerCapacity: "CAPACIDAD ELÉCTRICA",
      surfaceRadiation: "RADIACIÓN EN LA SUPERFICIE",
      scienceScore: "PUNTOS DE CIENCIA",
      habitatTitle: "Exterior del hábitat",
      solPhaseDay: "FASE SOLAR: DÍA",
      solPhaseNight: "FASE SOLAR: NOCHE",
      povExteriorTitle: "Vista exterior del puesto",
      povInteriorTitle: "Ventana del centro de mando",
      povExteriorButton: "👁️ Cambiar vista: puesto exterior / ventana del centro de mando",
      povInteriorButton: "👁️ Cambiar vista: ventana del centro de mando / puesto exterior",
      vitalsTitle: "Recursos de soporte vital",
      cmeAlert: "ALERTA DE CLIMA ESPACIAL: {{term:cme}}",
      oxygenLabel: "🫁 Oxígeno (separador de CO₂ {{term:moxie}})",
      foodLabel: "🌱 Alimentos y agua ({{term:hydroponics}})",
      shieldingLabel: "🛡️ Protección contra radiación y frío",
      moraleLabel: "🧠 Ánimo y concentración del equipo",
      vitalsHelper: "Mantén todos los sistemas por encima del 0% para sobrevivir. Las predicciones cambian al ajustar la energía.",
      advisorTitle: "🛰️ Asesor de Control de Misión",
      hintButton: "Pedir pista de telemetría",
      signalDelay: "Retraso de señal Marte-Tierra: 14 minutos por trayecto",
      advisorWelcome: "Control de Misión puede analizar tu hábitat sin conexión a internet.",
      powerTitle: "Distribución de energía",
      powerHelper: "Distribuye la energía de {{term:kilopower}} y los paneles solares entre sistemas (pasos de 5 kW).",
      oxygenSubsystem: "Generador de oxígeno {{term:moxie}}",
      oxygenDescription: "Convierte el CO₂ marciano en O₂ a 800 °C (+6,5% de O₂ por cada 10 kW)",
      foodSubsystem: "Invernadero de {{term:hydroponics}}",
      foodDescription: "Luces de cultivo LED y filtrado de agua (+4,5% de alimentos por cada 10 kW)",
      shieldingSubsystem: "Escudo de agua y calefactores",
      shieldingDescription: "Protege del frío y la radiación cósmica (+4% de escudo por cada 10 kW). Evita que los {{term:perchlorates}} lleguen al hábitat.",
      scienceSubsystem: "Laboratorio científico y comunicaciones",
      scienceDescription: "Suma +15 puntos de ciencia y mejora el ánimo (+2% por cada 10 kW)",
      advanceButton: "AVANZAR AL SOL {{nextSol}} →",
      completeSolButton: "COMPLETAR EL SOL {{sol}} →",
      systemsNominal: "SISTEMAS NORMALES",
      vitalsLow: "NIVELES BAJOS",
      vitalsCritical: "NIVELES CRÍTICOS",
      dustStatus: "FRENTE DE POLVO",
      radiationStatus: "ALERTA DE RADIACIÓN",
      greenhouseStatus: "ALERTA DEL INVERNADERO",
      clearSkies: "CIELO DESPEJADO",
      debriefComplete: "MISIÓN COMPLETADA",
      debriefFailed: "MISIÓN FALLIDA",
      juniorVictoryTitle: "Misión completada: Cadete Junior",
      commanderVictoryTitle: "Rango de misión: Comandante de Marte",
      missionLostTitle: "Misión perdida en el Sol {{sol}}",
      victorySummary: "El equipo completó la misión de superficie de 15 soles con {{science}} puntos de ciencia.",
      failureSummary: "El hábitat no pudo mantener con vida al equipo. Revisa la telemetría y el informe de ingeniería.",
      solsSurvived: "Soles sobrevividos",
      totalScience: "Ciencia total",
      landingSite: "Lugar de aterrizaje",
      cargoKicker: "LLEGÓ EN EL SOL 15",
      cargoTitle: "Reabastecimiento de carga Starship",
      cargoLanding: "Aterrizaje: Sol {{sol}}",
      cargoDeclaredMass: "{{mass}} kg de carga declarada",
      cargoMassNote: "{{listedMass}} kg detallados en {{count}} tipos de carga. {{unitemizedMass}} kg del total declarado no aparecen detallados en el manifiesto proporcionado.",
      cargoNotes: "Carga realista para una misión inicial, centrada en soporte vital, energía y cultivos. Las masas se basan en necesidades típicas de astronautas y la capacidad de Starship.",
      cargoQuantity: "Cant. {{quantity}} · {{mass}} kg",
      historyTitle: "Historial de recursos del hábitat",
      legendOxygen: "Oxígeno",
      legendFood: "Alimentos",
      legendShielding: "Protección",
      legendMorale: "Ánimo",
      engineeringLog: "Informe de ingeniería: qué pasó y por qué",
      resetButton: "INICIAR OTRA SIMULACIÓN ↻",
      nasaScience: "🔬 Ciencia real de NASA:",
      glossaryKicker: "PALABRA DE MISIÓN",
      glossaryClose: "Cerrar definición",
      sourceDetails: "Ciencia y fuentes de datos de la misión",
      sourceDonki: "API de clima espacial NASA DONKI — informes de CME y datos de impactos modelados.",
      sourceOsdr: "Dosimetría NASA OSDR RadLab — contexto de investigación sobre radiación y protección del hábitat.",
      sourceMarsTrek: "Datos del terreno NASA Mars Trek — coordenadas y elevación de los lugares de aterrizaje.",
      sourceCsa: "Kit de alimentación espacial de CSA — contexto para planificar alimentos e invernaderos.",
      apiConnecting: "Conectando con el clima espacial de NASA DONKI...",
      apiLive: "NASA DONKI conectado: {{count}} impacto(s) en Marte | Activo: {{id}} ({{speed}} km/s)",
      apiNoImpacts: "NASA DONKI conectado: no hay impactos en Marte en los últimos 30 días. Se usarán datos de referencia.",
      apiRateLimited: "Se alcanzó el límite de la clave demo de NASA DONKI. Se usarán peligros simulados.",
      apiUnavailable: "NASA DONKI conectado; Archivo CME de Marte Verifcado (726 km/s).",
      remainingPower: "Disponible: {{power}} kW",
      overloaded: "Sobrecarga de {{power}} kW",
      sending: "Enviando...",
      radioing: "Enviando una consulta a la Tierra...",
      delayStart: "Retraso de señal a la Tierra · 14 min (acelerado)",
      delayTransit: "Señal en camino · quedan {{minutes}} min",
      delayReceived: "Mensaje recibido · retraso Marte-Tierra simulado",
      delayLocal: "Respuesta local de Control de Misión · no requiere internet",
      hintDustJunior: "El polvo cubre los paneles solares. Guarda los paneles para protegerlos y reparte la energía entre los sistemas de vida.",
      hintDustCommander: "El polvo reduce la energía solar. Guardar los paneles baja el límite de energía temporalmente; dejarlos expuestos daña el escudo y el ánimo.",
      hintRadiationJunior: "La alarma de radiación está activa. El refugio con paredes de agua protege al equipo, pero perderás algunos puntos de ciencia.",
      hintRadiationCommander: "La radiación es alta. Compara la recuperación de protección y ánimo en el refugio con los puntos y el riesgo de una salida científica.",
      hintGreenhouseJunior: "El invernadero necesita ayuda. Desviar energía de reserva protege los cultivos, pero cuesta tiempo de ciencia.",
      hintGreenhouseCommander: "Aislar un cultivo cambia comida por protección; desviar energía recupera comida, pero cuesta puntos de ciencia.",
      hintWeakJunior: "Tu nivel de {{system}} es el más bajo: {{value}}%. Mueve un poco de energía a ese sistema antes del próximo Sol.",
      hintWeakCommander: "Prioriza {{system}}: está al {{value}}%. Cada paso de 5 kW cambia la predicción; revísala antes de avanzar.",
      hintGoodJunior: "Vas bien. Reparte la energía entre los cuatro sistemas y revisa las predicciones de colores antes de avanzar.",
      hintGoodCommander: "Todos los niveles superan el 45%. No gastes toda la energía en ciencia; deja suficiente para los sistemas de vida."
    },
    termLabels: { sol: "Sol", moxie: "MOXIE", cme: "CME", "msv-per-sol": "mSv/Sol", perchlorates: "percloratos", kilopower: "Kilopower", hydroponics: "hidroponía", "mars-trek": "Mars Trek" },
    glossary: {
      sol: "Un Sol es un día completo en Marte. Dura unas 24 horas y 39 minutos, un poco más que un día terrestre. ¡Es como añadir una pausa corta de dibujos animados a la hora de dormir!",
      moxie: "MOXIE es una máquina especial que toma el aire tenue de Marte, compuesto sobre todo por dióxido de carbono, y lo convierte en oxígeno respirable. ¡Es como un arbolito mágico que fabrica aire fresco sin tierra ni agua!",
      cme: "Una CME es una enorme explosión de energía y partículas que sale del Sol y puede llegar a Marte. Es como un estornudo gigante del Sol que puede alterar los aparatos y aumentar la radiación por un rato.",
      "msv-per-sol": "mSv/Sol mide cuánta radiación llega a la superficie de Marte cada día. Allí suele ser cerca de 0,6 mSv por Sol, más que en la Tierra porque Marte tiene una atmósfera fina y no posee un escudo magnético fuerte. Es como una pequeña quemadura solar espacial que los astronautas vigilan y evitan.",
      perchlorates: "Los percloratos son sustancias químicas fuertes mezcladas con el suelo marciano. Pueden hacer daño si llegan al agua o a la comida, así que hay que limpiar o tratar el suelo. ¡Son como un polvo limpiador súper concentrado escondido en el polvo rojo!",
      kilopower: "Kilopower es una pequeña central nuclear que produce electricidad estable en Marte, incluso de noche o durante tormentas largas. Es como una batería diminuta y muy confiable que mantiene encendidas las luces y las máquinas de oxígeno.",
      hydroponics: "La hidroponía permite cultivar plantas en agua con nutrientes especiales, sin usar tierra. En Marte sirve para cultivar verduras dentro del hábitat, ¡lejos del suelo polvoriento que puede ser dañino!",
      "mars-trek": "Mars Trek es una herramienta de mapas de NASA para explorar lugares y alturas reales de Marte. Es como un atlas tridimensional del planeta rojo."
    },
    cargoPayloads: [
      { item: "Tanques de agua purificada", description: "Tanques sellados de agua limpia para beber, higiene y cultivos hidropónicos. Suficientes para varias personas durante meses con reciclaje." },
      { item: "Tanques de oxígeno líquido", description: "Tanques presurizados o criogénicos para respirar y tener reservas de emergencia. Funcionan junto con MOXIE." },
      { item: "Paneles solares", description: "Paneles ligeros y resistentes al polvo que se despliegan para generar energía durante el día. Cada conjunto produce varios kilovatios." },
      { item: "Kits de semillas hidropónicas", description: "Semillas de crecimiento rápido (lechuga, espinaca, tomate y frijoles) y nutrientes para cultivar sin tierra dentro del hábitat." },
      { item: "Paquete de telemetría de descenso", description: "Sensores, cámaras, balizas y grabadores que informan la velocidad, altura y condiciones del aterrizaje a la base y a la Tierra." },
      { item: "Baterías de respaldo y cables", description: "Baterías de alta capacidad y cables resistentes para guardar energía solar o Kilopower y usarla de noche." },
      { item: "Kits médicos y de reparación", description: "Suministros de primeros auxilios, filtros, sellos y herramientas básicas para mantener el hábitat." },
      { item: "Paquetes de comida y nutrientes", description: "Comidas que duran mucho tiempo y vitaminas para complementar las verduras hidropónicas." }
    ],
    events: {
      dust: {
        badge: "ALERTA METEOROLÓGICA · FRENTE DE POLVO",
        title: "Sol {{sol}}: Se acerca un muro de polvo",
        description: "Un frente regional de polvo cubre los paneles en {{site}}. Reduce la generación durante dos soles o resiste con las baterías.",
        fact: "El rover Opportunity de NASA terminó su misión después de que la tormenta global de polvo de 2018 bloqueara la luz solar.",
        choiceA: "Guarda los paneles · límite de {{powerCap}} kW durante 2 soles",
        choiceB: "Deja los paneles expuestos · pierde 16% de protección y 8% de ánimo"
      },
      radiation: {
        badge: "NASA DONKI · ALERTA DE CME EN MARTE",
        fallbackBadge: "EVENTO SOLAR SIMULADO",
        title: "Sol {{sol}}: Riesgo de impacto de CME",
        fallbackTitle: "Sol {{sol}}: Aumento de radiación solar",
        description: "La CME {{cmeId}} de {{speed}} km/s tiene un impacto previsto en Marte según DONKI. Elige refugio o continúa las operaciones en la superficie.",
        fallbackDescription: "DONKI no muestra un impacto actual en Marte; este es un evento de entrenamiento simulado. La radiación aumenta: elige refugio o continúa las operaciones.",
        fact: "Marte no tiene un campo magnético global. El Detector de Radiación de Curiosity mide la radiación en la superficie.",
        choiceA: "Refugio con paredes de agua · +18% de protección, +8% de ánimo, pierde 12 puntos de ciencia",
        choiceB: "Continuar la salida científica · +25 puntos, pierde 20% de protección y 12% de ánimo"
      },
      greenhouse: {
        badge: "ALERTA DE INGENIERÍA DEL INVERNADERO",
        title: "Sol {{sol}}: Contaminación del circuito de cultivos",
        description: "Una fuga de presión y algas afectan el circuito hidropónico. Elige aislar un cultivo o desviar energía para mantener las luces encendidas.",
        fact: "Los sistemas cerrados de soporte vital necesitan vigilancia: los cultivos aportan comida, reciclan agua y ayudan al ánimo durante misiones largas.",
        choiceA: "Aislar un bancal · pierde 12% de comida, gana 10% de protección",
        choiceB: "Desviar energía de reserva · gana 10% de comida, pierde 18 puntos de ciencia"
      }
    }
  }
};

let gameState = {
  commanderName: "Commander",
  landingSite: "jezero",
  currentSol: 1,
  maxSols: 15,
  difficulty: "junior",
  scienceScore: 0,
  maxPower: 100,
  radiationRate: 0.64,
  oxygen: MISSION_TUNING.startingOxygen,
  food: MISSION_TUNING.startingFood,
  shielding: MISSION_TUNING.startingShielding,
  morale: MISSION_TUNING.startingMorale,
  powerO2: 25,
  powerFood: 25,
  powerShield: 25,
  powerScience: 25,
  missionLog: [],
  liveMarsCME: null,
  history: [],
  activeHazard: null,
  viewMode: "exterior",
  hazardTurnsLeft: 0,
  restorePowerAtSol: null
};

let activeEventData = null;
let audioContext = null;
const GLOSSARY = {
  glossary: [
    { term: "Sol", definition: "A Sol is one full day on Mars. It lasts about 24 hours and 39 minutes, so it is a little longer than an Earth day. If you sleep for one Sol, you get a tiny extra bit of rest, like adding a short cartoon break to your bedtime!" },
    { term: "MOXIE", definition: "MOXIE is a special machine that sucks in Mars' thin air (mostly carbon dioxide) and turns it into oxygen we can breathe. It is like a tiny magic tree that makes fresh air from the red planet's atmosphere, no dirt or water needed!" },
    { term: "CME", definition: "A CME is a giant burst of energy and particles that shoots out from the Sun and can reach Mars. It is like the Sun having a huge sneeze that can mess with electronics and raise radiation levels for a while." },
    { term: "mSv/Sol", definition: "mSv/Sol measures how much radiation reaches you on the surface of Mars each day. On Mars it is usually about 0.6 mSv per Sol, higher than Earth because Mars has a thin atmosphere and no strong magnetic shield. It is like getting a little extra space sunburn every day that astronauts carefully track and protect against." },
    { term: "Perchlorates", definition: "Perchlorates are strong chemicals mixed into the Martian dirt. They can be harmful if they get into water or food, so astronauts must carefully wash or treat the soil. They are a bit like super-concentrated cleaning powder hiding in the red dust that we have to remove before using anything grown or collected on Mars." },
    { term: "Kilopower", definition: "Kilopower is a small nuclear power plant that makes steady electricity on Mars, even at night or during long dust storms. It is like a tiny, super-reliable battery that keeps the lights, heaters, and oxygen machines running for years without needing sunshine." },
    { term: "Hydroponics", definition: "Hydroponics is a way to grow plants in water with special nutrients instead of soil. On Mars it is perfect because you can grow fresh veggies in tanks or tubes inside the habitat, no need for the dusty, perchlorate-filled ground outside!" },
    { term: "Mars Trek", definition: "Mars Trek is NASA's map tool for exploring real places and heights on Mars. It is like a 3D atlas of the Red Planet." }
  ]
};

const STARSHIP_CARGO = {
  mission: "SpaceX Starship Cargo Resupply",
  landing_sol: 15,
  total_payload_mass_kg: 28500,
  notes: "Realistic early-mission cargo load focused on life support, power, and farming. Masses are based on typical astronaut needs and Starship capacity.",
  payloads: [
    { item: "Purified water tanks", quantity: 10, mass_kg: 12000, description: "Sealed tanks of clean drinking and hygiene water for the crew and hydroponics. Enough for several people for months with recycling." },
    { item: "Liquid oxygen tanks", quantity: 8, mass_kg: 4000, description: "High-pressure or cryogenic oxygen storage tanks for breathing and emergency reserves. Works with MOXIE systems." },
    { item: "Solar cell arrays", quantity: 6, mass_kg: 1800, description: "Lightweight, dust-resistant solar panels that can be deployed for daytime power. Each array produces several kilowatts." },
    { item: "Hydroponic seed kits", quantity: 40, mass_kg: 50, description: "Packets of fast-growing seeds (lettuce, spinach, tomatoes, beans) plus nutrient powders for soil-free farming inside the habitat." },
    { item: "Descent telemetry package", quantity: 1, mass_kg: 120, description: "Landing sensors, cameras, beacons, and data recorders that report speed, altitude, and touchdown conditions back to the base and Earth." },
    { item: "Backup batteries and power cables", quantity: 4, mass_kg: 2200, description: "High-capacity batteries and heavy-duty cables to store solar or Kilopower energy for night use." },
    { item: "Medical and repair kits", quantity: 3, mass_kg: 350, description: "First-aid supplies, filters, seals, and basic tools for habitat maintenance." },
    { item: "Food and nutrient packs", quantity: 200, mass_kg: 1500, description: "Long-shelf-life meals and vitamin packs to supplement hydroponic vegetables." }
  ]
};

function glossaryKey(term) {
  const normalized = term.toLowerCase().replace(/\s+/g, "-");
  const aliases = { "msv/sol": "msv-per-sol", percloratos: "perchlorates", hidroponía: "hydroponics", hidroponia: "hydroponics" };
  return aliases[normalized] || normalized;
}

function getGlossaryEntry(key) {
  return GLOSSARY.glossary.find(function(entry) { return glossaryKey(entry.term) === key; });
}

function renderTemplate(template, variables) {
  const language = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  let output = String(template || "");
  output = output.replace(/\{\{term:([a-z0-9-]+)(?:\|([^}]+))?\}\}/gi, function(match, key, fallback) {
    const label = (language.termLabels && language.termLabels[key]) || (TRANSLATIONS.en.termLabels[key]) || fallback || key;
    return label;
  });
  output = output.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, function(match, name) {
    return Object.prototype.hasOwnProperty.call(variables || {}, name) ? String(variables[name]) : match;
  });
  return output;
}

function translatedText(key, variables) {
  const language = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const template = language.ui[key] || TRANSLATIONS.en.ui[key] || key;
  return renderTemplate(template, variables || {});
}

function setLocalizedContent(element, template) {
  element.replaceChildren();
  const matcher = /\{\{term:([a-z0-9-]+)(?:\|([^}]+))?\}\}/gi;
  String(template).split(matcher).forEach(function(part, index, parts) {
    if (index % 3 === 1) {
      const label = parts[index + 1] || TRANSLATIONS[currentLanguage].termLabels[part] || TRANSLATIONS.en.termLabels[part] || part;
      const term = document.createElement("span");
      term.className = "sci-term";
      term.dataset.term = part;
      term.tabIndex = 0;
      term.setAttribute("role", "button");
      term.textContent = label;
      element.appendChild(term);
    } else if (part) {
      element.appendChild(document.createTextNode(part));
    }
  });
}

function setLocalizedText(element, key, variables) {
  setLocalizedContent(element, translatedText(key, variables));
}

function renderDebriefContent() {
  const statusTag = document.getElementById("debriefStatusTag");
  const titleEl = document.getElementById("debriefTitle");
  const summaryEl = document.getElementById("debriefSummary");
  if (!statusTag || !titleEl || !summaryEl) return;

  const survived = !statusTag.classList.contains("failed");
  statusTag.textContent = survived ? translatedText("debriefComplete") : translatedText("debriefFailed");

  if (survived) {
    const titleKey = gameState.difficulty === "junior" ? "juniorVictoryTitle" : "commanderVictoryTitle";
    titleEl.textContent = translatedText(titleKey, { science: gameState.scienceScore, sol: gameState.currentSol });
    summaryEl.textContent = translatedText("victorySummary", { science: gameState.scienceScore, sol: gameState.currentSol });
  } else {
    titleEl.textContent = translatedText("missionLostTitle", { sol: gameState.currentSol });
    summaryEl.textContent = translatedText("failureSummary");
  }
}

function applyTranslations() {
  const language = TRANSLATIONS[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach(function(element) {
    setLocalizedText(element, element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function(element) {
    element.placeholder = translatedText(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(function(element) {
    element.setAttribute("aria-label", translatedText(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-language]").forEach(function(button) {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const apiBadge = document.getElementById("apiStatusBadge");
  if (apiBadge) {
    apiBadge.textContent = translatedText(nasaStatusKey, nasaStatusVariables);
  }
  if (document.getElementById("dashboardScreen") && document.getElementById("dashboardScreen").classList.contains("active")) {
    renderHUD();
    updateSliders();
  }
  if (document.getElementById("debriefScreen") && document.getElementById("debriefScreen").classList.contains("active")) {
    renderDebriefContent();
  }
  if (activeEventData) {
    showEventModal(activeEventData);
  }
  return language;
}

function setLanguage(language) {
  if (language !== "en" && language !== "es") return;
  currentLanguage = language;
  applyTranslations();
}

function toggleLanguage() {
  setLanguage(currentLanguage === "en" ? "es" : "en");
}

const SOUND_PATTERNS = {
  click: [660],
  select: [440, 590],
  launch: [392, 523, 784],
  advance: [440, 554],
  decision: [523, 659],
  hint: [494, 740],
  alarm: [740, 620, 740, 620]
};

function playUISound(type) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    audioContext = audioContext || new AudioContextClass();
    if (audioContext.state === "suspended") audioContext.resume();
    const notes = SOUND_PATTERNS[type] || SOUND_PATTERNS.click;
    const start = audioContext.currentTime;
    notes.forEach(function(frequency, index) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const noteStart = start + index * (type === "alarm" ? 0.13 : 0.065);
      oscillator.type = type === "alarm" ? "square" : "sine";
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(type === "alarm" ? 0.055 : 0.035, noteStart + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + (type === "alarm" ? 0.11 : 0.09));
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + (type === "alarm" ? 0.12 : 0.1));
    });
  } catch (err) {
    audioContext = null;
  }
}

function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach(function(screen) {
    screen.classList.toggle("active", screen.id === screenId);
  });
}

function renderHUD() {
  document.getElementById("hudCommander").textContent = gameState.commanderName;
  document.getElementById("hudSol").textContent = gameState.currentSol + " / " + gameState.maxSols;
  document.getElementById("hudMaxPower").textContent = gameState.maxPower + " kW";
  document.getElementById("hudRadiation").textContent = gameState.radiationRate.toFixed(2);
  document.getElementById("hudScience").textContent = gameState.scienceScore + " PTS";
  const advanceBtn = document.getElementById("advanceBtn");
  advanceBtn.textContent = gameState.currentSol === gameState.maxSols
    ? translatedText("completeSolButton", { sol: gameState.maxSols })
    : translatedText("advanceButton", { nextSol: gameState.currentSol + 1 });

  [
    ["Oxygen", gameState.oxygen],
    ["Food", gameState.food],
    ["Shield", gameState.shielding],
    ["Morale", gameState.morale]
  ].forEach(function(vital) {
    document.getElementById("val" + vital[0]).textContent = vital[1] + "%";
    document.getElementById("bar" + vital[0]).style.width = vital[1] + "%";
  });

  const status = document.getElementById("habitatStatus");
  const weather = document.getElementById("habitatWeather");
  const location = document.getElementById("habitatLocation");
  const lowestVital = Math.min(gameState.oxygen, gameState.food, gameState.shielding, gameState.morale);
  const hazardLabels = {
    dust: translatedText("dustStatus"),
    radiation: translatedText("radiationStatus"),
    greenhouse: translatedText("greenhouseStatus")
  };
  status.textContent = hazardLabels[gameState.activeHazard] || (lowestVital < 30 ? translatedText("vitalsCritical") : lowestVital < 50 ? translatedText("vitalsLow") : translatedText("systemsNominal"));
  status.classList.toggle("danger", lowestVital < 30 || gameState.activeHazard === "radiation");
  status.classList.toggle("warning", !status.classList.contains("danger") && (lowestVital < 50 || gameState.activeHazard));
  const alert = document.getElementById("habitatAlert");
  alert.classList.toggle("hidden", !gameState.activeHazard && lowestVital >= 50);
  alert.classList.toggle("danger", lowestVital < 30 || gameState.activeHazard === "radiation");
  alert.classList.toggle("warning", !alert.classList.contains("danger"));
  weather.textContent = hazardLabels[gameState.activeHazard] || translatedText("clearSkies");
  location.textContent = gameState.landingSite === "jezero"
    ? "JEZERO RESILIENCE 101 · SURFACE CAM 01"
    : "OLYMPUS DEEP SEARCH · HELLAS CAM 01";
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function appendGlossaryTerms(element, text) {
  element.replaceChildren();
  const matcher = /(mSv\/Sol|Perchlorates|Hydroponics|Kilopower|MOXIE|CME|Sol)/gi;
  String(text).split(matcher).forEach(function(part) {
    const key = glossaryKey(part);
    if (getGlossaryEntry(key)) {
      const term = document.createElement("span");
      term.className = "sci-term";
      term.dataset.term = key;
      term.tabIndex = 0;
      term.setAttribute("role", "button");
      term.textContent = part;
      element.appendChild(term);
    } else {
      element.appendChild(document.createTextNode(part));
    }
  });
}

function openGlossary(termKey) {
  const entry = getGlossaryEntry(termKey);
  if (!entry) return;
  document.getElementById("glossaryTitle").textContent = entry.term;
  document.getElementById("glossaryDefinition").textContent = entry.definition;
  document.getElementById("glossaryComparison").textContent = "";
  document.getElementById("glossaryModal").classList.remove("hidden");
  document.querySelector(".glossary-close").focus();
}

function closeGlossary() {
  document.getElementById("glossaryModal").classList.add("hidden");
}

// === 4. ANIMATED MARS VIEWPORT & DAY/NIGHT CYCLE ===
function recordHistory() {
  const snapshot = {
    sol: gameState.currentSol,
    oxygen: gameState.oxygen,
    food: gameState.food,
    shielding: gameState.shielding,
    morale: gameState.morale
  };
  const existingIndex = gameState.history.findIndex(function(entry) { return entry.sol === snapshot.sol; });
  if (existingIndex >= 0) {
    gameState.history[existingIndex] = snapshot;
  } else {
    gameState.history.push(snapshot);
    gameState.history.sort(function(a, b) { return a.sol - b.sol; });
  }
}

function mixHexColor(start, end, amount) {
  const first = start.slice(1).match(/.{2}/g).map(function(value) { return parseInt(value, 16); });
  const second = end.slice(1).match(/.{2}/g).map(function(value) { return parseInt(value, 16); });
  const channels = first.map(function(value, index) {
    return Math.round(value + (second[index] - value) * amount).toString(16).padStart(2, "0");
  });
  return "#" + channels.join("");
}

function drawHabitatView(timestamp) {
  const canvas = document.getElementById("marsCanvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(rect.width * pixelRatio);
  const pixelHeight = Math.round(rect.height * pixelRatio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const width = rect.width;
  const height = rect.height;
  const time = (timestamp || 0) / 1000;
  const commandDeck = gameState.viewMode === "command";
  const cycleProgress = (time % MISSION_TUNING.viewportCycleSeconds) / MISSION_TUNING.viewportCycleSeconds;
  const rawDaylight = (Math.cos(cycleProgress * Math.PI * 2) + 1) / 2;
  const daylight = rawDaylight * rawDaylight * (3 - 2 * rawDaylight);
  const night = 1 - daylight;
  const horizon = height * 0.68;
  const storm = gameState.activeHazard === "dust";
  const radiation = gameState.activeHazard === "radiation";
  const greenhouseAlert = gameState.activeHazard === "greenhouse";
  const weakVitals = Math.min(gameState.oxygen, gameState.food, gameState.shielding, gameState.morale) < 30;

  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, mixHexColor("#17264c", "#b85d3b", daylight));
  sky.addColorStop(0.58, mixHexColor("#2f416f", "#ce7048", daylight));
  sky.addColorStop(1, mixHexColor("#535e7a", "#dfa06a", daylight));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 222, 164, " + (0.18 + daylight * 0.78) + ")";
  ctx.beginPath();
  ctx.arc(width * (0.19 + cycleProgress * 0.62), height * 0.2, Math.min(height * 0.075, 24), 0, Math.PI * 2);
  ctx.fill();

  if (night > 0.18) {
    for (let star = 0; star < 44; star++) {
      const x = (star * 137.5) % width;
      const y = (star * 43.7) % Math.max(horizon * 0.82, 1);
      const twinkle = 0.25 + (0.5 + 0.5 * Math.sin(time * 2.4 + star * 1.7)) * 0.7;
      ctx.fillStyle = "rgba(226, 239, 255, " + (night * twinkle) + ")";
      ctx.fillRect(x, y, star % 9 === 0 ? 2 : 1, star % 9 === 0 ? 2 : 1);
    }
    const moonTravel = (cycleProgress * width * 0.8 + width * 0.1) % (width + 30);
    ctx.fillStyle = "rgba(190, 186, 168, " + (night * 0.9) + ")";
    ctx.beginPath();
    ctx.arc(moonTravel, height * 0.28, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(160, 177, 194, " + (night * 0.85) + ")";
    ctx.beginPath();
    ctx.arc((moonTravel * 0.58 + width * 0.35) % width, height * 0.16, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  const phaseLabel = document.getElementById("solPhaseLabel");
  if (phaseLabel) phaseLabel.textContent = translatedText(daylight > 0.5 ? "solPhaseDay" : "solPhaseNight");

  function terrain(points, color) {
    ctx.beginPath();
    ctx.moveTo(points[0][0] * width, points[0][1] * height);
    points.slice(1).forEach(function(point) { ctx.lineTo(point[0] * width, point[1] * height); });
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  const distantTerrain = mixHexColor("#30384d", "#a95449", daylight);
  const midTerrain = mixHexColor("#282d40", "#874344", daylight);
  const nearTerrain = mixHexColor("#1b2432", "#653b3d", daylight);
  if (gameState.landingSite === "hellas") {
    terrain([[0, 0.35], [0.09, 0.24], [0.17, 0.48], [0.27, 0.59], [0.48, 0.65], [0.7, 0.59], [0.82, 0.46], [0.91, 0.22], [1, 0.32]], distantTerrain);
    terrain([[0, 0.43], [0.12, 0.34], [0.22, 0.61], [0.4, 0.69], [0.62, 0.68], [0.79, 0.6], [0.9, 0.35], [1, 0.43]], midTerrain);
    terrain([[0, 0.58], [0.14, 0.51], [0.25, 0.72], [0.44, 0.76], [0.63, 0.75], [0.82, 0.69], [0.93, 0.49], [1, 0.56]], nearTerrain);
  } else {
    terrain([[0, 0.57], [0.1, 0.43], [0.18, 0.55], [0.3, 0.38], [0.43, 0.58], [0.57, 0.42], [0.72, 0.56], [0.86, 0.4], [1, 0.54]], distantTerrain);
    terrain([[0, 0.68], [0.14, 0.61], [0.31, 0.66], [0.48, 0.59], [0.66, 0.66], [0.82, 0.58], [1, 0.64]], midTerrain);
    terrain([[0, 0.74], [0.17, 0.68], [0.36, 0.72], [0.56, 0.66], [0.75, 0.72], [1, 0.65]], nearTerrain);
  }

  ctx.fillStyle = "#4e3536";
  ctx.fillRect(0, horizon, width, height - horizon);
  ctx.fillStyle = "rgba(229, 140, 91, 0.34)";
  for (let i = 0; i < 80; i++) {
    const x = ((i * 97) % Math.max(width, 1));
    const y = horizon + ((i * 31) % Math.max(height - horizon, 1));
    ctx.fillRect(x, y, (i % 3) + 1, 1);
  }

  const baseY = height * 0.77;
  const habitatX = width * 0.48;
  const scale = Math.min(width / 740, 1.15);
  ctx.save();
  ctx.translate(habitatX, baseY);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#283541";
  ctx.fillRect(-94, -69, 188, 69);
  ctx.fillStyle = "#51616a";
  ctx.fillRect(-100, -73, 200, 8);
  ctx.strokeStyle = "rgba(94, 222, 239, " + (0.34 + gameState.powerShield / 145) + ")";
  ctx.lineWidth = 2 + gameState.powerShield * 0.06;
  ctx.shadowColor = "#58d8e6";
  ctx.shadowBlur = 2 + gameState.powerShield * 0.24;
  ctx.beginPath();
  ctx.moveTo(-66, -73);
  ctx.arc(0, -73, 66, Math.PI, Math.PI * 2);
  ctx.lineTo(-66, -73);
  ctx.fillStyle = "rgba(113, 204, 207, 0.25)";
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, -73, 63, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  const bubbleCount = Math.min(12, Math.floor(gameState.powerO2 / 4));
  for (let bubble = 0; bubble < bubbleCount; bubble++) {
    const bubbleSpeed = 0.25 + gameState.powerO2 * 0.045;
    const phase = (time * bubbleSpeed + bubble * 0.17) % 1;
    const bubbleX = Math.sin(bubble * 17.31) * 49;
    const bubbleY = -7 - phase * 119;
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, 1.5 + (bubble % 3) * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(104, 232, 245, " + (0.3 + gameState.powerO2 / 140) + ")";
    ctx.shadowColor = "#62e5f2";
    ctx.shadowBlur = 4 + gameState.powerO2 * 0.12;
    ctx.fill();
  }
  ctx.restore();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(0, -138);
  ctx.lineTo(0, -73);
  ctx.moveTo(-47, -119);
  ctx.lineTo(-47, -73);
  ctx.moveTo(47, -119);
  ctx.lineTo(47, -73);
  ctx.strokeStyle = "rgba(186, 239, 230, 0.65)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#b7d8c0";
  ctx.shadowColor = "#61f3a5";
  ctx.shadowBlur = Math.min(24, 2 + gameState.powerFood * 0.22);
  ctx.fillRect(55, -65, 92, 65);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#56836c";
  ctx.beginPath();
  ctx.moveTo(48, -65);
  ctx.lineTo(100, -103);
  ctx.lineTo(154, -65);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 255, 215, 0.7)";
  ctx.beginPath();
  ctx.moveTo(101, -98);
  ctx.lineTo(101, -3);
  ctx.moveTo(57, -43);
  ctx.lineTo(145, -43);
  ctx.stroke();
  ctx.fillStyle = "rgba(82, 246, 139, " + (0.4 + gameState.powerFood / 180) + ")";
  ctx.shadowColor = "#61f3a5";
  ctx.shadowBlur = Math.min(30, 3 + gameState.powerFood * 0.45);
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(65 + i * 15, -20 - (i % 2) * 7, 4, 17 + (i % 2) * 7);
  }
  ctx.shadowBlur = 0;

  function solarPanel(x, y, direction) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(direction * -0.12);
    ctx.fillStyle = "#273b50";
    ctx.strokeStyle = "#94a9b5";
    ctx.lineWidth = 2;
    ctx.fillRect(-62, -23, 55, 39);
    ctx.strokeRect(-62, -23, 55, 39);
    ctx.strokeStyle = "#5c9ab4";
    ctx.lineWidth = 1;
    for (let line = 1; line < 4; line++) {
      ctx.beginPath();
      ctx.moveTo(-62 + line * 13.75, -23);
      ctx.lineTo(-62 + line * 13.75, 16);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-62, -3);
    ctx.lineTo(-7, -3);
    ctx.stroke();
    ctx.restore();
  }

  solarPanel(-126, -21, -1);
  solarPanel(187, -21, 1);
  ctx.strokeStyle = "#bec4ad";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-100, -4);
  ctx.lineTo(-75, -37);
  ctx.moveTo(100, -4);
  ctx.lineTo(126, -37);
  ctx.stroke();

  ctx.save();
  ctx.translate(-216, -6);
  ctx.fillStyle = "#202b30";
  [-18, 17].forEach(function(x) {
    ctx.beginPath();
    ctx.arc(x, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#a5a99d";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  ctx.fillStyle = "#d2ad71";
  ctx.fillRect(-24, -18, 47, 13);
  ctx.fillStyle = "#758993";
  ctx.fillRect(-10, -28, 17, 11);
  ctx.strokeStyle = "#c5d6d3";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-2, -28);
  ctx.lineTo(4, -39);
  ctx.lineTo(11, -42);
  ctx.stroke();
  ctx.fillStyle = "#efc85e";
  ctx.beginPath();
  ctx.arc(11, -42, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(-103, -3 + Math.sin(time * 2) * 1.5);
  ctx.fillStyle = "#d9e3df";
  ctx.fillRect(-6, -23, 12, 17);
  ctx.fillStyle = "#9baeb1";
  ctx.fillRect(-11, -22, 5, 14);
  ctx.beginPath();
  ctx.arc(0, -30, 7, 0, Math.PI * 2);
  ctx.fillStyle = "#e4e6d9";
  ctx.fill();
  ctx.fillStyle = "#63c4d2";
  ctx.beginPath();
  ctx.arc(2, -30, 4, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.strokeStyle = "#e4e6d9";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-4, -7);
  ctx.lineTo(-7, 0);
  ctx.moveTo(4, -7);
  ctx.lineTo(7, 0);
  ctx.moveTo(-6, -18);
  ctx.lineTo(-11, -10);
  ctx.moveTo(6, -18);
  ctx.lineTo(11, -12);
  ctx.stroke();
  ctx.restore();

  const beaconColor = weakVitals || greenhouseAlert || radiation || storm ? "#ff4f4f" : "#71ef9b";
  ctx.fillStyle = beaconColor;
  ctx.shadowColor = beaconColor;
  ctx.shadowBlur = weakVitals || greenhouseAlert || radiation ? (Math.sin(time * 7) > 0 ? 14 : 4) : 5;
  ctx.beginPath();
  ctx.arc(0, -148, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(132, -107, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (radiation) {
    ctx.lineWidth = 2;
    for (let wave = 0; wave < 4; wave++) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const y = height * (0.25 + wave * 0.075) + Math.sin(x * 0.022 - time * 3 + wave) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(255, 102, 91, " + (0.16 + wave * 0.04) + ")";
      ctx.stroke();
    }
  }

  if (storm) {
    const dustWash = ctx.createLinearGradient(0, 0, width, height);
    dustWash.addColorStop(0, "rgba(255, 171, 101, 0.20)");
    dustWash.addColorStop(0.55, "rgba(201, 111, 69, 0.33)");
    dustWash.addColorStop(1, "rgba(255, 199, 128, 0.18)");
    ctx.fillStyle = dustWash;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 150; i++) {
      const drift = time * (50 + (i % 5) * 22);
      const x = ((i * 89 + drift) % (width + 90)) - 45;
      const y = height * (0.19 + ((i * 37) % 68) / 100) + Math.sin(time * 1.6 + i * 0.7) * 9;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 16 - (i % 9) * 4, y + Math.sin(time + i) * 4);
      ctx.strokeStyle = "rgba(255, 199, 143, " + (0.26 + (i % 4) * 0.11) + ")";
      ctx.lineWidth = 1 + (i % 3);
      ctx.stroke();
    }
  }

  if (gameState.activeHazard || weakVitals) {
    const alertText = gameState.activeHazard === "dust" ? "DUST STORM" : gameState.activeHazard === "radiation" ? "RADIATION" : gameState.activeHazard === "greenhouse" ? "GREENHOUSE" : "VITALS LOW";
    const alertColor = gameState.activeHazard === "greenhouse" ? "#ffd267" : "#ff534d";
    const pulse = 0.72 + (Math.sin(time * 7) + 1) * 0.14;
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.shadowColor = alertColor;
    ctx.shadowBlur = 18;
    ctx.fillStyle = "rgba(29, 22, 24, 0.92)";
    ctx.fillRect(width - 152, 12, 140, 32);
    ctx.strokeStyle = alertColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width - 152, 12, 140, 32);
    ctx.fillStyle = alertColor;
    ctx.font = "700 18px sans-serif";
    ctx.fillText("!", width - 140, 34);
    ctx.font = "700 10px monospace";
    ctx.fillText(alertText, width - 121, 32);
    ctx.restore();
  }

  ctx.fillStyle = "rgba(14, 19, 27, 0.72)";
  ctx.fillRect(12, 12, 150, 25);
  ctx.fillStyle = "#ecf2e7";
  ctx.font = "700 10px monospace";
  ctx.fillText("SOL " + String(gameState.currentSol).padStart(2, "0") + "  /  HAB-01", 21, 29);

  if (commandDeck) {
    const frame = ctx.createLinearGradient(0, 0, 0, height);
    frame.addColorStop(0, "#43505a");
    frame.addColorStop(0.18, "#1c2730");
    frame.addColorStop(0.82, "#111820");
    frame.addColorStop(1, "#58616a");
    ctx.fillStyle = frame;
    ctx.fillRect(0, 0, 34, height);
    ctx.fillRect(width - 34, 0, 34, height);
    ctx.fillStyle = "rgba(11, 17, 23, 0.96)";
    ctx.fillRect(0, 0, width, 18);
    ctx.fillRect(0, height * 0.76, width, height * 0.24);

    ctx.fillStyle = "#172b32";
    ctx.fillRect(48, height * 0.79, 118, height * 0.13);
    ctx.fillRect(width - 166, height * 0.79, 118, height * 0.13);
    ctx.fillStyle = "#68dce7";
    ctx.font = "700 9px monospace";
    ctx.fillText("O2 FLOW", 60, height * 0.82);
    ctx.fillText("SHIELD", width - 153, height * 0.82);
    ctx.fillStyle = "#c98f59";
    ctx.font = "700 14px monospace";
    ctx.fillText(String(gameState.powerO2) + " kW", 60, height * 0.88);
    ctx.fillText(String(gameState.powerShield) + " kW", width - 153, height * 0.88);
    ctx.fillStyle = "rgba(83, 218, 228, 0.2)";
    ctx.fillRect(184, height * 0.84, Math.max(40, width - 368), 5);
    ctx.fillStyle = "#63dce7";
    ctx.fillRect(184, height * 0.84, Math.max(8, (width - 368) * gameState.powerFood / 100), 5);
    ctx.fillStyle = "#e8c474";
    ctx.font = "700 9px monospace";
    ctx.fillText("GREENHOUSE " + gameState.powerFood + " kW", 184, height * 0.82);

    ctx.strokeStyle = "rgba(226, 190, 124, 0.72)";
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 18, width - 68, height * 0.76 - 18);
    ctx.fillStyle = "#ecf2e7";
    ctx.font = "700 10px monospace";
    ctx.fillText("COMMAND DECK · LIVE EXTERIOR FEED", 50, height * 0.74);
  }

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(drawHabitatView);
  }
}

function drawVitalHistory() {
  const canvas = document.getElementById("vitalHistoryChart");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(rect.width * pixelRatio);
  const pixelHeight = Math.round(rect.height * pixelRatio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const width = rect.width;
  const height = rect.height;
  const left = 36;
  const right = 12;
  const top = 14;
  const bottom = 28;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  ctx.clearRect(0, 0, width, height);
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let value = 0; value <= 100; value += 25) {
    const y = top + plotHeight * (1 - value / 100);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - right, y);
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(value + "%", left - 7, y);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let sol = 1; sol <= gameState.maxSols; sol += 2) {
    const x = left + plotWidth * ((sol - 1) / (gameState.maxSols - 1));
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(String(sol), x, height - bottom + 7);
  }

  const series = [
    { key: "oxygen", color: "#50d7f4" },
    { key: "food", color: "#8bd17c" },
    { key: "shielding", color: "#f0bf5a" },
    { key: "morale", color: "#d78ee8" }
  ];
  series.forEach(function(line) {
    ctx.beginPath();
    gameState.history.forEach(function(entry, index) {
      const x = left + plotWidth * ((entry.sol - 1) / (gameState.maxSols - 1));
      const y = top + plotHeight * (1 - entry[line.key] / 100);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    gameState.history.forEach(function(entry) {
      const x = left + plotWidth * ((entry.sol - 1) / (gameState.maxSols - 1));
      const y = top + plotHeight * (1 - entry[line.key] / 100);
      ctx.fillStyle = line.color;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

// === 2. NASA DONKI SPACE WEATHER ===
async function fetchLiveMarsSpaceWeather() {
  const badge = document.getElementById("apiStatusBadge");
  nasaStatusKey = "apiConnecting";
  nasaStatusVariables = {};
  if (badge) {
    badge.textContent = translatedText(nasaStatusKey);
    badge.classList.remove("live", "error", "rate-limited");
    badge.classList.add("loading");
  }

  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const params = new URLSearchParams({ startDate: startDate, endDate: endDate });
  const url = "/nasa-donki?" + params.toString();

  const controller = new AbortController();
  const timeoutId = setTimeout(function() {
    controller.abort();
  }, 12000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      const errorBody = await res.json().catch(function() { return {}; });
      const requestError = new Error(errorBody.error || "NASA DONKI request failed.");
      requestError.status = res.status;
      throw requestError;
    }
    const data = await res.json();

    const marsImpacts = [];
    (Array.isArray(data) ? data : []).forEach(function(cme) {
      if (cme.cmeAnalyses) {
        cme.cmeAnalyses.forEach(function(analysis) {
          if (analysis.enlilList) {
            analysis.enlilList.forEach(function(sim) {
              if (sim.impactList) {
                sim.impactList.forEach(function(impact) {
                  if (impact.location === "Mars") {
                    marsImpacts.push({
                      id: cme.activityID,
                      speed: analysis.speed || 726,
                      arrival: impact.arrivalTime ? impact.arrivalTime.split("T")[0] : "Unknown",
                      region: cme.activeRegionNum ? "AR " + cme.activeRegionNum : "Solar Limb"
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

    if (marsImpacts.length > 0) {
      gameState.liveMarsCME = marsImpacts[marsImpacts.length - 1];
      nasaStatusKey = "apiLive";
      nasaStatusVariables = {
        count: marsImpacts.length,
        id: gameState.liveMarsCME.id,
        speed: gameState.liveMarsCME.speed
      };
    } else {
      gameState.liveMarsCME = null;
      nasaStatusKey = "apiNoImpacts";
      nasaStatusVariables = {};
    }
    badge.textContent = translatedText(nasaStatusKey, nasaStatusVariables);
    badge.classList.remove("loading", "error", "rate-limited");
    badge.classList.add("live");
  } catch (err) {
    const rateLimited = err.status === 429 || /rate limit/i.test(err.message);
    nasaStatusKey = rateLimited ? "apiRateLimited" : "apiUnavailable";
    nasaStatusVariables = {};
    badge.textContent = translatedText(nasaStatusKey);
    badge.classList.remove("loading", "live", "error", "rate-limited");
    badge.classList.add(rateLimited ? "rate-limited" : "error");
  } finally {
    clearTimeout(timeoutId);
    if (badge) {
      setTimeout(function() {
        badge.style.transition = "opacity 0.6s ease";
        badge.style.opacity = "0";
        setTimeout(function() {
          badge.style.display = "none";
        }, 600);
      }, 3500);
    }
  }

}

async function getAdvisorHint() {
  playUISound("hint");
  const output = document.getElementById("advisorText");
  const button = document.getElementById("advisorHintBtn");
  const delayLabel = document.getElementById("signalDelayLabel");
  const delayBar = document.getElementById("signalDelayBar");

  button.disabled = true;
  button.textContent = "Sending...";
  output.textContent = "Radioing Earth for a mission check...";

  try {
    for (let minute = 14; minute >= 0; minute--) {
      delayLabel.textContent = minute === 14
        ? translatedText("delayStart")
        : translatedText("delayTransit", { minutes: minute });
      delayBar.style.width = ((14 - minute) / 14 * 100) + "%";
      await new Promise(function(resolve) { setTimeout(resolve, 140); });
    }
    let hint = getLocalMissionHint();
    if (GEMINI_API_KEY.trim()) {
      hint = await requestGeminiHint(GEMINI_API_KEY.trim()) || hint;
    }
    appendGlossaryTerms(output, hint);
    delayLabel.textContent = translatedText("delayReceived");
  } catch (err) {
    appendGlossaryTerms(output, getLocalMissionHint());
    delayLabel.textContent = translatedText("delayLocal");
  } finally {
    button.disabled = false;
    button.textContent = translatedText("hintButton");
  }
}

function getLocalMissionHint() {
  const weakest = [
    { name: "oxygen", value: gameState.oxygen, slider: "sliderO2", power: gameState.powerO2 },
    { name: "food", value: gameState.food, slider: "sliderFood", power: gameState.powerFood },
    { name: "shielding", value: gameState.shielding, slider: "sliderShield", power: gameState.powerShield },
    { name: "crew morale", value: gameState.morale, slider: "sliderScience", power: gameState.powerScience }
  ].sort(function(a, b) { return a.value - b.value; })[0];
  const junior = gameState.difficulty === "junior";
  if (gameState.activeHazard === "dust") {
    return junior
      ? translatedText("hintDustJunior")
      : translatedText("hintDustCommander");
  }
  if (gameState.activeHazard === "radiation") {
    return junior
      ? translatedText("hintRadiationJunior")
      : translatedText("hintRadiationCommander");
  }
  if (gameState.activeHazard === "greenhouse") {
    return junior
      ? translatedText("hintGreenhouseJunior")
      : translatedText("hintGreenhouseCommander");
  }
  if (weakest.value < 45) {
    return junior
      ? translatedText("hintWeakJunior", { system: weakest.name, value: weakest.value })
      : translatedText("hintWeakCommander", { system: weakest.name, value: weakest.value });
  }
  return junior
    ? translatedText("hintGoodJunior")
    : translatedText("hintGoodCommander");
}

async function requestGeminiHint(apiKey) {
  const missionStatus = {
    sol: gameState.currentSol,
    difficulty: gameState.difficulty,
    oxygen: gameState.oxygen,
    food: gameState.food,
    shielding: gameState.shielding,
    morale: gameState.morale,
    power: [gameState.powerO2, gameState.powerFood, gameState.powerShield, gameState.powerScience]
  };
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent?key=" + encodeURIComponent(apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Give one kid-friendly Mars habitat hint in under 50 words based only on this state: " + JSON.stringify(missionStatus) }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 150 }
    })
  });
  if (!response.ok) return "";
  const result = await response.json();
  return result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts
    ? result.candidates[0].content.parts.map(function(part) { return part.text || ""; }).join(" ").trim()
    : "";
}

// 2. Landing Site Selection
function selectSite(site) {
  playUISound("select");
  gameState.landingSite = site;
  document.querySelectorAll(".site-card").forEach(function(card) {
    card.classList.toggle("selected", card.dataset.site === site);
  });
}

function selectDifficulty(difficulty) {
  playUISound("select");
  gameState.difficulty = difficulty === "commander" ? "commander" : "junior";
  document.querySelectorAll(".difficulty-option").forEach(function(option) {
    const input = option.querySelector("input");
    option.classList.toggle("selected", input && input.value === gameState.difficulty);
  });
}

function updatePovLabels() {
  const commandMode = gameState.viewMode === "command";
  const titleKey = commandMode ? "povInteriorTitle" : "povExteriorTitle";
  const buttonKey = commandMode ? "povInteriorButton" : "povExteriorButton";
  const title = document.getElementById("habitatViewportTitle");
  const button = document.getElementById("povToggle");
  title.dataset.i18n = titleKey;
  button.dataset.i18n = buttonKey;
  setLocalizedText(title, titleKey);
  setLocalizedText(button, buttonKey);
}

function togglePov() {
  playUISound("select");
  gameState.viewMode = gameState.viewMode === "command" ? "exterior" : "command";
  updatePovLabels();
  drawHabitatView(0);
}

// 3. Launch Mission
function startMission() {
  playUISound("launch");
  const inputEl = document.getElementById("commanderInput");
  const difficultyInput = document.querySelector("input[name='difficulty']:checked");
  if (difficultyInput) gameState.difficulty = difficultyInput.value === "commander" ? "commander" : "junior";
  gameState.commanderName = (inputEl && inputEl.value.trim()) ? inputEl.value.trim() : "Jay";
  gameState.currentSol = 1;
  gameState.scienceScore = 0;
  gameState.maxPower = 100;
  gameState.radiationRate = 0.64;
  gameState.oxygen = MISSION_TUNING.startingOxygen;
  gameState.food = MISSION_TUNING.startingFood;
  gameState.shielding = MISSION_TUNING.startingShielding;
  gameState.morale = MISSION_TUNING.startingMorale;
  gameState.history = [];
  gameState.activeHazard = null;
  gameState.viewMode = "exterior";
  gameState.hazardTurnsLeft = 0;
  gameState.restorePowerAtSol = null;
  activeEventData = null;
  document.getElementById("eventModal").classList.add("hidden");
  gameState.missionLog = [
    "Sol 1: " + (gameState.landingSite === "jezero" ? "Ares Horizon Station opened near Jezero Crater (Mars Trek Elev: -2,570 m)." : "Olympus Deep Outpost opened in Hellas Planitia (Mars Trek Elev: -7,152 m).")
  ];
  recordHistory();

  document.getElementById("sliderO2").value = 25;
  document.getElementById("sliderFood").value = 25;
  document.getElementById("sliderShield").value = 25;
  document.getElementById("sliderScience").value = 25;

  switchScreen("dashboardScreen");
  updatePovLabels();
  updateSliders();
  renderHUD();
  drawHabitatView(0);
}

// 4. Live Power Grid & Prediction Math
function adjustPower(sliderId, amount) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  const sliderIds = ["sliderO2", "sliderFood", "sliderShield", "sliderScience"];
  const otherPower = sliderIds.reduce(function(total, id) {
    return total + (id === sliderId ? 0 : Number(document.getElementById(id).value));
  }, 0);
  const minimum = Number(slider.min);
  const maximum = Number(slider.max);
  let next = Number(slider.value) + amount;
  if (amount > 0) next = Math.min(next, Math.max(minimum, Math.min(maximum, gameState.maxPower - otherPower)));
  slider.value = String(Math.max(minimum, Math.min(maximum, next)));
  playUISound("select");
  updateSliders();
}

function updateSliders() {
  const o2 = parseInt(document.getElementById("sliderO2").value, 10);
  const food = parseInt(document.getElementById("sliderFood").value, 10);
  const shield = parseInt(document.getElementById("sliderShield").value, 10);
  const sci = parseInt(document.getElementById("sliderScience").value, 10);

  gameState.powerO2 = o2;
  gameState.powerFood = food;
  gameState.powerShield = shield;
  gameState.powerScience = sci;

  document.getElementById("lblPowerO2").textContent = o2 + " kW";
  document.getElementById("lblPowerFood").textContent = food + " kW";
  document.getElementById("lblPowerShield").textContent = shield + " kW";
  document.getElementById("lblPowerScience").textContent = sci + " kW";

  const used = o2 + food + shield + sci;
  const remaining = gameState.maxPower - used;

  const badge = document.getElementById("remainingPowerBadge");
  const btn = document.getElementById("advanceBtn");

  if (remaining < 0) {
    badge.textContent = translatedText("overloaded", { power: Math.abs(remaining) });
    badge.classList.add("over");
    btn.disabled = true;
  } else {
    badge.textContent = translatedText("remainingPower", { power: remaining });
    badge.classList.remove("over");
    btn.disabled = false;
  }

  const deltas = calculateDeltas();
  formatPred("predOxygen", deltas.dO2);
  formatPred("predFood", deltas.dFood);
  formatPred("predShield", deltas.dShield);
  formatPred("predMorale", deltas.dMorale);
}

// === 3. RESOURCE LOOP & TRADE-OFF PHYSICS ===
// Life support runs every Sol; powered converters offset, but cannot erase, habitat demand.
function calculateDeltas() {
  const o2Mult = gameState.landingSite === "hellas" ? 1.2 : 1.0;
  const junior = gameState.difficulty === "junior";
  const dO2 = Math.round((gameState.powerO2 / 10) * MISSION_TUNING.productionPer10kW.oxygen * o2Mult - MISSION_TUNING.dailyDrain[junior ? "oxygenJunior" : "oxygenCommander"]);
  const dFood = Math.round((gameState.powerFood / 10) * MISSION_TUNING.productionPer10kW.food - MISSION_TUNING.dailyDrain[junior ? "foodJunior" : "foodCommander"]);
  const dShield = Math.round((gameState.powerShield / 10) * MISSION_TUNING.productionPer10kW.shielding - MISSION_TUNING.dailyDrain[junior ? "shieldingJunior" : "shieldingCommander"]);

  let dMorale = Math.round((gameState.powerScience / 10) * MISSION_TUNING.productionPer10kW.morale - MISSION_TUNING.dailyDrain[junior ? "moraleJunior" : "moraleCommander"]);
  if (gameState.oxygen < 35 || gameState.food < 35 || gameState.shielding < 35) {
    dMorale -= 8;
  }
  return { dO2: dO2, dFood: dFood, dShield: dShield, dMorale: dMorale };
}

function formatPred(elId, val) {
  const el = document.getElementById(elId);
  el.textContent = val >= 0 ? "(+" + val + "%)" : "(" + val + "%)";
  el.className = "pred " + (val >= 0 ? "pos" : "neg");
}

// 5. Advance Sol Turn Loop
function advanceSol() {
  playUISound("advance");
  if (gameState.hazardTurnsLeft > 0) {
    gameState.hazardTurnsLeft--;
    if (gameState.hazardTurnsLeft === 0) {
      gameState.activeHazard = null;
      gameState.radiationRate = 0.64;
    }
  }

  const deltas = calculateDeltas();
  const sciMult = gameState.landingSite === "jezero" ? MISSION_TUNING.scienceMultiplier.jezero : MISSION_TUNING.scienceMultiplier.hellas;

  gameState.oxygen = clamp(gameState.oxygen + deltas.dO2);
  gameState.food = clamp(gameState.food + deltas.dFood);
  gameState.shielding = clamp(gameState.shielding + deltas.dShield);
  gameState.morale = clamp(gameState.morale + deltas.dMorale);
  gameState.scienceScore += Math.round((gameState.powerScience / 10) * 15 * sciMult);

  if (gameState.oxygen <= 0 || gameState.food <= 0 || gameState.shielding <= 0 || gameState.morale <= 0) {
    let cause = "a critical subsystem dropped to 0%";
    if (gameState.oxygen <= 0) cause = "MOXIE Oxygen reserves depleted (insufficient Life Support power)";
    else if (gameState.food <= 0) cause = "Hydroponic crops failed (insufficient Greenhouse power)";
    else if (gameState.shielding <= 0) cause = "Habitat Radiation & Thermal Shielding failed during -80°C Martian nights";
    else if (gameState.morale <= 0) cause = "Crew Morale collapsed under prolonged emergency conditions";

    gameState.missionLog.push("Sol " + gameState.currentSol + ": MISSION FAILED because " + cause + ".");
    recordHistory();
    endMission(false);
    return;
  }
  if (Math.min(gameState.oxygen, gameState.food, gameState.shielding, gameState.morale) < 30) {
    playUISound("alarm");
  }

  if (gameState.currentSol >= gameState.maxSols) {
    recordHistory();
    gameState.missionLog.push("Sol 15: Supply ship arrived! Habitat survived with " + gameState.scienceScore + " Science Points.");
    endMission(true);
    return;
  }

  gameState.currentSol++;
  if (gameState.restorePowerAtSol && gameState.currentSol >= gameState.restorePowerAtSol) {
    gameState.maxPower = 100;
    gameState.restorePowerAtSol = null;
    gameState.missionLog.push("Sol " + gameState.currentSol + ": Dust front cleared; solar output restored to 100 kW.");
  }

  recordHistory();
  renderHUD();
  updateSliders();
  checkScheduledEvent(gameState.currentSol);
}

function checkScheduledEvent(sol) {
  const hazardType = { 3: "dust", 5: "radiation", 7: "greenhouse", 9: "dust", 11: "radiation", 13: "greenhouse", 15: "dust" }[sol];
  if (!hazardType) return;

  const siteName = gameState.landingSite === "jezero" ? "Jezero Crater" : "Hellas Planitia";
  const cme = gameState.liveMarsCME;
  let eventData;
  if (hazardType === "dust") {
    const powerCap = gameState.landingSite === "hellas" ? MISSION_TUNING.dustStorm.hellasPowerCap : MISSION_TUNING.dustStorm.jezeroPowerCap;
    const templates = TRANSLATIONS[currentLanguage].events.dust;
    eventData = {
      type: "dust",
      badge: renderTemplate(templates.badge, { sol: sol, site: siteName, powerCap: powerCap }),
      title: renderTemplate(templates.title, { sol: sol, site: siteName }),
      desc: renderTemplate(templates.description, { sol: sol, site: siteName, powerCap: powerCap }),
      fact: renderTemplate(templates.fact, { sol: sol, site: siteName }),
      choiceA: {
        text: renderTemplate(templates.choiceA, { sol: sol, site: siteName, powerCap: powerCap }),
        log: "Stowed the arrays during the dust front; available power temporarily fell to " + powerCap + " kW.",
        apply: function() {
          gameState.maxPower = powerCap;
          gameState.restorePowerAtSol = gameState.currentSol + MISSION_TUNING.dustStorm.recoverySols;
          gameState.morale = clamp(gameState.morale - MISSION_TUNING.dustStorm.stowedMoraleLoss);
        }
      },
      choiceB: {
        text: renderTemplate(templates.choiceB, { sol: sol, site: siteName, powerCap: powerCap }),
        log: "Kept the arrays deployed through the dust front, damaging shielding and morale.",
        apply: function() {
          gameState.shielding = clamp(gameState.shielding - MISSION_TUNING.dustStorm.exposedShieldLoss);
          gameState.morale = clamp(gameState.morale - MISSION_TUNING.dustStorm.exposedMoraleLoss);
        }
      }
    };
  } else if (hazardType === "radiation") {
    const templates = TRANSLATIONS[currentLanguage].events.radiation;
    eventData = {
      type: "radiation",
      badge: cme ? renderTemplate(templates.badge, { sol: sol, cmeId: cme.id, speed: cme.speed }) : renderTemplate(templates.fallbackBadge, { sol: sol }),
      title: cme ? renderTemplate(templates.title, { sol: sol, cmeId: cme.id, speed: cme.speed }) : renderTemplate(templates.fallbackTitle, { sol: sol }),
      desc: cme ? renderTemplate(templates.description, { sol: sol, cmeId: cme.id, speed: cme.speed, site: siteName }) : renderTemplate(templates.fallbackDescription, { sol: sol, site: siteName }),
      fact: renderTemplate(templates.fact, { sol: sol, site: siteName }),
      choiceA: {
        text: renderTemplate(templates.choiceA, { sol: sol, site: siteName }),
        log: "Moved the crew behind water-wall shielding during the solar particle event.",
        apply: function() {
          gameState.shielding = clamp(gameState.shielding + MISSION_TUNING.radiationStorm.shieldGain);
          gameState.morale = clamp(gameState.morale + MISSION_TUNING.radiationStorm.moraleGain);
          gameState.scienceScore = Math.max(0, gameState.scienceScore - MISSION_TUNING.radiationStorm.shelterScienceLoss);
        }
      },
      choiceB: {
        text: renderTemplate(templates.choiceB, { sol: sol, site: siteName }),
        log: "Continued EVA science during the radiation event, increasing exposure risk.",
        apply: function() {
          gameState.scienceScore += MISSION_TUNING.radiationStorm.evaScienceGain;
          gameState.shielding = clamp(gameState.shielding - MISSION_TUNING.radiationStorm.evaShieldLoss);
          gameState.morale = clamp(gameState.morale - MISSION_TUNING.radiationStorm.evaMoraleLoss);
        }
      }
    };
  } else {
    const templates = TRANSLATIONS[currentLanguage].events.greenhouse;
    eventData = {
      type: "greenhouse",
      badge: renderTemplate(templates.badge, { sol: sol }),
      title: renderTemplate(templates.title, { sol: sol }),
      desc: renderTemplate(templates.description, { sol: sol, site: siteName }),
      fact: renderTemplate(templates.fact, { sol: sol, site: siteName }),
      choiceA: {
        text: renderTemplate(templates.choiceA, { sol: sol, site: siteName }),
        log: "Quarantined a contaminated grow bed, preserving the rest of the greenhouse loop.",
        apply: function() {
          gameState.food = clamp(gameState.food - MISSION_TUNING.greenhouseHazard.quarantineFoodLoss);
          gameState.shielding = clamp(gameState.shielding + MISSION_TUNING.greenhouseHazard.quarantineShieldGain);
        }
      },
      choiceB: {
        text: renderTemplate(templates.choiceB, { sol: sol, site: siteName }),
        log: "Rerouted reserve power to stabilize the greenhouse and its crop lights.",
        apply: function() {
          gameState.food = clamp(gameState.food + MISSION_TUNING.greenhouseHazard.rerouteFoodGain);
          gameState.scienceScore = Math.max(0, gameState.scienceScore - MISSION_TUNING.greenhouseHazard.rerouteScienceLoss);
        }
      }
    };
  }

  showEventModal(eventData);
}

function showEventModal(eventData) {
  const modal = document.getElementById("eventModal");
  if (!modal) return;

  const titleEl = document.getElementById("eventTitle");
  const badgeEl = document.getElementById("eventBadge");
  const descEl = document.getElementById("eventDesc");
  const factEl = document.getElementById("eventFact");
  const choiceAEl = document.getElementById("choiceABtn");
  const choiceBEl = document.getElementById("choiceBBtn");

  if (!titleEl || !badgeEl || !descEl || !factEl || !choiceAEl || !choiceBEl) return;

  activeEventData = eventData;
  gameState.activeHazard = eventData.type;
  gameState.hazardTurnsLeft = 1;
  if (eventData.type === "radiation") gameState.radiationRate = 4.2;
  appendGlossaryTerms(titleEl, eventData.title);
  appendGlossaryTerms(badgeEl, eventData.badge);
  appendGlossaryTerms(descEl, eventData.desc);
  appendGlossaryTerms(factEl, eventData.fact);
  appendGlossaryTerms(choiceAEl, eventData.choiceA.text);
  appendGlossaryTerms(choiceBEl, eventData.choiceB.text);
  modal.querySelector(".modal-box").classList.remove("alert-dust", "alert-radiation", "alert-greenhouse");
  modal.querySelector(".modal-box").classList.add("alert-" + eventData.type);
  modal.classList.remove("hidden");
  playUISound("alarm");
  renderHUD();
}

function resolveEvent(choice) {
  if (!activeEventData) return;
  playUISound("decision");
  const decision = choice === "A" ? activeEventData.choiceA : activeEventData.choiceB;
  if (decision && typeof decision.apply === "function") {
    decision.apply();
    gameState.missionLog.push("Sol " + gameState.currentSol + ": " + decision.log);
  }
  activeEventData = null;
  const modal = document.getElementById("eventModal");
  modal.classList.add("hidden");
  modal.querySelector(".modal-box").classList.remove("alert-dust", "alert-radiation", "alert-greenhouse");
  recordHistory();
  renderHUD();
  updateSliders();
}

function escapeCertificateText(value) {
  return String(value).replace(/[&<>"']/g, function(character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" }[character];
  });
}

function downloadMissionCertificate() {
  const statusTag = document.getElementById("debriefStatusTag");
  const status = document.getElementById("certificateStatus");
  if (!statusTag || statusTag.classList.contains("failed") || gameState.currentSol < gameState.maxSols) {
    return;
  }

  const rank = translatedText(gameState.difficulty === "junior" ? "juniorMode" : "commanderMode");
  const site = translatedText(gameState.landingSite === "jezero" ? "jezeroName" : "hellasName");
  const date = new Intl.DateTimeFormat(currentLanguage === "es" ? "es-ES" : "en-US", { dateStyle: "long" }).format(new Date());
  const lines = [
    translatedText("certificateAwarded"),
    translatedText("certificatePresentedTo"),
    gameState.commanderName,
    translatedText("certificateRank", { rank: rank }),
    translatedText("certificateSite", { site: site }),
    translatedText("certificateSols", { sols: gameState.currentSol }),
    translatedText("certificateScience", { score: gameState.scienceScore }),
    translatedText("certificateDate", { date: date })
  ].map(escapeCertificateText);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840" viewBox="0 0 1200 840">' +
    '<rect width="1200" height="840" fill="#0a0f16"/><rect x="28" y="28" width="1144" height="784" rx="20" fill="#111a23" stroke="#c58b52" stroke-width="4"/>' +
    '<rect x="46" y="46" width="1108" height="748" rx="14" fill="none" stroke="#58c9d8" stroke-width="2"/>' +
    '<circle cx="600" cy="180" r="58" fill="#a64e3c" stroke="#e7c37a" stroke-width="4"/><ellipse cx="600" cy="196" rx="77" ry="17" fill="none" stroke="#58c9d8" stroke-width="4"/>' +
    '<g fill="#f2eee4" text-anchor="middle" font-family="Georgia,serif">' +
    '<text x="600" y="300" font-size="25" fill="#e7c37a" letter-spacing="3">' + lines[0] + '</text>' +
    '<text x="600" y="375" font-size="22" fill="#cbd7dc">' + lines[1] + '</text>' +
    '<text x="600" y="445" font-size="50" fill="#ffffff">' + lines[2] + '</text>' +
    '<text x="600" y="515" font-size="24">' + lines[3] + '</text>' +
    '<text x="600" y="558" font-size="24">' + lines[4] + '</text>' +
    '<text x="600" y="601" font-size="24">' + lines[5] + '</text>' +
    '<text x="600" y="644" font-size="24">' + lines[6] + '</text>' +
    '<text x="600" y="730" font-size="16" fill="#91a3ad" letter-spacing="2">' + lines[7] + '</text>' +
    '</g></svg>';
  const file = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  const safeName = gameState.commanderName.trim().replace(/[^a-z0-9_-]+/gi, "-") || "cadet";
  anchor.href = url;
  anchor.download = "mars-astronaut-certificate-" + safeName + ".svg";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  status.textContent = translatedText("certificateDownloaded");
  status.classList.remove("error");
  status.classList.add("success");
}

function endMission(survived) {
  const statusTag = document.getElementById("debriefStatusTag");
  statusTag.textContent = survived ? translatedText("debriefComplete") : translatedText("debriefFailed");
  statusTag.classList.toggle("failed", !survived);
  document.getElementById("debriefTitle").textContent = survived
    ? translatedText(gameState.difficulty === "junior" ? "juniorVictoryTitle" : "commanderVictoryTitle")
    : translatedText("missionLostTitle", { sol: gameState.currentSol });
  document.getElementById("debriefSummary").textContent = survived
    ? translatedText("victorySummary", { science: gameState.scienceScore })
    : translatedText("failureSummary");
  document.getElementById("finalSols").textContent = gameState.currentSol + " / " + gameState.maxSols;
  document.getElementById("finalScience").textContent = gameState.scienceScore + " PTS";
  document.getElementById("finalSite").textContent = gameState.landingSite === "jezero" ? "Jezero Resilience 101" : "Olympus Deep Search Station";
  const certificatePanel = document.getElementById("certificatePanel");
  const certificateStatus = document.getElementById("certificateStatus");
  const certificatePassed = survived && gameState.currentSol >= gameState.maxSols;
  certificatePanel.classList.toggle("hidden", !certificatePassed);
  certificateStatus.textContent = "";
  certificateStatus.classList.remove("success", "error");
  renderStarshipCargo(survived && gameState.currentSol === STARSHIP_CARGO.landing_sol);

  const logList = document.getElementById("debriefLogList");
  logList.replaceChildren();
  gameState.missionLog.forEach(function(entry) {
    const item = document.createElement("li");
    item.textContent = entry;
    logList.appendChild(item);
  });
  switchScreen("debriefScreen");
  requestAnimationFrame(drawVitalHistory);
}

function renderStarshipCargo(showManifest) {
  const panel = document.getElementById("cargoResupply");
  panel.classList.toggle("hidden", !showManifest);
  if (!showManifest) return;

  const listedMass = STARSHIP_CARGO.payloads.reduce(function(total, payload) { return total + payload.mass_kg; }, 0);
  const unitemizedMass = STARSHIP_CARGO.total_payload_mass_kg - listedMass;
  document.getElementById("cargoMission").textContent = STARSHIP_CARGO.mission;
  document.getElementById("cargoLandingSol").textContent = translatedText("cargoLanding", { sol: STARSHIP_CARGO.landing_sol });
  document.getElementById("cargoDeclaredMass").textContent = translatedText("cargoDeclaredMass", {
    mass: STARSHIP_CARGO.total_payload_mass_kg.toLocaleString("en-US")
  });
  document.getElementById("cargoMassNote").textContent = translatedText("cargoMassNote", {
    listedMass: listedMass.toLocaleString("en-US"),
    count: STARSHIP_CARGO.payloads.length,
    unitemizedMass: unitemizedMass.toLocaleString("en-US")
  });
  document.getElementById("cargoNotes").textContent = translatedText("cargoNotes");

  const list = document.getElementById("cargoPayloadList");
  list.replaceChildren();
  STARSHIP_CARGO.payloads.forEach(function(payload) {
    const item = document.createElement("li");
    item.className = "cargo-payload";
    const heading = document.createElement("div");
    heading.className = "cargo-payload-heading";
    const name = document.createElement("strong");
    name.textContent = payload.item;
    const stats = document.createElement("span");
    stats.textContent = translatedText("cargoQuantity", {
      quantity: payload.quantity,
      mass: payload.mass_kg.toLocaleString("en-US")
    });
    const description = document.createElement("p");
    description.textContent = payload.description;
    heading.appendChild(name);
    heading.appendChild(stats);
    item.appendChild(heading);
    item.appendChild(description);
    list.appendChild(item);
  });
}

function resetGame() {
  playUISound("select");
  gameState.commanderName = "Commander";
  gameState.landingSite = "jezero";
  gameState.currentSol = 1;
  gameState.scienceScore = 0;
  gameState.maxPower = 100;
  gameState.radiationRate = 0.64;
  gameState.oxygen = MISSION_TUNING.startingOxygen;
  gameState.food = MISSION_TUNING.startingFood;
  gameState.shielding = MISSION_TUNING.startingShielding;
  gameState.morale = MISSION_TUNING.startingMorale;
  gameState.powerO2 = 25;
  gameState.powerFood = 25;
  gameState.powerShield = 25;
  gameState.powerScience = 25;
  gameState.missionLog = [];
  gameState.history = [];
  gameState.activeHazard = null;
  gameState.viewMode = "exterior";
  gameState.hazardTurnsLeft = 0;
  gameState.restorePowerAtSol = null;
  activeEventData = null;
  document.getElementById("commanderInput").value = "";
  document.querySelector("input[name='difficulty'][value='junior']").checked = true;
  gameState.difficulty = "junior";
  document.querySelectorAll(".difficulty-option").forEach(function(option) {
    option.classList.toggle("selected", option.querySelector("input").value === "junior");
  });
  document.getElementById("eventModal").classList.add("hidden");
  document.querySelectorAll(".site-card").forEach(function(card) {
    card.classList.toggle("selected", card.dataset.site === "jezero");
  });
  document.getElementById("advanceBtn").disabled = false;
  updatePovLabels();
  switchScreen("briefingScreen");
}

fetchLiveMarsSpaceWeather();
if (typeof requestAnimationFrame === "function") requestAnimationFrame(drawHabitatView);
window.addEventListener("resize", drawVitalHistory);

document.addEventListener("click", function(event) {
  const term = event.target.closest(".sci-term");
  if (term) {
    openGlossary(term.dataset.term);
    playUISound("click");
    return;
  }
  if (event.target.closest("button, .site-card, input[type='range'], summary")) {
    playUISound("click");
  }
  if (event.target.id === "glossaryModal") closeGlossary();
});

document.addEventListener("keydown", function(event) {
  if ((event.key === "Enter" || event.key === " ") && event.target.classList.contains("sci-term")) {
    event.preventDefault();
    openGlossary(event.target.dataset.term);
    playUISound("click");
  } else if (event.key === "Escape") {
    closeGlossary();
  }
});

