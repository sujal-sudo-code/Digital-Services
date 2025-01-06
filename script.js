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
        { id: "customersCounter", targetValue: 500, duration: 3000 },
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

document.getElementById("sendQuoteButton").addEventListener("click", (event) => {
    event.preventDefault();
  
    // Get all input fields
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const problem = document.getElementById("problem");
    const message = document.getElementById("message");
  
    clearError(name);
    clearError(email);
    clearError(problem);
    clearError(message);
  
    let isValid = true;
  
    if (!name.value.trim()) {
      displayError(name, "This field is required");
      isValid = false;
    }
  
    if (!email.value.trim()) {
      displayError(email, "This field is required");
      isValid = false;
    }
  
    if (!problem.value.trim()) {
      displayError(problem, "This field is required");
      isValid = false;
    }
  
    if (!message.value.trim()) {
      displayError(message, "This field is required");
      isValid = false;
    }
  
    if (isValid) {
      alert(`Thank you, ${name.value}! Your message has been sent.`);
    }
});
  
function displayError(inputField, message) {
    const error = document.createElement("span");
    error.className = "error-message";
    error.textContent = message;
    inputField.parentElement.appendChild(error);
}