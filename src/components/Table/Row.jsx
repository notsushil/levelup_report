export default function Row({ r, i, increments, numFmt, onUpdateCell, onFormatTurnover, onOpenEdit }){
  return (
    <tr>
      <td>{r.hour}</td>
      <td>
        <input className="money" placeholder="$"
               value={r.turnover}
               onChange={e=>onUpdateCell(i,"turnover",e.target.value)}
               onBlur={()=>onFormatTurnover(i)} />
      </td>
      <td>
        <input className="money readonly" placeholder="000s" readOnly tabIndex={-1}
               value={increments[i] ? numFmt.format(increments[i]) : ""} />
      </td>
      <td>
        <input placeholder="#"
               value={r.egm}
               onChange={e=>onUpdateCell(i,"egm",e.target.value)} />
      </td>
      <td>
        {Object.keys(r.vip||{}).length===0 ? (
          <span className="muted" style={{fontSize:13}}>—</span>
        ) : (
          <div style={{display:"flex", flexWrap:"wrap"}}>
            {Object.entries(r.vip).map(([k,v])=>(
              <span key={k} className="chip"><b>{k}:</b> {v}</span>
            ))}
          </div>
        )}
      </td>
      <td><button className="btn" onClick={()=>onOpenEdit(i)}>Edit</button></td>
    </tr>
  );
}
