export default function LogList({ rows, timeOptions, onChange, onRemove }){
  return (
    <>
      {rows.map((row,i)=>(
        <div key={i} style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"stretch", marginBottom:10 }}>
          <select value={row.time} onChange={e=>onChange(i,"time",e.target.value)}>
            <option value="">Time…</option>
            {timeOptions.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <textarea placeholder="Details…" value={row.note} onChange={e=>onChange(i,"note",e.target.value)} />
          <button className="btn" onClick={()=>onRemove(i)}>×</button>
        </div>
      ))}
    </>
  );
}
