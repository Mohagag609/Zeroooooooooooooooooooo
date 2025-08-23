import { Decimal } from "@prisma/client/runtime/library";

type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue };

export function toPlain<T>(val: T): T {
  return deep(val) as T;

  function deep(v: any): JSONValue {
    if (v === null || v === undefined) return v as any;
    if (typeof v === "bigint") return Number(v);
    if (typeof v === "number" || typeof v === "string" || typeof v === "boolean") return v;
    if (v instanceof Date) return v.toISOString();
    // Prisma Decimal
    if (typeof v === "object" && v !== null && typeof v.toNumber === "function" && Decimal.isDecimal?.(v)) {
      try { return Number(v.toNumber()); } catch { return Number(v); }
    }
    if (Array.isArray(v)) return v.map(deep) as any;
    if (typeof v === "object") {
      const out: Record<string, JSONValue> = {};
      for (const k of Object.keys(v)) out[k] = deep(v[k]);
      return out as any;
    }
    return v;
  }
}