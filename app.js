/**
 * Main Application Logic
 * Handles View Routing, State Management, and UI Interactions
 */

class DonateHubApp {
    constructor() {
        this.currentView = 'home';
        this.appContent = document.getElementById('app-content');
        this.currentUser = null; // Can hold user objects with role: 'donor' | 'charity' | 'admin'
        this.isLoggedIn = false; // Auth flag — MUST be initialized
        this.cart = []; // Represents multiple items pending donation
        this.myDonations = []; // Active tracked donations for this session
        this.isDarkMode = false; // Theme flag

        // Complex Data Simulation for Charities
        this.charities = [
            {
                id: '1',
                title: 'Rural School Rebuilding',
                org: 'Global Education Initiative',
                category: 'Education',
                image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600',
                raised: 18450,
                goal: 25000,
                daysLeft: 12,
                verified: true,
                rating: 4.8,
                reviews: 124,
                transparencyScore: 92,
                aiTrustScore: 95, // High Trust
                aiStatus: 'Safe'
            },
            {
                id: '2',
                title: 'Mobile Clinic Supplies',
                org: 'Doctors Without Borders',
                category: 'Healthcare',
                image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600',
                raised: 8200,
                goal: 10000,
                daysLeft: 5,
                verified: true,
                rating: 4.9,
                reviews: 310,
                transparencyScore: 98,
                aiTrustScore: 99,
                aiStatus: 'Safe'
            },
            {
                id: '3',
                title: 'Unregistered Relief Fund',
                org: 'Relief Web Fast',
                category: 'Disaster Relief',
                image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=600',
                raised: 12000,
                goal: 20000,
                daysLeft: 15,
                verified: false,
                rating: 2.1,
                reviews: 15,
                transparencyScore: 40,
                aiTrustScore: 35, // Low Trust
                aiStatus: 'Suspicious'
            },
            {
                id: '4',
                title: 'Village Water Well',
                org: 'Water for All',
                category: 'Environment',
                image: 'https://images.unsplash.com/photo-1520627702677-2e11e00ee3b9?auto=format&fit=crop&q=80&w=600',
                raised: 11500,
                goal: 15000,
                daysLeft: 20,
                verified: true,
                rating: 4.5,
                reviews: 89,
                transparencyScore: 85,
                aiTrustScore: 88,
                aiStatus: 'Safe'
            },
             {
                id: '5',
                title: 'Community Food Bank',
                org: 'Feeding the Future',
                category: 'Hunger',
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
                raised: 4500,
                goal: 5000,
                daysLeft: 3,
                verified: true,
                rating: 4.7,
                reviews: 210,
                transparencyScore: 90,
                aiTrustScore: 92,
                aiStatus: 'Safe'
            }
        ];
        
        // Mock state to store recent active donations for tracking
        
        // Mock state to store persistent lifetime history for the profile
        this.lifetimeDonations = [
            {
                title: 'Clean Ocean Initiative',
                org: 'Blue Planet Trust',
                amount: '50.00',
                date: 'Oct 12, 2025',
                status: 'Delivered',
                image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=150'
            },
            {
                title: 'Homeless Shelter Support',
                org: 'City Safe Haven',
                amount: '150.00',
                date: 'Aug 04, 2025',
                status: 'Delivered',
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=150'
            }
        ];

        this.init();
    }

    init() {
        // Theme initialization from localStorage
        const savedTheme = localStorage.getItem('donatehub_theme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.body.classList.add('dark-mode');
        }
        
        this.setupNavigation();
        this.handleScrollNavbar();
        this.initThemeToggle();
        this.initInstallPrompt();
        
        // Initial route based on hash or default to home
        const initialRoute = window.location.hash.replace('#', '') || 'home';
        this.navigateTo(initialRoute);
        
        // Listen for browser back/forward
        window.addEventListener('hashchange', () => {
            const newRoute = window.location.hash.replace('#', '') || 'home';
            if (newRoute !== this.currentView) {
                this.navigateTo(newRoute, false);
            }
        });
    }

    initThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;
        
        toggleBtn.innerHTML = this.isDarkMode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        
        toggleBtn.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            if (this.isDarkMode) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('donatehub_theme', 'dark');
                toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('donatehub_theme', 'light');
                toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
    }

    setupNavigation() {
        // Handle active states on navigation links is already done
        // via navigateTo updating DOM classes.
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');

        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                navLinks.classList.toggle('show');
                navActions.classList.toggle('show');
            });
        }
        
        // Hide mobile menu when clicking a link
        document.querySelectorAll('.nav-item').forEach(el => {
            el.addEventListener('click', () => {
                if (navLinks) navLinks.classList.remove('show');
                if (navActions) navActions.classList.remove('show');
            });
        });
    }

    handleScrollNavbar() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /**
     * Simple SPA Router
     */
    async navigateTo(viewName, updateHash = true, dataId = null) {
        if (!viewName) return;
        
        this.currentView = viewName;
        
        // Update URL hash without causing jump
        if (updateHash) {
            let hash = `#${viewName}`;
            if (dataId) hash += `/${dataId}`;
            history.pushState(null, null, hash);
        }

        // Update Nav UI
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
            if(el.dataset.target === viewName) {
                el.classList.add('active');
            }
        });

        // Scroll to top on navigation
        window.scrollTo(0, 0);

        // Render appropriate view
        await this.renderView(viewName, dataId);
    }

    async renderView(viewName, dataId = null) {
        // Fade out current content briefly
        this.appContent.style.opacity = '0';
        
        setTimeout(() => {
            switch(viewName) {
                case 'home':
                    this.appContent.innerHTML = this.getHomeHTML();
                    break;
                case 'explore':
                    this.appContent.innerHTML = this.getExploreHTML();
                    break;
                case 'charity-detail':
                    this.appContent.innerHTML = this.getCharityDetailHTML(dataId);
                    break;
                case 'dashboard':
                    if (!this.isLoggedIn) { this.navigateTo('login'); return; }
                    this.appContent.innerHTML = this.getDashboardHTML();
                    break;
                case 'login':
                    this.appContent.innerHTML = this.getLoginHTML();
                    break;
                case 'signup':
                    this.appContent.innerHTML = this.getSignupHTML();
                    break;
                case 'profile':
                    if (!this.isLoggedIn) { this.navigateTo('login'); return; }
                    this.appContent.innerHTML = this.getProfileHTML();
                    break;
                case 'cart':
                    this.appContent.innerHTML = this.getCartHTML();
                    break;
                case 'checkout':
                    if (!this.isLoggedIn) {
                        this.showToast('Please sign in to complete your donation.', 'warning');
                        this.navigateTo('login');
                        return;
                    }
                    this.appContent.innerHTML = this.getCheckoutHTML();
                    break;
                case 'charity-dashboard':
                    if (!this.isLoggedIn) { this.navigateTo('login'); return; }
                    this.appContent.innerHTML = this.getCharityDashboardHTML();
                    break;
                case 'admin-dashboard':
                    if (!this.isLoggedIn) { this.navigateTo('login'); return; }
                    this.appContent.innerHTML = this.getAdminDashboardHTML();
                    break;
                default:
                    this.appContent.innerHTML = this.getHomeHTML();
            }
            // Trigger reflow & fade in
            void this.appContent.offsetWidth; 
            this.appContent.style.opacity = '1';
            
            // Re-initialize any vital view-specific scripts
            this.initViewScripts(viewName);
        }, 300); // Wait for fade out transition (can be added to CSS if needed)
    }

    initViewScripts(viewName) {
        if (viewName === 'explore') {
            this.initExploreFilters();
        } else if (viewName === 'charity-detail') {
            this.initDonationWidget();
        } else if (viewName === 'profile') {
            if (this.deferredPrompt) this.showInstallButton();
        }
    }

    initDonationWidget() {
        const amountBtns = document.querySelectorAll('.amount-btn');
        const customInput = document.getElementById('custom-donation');
        const lockAmt = document.getElementById('donation-lock-amt');
        const mainBtn = document.getElementById('main-donate-btn');

        const updateDonationState = (amount) => {
            if(!amount || isNaN(amount) || amount <= 0) amount = '0';
            const displayAmt = `$${parseFloat(amount).toLocaleString()}`;
            if(lockAmt) lockAmt.textContent = displayAmt;
            if(mainBtn && this.isLoggedIn) {
                mainBtn.innerHTML = `Donate ${displayAmt} Securely <i class="fa-solid fa-arrow-right"></i>`;
            }
        };

        // Pre-defined buttons
        amountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Clear custom input
                if(customInput) customInput.value = '';
                
                // Update active state
                amountBtns.forEach(b => {
                    b.classList.remove('btn-primary', 'active');
                    b.classList.add('btn-outline');
                });
                e.currentTarget.classList.remove('btn-outline');
                e.currentTarget.classList.add('btn-primary', 'active');

                // Update text
                updateDonationState(e.currentTarget.dataset.amt);
            });
        });

        // Custom amount input
        if (customInput) {
            customInput.addEventListener('input', (e) => {
                // Remove active states from buttons
                amountBtns.forEach(b => {
                    b.classList.remove('btn-primary', 'active');
                    b.classList.add('btn-outline');
                });
                updateDonationState(e.target.value);
            });
        }
    }

    initExploreFilters() {
        const searchInput = document.querySelector('.search-input-wrapper input');
        const categoryBtns = document.querySelectorAll('.category-filters .btn');
        const trustSelect = document.getElementById('trust-filter-select');
        let currentCategory = 'All';

        const updateGrid = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const minTrust = trustSelect ? parseInt(trustSelect.value) : 0;
            
            const filtered = this.charities.filter(c => {
                const matchesSearch = c.title.toLowerCase().includes(searchTerm) || c.org.toLowerCase().includes(searchTerm);
                const matchesCat = currentCategory === 'All' || c.category.includes(currentCategory);
                const matchesTrust = c.aiTrustScore >= minTrust;
                return matchesSearch && matchesCat && matchesTrust;
            });
            
            const grid = document.querySelector('.view-explore .charity-grid');
            if (grid) {
                grid.innerHTML = filtered.map(c => this.renderExploreCard(c)).join('') || '<div style="grid-column: 1 / -1; padding: 4rem; text-align: center; color: var(--text-muted);">No charities match your filters.</div>';
            }
        };

        if (searchInput) searchInput.addEventListener('input', updateGrid);
        if (trustSelect) trustSelect.addEventListener('change', updateGrid);

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryBtns.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-outline');
                });
                e.currentTarget.classList.remove('btn-outline');
                e.currentTarget.classList.add('btn-primary');
                
                // Get the text content representing the category name
                currentCategory = e.currentTarget.textContent.trim();
                updateGrid();
            });
        });
    }

    // --- View Templates ---
    
    getHomeHTML() {
        return `
            <div class="view-section active view-home">
                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="hero-bg" style="background-image: url('hero-bg.png');">
                        <div class="hero-overlay"></div>
                    </div>
                    <div class="container hero-content">
                        <div class="hero-text-wrapper">
                            <span class="badge badge-success mb-2" style="margin-bottom: 1rem;"><i class="fa-solid fa-check-circle"></i> Verified 100% Impact</span>
                            <h1 class="hero-title">Giving Made <span class="text-gradient">Transparent</span></h1>
                            <p class="hero-subtitle">Don't guess where your money goes. We connect you directly with verified charities and track every dollar to its final impact.</p>
                            <div class="hero-actions">
                                <button class="btn btn-primary" onclick="app.navigateTo('explore')">Find a Cause</button>
                                <button class="btn btn-secondary" onclick="document.querySelector('.steps-grid').scrollIntoView({behavior: 'smooth', block: 'center'})">See How It Works</button>
                            </div>
                        </div>
                        <div class="hero-stats-card glass-panel">
                            <div class="stat-item">
                                <h3 class="stat-val">$24M+</h3>
                                <p class="stat-label">Tracked Donations</p>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item">
                                <h3 class="stat-val">100%</h3>
                                <p class="stat-label">Proof of Impact</p>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item">
                                <h3 class="stat-val">340+</h3>
                                <p class="stat-label">Verified Partners</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- How It Works Section -->
                <section class="section section-bg-alt">
                    <div class="container">
                        <div class="section-header text-center" style="margin-bottom: 4rem;">
                            <h2 style="font-size: 2.5rem;">Trust Through Transparency</h2>
                            <p class="text-secondary" style="max-width: 600px; margin: 1rem auto 0; font-size: 1.125rem;">Our platform ensures that every donation you make is tracked, verified, and transparently reported back to you.</p>
                        </div>
                        
                        <div class="steps-grid">
                            <div class="step-card">
                                <div class="step-icon">
                                    <i class="fa-solid fa-hand-holding-dollar"></i>
                                </div>
                                <h3>1. You Donate</h3>
                                <p class="text-secondary">Choose from thoroughly verified charities. Your funds are securely held and designated for specific projects.</p>
                            </div>
                            
                            <div class="step-card">
                                <div class="step-icon">
                                    <i class="fa-solid fa-money-bill-transfer"></i>
                                </div>
                                <h3>2. Funds Tracked</h3>
                                <p class="text-secondary">Watch your money move. Charities update exactly when and where your specific funds are spent.</p>
                            </div>
                            
                            <div class="step-card">
                                <div class="step-icon step-icon-success">
                                    <i class="fa-solid fa-chart-line"></i>
                                </div>
                                <h3>3. See Impact</h3>
                                <p class="text-secondary">Receive photos, receipts, and reports proving the real-world impact of your contribution.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Featured Charities -->
                <section class="section">
                    <div class="container">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem;">
                            <div>
                                <h2 style="font-size: 2.5rem;">Urgent Causes</h2>
                                <p class="text-secondary" style="margin-top: 0.5rem; font-size: 1.125rem;">Verified organizations making a difference right now.</p>
                            </div>
                            <button class="btn btn-outline" onclick="app.navigateTo('explore')">View All <i class="fa-solid fa-arrow-right"></i></button>
                        </div>
                        
                        <div class="charity-grid">
                            ${this.charities.slice(0, 3).map(c => this.renderExploreCard(c)).join('')}
                        </div>
                    </div>
                </section>
                
                <!-- Trust Banner -->
                <section class="section" style="background-color: var(--primary-900); color: white;">
                    <div class="container text-center">
                        <div style="max-width: 800px; margin: 0 auto;">
                            <h2 style="color: white; font-size: 2.5rem; margin-bottom: 1.5rem;">Stop wondering. Start knowing.</h2>
                            <p style="font-size: 1.25rem; color: var(--primary-100); margin-bottom: 2rem;">Join thousands of donors who track exactly how their contributions are changing the world.</p>
                            <button class="btn btn-primary" style="background-color: white; color: var(--primary-900); padding: 1rem 2rem; font-size: 1.125rem;" onclick="app.navigateTo('explore')">Start Donating Transparently</button>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getExploreHTML() {
        return `
            <div class="view-section active view-explore">
                <section class="section section-bg-alt" style="padding-top: 4rem; padding-bottom: 2rem;">
                    <div class="container">
                        <div style="max-width: 800px; margin-bottom: 3rem;">
                            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Explore Verified Charities</h1>
                            <p class="text-secondary" style="font-size: 1.25rem;">Browse causes that matter. Every organization below is verified, ensuring your contribution reaches its intended goal.</p>
                        </div>
                        
                        <!-- Filters and Search -->
                        <div class="filter-bar glass-panel" style="padding: 1.5rem; margin-bottom: 3rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
                            <div class="search-input-wrapper" style="flex: 1; min-width: 280px; position: relative;">
                                <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                <input type="text" placeholder="Search charities or causes..." style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.8rem; border: 1px solid var(--primary-100); border-radius: var(--radius-pill); font-family: var(--font-sans); font-size: 1rem; outline: none; transition: border-color var(--transition-fast);">
                            </div>
                            
                            <div class="category-filters" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                <button class="btn btn-primary" style="padding: 0.5rem 1.25rem;">All</button>
                                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;"><i class="fa-solid fa-book"></i> Education</button>
                                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;"><i class="fa-solid fa-heart-pulse"></i> Healthcare</button>
                                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;"><i class="fa-solid fa-droplet"></i> Environment</button>
                                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;"><i class="fa-solid fa-bowl-food"></i> Hunger</button>
                            </div>
                            
                            <div class="trust-filter" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; width: 100%;">
                                <label style="font-size: 0.875rem; font-weight: 600; color: var(--text-secondary);"><i class="fa-solid fa-shield-halved"></i> Minimum Trust Score:</label>
                                <select id="trust-filter-select" style="padding: 0.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-sm); font-family: var(--font-sans); outline: none; background: white;">
                                    <option value="0">Any Score</option>
                                    <option value="80">80+ (Good)</option>
                                    <option value="90">90+ (Excellent)</option>
                                    <option value="95">95+ (Exceptional)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Full Charity Grid -->
                        <div class="charity-grid">
                            ${this.charities.map(c => this.renderExploreCard(c)).join('')}
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    renderExploreCard(charity) {
        const percent = Math.round((charity.raised / charity.goal) * 100);
        const verifiedHtml = charity.verified 
            ? `<div class="verified-tag"><i class="fa-solid fa-shield-halved"></i> Verified Profile</div>` 
            : `<div class="verified-tag" style="background:#fef2f2; color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Unverified</div>`;
        
        const aiStatusColor = charity.aiStatus === 'Safe' ? 'var(--success)' : 'var(--danger)';
        const aiIcon = charity.aiStatus === 'Safe' ? 'fa-check-circle' : 'fa-skull-crossbones';

        return `
            <div class="charity-card" style="cursor: pointer; position: relative;" onclick="app.navigateTo('charity-detail', true, '${charity.id}')">
                <div class="card-img-wrapper">
                    <img src="${charity.image}" alt="${charity.title}">
                    <span class="category-badge">${charity.category}</span>
                </div>
                <div class="card-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                        ${verifiedHtml}
                        <div style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; font-weight: 600; color: #f59e0b;">
                            <i class="fa-solid fa-star"></i> ${charity.rating} <span style="color:var(--text-muted); font-weight: 400;">(${charity.reviews})</span>
                        </div>
                    </div>
                    
                    <h3 class="card-title">${charity.title}</h3>
                    <p class="card-org">${charity.org}</p>
                    
                    <div class="progress-container">
                        <div class="progress-meta">
                            <span><strong>$${charity.raised.toLocaleString()}</strong> raised</span>
                            <span>$${charity.goal.toLocaleString()} goal</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(percent, 100)}%;"></div>
                        </div>
                        <div class="progress-status text-secondary" style="font-size: 0.875rem; margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <span>${percent}% Funded • ${charity.daysLeft} days left</span>
                            <span style="color: ${aiStatusColor}; font-weight: 600;" title="AI Trust Score: ${charity.aiTrustScore}/100"><i class="fa-solid ${aiIcon}"></i> AI: ${charity.aiStatus}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCharityDetailHTML(id) {
        // Default to first charity if ID is missing
        const charityId = id || '1';
        const charity = this.charities.find(c => c.id === charityId) || this.charities[0];
        const percent = Math.round((charity.raised / charity.goal) * 100);

        const aiStatusColor = charity.aiStatus === 'Safe' ? 'var(--success)' : 'var(--danger)';
        const aiBannerColor = charity.aiStatus === 'Safe' ? 'var(--primary-100)' : '#fef2f2';
        const aiBannerBorder = charity.aiStatus === 'Safe' ? 'var(--primary-200)' : '#fca5a5';
        const aiBannerText = charity.aiStatus === 'Safe' ? 'var(--primary-800)' : '#991b1b';
        const aiBannerIcon = charity.aiStatus === 'Safe' ? 'fa-shield-check' : 'fa-triangle-exclamation';

        return `
            <div class="view-section active view-detail">
                <!-- Detail Header -->
                <div class="detail-header" style="position: relative; height: 400px; background-image: url('${charity.image}'); background-size: cover; background-position: center; display: flex; align-items: flex-end;">
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
                    <div class="container" style="position: relative; z-index: 10; padding-bottom: 3rem;">
                        <button class="btn btn-outline" style="color: white; border-color: rgba(255,255,255,0.3); margin-bottom: 2rem; backdrop-filter: blur(4px);" onclick="app.navigateTo('explore')">
                            <i class="fa-solid fa-arrow-left"></i> Back to Explore
                        </button>
                        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                            <span class="category-badge" style="position: static; font-size: 0.875rem;"><i class="fa-solid fa-layer-group"></i> ${charity.category}</span>
                            ${charity.verified 
                                ? `<span class="verified-tag" style="margin: 0; background: rgba(255,255,255,0.2); color: white; backdrop-filter: blur(4px);"><i class="fa-solid fa-shield-halved"></i> Verified Impact Partner</span>`
                                : `<span class="verified-tag" style="margin: 0; background: rgba(2ef,68,68,0.2); color: #fca5a5; backdrop-filter: blur(4px);"><i class="fa-solid fa-triangle-exclamation"></i> Unverified Entity</span>`
                            }
                        </div>
                        <h1 style="color: white; font-size: 3.5rem; margin-bottom: 0.5rem; line-height: 1.1;">${charity.title}</h1>
                        <p style="color: rgba(255,255,255,0.8); font-size: 1.25rem;">${charity.org} • Project ID: #PRJ-${charity.id}0${charity.id}X</p>
                    </div>
                </div>

                <!-- Detail Content -->
                <section class="section" style="padding-top: 4rem;">
                    <div class="container">
                        <div class="detail-grid" style="display: grid; grid-template-columns: 1fr; gap: 4rem;">
                            
                            <!-- Left Column: Story & Transparency -->
                            <div class="detail-main">
                                <!-- AI & Trust Banner -->
                                <div style="background: ${aiBannerColor}; border: 1px solid ${aiBannerBorder}; color: ${aiBannerText}; padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2.5rem; display: flex; gap: 1rem; align-items: flex-start;">
                                    <i class="fa-solid ${aiBannerIcon}" style="font-size: 1.5rem; margin-top: 0.25rem;"></i>
                                    <div>
                                        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.25rem;">AI Fraud Detection: ${charity.aiStatus} (Score: ${charity.aiTrustScore}/100)</h3>
                                        <p style="font-size: 0.875rem; margin-top: 0;">${charity.aiStatus === 'Safe' 
                                            ? 'Our AI has analyzed public records, tax documents, and fund histories, determining a high likelihood of transparency and successful impact delivery.' 
                                            : 'Warning: Our systems have detected anomalies in expense reporting or missing documentation. Proceed with high caution.'}</p>
                                    </div>
                                </div>

                                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem;">
                                    <h2 style="font-size: 2rem; margin: 0;">About This Project</h2>
                                    <div style="text-align: right;">
                                        <div style="font-size: 1.5rem; color: #f59e0b; font-weight: 700;">
                                            <i class="fa-solid fa-star"></i> ${charity.rating}
                                        </div>
                                        <div style="font-size: 0.875rem; color: var(--text-secondary);">${charity.reviews} Donor Reviews</div>
                                    </div>
                                </div>
                                
                                <p class="text-secondary" style="font-size: 1.125rem; margin-bottom: 1.5rem; line-height: 1.8;">
                                    This initiative is driving critical support to the target community. Driven by the dedication of the ${charity.org} team, the goal is to fully execute transparent, measurable relief and sustainable development.
                                </p>
                                <p class="text-secondary" style="font-size: 1.125rem; margin-bottom: 3rem; line-height: 1.8;">
                                    By contributing to this fund, you are directly financing verified materials and local labor. Our platform ensures that escrow funds are only released to ${charity.org} as certified milestone proof is uploaded.
                                </p>

                                <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fa-solid fa-magnifying-glass-chart" style="color: var(--primary-600);"></i> 
                                    Transparency Rating Breakdown
                                </h3>
                                
                                <div class="itemized-list glass-panel" style="padding: 0; overflow: hidden; margin-bottom: 3rem;">
                                    <div style="display: flex; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                        <div>
                                            <strong style="display: block; font-size: 1.125rem;">Financial Transparency Score</strong>
                                            <span class="text-secondary" style="font-size: 0.875rem;">Clear expense tracking and low overhead.</span>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="display: block; color: var(--success);">${charity.transparencyScore}/100</strong>
                                        </div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                        <div>
                                            <strong style="display: block; font-size: 1.125rem;">Impact Proof Consistency</strong>
                                            <span class="text-secondary" style="font-size: 0.875rem;">Frequency of photo/receipt uploads.</span>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="display: block; color: var(--success);">Excellent</strong>
                                        </div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 1.5rem;">
                                        <div>
                                            <strong style="display: block; font-size: 1.125rem;">Communication Reliability</strong>
                                            <span class="text-secondary" style="font-size: 0.875rem;">Responsiveness to donor inquiries and updates.</span>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="display: block; color: #f59e0b;">Good</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column: Donation Form Widget -->
                            <div class="detail-sidebar" style="position: relative;">
                                <div class="donation-widget glass-panel" style="position: sticky; top: 100px; padding: 2.5rem;">
                                    
                                    <div class="progress-container" style="margin-bottom: 2rem;">
                                        <div class="progress-meta" style="font-size: 1rem;">
                                            <span><strong style="font-size: 1.5rem; color: var(--primary-900);">$${charity.raised.toLocaleString()}</strong> <span class="text-secondary">raised</span></span>
                                            <span class="text-secondary" style="align-self: flex-end;">of $${charity.goal.toLocaleString()}</span>
                                        </div>
                                        <div class="progress-bar" style="height: 12px; margin: 0.5rem 0;">
                                            <div class="progress-fill" style="width: ${Math.min(percent, 100)}%;"></div>
                                        </div>
                                        <div class="text-secondary" style="font-size: 0.875rem; display: flex; justify-content: space-between;">
                                            <span><strong>${percent}%</strong> Funded</span>
                                            <span><strong>${charity.daysLeft}</strong> Days Left</span>
                                        </div>
                                    </div>

                                    <h3 style="margin-bottom: 1.5rem; font-size: 1.25rem;">Make a Transparent Donation</h3>
                                    
                                    <div class="donation-amounts" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem;">
                                        <button class="btn btn-outline amount-btn" data-amt="25" style="border-radius: var(--radius-md);"><span>$25</span></button>
                                        <button class="btn btn-primary amount-btn active" data-amt="50" style="border-radius: var(--radius-md);"><span>$50</span></button>
                                        <button class="btn btn-outline amount-btn" data-amt="100" style="border-radius: var(--radius-md);"><span>$100</span></button>
                                    </div>
                                    
                                    <div class="custom-amount" style="position: relative; margin-bottom: 1.5rem;">
                                        <span style="position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); font-weight: 700; color: var(--text-secondary);">$</span>
                                        <input type="number" id="custom-donation" placeholder="Custom Amount" style="width: 100%; padding: 1rem 1rem 1rem 2.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 1.125rem; font-weight: 600; outline: none;">
                                    </div>

                                    <div style="background: var(--primary-50); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px dashed var(--primary-200);">
                                        <p style="font-size: 0.875rem; color: var(--primary-900); display: flex; gap: 0.5rem;">
                                            <i class="fa-solid fa-lock" style="color: var(--primary-600); margin-top: 0.25rem;"></i>
                                            <span>Your <span id="donation-lock-amt">$50</span> donation will be tracked in your dashboard until the charity uploads proof of purchase.</span>
                                        </p>
                                    </div>

                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0;">
                                        <button class="btn btn-outline btn-block" style="padding: 1rem; font-size: 1rem; border-color: var(--primary-600); color: var(--primary-700);" onclick="app.addToCart('${charity.id}')">
                                            <i class="fa-solid fa-cart-plus"></i> Add to Cart
                                        </button>
                                        <button id="main-donate-btn" class="btn btn-primary btn-block" style="padding: 1rem; font-size: 1rem;" onclick="app.donateNow('${charity.id}')">
                                            <i class="fa-solid fa-bolt"></i> Donate Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getDashboardHTML() {
        let dynamicDonationsHTML = '';
        
        // Calculate total for dashboard stats
        let dynamicTotal = this.myDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        let historyTotal = this.lifetimeDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        let grandTotal = historyTotal + dynamicTotal;
        
        // Render dynamically added donations first
        if (this.myDonations.length === 0) {
            dynamicDonationsHTML = `
                <div class="glass-panel text-center" style="padding: 4rem 2rem; margin-bottom: 2rem;">
                    <div style="width: 80px; height: 80px; background: var(--primary-50); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                        <i class="fa-solid fa-seedling" style="font-size: 2.5rem; color: var(--primary-500);"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Welcome to your Dashboard!</h3>
                    <p class="text-secondary" style="font-size: 1.125rem; max-width: 500px; margin: 0 auto 2rem;">Your active donation tracking will appear here. It looks like you haven't made any recent contributions yet. Ready to make a transparent difference?</p>
                    <button class="btn btn-primary" onclick="app.navigateTo('explore')">Explore Charities <i class="fa-solid fa-arrow-right"></i></button>
                    ${!this.isLoggedIn ? `<p style="margin-top: 1.5rem; font-size: 0.875rem;"><a href="javascript:void(0)" onclick="app.navigateTo('login')" style="color: var(--primary-600); font-weight: 600;">Sign in</a> to see your complete history.</p>` : ''}
                </div>
            `;
        } else {
            this.myDonations.forEach(don => {
                dynamicDonationsHTML += `
                    <div class="tracking-card glass-panel" style="padding: 0; overflow: hidden; margin-bottom: 2rem; border-color: var(--primary-500); box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);">
                        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; background: white;">
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background-image: url('${don.image}'); background-size: cover; background-position: center;"></div>
                                <div>
                                    <h4 style="font-size: 1.125rem; margin-bottom: 0.125rem;">${don.title}</h4>
                                    <p class="text-secondary" style="font-size: 0.875rem;">${don.org}</p>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div class="badge badge-primary"><i class="fa-solid fa-arrows-rotate fa-spin"></i> Processing</div>
                                <p style="font-size: 0.875rem; font-weight: 700; margin-top: 0.5rem;">$${parseFloat(don.amount).toFixed(2)}</p>
                                <label style="display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; font-size: 0.75rem; margin-top: 0.5rem; color: var(--text-secondary); cursor: pointer;">
                                    Make Monthly <input type="checkbox" onchange="app.showToast('Monthly recurrence activated for ${don.title}.', 'success')" style="accent-color: var(--primary-600);">
                                </label>
                            </div>
                        </div>
                        <div style="padding: 2rem; background: var(--bg-alt);">
                            <!-- Tracking Timeline -->
                            <div class="timeline" style="display: flex; justify-content: space-between; position: relative;">
                                <div style="position: absolute; top: 12px; left: 10%; right: 10%; height: 4px; background: var(--primary-100); z-index: 1;"></div>
                                <div style="position: absolute; top: 12px; left: 10%; width: 5%; height: 4px; background: var(--primary-500); z-index: 2;"></div>
                                
                                <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                    <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary-600); color: white; display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-check"></i></div>
                                    <span style="font-size: 0.75rem; font-weight: 600;">Donated</span>
                                </div>
                                
                                <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                    <div style="width: 28px; height: 28px; border-radius: 50%; background: white; border: 2px solid var(--text-muted); color: var(--text-muted); display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-building-columns"></i></div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">Held in Escrow</span>
                                </div>
                                
                                <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                    <div style="width: 28px; height: 28px; border-radius: 50%; background: white; border: 2px solid var(--text-muted); color: var(--text-muted); display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-receipt"></i></div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">Purchased</span>
                                </div>
                                
                                <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                    <div style="width: 28px; height: 28px; border-radius: 50%; background: white; border: 2px solid var(--text-muted); color: var(--text-muted); display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-camera"></i></div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">Impact Proof</span>
                                </div>
                            </div>
                            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(59, 130, 246, 0.05); border-radius: var(--radius-md); font-size: 0.875rem; color: var(--info); border: 1px solid rgba(59, 130, 246, 0.2);">
                                <strong>Status Update:</strong> Your donation was just received and is currently being routed to the charity's secure escrow account to await milestone unlocks.
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        return `
            <div class="view-section active view-dashboard">
                <section class="section section-bg-alt" style="padding-top: 4rem; padding-bottom: 2rem;">
                    <div class="container">
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem;">
                            <div>
                                <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">My Impact Dashboard</h1>
                                <p class="text-secondary" style="font-size: 1.125rem;">Track every dollar of your donations transparently.</p>
                            </div>
                            <div style="text-align: right;">
                                <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Total Lifetime Impact</p>
                                <h2 style="font-size: 2rem; color: var(--primary-600);">$${grandTotal.toFixed(2)}</h2>
                            </div>
                        </div>

                        <!-- Active Tracking Cards -->
                        <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-solid fa-radar" style="color: var(--primary-600);"></i> Live Tracking
                        </h3>
                        
                        <div class="tracking-grid" style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 4rem;">
                            
                            ${dynamicDonationsHTML}
                            
                            ${this.myDonations.length > 0 ? `
                            <!-- Ongoing Tracking Card Example -->
                            <div class="tracking-card glass-panel" style="padding: 0; overflow: hidden; margin-bottom: 2rem;">
                                <div style="padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; background: white;">
                                    <div style="display: flex; gap: 1rem; align-items: center;">
                                        <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background-image: url('https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=150'); background-size: cover; background-position: center;"></div>
                                        <div>
                                            <h4 style="font-size: 1.125rem; margin-bottom: 0.125rem;">Mobile Clinic Supplies</h4>
                                            <p class="text-secondary" style="font-size: 0.875rem;">Doctors Without Borders</p>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="badge" style="background: var(--warning); color: white;"><i class="fa-solid fa-spinner fa-spin"></i> Purchasing</div>
                                        <p style="font-size: 0.875rem; font-weight: 700; margin-top: 0.5rem;">$100.00</p>
                                    </div>
                                </div>
                                <div style="padding: 2rem; background: var(--bg-alt);">
                                    <!-- Tracking Timeline -->
                                    <div class="timeline" style="display: flex; justify-content: space-between; position: relative;">
                                        <div style="position: absolute; top: 12px; left: 10%; right: 10%; height: 4px; background: var(--primary-100); z-index: 1;"></div>
                                        <div style="position: absolute; top: 12px; left: 10%; width: 50%; height: 4px; background: var(--primary-500); z-index: 2;"></div>
                                        
                                        <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary-600); color: white; display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-check"></i></div>
                                            <span style="font-size: 0.75rem; font-weight: 600;">Donated</span>
                                        </div>
                                        
                                        <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary-600); color: white; display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-check"></i></div>
                                            <span style="font-size: 0.75rem; font-weight: 600;">Held in Escrow</span>
                                        </div>
                                        
                                        <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background: white; border: 2px solid var(--primary-600); color: var(--primary-600); display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-receipt"></i></div>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: var(--primary-700);">Purchased</span>
                                        </div>
                                        
                                        <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background: white; border: 2px solid var(--text-muted); color: var(--text-muted); display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-camera"></i></div>
                                            <span style="font-size: 0.75rem; color: var(--text-muted);">Impact Proof</span>
                                        </div>
                                    </div>
                                    <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(245, 158, 11, 0.05); border-radius: var(--radius-md); font-size: 0.875rem; color: #b45309; border: 1px solid rgba(245, 158, 11, 0.2);">
                                        <strong>Status Update:</strong> Charity has withdrawn funds and is actively buying clinic supplies. Receipts pending.
                                    </div>
                                </div>
                            </div>` : ''}

                            <!-- Tracking Card 2 (Completed Example) -->
                            <div class="tracking-card glass-panel" style="padding: 0; overflow: hidden; opacity: 0.85;">
                                <div style="padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; background: white;">
                                    <div style="display: flex; gap: 1rem; align-items: center;">
                                        <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background-image: url('https://images.unsplash.com/photo-1520627702677-2e11e00ee3b9?auto=format&fit=crop&q=80&w=150'); background-size: cover; background-position: center;"></div>
                                        <div>
                                            <h4 style="font-size: 1.125rem; margin-bottom: 0.125rem;">Village Water Well</h4>
                                            <p class="text-secondary" style="font-size: 0.875rem;">Water for All</p>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Impact Delivered</div>
                                        <p style="font-size: 0.875rem; font-weight: 700; margin-top: 0.5rem;">$150.00</p>
                                    </div>
                                </div>
                                <div style="padding: 2rem; background: var(--bg-main);">
                                    <!-- Tracking Timeline -->
                                    <div class="timeline" style="display: flex; justify-content: space-between; position: relative;">
                                        <div style="position: absolute; top: 12px; left: 10%; right: 10%; height: 4px; background: var(--success); z-index: 1;"></div>
                                        
                                        <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--success); color: white; display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-check"></i></div>
                                            <span style="font-size: 0.75rem; font-weight: 600;">Donated</span>
                                        </div>
                                        <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--success); color: white; display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-check"></i></div>
                                            <span style="font-size: 0.75rem; font-weight: 600;">Held in Escrow</span>
                                        </div>
                                        <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--success); color: white; display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-check"></i></div>
                                            <span style="font-size: 0.75rem;">Purchased</span>
                                        </div>
                                        <div style="text-align: center; position: relative; z-index: 3; width: 60px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--success); color: white; display: flex; justify-content: center; align-items: center; margin: 0 auto 0.5rem; font-size: 0.75rem;"><i class="fa-solid fa-check"></i></div>
                                            <span style="font-size: 0.75rem;">Impact Proof</span>
                                        </div>
                                    </div>
                                    
                                    <div style="margin-top: 2rem; display: flex; gap: 1rem; align-items: center; background: #f0fdf4; padding: 1rem; border-radius: var(--radius-md); border: 1px solid #bbf7d0;">
                                        <i class="fa-solid fa-file-invoice" style="font-size: 2rem; color: #166534;"></i>
                                        <div style="flex: 1;">
                                            <h5 style="color: #166534; font-size: 0.875rem; margin-bottom: 0.25rem;">Proof of Impact Available</h5>
                                            <p style="font-size: 0.75rem; color: #15803d;">Contractor invoices and completion photos uploaded on Oct 12, 2025.</p>
                                        </div>
                                        <button class="btn btn-outline" style="border-color: #166534; color: #166534; padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="app.showToast('Downloading Tax-Deductible Receipt (PDF)...', 'success')"><i class="fa-solid fa-download"></i> Receipt</button>
                                        <button class="btn btn-outline" style="border-color: #166534; color: #166534; padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="app.viewAssetsDialog()">View Assets</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getProfileHTML() {
        if (!this.isLoggedIn) {
            setTimeout(() => this.navigateTo('login'), 0);
            return '<div style="padding: 5rem; text-align: center;"><i class="fa-solid fa-circle-notch fa-spin fa-2x"></i></div>';
        }

        let historyHTML = '';
        if (this.lifetimeDonations.length === 0 && this.myDonations.length === 0) {
            historyHTML = `
                <div class="text-center" style="padding: 3rem; background: var(--bg-alt); border-radius: var(--radius-md); margin-top: 1.5rem;">
                    <p class="text-secondary" style="margin-bottom: 1.5rem;">You haven't made any donations yet.</p>
                    <button class="btn btn-primary" onclick="app.navigateTo('explore')">Make Your First Transparent Donation</button>
                </div>
            `;
        } else {
            // Render active donations as processing
            this.myDonations.forEach(don => {
                const d = new Date();
                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                historyHTML += `
                    <div class="history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background-image: url('${don.image}'); background-size: cover;"></div>
                            <div>
                                <h4 style="font-size: 1rem; margin-bottom: 0.125rem;">${don.title}</h4>
                                <p class="text-secondary" style="font-size: 0.75rem;">${dateStr} • ${don.org}</p>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span class="badge" style="background: var(--warning); color: white; font-size: 0.7rem;"><i class="fa-solid fa-spinner fa-spin"></i> Processing</span>
                            <p style="font-weight: 700; margin-top: 0.25rem;">$${parseFloat(don.amount).toFixed(2)}</p>
                        </div>
                    </div>
                `;
            });

            // Render permanent history
            this.lifetimeDonations.forEach(don => {
                historyHTML += `
                    <div class="history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background-image: url('${don.image}'); background-size: cover;"></div>
                            <div>
                                <h4 style="font-size: 1rem; margin-bottom: 0.125rem;">${don.title}</h4>
                                <p class="text-secondary" style="font-size: 0.75rem;">${don.date} • ${don.org}</p>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span class="badge badge-success" style="font-size: 0.7rem;"><i class="fa-solid fa-check"></i> Delivered</span>
                            <p style="font-weight: 700; margin-top: 0.25rem;">$${parseFloat(don.amount).toFixed(2)}</p>
                        </div>
                    </div>
                `;
            });
        }

        let historyTotal = this.lifetimeDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        let dynamicTotal = this.myDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        let total = historyTotal + dynamicTotal;

        return `
            <div class="view-section active view-profile">
                <section class="section section-bg-alt" style="padding-top: 4rem; padding-bottom: 4rem;">
                    <div class="container">
                        <div class="profile-layout" style="display: grid; grid-template-columns: 300px 1fr; gap: 3rem;">
                            
                            <!-- Sidebar -->
                            <div class="profile-sidebar">
                                <div class="glass-panel text-center" style="padding: 2.5rem 1.5rem;">
                                    <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--primary-100); color: var(--primary-700); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; margin: 0 auto 1.5rem;">
                                        ${this.currentUser && this.currentUser.name ? this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) : 'DJ'}
                                    </div>
                                    <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${this.currentUser && this.currentUser.name ? this.currentUser.name : 'Dear Donor'}</h2>
                                    <p class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.5rem;">Role: <strong style="text-transform: capitalize; color: var(--primary-600);">${this.currentUser && this.currentUser.role ? this.currentUser.role : 'Donor'}</strong></p>
                                    <p class="text-secondary" style="font-size: 0.875rem; margin-bottom: 1.5rem;">Member since ${new Date().getFullYear()}</p>
                                    
                                    <div style="background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                                        <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem;">Total Impact</div>
                                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-600);">$${total.toFixed(2)}</div>
                                    </div>
                                    
                                    <div id="install-button-container" style="display: none; margin-bottom: 1rem;">
                                        <button class="btn btn-primary btn-block" onclick="app.installApp()">
                                            <i class="fa-solid fa-download"></i> Install DonateHub App
                                        </button>
                                    </div>

                                    <button class="btn btn-outline btn-block" style="color: var(--danger); border-color: var(--danger);" onclick="app.simulateLogout()">
                                        <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Main Content -->
                            <div class="profile-content">
                                <div class="glass-panel" style="padding: 2.5rem;">
                                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 1rem;">
                                        <i class="fa-solid fa-clock-rotate-left" style="color: var(--primary-500);"></i> Complete Donation History
                                    </h3>
                                    
                                    <div class="history-list">
                                        ${historyHTML}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getCartHTML() {
        if (this.cart.length === 0) {
            return `
                <div class="view-section active view-cart">
                    <section class="section section-bg-alt" style="min-height: calc(100vh - var(--nav-height)); display: flex; align-items: center; justify-content: center;">
                        <div class="container text-center">
                            <i class="fa-solid fa-cart-arrow-down" style="font-size: 5rem; color: var(--primary-200); margin-bottom: 2rem;"></i>
                            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Your donation tray is empty</h2>
                            <p class="text-secondary" style="font-size: 1.25rem; margin-bottom: 2rem;">Discover verified causes and start making a transparent impact today.</p>
                            <button class="btn btn-primary" onclick="app.navigateTo('explore')">Explore Charities <i class="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </section>
                </div>
            `;
        }

        const total = this.cart.reduce((sum, item) => sum + parseFloat(item.donationAmount || 0), 0);

        let cartItemsHTML = this.cart.map(item => `
            <div class="glass-panel" style="display: flex; gap: 1.5rem; align-items: center; padding: 1.5rem; margin-bottom: 1rem;">
                <img src="${item.image}" alt="${item.title}" style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-md);">
                <div style="flex: 1;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${item.title}</h3>
                    <p class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.5rem;">${item.org}</p>
                    <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-color: var(--danger); color: var(--danger);" onclick="app.removeFromCart('${item.id}'); app.renderView('cart');">Remove</button>
                </div>
                <div style="text-align: right; width: 150px;">
                    <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Donation Amount</label>
                    <div style="position: relative;">
                        <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-weight: 700; color: var(--text-secondary);">$</span>
                        <input type="number" min="1" value="${item.donationAmount}" onchange="app.updateCartItemAmount('${item.id}', event)" class="form-control" style="width: 100%; padding: 0.5rem 0.5rem 0.5rem 1.5rem; border-radius: var(--radius-sm); border: 1px solid var(--primary-200); font-weight: 600;">
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="view-section active view-cart">
                <section class="section section-bg-alt" style="padding-top: 4rem; padding-bottom: 4rem; min-height: 100vh;">
                    <div class="container">
                        <h1 style="font-size: 3rem; margin-bottom: 2rem;">Your Impact Tray</h1>
                        
                        <div style="display: grid; grid-template-columns: 1fr 350px; gap: 3rem; align-items: start;">
                            <div>
                                ${cartItemsHTML}
                            </div>
                            
                            <div class="glass-panel" style="position: sticky; top: 100px; padding: 2rem;">
                                <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Summary</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.125rem;">
                                    <span class="text-secondary">Total Impact</span>
                                    <span style="font-weight: 700;">$${total.toFixed(2)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; font-size: 0.875rem;">
                                    <span class="text-secondary">Platform Fee</span>
                                    <span style="color: var(--success); font-weight: 600;">$0.00 (Covered)</span>
                                </div>
                                <hr style="border: 0; border-top: 1px solid var(--primary-100); margin-bottom: 1.5rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-size: 1.25rem;">
                                    <span style="font-weight: 700;">Secure Total</span>
                                    <span style="font-weight: 700; color: var(--primary-700);">$${total.toFixed(2)}</span>
                                </div>
                                <button class="btn btn-primary btn-block" style="padding: 1rem; font-size: 1.125rem;" onclick="app.navigateTo('checkout')">
                                    Proceed to Checkout <i class="fa-solid fa-lock"></i>
                                </button>
                                <p class="text-center text-muted" style="font-size: 0.75rem; margin-top: 1rem;">
                                    <i class="fa-solid fa-shield-halved"></i> Funds are held in escrow until impact proof is uploaded by the charity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getCheckoutHTML() {
        const total = this.cart.reduce((sum, item) => sum + parseFloat(item.donationAmount || 0), 0);
        
        return `
            <div class="view-section active view-checkout">
                <section class="section section-bg-alt" style="padding-top: 4rem; padding-bottom: 4rem; min-height: 100vh;">
                    <div class="container" style="max-width: 600px;">
                        <button class="btn btn-outline" style="margin-bottom: 2rem;" onclick="app.navigateTo('cart')">
                            <i class="fa-solid fa-arrow-left"></i> Back to Cart
                        </button>
                        
                        <div class="glass-panel" style="padding: 3rem;">
                            <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Secure Checkout</h1>
                            <p class="text-secondary" style="margin-bottom: 2rem;">You are donating $${total.toFixed(2)} across ${this.cart.length} verified projects.</p>
                            
                            <form onsubmit="event.preventDefault(); app.simulateCheckout();">
                                <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Payment Method</h3>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                                    <div style="border: 2px solid var(--primary-500); border-radius: var(--radius-md); padding: 1rem; text-align: center; cursor: pointer; background: rgba(59, 130, 246, 0.05);">
                                        <i class="fa-solid fa-credit-card" style="font-size: 1.5rem; color: var(--primary-600); margin-bottom: 0.5rem;"></i>
                                        <div style="font-weight: 600;">Credit Card</div>
                                    </div>
                                    <div style="border: 1px solid var(--primary-200); border-radius: var(--radius-md); padding: 1rem; text-align: center; cursor: pointer; background: white;">
                                        <i class="fa-brands fa-paypal" style="font-size: 1.5rem; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
                                        <div style="font-weight: 600; color: var(--text-secondary);">PayPal</div>
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 1rem;">
                                    <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Name on Card</label>
                                    <input type="text" placeholder="Jane Doe" required style="width: 100%; padding: 0.875rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans);">
                                </div>
                                
                                <div style="margin-bottom: 1.5rem;">
                                    <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Card Information</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" required style="width: 100%; padding: 0.875rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); border-bottom-left-radius: 0; border-bottom-right-radius: 0; font-family: var(--font-sans); border-bottom: 0;">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                                        <input type="text" placeholder="MM/YY" required style="width: 100%; padding: 0.875rem; border: 1px solid var(--primary-200); border-bottom-left-radius: var(--radius-md); font-family: var(--font-sans); border-right: 0;">
                                        <input type="text" placeholder="CVC" required style="width: 100%; padding: 0.875rem; border: 1px solid var(--primary-200); border-bottom-right-radius: var(--radius-md); font-family: var(--font-sans);">
                                    </div>
                                </div>
                                
                                <button id="checkout-btn" type="submit" class="btn btn-primary btn-block" style="padding: 1.25rem; font-size: 1.25rem; margin-top: 1rem;">
                                    <i class="fa-solid fa-lock"></i> Donate $${total.toFixed(2)}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getCharityDashboardHTML() {
        return `
            <div class="view-section active view-charity-dashboard">
                <section class="section section-bg-alt" style="padding-top: 4rem; padding-bottom: 4rem; min-height: 100vh;">
                    <div class="container">
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem;">
                            <div>
                                <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">Campaign Manager</h1>
                                <p class="text-secondary" style="font-size: 1.125rem;">Upload milestone proofs, manage funds, and reply to donors.</p>
                            </div>
                            <button class="btn btn-primary" style="padding: 1rem;">
                                <i class="fa-solid fa-plus"></i> New Campaign
                            </button>
                        </div>
                        
                        <div class="grid-3" style="margin-bottom: 3rem;">
                            <div class="glass-panel text-center">
                                <h3 style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Total Funds Raised</h3>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-600);">$45,200</div>
                            </div>
                            <div class="glass-panel text-center">
                                <h3 style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Total Donors</h3>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-600);">842</div>
                            </div>
                            <div class="glass-panel text-center" style="border-color: var(--warning);">
                                <h3 style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Pending Escrow</h3>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--warning);">$12,400</div>
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Upload proof to unlock.</p>
                            </div>
                        </div>

                        <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Active Campaigns</h3>
                        <div class="glass-panel" style="padding: 0; overflow: hidden;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead>
                                    <tr style="background: rgba(0,0,0,0.02); border-bottom: 1px solid rgba(0,0,0,0.05);">
                                        <th style="padding: 1rem 1.5rem; font-weight: 600; font-size: 0.875rem;">Campaign</th>
                                        <th style="padding: 1rem 1.5rem; font-weight: 600; font-size: 0.875rem;">Progress</th>
                                        <th style="padding: 1rem 1.5rem; font-weight: 600; font-size: 0.875rem;">Action Required</th>
                                        <th style="padding: 1rem 1.5rem; font-weight: 600; font-size: 0.875rem; text-align: right;">Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                                        <td style="padding: 1.5rem;">
                                            <div style="font-weight: 600;">Rural School Rebuilding</div>
                                            <div style="font-size: 0.875rem; color: var(--text-secondary);">ID: #PRJ-101X</div>
                                        </td>
                                        <td style="padding: 1.5rem;">
                                            <div style="font-weight: 700;">$18,450 <span style="font-size: 0.75rem; font-weight: 400; color: var(--text-secondary);">/ $25,000</span></div>
                                            <div class="progress-bar" style="height: 6px; margin-top: 0.5rem; width: 150px;">
                                                <div class="progress-fill" style="width: 74%;"></div>
                                            </div>
                                        </td>
                                        <td style="padding: 1.5rem;">
                                            <span class="badge" style="background: var(--warning); color: white;"><i class="fa-solid fa-camera"></i> Proof Needed</span>
                                        </td>
                                        <td style="padding: 1.5rem; text-align: right;">
                                            <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Upload Docs</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 1.5rem;">
                                            <div style="font-weight: 600;">Mobile Clinic Operations</div>
                                            <div style="font-size: 0.875rem; color: var(--text-secondary);">ID: #PRJ-102Y</div>
                                        </td>
                                        <td style="padding: 1.5rem;">
                                            <div style="font-weight: 700;">$150,000 <span style="font-size: 0.75rem; font-weight: 400; color: var(--text-secondary);">/ $150,000</span></div>
                                            <div class="progress-bar" style="height: 6px; margin-top: 0.5rem; width: 150px;">
                                                <div class="progress-fill" style="width: 100%; background: var(--success);"></div>
                                            </div>
                                        </td>
                                        <td style="padding: 1.5rem;">
                                            <span class="badge badge-success"><i class="fa-solid fa-check"></i> Funds Released</span>
                                        </td>
                                        <td style="padding: 1.5rem; text-align: right;">
                                            <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">View Report</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getAdminDashboardHTML() {
        return `
            <div class="view-section active view-admin-dashboard">
                <section class="section section-bg-alt" style="padding-top: 4rem; padding-bottom: 4rem; min-height: 100vh;">
                    <div class="container">
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem;">
                            <div>
                                <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">Admin Control Center</h1>
                                <p class="text-secondary" style="font-size: 1.125rem;">Monitor AI fraud alerts and verify charity applications.</p>
                            </div>
                        </div>

                        <div class="grid-3" style="margin-bottom: 3rem;">
                            <div class="glass-panel text-center" style="border-color: var(--danger);">
                                <h3 style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">AI Fraud Alerts</h3>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--danger);">3</div>
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Require immediate review.</p>
                            </div>
                            <div class="glass-panel text-center">
                                <h3 style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Pending Verifications</h3>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-600);">12</div>
                            </div>
                            <div class="glass-panel text-center">
                                <h3 style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Total Validated NGOs</h3>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--success);">142</div>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                            <!-- Pending Approvals -->
                            <div>
                                <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Verification Queue</h3>
                                <div class="glass-panel" style="padding: 0; overflow: hidden;">
                                    <div style="padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <div style="font-weight: 600;">Global Hunger Initiative</div>
                                            <div style="font-size: 0.875rem; color: var(--text-secondary);">Needs Tax Document Validation</div>
                                        </div>
                                        <div>
                                            <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Review</button>
                                        </div>
                                    </div>
                                    <div style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <div style="font-weight: 600;">Clean Oceans Coalition</div>
                                            <div style="font-size: 0.875rem; color: var(--text-secondary);">Needs Legal Registration Validation</div>
                                        </div>
                                        <div>
                                            <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Review</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- AI Alerts -->
                            <div>
                                <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Action Required</h3>
                                <div class="glass-panel" style="padding: 1.5rem; border: 1px solid #fca5a5; background: #fef2f2;">
                                    <div style="font-weight: 700; color: #991b1b; margin-bottom: 0.5rem;">Anomalous Expenditure</div>
                                    <p style="font-size: 0.875rem; color: #991b1b; margin-bottom: 1rem; opacity: 0.9;">System detected a 40% discrepancy between uploaded receipts and escrow withdrawal for "Forest Guardians Project."</p>
                                    <button class="btn btn-outline btn-block" style="border-color: var(--danger); color: var(--danger); font-size: 0.875rem; padding: 0.5rem;">Hold Funds & Investigate</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getLoginHTML() {
        return `
            <div class="view-section active view-login">
                <section class="section section-bg-alt" style="min-height: calc(100vh - var(--nav-height)); display: flex; align-items: center; justify-content: center; padding: 4rem 1rem;">
                    <div class="login-container glass-panel" style="width: 100%; max-width: 450px; padding: 3rem 2.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); background: var(--bg-main);">
                        <div class="text-center" style="margin-bottom: 2rem;">
                            <div class="brand-logo" style="justify-content: center; margin-bottom: 1rem;">
                                <i class="fa-solid fa-hand-holding-heart brand-icon"></i>
                                <span>DonateHub</span>
                            </div>
                            <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Welcome Back</h2>
                            <p class="text-secondary" style="font-size: 0.875rem;">Sign in to track your impact</p>
                        </div>
                        
                        <form onsubmit="event.preventDefault(); app.simulateLogin();" style="display: flex; flex-direction: column; gap: 1.25rem;">
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">Log in as</label>
                                <div style="position: relative;">
                                    <i class="fa-solid fa-user-tag" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                    <select id="login-role" style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 1rem; outline: none; appearance: none; background: white;">
                                        <option value="donor">Donor (Explore & Donate)</option>
                                        <option value="charity">Charity (Manage Campaigns)</option>
                                        <option value="admin">Admin (Verify & Review)</option>
                                    </select>
                                    <i class="fa-solid fa-chevron-down" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none;"></i>
                                </div>
                            </div>
                            
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">Email Address</label>
                                <div style="position: relative;">
                                    <i class="fa-solid fa-envelope" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                    <input type="email" placeholder="you@example.com" required style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 1rem; outline: none; transition: all var(--transition-fast);">
                                </div>
                            </div>
                            
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <label style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary);">Password</label>
                                    <a href="#" style="font-size: 0.75rem; font-weight: 600; color: var(--primary-600);">Forgot password?</a>
                                </div>
                                <div style="position: relative;">
                                    <i class="fa-solid fa-lock" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                    <input type="password" placeholder="••••••••" required style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 1rem; outline: none; transition: all var(--transition-fast);">
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block" style="padding: 1rem; margin-top: 0.5rem; font-size: 1rem;">Log In</button>
                            
                            <div style="position: relative; text-align: center; margin: 1rem 0;">
                                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--primary-100);"></div>
                                <span style="position: relative; background: var(--bg-main); padding: 0 0.75rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Or continue with</span>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <button type="button" class="btn btn-outline" style="padding: 0.75rem; font-size: 0.875rem; border-color: var(--primary-200);"><i class="fa-brands fa-google" style="color: #ea4335;"></i> Google</button>
                                <button type="button" class="btn btn-outline" style="padding: 0.75rem; font-size: 0.875rem; border-color: var(--primary-200);"><i class="fa-brands fa-apple" style="color: #000;"></i> Apple</button>
                            </div>
                        </form>
                        
                        <p class="text-center text-secondary" style="margin-top: 2rem; font-size: 0.875rem;">
                            Don't have an account? <a href="javascript:void(0)" onclick="app.navigateTo('signup')" style="font-weight: 600; color: var(--primary-600);">Sign up</a>
                        </p>
                    </div>
                </section>
            </div>
        `;
    }

    getSignupHTML() {
        return `
            <div class="view-section active view-signup">
                <section class="section section-bg-alt" style="min-height: calc(100vh - var(--nav-height)); display: flex; align-items: center; justify-content: center; padding: 4rem 1rem;">
                    <div class="login-container glass-panel" style="width: 100%; max-width: 450px; padding: 3rem 2.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); background: var(--bg-main);">
                        <div class="text-center" style="margin-bottom: 2rem;">
                            <div class="brand-logo" style="justify-content: center; margin-bottom: 1rem;">
                                <i class="fa-solid fa-hand-holding-heart brand-icon"></i>
                                <span>DonateHub</span>
                            </div>
                            <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Join the Movement</h2>
                            <p class="text-secondary" style="font-size: 0.875rem;">Create an account to verify your transparent impact</p>
                        </div>
                        
                        <form onsubmit="event.preventDefault(); app.simulateSignup();" style="display: flex; flex-direction: column; gap: 1.25rem;">
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">Full Name</label>
                                <div style="position: relative;">
                                    <i class="fa-solid fa-user" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                    <input type="text" placeholder="Jane Doe" required style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 1rem; outline: none; transition: all var(--transition-fast);">
                                </div>
                            </div>
                            
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">Join as</label>
                                <div style="position: relative;">
                                    <i class="fa-solid fa-user-tag" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                    <select id="signup-role" style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 1rem; outline: none; appearance: none; background: white;">
                                        <option value="donor">Donor (Explore & Donate)</option>
                                        <option value="charity">Charity (Manage Campaigns)</option>
                                        <option value="admin">Admin (Verify & Review)</option>
                                    </select>
                                    <i class="fa-solid fa-chevron-down" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none;"></i>
                                </div>
                            </div>
                            
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">Email Address</label>
                                <div style="position: relative;">
                                    <i class="fa-solid fa-envelope" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                    <input type="email" placeholder="you@example.com" required style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 1rem; outline: none; transition: all var(--transition-fast);">
                                </div>
                            </div>
                            
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">Password</label>
                                <div style="position: relative;">
                                    <i class="fa-solid fa-lock" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                    <input type="password" placeholder="••••••••" required style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.5rem; border: 1px solid var(--primary-200); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 1rem; outline: none; transition: all var(--transition-fast);">
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block" style="padding: 1rem; margin-top: 0.5rem; font-size: 1rem;">Create Account</button>
                        </form>
                        
                        <p class="text-center text-secondary" style="margin-top: 2rem; font-size: 0.875rem;">
                            Already have an account? <a href="javascript:void(0)" onclick="app.navigateTo('login')" style="font-weight: 600; color: var(--primary-600);">Log in</a>
                        </p>
                    </div>
                </section>
            </div>
        `;
    }

    // --- Interactivity & Cart Logic ---

    addToCart(charityId) {
        const charity = this.charities.find(c => c.id === charityId);
        if (!charity) return;
        
        // Default base donation amount
        if (!this.cart.find(item => item.id === charityId)) {
            this.cart.push({ ...charity, donationAmount: 50 });
            this.showToast(`Added ${charity.title} to your donation cart.`, 'success');
            this.updateCartUI();
        } else {
            this.showToast(`${charity.title} is already in your cart.`, 'info');
        }
    }

    donateNow(charityId) {
        if (!this.isLoggedIn) {
            this.showToast('Please sign in to donate securely.', 'warning');
            this.navigateTo('login');
            return;
        }

        const charity = this.charities.find(c => c.id === charityId);
        if (!charity) return;

        // Read current selected amount from the donation widget if available
        const customInput = document.getElementById('custom-donation');
        const activeBtn = document.querySelector('.donation-amounts .btn-primary');
        let amount = 50; // default

        if (customInput && customInput.value && parseFloat(customInput.value) > 0) {
            amount = parseFloat(customInput.value);
        } else if (activeBtn) {
            const match = activeBtn.textContent.match(/\$?(\d+)/);
            if (match) amount = parseInt(match[1]);
        }

        // Clear cart and load only this charity for direct checkout
        this.cart = [{ ...charity, donationAmount: amount }];
        this.updateCartUI();

        this.showToast(`Proceeding to checkout for "${charity.title}"...`, 'info');
        this.navigateTo('checkout');
    }

    updateCartUI() {
        const countBadge = document.getElementById('cart-count');
        if (countBadge) {
            countBadge.innerText = this.cart.length;
            countBadge.style.display = this.cart.length > 0 ? 'flex' : 'none';
        }
    }

    removeFromCart(charityId) {
        this.cart = this.cart.filter(item => item.id !== charityId);
        this.updateCartUI();
    }

    updateCartItemAmount(charityId, event) {
        const value = parseFloat(event.target.value);
        if (isNaN(value) || value <= 0) return;
        const item = this.cart.find(c => c.id === charityId);
        if (item) {
            item.donationAmount = value;
            this.renderView('cart');
        }
    }

    simulateCheckout() {
        if (!this.isLoggedIn) {
            this.showToast('Please sign in securely to complete your checkout.', 'warning');
            this.navigateTo('login');
            return;
        }

        const btn = document.getElementById('checkout-btn');
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Payment...';
            btn.disabled = true;
        }

        setTimeout(() => {
            // Move cart items to dashboard
            this.cart.forEach(item => {
                this.myDonations.unshift({
                    title: item.title,
                    org: item.org,
                    amount: item.donationAmount,
                    image: item.image
                });
            });

            const total = this.cart.reduce((sum, item) => sum + item.donationAmount, 0);
            this.showToast(`Donation Processed! $${total.toFixed(2)} has been securely routed.`, 'success');
            
            // Empty the cart
            this.cart = [];
            this.updateCartUI();

            this.navigateTo('dashboard');
        }, 2000);
    }

    simulateDonation() {
        if (!this.isLoggedIn) {
            this.showToast('Please sign in securely to make a transparent donation.', 'warning');
            this.navigateTo('login');
            return;
        }

        const btn = document.getElementById('main-donate-btn');
        // Extract the numerical amount from the button text
        let amountMatch = btn.textContent.match(/\$([0-9,.]+)/);
        let amount = amountMatch ? amountMatch[1].replace(/,/g, '') : "50";

        // Show success notification
        this.showToast(`Donation Processed! $${amount} has been securely routed to the Rural School Rebuilding project.`, 'success');
        
        // Setup a mock delay before redirecting to dashboard
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            btn.disabled = true;
        }

        // Add to our dynamic array to mock application state
        this.myDonations.unshift({
            title: 'Rural School Rebuilding',
            org: 'Global Education Initiative',
            amount: amount,
            image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=150'
        });

        setTimeout(() => {
            this.navigateTo('dashboard');
        }, 2000);
    }

    viewAssetsDialog() {
        this.showToast('Verifying Proof: Downloaded invoice and 4 construction photos attached to project #WAT-105.', 'info');
    }

    updateNavbarUI() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        if (!this.isLoggedIn || !this.currentUser) {
            navActions.innerHTML = `
                <button class="btn btn-outline" style="position: relative;" onclick="app.navigateTo('cart')">
                    <i class="fa-solid fa-cart-shopping"></i> Cart
                    <span id="cart-count" style="position: absolute; top: -5px; right: -5px; background: var(--primary-600); color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; display: ${this.cart.length > 0 ? 'flex' : 'none'};">${this.cart.length}</span>
                </button>
                <button class="btn btn-outline" onclick="app.navigateTo('login')">Log In</button>
                <button class="btn btn-primary" onclick="app.navigateTo('signup')">Sign Up</button>
            `;
            return;
        }

        let navHTML = '';
        if (this.currentUser.role === 'donor') {
            navHTML += `
                <button class="btn btn-outline" style="position: relative;" onclick="app.navigateTo('cart')">
                    <i class="fa-solid fa-cart-shopping"></i> Cart
                    <span id="cart-count" style="position: absolute; top: -5px; right: -5px; background: var(--primary-600); color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; display: ${this.cart.length > 0 ? 'flex' : 'none'};">${this.cart.length}</span>
                </button>
            `;
        } else if (this.currentUser.role === 'charity') {
            navHTML += `<button class="btn btn-outline" onclick="app.navigateTo('charity-dashboard')"><i class="fa-solid fa-bullhorn"></i> Campaigns</button>`;
        } else if (this.currentUser.role === 'admin') {
            navHTML += `<button class="btn btn-outline" onclick="app.navigateTo('admin-dashboard')"><i class="fa-solid fa-shield-halved"></i> Admin</button>`;
        }

        navHTML += `<button class="btn btn-outline" onclick="app.navigateTo('profile')"><i class="fa-solid fa-user"></i> Profile</button>`;
        
        navActions.innerHTML = navHTML;
    }

    simulateLogin() {
        const btn = document.querySelector('.view-login button[type="submit"]');
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Signing In...';
            btn.disabled = true;
        }

        setTimeout(() => {
            const roleEl = document.getElementById('login-role');
            const emailEl = document.querySelector('.view-login input[type="email"]');
            const emailValue = emailEl ? emailEl.value : '';
            const nameFromEmail = emailValue ? emailValue.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Donor';
            this.currentUser = { name: nameFromEmail, role: roleEl ? roleEl.value : 'donor' };
            this.isLoggedIn = true;
            this.showToast(`Welcome back, ${this.currentUser.name}! Signed in as ${this.currentUser.role}.`, 'success');
            
            // Re-route based on role
            if (this.currentUser.role === 'donor') this.navigateTo('home');
            else if (this.currentUser.role === 'charity') this.navigateTo('charity-dashboard');
            else if (this.currentUser.role === 'admin') this.navigateTo('admin-dashboard');

            this.updateNavbarUI();
        }, 1200);
    }

    simulateSignup() {
        const btn = document.querySelector('.view-signup button[type="submit"]');
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...';
            btn.disabled = true;
        }

        setTimeout(() => {
            const roleEl = document.getElementById('signup-role');
            const nameEl = document.querySelector('.view-signup input[type="text"]');
            const nameValue = nameEl && nameEl.value.trim() ? nameEl.value.trim() : 'New Donor';
            this.currentUser = { name: nameValue, role: roleEl ? roleEl.value : 'donor' };
            this.isLoggedIn = true;
            this.showToast(`Welcome, ${this.currentUser.name}! Your account has been created.`, 'success');
            
            this.myDonations = []; // Start fresh for new users
            this.lifetimeDonations = []; // New users have no history
            
            // Re-route based on role
            if (this.currentUser.role === 'donor') this.navigateTo('home');
            else if (this.currentUser.role === 'charity') this.navigateTo('charity-dashboard');
            else if (this.currentUser.role === 'admin') this.navigateTo('admin-dashboard');

            this.updateNavbarUI();
        }, 1200);
    }

    simulateLogout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.myDonations = [];
        
        this.showToast('Successfully logged out.', 'info');
        
        this.updateNavbarUI();
        this.navigateTo('home');
    }

    initInstallPrompt() {
        this.deferredPrompt = null;
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            this.deferredPrompt = e;
            // Update UI notify the user they can install the PWA
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', (evt) => {
            // Log install to analytics
            console.log('INSTALL: Success');
            this.deferredPrompt = null;
            document.getElementById('install-button-container').style.display = 'none';
        });
    }

    showInstallButton() {
        const installBtn = document.getElementById('install-button-container');
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            this.showToast('App is already installed or your browser doesn\'t support this feature.', 'info');
            return;
        }
        // Show the install prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        // Optionally, send analytics event with outcome of user choice
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        this.deferredPrompt = null;
        // Hide the install button
        document.getElementById('install-button-container').style.display = 'none';
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Set icon based on type
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'warning') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        
        // Force reflow to trigger animation
        void toast.offsetWidth;
        toast.classList.add('show');

        // Remove after 4s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for transition
        }, 4000);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DonateHubApp();
});
