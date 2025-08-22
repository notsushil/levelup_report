export default function EthnicityRow({ editing, label, onChange, onRemove }){
  return (
    <div className="jItem">
      <div className="jName">
        {!editing ? label : <input className="editField" value={label} onChange={e=>onChange(e.target.value)} />}
      </div>
      <div className="jAmount">
        {!editing ? (
          <input disabled placeholder="(used in VIP editor)" />
        ) : (
          <div className="editBar">
            <button className="btn ghost" onClick={onRemove}>Remove</button>
          </div>
        )}
      </div>
    </div>
  );
}
