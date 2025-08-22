export default function RosterCard({ title, rows }){
  return (
    <div className="rosterCard">
      <h3>{title}</h3>
      {rows.map(r=>(
        <div className="row" key={r.key}>
          <div style={{minWidth:80, opacity:.95, textTransform:"capitalize"}}>{r.label}</div>
          <input placeholder="Name" value={r.value} onChange={e=>r.onChange(e.target.value)} />
        </div>
      ))}
    </div>
  );
}
