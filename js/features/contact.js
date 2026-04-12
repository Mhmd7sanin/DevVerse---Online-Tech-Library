/* ============================================================
   contact.js — Logic for pages/contact.html
   Dependencies (loaded before this file):
     - storage.js  → getCurrentUser() (used by navbar.js)
     - navbar.js   → renders nav state, provides showToast()
   Note: when auth.js is complete, the contact handler can
         be migrated there. This file stays as the entry point
         for contact.html either way.
   ============================================================ */

/* ── Toast helper ──
   navbar.js is expected to expose showToast() globally.
   This fallback fires only if navbar.js hasn't loaded yet. */
function _contactToast(message, type) {
  type = type || 'default';
  if (typeof showToast === 'function') {
    return showToast(message, type);
  }
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast toast--' + type + ' show';
  setTimeout(function () { toast.className = 'toast'; }, 4000);
}

/* ── Validate one field — returns true if valid ── */
function validateContactField(id, errorId, check, message) {
  var input = document.getElementById(id);
  var error = document.getElementById(errorId);
  if (!input) return true;
  if (!check(input.value.trim())) {
    input.classList.add('error');
    if (error) { error.textContent = message; error.classList.add('visible'); }
    return false;
  }
  input.classList.remove('error');
  if (error) error.classList.remove('visible');
  return true;
}

/* ── Clear all field errors ── */
function clearContactErrors() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.querySelectorAll('.form-input').forEach(function (el) { el.classList.remove('error'); });
  form.querySelectorAll('.form-error').forEach(function (el) { el.classList.remove('visible'); });
}

/* ── Main submit handler ── */
function handleContactSubmit(event) {
  event.preventDefault();
  clearContactErrors();

  var nameOk    = validateContactField('contact-name',    'contact-name-error',    function (v) { return v.length > 0; },       'Please enter your name.');
  var emailOk   = validateContactField('contact-email',   'contact-email-error',   function (v) { return v.includes('@'); },    'Please enter a valid email.');
  var subjectOk = validateContactField('contact-subject', 'contact-subject-error', function (v) { return v.length > 0; },       'Please select a topic.');
  var messageOk = validateContactField('contact-message', 'contact-message-error', function (v) { return v.length >= 10; },     'Message must be at least 10 characters.');

  if (!nameOk || !emailOk || !subjectOk || !messageOk) return;

  _contactToast("Message sent! We'll reply within 24 hours.", 'success');
  event.target.reset();
}

/* ── Attach listener ── */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', handleContactSubmit);
});
