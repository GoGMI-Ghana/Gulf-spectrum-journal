// Small, dependency-free helpers for filling in dictionary strings. Pure
// functions (no hooks), so they work the same from Server and Client
// Components.

import { Fragment, type ReactNode } from 'react'
import { intlLocales, type Locale } from './config'

const PLACEHOLDER = /\{(\w+)\}/g

// "Issue {number}" + { number: 3 } -> "Issue 3". Unknown placeholders are
// left as-is so a typo shows up visibly on the page instead of silently
// vanishing.
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(PLACEHOLDER, (match, key: string) => (key in values ? String(values[key]) : match))
}

// Like fmt, but values can be React nodes — for sentences with a link in
// the middle ("{link} to see your bookmarks"), where word order differs
// between languages so the sentence can't just be split around the link.
export function rich(template: string, values: Record<string, ReactNode>): ReactNode {
  const parts = template.split(PLACEHOLDER)
  // split() with a capture group alternates: text, key, text, key, ...
  return parts.map((part, i) => <Fragment key={i}>{i % 2 === 1 && part in values ? values[part] : part}</Fragment>)
}

export interface PluralForms {
  one: string
  other: string
}

// Picks the singular/plural form using the language's own plural rules
// (French treats 0 as singular, English doesn't), then fills in {count}.
export function plural(locale: Locale, forms: PluralForms, count: number): string {
  const category = new Intl.PluralRules(intlLocales[locale]).select(count)
  return fmt(category === 'one' ? forms.one : forms.other, { count })
}

export function formatDate(locale: Locale, value: string | Date, options: Intl.DateTimeFormatOptions): string {
  return new Date(value).toLocaleDateString(intlLocales[locale], options)
}

export function formatNumber(locale: Locale, value: number): string {
  return value.toLocaleString(intlLocales[locale])
}
