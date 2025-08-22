export default function Chip({ children }){
  return <span style={{display:"inline-flex", gap:6, alignItems:"center", padding:"6px 10px", borderRadius:999, background:"var(--chip)", border:"1px solid var(--line)", margin:2}}>{children}</span>;
}
