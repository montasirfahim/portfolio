document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const navLinks = document.querySelector('[data-nav-links]');
    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('main section[id]');

    if (window.lucide) lucide.createIcons();

    const roleLine = document.querySelector('[data-roles]');
    if (roleLine) {
        const roles = JSON.parse(roleLine.dataset.roles);
        let roleIndex = 0;
        let characterIndex = roles[0].length;
        let deleting = true;

        const typeRole = () => {
            const targetRole = roles[roleIndex];
            if (deleting) {
                characterIndex -= 1;
                roleLine.textContent = targetRole.slice(0, characterIndex);
                if (characterIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
            } else {
                characterIndex += 1;
                roleLine.textContent = roles[roleIndex].slice(0, characterIndex);
                if (characterIndex === roles[roleIndex].length) {
                    deleting = true;
                    setTimeout(typeRole, 1700);
                    return;
                }
            }
            setTimeout(typeRole, deleting ? 55 : 90);
        };

        setTimeout(typeRole, 1700);
    }

    menuToggle?.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
        lucide.createIcons();
    });

    links.forEach((link) => link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    }));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            const target = Number(counter.dataset.count);
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 45));
            const tick = () => {
                current = Math.min(current + step, target);
                counter.textContent = `${current.toLocaleString()}+`;
                if (current < target) requestAnimationFrame(tick);
            };
            tick();
            observer.unobserve(counter);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));

    const contactForm = document.querySelector('[data-contact-form]');
    const formStatus = document.querySelector('[data-form-status]');
    const submitButton = document.querySelector('[data-submit-button]');

    contactForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        const fields = [...contactForm.querySelectorAll('input, textarea')];
        const invalidFields = fields.filter((field) => !field.value.trim() || (field.type === 'email' && !field.validity.valid));
        fields.forEach((field) => field.classList.toggle('invalid', invalidFields.includes(field)));

        if (invalidFields.length) {
            formStatus.classList.add('error');
            formStatus.textContent = 'Please complete every field with valid information.';
            invalidFields[0].focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.firstChild.textContent = 'Sending... ';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) throw new Error('Message submission failed.');
            formStatus.classList.add('success');
            formStatus.textContent = 'Message sent successfully!';
            contactForm.reset();
            fields.forEach((field) => field.classList.remove('invalid'));
        } catch (error) {
            formStatus.classList.add('error');
            formStatus.textContent = 'Unable to send right now. Please use the direct email button.';
        } finally {
            submitButton.disabled = false;
            submitButton.firstChild.textContent = 'Send message ';
        }
    });
});