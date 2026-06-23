/* ============ PROGRESS BAR ============ */
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrolled / height) * 100 : 0;
  progressBar.style.width = percent + '%';
}

/* ============ HEADER SCROLL STATE ============ */
const header = document.getElementById('header');
function updateHeader() {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}

window.addEventListener('scroll', () => {
  updateProgress();
  updateHeader();
  updateStickyCta();
}, { passive: true });

/* ============ MOBILE MENU ============ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

/* ============ REVEAL ON SCROLL (Intersection Observer) ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger эффект для соседних элементов
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      const idx = Array.from(siblings).indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============ FAQ ACCORDION ============ */
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-item__a');
    const isOpen = item.classList.contains('open');

    // Закрыть все
    document.querySelectorAll('.faq-item').forEach(fi => {
      fi.classList.remove('open');
      fi.querySelector('.faq-item__a').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ============ STICKY CTA ============ */
const stickyCta = document.getElementById('stickyCta');
function updateStickyCta() {
  if (window.scrollY > 600) stickyCta.classList.add('visible');
  else stickyCta.classList.remove('visible');

  // Скрыть в зоне формы
  const contact = document.getElementById('contact');
  if (contact) {
    const rect = contact.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      stickyCta.classList.remove('visible');
    }
  }
}

/* ============ FORM VALIDATION & SUBMIT ============ */
const form = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

function setError(fieldName, message) {
  const field = form.querySelector(`[name="${fieldName}"]`).parentElement;
  const errorEl = form.querySelector(`.form-error[data-for="${fieldName}"]`);
  if (message) {
    field.classList.add('invalid');
    if (errorEl) errorEl.textContent = message;
  } else {
    field.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
  }
}

function validateForm() {
  let valid = true;
  const name = form.name.value.trim();
  const company = form.company.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();

  if (!name || name.length < 2) { setError('name', 'Укажите имя'); valid = false; }
  else setError('name', '');

  if (!company || company.length < 2) { setError('company', 'Укажите компанию'); valid = false; }
  else setError('company', '');

  if (!phone || phone.length < 6) { setError('phone', 'Укажите телефон или Telegram'); valid = false; }
  else setError('phone', '');

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'Некорректный email');
    valid = false;
  } else setError('email', '');

  return valid;
}

// Очистка ошибок при вводе
form.querySelectorAll('input, textarea, select').forEach(el => {
  el.addEventListener('input', () => setError(el.name, ''));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  // Сбор данных
  const data = {
    name: form.name.value.trim(),
    company: form.company.value.trim(),
    position: form.position.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    product: form.product.value,
    task: form.task.value.trim(),
    source: 'website',
    timestamp: new Date().toISOString()
  };

  try {
    // Здесь можно подключить реальный endpoint: Telegram Webhook, Bitrix24, amoCRM, HubSpot
    // await fetch('/api/lead', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });

    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1200));

    formStatus.className = 'form-status success';
    formStatus.textContent = '✓ Заявка отправлена. Мы свяжемся с вами в течение 2 часов.';
    form.reset();

    console.log('Lead data:', data);
  } catch (err) {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'Ошибка отправки. Попробуйте ещё раз или напишите в Telegram.';
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

/* ============ SMOOTH SCROLL для якорей ============ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============ INIT ============ */
updateProgress();
updateHeader();