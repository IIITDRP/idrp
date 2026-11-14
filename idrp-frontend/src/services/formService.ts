import type {
  FormConfig,
  FormMeta,
  FormSubmitEnvelope,
  FormSubmitResult,
  FormValues,
  FormValue,
} from '@/types/form'
import { submitInquiry, textOrUndefined } from '@/services/inquiryService'

function mapValuesToPayload(
  config: FormConfig,
  values: FormValues,
): Record<string, FormValue> {
  const fields = config.sections.flatMap((section) => section.fields)

  return fields.reduce<Record<string, FormValue>>((acc, field) => {
    const key = field.backendKey ?? field.name
    acc[key] = values[field.name] ?? field.defaultValue ?? null
    return acc
  }, {})
}

export function buildFormPayload(config: FormConfig, values: FormValues): FormSubmitEnvelope {
  const meta: FormMeta = {
    formType: config.type,
    submittedAt: new Date().toISOString(),
    ...(config.meta ?? {}),
  }

  if (config.transformPayload) {
    return config.transformPayload(values, meta)
  }

  return {
    formId: config.id,
    formType: config.type,
    meta,
    data: mapValuesToPayload(config, values),
  }
}

/**
 * Default field names for the inquiry's indexed columns. A form whose fields are named
 * differently (e.g. the partner form's `contactPerson`) maps them via `config.inquiryFields`.
 */
const DEFAULT_INQUIRY_FIELDS = {
  fullName: 'fullName',
  email: 'email',
  phone: 'phone',
  organization: 'organization',
  message: 'message',
  consent: 'consent',
}

export async function submitForm(config: FormConfig, values: FormValues): Promise<FormSubmitResult> {
  const envelope = buildFormPayload(config, values)
  const names = { ...DEFAULT_INQUIRY_FIELDS, ...(config.inquiryFields ?? {}) }
  const pick = (field: string) => textOrUndefined(values[field])

  const { botcheck, ...data } = envelope.data
  const { formType: _formType, submittedAt: _submittedAt, ...meta } = envelope.meta

  return submitInquiry(
    {
      formType: config.type,
      title: config.title,
      sourcePage: typeof meta.sourcePage === 'string' ? meta.sourcePage : undefined,
      fullName: pick(names.fullName) ?? '',
      email: pick(names.email) ?? '',
      phone: pick(names.phone),
      organization: pick(names.organization),
      message: pick(names.message),
      consent: values[names.consent] === true,
      payload: { ...meta, ...data },
      botcheck: typeof botcheck === 'string' ? botcheck : '',
    },
    config.successMessage ?? 'Form submitted successfully.',
  )
}
