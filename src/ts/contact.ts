import { renderFeatures, Feature } from "./features.js";

const aboutData: Feature[] = [
  {
    id: 1,
    icon: "/src/assets/images/contact_us/icons/location.png",
    title: "Our Location",
    description: "1234 NW Bobcat Lane, St. Robert, MO 65584-5678",
  },
  {
    id: 2,
    icon: "/src/assets/images/contact_us/icons/time.png",
    title: "Operating Time",
    description: "Monday-Friday: 9am-6pm<br> Weekends: 10:30 am - 6pm",
  },
  {
    id: 3,
    icon: "/src/assets/images/contact_us/icons/email.png",
    title: "Our Email",
    description: "best@shop.com<br>info@bestshop.com",
  },
  {
    id: 4,
    icon: "/src/assets/images/contact_us/icons/call.png",
    title: "Call Us",
    description: "(268)142-8413<br>(760)265-2917",
  },
];

const featuresContainer = document.getElementById("company-features");
renderFeatures(featuresContainer, aboutData);

interface ContactFormData {
  name: string;
  email: string;
  topic: string;
  message: string;
}

interface FieldConfig {
  id: keyof ContactFormData;
  label: string;
  type: 'text' | 'email' | 'textarea';
}

const fields: FieldConfig[] = [
  { id: 'name',    label: 'Your Name',          type: 'text'     },
  { id: 'email',   label: 'Your Email Address', type: 'email'    },
  { id: 'topic',   label: 'Topic',              type: 'text'     },
  { id: 'message', label: 'Your Message',       type: 'textarea' },
];

function validateEmail(value: string): string {
  if (!value.trim()) return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value.trim())) return 'Please enter a valid email address.';
  return '';
}

function validateRequired(label: string, value: string): string {
  return value.trim() ? '' : `${label} is required.`;
}

function getFieldError(field: FieldConfig, value: string): string {
  return field.type === 'email'
    ? validateEmail(value)
    : validateRequired(field.label, value);
}

function renderContactForm(container: HTMLElement): void {
  const fieldMarkup = fields
    .map(
      (f) => `
    <div class="contact-form__field" data-field="${f.id}">
      <label class="contact-form__label" for="cf-${f.id}">
        ${f.label} <span>*</span>
      </label>
      ${
        f.type === 'textarea'
          ? `<textarea class="contact-form__textarea" id="cf-${f.id}" name="${f.id}" rows="4"></textarea>`
          : `<input class="contact-form__input" id="cf-${f.id}" name="${f.id}" type="${f.type}" />`
      }
      <span class="contact-form__error" id="cf-${f.id}-error" role="alert"></span>
    </div>`
    )
    .join('');

  container.innerHTML = `
    ${fieldMarkup}
    <p class="contact-form__message" id="cf-status"></p>
    <button class="contact-form__submit" id="cf-submit" type="button">SEND</button>
  `;

  attachValidation(container);
}

function setFieldState(
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  errorEl: HTMLSpanElement,
  error: string
): void {
  const base = inputEl.tagName === 'TEXTAREA' ? 'contact-form__textarea' : 'contact-form__input';
  errorEl.textContent = error;
  inputEl.classList.toggle(`${base}--error`, !!error);
  inputEl.classList.toggle(`${base}--valid`, !error && inputEl.value.trim() !== '');
}

function attachValidation(container: HTMLElement): void {
  fields.forEach((field) => {
    const inputEl = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#cf-${field.id}`);
    const errorEl = container.querySelector<HTMLSpanElement>(`#cf-${field.id}-error`);
    if (!inputEl || !errorEl) return;

    inputEl.addEventListener('blur', () => {
      setFieldState(inputEl, errorEl, getFieldError(field, inputEl.value));
    });

    if (field.type === 'email') {
      inputEl.addEventListener('input', () => {
        if (errorEl.textContent) {
          setFieldState(inputEl, errorEl, validateEmail(inputEl.value));
        }
      });
    }
  });

  container.querySelector<HTMLButtonElement>('#cf-submit')
    ?.addEventListener('click', () => handleSubmit(container));
}

function handleSubmit(container: HTMLElement): void {
  let hasError = false;

  fields.forEach((field) => {
    const inputEl = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#cf-${field.id}`);
    const errorEl = container.querySelector<HTMLSpanElement>(`#cf-${field.id}-error`);
    if (!inputEl || !errorEl) return;

    const error = getFieldError(field, inputEl.value);
    setFieldState(inputEl, errorEl, error);
    if (error) hasError = true;
  });

  const statusEl = container.querySelector<HTMLParagraphElement>('#cf-status');
  if (!statusEl) return;

  if (hasError) {
    showStatus(statusEl, 'Please fix the errors above before submitting.', 'error');
    return;
  }

  resetForm(container);
  showStatus(statusEl, 'Thank you! Your message has been sent successfully.', 'success');
}

function showStatus(el: HTMLParagraphElement, message: string, type: 'success' | 'error'): void {
  el.textContent = message;
  el.className = `contact-form__message contact-form__message--${type}`;
}

function resetForm(container: HTMLElement): void {
  fields.forEach((field) => {
    const inputEl = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#cf-${field.id}`);
    const errorEl = container.querySelector<HTMLSpanElement>(`#cf-${field.id}-error`);
    if (!inputEl || !errorEl) return;

    inputEl.value = '';
    const base = inputEl.tagName === 'TEXTAREA' ? 'contact-form__textarea' : 'contact-form__input';
    inputEl.classList.remove(`${base}--error`, `${base}--valid`);
    errorEl.textContent = '';
  });
}

const contactFormRoot = document.getElementById('contact-form-root');
if (contactFormRoot) renderContactForm(contactFormRoot);