/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin, no trailing slash. Empty = same origin (production behind nginx). */
  readonly VITE_API_BASE_URL?: string
  /** 'static' skips the API entirely and serves only the bundled src/data snapshot. */
  readonly VITE_CONTENT_SOURCE?: 'api' | 'static'
  /** Public site origin used for canonical URLs, OpenGraph and the sitemap. */
  readonly VITE_SITE_URL?: string
  /** Web3Forms key, used only when the backend cannot accept a form submission. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
  /** Microsoft Clarity project id; loaded only after analytics consent. */
  readonly VITE_CLARITY_PROJECT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
