export default function VipDrawer({ open, row, index, template, onClose, onAdd, onRemove }){
  if(open !== true) return null;
  const [eth, setEth] = React.useState(template[0]?.key || "");
  const [count, setCount] = React.useState("");

  React.useEffect(()=>{ setEth(template[0]?.key || ""); setCount(""); }, [index, template]);

  return (
    <div className="drawer" onClick={onClose} style={{background:"#0006", position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
      <div className="sheet" onClick={e=>e.stopPropagation()} style={{width:680, maxWidth:"100%", background:"#1f1637cc", border:"1px solid var(--line)", borderRadius:16, padding:18, backdropFilter:"blur(10px)", position:"relative"}}>
        <button className="btn ghost" style={{position:"absolute", right:18, top:14}} onClick={onClose}>Close</button>
        <h3 style={{margin:"0 0 8px"}}>Edit VIP Mix — {row?.hour}</h3>

        <div className="row" style={{marginTop:8, alignItems:"flex-end"}}>
          <div style={{minWidth:260, flex:1}}>
            <label>Ethnicity</label>
            <select style={{width:"100%"}} value={eth} onChange={e=>setEth(e.target.value)}>
              {template.map(e => <option key={e.key} value={e.key}>{e.key}</option>)}
            </select>
          </div>
          <div style={{minWidth:160}}>
            <label>Count</label>
            <input placeholder="2" value={count} onChange={e=>setCount(e.target.value)} />
          </div>
          <button className="btn gradient" onClick={()=>onAdd(eth, Number(count)||0)}>Add</button>
        </div>

        <div style={{marginTop:12}}>
          {(Object.entries(row?.vip || {}).length === 0) ? (
            <div className="muted">No VIP entries yet.</div>
          ) : (
            <div style={{display:"flex", flexWrap:"wrap"}}>
              {Object.entries(row.vip).map(([k,v])=>(
                <span key={k} className="chip">
                  <b>{k}:</b> {v}
                  <button className="btn ghost" style={{padding:"4px 8px", marginLeft:8}} onClick={()=>onRemove(k)}>remove</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
