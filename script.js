document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header Effect
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle logic
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Handle Mobile Dropdowns gracefully
    const dropdownToggles = document.querySelectorAll('.main-nav .dropdown > a, .main-nav .nested-dropdown > a');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                const parent = toggle.parentElement;
                const dropdownContent = parent.querySelector('.dropdown-content, .nested-dropdown-content');

                // Only prevent default if there actually is a dropdown to open
                if (dropdownContent) {
                    e.preventDefault();
                    dropdownContent.classList.toggle('active');
                    toggle.classList.toggle('active'); // For rotating arrows

                    // Close siblings
                    const siblings = parent.parentElement.querySelectorAll(':scope > li');
                    siblings.forEach(sibling => {
                        if (sibling !== parent) {
                            const siblingContent = sibling.querySelector(':scope > .dropdown-content, :scope > .nested-dropdown-content');
                            const siblingToggle = sibling.querySelector(':scope > a');
                            if (siblingContent) siblingContent.classList.remove('active');
                            if (siblingToggle) siblingToggle.classList.remove('active');
                        }
                    });
                }
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Fallback: Force hero elements to be visible after a short delay to prevent "invisible text" bug
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .fade-in-up');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // Hero "3D Globe" Procedural Animation
    // Replaces previous animation with a FundingPips-style rotating wireframe globe
    // OPTIMIZED: Uses pre-rendered sprites for performance (No shadowBlur)
    const canvas = document.getElementById('hero-sequence');

    if (canvas) {
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];
        let particleCount = 450;
        let connectionDistance = 180;
        let baseGlobeRadius = 525;
        let rotationSpeedState = 0.002;
        let time = 0;

        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;
        let isMouseOver = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseOver = true;
        });

        window.addEventListener('mouseout', () => {
            isMouseOver = false;
        });

        // Pre-render Glow Sprite for performance
        const particleSprite = document.createElement('canvas');
        particleSprite.width = 20;
        particleSprite.height = 20;
        const sCtx = particleSprite.getContext('2d');

        // Draw glowing dot on sprite - Navy Blue (Primary)
        const grad = sCtx.createRadialGradient(10, 10, 0, 10, 10, 10);
        grad.addColorStop(0, '#1e56b8'); // Solid Navy
        grad.addColorStop(0.4, 'rgba(30, 86, 184, 0.6)'); // Navy Glow
        grad.addColorStop(1, 'rgba(30, 86, 184, 0)');
        sCtx.fillStyle = grad;
        sCtx.beginPath();
        sCtx.arc(10, 10, 10, 0, Math.PI * 2);
        sCtx.fill();

        // Secondary Purple Sprite - Accent
        const particleSpriteCyan = document.createElement('canvas');
        particleSpriteCyan.width = 20;
        particleSpriteCyan.height = 20;
        const cCtx = particleSpriteCyan.getContext('2d');
        const gradC = cCtx.createRadialGradient(10, 10, 0, 10, 10, 10);
        gradC.addColorStop(0, '#6b46c1'); // Rich Purple
        gradC.addColorStop(0.4, 'rgba(107, 70, 193, 0.6)');
        gradC.addColorStop(1, 'rgba(107, 70, 193, 0)');
        cCtx.fillStyle = gradC;
        cCtx.beginPath();
        cCtx.arc(10, 10, 10, 0, Math.PI * 2);
        cCtx.fill();


        class Point3D {
            constructor() {
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos(2 * Math.random() - 1);

                this.x = baseGlobeRadius * Math.sin(phi) * Math.cos(theta);
                this.y = baseGlobeRadius * Math.sin(phi) * Math.sin(theta);
                this.z = baseGlobeRadius * Math.cos(phi);

                this.baseSize = Math.random() * 3.75 + 2.25; // 50% larger than previous (was 2.5 + 1.5)
                this.colorType = Math.random() > 0.8 ? 'green' : 'cyan';
            }

            rotateY(angle) {
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const x = this.x * cos - this.z * sin;
                const z = this.x * sin + this.z * cos;
                this.x = x;
                this.z = z;
            }

            rotateX(angle) {
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const y = this.y * cos - this.z * sin;
                const z = this.y * sin + this.z * cos;
                this.y = y;
                this.z = z;
            }

            project() {
                const perspective = 800;
                const scale = perspective / (perspective + this.z + 400);
                return {
                    x: width / 2 + this.x * scale,
                    y: height / 2 + this.y * scale,
                    scale: scale
                };
            }
        }

        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            // Responsive Globe Sizing
            if (width <= 900) {
                baseGlobeRadius = 250; // Encircle on mobile
                particleCount = 200;   // Less dense
                connectionDistance = 120;
            } else {
                baseGlobeRadius = 525;
                particleCount = 450;
                connectionDistance = 180;
            }

            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Point3D());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.02;

            // Simple Pulse
            // To be performant, we don't re-init particles, just scale projections if needed
            // But for now, subtle movement is enough.

            // NO shadowBlur here! It kills FPS.

            const projectedPoints = [];

            // 1. Update & Project
            particles.forEach(p => {
                p.rotateY(rotationSpeedState);
                p.rotateX(rotationSpeedState * 0.5);

                const proj = p.project();

                // Pulse Logic
                const dx = proj.x - width / 2;
                const dy = proj.y - height / 2;
                const pulseScale = 1 + Math.sin(time) * 0.05;

                projectedPoints.push({
                    x: width / 2 + dx * pulseScale,
                    y: height / 2 + dy * pulseScale,
                    scale: proj.scale,
                    baseSize: p.baseSize,
                    z: p.z,
                    colorType: p.colorType
                });
            });

            // 2. Draw Connections (Batch path where possible?)
            // Keeping loop but optimizing state changes

            ctx.lineWidth = 0.8; // Thicker lines for visibility

            for (let i = 0; i < projectedPoints.length; i++) {
                const p1 = projectedPoints[i];

                // Draw Particle using Sprite
                // Calculate size based on perspective scale
                const sprite = p1.colorType === 'green' ? particleSprite : particleSpriteCyan;
                const size = p1.baseSize * p1.scale * 4; // *4 because sprite is 20px (large)

                // Boosted Opacity: 0.4 min to 1.0 max (was 0.2 to 1.0)
                const alpha = 0.4 + ((baseGlobeRadius - p1.z) / (baseGlobeRadius * 2)) * 0.6;

                ctx.globalAlpha = alpha;
                ctx.drawImage(sprite, p1.x - size / 2, p1.y - size / 2, size, size);

                // Internal Globe Connections
                for (let j = 1; j <= 5; j++) { // Reduced neighbor check slightly for FPS
                    const p2 = projectedPoints[(i + j) % projectedPoints.length];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistance * connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = p1.colorType === 'green' ? '#1e56b8' : '#6b46c1';
                        ctx.globalAlpha = alpha * 0.6; // Increased opacity for dark lines on light bg
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Mouse Connections
                if (isMouseOver) {
                    const dxm = p1.x - mouseX;
                    const dym = p1.y - mouseY;
                    const distSqM = dxm * dxm + dym * dym;
                    const mouseConnectDist = 250; // Interaction radius

                    if (distSqM < mouseConnectDist * mouseConnectDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = p1.colorType === 'green' ? '#1e56b8' : '#6b46c1';
                        // Opacity based on distance to mouse
                        const mouseAlpha = 1.0 - (Math.sqrt(distSqM) / mouseConnectDist);
                        ctx.globalAlpha = mouseAlpha * 0.9; // Stronger mouse connection
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1.0;
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', init);

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            rotationSpeedState = 0.02;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                rotationSpeedState = 0.002;
            }, 100);
        });

        init();
        animate();
    }

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('autowhat-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const btnText = document.getElementById('btn-text');
            const btnLoader = document.getElementById('btn-loader');
            const successMsg = document.getElementById('form-success-message');
            const errorMsg = document.getElementById('form-error-message');
            
            // Loading State
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            
            // Collect Data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            data.privacy_consent = formData.has('privacy_consent');
            data.marketing_updates = formData.has('marketing_updates');

            try {
                const response = await fetch('/.netlify/functions/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    successMsg.style.display = 'block';
                    contactForm.reset();
                    // Scroll to success message
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                console.error('Submission Error:', error);
                errorMsg.style.display = 'block';
            } finally {
                // Reset Button State
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
            }
        });
    }

});
