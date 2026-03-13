import { useState, useEffect, useCallback } from "react";

// ─── FONT ───────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap";
document.head.appendChild(fontLink);

// ─── BACHILLERATO (Ciclos I–VIII) ─────────────────────────────────────────
const MATERIAS_BACH = [
  // Ciclo I
  { id: "CP1501",   ciclo: 1, nombre: "Epistemología y Lógica del Pensamiento", req: [], corto: "Epistemología", creditos: 3 },
  { id: "CP1504",   ciclo: 1, nombre: "El Poder desde la Ciencia Política",    req: [], corto: "El Poder",       creditos: 3 },
  { id: "EF",       ciclo: 1, nombre: "Actividad Deportiva",                   req: [], corto: "Act. Deportiva", creditos: 0 },
  { id: "EGI",      ciclo: 1, nombre: "Curso Integrado de Humanidades I",      req: [], corto: "Humanidades I",  creditos: 6 },
  { id: "OPT1018A", ciclo: 1, nombre: "Optativo de Idioma I",                  req: [], corto: "Idioma I",       creditos: 4 },
  // Ciclo II
  { id: "CP1502",   ciclo: 2, nombre: "Instituciones Públicas y Comunidad Política", req: ["CP1504"], corto: "Instituciones",    creditos: 3 },
  { id: "CP1503",   ciclo: 2, nombre: "Introducción al Diseño de Investigación",     req: ["CP1501"], corto: "Diseño Inv.",      creditos: 3 },
  { id: "EGII",     ciclo: 2, nombre: "Curso Integrado de Humanidades II",           req: ["EGI"],    corto: "Humanidades II",   creditos: 6 },
  { id: "OPT1018B", ciclo: 2, nombre: "Optativo de Idioma II",                       req: [],         corto: "Idioma II",        creditos: 4 },
  // Ciclo III
  { id: "CP2001",   ciclo: 3, nombre: "Estado y Gestión Pública",                          req: ["CP1502"],             corto: "Estado y Gestión",    creditos: 3 },
  { id: "CP2002",   ciclo: 3, nombre: "Aspectos Políticos de la Macroeconomía",            req: ["CP1502"],             corto: "Macroeconomía",        creditos: 3 },
  { id: "CP2003",   ciclo: 3, nombre: "Aspectos Políticos del Derecho Constitucional",     req: ["CP1502","CP1503"],    corto: "Der. Constitucional",  creditos: 3 },
  { id: "CP2004",   ciclo: 3, nombre: "Análisis Político Cuantitativo I",                  req: ["CP1503"],             corto: "Cuantitativo I",       creditos: 3 },
  { id: "CP2005",   ciclo: 3, nombre: "Ideas Políticas y sus Alcances I",                  req: ["CP1502"],             corto: "Ideas Pol. I",         creditos: 3 },
  { id: "SRI",      ciclo: 3, nombre: "Seminario de Realidad Nacional I",                  req: ["EGII"],               corto: "Seminario RN I",       creditos: 2 },
  // Ciclo IV
  { id: "CP2006",   ciclo: 4, nombre: "Representación, Procesos Electorales y PA",  req: ["CP2001","CP2003"],            corto: "Representación",    creditos: 3 },
  { id: "CP2007",   ciclo: 4, nombre: "Análisis Político Cuantitativo II",          req: ["CP2004"],                     corto: "Cuantitativo II",   creditos: 3 },
  { id: "CP2008",   ciclo: 4, nombre: "Ideas Políticas y sus Alcances II",          req: ["CP2005"],                     corto: "Ideas Pol. II",     creditos: 3 },
  { id: "CP2009",   ciclo: 4, nombre: "Teorías y Problemas de la Política Internacional", req: ["CP2002"],              corto: "Pol. Internacional",creditos: 3 },
  { id: "CP2010",   ciclo: 4, nombre: "Políticas Públicas",                         req: ["CP2001","CP2002","CP2003"],    corto: "Pol. Públicas",     creditos: 3 },
  { id: "SRII",     ciclo: 4, nombre: "Seminario de Realidad Nacional II",          req: ["SRI"],                        corto: "Seminario RN II",   creditos: 2 },
  // Ciclo V
  { id: "CP3001",   ciclo: 5, nombre: "Investigación con Enfoque Cualitativo I",    req: ["CP2007"],          corto: "Cualitativo I",    creditos: 3 },
  { id: "CP3002",   ciclo: 5, nombre: "Cultura Política",                           req: ["CP2008"],          corto: "Cultura Pol.",     creditos: 3 },
  { id: "CP3003",   ciclo: 5, nombre: "Economía Política Global y Desarrollo",      req: ["CP2009"],          corto: "Econ. Global",     creditos: 3 },
  { id: "EGA",      ciclo: 5, nombre: "Curso de Arte",                              req: [],                  corto: "Arte",             creditos: 2 },
  { id: "OPT1019A", ciclo: 5, nombre: "Optativo Interdisciplinario I",              req: [],                  corto: "Optativo I",       creditos: 3 },
  { id: "RP1",      ciclo: 5, nombre: "Repertorio",                                 req: [],                  corto: "Repertorio",       creditos: 3 },
  // Ciclo VI
  { id: "CP3004",   ciclo: 6, nombre: "Investigación con Enfoque Cualitativo II",      req: ["CP3001"],             corto: "Cualitativo II",  creditos: 3 },
  { id: "CP3005",   ciclo: 6, nombre: "Ideologías Políticas en América Latina y CR",   req: ["CP3002","CP3003"],    corto: "Ideologías",       creditos: 3 },
  { id: "CP3006",   ciclo: 6, nombre: "Sistemas Políticos y Acciones Colectivas",      req: ["CP2006","CP3002"],    corto: "Sistemas Pol.",    creditos: 3 },
  { id: "CP3007",   ciclo: 6, nombre: "Centroamérica y el Caribe en la Geopolítica",   req: ["CP3003"],             corto: "Geopolítica",      creditos: 3 },
  { id: "CP3008",   ciclo: 6, nombre: "Toma de Decisiones y Asuntos Públicos",         req: ["CP2010","CP3003"],    corto: "Toma Decisiones",  creditos: 3 },
  { id: "OPT1019B", ciclo: 6, nombre: "Optativo Interdisciplinario II",                req: [],                     corto: "Optativo II",      creditos: 3 },
  // Ciclo VII
  { id: "CP4000",   ciclo: 7, nombre: "Método Comparado",                          req: ["CP3004"],          corto: "Mét. Comparado",   creditos: 3 },
  { id: "CP4001",   ciclo: 7, nombre: "Teoría Política Contemporánea I",           req: ["CP3005"],          corto: "Teoría Pol. I",    creditos: 3 },
  { id: "CP4002",   ciclo: 7, nombre: "Política Exterior en las Américas",         req: ["CP3007"],          corto: "Pol. Exterior",    creditos: 3 },
  { id: "CP4003",   ciclo: 7, nombre: "Negociación y Manejo de Conflictos",        req: ["CP3008"],          corto: "Negociación",      creditos: 3 },
  { id: "CP4004",   ciclo: 7, nombre: "Estudios de Opinión y Opinión Pública",     req: ["CP3004"],          corto: "Opinión Púb.",     creditos: 3 },
  { id: "OPT1019C", ciclo: 7, nombre: "Optativo Interdisciplinario III",           req: [],                  corto: "Optativo III",     creditos: 3 },
  // Ciclo VIII
  { id: "CP4005",   ciclo: 8, nombre: "Teoría Política Contemporánea II",               req: ["CP4001"],                                     corto: "Teoría Pol. II",      creditos: 3 },
  { id: "CP4006",   ciclo: 8, nombre: "Comunicación Política",                          req: ["CP4004"],                                     corto: "Comunicación Pol.",    creditos: 3 },
  { id: "CP4007",   ciclo: 8, nombre: "Práctica Profesional",                           req: ["CP4000","CP4001","CP4002","CP4003","CP4004"],  corto: "Práctica Prof.",       creditos: 6 },
  { id: "CP4008",   ciclo: 8, nombre: "Aspectos Políticos del Derecho Administrativo",  req: ["CP3008"],                                     corto: "Der. Administrativo",  creditos: 3 },
  { id: "OPT1019D", ciclo: 8, nombre: "Optativo Interdisciplinario IV",                 req: [],                                             corto: "Optativo IV",          creditos: 3 },
];

// ─── LICENCIATURA (Ciclos IX–X) ───────────────────────────────────────────
const MATERIAS_LIC = [
  // Ciclo IX
  { id: "CP5000", ciclo: 9,  nombre: "Taller de Investigación I",                           req: ["CP4007"], corto: "Taller Inv. I",    creditos: 4 },
  { id: "CP5001", ciclo: 9,  nombre: "Seminario de Autores",                                req: ["CP4007"], corto: "Sem. Autores",      creditos: 4 },
  { id: "CP5002", ciclo: 9,  nombre: "Seminario Poder y Conocimiento en la C. Política",    req: ["CP4007"], corto: "Poder y Conoc.",    creditos: 4 },
  { id: "OPT_LIC_IX", ciclo: 9,  nombre: "Optativo Interdisciplinario (Lic. IX)",          req: [],         corto: "Optativo Lic. I",  creditos: 3 },
  // Ciclo X
  { id: "CP5003", ciclo: 10, nombre: "Taller de Investigación II",                          req: ["CP5000"], corto: "Taller Inv. II",   creditos: 4 },
  { id: "CP5004", ciclo: 10, nombre: "Taller Teorías y Autores en la Investigación",        req: ["CP5001"], corto: "Teorías y Autores", creditos: 4 },
  { id: "CP5005", ciclo: 10, nombre: "Seminario de Asuntos Públicos",                       req: ["CP5002"], corto: "Asuntos Públicos",  creditos: 3 },
  { id: "OPT_LIC_X",  ciclo: 10, nombre: "Optativo Interdisciplinario (Lic. X)",           req: [],         corto: "Optativo Lic. II", creditos: 3 },
];

const TODAS_MATERIAS = [...MATERIAS_BACH, ...MATERIAS_LIC];

const CICLOS_BACH = [1,2,3,4,5,6,7,8];
const CICLOS_LIC  = [9,10];
const CICLO_LABELS = {
  1:"Ciclo I", 2:"Ciclo II", 3:"Ciclo III", 4:"Ciclo IV",
  5:"Ciclo V", 6:"Ciclo VI", 7:"Ciclo VII", 8:"Ciclo VIII",
  9:"Ciclo IX", 10:"Ciclo X"
};
const CICLO_AÑO = {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5};

const DEFAULT_ESTADO = {
  "EF": "aprobada","EGI": "aprobada","EGII": "aprobada",
  "SRI":"aprobada","SRII":"aprobada","EGA":"aprobada",
  "CP1501":"en_proceso","CP1504":"en_proceso",
};

function calcEstados(estadosBase) {
  const e = { ...estadosBase };
  TODAS_MATERIAS.forEach(m => {
    if (!e[m.id] || e[m.id] === "bloqueada" || e[m.id] === "pendiente") {
      const desbloqueada = m.req.every(r => e[r] === "aprobada");
      if (desbloqueada && e[m.id] !== "en_proceso") e[m.id] = "pendiente";
      else if (!desbloqueada && (e[m.id] === "pendiente" || !e[m.id])) e[m.id] = "bloqueada";
    }
  });
  return e;
}

function generarPlan(estados, maxPorSem, nivel, config = { año: 2026, semestre: 'I', cicloActual: 1, encadenar: false }) {
  const fuente = nivel === "bach" ? MATERIAS_BACH : nivel === "lic" ? MATERIAS_LIC : TODAS_MATERIAS;

  // Aprobadas/en_proceso de TODO el plan
  const aprobadasSim = new Set(
    TODAS_MATERIAS.filter(m => estados[m.id] === "aprobada" || estados[m.id] === "en_proceso").map(m => m.id)
  );

  const plan = [];

  // ── Semestre actual ──────────────────────────────────────────────────────
  const enProcesoIds = fuente.filter(m => estados[m.id] === "en_proceso").map(m => m.id);
  if (enProcesoIds.length > 0) {
    plan.push({
      semestre: `Semestre actual (${config.semestre}-${config.año})`,
      materias: enProcesoIds.map(id => TODAS_MATERIAS.find(m => m.id === id)),
      bloqueadas: [],
      actual: true,
    });
  }

  // ── Para licenciatura: simular bach completo primero ─────────────────────
  let semInicioLic = null; // semestre absoluto donde arranca licenciatura
  if (nivel === "lic") {
    if (config.encadenar) {
      // Simular bach para saber cuándo termina y encadenar lic
      const simBach = new Set(aprobadasSim);
      const semInicioBach = config.semestre === "I" ? 0 : 1;
      let semG = config.año * 2 + semInicioBach;
      let pendBach = MATERIAS_BACH.filter(m => !simBach.has(m.id));
      let guard = 0;
      while (pendBach.length > 0 && guard++ < 30) {
        // Periodo de este semestre: 0=I (ciclos impares), 1=II (ciclos pares)
        const semIdx = semG % 2 === 0 ? "I" : "II"; // par=I, impar=II
        // Materias disponibles cuyo ciclo corresponde a este semestre
        const disponibles = pendBach.filter(m =>
          m.req.every(r => simBach.has(r)) &&
          (m.ciclo % 2 === (semIdx === "I" ? 1 : 0))
        );
        const lote = maxPorSem === "bloque" ? disponibles : disponibles.slice(0, maxPorSem);
        lote.forEach(m => simBach.add(m.id));
        pendBach = pendBach.filter(m => !simBach.has(m.id));
        if (pendBach.length === 0) {
          // Bach termina este semestre, lic empieza el siguiente
          semInicioLic = semG + 1;
        }
        semG++;
      }
      // Marcar todas las de bach como aprobadas para la simulación de lic
      MATERIAS_BACH.forEach(m => aprobadasSim.add(m.id));
    } else {
      // Sin encadenar: bach ya completado, lic empieza desde config
      MATERIAS_BACH.forEach(m => aprobadasSim.add(m.id));
    }
  }

  // ── Semestre de inicio para los semestres futuros ────────────────────────
  // semGlobal: número absoluto donde 2026*2+0 = I-2026, 2026*2+1 = II-2026
  const semInicio = config.semestre === "I" ? 0 : 1;
  let semGlobal = config.año * 2 + semInicio;
  if (nivel === "lic" && config.encadenar && semInicioLic !== null) {
    semGlobal = semInicioLic - 1; // el while lo incrementa antes de crear el semestre
  }

  // ── Plan futuro con restricción de oferta anual ──────────────────────────
  // Cada materia solo se puede tomar en el semestre que corresponde a su ciclo:
  //   ciclo impar  → Semestre I  (semGlobal par en nuestro esquema donde par=I)
  //   ciclo par    → Semestre II
  // semGlobal % 2 === 0 → período I; % 2 === 1 → período II
  let restantes = fuente.filter(m => estados[m.id] !== "aprobada" && estados[m.id] !== "en_proceso");
  let guard = 0;

  while (restantes.length > 0 && guard++ < 40) {
    semGlobal++;
    const periodoLabel = semGlobal % 2 === 0 ? "I" : "II";
    const año = Math.floor(semGlobal / 2);

    // Materias disponibles (requisitos ok) Y cuyo ciclo corresponde a este período
    // ciclo impar = Semestre I; ciclo par = Semestre II
    const disponibles = restantes.filter(m =>
      m.req.every(r => aprobadasSim.has(r)) &&
      ((m.ciclo % 2 === 1 && periodoLabel === "I") || (m.ciclo % 2 === 0 && periodoLabel === "II"))
    );

    // Materias que se desbloquean gracias al lote de este semestre
    const lote = maxPorSem === "bloque" ? disponibles : disponibles.slice(0, maxPorSem);

    const proximasADesbloquear = restantes.filter(m =>
      !disponibles.includes(m) &&
      m.req.some(r => lote.find(x => x.id === r))
    );

    if (lote.length > 0) {
      lote.forEach(m => aprobadasSim.add(m.id));
      restantes = restantes.filter(m => !lote.includes(m));

      plan.push({
        semestre: `${periodoLabel}-${año}`,
        materias: lote,
        bloqueadas: proximasADesbloquear,
        actual: false,
      });
    }
    // Si no hay nada que tomar este semestre, simplemente avanzamos al siguiente
  }

  return plan;
}

const ESTADO_STYLES = {
  aprobada:   { bg:"#d1fae5", border:"#059669", text:"#065f46", dot:"#059669", label:"Aprobada" },
  en_proceso: { bg:"#fef3c7", border:"#d97706", text:"#78350f", dot:"#d97706", label:"En Proceso" },
  pendiente:  { bg:"#eff6ff", border:"#3b82f6", text:"#1e3a8a", dot:"#3b82f6", label:"Pendiente" },
  bloqueada:  { bg:"#e2e8f0", border:"#94a3b8", text:"#475569", dot:"#94a3b8", label:"Bloqueada" },
};

const FONT = "'DM Sans', system-ui, sans-serif";
const FONT_MONO = "'DM Mono', monospace";

// ─── Crédito badge ────────────────────────────────────────────────────────
function CreditoBadge({ creditos, dark = false }) {
  if (creditos === 0) return null;
  const horas = creditos * 3;
  return (
    <div style={{ display:"flex", gap:4, marginTop:4, flexWrap:"wrap" }}>
      <span style={{
        fontSize: 8, fontFamily: FONT_MONO, fontWeight: 500,
        padding: "1px 5px", borderRadius: 3,
        background: dark ? "#1e3a5f" : "#dbeafe",
        color: dark ? "#93c5fd" : "#1d4ed8",
        letterSpacing: 0.3,
      }}>{creditos} cr</span>
      <span style={{
        fontSize: 8, fontFamily: FONT_MONO,
        padding: "1px 5px", borderRadius: 3,
        background: dark ? "#1a2a1a" : "#dcfce7",
        color: dark ? "#86efac" : "#166534",
        letterSpacing: 0.3,
      }}>{horas}h/sem</span>
    </div>
  );
}

export default function App() {
  const [tab, setTab]           = useState("mapa_bach");
  const [estadosBase, setEstadosBase] = useState(DEFAULT_ESTADO);
  const [estados, setEstados]   = useState(() => calcEstados(DEFAULT_ESTADO));
  const [maxPorSem, setMaxPorSem] = useState(3);
  const [hoveredId, setHoveredId] = useState(null);
  const [config, setConfig]     = useState({ año: 2026, semestre: "I", cicloActual: 2, encadenar: true });
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem("cp_estados"); if (s) { const b=JSON.parse(s); setEstadosBase(b); setEstados(calcEstados(b)); } } catch {}
    try { const s = localStorage.getItem("cp_max");    if (s) setMaxPorSem(JSON.parse(s)); } catch {}
    try { const s = localStorage.getItem("cp_config"); if (s) setConfig(JSON.parse(s)); } catch {}
  }, []);

  const updateConfig = (newCfg) => {
    setConfig(newCfg);
    try { localStorage.setItem("cp_config", JSON.stringify(newCfg)); } catch {}
  };

  const updateEstado = useCallback((id, nuevoEstado) => {
    setEstadosBase(prev => {
      const next = { ...prev, [id]: nuevoEstado };
      const computed = calcEstados(next);
      setEstados(computed);
      try { localStorage.setItem("cp_estados", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const ciclarEstado = useCallback((id) => {
    const actual = estadosBase[id] || "bloqueada";
    const m = TODAS_MATERIAS.find(x => x.id === id);
    const desbloqueada = m.req.every(r => estados[r] === "aprobada");
    if (actual === "bloqueada" && !desbloqueada) return;
    const ciclo = { bloqueada:"pendiente", pendiente:"en_proceso", en_proceso:"aprobada", aprobada:"pendiente" };
    let next = ciclo[actual];
    if (next === "pendiente" && !desbloqueada) next = "bloqueada";
    updateEstado(id, next);
  }, [estadosBase, estados, updateEstado]);

  const onMaxChange = (val) => {
    setMaxPorSem(val);
    try { localStorage.setItem("cp_max", JSON.stringify(val)); } catch {}
  };

  // Stats globales
  const aprobadas  = TODAS_MATERIAS.filter(m => estados[m.id] === "aprobada").length;
  const enProceso  = TODAS_MATERIAS.filter(m => estados[m.id] === "en_proceso").length;
  const creditosAprobados = TODAS_MATERIAS.filter(m => estados[m.id] === "aprobada" || estados[m.id] === "en_proceso").reduce((a,m) => a + m.creditos, 0);
  const creditosTotal     = TODAS_MATERIAS.reduce((a,m) => a + m.creditos, 0);
  const pct = Math.round((aprobadas / TODAS_MATERIAS.length) * 100);

  // Plan
  const nivelPlan = tab === "plan_lic" ? "lic" : "bach";
  const plan = generarPlan(estados, maxPorSem, nivelPlan, config);
  const semsRestantes  = plan.filter(p => !p.actual).length;
  const añosRestantes  = (semsRestantes / 2).toFixed(1);
  const ultimoSem      = plan.length > 0 ? plan[plan.length-1].semestre : "—";

  // Carga del semestre actual
  const semActual = plan.find(p => p.actual);
  const cargaActual = semActual ? semActual.materias.reduce((a, m) => a + m.creditos * 3, 0) : 0;

  const TABS = [
    { id:"mapa_bach", label:"🗺 Bachillerato",   sub:"Mapa de carrera" },
    { id:"mapa_lic",  label:"🎓 Licenciatura",    sub:"Mapa de carrera" },
    { id:"plan_bach", label:"📅 Plan · Bach.",     sub:"Plan semestral" },
    { id:"plan_lic",  label:"📅 Plan · Lic.",      sub:"Plan semestral" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0c1220", fontFamily:FONT, color:"#e2e8f0" }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#1e3a5f 0%,#0c1220 100%)", borderBottom:"1px solid #1e3a5f", padding:"0 24px" }}>
        <div style={{ maxWidth:1500, margin:"0 auto", paddingTop:20 }}>

          {/* Top row */}
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:14 }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:4, color:"#64748b", textTransform:"uppercase", marginBottom:3, fontWeight:500 }}>Universidad de Costa Rica</div>
              <h1 style={{ margin:0, fontSize:21, fontWeight:600, color:"#e2e8f0", letterSpacing:0.3 }}>
                Ciencias Políticas <span style={{ color:"#3b82f6", fontWeight:400, fontSize:15 }}>· Brújula CP</span>
              </h1>
            </div>
            <div style={{ display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
              {[
                { label:"Aprobadas",      val: aprobadas,         color:"#059669" },
                { label:"En Proceso",     val: enProceso,         color:"#d97706" },
                { label:"Créditos",       val: `${creditosAprobados}/${creditosTotal}`, color:"#a78bfa" },
                { label:"Avance",         val: pct+"%",           color:"#3b82f6" },
                { label:"Graduación est.",val: ultimoSem,         color:"#f472b6" },
              ].map(s => (
                <div key={s.label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:700, color:s.color, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{s.val}</div>
                  <div style={{ fontSize:9,  color:"#64748b", letterSpacing:1, textTransform:"uppercase", marginTop:2, fontWeight:500 }}>{s.label}</div>
                </div>
              ))}
              {cargaActual > 0 && (
                <div style={{ textAlign:"center", background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"6px 12px" }}>
                  <div style={{ fontSize:18, fontWeight:700, color:"#fb923c", lineHeight:1 }}>{cargaActual}h</div>
                  <div style={{ fontSize:9, color:"#64748b", letterSpacing:1, textTransform:"uppercase", marginTop:2, fontWeight:500 }}>Carga actual/sem</div>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height:2, background:"#1e3a5f", borderRadius:2, overflow:"hidden", marginBottom:0 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#1d4ed8,#3b82f6,#a78bfa)", borderRadius:2, transition:"width 0.6s ease" }} />
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:0, marginTop:0 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:"11px 20px", border:"none", background:"transparent", cursor:"pointer",
                color: tab===t.id ? "#3b82f6" : "#64748b",
                borderBottom: tab===t.id ? "2px solid #3b82f6" : "2px solid transparent",
                fontSize:12, fontWeight: tab===t.id ? 600 : 400,
                letterSpacing:0.3, transition:"all 0.2s", fontFamily:FONT,
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:1500, margin:"0 auto", padding:"24px" }}>
        {tab === "mapa_bach" && (
          <MapaView estados={estados} ciclarEstado={ciclarEstado} hoveredId={hoveredId} setHoveredId={setHoveredId}
            materias={MATERIAS_BACH} ciclos={CICLOS_BACH} titulo="Bachillerato · Ciclos I–VIII" nivel="bach" />
        )}
        {tab === "mapa_lic" && (
          <MapaView estados={estados} ciclarEstado={ciclarEstado} hoveredId={hoveredId} setHoveredId={setHoveredId}
            materias={MATERIAS_LIC} ciclos={CICLOS_LIC} titulo="Licenciatura · Ciclos IX–X" nivel="lic" />
        )}
        {(tab === "plan_bach" || tab === "plan_lic") && (
          <PlanView plan={plan} maxPorSem={maxPorSem} onMaxChange={onMaxChange}
            semsRestantes={semsRestantes} añosRestantes={añosRestantes}
            titulo={tab === "plan_lic" ? "Plan Semestral · Licenciatura" : "Plan Semestral · Bachillerato"}
            config={config} updateConfig={updateConfig} showConfig={showConfig} setShowConfig={setShowConfig}
            nivel={nivelPlan} />
        )}
      </div>


    </div>
  );
}

// ─── MapaView ────────────────────────────────────────────────────────────────
function MapaView({ estados, ciclarEstado, hoveredId, setHoveredId, materias, ciclos, titulo, nivel }) {
  const creditosCiclo = (ciclo) => materias.filter(m => m.ciclo === ciclo).reduce((a,m) => a + m.creditos, 0);
  const horasCiclo    = (ciclo) => creditosCiclo(ciclo) * 3;

  // Stats del nivel
  const totalMaterias   = materias.length;
  const aprobadas       = materias.filter(m => estados[m.id] === "aprobada").length;
  const creditosAprobados = materias.filter(m => estados[m.id] === "aprobada" || estados[m.id] === "en_proceso").reduce((a,m) => a + m.creditos, 0);
  const creditosTotales   = materias.reduce((a,m) => a + m.creditos, 0);

  return (
    <div>
      {/* Mini stats del nivel */}
      <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"10px 16px", display:"flex", gap:20 }}>
          <StatMini label="Materias" val={`${aprobadas}/${totalMaterias}`} color="#059669" />
          <StatMini label="Créditos cursados" val={`${creditosAprobados}/${creditosTotales}`} color="#a78bfa" />
          <StatMini label="Horas/sem (cursadas)" val={`${creditosAprobados*3}h`} color="#fb923c" />
          <StatMini label="Nivel" val={nivel === "bach" ? "Bachillerato" : "Licenciatura"} color="#3b82f6" />
        </div>
      </div>

      <div style={{ overflowX:"auto", paddingBottom:16 }}>
        <div style={{ display:"flex", gap:12, minWidth:"max-content" }}>
          {ciclos.map((ciclo) => {
            const mats = materias.filter(m => m.ciclo === ciclo);
            const credCiclo = creditosCiclo(ciclo);
            return (
              <div key={ciclo} style={{ width:168 }}>
                {/* Ciclo header */}
                <div style={{ textAlign:"center", fontSize:10, letterSpacing:1.5, color:"#3b82f6", textTransform:"uppercase", marginBottom:8, padding:"6px 0", borderBottom:"1px solid #1e3a5f" }}>
                  <div style={{ fontWeight:600 }}>{CICLO_LABELS[ciclo]}</div>
                  <div style={{ fontSize:9, color:"#475569", marginTop:2, fontFamily:FONT_MONO }}>
                    Año {CICLO_AÑO[ciclo]} · {credCiclo} cr · {horasCiclo(ciclo)}h/sem
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {mats.map(m => {
                    const est = estados[m.id] || "bloqueada";
                    const s   = ESTADO_STYLES[est];
                    const isHov     = hoveredId === m.id;
                    const isRelated = hoveredId && (
                      m.req.includes(hoveredId) ||
                      TODAS_MATERIAS.find(x => x.id === hoveredId)?.req.includes(m.id)
                    );
                    return (
                      <div key={m.id}
                        onClick={() => ciclarEstado(m.id)}
                        onMouseEnter={() => setHoveredId(m.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          background: s.bg,
                          border: `1.5px solid ${isHov||isRelated ? s.dot : s.border}`,
                          borderRadius: 7,
                          padding: "8px 10px",
                          cursor: est==="bloqueada" ? "default" : "pointer",
                          opacity: est==="bloqueada" ? 0.7 : 1,
                          transform: isHov ? "scale(1.03)" : "scale(1)",
                          transition: "all 0.15s ease",
                          boxShadow: isHov
                            ? `0 0 0 2px ${s.dot}50, 0 4px 14px rgba(0,0,0,0.25)`
                            : isRelated ? `0 0 0 1px ${s.dot}60` : "none",
                        }}>
                        <div style={{ fontSize:8, color:s.text, fontWeight:600, letterSpacing:0.5, marginBottom:1, opacity:0.65, fontFamily:FONT_MONO }}>{m.id}</div>
                        <div style={{ fontSize:11, color:s.text, lineHeight:1.3, fontWeight: est!=="bloqueada" ? 600 : 400 }}>{m.corto}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4 }}>
                          <div style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
                          <span style={{ fontSize:8.5, color:s.text, opacity:0.8 }}>{s.label}</span>
                        </div>
                        <CreditoBadge creditos={m.creditos} />
                        {m.req.length > 0 && (
                          <div style={{ fontSize:7.5, color:s.text, opacity:0.45, marginTop:3, fontFamily:FONT_MONO }}>
                            Req: {m.req.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop:16, padding:"11px 16px", background:"#0c1220", border:"1px solid #1e3a5f", borderRadius:8, fontSize:10.5, color:"#64748b", lineHeight:1.9 }}>
        <span style={{ color:"#3b82f6", fontWeight:600 }}>Cómo usar: </span>
        Click en una materia para cambiar su estado ·{" "}
        <span style={{ color:"#059669" }}>Verde</span> = Aprobada ·{" "}
        <span style={{ color:"#d97706" }}>Amarillo</span> = En Proceso ·{" "}
        <span style={{ color:"#3b82f6" }}>Azul</span> = Pendiente ·{" "}
        <span style={{ color:"#64748b" }}>Gris</span> = Bloqueada ·{" "}
        Pasá el cursor para ver materias relacionadas ·{" "}
        <span style={{ color:"#a78bfa" }}>cr</span> = créditos ·{" "}
        <span style={{ color:"#fb923c" }}>h/sem</span> = horas de estudio semanales fuera de clase
      </div>
    </div>
  );
}

// ─── PlanView ────────────────────────────────────────────────────────────────
function PlanView({ plan, maxPorSem, onMaxChange, semsRestantes, añosRestantes, titulo, config, updateConfig, showConfig, setShowConfig, nivel }) {
  const sliderVal = maxPorSem === "bloque" ? 5 : maxPorSem;

  // Carga por semestre futuro (primero no-actual)
  const proxSem = plan.find(p => !p.actual);
  const cargaProx = proxSem ? proxSem.materias.reduce((a,m) => a + m.creditos * 3, 0) : 0;
  const cargaActual = plan.find(p => p.actual)?.materias.reduce((a,m) => a + m.creditos * 3, 0) || 0;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#94a3b8", letterSpacing:0.3 }}>{titulo}</div>
        <button onClick={() => setShowConfig(v => !v)} style={{
          background:"#1e293b", border:"1px solid #334155", borderRadius:7, padding:"6px 14px",
          color:"#94a3b8", fontSize:11, cursor:"pointer", fontFamily:FONT, display:"flex", alignItems:"center", gap:6,
        }}>
          ⚙ Configurar inicio · <span style={{ color:"#3b82f6" }}>{config.semestre}-{config.año} · Ciclo {config.cicloActual}</span>
        </button>
      </div>

      {showConfig && (
        <div style={{ background:"#1e293b", border:"1px solid #3b82f6", borderRadius:10, padding:"16px 20px", marginBottom:20, display:"flex", gap:24, flexWrap:"wrap", alignItems:"flex-end" }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:1.5, color:"#64748b", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Año de inicio</div>
            <input type="number" min={2020} max={2035} value={config.año}
              onChange={e => updateConfig({ ...config, año: parseInt(e.target.value) || 2026 })}
              style={{ width:90, padding:"6px 10px", borderRadius:6, border:"1px solid #334155", background:"#0c1220", color:"#e2e8f0", fontSize:14, fontFamily:FONT, fontWeight:600 }} />
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:1.5, color:"#64748b", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Semestre actual</div>
            <div style={{ display:"flex", gap:8 }}>
              {["I","II"].map(s => (
                <button key={s} onClick={() => updateConfig({ ...config, semestre: s })}
                  style={{
                    padding:"6px 18px", borderRadius:7, cursor:"pointer", fontFamily:FONT, fontWeight:600, fontSize:13,
                    border:`1px solid ${config.semestre === s ? "#3b82f6" : "#334155"}`,
                    background: config.semestre === s ? "#1d4ed820" : "transparent",
                    color: config.semestre === s ? "#3b82f6" : "#64748b",
                  }}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:1.5, color:"#64748b", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Ciclo actual</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[1,2,3,4,5,6,7,8,9,10].map(c => (
                <button key={c} onClick={() => updateConfig({ ...config, cicloActual: c })}
                  style={{
                    padding:"4px 10px", borderRadius:6, cursor:"pointer", fontFamily:FONT, fontSize:12,
                    border:`1px solid ${config.cicloActual === c ? "#3b82f6" : "#334155"}`,
                    background: config.cicloActual === c ? "#1d4ed820" : "transparent",
                    color: config.cicloActual === c ? "#3b82f6" : "#64748b",
                  }}>{c}</button>
              ))}
            </div>
          </div>
          {nivel === "lic" && (
            <div>
              <div style={{ fontSize:10, letterSpacing:1.5, color:"#64748b", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Encadenar con bachillerato</div>
              <button onClick={() => updateConfig({ ...config, encadenar: !config.encadenar })}
                style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"6px 14px", borderRadius:7, cursor:"pointer", fontFamily:FONT, fontSize:12,
                  border:`1px solid ${config.encadenar ? "#059669" : "#334155"}`,
                  background: config.encadenar ? "#05966920" : "transparent",
                  color: config.encadenar ? "#059669" : "#64748b",
                }}>
                <div style={{
                  width:14, height:14, borderRadius:3, border:`2px solid ${config.encadenar ? "#059669" : "#475569"}`,
                  background: config.encadenar ? "#059669" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"white",
                }}>{config.encadenar ? "✓" : ""}</div>
                Iniciar lic. cuando termine bach.
              </button>
              {config.encadenar && (
                <div style={{ fontSize:9, color:"#64748b", marginTop:4 }}>El plan calculará el fin del bachillerato y arrancará la licenciatura el semestre siguiente.</div>
              )}
            </div>
          )}
          <button onClick={() => setShowConfig(false)}
            style={{ padding:"6px 16px", borderRadius:7, border:"1px solid #059669", background:"#059669", color:"white", fontSize:12, cursor:"pointer", fontFamily:FONT, fontWeight:600 }}>
            Listo
          </button>
        </div>
      )}

      {/* Controls + stats */}
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:10, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:1.5, color:"#64748b", textTransform:"uppercase", marginBottom:6, fontWeight:500 }}>Materias por semestre</div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <input type="range" min={1} max={5} value={sliderVal}
              onChange={e => onMaxChange(parseInt(e.target.value)===5 ? "bloque" : parseInt(e.target.value))}
              style={{ width:150, accentColor:"#3b82f6", cursor:"pointer" }} />
            <div style={{ fontSize:18, fontWeight:700, color:"#3b82f6", minWidth:130, fontVariantNumeric:"tabular-nums" }}>
              {maxPorSem==="bloque" ? "Bloque completo" : `${maxPorSem} materia${maxPorSem>1?"s":""}`}
            </div>
          </div>
          <div style={{ display:"flex", gap:6, marginTop:8 }}>
            {[1,2,3,4,"Bloque"].map((v,i) => (
              <button key={v} onClick={() => onMaxChange(i===4?"bloque":v)}
                style={{
                  padding:"3px 10px", borderRadius:20, fontFamily:FONT, cursor:"pointer",
                  border:`1px solid ${(maxPorSem==="bloque"&&i===4)||(maxPorSem===v)?"#3b82f6":"#334155"}`,
                  background:(maxPorSem==="bloque"&&i===4)||(maxPorSem===v)?"#1d4ed820":"transparent",
                  color:(maxPorSem==="bloque"&&i===4)||(maxPorSem===v)?"#3b82f6":"#64748b",
                  fontSize:11,
                }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderLeft:"1px solid #334155", paddingLeft:24, display:"flex", gap:20, flexWrap:"wrap" }}>
          {[
            { label:"Semestres restantes", val:semsRestantes,            color:"#3b82f6" },
            { label:"Años restantes",      val:añosRestantes+"a",        color:"#a78bfa" },
            { label:"Total semestres",     val:plan.length,              color:"#64748b" },
            cargaActual > 0 && { label:"Carga actual",    val:cargaActual+"h/sem", color:"#d97706" },
            cargaProx   > 0 && { label:"Carga próx. sem", val:cargaProx+"h/sem",  color:"#fb923c" },
          ].filter(Boolean).map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:700, color:s.color, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{s.val}</div>
              <div style={{ fontSize:9, color:"#64748b", letterSpacing:0.5, textTransform:"uppercase", marginTop:3, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Semesters */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {plan.map((sem, si) => {
          const cargaSem = sem.materias.reduce((a,m) => a + m.creditos * 3, 0);
          const creditosSem = sem.materias.reduce((a,m) => a + m.creditos, 0);
          return (
            <div key={si} style={{
              background: sem.actual ? "#1a2a1a" : "#1e293b",
              border: `1px solid ${sem.actual ? "#059669" : "#334155"}`,
              borderRadius: 10, overflow:"hidden",
            }}>
              <div style={{ padding:"10px 16px", background: sem.actual ? "#166534" : "#0f172a", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  {sem.actual && <span style={{ fontSize:8.5, background:"#059669", color:"white", padding:"2px 8px", borderRadius:20, letterSpacing:1, textTransform:"uppercase", fontWeight:600 }}>Actual</span>}
                  <span style={{ fontSize:13, fontWeight:600, color: sem.actual ? "#86efac" : "#e2e8f0", letterSpacing:0.3 }}>
                    {sem.actual ? sem.semestre : `Semestre ${si} · ${sem.semestre}`}
                  </span>
                </div>
                <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                  <span style={{ fontSize:10, color:"#bbc1ca" }}>{sem.materias.length} materia{sem.materias.length!==1?"s":""}</span>
                  <span style={{ fontSize:10, fontFamily:FONT_MONO, color:"#a78bfa" }}>{creditosSem} cr</span>
                  <span style={{ fontSize:10, fontFamily:FONT_MONO, color:"#fb923c" }}>{cargaSem}h/sem</span>
                </div>
              </div>
              <div style={{ padding:"12px 16px", display:"flex", flexWrap:"wrap", gap:8 }}>
                {sem.materias.map(m => {
                  const s = ESTADO_STYLES[sem.actual ? "en_proceso" : "pendiente"];
                  return (
                    <div key={m.id} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:7, padding:"6px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
                        <span style={{ fontSize:9.5, color:s.text, fontWeight:700, fontFamily:FONT_MONO }}>{m.id}</span>
                        <span style={{ fontSize:11, color:s.text, fontWeight:500 }}>{m.corto}</span>
                      </div>
                      <CreditoBadge creditos={m.creditos} />
                    </div>
                  );
                })}
                {(sem.bloqueadas||[]).length > 0 && (
                  <>
                    <div style={{ width:"100%", fontSize:9, color:"#475569", letterSpacing:1, textTransform:"uppercase", marginTop:4, marginBottom:2, fontWeight:500 }}>
                      Se desbloquean en este semestre:
                    </div>
                    {sem.bloqueadas.map(m => {
                      const s = ESTADO_STYLES["bloqueada"];
                      return (
                        <div key={m.id} style={{ background:s.bg, border:`1px dashed ${s.border}`, borderRadius:7, padding:"6px 12px", opacity:0.7 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <div style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
                            <span style={{ fontSize:9.5, color:s.text, fontWeight:700, fontFamily:FONT_MONO }}>{m.id}</span>
                            <span style={{ fontSize:11, color:s.text, fontWeight:500 }}>{m.corto}</span>
                          </div>
                          <CreditoBadge creditos={m.creditos} />
                          <div style={{ fontSize:8, color:s.text, opacity:0.6, marginTop:2, fontFamily:FONT_MONO }}>Req: {m.req.join(", ")}</div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {plan.length === 0 && (
          <div style={{ textAlign:"center", padding:40, color:"#475569", fontSize:14 }}>🎓 ¡Carrera completada!</div>
        )}
      </div>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function StatMini({ label, val, color }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:16, fontWeight:700, color, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{val}</div>
      <div style={{ fontSize:9, color:"#64748b", letterSpacing:0.5, textTransform:"uppercase", marginTop:2, fontWeight:500 }}>{label}</div>
    </div>
  );
}