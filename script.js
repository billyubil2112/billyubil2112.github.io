document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. MOBILE MENU ---
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    hamburger.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", open ? "true" : "false");
        hamburger.textContent = open ? "✕" : "☰";
    });
    navLinks.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            navLinks.classList.remove("open");
            hamburger.textContent = "☰";
            hamburger.setAttribute("aria-expanded", "false");
        });
    });

    // --- 1. SCROLL ANIMATIONS ---
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- 2. HERO PHOTO FADE ON SCROLL ---
    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            document.body.classList.toggle('scrolled', window.scrollY > 60);
            ticking = false;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- 3. PROJECTS PHOTO FADE IN/OUT ---
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const projectsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                projectsSection.classList.toggle('photo-on', entry.isIntersecting);
            });
        }, { threshold: 0.12 });
        projectsObserver.observe(projectsSection);
    }
});
