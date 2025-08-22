export default function Header({ sydDate, weather }){
  return (
    <>
      <h1>LevelUP Shift Report</h1>
      <div className="info">
        <div className="infoCard">{sydDate || "Sydney date loading…"}</div>
        <div className="infoCard">
          Weather in Granville:&nbsp;
          {weather ? (<><b>{weather.temp}°C</b>&nbsp;— {weather.desc}</>) : "—"}
        </div>
      </div>
      <div className="divider" />
    </>
  );
}
