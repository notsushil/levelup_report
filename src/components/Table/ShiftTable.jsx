import Row from "./Row.jsx";

export default function ShiftTable({ rows, increments, numFmt, onUpdateCell, onFormatTurnover, onOpenEdit }){
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th style={{width:80}}>Time</th>
            <th>Turnover</th>
            <th>Increments (’000s)</th>
            <th>EGM in play</th>
            <th style={{minWidth:240}}>VIP Mix</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <Row key={r.hour} r={r} i={i} increments={increments} numFmt={numFmt}
                 onUpdateCell={onUpdateCell} onFormatTurnover={onFormatTurnover} onOpenEdit={onOpenEdit}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}
