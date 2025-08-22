export function buildTimeOptions() {
  const opts = [];
  let h = 9, m = 0;
  for (let i = 0; i <= 21 * 2; i++) {
    const hh = ((h + 11) % 12) + 1;
    const ampm = h >= 12 ? "pm" : "am";
    const mm = m.toString().padStart(2, "0");
    opts.push(`${hh}:${mm} ${ampm}`);
    m += 30; if (m === 60) { m = 0; h = (h + 1) % 24; }
  }
  return opts;
}
