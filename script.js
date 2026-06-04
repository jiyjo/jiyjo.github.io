/* ============================================================
   Terminal Horizon - Interactive Layer
   Portfolio: Jiyjo Jose
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       Utility: Check for reduced motion preference
    ---------------------------------------------------------- */
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    /* ----------------------------------------------------------
       1. PARTICLE CANVAS
    ---------------------------------------------------------- */
    function initParticles() {
        if (prefersReducedMotion) return;

        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId = null;
        let width, height;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function getParticleCount() {
            return window.innerWidth < 768 ? 35 : 70;
        }

        function createParticle() {
            const colors = [
                'rgba(0, 240, 255, 0.6)',
                'rgba(0, 240, 255, 0.3)',
                'rgba(255, 255, 255, 0.4)',
                'rgba(255, 255, 255, 0.2)'
            ];
            return {
                x: Math.random() * width,
                y: Math.random() * height + height,
                radius: Math.random() * 1.5 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 0.4 + 0.15,
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.5 + 0.3
            };
        }

        function initParticleArray() {
            const count = getParticleCount();
            particles = [];
            for (let i = 0; i < count; i++) {
                const p = createParticle();
                p.y = Math.random() * height; // spread initially
                particles.push(p);
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.y -= p.speedY;
                p.x += p.speedX;

                // Fade out near top
                let alpha = p.opacity;
                if (p.y < height * 0.15) {
                    alpha *= p.y / (height * 0.15);
                }

                // Reset at top
                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }

                // Wrap horizontal
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace(
                    /[\d.]+\)$/,
                    alpha.toFixed(2) + ')'
                );
                ctx.fill();
            }

            animId = requestAnimationFrame(drawParticles);
        }

        resize();
        initParticleArray();
        drawParticles();

        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                resize();
                initParticleArray();
            }, 200);
        });
    }

    /* ----------------------------------------------------------
       2. CUSTOM CURSOR
    ---------------------------------------------------------- */
    function initCursor() {
        if (prefersReducedMotion) return;

        // Only on devices with a fine pointer
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        if (!dot || !ring) return;

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hovering state for interactive elements
        var interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], .btn, .project-card, .skill-tags span, .contact-card'
        );

        interactiveElements.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                ring.classList.add('hovering');
            });
            el.addEventListener('mouseleave', function () {
                ring.classList.remove('hovering');
            });
        });
    }

    /* ----------------------------------------------------------
       3. GLITCH ANIMATION (retrigger every 8s)
    ---------------------------------------------------------- */
    function initGlitch() {
        if (prefersReducedMotion) return;

        var glitchEl = document.querySelector('.glitch');
        if (!glitchEl) return;

        function triggerGlitch() {
            glitchEl.classList.add('glitching');
            setTimeout(function () {
                glitchEl.classList.remove('glitching');
            }, 400);
        }

        // Initial trigger after a small delay
        setTimeout(triggerGlitch, 600);

        // Retrigger every 8 seconds
        setInterval(triggerGlitch, 8000);
    }

    /* ----------------------------------------------------------
       4. TYPING ANIMATION
    ---------------------------------------------------------- */
    function initTyping() {
        var el = document.getElementById('typed-text');
        if (!el) return;

        var roles = [
            'Senior Software Engineer',
            'Squad Lead',
            'Java & Spring Boot Engineer',
            'React & AWS Engineer',
            'Microservices Architect'
        ];

        if (prefersReducedMotion) {
            el.textContent = roles[0];
            return;
        }

        var roleIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typeSpeed = 80;
        var deleteSpeed = 40;
        var pauseDuration = 2000;

        function tick() {
            var currentRole = roles[roleIndex];

            if (!isDeleting) {
                // Typing forward
                el.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentRole.length) {
                    // Pause at end of word
                    isDeleting = true;
                    setTimeout(tick, pauseDuration);
                    return;
                }
                setTimeout(tick, typeSpeed);
            } else {
                // Deleting
                el.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(tick, typeSpeed);
                    return;
                }
                setTimeout(tick, deleteSpeed);
            }
        }

        // Start after a brief delay
        setTimeout(tick, 1200);
    }

    /* ----------------------------------------------------------
       5. COUNTER ANIMATION
    ---------------------------------------------------------- */
    function initCounters() {
        var metricsSection = document.querySelector('.hero-metrics');
        if (!metricsSection) return;

        var counters = document.querySelectorAll('.metric-value');
        var hasAnimated = false;

        if (prefersReducedMotion) {
            // Just set final values immediately
            counters.forEach(function (counter) {
                counter.textContent = counter.getAttribute('data-target');
            });
            return;
        }

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function animateCounter(counter) {
            var target = parseInt(counter.getAttribute('data-target'), 10);
            var duration = 1500;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var easedProgress = easeOutCubic(progress);
                counter.textContent = Math.floor(easedProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(step);
        }

        var counterObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        counters.forEach(animateCounter);
                        counterObserver.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );

        counterObserver.observe(metricsSection);
    }

    /* ----------------------------------------------------------
       6. SCROLL REVEAL
    ---------------------------------------------------------- */
    function initReveal() {
        var revealElements = document.querySelectorAll('[data-reveal]');
        if (!revealElements.length) return;

        if (prefersReducedMotion) {
            revealElements.forEach(function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Stagger animations for siblings in the same parent
                        var parent = entry.target.parentElement;
                        var siblings = parent
                            ? parent.querySelectorAll('[data-reveal]')
                            : [];
                        var index = Array.prototype.indexOf.call(
                            siblings,
                            entry.target
                        );
                        var delay = index >= 0 ? index * 80 : 0;

                        setTimeout(function () {
                            entry.target.classList.add('revealed');
                        }, delay);

                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    /* ----------------------------------------------------------
       7. NAVIGATION
    ---------------------------------------------------------- */
    function initNavigation() {
        var navbar = document.querySelector('.navbar');
        var hamburger = document.getElementById('hamburger');
        var navMenu = document.getElementById('nav-menu');
        var overlay = document.getElementById('nav-overlay');
        var navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

        // Glass bg on scroll
        function handleScroll() {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state

        // Mobile menu toggle
        function openMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            overlay.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        if (hamburger) {
            hamburger.addEventListener('click', function () {
                var isOpen = hamburger.classList.contains('active');
                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        // Close on link click
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });

        // Smooth scroll with offset
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    var offset = navbar ? navbar.offsetHeight + 16 : 80;
                    var top =
                        target.getBoundingClientRect().top +
                        window.pageYOffset -
                        offset;
                    window.scrollTo({
                        top: top,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        });

        // Active nav link based on scroll
        var sections = document.querySelectorAll('section[id]');

        function setActiveNav() {
            var scrollY = window.pageYOffset;

            sections.forEach(function (section) {
                var sectionHeight = section.offsetHeight;
                var sectionTop = section.offsetTop - 120;
                var sectionId = section.getAttribute('id');

                if (
                    scrollY >= sectionTop &&
                    scrollY < sectionTop + sectionHeight
                ) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', setActiveNav, { passive: true });
        setActiveNav();
    }

    /* ----------------------------------------------------------
       8. INITIALIZE EVERYTHING
    ---------------------------------------------------------- */
    function init() {
        initParticles();
        initCursor();
        initGlitch();
        initTyping();
        initCounters();
        initReveal();
        initNavigation();
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
