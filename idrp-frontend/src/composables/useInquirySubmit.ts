import { ref } from 'vue'
import { submitInquiry, type InquiryInput } from '@/services/inquiryService'

/**
 * Submit state for the hand-built forms (matchmaking, job applications) that don't use
 * the config-driven BaseForm. Same submitting/submitted/errorMessage shape as useForm.
 */
export function useInquirySubmit(options?: { successDurationMs?: number }) {
  const submitting = ref(false)
  const submitted = ref(false)
  const errorMessage = ref('')

  async function submit(input: InquiryInput, onSuccess: () => void) {
    if (submitting.value) return

    submitting.value = true
    errorMessage.value = ''
    submitted.value = false

    try {
      const result = await submitInquiry(input)
      if (!result.success) {
        errorMessage.value = result.message
        return
      }

      onSuccess()
      submitted.value = true
      window.setTimeout(() => {
        submitted.value = false
      }, options?.successDurationMs ?? 6000)
    } finally {
      submitting.value = false
    }
  }

  return { submitting, submitted, errorMessage, submit }
}
