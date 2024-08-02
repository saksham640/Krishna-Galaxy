let currentIndex = 0;
        const totalCards = 8;
        const visibleCards = 4;
        const carousel = document.getElementById('cards');

        function showNextSet() {
            currentIndex = (currentIndex + 1) % totalCards;
            carousel.style.transform = `translateX(-${currentIndex * (100 / visibleCards)}%)`;
            if (currentIndex === totalCards - visibleCards) {
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    carousel.style.transform = 'translateX(0)';
                    currentIndex = 0;
                    setTimeout(() => {
                        carousel.style.transition = 'transform 0.5s ease-in-out';
                    }, 50);
                }, 500);
            }
        }

setInterval(showNextSet, 3000); // Auto-swipe every 3 seconds