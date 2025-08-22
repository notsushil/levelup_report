export default function Button({ children, variant="solid", ...props }){
  const className = variant==="ghost" ? "btn ghost" : variant==="gradient" ? "btn gradient" : "btn";
  return <button className={className} {...props}>{children}</button>;
}
