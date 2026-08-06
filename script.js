// Grab all elements that have the "fade-in" class
const faders = document.querySelectorAll('.fade-in');

// Settings for the scroll observer
const appearOptions = {
    threshold: 0.15, // Trigger when 15% of the element is visible on screen
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the exact bottom
};

// Create the observer
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return; // If it's not on screen yet, do nothing
        } else {
            // Once on screen, add the 'visible' CSS class to trigger the animation
            entry.target.classList.add('visible');
            
            // Stop watching it once it has animated so it doesn't repeat backwards
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

// Apply the observer to every fade-in element
faders.forEach(fader => {
    appearOnScroll.observe(fader);
});
