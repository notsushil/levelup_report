import { useEffect, useMemo, useState } from "react";

/** ---- Config ---- */
const HOURS = [
  "10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm",
  "10pm","11pm","12am","1am","2am","3am","4am","5am","6am"
];

const ETHNICITIES = [
  { key: "Middle Eastern" },
  { key: "East Asian" },
  { key: "South Asian" },
  { key: "European" },
  { key: "Maori/Pacific" },
  { key: "African" },
  { key: "Latin American" },
  { key: "Other" },
];

/** ---- Styles via CSS vars ---- */
const Theme = () => (
  <style>{`
    :root{
      --bg1:#A56EFF; /* purple */
      --bg2:#FF6FD8; /* pink */
      --bg3:#FFC371; /* peach */
      --card: rgba(255,255,255,0.18);
      --card-solid: rgba(255,255,255,0.10);
      --text-on:#fff;
      --line: rgba(255,255,255,0.25);
      --input:#ffffff22;
      --chip:#ffffff2e;
    }

    *{box-sizing:border-box}
    html, body, #root { height: 100%; }

body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
    color: var(--text-on);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    position: relative;
    min-height: 100vh;
    background: none; /* remove black */
}

body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(150% 150% at -10% -10%, #A56EFF, var(--bg1) 50%),
        radial-gradient(150% 150% at 110% 110%, #FFC371, var(--bg3) 50%),
        linear-gradient(135deg, var(--bg1), var(--bg2) 50%, var(--bg3));
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
}

    }



    .wrap{
      width:100%;
      max-width:1100px;
      margin:24px auto;
      padding:0 16px 56px;      /* extra bottom padding so nothing feels cut */
    }

    .card{
    width:100%;
     /* Give the card its own gradient so it continues all the way down */
      background: linear-gradient(135deg, var(--bg1), var(--bg2) 50%, var(--bg3));
     border: 1px solid var(--line);
     border-radius: 18px;
     padding: 20px;
      position: relative;
      overflow: visible;
     box-shadow: 0 12px 40px #00000033, inset 0 1px 0 #ffffff22;
    }

/* Optional frosted overlay for glassy effect */
.card::before{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06));
  border-radius: 18px;
  pointer-events:none;
}


    h1{margin:0 0 6px; text-align:center; font-size:28px}
    .muted{opacity:0.9; text-align:center; margin-bottom:16px}

    .row{display:flex; gap:10px; align-items:center; flex-wrap:wrap}
    .pill{
      background: var(--card-solid);
      border:1px solid var(--line);
      border-radius:999px; padding:10px 14px; display:inline-flex; gap:8px; align-items:center
    }
    .switch{
      display:inline-flex; background: var(--card-solid); border:1px solid var(--line);
      border-radius:999px; overflow:hidden
    }
    .switch button{
      padding:8px 12px; border:0; color:#fff; background:transparent; cursor:pointer
    }
    .switch button.active{background:#ffffff33; color:#111}

    /* Scroll container so wide tables never get chopped */
    .table-scroll{
      width:100%;
      overflow-x:auto;
      -webkit-overflow-scrolling: touch;
    }

    table{
      width:100%;
      border-collapse:collapse;
      margin-top:12px;
      table-layout: fixed;       /* keep cells within card width */
    }
    th,td{padding:10px; border-bottom:1px solid var(--line); text-align:left; font-size:14px; word-wrap:break-word}
    th{opacity:0.95}
    th:last-child, td:last-child { width: 88px; }  /* space for Edit button */

    input{
      width:100%; padding:10px 12px; border-radius:12px; border:1px solid var(--line);
      background:var(--input); color:#fff; outline:none
    }
    .chip{display:inline-flex; gap:6px; align-items:center; padding:6px 10px; border-radius:999px; background:var(--chip); border:1px solid var(--line); margin:2px}
    .btn{
      padding:10px 14px; border-radius:12px; border:1px solid var(--line);
      background:#ffffff; color:#111; font-weight:700; cursor:pointer
    }
    .btn.ghost{background:transparent; color:#fff}
    .btn.gradient{
      background: linear-gradient(90deg, var(--bg1), var(--bg2), var(--bg3));
      color:#111; border:none
    }
    .footer{display:flex; gap:12px; justify-content:flex-end; margin-top:18px}
    .divider{height:1px; background:var(--line); margin:18px 0}

    /* Edit drawer */
    .drawer{
      background:#00000044; position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
      padding:20px;
    }
    .sheet{
      width:680px; max-width:100%; background:#1f1637cc; border:1px solid var(--line);
      border-radius:16px; padding:18px; backdrop-filter: blur(10px)
    }
    .sheet h3{margin:0 0 8px}
    .sheet .row{align-items:flex-end}
    .sheet select, .sheet input{background:#2a2144; border-color:#ffffff2e}
    .close-x{
      position:absolute; right:18px; top:14px; background:#ffffff22; border:1px solid var(--line);
      border-radius:10px; padding:6px 9px; cursor:pointer
    }

    .legend{display:flex; gap:10px; flex-wrap:wrap; margin-top:8px}
    .dot{width:10px; height:10px; border-radius:50%; display:inline-block; background:#fff; opacity:0.9}
  `}</style>
);

/** ---- Helpers ---- */
const emptyRow = (hour) => ({
  hour,
  turnover: "",
  incK: "",
  totalK: "",
  egm: "",
  vip: {} // { 'Middle Eastern': number, ... }
});

function readNumber(v) {
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : 0;
}

/** ---- Main ---- */
export default function App() {
  const [mode, setMode] = useState("off"); // "off" | "3h"
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("levelup_report_draft");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return HOURS.map(emptyRow);
  });

  const [editing, setEditing] = useState(null); // index being edited or null
  const [editEthnicity, setEditEthnicity] = useState(ETHNICITIES[0].key);
  const [editCount, setEditCount] = useState("");

  /** Aggregate for legend */
  const totals = useMemo(() => {
    const all = Object.fromEntries(ETHNICITIES.map(e => [e.key, 0]));
    let egmSum = 0;
    rows.forEach(r => {
      egmSum += readNumber(r.egm);
      for (const [k, v] of Object.entries(r.vip || {})) {
        all[k] = (all[k] || 0) + readNumber(v);
      }
    });
    return { all, egmSum };
  }, [rows]);

  /** Actions */
  function updateCell(i, key, value) {
    setRows(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: value };
      return next;
    });
  }

  function openEdit(i) {
    setEditing(i);
    setEditEthnicity(ETHNICITIES[0].key);
    setEditCount("");
  }

  function addVip() {
    if (editing == null) return;
    const c = readNumber(editCount);
    if (!c) return;
    setRows(prev => {
      const next = [...prev];
      const r = { ...next[editing] };
      const vip = { ...(r.vip || {}) };
      vip[editEthnicity] = readNumber(vip[editEthnicity]) + c;
      r.vip = vip;
      next[editing] = r;
      return next;
    });
    setEditCount("");
  }

  function removeVip(eth) {
    if (editing == null) return;
    setRows(prev => {
      const next = [...prev];
      const r = { ...next[editing] };
      const vip = { ...(r.vip || {}) };
      delete vip[eth];
      r.vip = vip;
      next[editing] = r;
      return next;
    });
  }

  function saveDraft() {
    localStorage.setItem("levelup_report_draft", JSON.stringify(rows));
    alert("Draft saved locally.");
  }

  function clearDraft() {
    localStorage.removeItem("levelup_report_draft");
    alert("Local draft cleared.");
  }

  function submit() {
    const payload = {
      mode,
      submittedAt: new Date().toISOString(),
      rows
    };
    console.log("SUBMIT PAYLOAD →", payload);
    alert("Submitted (check the console). We’ll wire email/API next.");
  }

  return (
    <>
      <Theme />
      <div className="wrap">
        <div className="card">
          <h1>LevelUP Shift Report</h1>
          <div className="muted">VIP counter grid · live ethnicity mix</div>

          <div className="row" style={{justifyContent:"space-between", marginTop:6}}>
            <div className="row">
              <div className="pill">Average Bet Mode:</div>
              <div className="switch">
                <button
                  className={mode==="off" ? "active" : ""}
                  onClick={()=>setMode("off")}
                >Off</button>
                <button
                  className={mode==="3h" ? "active" : ""}
                  onClick={()=>setMode("3h")}
                >Every 3 Hours</button>
              </div>
            </div>

            <div className="pill">
              Current denominator · EGM in play: <strong style={{marginLeft:6}}>{totals.egmSum || 0}</strong>
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th style={{width:80}}>Time</th>
                  <th>Turnover</th>
                  <th>Increments (’000s)</th>
                  <th>Turnover Total (’000s)</th>
                  <th>EGM in play</th>
                  <th style={{minWidth:240}}>VIP Mix</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.hour}>
                    <td>{r.hour}</td>
                    <td>
                      <input placeholder="$" value={r.turnover}
                        onChange={e=>updateCell(i,"turnover",e.target.value)} />
                    </td>
                    <td>
                      <input placeholder="000s" value={r.incK}
                        onChange={e=>updateCell(i,"incK",e.target.value)} />
                    </td>
                    <td>
                      <input placeholder="000s" value={r.totalK}
                        onChange={e=>updateCell(i,"totalK",e.target.value)} />
                    </td>
                    <td>
                      <input placeholder="#" value={r.egm}
                        onChange={e=>updateCell(i,"egm",e.target.value)} />
                    </td>
                    <td>
                      {Object.keys(r.vip||{}).length === 0 ? (
                        <span className="muted" style={{fontSize:13}}>—</span>
                      ) : (
                        <div style={{display:"flex", flexWrap:"wrap"}}>
                          {Object.entries(r.vip).map(([k,v])=>(
                            <span key={k} className="chip"><b>{k}:</b> {v}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <button className="btn" onClick={()=>openEdit(i)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divider" />

          {/* Legend */}
          <div className="legend">
            <div style={{width:"100%", fontWeight:700, marginBottom:4}}>VIP Ethnicity Mix (relative to current EGM in play)</div>
            {ETHNICITIES.map((e) => {
              const count = totals.all[e.key] || 0;
              const pct = totals.egmSum > 0 ? Math.round((count / totals.egmSum) * 100) : 0;
              return (
                <div key={e.key} className="chip" style={{background:"#ffffff2b"}}>
                  <span className="dot" />
                  <span style={{marginLeft:6}}>{e.key}:</span>
                  <span> {pct}% </span>
                  <span style={{opacity:.9}}> ({count}/{totals.egmSum || 0})</span>
                </div>
              );
            })}
            <div style={{width:"100%", opacity:.9, marginTop:6, fontSize:13}}>
              Example: if 2 Middle Eastern VIPs and current EGM in play is 4, the bar shows 50% for Middle Eastern.
            </div>
          </div>

          <div className="footer">
            <button className="btn ghost" onClick={clearDraft}>Clear Draft</button>
            <button className="btn" onClick={saveDraft}>Save Draft</button>
            <button className="btn gradient" onClick={submit}>Submit</button>
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      {editing !== null && (
        <div className="drawer" onClick={()=>setEditing(null)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <button className="close-x" onClick={()=>setEditing(null)}>Close</button>
            <h3>Edit VIP Mix — {rows[editing].hour}</h3>

            <div className="row" style={{marginTop:8}}>
              <div style={{minWidth:260, flex:1}}>
                <label>Ethnicity</label>
                <select
                  style={{width:"100%", padding:"10px 12px", borderRadius:12, color:"#fff"}}
                  value={editEthnicity}
                  onChange={e=>setEditEthnicity(e.target.value)}
                >
                  {ETHNICITIES.map(e => <option key={e.key} value={e.key}>{e.key}</option>)}
                </select>
              </div>
              <div style={{minWidth:160}}>
                <label>Count</label>
                <input placeholder="e.g. 2" value={editCount} onChange={e=>setEditCount(e.target.value)} />
              </div>
              <button className="btn gradient" onClick={addVip}>Add</button>
            </div>

            <div style={{marginTop:12}}>
              {(Object.entries(rows[editing].vip || {}).length === 0) ? (
                <div className="muted">No VIP entries yet.</div>
              ) : (
                <div style={{display:"flex", flexWrap:"wrap"}}>
                  {Object.entries(rows[editing].vip).map(([k,v])=>(
                    <span key={k} className="chip">
                      <b>{k}:</b> {v}
                      <button
                        className="btn ghost"
                        style={{padding:"4px 8px", marginLeft:8}}
                        onClick={()=>removeVip(k)}
                      >
                        remove
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
