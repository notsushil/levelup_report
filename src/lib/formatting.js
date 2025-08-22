export const moneyFmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
export const numFmt   = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
export const toMoney  = n => Number.isFinite(n) ? `$${moneyFmt.format(n)}` : "";
export const parseMoney = v => Number(String(v ?? "").replace(/[^0-9.\-]/g, "")) || 0;
