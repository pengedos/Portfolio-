document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.classList.remove('no-js');
    
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Theme toggle
    var themeToggle = document.getElementById('themeToggle');
    var html = document.documentElement;
    var savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
        if (themeToggle) {
            themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var current = html.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(next);
        });
    }

    var header = document.getElementById('header');
    var stickyLogos = document.getElementById('stickyLogos');
    function updateHeader() {
        header.classList.toggle('scrolled', window.scrollY > 20);
        if (stickyLogos) {
            stickyLogos.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
        }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navOverlay = document.getElementById('navOverlay');
    
    function openNav() {
        navLinks.classList.add('open');
        navOverlay.classList.add('active');
        navToggle.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.querySelector('i').className = 'fas fa-times';
        document.body.style.overflow = 'hidden';
    }
    
    function closeNav() {
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.querySelector('i').className = 'fas fa-bars';
        document.body.style.overflow = '';
    }
    
    navToggle.addEventListener('click', function() {
        if (navLinks.classList.contains('open')) {
            closeNav();
        } else {
            openNav();
        }
    });
    
    navOverlay.addEventListener('click', closeNav);
    
    navLinks.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', closeNav);
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            closeNav();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });

    var sections = document.querySelectorAll('section[id]');
    var navLinkEls = document.querySelectorAll('.nav-link');
    function updateActiveNav() {
        var pos = window.scrollY + 120;
        sections.forEach(function(s) {
            if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
                var id = s.getAttribute('id');
                navLinkEls.forEach(function(l) {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    if (!prefersReducedMotion) {
        var fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.fade-in').forEach(function(el) { fadeObserver.observe(el); });

        function animateCounter(element, target, suffix, duration) {
            var start = 0;
            var startTime = null;
            var isDecimal = target % 1 !== 0;
            
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var easeOut = 1 - Math.pow(1 - progress, 3);
                var current = start + (target - start) * easeOut;
                
                if (isDecimal) {
                    element.textContent = current.toFixed(1) + suffix;
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        }

        var metricsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var metricNumbers = entry.target.querySelectorAll('.hero-metric-number');
                    metricNumbers.forEach(function(el) {
                        var text = el.textContent;
                        var match = text.match(/^([\d.]+)(.*)$/);
                        if (match) {
                            var targetNum = parseFloat(match[1]);
                            var suffix = match[2];
                            el.textContent = '0' + suffix;
                            animateCounter(el, targetNum, suffix, 1500);
                        }
                    });
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        var heroMetrics = document.querySelector('.hero-metrics-inline');
        if (heroMetrics) metricsObserver.observe(heroMetrics);

        // Case study metrics counter
        var caseMetricsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var metricNums = entry.target.querySelectorAll('.case-metric-num');
                    metricNums.forEach(function(el) {
                        var text = el.textContent;
                        var match = text.match(/^([\d.]+)(.*)$/);
                        if (match) {
                            var targetNum = parseFloat(match[1]);
                            var suffix = match[2];
                            el.textContent = '0' + suffix;
                            animateCounter(el, targetNum, suffix, 1500);
                        }
                    });
                    caseMetricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.cases-grid').forEach(function(el) { caseMetricsObserver.observe(el); });
    } else {
        document.querySelectorAll('.fade-in').forEach(function(el) { el.classList.add('visible'); });
        document.querySelectorAll('.stagger-in').forEach(function(el) { el.classList.add('visible'); });
        document.querySelectorAll('.hero-word').forEach(function(el) { el.classList.add('visible'); });
    }

    // 1. STAGGERED CARD ENTRANCE
    if (!prefersReducedMotion) {
        var staggerObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var cards = entry.target.querySelectorAll('.stagger-in');
                    cards.forEach(function(card, i) {
                        setTimeout(function() { card.classList.add('visible'); }, i * 100);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.cases-grid, .tools-gallery-grid, .services-grid, .process-cards-grid').forEach(function(el) { staggerObserver.observe(el); });
    }

    // 2. HERO TEXT REVEAL
    if (!prefersReducedMotion) {
        var heroH1 = document.querySelector('.section-hero h1');
        if (heroH1) {
            var html = heroH1.innerHTML;
            var wrapped = html.replace(/([^<>\s]+(?:\s+[^<>\s]+)*)/g, '<span class="hero-word">$1</span>');
            heroH1.innerHTML = wrapped;
            var words = heroH1.querySelectorAll('.hero-word');
            words.forEach(function(word, i) {
                setTimeout(function() { word.classList.add('visible'); }, 200 + i * 120);
            });
        }
    }

    // 3. PARALLAX SCROLLING
    if (!prefersReducedMotion) {
        var heroSection = document.querySelector('.section-hero');
        if (heroSection) {
            var bgUrl = getComputedStyle(heroSection).backgroundImage;
            if (bgUrl && bgUrl !== 'none') {
                var parallaxLayer = document.createElement('div');
                parallaxLayer.style.cssText = 'position:absolute;inset:0;background:' + bgUrl + ';background-size:cover;background-position:center;will-change:transform;z-index:0;';
                heroSection.prepend(parallaxLayer);
                heroSection.style.background = 'var(--bg-primary)';
                window.addEventListener('scroll', function() {
                    var scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        parallaxLayer.style.transform = 'translateY(' + (scrollY * 0.4) + 'px) scale(1.1)';
                    }
                }, { passive: true });
            }
        }
    }

    // 4. MAGNETIC HOVER
    if (!prefersReducedMotion) {
        document.querySelectorAll('.case-card, .tool-gallery-card, .service-card').forEach(function(card) {
            card.classList.add('magnetic');
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                card.style.transform = 'translate(' + (x * 0.05) + 'px, ' + (y * 0.05) + 'px)';
            });
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }

    // 5. TEXT SCRAMBLE
    if (!prefersReducedMotion) {
        var scrambleChars = '0123456789%';
        function scrambleText(element, finalText, duration) {
            var iterations = 0;
            var maxIterations = duration / 30;
            var interval = setInterval(function() {
                element.textContent = finalText.split('').map(function(char, i) {
                    if (i < iterations) return char;
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                }).join('');
                iterations += 0.5;
                if (iterations >= finalText.length) {
                    element.textContent = finalText;
                    clearInterval(interval);
                }
            }, 30);
        }
        var scrambleObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var nums = entry.target.querySelectorAll('.hero-metric-number, .case-metric-num');
                    nums.forEach(function(el) {
                        var finalText = el.textContent;
                        el.textContent = '0';
                        scrambleText(el, finalText, 800);
                    });
                    scrambleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        document.querySelectorAll('.hero-metrics-inline, .cases-grid').forEach(function(el) { scrambleObserver.observe(el); });
    }

    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCounter = document.getElementById('lightboxCounter');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var galleryImages = [];
    var current_index = 0;

    var toolGalleries = {
        freight: [
            { src: 'assets/tool-screenshots/freight-1.jpg', alt: 'Freight Tracker - Dashboard' },
            { src: 'assets/tool-screenshots/freight-2.jpg', alt: 'Freight Tracker - Shipment List' },
            { src: 'assets/tool-screenshots/freight-3.jpg', alt: 'Freight Tracker - KPI View' },
            { src: 'assets/tool-screenshots/freight-4.jpg', alt: 'Freight Tracker - Details' },
            { src: 'assets/tool-screenshots/freight-5.jpg', alt: 'Freight Tracker - Reports' },
            { src: 'assets/tool-screenshots/freight-6.jpg', alt: 'Freight Tracker - Settings' }
        ],
        inventory: [
            { src: 'assets/tool-screenshots/inventory-1.jpg', alt: 'Inventory PWA - Main View' },
            { src: 'assets/tool-screenshots/inventory-2.jpg', alt: 'Inventory PWA - Stock List' },
            { src: 'assets/tool-screenshots/inventory-3.jpg', alt: 'Inventory PWA - Tracking' },
            { src: 'assets/tool-screenshots/inventory-4.jpg', alt: 'Inventory PWA - Reports' },
            { src: 'assets/tool-screenshots/inventory-5.jpg', alt: 'Inventory PWA - Settings' }
        ],
        ar: [
            { src: 'assets/tool-screenshots/ar-1.jpg', alt: 'AR Dashboard - Overview' },
            { src: 'assets/tool-screenshots/ar-2.jpg', alt: 'AR Dashboard - Receivables' },
            { src: 'assets/tool-screenshots/ar-3.jpg', alt: 'AR Dashboard - Aging Report' },
            { src: 'assets/tool-screenshots/ar-4.jpg', alt: 'AR Dashboard - SOA View' },
            { src: 'assets/tool-screenshots/ar-5.jpg', alt: 'AR Dashboard - Sales Summary' },
            { src: 'assets/tool-screenshots/ar-6.jpg', alt: 'AR Dashboard - Export' }
        ]
    };

    document.querySelectorAll('.tool-gallery-card').forEach(function(card) {
        var img = card.querySelector('.tool-gallery-img img');
        var galleryKey = card.getAttribute('data-gallery');
        if (img && galleryKey && toolGalleries[galleryKey]) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                galleryImages = toolGalleries[galleryKey];
                openLightbox(0);
            });
        }
    });

    function openLightbox(index) {
        current_index = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        var item = galleryImages[current_index];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxCounter.textContent = (current_index + 1) + ' / ' + galleryImages.length;
    }

    function prevImage() {
        current_index = (current_index - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function nextImage() {
        current_index = (current_index + 1) % galleryImages.length;
        updateLightboxImage();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === document.querySelector('.lightbox-content')) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    // Contact form success message
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Use fetch for AJAX submission
            e.preventDefault();
            var formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                if (response.ok) {
                    // Show success message
                    contactForm.innerHTML = '<div class="form-success"><i class="fas fa-check-circle"></i><h3>Message Sent!</h3><p>Thank you for reaching out. I\'ll respond within 24 hours.</p></div>';
                } else {
                    throw new Error('Form submission failed');
                }
            }).catch(function(error) {
                // Show error state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                alert('There was an error sending your message. Please try again or email me directly.');
            });
        });
    }

    // ===== Case Study Filter (6.1) =====
    var filterBtns = document.querySelectorAll('.case-filter-btn');
    var caseCards = document.querySelectorAll('.case-card');
    var filterCount = document.querySelector('.case-filter-count');
    var totalCases = caseCards.length;

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active state on all buttons
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filter cards by data-tags
            var filter = btn.getAttribute('data-filter');
            var visibleCount = 0;
            caseCards.forEach(function(card) {
                var tags = (card.getAttribute('data-tags') || '').split(' ');
                var show = (filter === 'all' || tags.indexOf(filter) !== -1);
                if (show) {
                    card.classList.remove('is-hidden');
                    visibleCount++;
                } else {
                    card.classList.add('is-hidden');
                }
            });

            // Update live count text
            if (filterCount) {
                var label = filter === 'all' ? 'all areas' : btn.textContent.trim();
                filterCount.textContent = 'Showing ' + visibleCount + ' of ' + totalCases + ' case studies in ' + label;
            }
        });
    });

});
