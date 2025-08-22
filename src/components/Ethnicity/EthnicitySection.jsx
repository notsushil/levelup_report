import { useEffect, useState } from "react";
import EthnicityRow from "./EthnicityRow.jsx";

export default function EthnicitySection({ template, setTemplate, editEthnicity, setEditEthnicity }){
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(template);

  useEffect(()=>{ if(editing) setDraft(template.map(e=>({ ...e }))); }, [editing, template]);

  function changeEthName(idx, value){
    setDraft(prev => prev.map((e,i)=> i===idx ? ({ ...e, key: value }) : e));
  }
  function addEth(){ setDraft(prev => [...prev, { key: "New" }]); }
  function removeEth(idx){ setDraft(prev => prev.filter((_,i)=> i!==idx)); }
  function save(){
    const clean = draft.map(e=>({ key: String(e.key||"").trim() })).filter(e=>e.key);
    setTemplate(clean);
    localStorage.setItem("levelup_ethnicity_template_v1", JSON.stringify(clean));
    setEditEthnicity(prev => clean.find(e=>e.key===prev)?.key ?? (clean[0]?.key || ""));
    setEditing(false);
  }

  return (
    <>
      <div className="jackpotsHeader" style={{marginTop:16}}>
        <h2 style={{margin:0}}>Ethnicity Chips <span className="muted" style={{fontSize:14}}>(VM only)</span></h2>
        {!editing ? (
          <button className="btn" onClick={()=>setEditing(true)}>Edit ethnicity names</button>
        ) : (
          <div className="editBar">
            <button className="btn gradient" onClick={save}>Save names</button>
            <button className="btn ghost" onClick={()=>setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>
      {!editing && (
        <div className="muted" style={{textAlign:"left", marginTop:6}}>
          These are the quick-select options used in the VIP Mix drawer.
        </div>
      )}

      <div className="jGrid" style={{marginTop:12}}>
        {(editing ? draft : template).map((e, idx) => (
          <EthnicityRow
            key={editing ? idx : (e.key || idx)}
            editing={editing}
            label={e.key}
            onChange={v=>changeEthName(idx, v)}
            onRemove={()=>removeEth(idx)}
          />
        ))}
      </div>
      {editing && <button className="addRowBtn" onClick={addEth}>+ Add ethnicity chip</button>}
      <div className="divider" />
    </>
  );
}
