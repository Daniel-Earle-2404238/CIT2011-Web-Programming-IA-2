document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.main-automatic-slider');
    if (!slider) return; // Do nothing if slider isn't on the page

    const track = slider.querySelector('.slider-track');
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('slider-next');
    const prevButton = document.getElementById('slider-prev');

    const slideCount = slides.length;
    if (slideCount === 0) return;

    // --- Setup Slider Dimensions ---
    // 1. Set track width to hold all slides side-by-side
    track.style.width = 100 * slideCount + '%';

    // 2. Set each slide to be the correct fraction of the track
    slides.forEach(slide => {
        slide.style.width = 100 / slideCount + '%';
    });

    let currentIndex = 0;
    let autoSlideTimer;
    const autoSlideInterval = 8000; // 8000ms = 8 seconds

    // --- Core Functions ---

    /**
     * Moves the track to the specified slide index
     * @param {number} targetIndex - The index of the slide to move to
     */
    function goToSlide(targetIndex) {
        // Handle loop-around
        if (targetIndex < 0) {
            targetIndex = slideCount - 1;
        } else if (targetIndex >= slideCount) {
            targetIndex = 0;
        }

        // Calculate the percentage to move the track
        const movePercentage = targetIndex * (100 / slideCount);
        track.style.transform = `translateX(-${movePercentage}%)`;
        currentIndex = targetIndex;
    }

    /**
     * Moves to the next slide
     */
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    /**
     * Moves to the previous slide
     */
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    /**
     * Starts the automatic sliding timer
     */
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, autoSlideInterval);
    }

    /**
     * Stops and restarts the timer (used when user clicks nav)
     */
    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    // --- Event Listeners ---

    // Next Button
    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    // Previous Button
    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Start the slider!
    startAutoSlide();
});