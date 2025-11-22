document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('logoCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const mainText = "Inwell";
    const subText  = "Book Store";
    const drawColor = "#2f2f2f";

    ctx.lineWidth = 2;
    ctx.strokeStyle = drawColor;
    ctx.fillStyle   = drawColor;
    ctx.textAlign   = "center";

    // -------------------------------------------------
    // 1. Draw the main "Inwell" text with a write-effect
    // -------------------------------------------------
    function drawLogo() {
        ctx.font = "100px 'Giaza', Georgia, serif";

        let startTime = null;
        const totalDuration = 1700;               // write animation

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed   = timestamp - startTime;
            const progress  = Math.min(elapsed / totalDuration, 1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const textWidth = ctx.measureText(mainText).width;
            const clipWidth = textWidth * progress;

            ctx.save();
            ctx.beginPath();
            ctx.rect(centerX - textWidth/2, 0, clipWidth, canvas.height);
            ctx.clip();
            ctx.fillText(mainText, centerX, centerY);
            ctx.restore();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(drawSubtext, 500);   // pause before sub-text
            }
        }
        requestAnimationFrame(animate);
    }

    // -------------------------------------------------
    // 2. Draw the sub-text
    // -------------------------------------------------
    function drawSubtext() {
        ctx.font = "30px 'Giaza', sans-serif";
        ctx.fillText(subText, centerX, centerY + 30);
        setTimeout(finishCanvas, 1200);      // pause before fade-out
    }

    // -------------------------------------------------
    // 3. Fade canvas out → remove → fade slider in
    // -------------------------------------------------
    function finishCanvas() {
        // 1. fade canvas out
        canvas.classList.add('fade-out');

        // wait for the CSS transition to finish (2 s)
        setTimeout(() => {
            // 2. remove canvas completely
            canvas.remove();

            // 3. fade the slider in
            const slider = document.querySelector('.main-automatic-slider');
            if (slider) {
                slider.classList.remove('hidden');
                slider.classList.add('fade-in');
            }
        }, 1200);               // <-- matches CSS transition duration
    }

    // -------------------------------------------------
    // Start everything once fonts are ready
    // -------------------------------------------------
    document.fonts.ready.then(drawLogo);
});