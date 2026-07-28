// Turn a FastAPI OpenAPI doc into simple form-field specs, so every tool's form
// is generated from the live API and can never drift out of sync with it.

import type { OpenApiDoc, OpenApiProp } from "./api";

export type FieldKind = "text" | "textarea" | "number" | "boolean" | "select" | "list";

export interface Field {
  name: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  options?: string[];
  def?: string | number | boolean;
}

// Fields we never want to show in a UI (session ids, opaque blobs, nested
// conversation/profile objects the tool fills itself).
const HIDDEN = /^(session_id|profile|messages|conversation|history|context)$/i;

function unwrap(prop: OpenApiProp): OpenApiProp {
  // FastAPI renders Optional[T] as anyOf[T, null]; pick the non-null branch.
  if (prop.anyOf && prop.anyOf.length) {
    const real = prop.anyOf.find((p) => p.type && p.type !== "null");
    if (real) return { ...real, default: prop.default, title: prop.title };
  }
  return prop;
}

function toField(name: string, rawProp: OpenApiProp, required: boolean): Field | null {
  if (HIDDEN.test(name)) return null;
  const prop = unwrap(rawProp);
  const label = prettify(prop.title || name);
  const def = prop.default as string | number | boolean | undefined;

  if (prop.enum && prop.enum.length) {
    return { name, label, kind: "select", required, options: prop.enum, def: def ?? prop.enum[0] };
  }
  if (prop.type === "integer" || prop.type === "number") {
    return { name, label, kind: "number", required, def: typeof def === "number" ? def : undefined };
  }
  if (prop.type === "boolean") {
    return { name, label, kind: "boolean", required, def: Boolean(def) };
  }
  if (prop.type === "array") {
    const items = prop.items ? unwrap(prop.items) : undefined;
    // array of objects is too complex for a generic form — skip it
    if (items && items.type === "object") return null;
    return { name, label, kind: "list", required };
  }
  if (prop.type === "object") return null; // nested object — skip
  // default: string. Long-ish text fields get a textarea.
  const longish = /(text|description|message|content|resume|jd|about|prompt|transcript|body|concept)/i.test(name);
  return { name, label, kind: longish ? "textarea" : "text", required, def: typeof def === "string" ? def : undefined };
}

/** Extract the ordered field list for one POST path. */
export function fieldsFor(doc: OpenApiDoc, path: string): Field[] {
  const post = doc.paths?.[path]?.post as
    | { requestBody?: { content?: { "application/json"?: { schema?: { $ref?: string } } } } }
    | undefined;
  const ref = post?.requestBody?.content?.["application/json"]?.schema?.$ref;
  if (!ref) return [];
  const schemaName = ref.split("/").pop() as string;
  const schema = doc.components?.schemas?.[schemaName];
  if (!schema?.properties) return [];
  const required = new Set(schema.required ?? []);
  const out: Field[] = [];
  for (const [name, prop] of Object.entries(schema.properties)) {
    const f = toField(name, prop, required.has(name));
    if (f) out.push(f);
  }
  return out;
}

/** Serialise a filled form to the request body the backend expects. */
export function buildBody(fields: Field[], values: Record<string, string>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = (values[f.name] ?? "").toString();
    if (f.kind === "number") body[f.name] = raw === "" ? undefined : Number(raw);
    else if (f.kind === "boolean") body[f.name] = raw === "true";
    else if (f.kind === "list") body[f.name] = raw ? raw.split(/\n+/).map((s) => s.trim()).filter(Boolean) : [];
    else body[f.name] = raw;
  }
  return body;
}

function prettify(s: string): string {
  return s
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bJd\b/i, "JD")
    .replace(/\bAts\b/i, "ATS")
    .replace(/\bUrl\b/i, "URL")
    .replace(/\bId\b/i, "ID");
}
