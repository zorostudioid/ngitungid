/**
 * Script for ngitung.id interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('bx-menu', 'bx-x');
            } else {
                icon.classList.replace('bx-x', 'bx-menu');
            }
        });
    }

    // 3. Typing Animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const words = ["Solusi", "Mitra", "Partner"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 150;

        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 1500;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500;
            }

            setTimeout(typeEffect, typingSpeed);
        }
        setTimeout(typeEffect, 1000);
    }

    // 4. Statistics Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    if(counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const counter = entry.target;
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 }); 

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // 5. FAQ Accordion Logic
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    if (accordionBtns.length > 0) {
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                } 
            });
        });
    }

    // --- NEW B2B INTERACTIVE FEATURES ---

    // 6. Tax Leak Calculator Logic
    const revenueSlider = document.getElementById('revenue-slider');
    const sliderDisplay = document.getElementById('slider-val-display');
    const taxLeakDisplay = document.getElementById('tax-leak-value');

    if (revenueSlider) {
        function formatRupiah(number) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
        }

        revenueSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            // Display Slider Value
            if (val >= 1000) {
                sliderDisplay.textContent = `Rp ${(val/1000).toFixed(1).replace('.0', '')} Miliar / bln`;
            } else {
                sliderDisplay.textContent = `Rp ${val} Juta / bln`;
            }

            // Dummy calculation rule: 
            // 20% of revenue is assumed profit, and 10% of profit can be lost to tax/penalties annually
            // (Just a marketing gamification logic)
            const annualRevenue = val * 12 * 1000000;
            const estimatedPenalty = annualRevenue * 0.2 * 0.1; 
            
            taxLeakDisplay.innerHTML = `${formatRupiah(estimatedPenalty)} <small>/ thn</small>`;
        });
    }

    // 7. Before/After Image Slider
    const compSlider = document.querySelector('.comparison-slider');
    const beforeImage = document.getElementById('before-img-container');
    const compHandle = document.getElementById('comparison-handle');
    let isDragging = false;

    if (compSlider) {
        const moveSlider = (clientX) => {
            const rect = compSlider.getBoundingClientRect();
            let x = clientX - rect.left;
            // Bound setting
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            const percentage = (x / rect.width) * 100;
            beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            compHandle.style.left = `${percentage}%`;
        };

        // Mouse Events
        compSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            moveSlider(e.clientX);
        });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });

        // Touch Events
        compSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
            moveSlider(e.touches[0].clientX);
        }, {passive: true});
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlider(e.touches[0].clientX);
        }, {passive: true});
    }

    // 8. Diagnosis Quiz Logic
    let currentStep = 1;
    let quizScore = 0;
    const totalSteps = 3;
    const quizBtns = document.querySelectorAll('.quiz-btn');
    const progressBar = document.getElementById('quiz-progress-bar');
    
    if (quizBtns.length > 0) {
        quizBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const score = parseInt(e.target.getAttribute('data-score'));
                quizScore += score;
                
                // Hide current
                document.getElementById(`quiz-step-${currentStep}`).classList.remove('active');
                
                currentStep++;
                
                if (currentStep <= totalSteps) {
                    // Show next
                    document.getElementById(`quiz-step-${currentStep}`).classList.add('active');
                    progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
                } else {
                    // Show Result
                    progressBar.style.width = `100%`;
                    document.getElementById('quiz-result').classList.add('active');
                    
                    const resTitle = document.getElementById('result-title');
                    const resDesc = document.getElementById('result-desc');
                    const resIcon = document.getElementById('result-icon');
                    
                    // Simple logic based on score
                    if (quizScore >= 10) {
                        resTitle.textContent = "Status: RED FLAG!";
                        resTitle.style.color = "#ff4757";
                        resIcon.className = "bx bx-error-circle warning-icon";
                        resIcon.style.color = "#ff4757";
                        resDesc.textContent = "Kebocoran kas dan sanksi pajak membayangi Anda. Sistem Anda kolaps!";
                    } else if (quizScore >= 4) {
                        resTitle.textContent = "Status: WARNING";
                        resTitle.style.color = "#ffa502";
                        resIcon.className = "bx bx-info-circle warning-icon";
                        resIcon.style.color = "#ffa502";
                        resDesc.textContent = "Beberapa titik rawan butuh perbaikan segera sebelum kerugian membesar.";
                    } else {
                        resTitle.textContent = "Status: HEALTHY";
                        resTitle.style.color = "#2ed573";
                        resIcon.className = "bx bx-check-circle warning-icon";
                        resIcon.style.color = "#2ed573";
                        resDesc.textContent = "Bagus! Sistem Anda terkontrol. Kami bisa memantapkan strategi ekspansi Anda.";
                    }
                }
            });
        });
    }

    // 9. Pricing Configurator Logic
    const priceCheckboxes = document.querySelectorAll('.price-checkbox');
    const priceDisplay = document.getElementById('total-price');

    if (priceCheckboxes.length > 0) {
        function calculateTotal() {
            let total = 0;
            priceCheckboxes.forEach(chk => {
                if(chk.checked) {
                    total += parseInt(chk.value);
                }
            });
            priceDisplay.textContent = new Intl.NumberFormat('id-ID').format(total);
        }

        priceCheckboxes.forEach(chk => {
            chk.addEventListener('change', calculateTotal);
        });
        // Initial setup
        calculateTotal();
    }

    // 10. AI Chat Widget
    const chatWidget = document.getElementById('ai-chat-widget');
    if (chatWidget) {
        const toggleBtn = document.getElementById('ai-chat-toggle');
        const notifBadge = document.querySelector('.ai-notification');
        const chatWindow = document.getElementById('ai-chat-window');
        const closeBtn = document.getElementById('close-chat');
        const typingIndicator = document.getElementById('ai-typing');
        const chatBody = document.getElementById('ai-chat-body');
        
        let hasOpened = false;

        // Auto trigger popup notification after 5 seconds to grab attention
        setTimeout(() => {
            if (!hasOpened) {
                notifBadge.classList.add('show');
            }
        }, 5000);

        const openChat = () => {
            hasOpened = true;
            chatWindow.classList.add('open');
            notifBadge.classList.remove('show');
            
            // Trigger 2nd message typing animation
            if (!chatWindow.hasAttribute('data-initialized')) {
                chatWindow.setAttribute('data-initialized', 'true');
                typingIndicator.classList.add('show');
                chatBody.scrollTop = chatBody.scrollHeight;
                
                setTimeout(() => {
                    typingIndicator.classList.remove('show');
                    const newMsg = document.createElement('div');
                    newMsg.className = 'ai-message msg-received';
                    newMsg.innerHTML = 'Bila bingung mau mulai dari mana, Bapak/Ibu Founder bisa ceritakan masalah pajaknya bebas tanpa biaya. 😊';
                    
                    chatBody.insertBefore(newMsg, typingIndicator);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 2500);
            }
        };

        toggleBtn.addEventListener('click', () => {
            if(chatWindow.classList.contains('open')){
                chatWindow.classList.remove('open');
            } else {
                openChat();
            }
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });
    }

});
