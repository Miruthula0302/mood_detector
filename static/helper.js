// -----------------------------------------------------
// PLAY AGAIN BUTTON (Mood Reactive)
// -----------------------------------------------------
function showReplayButton(callback, mood) {
    const container = document.getElementById("gameContainer");

    // Remove old button if exists
    const existing = container.querySelector(".play-again");
    if (existing) existing.remove();

    const btn = document.createElement("button");
    btn.innerText = "Play Again";
    btn.className = "play-again upgraded-btn";

    // Mood-based color
    if (mood === "happy") btn.style.background = "#ffd700";
    if (mood === "sad") btn.style.background = "#4aa3ff";
    if (mood === "angry") btn.style.background = "#ff4d4d";
    if (mood === "neutral") btn.style.background = "#ffffff";

    // Smooth fade-in animation
    btn.style.opacity = "0";
    setTimeout(() => { btn.style.opacity = "1"; }, 20);

    btn.onclick = callback;

    container.appendChild(btn);
}



// -----------------------------------------------------
// REWARD MESSAGE (Mood Reactive)
// -----------------------------------------------------
function showReward(message, mood) {
    const container = document.getElementById("gameContainer");

    let reward = container.querySelector(".reward-screen");

    if (!reward) {
        reward = document.createElement("div");
        reward.className = "reward-screen upgraded-reward";

        // Start hidden for fade-in
        reward.style.opacity = "0";
        container.appendChild(reward);

        // Fade in
        setTimeout(() => { reward.style.opacity = "1"; }, 20);
    }

    reward.innerText = message;

    // Mood-based glow
    if (mood === "happy") reward.style.boxShadow = "0 0 20px #ffd700";
    if (mood === "sad") reward.style.boxShadow = "0 0 20px #4aa3ff";
    if (mood === "angry") reward.style.boxShadow = "0 0 20px #ff4d4d";
    if (mood === "neutral") reward.style.boxShadow = "0 0 20px #ffffff";

    // Auto fade-out after 3 seconds
    setTimeout(() => {
        reward.style.opacity = "0";
        setTimeout(() => reward.remove(), 600);
    }, 3000);
}



// -----------------------------------------------------
// PROGRESS BAR (Mood Reactive)
// -----------------------------------------------------
function createProgressBar(mood) {
    const container = document.getElementById("gameContainer");

    // Remove old bar if exists
    let wrapper = container.querySelector(".progress-bar-container");
    if (wrapper) wrapper.remove();

    // Create wrapper
    wrapper = document.createElement("div");
    wrapper.className = "progress-bar-container upgraded-progress";

    // Create fill
    const fill = document.createElement("div");
    fill.className = "progress-bar-fill";

    // Smooth animation
    fill.style.transition = "width 0.4s ease";

    // Mood-based color
    if (mood === "happy") fill.style.background = "linear-gradient(90deg, #ffd700, #ffea85)";
    if (mood === "sad") fill.style.background = "linear-gradient(90deg, #4aa3ff, #8cc8ff)";
    if (mood === "angry") fill.style.background = "linear-gradient(90deg, #ff4d4d, #ff9999)";
    if (mood === "neutral") fill.style.background = "linear-gradient(90deg, #ffffff, #eeeeee)";

    wrapper.appendChild(fill);
    container.appendChild(wrapper);

    return fill;
}