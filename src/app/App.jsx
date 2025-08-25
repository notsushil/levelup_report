import React, { useEffect, useMemo, useState } from "react";
import "./theme.css";

import Header from "../components/Header/Header.jsx";
import RosterSection from "../components/Roster/RosterSection.jsx";
import ShiftTable from "../components/Table/ShiftTable.jsx";
import LogsSection from "../components/Logs/LogsSection.jsx";
import JackpotsSection from "../components/Jackpots/JackpotsSection.jsx";
import EthnicitySection from "../components/Ethnicity/EthnicitySection.jsx";
import VipDrawer from "../components/VipDrawer/VipDrawer.jsx";
import SendPdfForm from "../components/SendPdfForm.jsx"; // ← add if you need it

import { HOURS, LSK } from "../lib/constants.js";
import { parseMoney, toMoney, numFmt } from "../lib/formatting.js";
import { buildTimeOptions } from "../lib/time.js";
import { slug } from "../lib/id.js";
import { useLocalDraft } from "../hooks/useLocalDraft.js";
import { useWeather } from "../hooks/useWeather.js";

const TIME_OPTIONS = buildTimeOptions();

const DEFAULT_JACKPOT_TEMPLATE = [
  { id: slug("Dragon Link $15k"),        name: "Dragon Link $15k" },
  { id: slug("Dollar Storm $50k"),       name: "Dollar Storm $50k" },
  { id: slug("Dragon Link $20k"),        name: "Dragon Link $20k" },
  { id: slug("Bull Rush $20k"),          name: "Bull Rush $20k" },
  { id: slug("Dragon Link $90k"),        name: "Dragon Link $90k" },
  { id: slug("Shenlong Unleashed $50k"), name: "Shenlong Unleashed $50k" },
];
const DEFAULT_ETHNICITY_TEMPLATE = [
  { key: "Middle Eastern" },
  { key: "East Asian" },
  { key: "South Asian" },
  { key: "European" },
  { key: "Maori/Pacific" },
  { key: "African" },
  { key: "Latin American" },
  { key: "Other" },
];

const emptyRow = (hour) => ({ hour, turnover: "", egm: "", vip: {} });

export default function App(){
  // Date & Weather
  const [sydDate, setSydDate] = useState("");
  const weather = useWeather("Granville,AU");
  useEffect(() => {
    const tick = () => {
      const d = new Date().toLocaleDateString("en-AU", {
        timeZone: "Australia/Sydney",
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
      setSydDate(d);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Drafts
  const defaultRows = HOURS.map(emptyRow);
  const defaultRoster = {
    managers: { open:{names:""}, mid:{names:""}, close:{names:""} },
    staffs:   { open:{names:""}, mid:{names:""}, close:{names:""} },
    security: { shift:"", names:"" },
  };
  const defaultLogs = { gaming: [], bar: [], incidents: [] };

  const {
    rows, setRows,
    roster, setRoster,
    logs, setLogs,
    jackpots, setJackpots,
    saveDraft, clearDraft
  } = useLocalDraft({ defaultRows, defaultRoster, defaultLogs });

  // Templates persisted in localStorage
  const [jackpotTemplate, setJackpotTemplate] = useState(()=>{
    const saved = localStorage.getItem(LSK.JACKPOTS);
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return DEFAULT_JACKPOT_TEMPLATE;
  });
  const [ethnicityTemplate, setEthnicityTemplate] = useState(()=>{
    const saved = localStorage.getItem(LSK.ETH);
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return DEFAULT_ETHNICITY_TEMPLATE;
  });

  // Increments
  const increments = useMemo(() => {
    const inc = [];
    for (let i=0; i<rows.length; i++){
      const cur = parseMoney(rows[i].turnover);
      const prev = i===0 ? 0 : parseMoney(rows[i-1].turnover);
      const val = i===0 ? cur : (cur - prev);
      inc.push(val > 0 ? val : 0);
    }
    return inc;
  }, [rows]);

  // Actions
  function updateCell(i, key, value){
    setRows(prev => { const next=[...prev]; next[i] = { ...next[i], [key]: value }; return next; });
  }
  function formatTurnoverOnBlur(i){
    setRows(prev => { const next=[...prev]; const n=parseMoney(next[i].turnover); next[i].turnover = n ? toMoney(n) : ""; return next; });
  }
  function updateRoster(group, shift, value){
    setRoster(prev => ({ ...prev, [group]: { ...prev[group], [shift]: { names:value } } }));
  }
  function updateSecurity(field, value){
    setRoster(prev => ({ ...prev, security: { ...prev.security, [field]: value } }));
  }
  function addLogRow(kind){ setLogs(prev => ({ ...prev, [kind]: [...prev[kind], { time:"", note:"" }] })); }
  function updateLog(kind, index, field, value){
    setLogs(prev => {
      const next = { ...prev };
      next[kind] = next[kind].map((row,i)=> i===index ? { ...row, [field]: value } : row);
      return next;
    });
  }
  function removeLog(kind, index){
    setLogs(prev => {
      const next = { ...prev };
      next[kind] = next[kind].filter((_,i)=>i!==index);
      return next;
    });
  }
  function updateJackpotAmount(id, value){ setJackpots(prev=>({ ...prev, [id]: value })); }
  function formatJackpotOnBlur(id){
    setJackpots(prev => { const raw=parseMoney(prev[id]); return { ...prev, [id]: raw ? toMoney(raw) : "" }; });
  }
  function submit(){
    const payload = { submittedAt:new Date().toISOString(), rows, roster, logs, jackpots };
    console.log("SUBMIT PAYLOAD →", payload);
    alert("Submitted (check the console). We’ll wire email/API next.");
  }

  // VIP Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editEthnicity, setEditEthnicity] = useState(ethnicityTemplate[0]?.key || "");
  const [editCount, setEditCount] = useState("");
  useEffect(() => {
    setEditEthnicity(prev => ethnicityTemplate.find(e=>e.key===prev)?.key ?? (ethnicityTemplate[0]?.key || ""));
  }, [ethnicityTemplate]);
  function openEdit(i){ setEditingIndex(i); setDrawerOpen(true); setEditEthnicity(ethnicityTemplate[0]?.key || ""); setEditCount(""); }
  function addVip(eth, c){
    if (editingIndex==null) return;
    const count = Number(c||0); if (!count) return;
    setRows(prev=>{
      const next=[...prev]; const r={...next[editingIndex]}; const vip={...(r.vip||{})};
      vip[eth] = (Number(vip[eth])||0) + count;
      r.vip=vip; next[editingIndex]=r; return next;
    });
  }
  function removeVip(eth){
    if (editingIndex==null) return;
    setRows(prev=>{
      const next=[...prev]; const r={...next[editingIndex]}; const vip={...(r.vip||{})};
      delete vip[eth]; r.vip=vip; next[editingIndex]=r; return next;
    });
  }

  return (
    <div className="wrap">
      <div className="card">
        <Header sydDate={sydDate} weather={weather} />

        <RosterSection
          roster={roster}
          onUpdateRoster={updateRoster}
          onUpdateSecurity={updateSecurity}
        />

        <ShiftTable
          rows={rows}
          increments={increments}
          numFmt={numFmt}
          onUpdateCell={updateCell}
          onFormatTurnover={formatTurnoverOnBlur}
          onOpenEdit={openEdit}
        />

        <LogsSection
          logs={logs}
          timeOptions={TIME_OPTIONS}
          onAdd={addLogRow}
          onChange={updateLog}
          onRemove={removeLog}
        />

        <JackpotsSection
          template={jackpotTemplate}
          jackpots={jackpots}
          setTemplate={setJackpotTemplate}
          onChangeAmount={updateJackpotAmount}
          onFormatAmount={formatJackpotOnBlur}
        />

        <EthnicitySection
          template={ethnicityTemplate}
          setTemplate={setEthnicityTemplate}
          editEthnicity={editEthnicity}
          setEditEthnicity={setEditEthnicity}
        />

        {/* Optional form */}
        <SendPdfForm />

        <div className="footer">
          <button className="btn ghost" onClick={clearDraft}>Clear Draft</button>
          <button className="btn" onClick={saveDraft}>Save Draft</button>
          <button className="btn gradient" onClick={submit}>Submit</button>
        </div>
      </div>

      <VipDrawer
        open={drawerOpen}
        row={editingIndex!=null ? rows[editingIndex] : null}
        index={editingIndex}
        template={ethnicityTemplate}
        onClose={()=>{ setDrawerOpen(false); setEditingIndex(null); }}
        onAdd={(eth, cnt)=>addVip(eth, cnt)}
        onRemove={(eth)=>removeVip(eth)}
      />
    </div>
  );
}
