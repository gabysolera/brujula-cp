import { useState, useEffect, useCallback } from "react";

const MATERIAS = [
  { id: "CP1501", ciclo: 1, nombre: "Epistemología y Lógica del Pensamiento", req: [], corto: "Epistemología" },
  { id: "CP1504", ciclo: 1, nombre: "El Poder desde la Ciencia Política", req: [], corto: "El Poder" },
  { id: "EF",     ciclo: 1, nombre: "Actividad Deportiva", req: [], corto: "Act. Deportiva" },
  { id: "EGI",    ciclo: 1, nombre: "Curso Integrado de Humanidades I", req: [], corto: "Humanidades I" },
  { id: "OPT1018A", ciclo: 1, nombre: "Optativo de Idioma", req: [], corto: "Idioma I" },
  { id: "CP1502", ciclo: 2, nombre: "Instituciones Públicas y Comunidad Política", req: ["CP1504"], corto: "Instituciones" },
  { id: "CP1503", ciclo: 2, nombre: "Introducción al Diseño de Investigación", req: ["CP1501"], corto: "Diseño Inv." },
  { id: "EGII",   ciclo: 2, nombre: "Curso Integrado de Humanidades II", req: ["EGI"], corto: "Humanidades II" },
  { id: "OPT1018B", ciclo: 2, nombre: "Optativo de Idioma", req: [], corto: "Idioma II" },
  { id: "CP2001", ciclo: 3, nombre: "Estado y Gestión Pública", req: ["CP1502"], corto: "Estado y Gestión" },
  { id: "CP2002", ciclo: 3, nombre: "Aspectos Políticos de la Macroeconomía", req: ["CP1502"], corto: "Macroeconomía" },
  { id: "CP2003", ciclo: 3, nombre: "Aspectos Políticos del Derecho Constitucional", req: ["CP1502","CP1503"], corto: "Der. Constitucional" },
  { id: "CP2004", ciclo: 3, nombre: "Análisis Político Cuantitativo I", req: ["CP1503"], corto: "Cuantitativo I" },
  { id: "CP2005", ciclo: 3, nombre: "Ideas Políticas y sus Alcances I", req: ["CP1502"], corto: "Ideas Pol. I" },
  { id: "SRI",    ciclo: 3, nombre: "Seminario de Realidad Nacional I", req: ["EGII"], corto: "Seminario RN I" },
  { id: "CP2006", ciclo: 4, nombre: "Representación, Procesos Electorales y PA", req: ["CP2001","CP2003"], corto: "Representación" },
  { id: "CP2007", ciclo: 4, nombre: "Análisis Político Cuantitativo II", req: ["CP2004"], corto: "Cuantitativo II" },
  { id: "CP2008", ciclo: 4, nombre: "Ideas Políticas y sus Alcances II", req: ["CP2005"], corto: "Ideas Pol. II" },
  { id: "CP2009", ciclo: 4, nombre: "Teorías y Problemas de la Política Interna", req: ["CP2002"], corto: "Pol. Interna" },
  { id: "CP2010", ciclo: 4, nombre: "Políticas Públicas", req: ["CP2001","CP2002","CP2003"], corto: "Pol. Públicas" },
  { id: "SRII",   ciclo: 4, nombre: "Seminario de Realidad Nacional II", req: ["SRI"], corto: "Seminario RN II" },
  { id: "CP3001", ciclo: 5, nombre: "Investigación con Enfoque Cualitativo I", req: ["CP2007"], corto: "Cualitativo I" },
  { id: "CP3002", ciclo: 5, nombre: "Cultura Política", req: ["CP2008"], corto: "Cultura Pol." },
  { id: "CP3003", ciclo: 5, nombre: "Economía Política Global y Desarrollo", req: ["CP2009"], corto: "Econ. Global" },
  { id: "EGA",    ciclo: 5, nombre: "Curso de Arte", req: [], corto: "Arte" },
  { id: "OPT1019A", ciclo: 5, nombre: "Optativo Interdisciplinario I", req: [], corto: "Optativo I" },
  { id: "RP1",    ciclo: 5, nombre: "Repertorio Problemas Ecológicos", req: [], corto: "Ecología" },
  { id: "CP3004", ciclo: 6, nombre: "Investigación con Enfoque Cualitativo II", req: ["CP3001"], corto: "Cualitativo II" },
  { id: "CP3005", ciclo: 6, nombre: "Ideologías Políticas en América Latina y CR", req: ["CP3002","CP3003"], corto: "Ideologías" },
  { id: "CP3006", ciclo: 6, nombre: "Sistemas Políticos y Acciones Colectivas", req: ["CP2006","CP3002"], corto: "Sistemas Pol." },
  { id: "CP3007", ciclo: 6, nombre: "Centroamérica y el Caribe en la Geopolítica", req: ["CP3003"], corto: "Geopolítica" },
  { id: "CP3008", ciclo: 6, nombre: "Toma de Decisiones y Asuntos Públicos", req: ["CP2010","CP3003"], corto: "Toma Decisiones" },
  { id: "OPT1019B", ciclo: 6, nombre: "Optativo Interdisciplinario II", req: [], corto: "Optativo II" },
  { id: "CP4000", ciclo: 7, nombre: "Método Comparado", req: ["CP3004"], corto: "Mét. Comparado" },
  { id: "CP4001", ciclo: 7, nombre: "Teoría Política Contemporánea I", req: ["CP3005"], corto: "Teoría Pol. I" },
  { id: "CP4002", ciclo: 7, nombre: "Política Exterior en las Américas", req: ["CP3007"], corto: "Pol. Exterior" },
  { id: "CP4003", ciclo: 7, nombre: "Negociación y Manejo de Conflictos", req: ["CP3008"], corto: "Negociación" },
  { id: "CP4004", ciclo: 7, nombre: "Estudios de Opinión y Opinión Pública", req: ["CP3004"], corto: "Opinión Púb." },
  { id: "OPT1019C", ciclo: 7, nombre: "Optativo Interdisciplinario III", req: [], corto: "Optativo III" },
  { id: "CP4005", ciclo: 8, nombre: "Teoría Política Contemporánea II", req: ["CP4001"], corto: "Teoría Pol. II" },
  { id: "CP4006", ciclo: 8, nombre: "Comunicación Política", req: ["CP4004"], corto: "Comunicación Pol." },
  { id: "CP4007", ciclo: 8, nombre: "Práctica Profesional", req: ["CP4000","CP4001","CP4002","CP4003","CP4004"], corto: "Práctica Prof." },
  { id: "CP4008", ciclo: 8, nombre: "Aspectos Políticos del Derecho Administrativo", req: ["CP3008"], corto: "Der. Administrativo" },
  { id: "OPT1019D", ciclo: 8, nombre: "Optativo Interdisciplinario IV", req: [], corto: "Optativo IV" },
];

const TOTAL = MATERIAS.length;
const CICLOS = [1,2,3,4,5,6,7,8];
const CICLO_LABELS = ["Ciclo I","Ciclo II","Ciclo III","Ciclo IV","Ciclo V","Ciclo VI","Ciclo VII","Ciclo VIII"];
const DEFAULT_ESTADO = {
  "EF": "aprobada", "EGI": "aprobada", "EGII": "aprobada",
  "SRI": "aprobada", "SRII": "aprobada", "EGA": "aprobada",
  "CP1501": "en_proceso", "CP1504": "en_proceso",
};

function calcEstados(estadosBase) {
  const e = { ...estadosBase };
  MATERIAS.forEach(m => {
    if (!e[m.id] || e[m.id] === "bloqueada" || e[m.id] === "pendiente") {
      const desbloqueada = m.req.every(r => e[r] === "aprobada");
      if (desbloqueada && e[m.id] !== "en_proceso") e[m.id] = "pendiente";
      else if (!desbloqueada && (e[m.id] === "pendiente" || !e[m.id])) e[m.id] = "bloqueada";
    }
  });
  return e;
}

function generarPlan(estados, maxPorSem) {
  const aprobadas = new Set(MATERIAS.filter(m => estados[m.id] === "aprobada" || estados[m.id] === "en_proceso").map(m => m.id));
  const enProceso = MATERIAS.filter(m => estados[m.id] === "en_proceso").map(m => m.id);
  const plan = [];
  if (enProceso.length > 0) {
    plan.push({ semestre: "Semestre actual (I-2026)", materias: enProceso.map(id => MATERIAS.find(m => m.id === id)), actual: true });
    enProceso.forEach(id => aprobadas.add(id));
  }
  let restantes = MATERIAS.filter(m => estados[m.id] !== "aprobada" && estados[m.id] !== "en_proceso");
  let semIdx = 1;
  const añoBase = 2026;
  while (restantes.length > 0) {
    const disponibles = restantes.filter(m => m.req.every(r => aprobadas.has(r)));
    if (disponibles.length === 0) break;
    const lote = maxPorSem === "bloque" ? disponibles : disponibles.slice(0, maxPorSem);
    lote.forEach(m => aprobadas.add(m.id));
    restantes = restantes.filter(m => !lote.includes(m));
    semIdx++;
    const año = añoBase + Math.floor(semIdx / 2);
    const periodo = semIdx % 2 === 0 ? "II" : "I";
    plan.push({ semestre: `${periodo}-${año}`, materias: lote, actual: false });
  }
  return plan;
}

const ESTADO_STYLES = {
  aprobada:   { bg: "#d1fae5", border: "#059669", text: "#065f46", dot: "#059669", label: "Aprobada" },
  en_proceso: { bg: "#fef3c7", border: "#d97706", text: "#78350f", dot: "#d97706", label: "En Proceso" },
  pendiente:  { bg: "#eff6ff", border: "#3b82f6", text: "#1e3a8a", dot: "#3b82f6", label: "Pendiente" },
  bloqueada:  { bg: "#f1f5f9", border: "#cbd5e1", text: "#94a3b8", dot: "#cbd5e1", label: "Bloqueada" },
};

export default function App() {
  const [tab, setTab] = useState("mapa");
  const [estadosBase, setEstadosBase] = useState(DEFAULT_ESTADO);
  const [estados, setEstados] = useState(() => calcEstados(DEFAULT_ESTADO));
  const [maxPorSem, setMaxPorSem] = useState(3);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cp_estados");
      if (saved) {
        const base = JSON.parse(saved);
        setEstadosBase(base);
        setEstados(calcEstados(base));
      }
    } catch {}
    try {
      const savedMax = localStorage.getItem("cp_max");
      if (savedMax) setMaxPorSem(JSON.parse(savedMax));
    } catch {}
  }, []);

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
    const m = MATERIAS.find(x => x.id === id);
    const desbloqueada = m.req.every(r => estados[r] === "aprobada");
    if (actual === "bloqueada" && !desbloqueada) return;
    const ciclo = { bloqueada: "pendiente", pendiente: "en_proceso", en_proceso: "aprobada", aprobada: "pendiente" };
    let next = ciclo[actual];
    if (next === "pendiente" && !desbloqueada) next = "bloqueada";
    updateEstado(id, next);
  }, [estadosBase, estados, updateEstado]);

  const onMaxChange = (val) => {
    setMaxPorSem(val);
    try { localStorage.setItem("cp_max", JSON.stringify(val)); } catch {}
  };

  const aprobadas = MATERIAS.filter(m => estados[m.id] === "aprobada").length;
  const enProceso = MATERIAS.filter(m => estados[m.id] === "en_proceso").length;
  const pct = Math.round((aprobadas / TOTAL) * 100);
  const plan = generarPlan(estados, maxPorSem);
  const semsRestantes = plan.filter(p => !p.actual).length;
  const añosRestantes = (semsRestantes / 2).toFixed(1);
  const ultimoSem = plan.length > 0 ? plan[plan.length - 1].semestre : "—";

  return (
    <div style={{ minHeight:"100vh", background:"#0f172a", fontFamily:"'Georgia','Times New Roman',serif", color:"#e2e8f0" }}>
      <div style={{ background:"linear-gradient(135deg,#1e3a5f 0%,#0f172a 100%)", borderBottom:"1px solid #1e3a5f", padding:"0 24px" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", paddingTop:20 }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:16 }}>
            <div>
              <div style={{ fontSize:11, letterSpacing:4, color:"#64748b", textTransform:"uppercase", marginBottom:4 }}>Universidad de Costa Rica</div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:"normal", color:"#e2e8f0", letterSpacing:1 }}>
                Ciencias Políticas <span style={{ color:"#3b82f6", fontSize:14 }}>· Brújula CP</span>
              </h1>
            </div>
            <div style={{ display:"flex", gap:24, alignItems:"center" }}>
              {[
                { label:"Aprobadas", val:aprobadas, color:"#059669" },
                { label:"En Proceso", val:enProceso, color:"#d97706" },
                { label:"Avance", val:pct+"%", color:"#3b82f6" },
                { label:"Graduación est.", val:ultimoSem, color:"#a78bfa" },
              ].map(s => (
                <div key={s.label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:"bold", color:s.color, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:10, color:"#64748b", letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height:3, background:"#1e3a5f", borderRadius:2, overflow:"hidden", marginBottom:0 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#1d4ed8,#3b82f6)", borderRadius:2, transition:"width 0.6s ease" }} />
          </div>
          <div style={{ display:"flex", gap:0, marginTop:0 }}>
            {[["mapa","🗺 Mapa de Carrera"],["plan","📅 Plan Semestral"]].map(([t,l]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding:"12px 24px", border:"none", background:"transparent", cursor:"pointer",
                color: tab===t ? "#3b82f6" : "#64748b",
                borderBottom: tab===t ? "2px solid #3b82f6" : "2px solid transparent",
                fontSize:13, letterSpacing:0.5, transition:"all 0.2s", fontFamily:"inherit"
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"24px" }}>
        {tab === "mapa"
          ? <MapaView estados={estados} ciclarEstado={ciclarEstado} hoveredId={hoveredId} setHoveredId={setHoveredId} />
          : <PlanView plan={plan} maxPorSem={maxPorSem} onMaxChange={onMaxChange} semsRestantes={semsRestantes} añosRestantes={añosRestantes} />
        }
      </div>

      <div style={{ position:"fixed", bottom:16, right:16, background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", display:"flex", gap:14, flexWrap:"wrap", boxShadow:"0 4px 20px rgba(0,0,0,0.5)" }}>
        {Object.entries(ESTADO_STYLES).map(([k,v]) => (
          <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:v.dot }} />
            <span style={{ fontSize:10, color:"#94a3b8", letterSpacing:0.5 }}>{v.label}</span>
          </div>
        ))}
        <span style={{ fontSize:10, color:"#475569", borderLeft:"1px solid #334155", paddingLeft:10 }}>Click = cambiar estado</span>
      </div>
    </div>
  );
}

function MapaView({ estados, ciclarEstado, hoveredId, setHoveredId }) {
  return (
    <div>
      <div style={{ overflowX:"auto", paddingBottom:16 }}>
        <div style={{ display:"flex", gap:12, minWidth:"max-content" }}>
          {CICLOS.map((ciclo, ci) => {
            const mats = MATERIAS.filter(m => m.ciclo === ciclo);
            return (
              <div key={ciclo} style={{ width:160 }}>
                <div style={{ textAlign:"center", fontSize:10, letterSpacing:2, color:"#3b82f6", textTransform:"uppercase", marginBottom:10, padding:"4px 0", borderBottom:"1px solid #1e3a5f" }}>
                  {CICLO_LABELS[ci]}
                  <span style={{ display:"block", fontSize:9, color:"#475569", marginTop:1 }}>Año {ci < 2 ? 1 : ci < 4 ? 2 : ci < 6 ? 3 : 4}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {mats.map(m => {
                    const est = estados[m.id] || "bloqueada";
                    const s = ESTADO_STYLES[est];
                    const isHov = hoveredId === m.id;
                    const isRelated = hoveredId && (m.req.includes(hoveredId) || MATERIAS.find(x => x.id === hoveredId)?.req.includes(m.id));
                    return (
                      <div key={m.id} onClick={() => ciclarEstado(m.id)}
                        onMouseEnter={() => setHoveredId(m.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          background:s.bg, border:`1.5px solid ${isHov||isRelated ? s.dot : s.border}`,
                          borderRadius:6, padding:"8px 10px",
                          cursor: est==="bloqueada" ? "default" : "pointer",
                          opacity: est==="bloqueada" ? 0.55 : 1,
                          transform: isHov ? "scale(1.03)" : "scale(1)",
                          transition:"all 0.15s ease",
                          boxShadow: isHov ? `0 0 0 2px ${s.dot}40,0 4px 12px rgba(0,0,0,0.3)` : isRelated ? `0 0 0 1px ${s.dot}60` : "none",
                        }}>
                        <div style={{ fontSize:9, color:s.text, fontWeight:"bold", letterSpacing:0.5, marginBottom:2, opacity:0.7 }}>{m.id}</div>
                        <div style={{ fontSize:11, color:s.text, lineHeight:1.3, fontWeight: est!=="bloqueada"?"600":"normal" }}>{m.corto}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:5 }}>
                          <div style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
                          <span style={{ fontSize:9, color:s.text, opacity:0.8 }}>{s.label}</span>
                        </div>
                        {m.req.length > 0 && (
                          <div style={{ fontSize:8, color:s.text, opacity:0.5, marginTop:3 }}>Req: {m.req.join(", ")}</div>
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
      <div style={{ marginTop:16, padding:"12px 16px", background:"#0f172a", border:"1px solid #1e3a5f", borderRadius:8, fontSize:11, color:"#64748b", lineHeight:1.8 }}>
        <span style={{ color:"#3b82f6", fontWeight:"bold" }}>Cómo usar: </span>
        Click en una materia para cambiar su estado · <span style={{ color:"#059669" }}>Verde</span> = Aprobada · <span style={{ color:"#d97706" }}>Amarillo</span> = En Proceso · <span style={{ color:"#3b82f6" }}>Azul</span> = Pendiente · <span style={{ color:"#64748b" }}>Gris</span> = Bloqueada · Pasá el cursor para ver materias relacionadas.
      </div>
    </div>
  );
}

function PlanView({ plan, maxPorSem, onMaxChange, semsRestantes, añosRestantes }) {
  const sliderVal = maxPorSem === "bloque" ? 5 : maxPorSem;
  return (
    <div>
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:10, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:2, color:"#64748b", textTransform:"uppercase", marginBottom:6 }}>Materias por semestre</div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <input type="range" min={1} max={5} value={sliderVal}
              onChange={e => onMaxChange(parseInt(e.target.value) === 5 ? "bloque" : parseInt(e.target.value))}
              style={{ width:160, accentColor:"#3b82f6", cursor:"pointer" }} />
            <div style={{ fontSize:20, fontWeight:"bold", color:"#3b82f6", minWidth:120 }}>
              {maxPorSem === "bloque" ? "Bloque completo" : `${maxPorSem} materia${maxPorSem>1?"s":""}`}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            {[1,2,3,4,"Bloque"].map((v,i) => (
              <button key={v} onClick={() => onMaxChange(i===4?"bloque":v)}
                style={{ padding:"3px 10px", borderRadius:20,
                  border:`1px solid ${(maxPorSem==="bloque"&&i===4)||(maxPorSem===v)?"#3b82f6":"#334155"}`,
                  background:(maxPorSem==="bloque"&&i===4)||(maxPorSem===v)?"#1d4ed820":"transparent",
                  color:(maxPorSem==="bloque"&&i===4)||(maxPorSem===v)?"#3b82f6":"#64748b",
                  fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div style={{ borderLeft:"1px solid #334155", paddingLeft:24, display:"flex", gap:20 }}>
          {[
            { label:"Semestres restantes", val:semsRestantes, color:"#3b82f6" },
            { label:"Años restantes", val:añosRestantes+"a", color:"#a78bfa" },
            { label:"Total semestres", val:plan.length, color:"#64748b" },
          ].map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:"bold", color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:10, color:"#64748b", letterSpacing:0.5, textTransform:"uppercase", marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {plan.map((sem, si) => (
          <div key={si} style={{ background:sem.actual?"#1a2a1a":"#1e293b", border:`1px solid ${sem.actual?"#059669":"#334155"}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"10px 16px", background:sem.actual?"#166534":"#0f172a", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {sem.actual && <span style={{ fontSize:9, background:"#059669", color:"white", padding:"2px 8px", borderRadius:20, letterSpacing:1, textTransform:"uppercase" }}>Actual</span>}
                <span style={{ fontSize:13, fontWeight:"bold", color:sem.actual?"#86efac":"#e2e8f0", letterSpacing:0.5 }}>
                  {sem.actual ? sem.semestre : `Semestre ${si} · ${sem.semestre}`}
                </span>
              </div>
              <span style={{ fontSize:11, color:"#64748b" }}>{sem.materias.length} materia{sem.materias.length!==1?"s":""}</span>
            </div>
            <div style={{ padding:"12px 16px", display:"flex", flexWrap:"wrap", gap:8 }}>
              {sem.materias.map(m => {
                const s = ESTADO_STYLES[sem.actual ? "en_proceso" : "pendiente"];
                return (
                  <div key={m.id} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:6, padding:"6px 12px", display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
                    <span style={{ fontSize:10, color:s.text, fontWeight:"bold", marginRight:4 }}>{m.id}</span>
                    <span style={{ fontSize:11, color:s.text }}>{m.corto}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {plan.length === 0 && (
          <div style={{ textAlign:"center", padding:40, color:"#475569", fontSize:14 }}>🎓 ¡Carrera completada!</div>
        )}
      </div>
    </div>
  );
}