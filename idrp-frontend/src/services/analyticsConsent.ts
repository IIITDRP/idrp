/**
 * Consent-gated analytics (PRD privacy NFR, DPDP Act 2023).
 * Microsoft Clarity session replay is loaded only after the visitor explicitly accepts,
 * never on the admin panel, and never again once they decline or withdraw consent.
 */
import { ref } from 'vue'

type Choice = 'granted' | 'denied'

const STORAGE_KEY = 'idrp_analytics_consent'
const CONSENT_VERSION = '2026-11'
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID ?? 'w7wtk63nfq'

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { choice?: Choice; version?: string }
    return parsed.version === CONSENT_VERSION && parsed.choice ? parsed.choice : null
  } catch {
    return null
  }
}

/** The visitor's current answer, or null when we still need to ask. */
export const consentChoice = ref<Choice | null>(readChoice())
/** Whether the banner is showing (first visit, or reopened from "Cookie settings"). */
export const consentBannerOpen = ref(consentChoice.value === null)

let clarityLoaded = false

function isAdminPage() {
  return window.location.pathname.startsWith('/admin')
}

function loadClarity() {
  if (clarityLoaded || !CLARITY_PROJECT_ID || isAdminPage()) return
  clarityLoaded = true
  const w = window as unknown as { clarity?: ((...args: unknown[]) => void) & { q?: unknown[] } }
  w.clarity =
    w.clarity ||
    function (...args: unknown[]) {
      ;(w.clarity!.q = w.clarity!.q || []).push(args)
    }
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`
  document.head.appendChild(script)
}

export function setConsent(choice: Choice) {
  const previous = consentChoice.value
  consentChoice.value = choice
  consentBannerOpen.value = false
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, version: CONSENT_VERSION, at: new Date().toISOString() }))
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  if (choice === 'granted') {
    loadClarity()
  } else if (previous === 'granted' && clarityLoaded) {
    // Withdrawal: a loaded tracker can't be unloaded, so reload into a clean page.
    window.location.reload()
  }
}

export function openConsentSettings() {
  consentBannerOpen.value = true
}

/** Call once at startup: re-applies a previous "granted" choice. */
export function initAnalytics() {
  if (consentChoice.value === 'granted') {
    loadClarity()
  }
}
