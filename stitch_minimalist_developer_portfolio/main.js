/*
  Julián Velasco Portfolio — Interactivity
*/

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar   = document.getElementById('navbar');

    // ── Navbar scroll shadow ──
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ── Smooth scroll ──
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const top = target.getBoundingClientRect().top + window.scrollY - 65;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ── Active nav + fade-in on scroll ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '-60px 0px 0px 0px' });

    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // ── Project card tilt ──
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
            card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── Contact form → Formspree ──
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;

            btn.innerHTML = '⏳ Enviando...';
            btn.disabled = true;

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    btn.innerHTML = '✅ ¡Mensaje enviado!';
                    form.reset();
                    setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 4000);
                } else {
                    throw new Error('Error al enviar');
                }
            } catch {
                btn.innerHTML = '❌ Error, intenta de nuevo';
                btn.disabled = false;
                setTimeout(() => { btn.innerHTML = original; }, 3000);
            }
        });
    }

    // ── Lightbox Logic ──
    const lightbox = document.getElementById('projectLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');

    const openLightbox = (imgSrc) => {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    document.querySelectorAll('.project-overlay-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = link.closest('.project-card');
            const img = card.querySelector('.project-img');
            if (img) openLightbox(img.src);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
});
