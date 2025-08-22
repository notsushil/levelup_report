import RosterCard from "./RosterCard.jsx";

export default function RosterSection({ roster, onUpdateRoster, onUpdateSecurity }){
  return (
    <div className="rosterGrid">
      <RosterCard
        title="Managers"
        rows={[
          { key:"man-open",  label:"open",  value:roster.managers.open.names,  onChange:v=>onUpdateRoster("managers","open",v) },
          { key:"man-mid",   label:"mid",   value:roster.managers.mid.names,   onChange:v=>onUpdateRoster("managers","mid",v) },
          { key:"man-close", label:"close", value:roster.managers.close.names, onChange:v=>onUpdateRoster("managers","close",v) },
        ]}
      />
      <RosterCard
        title="Staffs"
        rows={[
          { key:"stf-open",  label:"open",  value:roster.staffs.open.names,  onChange:v=>onUpdateRoster("staffs","open",v) },
          { key:"stf-mid",   label:"mid",   value:roster.staffs.mid.names,   onChange:v=>onUpdateRoster("staffs","mid",v) },
          { key:"stf-close", label:"close", value:roster.staffs.close.names, onChange:v=>onUpdateRoster("staffs","close",v) },
        ]}
      />
      <div className="rosterCard">
        <h3>Security on Duty</h3>
        <div className="row">
          <div style={{minWidth:80}}>Shift</div>
          <input placeholder="Name" value={roster.security.shift} onChange={e=>onUpdateSecurity("shift", e.target.value)} />
        </div>
        <div className="row" style={{marginTop:8}}>
          <div style={{minWidth:80}}>Names</div>
          <input placeholder="Name" value={roster.security.names} onChange={e=>onUpdateSecurity("names", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
