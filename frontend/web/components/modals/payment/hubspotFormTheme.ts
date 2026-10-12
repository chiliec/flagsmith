// HubSpot renders the form in a same-origin iframe, out of reach of our
// stylesheets, so the tokens it needs are copied in and its styles overridden.
const TOKENS = [
  '--color-text-default',
  '--color-text-secondary',
  '--color-text-tertiary',
  '--color-text-action',
  '--color-text-danger',
  '--color-surface-default',
  '--color-surface-action',
  '--color-surface-action-hover',
  '--color-border-default',
  '--color-border-action',
]

const STYLE_ID = 'flagsmith-theme'

// !important beats HubSpot's own rules and the inline colours in its heading.
const CSS = `
body { background: transparent !important; }
.hs-form,
.hs-form label:not(.hs-error-msg),
.hs-form .hs-richtext,
.hs-form .hs-richtext *,
.hs-form .hs-main-font-element { color: var(--color-text-default) !important; }
.hs-form .hs-field-desc,
.hs-form .legal-consent-container,
.hs-form .legal-consent-container * { color: var(--color-text-secondary) !important; }
.hs-form a { color: var(--color-text-action) !important; }
.hs-form .hs-input {
  background-color: var(--color-surface-default) !important;
  border-color: var(--color-border-default) !important;
  color: var(--color-text-default) !important;
}
.hs-form .hs-input:focus { border-color: var(--color-border-action) !important; }
.hs-form .hs-input::placeholder { color: var(--color-text-tertiary) !important; }
.hs-form .hs-error-msg,
.hs-form .hs-form-required { color: var(--color-text-danger) !important; }
.hs-form .hs-button {
  background-color: var(--color-surface-action) !important;
  border-color: var(--color-surface-action) !important;
  color: white !important;
}
.hs-form .hs-button:hover { background-color: var(--color-surface-action-hover) !important; }
`

// Run again on a theme change: the copied values don't follow the page.
export const applyFormTheme = (form: HTMLFormElement) => {
  const doc = form.ownerDocument
  if (!doc.getElementById(STYLE_ID)) {
    const style = doc.createElement('style')
    style.id = STYLE_ID
    style.textContent = CSS
    doc.head.appendChild(style)
  }
  // Read from body, which carries the .dark class.
  const page = getComputedStyle(document.body)
  TOKENS.forEach((token) =>
    doc.documentElement.style.setProperty(
      token,
      page.getPropertyValue(token).trim(),
    ),
  )
}
