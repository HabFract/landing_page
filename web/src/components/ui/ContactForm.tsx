import { type FormEvent, useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Props {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitText: string;
  successMessage: string;
  errorMessage: string;
}

export default function ContactForm({
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitText,
  successMessage,
  errorMessage,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('loading');

    try {
      const form = e.target as HTMLFormElement;
      const formDataObj = new FormData(form);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (_error) {
      setStatus('error');
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {/* Web3Forms Access Key */}
      <input type="hidden" name="access_key" value={import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY} />

      {/* Honeypot Spam Protection */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

      <div className="contact-form__field">
        <label htmlFor="name" className="contact-form__label">
          {nameLabel}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`contact-form__input ${errors.name ? 'contact-form__input--error' : ''}`}
          placeholder={namePlaceholder}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="contact-form__error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor="email" className="contact-form__label">
          {emailLabel}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`contact-form__input ${errors.email ? 'contact-form__input--error' : ''}`}
          placeholder={emailPlaceholder}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="contact-form__error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor="message" className="contact-form__label">
          {messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          className={`contact-form__textarea ${errors.message ? 'contact-form__input--error' : ''}`}
          placeholder={messagePlaceholder}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          required
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span id="message-error" className="contact-form__error">
            {errors.message}
          </span>
        )}
      </div>

      <button type="submit" className="contact-form__submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : submitText}
      </button>

      {status === 'success' && (
        <div className="contact-form__message contact-form__message--success">{successMessage}</div>
      )}

      {status === 'error' && (
        <div className="contact-form__message contact-form__message--error">{errorMessage}</div>
      )}
    </form>
  );
}
