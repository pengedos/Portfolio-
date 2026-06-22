document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.classList.remove('no-js');
    document.documentElement.setAttribute('data-theme', 'dark');

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var header = document.getElementById('header');
    function updateHeader() {
        header.classList.toggle('scrolled', window.scrollY > 20);
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

        // Hero metrics: show final values immediately (no counter) — avoids "0" flash on load
        // Case study metrics use CSS fade-in (see styles.css .case-results)

        // Case study metrics: CSS fade-in on scroll (no counter — avoids "0" bug)
        var caseMetricsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    caseMetricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.cases-grid').forEach(function(el) { caseMetricsObserver.observe(el); });
    } else {
        document.querySelectorAll('.fade-in').forEach(function(el) { el.classList.add('visible'); });
        document.querySelectorAll('.stagger-in').forEach(function(el) { el.classList.add('visible'); });
        document.querySelectorAll('.hero-word').forEach(function(el) { el.classList.add('visible'); });
        document.querySelectorAll('.cases-grid').forEach(function(el) { el.classList.add('visible'); });
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
        document.querySelectorAll('.cases-grid, .tools-gallery-grid, .unified-process').forEach(function(el) { staggerObserver.observe(el); });
    }

    // 2. HERO TEXT REVEAL
    if (!prefersReducedMotion) {
        var heroH1 = document.querySelector('.section-hero h1');
        if (heroH1) {
            var html = heroH1.innerHTML;
            // Split by HTML tags so tags like <br> are preserved, not wrapped as literal words
            var wrapped = html.split(/(<[^>]+>)/).map(function(part) {
                if (part.charAt(0) === '<' && part.charAt(part.length - 1) === '>') {
                    return part;
                }
                return part.replace(/(\S+)/g, '<span class="hero-word">$1</span>');
            }).join('');
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

    // ===== Scroll Progress Indicator (#11) =====
    var scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        function updateScrollProgress() {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = percent + '%';
        }
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
    }

    // ===== Privacy-friendly analytics (#17) — localStorage page views =====
    try {
        var today = new Date().toISOString().split('T')[0];
        var stats = JSON.parse(localStorage.getItem('visitStats') || '{"firstVisit":"' + today + '","totalVisits":0,"lastVisit":"","visitDays":[]}');
        if (stats.lastVisit !== today) {
            stats.totalVisits = (stats.totalVisits || 0) + 1;
            stats.lastVisit = today;
            if (stats.visitDays.indexOf(today) === -1) {
                stats.visitDays.push(today);
                if (stats.visitDays.length > 30) stats.visitDays = stats.visitDays.slice(-30);
            }
            localStorage.setItem('visitStats', JSON.stringify(stats));
        }
        console.log('Visit stats: ' + stats.totalVisits + ' total visits across ' + stats.visitDays.length + ' days (since ' + stats.firstVisit + ')');
    } catch(e) { /* localStorage not available */ }

    // ===== Hover sound toggle (#13) — off by default, user can enable =====
    var soundEnabled = localStorage.getItem('hoverSound') === 'true';
    var soundToggle = document.createElement('button');
    soundToggle.className = 'sound-toggle';
    soundToggle.setAttribute('aria-label', 'Toggle hover sounds');
    soundToggle.innerHTML = '<i class="fas ' + (soundEnabled ? 'fa-volume-up' : 'fa-volume-mute') + '"></i>';
    soundToggle.style.cssText = 'position:fixed;bottom:24px;left:24px;width:40px;height:40px;border-radius:10px;background:rgba(10,14,26,0.8);border:1px solid rgba(56,189,248,0.3);color:var(--accent);cursor:pointer;z-index:100;display:flex;align-items:center;justify-content:center;font-size:0.85rem;backdrop-filter:blur(8px);transition:all 0.25s;';
    soundToggle.title = soundEnabled ? 'Hover sounds ON — click to mute' : 'Hover sounds OFF — click to enable';
    document.body.appendChild(soundToggle);

    var audioCtx = null;
    function playHoverSound() {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.08);
        } catch(e) {}
    }

    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        localStorage.setItem('hoverSound', soundEnabled);
        soundToggle.innerHTML = '<i class="fas ' + (soundEnabled ? 'fa-volume-up' : 'fa-volume-mute') + '"></i>';
        soundToggle.title = soundEnabled ? 'Hover sounds ON — click to mute' : 'Hover sounds OFF — click to enable';
    });

    document.querySelectorAll('a, button, .case-card, .tool-gallery-card, .platform-tile, .dev-cert').forEach(function(el) {
        el.addEventListener('mouseenter', playHoverSound);
    });

});
