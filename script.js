document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SCROLL OBSERVER (Fade-in animations) ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px" 
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; 
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});

// --- 2. IMAGE MODAL LOGIC (Certificate Viewer) ---
function openModal(imageSrc, captionText) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("expandedImg");
    const caption = document.getElementById("modalCaption");

    modal.classList.add("show");
    
    // Fallback: If you don't have the image file yet, it shows a text placeholder
    modalImg.src = imageSrc; 
    modalImg.onerror = function() {
        this.src = "https://via.placeholder.com/800x600.png?text=Image+Not+Uploaded+Yet";
    };
    
    caption.innerHTML = captionText;
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.classList.remove("show");
}

// Close the modal if the user clicks anywhere outside the image
window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        closeModal();
    }
}
