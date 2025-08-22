import { useEffect, useState } from "react";
import JackpotRow from "./JackpotRow.jsx";
import { slug } from "../../lib/id.js";

export default function JackpotsSection({ template, jackpots, setTemplate, onChangeAmount, onFormatAmount }){
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(template);

  useEffect(()=>{ if(editing) setDraft(template.map(j=>({ ...j }))); }, [editing, template]);

  function changeName(i, v){
    setDraft(prev => { const next=[...prev]; next[i] = { ...next[i], name:v }; return next; });
  }
  function save(){
    const cleaned = draft
      .map(j => ({ id: slug(j.name || j.id), name: (j.name ?? "").trim() }))
      .filter(j => j.name);
    setTemplate(cleaned);
    setEditing(false);
    localStorage.setItem("levelup_jackpot_template_v1", JSON.stringify(cleaned));
  }

  return (
    <>
      <div className="jackpotsHeader" style={{marginTop:18}}>
        <h2 style={{margin:0}}>Link Jackpots</h2>
        {!editing ? (
          <button className="btn" onClick={()=>setEditing(true)}>Edit jackpot names</button>
        ) : (
          <div className="editBar">
            <button className="btn gradient" onClick={save}>Save names</button>
            <button className="btn ghost" onClick={()=>setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>
      {!editing && (
        <div className="muted" style={{textAlign:"left", marginTop:6}}>
          Jackpot names are fixed. Enter amounts for this shift.
        </div>
      )}

      <div className="jGrid" style={{marginTop:12}}>
        {(editing ? draft : template).map((j, idx) => (
          <JackpotRow
            key={editing ? idx : (j.id || idx)}
            editing={editing}
            name={j.name}
            amount={jackpots[j.id] || ""}
            onName={v=>changeName(idx, v)}
            onAmount={v=>onChangeAmount(j.id, v)}
            onBlur={()=>onFormatAmount(j.id)}
          />
        ))}
      </div>
      <div className="divider" />
    </>
  );
}
