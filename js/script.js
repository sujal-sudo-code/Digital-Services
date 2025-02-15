function animateCounter(id, targetValue, duration) {
    const element = document.getElementById(id);
    let startValue = 0;
    const stepTime = Math.abs(Math.floor(duration / targetValue));

    const interval = setInterval(() => {
        startValue++;
        element.textContent = startValue;

        if (startValue === targetValue) {
            clearInterval(interval);
        }
    }, stepTime);
}

function animateCounters() {
    const counters = [
        { id: "experienceCounter", targetValue: 15, duration: 3000 },
        { id: "customersCounter", targetValue: 2000 , duration: 1 },
        { id: "atmCounter", targetValue: 150, duration: 3000 },
        { id: "cableCounter", targetValue: 100, duration: 3000 }
    ];

    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (!element.hasAttribute('data-animated')) {
            animateCounter(counter.id, counter.targetValue, counter.duration);
            element.setAttribute('data-animated', 'true');
        }
    });
}

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters(); 
            observer.disconnect(); 
        }
    });
}, { threshold: 0.5 });

const counterSection = document.querySelector('.left');
if (counterSection) {
    observer.observe(counterSection);
}
