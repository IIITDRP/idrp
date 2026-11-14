/**
 * LEAD CAPTURE: database first, Web3Forms as fallback
 * ---------------------------------------------------------------------
 * Every public form ends up here. Submissions go to POST /api/inquiries, where they are
 * stored and appear in the admin "Inquiries" inbox (PRD CT-08).
 *
 * Web3Forms (e-mail relay) is used ONLY when the backend cannot take the submission:
 * network failure, a 5xx, or a missing endpoint. A 400 (validation) or 429 (rate
 * limit) is a real answer from our server and is shown to the user instead - falling
 * back there would just bypass our own validation and spam protection.
 */
import { API_BASE_URL, buildRateLimitMessage } from '@/services/httpClient'
import type { FormSubmitResult, FormType } from '@/types/form'

export type InquiryFormType = FormType | 'job-application'

export type InquiryInput = {
  formType: InquiryFormType
  /** Short human label used in the fallback e-mail subject, e.g. "Contact Us". */
  title?: string
  sourcePage?: string
  fullName: string
  email: string
  phone?: string
  organization?: string
  message?: string
  consent: boolean
  /** Every field the form collected (stored verbatim for the admin). */
  payload: Record<string, unknown>
  botcheck?: string
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const DIRECT_CONTACT_EMAIL = 'enquiry_idrp@iiitdwd.ac.in'

const BACKEND_ENABLED = import.meta.env.VITE_CONTENT_SOURCE !== 'static'

class BackendUnavailableError extends Error {}

function textOrUndefined(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  const text = Array.isArray(value) ? value.join(', ') : String(value)
  return text.trim() ? text.trim() : undefined
}

async function postToBackend(input: InquiryInput): Promise<void> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        formType: input.formType,
        sourcePage: input.sourcePage ?? window.location.pathname,
        fullName: input.fullName.trim(),
        email: input.email.trim(),
        phone: textOrUndefined(input.phone),
        organization: textOrUndefined(input.organization),
        message: textOrUndefined(input.message),
        consent: input.consent,
        payload: input.payload,
        botcheck: input.botcheck ?? '',
      }),
    })
  } catch {
    throw new BackendUnavailableError('network')
  }

  if (response.ok) return

  if (response.status === 429) {
    throw new Error(buildRateLimitMessage(response))
  }
  if (response.status >= 500 || response.status === 404 || response.status === 405) {
    throw new BackendUnavailableError(String(response.status))
  }

  const body = await response.json().catch(() => null)
  throw new Error(body?.message || 'Please check the form and try again.')
}

async function postToWeb3Forms(input: InquiryInput): Promise<void> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  if (!accessKey) {
    throw new Error(
      `We could not send your message right now. Please try again shortly or e-mail ${DIRECT_CONTACT_EMAIL}.`,
    )
  }

  const fields: Record<string, string | boolean> = {
    access_key: accessKey,
    subject: `[IDRP] ${input.formType} - ${input.title ?? 'Form submission'}`,
    from_name: 'IDRP Website',
    botcheck: input.botcheck ?? '',
    form_type: input.formType,
    source_page: input.sourcePage ?? window.location.pathname,
    name: input.fullName,
    email: input.email,
  }
  for (const [key, value] of Object.entries(input.payload)) {
    if (key === 'botcheck' || key === 'access_key') continue
    const text = textOrUndefined(value)
    if (text !== undefined) fields[key] = text
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(fields),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || result?.success === false) {
    throw new Error(
      `We could not send your message right now. Please try again shortly or e-mail ${DIRECT_CONTACT_EMAIL}.`,
    )
  }
}

/** Submits one inquiry; never throws. */
export async function submitInquiry(
  input: InquiryInput,
  successMessage = 'Thank you - your submission has been received.',
): Promise<FormSubmitResult> {
  try {
    if (BACKEND_ENABLED) {
      try {
        await postToBackend(input)
        return { success: true, message: successMessage }
      } catch (error) {
        if (!(error instanceof BackendUnavailableError)) throw error
        console.warn('[inquiry] backend unavailable, falling back to Web3Forms:', error.message)
      }
    }
    await postToWeb3Forms(input)
    return { success: true, message: successMessage }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong while submitting the form.',
    }
  }
}

export { textOrUndefined }
