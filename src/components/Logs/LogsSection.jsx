import LogList from "./LogList.jsx";

export default function LogsSection({ logs, timeOptions, onAdd, onChange, onRemove }){
  return (
    <>
      <h2 className="muted" style={{textAlign:"left", margin:0}}>Interactions</h2>
      <div className="logWrap" style={{marginTop:8}}>
        <div className="logCard">
          <h3>Gaming Interaction</h3>
          <LogList rows={logs.gaming} timeOptions={timeOptions} onChange={(i,f,v)=>onChange("gaming",i,f,v)} onRemove={(i)=>onRemove("gaming",i)} />
          <button className="addRowBtn" onClick={()=>onAdd("gaming")}>+ Add gaming interaction</button>
        </div>

        <div className="logCard">
          <h3>Bar Interaction</h3>
          <LogList rows={logs.bar} timeOptions={timeOptions} onChange={(i,f,v)=>onChange("bar",i,f,v)} onRemove={(i)=>onRemove("bar",i)} />
          <button className="addRowBtn" onClick={()=>onAdd("bar")}>+ Add bar interaction</button>
        </div>

        <div className="logCard">
          <h3>Incidents (throughout the night)</h3>
          <LogList rows={logs.incidents} timeOptions={timeOptions} onChange={(i,f,v)=>onChange("incidents",i,f,v)} onRemove={(i)=>onRemove("incidents",i)} />
          <button className="addRowBtn" onClick={()=>onAdd("incidents")}>+ Add incident</button>
        </div>
      </div>
      <div className="divider" />
    </>
  );
}
