/* ==========================================================================
   Abdullah Khalifa Portfolio - Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Safe localStorage access (can throw in private mode / blocked storage)
    const storage = {
        get(key) {
            try { return localStorage.getItem(key); } catch (e) { return null; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
        }
    };

    // --------------------------------------------------------------------------
    // Theme Toggle Logic (Dark default / Light)
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyTheme(isLight) {
        document.body.classList.toggle('light-theme', isLight);
        if (themeToggleBtn) {
            themeToggleBtn.querySelector('i').className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        }
        if (themeMeta) {
            themeMeta.setAttribute('content', isLight ? '#F4F6FB' : '#010736');
        }
    }

    applyTheme(storage.get('theme') === 'light');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = !document.body.classList.contains('light-theme');
            applyTheme(isLight);
            storage.set('theme', isLight ? 'light' : 'dark');
        });
    }

    // --------------------------------------------------------------------------
    // Scroll Progress Bar, Sticky Header, Active Link & Back-to-Top
    // --------------------------------------------------------------------------
    const scrollBar = document.getElementById('scroll-bar');
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        const y = window.scrollY;

        navbar.classList.toggle('scrolled', y > 40);

        if (scrollBar) {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (documentHeight > 0) {
                scrollBar.style.width = `${(y / documentHeight) * 100}%`;
            }
        }

        let currentSectionId = '';
        sections.forEach(section => {
            if (y >= section.offsetTop - 250) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
        });

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('show', y > 400);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    // --------------------------------------------------------------------------
    // Mobile Navigation Drawer Toggle
    // --------------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    function setMenu(open) {
        mobileMenuBtn.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
        mobileMenuBtn.setAttribute('aria-expanded', String(open));
    }

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            setMenu(!navMenu.classList.contains('active'));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });
    }

    // --------------------------------------------------------------------------
    // Loop Typewriter Animation (Multi-word)
    // --------------------------------------------------------------------------
    const typewriterText = document.getElementById('typewriter-text');
    const words = ['Data Analyst', 'Business Analyst', 'Power BI Developer', 'Computer Engineer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function handleTypewriter() {
        const currentWord = words[wordIndex];

        charIndex += isDeleting ? -1 : 1;
        typewriterText.textContent = currentWord.substring(0, charIndex);

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1600; // Pause at completion
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Brief delay before next word
        }

        setTimeout(handleTypewriter, typeSpeed);
    }

    if (typewriterText && !prefersReducedMotion) {
        charIndex = typewriterText.textContent.length;
        isDeleting = true;
        setTimeout(handleTypewriter, 1800);
    }

    // --------------------------------------------------------------------------
    // Animated Stats Counters
    // --------------------------------------------------------------------------
    let statCountersAnimated = false;

    const animateStats = () => {
        if (statCountersAnimated) return;
        statCountersAnimated = true;

        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (prefersReducedMotion) {
                counter.textContent = target;
                return;
            }
            const duration = 1600;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    };

    // --------------------------------------------------------------------------
    // Intersection Observer for Section Transitions
    // --------------------------------------------------------------------------
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'frameworks') {
                    animateStats();
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(section => {
        if (section.id !== 'home') section.classList.add('fade-in');
        sectionObserver.observe(section);
    });

    // --------------------------------------------------------------------------
    // Project Notebook Cards (Problem / Process / Insight tabs)
    // --------------------------------------------------------------------------
    document.querySelectorAll('.nb-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-notebook');
            if (!card) return;

            const tabName = btn.getAttribute('data-nb-tab');

            card.querySelectorAll('.nb-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
            card.querySelectorAll('.nb-content').forEach(c => {
                c.classList.toggle('active', c.getAttribute('data-content') === tabName);
            });
        });
    });

    // --------------------------------------------------------------------------
    // Projects Filter (cards may belong to several categories)
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.projects-tabs .tab-btn');
    const projectWrappers = document.querySelectorAll('#projects-grid .project-card-wrapper');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.toggle('active', b === btn));

            const filterValue = btn.getAttribute('data-filter');

            projectWrappers.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').split(' ');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // Modals: shared open/close helpers
    // --------------------------------------------------------------------------
    let lastFocused = null;

    function openModal(modal) {
        lastFocused = document.activeElement;
        modal.hidden = false;
        document.body.classList.add('modal-open');
        const closeBtn = modal.querySelector('button[data-close]');
        if (closeBtn) closeBtn.focus();
    }

    function closeModal(modal) {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        if (modal === embedModal) {
            embedFrame.removeAttribute('src'); // stop the Power BI session
        }
        if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelectorAll('[data-close]').forEach(el => {
            el.addEventListener('click', () => closeModal(modal));
        });
    });

    // --------------------------------------------------------------------------
    // Live Power BI Dashboard Embed
    // --------------------------------------------------------------------------
    const embedModal = document.getElementById('embed-modal');
    const embedFrame = document.getElementById('embed-modal-frame');
    const embedTitle = document.getElementById('embed-modal-title');
    const embedOpen = document.getElementById('embed-modal-open');

    document.querySelectorAll('[data-embed]').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-embed');
            const title = btn.getAttribute('data-title') || 'Live Dashboard';
            embedTitle.textContent = title;
            embedFrame.setAttribute('title', `${title} (Power BI)`);
            embedOpen.href = url;
            embedFrame.src = url;
            openModal(embedModal);
        });
    });

    // --------------------------------------------------------------------------
    // Screenshot Lightbox
    // --------------------------------------------------------------------------
    const galleries = {
        'smart-touch': {
            title: 'Smart Touch Report',
            images: [
                { src: 'assets/img/projects/smart-touch-1.png', alt: 'Smart Touch Report: orders by category, subcategory and month' },
                { src: 'assets/img/projects/smart-touch-2.jpeg', alt: 'Smart Touch Report: region performance map and month-over-month orders' }
            ]
        },
        'invoi': {
            title: 'Invoi: Invoice Operations Dashboard',
            images: [
                { src: 'assets/img/projects/invoi-1.png', alt: 'Invoi dashboard: processed volume, top vendors, invoice details and trend' }
            ]
        },
        'financial': {
            title: 'Financial & Sales Report',
            images: [
                { src: 'assets/img/projects/financial-sales-1.png', alt: 'Financial & Sales Report: sales, profit, margin and segment overview' },
                { src: 'assets/img/projects/financial-sales-2.png', alt: 'Financial & Sales Report: prior-year comparison, discounts and P&L summary' }
            ]
        }
    };

    const galleryModal = document.getElementById('gallery-modal');
    const galleryImg = document.getElementById('gallery-img');
    const galleryTitle = document.getElementById('gallery-modal-title');
    const galleryCounter = document.getElementById('gallery-counter');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    let activeGallery = null;
    let activeIndex = 0;

    function showGalleryImage(index) {
        const images = activeGallery.images;
        activeIndex = (index + images.length) % images.length;
        const image = images[activeIndex];
        galleryImg.src = image.src;
        galleryImg.alt = image.alt;
        const multiple = images.length > 1;
        galleryCounter.textContent = multiple ? `${activeIndex + 1} / ${images.length}` : '';
        galleryPrev.hidden = !multiple;
        galleryNext.hidden = !multiple;
    }

    document.querySelectorAll('[data-gallery]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            activeGallery = galleries[trigger.getAttribute('data-gallery')];
            if (!activeGallery) return;
            galleryTitle.textContent = activeGallery.title;
            showGalleryImage(0);
            openModal(galleryModal);
        });
    });

    galleryPrev.addEventListener('click', () => showGalleryImage(activeIndex - 1));
    galleryNext.addEventListener('click', () => showGalleryImage(activeIndex + 1));

    // --------------------------------------------------------------------------
    // Keyboard support
    // --------------------------------------------------------------------------
    document.addEventListener('keydown', (e) => {
        const openModalEl = document.querySelector('.modal:not([hidden])');

        if (e.key === 'Escape') {
            if (openModalEl) {
                closeModal(openModalEl);
            } else if (navMenu && navMenu.classList.contains('active')) {
                setMenu(false);
            }
        }

        if (openModalEl === galleryModal) {
            if (e.key === 'ArrowLeft') showGalleryImage(activeIndex - 1);
            if (e.key === 'ArrowRight') showGalleryImage(activeIndex + 1);
        }
    });

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --------------------------------------------------------------------------
    // Interactive Constellation Particle Network (Animated Background)
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('canvas-particles');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const mouse = { x: null, y: null, radius: 150 };
        let colors = readParticleColors();

        function readParticleColors() {
            const styles = getComputedStyle(document.body);
            return {
                dot: styles.getPropertyValue('--particle-rgb').trim(),
                line: styles.getPropertyValue('--particle-line-rgb').trim()
            };
        }

        // Refresh particle colors whenever the theme class changes
        new MutationObserver(() => { colors = readParticleColors(); })
            .observe(document.body, { attributes: true, attributeFilter: ['class'] });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, dx, dy, size) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
                this.baseOpacity = Math.random() * 0.3 + 0.15;
                this.opacity = this.baseOpacity;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = `rgba(${colors.dot}, ${this.opacity})`;
                ctx.fill();
            }

            update() {
                if (this.x + this.size > canvas.width || this.x - this.size < 0) this.dx = -this.dx;
                if (this.y + this.size > canvas.height || this.y - this.size < 0) this.dy = -this.dy;

                this.x += this.dx;
                this.y += this.dy;

                if (mouse.x !== null) {
                    const distance = Math.hypot(this.x - mouse.x, this.y - mouse.y);
                    this.opacity = distance < mouse.radius
                        ? Math.min(0.8, this.baseOpacity + (1 - distance / mouse.radius) * 0.55)
                        : this.baseOpacity;
                } else {
                    this.opacity = this.baseOpacity;
                }

                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(65, Math.floor((canvas.width * canvas.height) / 24000));

            for (let i = 0; i < count; i++) {
                const size = Math.random() * 1.5 + 1;
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const dx = (Math.random() - 0.5) * 0.35;
                const dy = (Math.random() - 0.5) * 0.35;
                particles.push(new Particle(x, y, dx, dy, size));
            }
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        function connectParticles() {
            const maxDistance = 120;

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const distance = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${colors.line}, ${(1 - distance / maxDistance) * 0.25})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null) {
                    const distance = Math.hypot(particles[a].x - mouse.x, particles[a].y - mouse.y);

                    if (distance < mouse.radius) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${colors.dot}, ${(1 - distance / mouse.radius) * 0.12})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            if (!document.hidden) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => p.update());
                connectParticles();
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }
});
