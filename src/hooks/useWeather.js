import { useEffect, useState } from "react";

export function useWeather(cityQuery){
  const [weather, setWeather] = useState(null);

  useEffect(()=>{
    const key = import.meta.env?.VITE_OWM_KEY;
    if (!key || key.startsWith("YOUR_")) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&units=metric&appid=${key}`)
      .then(r=>r.json())
      .then(d=>{ if(d && d.main) setWeather({ temp: Math.round(d.main.temp), desc: d.weather?.[0]?.description ?? "" }); })
      .catch(()=>{});
  }, [cityQuery]);

  return weather;
}
