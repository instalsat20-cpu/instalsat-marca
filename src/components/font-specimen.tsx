"use client";

import { useState } from "react";
import { weightValue } from "@/lib/font-weights";

const ALPHABET =
  "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz";
const NUMBERS = "0 1 2 3 4 5 6 7 8 9 ! @ # $ % & ( ) _ +";

function googleFontsHref(family: string, weights: string[]) {
  const encoded = family.trim().replace(/\s+/g, "+");
  const values = Array.from(new Set(weights.map(weightValue))).sort((a, b) => a - b);
  const wght = values.length > 0 ? values.join(";") : "300;400;500;600";
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${wght}&display=swap`;
}

type WeightRow = {
  name: string;
  value: number;
  demoText: string;
  demoClassName: string;
};

export function FontSpecimen({
  family,
  weightNames,
  manifestoExcerpt,
}: {
  family: string;
  weightNames: string[];
  manifestoExcerpt: string;
}) {
  const [liveText, setLiveText] = useState("");

  const rows: WeightRow[] = weightNames
    .map((name) => {
      const key = name.trim().toLowerCase();
      if (key === "semibold" || key === "semi bold") {
        return {
          name,
          value: weightValue(name),
          demoText: "A empresa que fica.",
          demoClassName: "text-3xl",
        };
      }
      if (key === "medium") {
        return {
          name,
          value: weightValue(name),
          demoText: "Para que o essencial nunca pare.",
          demoClassName: "text-xl",
        };
      }
      if (key === "regular" || key === "normal") {
        return {
          name,
          value: weightValue(name),
          demoText: manifestoExcerpt,
          demoClassName: "text-base leading-relaxed",
        };
      }
      if (key === "light") {
        return {
          name,
          value: weightValue(name),
          demoText: `${family} Light · Textos de apoio e legendas`,
          demoClassName: "text-sm text-bruma-light/60",
        };
      }
      return {
        name,
        value: weightValue(name),
        demoText: `Aa Bb Cc — ${family} ${name}`,
        demoClassName: "text-base",
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div>
      <link rel="stylesheet" href={googleFontsHref(family, weightNames)} />

      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.name} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
            <p className="w-40 shrink-0 text-xs font-medium tracking-wide text-bruma-light/40">
              {row.name} — {row.value}
            </p>
            <p
              className={`text-bruma-light ${row.demoClassName}`}
              style={{ fontFamily: `'${family}', sans-serif`, fontWeight: row.value }}
            >
              {row.demoText}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-4">
        <p
          className="text-lg text-bruma-light"
          style={{ fontFamily: `'${family}', sans-serif`, fontWeight: 400 }}
        >
          {ALPHABET}
        </p>
        <p
          className="text-lg text-bruma-light/70"
          style={{ fontFamily: `'${family}', sans-serif`, fontWeight: 400 }}
        >
          {NUMBERS}
        </p>
      </div>

      <div className="mt-4">
        <input
          value={liveText}
          onChange={(e) => setLiveText(e.target.value)}
          placeholder="Digite algo para testar a fonte..."
          className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-3 text-lg text-bruma-light outline-none placeholder:text-bruma-light/30 focus:border-bruma-light/25"
          style={{ fontFamily: `'${family}', sans-serif`, fontWeight: 400 }}
        />
      </div>
    </div>
  );
}
