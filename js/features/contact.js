/* ============================================================
   contact.js 
============================================================ */

/* ── Toast helper ── */
function _contactToast(message, type = 'default') {

  if (typeof showToast === 'function') {
    return showToast(message, type);
  }

  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast toast--${type} show`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 4000);
}

/* ── Validate field ── */
function validateContactField(id, errorId, check, message) {

  const input = document.getElementById(id);
  const error = document.getElementById(errorId);

  if (!input) return true;

  const value = input.value.trim();

  if (!check(value)) {
    input.classList.add('error');
    if (error) {
      error.textContent = message;
      error.classList.add('visible');
    }
    return false;
  }

  input.classList.remove('error');
  if (error) error.classList.remove('visible');

  return true;
}

/* ── Clear errors ── */
function clearContactErrors() {

  const form = document.getElementById('contact-form');
  if (!form) return;

  form.querySelectorAll('.form-input').forEach(el =>
    el.classList.remove('error')
  );

  form.querySelectorAll('.form-error').forEach(el => {
    el.classList.remove('visible');
  });
}

/* ── Submit handler ── */
function handleContactSubmit(event) {

  event.preventDefault();
  clearContactErrors();

  const nameOk = validateContactField(
    'contact-name',
    'contact-name-error',
    v => v.length > 0,
    'Please enter your name.'
  );

  const emailOk = validateContactField(
    'contact-email',
    'contact-email-error',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'Please enter a valid email.'
  );

  const subjectOk = validateContactField(
    'contact-subject',
    'contact-subject-error',
    v => v.length > 0,
    'Please select a topic.'
  );

  const messageOk = validateContactField(
    'contact-message',
    'contact-message-error',
    v => v.length >= 10,
    'Message must be at least 10 characters.'
  );

  if (!nameOk || !emailOk || !subjectOk || !messageOk) return;

  _contactToast("Message sent! We'll reply within 24 hours.", 'success');

  event.target.reset();
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
});