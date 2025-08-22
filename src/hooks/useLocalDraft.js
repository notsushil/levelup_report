import { useState, useEffect, useCallback } from "react";
import { LSK } from "../lib/constants.js";

export function useLocalDraft({ defaultRows, defaultRoster, defaultLogs }){
  const [rows, setRows] = useState(defaultRows);
  const [roster, setRoster] = useState(defaultRoster);
  const [logs, setLogs] = useState(defaultLogs);
  const [jackpots, setJackpots] = useState({});

  useEffect(()=>{
    const saved = localStorage.getItem(LSK.REPORT);
    if(!saved) return;
    try{
      const p = JSON.parse(saved);
      if (Array.isArray(p)) return;
      setRows(p.rows ?? defaultRows);
      setRoster(p.roster ?? defaultRoster);
      setLogs(p.logs ?? defaultLogs);
      setJackpots(p.jackpots ?? {});
    }catch{}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDraft = useCallback(()=>{
    localStorage.setItem(LSK.REPORT, JSON.stringify({ rows, roster, logs, jackpots }));
    alert("Draft saved locally.");
  }, [rows, roster, logs, jackpots]);

  const clearDraft = useCallback(()=>{
    localStorage.removeItem(LSK.REPORT);
    alert("Local draft cleared.");
  }, []);

  return { rows, setRows, roster, setRoster, logs, setLogs, jackpots, setJackpots, saveDraft, clearDraft };
}
