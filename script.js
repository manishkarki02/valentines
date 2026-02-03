// DOM Elements
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const pandaImage = document.getElementById('pandaImage');
const pleadingText = document.getElementById('pleadingText');
const successModal = document.getElementById('successModal');

// State
let noInteractionCount = 0;
const maxNoInteractions = 5;
let isMobile = window.matchMedia("(max-width: 768px)").matches;

// Messages for each "No" interaction
const pleadingMessages = [
    "Are you sure? 🥺",
    "You don't mean it... right? 😢",
    "I'm gonna cry if you say no... 💧",
    "Please... my heart is breaking... 😭",
    "This is your last chance! 💔💔"
];

// Panda GIFs for different states
const pandaStates = [
    'love panda.gif',  // Initial happy state
    'sad 1.gif',       // First interaction - slightly sad
    'sad 2.gif',       // Second interaction - sadder
    'sad 3.gif',       // Third interaction - very sad
    'sad 4.gif',       // Fourth interaction - crying
    'sad 5.gif'        // Fifth interaction - heartbroken
];

// Calculate random position for No button
function getRandomPosition() {
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();

    // Calculate safe boundaries - give more room on mobile
    const padding = isMobile ? 10 : 20;
    const maxX = containerRect.width - buttonRect.width - padding;
    const maxY = containerRect.height - buttonRect.height - padding;

    // Generate random position
    const randomX = Math.max(0, Math.random() * maxX);
    const randomY = Math.max(0, Math.random() * maxY);

    return { x: randomX, y: randomY };
}

// Move No button to random position
function moveNoButton() {
    const position = getRandomPosition();
    noButton.style.left = `${position.x}px`;
    noButton.style.top = `${position.y}px`;
}

// Update panda state (used by both hover and click)
function updatePandaState() {
    // Update interaction count
    noInteractionCount++;

    // Cycle through pleading messages (stay on last one after reaching the end)
    const messageIndex = Math.min(noInteractionCount - 1, pleadingMessages.length - 1);
    pleadingText.textContent = pleadingMessages[messageIndex];

    // Cycle through panda GIFs (stay on last one after reaching the end)
    const gifIndex = Math.min(noInteractionCount, pandaStates.length - 1);
    pandaImage.src = pandaStates[gifIndex];
    pandaImage.classList.add('shake');
    setTimeout(() => pandaImage.classList.remove('shake'), 1000);

    // Add sad class for visual effect
    if (noInteractionCount > 0) {
        pandaImage.classList.add('sad');
    }

    // Grow Yes button (15% larger each time, but cap at reasonable size)
    const currentScale = Math.min(1 + (noInteractionCount * 0.15), 3);
    yesButton.style.transform = `scale(${currentScale})`;
    yesButton.style.fontSize = `${Math.min(1.3 + (noInteractionCount * 0.15), 2.5)}rem`;

    // Move No button
    moveNoButton();
}

// Handle No button click (for mobile)
function handleNoClick(e) {
    if (!isMobile) return; // Only handle clicks on mobile

    e.preventDefault();
    updatePandaState();
}

// Handle No button hover (for desktop)
function handleNoHover() {
    if (isMobile) return; // Only handle hover on desktop

    updatePandaState();
}

// Handle Yes button click
function handleYesClick() {
    successModal.classList.remove('hidden');

    // Add confetti effect
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff1493', '#ff69b4', '#ff6b9d', '#ffa8b9', '#ffc0cb'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                opacity: ${Math.random()};
                transform: rotate(${Math.random() * 360}deg);
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                z-index: 9999;
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }, i * 20);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            top: 100vh;
            transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
        }
    }
`;
document.head.appendChild(style);

// Event Listeners
yesButton.addEventListener('click', handleYesClick);

// For mobile: use click event
if (isMobile) {
    noButton.addEventListener('click', handleNoClick);
} else {
    // For desktop: use hover event
    noButton.addEventListener('mouseenter', handleNoHover);
}

// Update on window resize
window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Re-attach event listeners if device type changed
    if (wasMobile !== isMobile) {
        noButton.removeEventListener('click', handleNoClick);
        noButton.removeEventListener('mouseenter', handleNoHover);

        if (isMobile) {
            noButton.addEventListener('click', handleNoClick);
        } else {
            noButton.addEventListener('mouseenter', handleNoHover);
        }
    }
});

// Initialize No button position
window.addEventListener('load', () => {
    // Set initial position for No button
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    noButton.style.left = `${containerRect.width / 2 + 50}px`;
    noButton.style.top = `0px`;
});
