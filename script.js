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
});

// --- 2. CERTIFICATE VIEWER MODAL ---
function openModal(imageSrc, captionText) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("expandedImg");
    const caption = document.getElementById("modalCaption");

    modal.classList.add("show");
    modalImg.src = imageSrc; 
    caption.innerHTML = captionText;
    
    // Fallback if image isn't loaded/found yet
    modalImg.onerror = function() {
        this.src = "https://via.placeholder.com/800x600.png?text=Certificate+Image+Pending";
    };
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.classList.remove("show");
}

// Close when clicking outside the image
window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        closeModal();
    }
}
