"use client"

import React, { useEffect } from "react"

type PartialRecord<K extends string, T> = Partial<Record<K, T>>

type ThemeKeys =
  | "primary"
  | "secondary"
  | "tertiary"
  | "highlight"
  | "lowlight"
  | "lowestlight"
  | "peach"
  | "yellow"
  | "background"
  | "foreground"

const defaultTheme: Record<ThemeKeys, string> = {
  primary: "#333647",
  secondary: "#252734",
  tertiary: "#555a77",
  highlight: "#39BB9A",
  lowlight: "#1b6452",
  lowestlight: "#034a43",
  peach: "#F4876E",
  yellow: "#FFC12A",
  background: "#ffffff",
  foreground: "#171717",
}

function readEnvOverrides(): PartialRecord<ThemeKeys, string> {
  const env = typeof process !== "undefined" ? process.env : undefined
  if (!env) return {}
  const candidates: PartialRecord<ThemeKeys, string> = {
    primary: env.NEXT_PUBLIC_BRAND_PRIMARY,
    secondary: env.NEXT_PUBLIC_BRAND_SECONDARY,
    tertiary: env.NEXT_PUBLIC_BRAND_TERTIARY,
    highlight: env.NEXT_PUBLIC_BRAND_HIGHLIGHT,
    lowlight: env.NEXT_PUBLIC_BRAND_LOWLIGHT,
    lowestlight: env.NEXT_PUBLIC_BRAND_LOWESTLIGHT,
    peach: env.NEXT_PUBLIC_BRAND_PEACH,
    yellow: env.NEXT_PUBLIC_BRAND_YELLOW,
    background: env.NEXT_PUBLIC_BRAND_BACKGROUND,
    foreground: env.NEXT_PUBLIC_BRAND_FOREGROUND,
  }
  const filtered: PartialRecord<ThemeKeys, string> = {}
  Object.entries(candidates).forEach(([k, v]) => {
    if (typeof v === 'string') {
      const trimmed = v.trim()
      if (trimmed !== '' && trimmed.toLowerCase() !== 'undefined' && trimmed.toLowerCase() !== 'null') {
        filtered[k as ThemeKeys] = trimmed
      }
    }
  })
  return filtered
}

function mergeThemes(
  ...parts: Array<PartialRecord<ThemeKeys, string> | undefined>
): Record<ThemeKeys, string> {
  const result: Record<ThemeKeys, string> = { ...defaultTheme }
  for (const part of parts) {
    if (!part) continue
    Object.entries(part).forEach(([k, v]) => {
      if (typeof v === 'string') {
        const trimmed = v.trim()
        if (trimmed !== '' && trimmed.toLowerCase() !== 'undefined' && trimmed.toLowerCase() !== 'null') {
          result[k as ThemeKeys] = trimmed
        }
      } else if (typeof v === 'number') {
        // allow numeric values if ever used
        result[k as ThemeKeys] = v
      }
    })
  }
  return result
}

export const ThemeProvider: React.FC<{ children: React.ReactNode; theme?: PartialRecord<ThemeKeys, string> }> = ({ children, theme }) => {
  useEffect(() => {
    const root = document.documentElement

    function apply(themeObj: PartialRecord<ThemeKeys, string>) {
      const env = readEnvOverrides()
      const storedRaw = typeof window !== 'undefined' ? window.localStorage.getItem('eventseats_theme') : null
      let stored: PartialRecord<ThemeKeys, string> = {}
      try {
        stored = storedRaw ? (JSON.parse(storedRaw) as PartialRecord<ThemeKeys, string>) : {}
      } catch {
        stored = {}
      }
      const merged = mergeThemes(env, stored, themeObj)

      const setVar = (name: ThemeKeys, value: string | undefined) => {
        if (typeof value === 'string' && value.trim() !== '') {
          root.style.setProperty(`--${name}`, value)
        }
      }
      setVar('primary', merged.primary)
      setVar('secondary', merged.secondary)
      setVar('tertiary', merged.tertiary)
      setVar('highlight', merged.highlight)
      setVar('lowlight', merged.lowlight)
      setVar('lowestlight', merged.lowestlight)
      setVar('peach', merged.peach)
      setVar('yellow', merged.yellow)
      setVar('background', merged.background)
      setVar('foreground', merged.foreground)
    }

    apply(theme)

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'eventseats_theme') {
        apply(theme)
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [theme])

  return <>{children}</>
}


