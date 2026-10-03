const video = document.getElementById("video");
const moodText = document.getElementById("mood");
const gameContainer = document.getElementById("gameContainer");
const detectBtn = document.getElementById("detectAgainBtn");
const overlay = document.getElementById("moodOverlay");

let currentGameLoop = null; // cancels old animations

/* --------------------------------------------- */
/* 1. LOAD MODELS + START CAMERA                 */
/* --------------------------------------------- */

window.addEventListener("load", start);

async function start() {
    moodText.innerText = "Loading models...";

    await faceapi.nets.tinyFaceDetector.loadFromUri('/static/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/static/models');

    await startCamera();

    detectBtn.disabled = false;
    moodText.innerText = "Models loaded. Ready!";
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();
    } catch (err) {
        console.error("Camera error:", err);
        alert("Cannot access camera. Check permissions.");
    }
}

/* --------------------------------------------- */
/* 2. MOOD DETECTION                             */
/* --------------------------------------------- */

async function detectMood() {
    const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

    if (!detection) {
        moodText.innerText = "No face detected 😕";
        return null;
    }

    const expressions = detection.expressions;

    let best = null;
    let bestValue = 0;
    for (const [key, value] of Object.entries(expressions)) {
        if (value > bestValue) {
            bestValue = value;
            best = key;
        }
    }

    if (best === "happy") return "happy";
    if (best === "angry") return "angry";
    if (best === "sad") return "sad";
    return "neutral";
}

/* --------------------------------------------- */
/* 3. DETECT AGAIN BUTTON                        */
/* --------------------------------------------- */

detectBtn.addEventListener("click", () => {
    runMoodDetection();
});

/* --------------------------------------------- */
/* 4. RUN MOOD DETECTION                         */
/* --------------------------------------------- */

async function runMoodDetection() {
    moodText.innerText = "Detecting mood...";

    const mood = await detectMood();
    if (!mood) return;

    moodText.innerText = "Mood: " + mood;

    clearHighlights();
    const el = document.getElementById(mood);
    if (el) el.classList.add("highlight");

    applyMoodAnimation(mood);
    applyMoodEffects(mood);

    video.classList.add("cameraFlash");
    setTimeout(() => video.classList.remove("cameraFlash"), 600);

    loadGame(mood);
}

/* --------------------------------------------- */
/* 5. MOOD TEXT ANIMATIONS                       */
/* --------------------------------------------- */

function applyMoodAnimation(mood) {
    moodText.classList.remove("happyAnim", "sadAnim", "angryAnim", "neutralAnim");

    if (mood === "happy") moodText.classList.add("happyAnim");
    if (mood === "sad") moodText.classList.add("sadAnim");
    if (mood === "angry") moodText.classList.add("angryAnim");
    if (mood === "neutral") moodText.classList.add("neutralAnim");
}

/* --------------------------------------------- */
/* 6. MOOD OVERLAY + GLOW                        */
/* --------------------------------------------- */

function applyMoodEffects(mood) {
    overlay.className = "mood-overlay";

    gameContainer.classList.remove(
        "happy-glow",
        "sad-glow",
        "angry-glow",
        "neutral-glow"
    );

    if (mood === "happy") {
        overlay.classList.add("mood-happy");
        gameContainer.classList.add("happy-glow");
    }
    if (mood === "sad") {
        overlay.classList.add("mood-sad");
        gameContainer.classList.add("sad-glow");
    }
    if (mood === "angry") {
        overlay.classList.add("mood-angry");
        gameContainer.classList.add("angry-glow");
    }
    if (mood === "neutral") {
        overlay.classList.add("mood-neutral");
        gameContainer.classList.add("neutral-glow");
    }
}

/* --------------------------------------------- */
/* 7. CLEAR ACTIVITY HIGHLIGHTS                  */
/* --------------------------------------------- */

function clearHighlights() {
    document.querySelectorAll('.activity').forEach(a => a.classList.remove('highlight'));
}

/* --------------------------------------------- */
/* 8. FADE ANIMATIONS                            */
/* --------------------------------------------- */

function fadeOut(element, callback) {
    element.style.opacity = 1;
    const fade = () => {
        element.style.opacity -= 0.05;
        if (element.style.opacity <= 0) {
            element.style.opacity = 0;
            callback();
        } else {
            requestAnimationFrame(fade);
        }
    };
    fade();
}

function fadeIn(element) {
    element.style.opacity = 0;
    element.style.transform = "scale(0.9)";

    const fade = () => {
        element.style.opacity = Number(element.style.opacity) + 0.05;
        element.style.transform = "scale(" + (0.9 + element.style.opacity * 0.1) + ")";
        if (element.style.opacity < 1) {
            requestAnimationFrame(fade);
        }
    };
    fade();
}

/* --------------------------------------------- */
/* 9. LOAD GAME SAFELY                           */
/* --------------------------------------------- */

function loadGame(mood) {
    fadeOut(gameContainer, () => {

        // Stop previous animation loop
        if (currentGameLoop) cancelAnimationFrame(currentGameLoop);

        // Remove old canvas
        const oldCanvas = gameContainer.querySelector("canvas");
        if (oldCanvas) oldCanvas.remove();

        gameContainer.innerHTML = "";

        // Load correct game
        if (mood === "happy") startHappyGame();
        else if (mood === "angry") startAngryGame();
        else if (mood === "neutral") startNeutralGame();
        else if (mood === "sad") startSadGame();

        fadeIn(gameContainer);
    });
}

/* --------------------------------------------- */
/* 10. SCORE POPUP                               */
/* --------------------------------------------- */

function showScorePopup() {
    const popup = document.getElementById("scorePopup");

    popup.classList.remove("hidden");

    setTimeout(() => popup.classList.add("show"), 10);

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 400);
    }, 3000);
}

/* --------------------------------------------- */
/* 11. OPTIONAL MANUAL START BUTTON              */
/* --------------------------------------------- */

const startBtn = document.getElementById("startHappyBtn");

if (startBtn) {
    startBtn.addEventListener("click", () => {
        if (currentGameLoop) cancelAnimationFrame(currentGameLoop);
        gameContainer.innerHTML = "";
        startHappyGame();
    });
}
