"use server";

import { z } from "zod";
import { verifySession } from "@/lib/dal";

/**
 * Draft-description helper for the admin product form. Context: this shop
 * sells generic/símil football gear (no brand licensing, no marketing
 * team) — the person loading products just wants something reasonable to
 * put in the field, not a fabricated sales pitch. The prompt below is
 * built specifically to avoid two failure modes that would actually hurt
 * the shop: (1) inventing technical specs/certifications nobody gave it
 * (misleading buyers about a product), and (2) sounding like generic AI
 * ad copy ("el mejor", "calidad premium") that reads as fake reviews-adjacent
 * puffery. It grounds the draft in whatever real details the admin types
 * into "notes" and falls back to describing *use case* (not invented
 * specs) when there's nothing else to go on.
 */

const InputSchema = z.object({
  name: z.string().min(2, "Escribí el nombre del producto primero."),
  categoryName: z.string().optional(),
  notes: z.string().optional(),
});

export type GenerateDescriptionResult = {
  description?: string;
  error?: string;
};

export async function generateProductDescription(input: {
  name: string;
  categoryName?: string;
  notes?: string;
}): Promise<GenerateDescriptionResult> {
  // Admin-only — same guard every other product Server Action uses. Also
  // keeps the Anthropic API key from being usable by anyone who isn't
  // logged in, even though this function isn't reachable from a public page.
  await verifySession();

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      error:
        "Falta configurar ANTHROPIC_API_KEY en el .env para usar el generador.",
    };
  }

  const { name, categoryName, notes } = parsed.data;

  const prompt = `Escribí una descripción de producto para el catálogo de una tienda de artículos de fútbol amateur en Argentina. Son productos genéricos/símiles vendidos por WhatsApp entre amigos del fútbol 5 — no hay marca licenciada ni equipo de marketing detrás.

Producto: ${name}
${categoryName ? `Categoría: ${categoryName}` : ""}
${
  notes?.trim()
    ? `Datos reales que dio el vendedor (usalos, no agregues otros): ${notes.trim()}`
    : "El vendedor no dio más datos. NO inventes materiales, tecnologías ni certificaciones específicas — describí en términos generales para qué tipo de jugador o partido sirve, a partir solo del nombre y la categoría."
}

Reglas estrictas:
- 2 a 3 oraciones, español rioplatense (voseo: "tenés", "elegís"), tono directo y honesto.
- Nada de superlativos vacíos ("el mejor", "calidad premium", "de primer nivel") ni afirmaciones que no estén respaldadas por los datos de arriba.
- No menciones marcas registradas ni licencias oficiales.
- No afirmes que el producto fue usado por profesionales, tiene certificaciones, o cualquier dato que no te haya dado el vendedor.
- Devolvé SOLO el texto de la descripción — sin comillas, sin encabezados, sin explicaciones.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { error: "ANTHROPIC_API_KEY inválida — revisala en el .env." };
      }
      return { error: `No se pudo generar la descripción (error ${res.status}).` };
    }

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = data.content?.find((block) => block.type === "text")?.text?.trim();

    if (!text) {
      return { error: "La IA no devolvió texto. Probá de nuevo." };
    }

    return { description: text };
  } catch {
    return { error: "Error de conexión al generar la descripción." };
  }
}
