export default function JackpotRow({ editing, name, amount, onName, onAmount, onBlur }){
  return (
    <div className="jItem">
      <div className="jName">
        {!editing ? name : (
          <input className="editField" value={name} onChange={e=>onName(e.target.value)} />
        )}
      </div>
      <div className="jAmount">
        {!editing ? (
          <input placeholder="$" value={amount} onChange={e=>onAmount(e.target.value)} onBlur={onBlur} />
        ) : (
          <input disabled placeholder="$ (disabled while editing names)" />
        )}
      </div>
    </div>
  );
}
