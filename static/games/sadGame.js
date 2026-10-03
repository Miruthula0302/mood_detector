function startSadGame() {
    const container = document.getElementById("gameContainer");
    const messageDiv = document.getElementById("encouragementMessage");

    container.innerHTML = "";
    container.style.position = "relative";

    /* --------------------------------------------- */
    /* HUD (Puppy Talking)                           */
    /* --------------------------------------------- */
    const hud = document.createElement("div");
    hud.className = "pet-hud";
    container.appendChild(hud);

    const dogMood = document.createElement("div");
    dogMood.innerText = "Mood: I am okay 💜";
    dogMood.style.fontSize = "20px";
    hud.appendChild(dogMood);

    const dogTask = document.createElement("div");
    dogTask.innerText = "I am happy you are here 💜";
    dogTask.style.fontSize = "16px";
    hud.appendChild(dogTask);

    messageDiv.innerText = "Your cloud puppy is here 💜";

    /* --------------------------------------------- */
    /* Canvas Setup                                  */
    /* --------------------------------------------- */
    const canvas = document.createElement("canvas");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    window.addEventListener("resize", resizeCanvas);

    /* --------------------------------------------- */
    /* Puppy State                                   */
    /* --------------------------------------------- */
    const dog = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 45,
        vy: 0,
        jumping: false,
        curled: false,
        sleeping: false,
        facing: 1,
        happiness: 0.6,
        warmth: 0.5,
        lastInteraction: performance.now()
    };

    let cursorX = 0;
    let cursorY = 0;
    let mouseDown = false;

    /* --------------------------------------------- */
    /* Dynamic Emotional Tasks                       */
    /* --------------------------------------------- */

    let currentTask = null;
    let taskStartTime = null;

    const TASKS = {
        wake: {
            text: "Please wake me. I am sleepy 😴",
            trigger: () => dog.sleeping,
            complete: () => {
                dog.sleeping = false;
                dog.happiness += 0.1;
                dogTask.innerText = "I am awake now 💜";
            }
        },

        warm: {
            text: "I am cold. Please warm me ❄️",
            trigger: () => dog.warmth < 0.3,
            complete: () => {
                dog.warmth = 1;
                dog.happiness += 0.15;
                dogTask.innerText = "Warm. Thank you 💜";
            }
        },

        smile: {
            text: "Help me smile 😊",
            trigger: () => dog.happiness < 0.4,
            complete: () => {
                dog.happiness = 0.7;
                dogTask.innerText = "I smile now 💜";
            }
        },

        boop: {
            text: "Boop my nose 💫",
            trigger: () => Math.random() < 0.002,
            complete: () => {
                dog.happiness += 0.1;
                dogTask.innerText = "Boop! Hehe 💜";
            }
        },

        hold: {
            text: "Hold me please 🤗",
            trigger: () => Math.random() < 0.002,
            complete: () => {
                dog.happiness += 0.15;
                dogTask.innerText = "Nice hug 💜";
            }
        },

        move: {
            text: "Move me to a soft spot 🌙",
            trigger: () => Math.random() < 0.002,
            complete: () => {
                dog.happiness += 0.1;
                dogTask.innerText = "Soft spot. Thank you 💜";
            }
        },

        breathe: {
            text: "Breathe with me 💜",
            trigger: () => dog.happiness > 0.6 && Math.random() < 0.002,
            complete: () => {
                dog.happiness += 0.1;
                dogTask.innerText = "Good breath 💜";
            }
        },

        corner: {
            text: "Take me to the corner 🌸",
            trigger: () => Math.random() < 0.001,
            complete: () => {
                dog.happiness += 0.1;
                dogTask.innerText = "We found it 💜";
            }
        },

        jump: {
            text: "Help me jump 💫",
            trigger: () => dog.happiness > 0.7 && Math.random() < 0.002,
            complete: () => {
                dog.happiness += 0.1;
                dogTask.innerText = "Big jump! 💜";
            }
        }
    };

    function chooseTask() {
        for (const key in TASKS) {
            if (TASKS[key].trigger()) {
                currentTask = key;
                dogTask.innerText = TASKS[key].text;
                taskStartTime = performance.now();
                return;
            }
        }
    }

    /* --------------------------------------------- */
    /* Hearts                                        */
    /* --------------------------------------------- */
    let hearts = [];

    function spawnHeart() {
        hearts.push({
            x: dog.x + (Math.random() * 20 - 10),
            y: dog.y - dog.size,
            vy: -0.6 - Math.random() * 0.4,
            alpha: 1,
            size: 8 + Math.random() * 6
        });
    }

    function drawHeart(h) {
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.scale(h.size / 10, h.size / 10);
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(-5, -2, -5, -8, 0, -6);
        ctx.bezierCurveTo(5, -8, 5, -2, 0, 3);
        ctx.fillStyle = `rgba(255,255,255,${h.alpha})`;
        ctx.fill();
        ctx.restore();
    }

    /* --------------------------------------------- */
    /* Background Orbs                               */
    /* --------------------------------------------- */
    const orbs = [];
    for (let i = 0; i < 25; i++) {
        orbs.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 10 + Math.random() * 20,
            speed: 0.1 + Math.random() * 0.3,
            alpha: 0.1 + Math.random() * 0.25
        });
    }

    function drawBackground() {
        const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
        g.addColorStop(0, "#e8eaff");
        g.addColorStop(1, "#f4eaff");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        orbs.forEach(o => {
            o.y -= o.speed;
            if (o.y < -30) {
                o.y = canvas.height + 30;
                o.x = Math.random() * canvas.width;
            }
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${o.alpha})`;
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /* --------------------------------------------- */
    /* Draw Cloud Puppy                              */
    /* --------------------------------------------- */
    function drawDog() {
        ctx.save();
        ctx.translate(dog.x, dog.y);
        ctx.scale(dog.facing, 1);

        // Body (white cloud shape)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(0, 0, dog.size, dog.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Perky ears (gray)
        ctx.fillStyle = "#cfcfcf";
        ctx.beginPath();
        ctx.moveTo(-dog.size * 0.6, -dog.size * 0.4);
        ctx.lineTo(-dog.size * 0.3, -dog.size * 0.9);
        ctx.lineTo(-dog.size * 0.1, -dog.size * 0.4);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(dog.size * 0.6, -dog.size * 0.4);
        ctx.lineTo(dog.size * 0.3, -dog.size * 0.9);
        ctx.lineTo(dog.size * 0.1, -dog.size * 0.4);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(-12, -5, 4, 0, Math.PI * 2);
        ctx.arc(12, -5, 4, 0, Math.PI * 2);
        ctx.fill();

        // Nose (charcoal)
        ctx.beginPath();
        ctx.arc(0, 5, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#333";
        ctx.fill();

        // Mouth
        ctx.beginPath();
        ctx.arc(0, 12, 10, 0, Math.PI);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Blush (lavender)
        ctx.fillStyle = "rgba(200,150,255,0.4)";
        ctx.beginPath();
        ctx.ellipse(-18, 5, 10, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(18, 5, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /* --------------------------------------------- */
    /* Mouse Events                                  */
    /* --------------------------------------------- */
    canvas.addEventListener("mousemove", e => {
        const rect = canvas.getBoundingClientRect();
        cursorX = e.clientX - rect.left;
        cursorY = e.clientY - rect.top;
    });

    canvas.addEventListener("mousedown", () => {
        mouseDown = true;
        dog.curled = true;
        dog.lastInteraction = performance.now();
        dog.warmth += 0.02;

        if (currentTask === "hold") TASKS.hold.complete();
        if (currentTask === "warm") TASKS.warm.complete();
    });

    canvas.addEventListener("mouseup", () => {
        mouseDown = false;
        dog.curled = false;
    });

    canvas.addEventListener("click", () => {
        dog.lastInteraction = performance.now();

        if (currentTask === "boop") TASKS.boop.complete();
        if (currentTask === "wake") TASKS.wake.complete();
        if (currentTask === "smile") TASKS.smile.complete();
        if (currentTask === "jump") TASKS.jump.complete();

        dog.jumping = true;
        dog.vy = -8;
    });

    /* --------------------------------------------- */
    /* Update Logic                                  */
    /* --------------------------------------------- */
    function update() {
        const now = performance.now();
        const inactive = now - dog.lastInteraction;

        // Sleep
        if (inactive > 8000) dog.sleeping = true;

        // Jump physics
        if (dog.jumping) {
            dog.y += dog.vy;
            dog.vy += 0.4;
            if (dog.y >= canvas.height / 2) {
                dog.y = canvas.height / 2;
                dog.jumping = false;
            }
        }

        // Follow cursor gently
        const dx = cursorX - dog.x;
        const dy = cursorY - dog.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && !dog.sleeping) {
            dog.x += dx * 0.02;
            dog.y += dy * 0.02;
        }

        // Hearts when holding
        if (mouseDown && Math.random() < 0.3) spawnHeart();

        // Warmth cools down
        dog.warmth -= 0.001;
        if (dog.warmth < 0) dog.warmth = 0;

        // Favorite corner task
        if (currentTask === "corner") {
            if (dog.x < canvas.width * 0.2 && dog.y < canvas.height * 0.2) {
                TASKS.corner.complete();
            }
        }

        // Choose new task if none active
        if (!currentTask || now - taskStartTime > 15000) {
            currentTask = null;
            chooseTask();
        }

        // Hearts update
        hearts.forEach(h => {
            h.y += h.vy;
            h.alpha -= 0.01;
        });
        hearts = hearts.filter(h => h.alpha > 0);
    }

    /* --------------------------------------------- */
    /* Animation Loop                                */
    /* --------------------------------------------- */
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();
        update();
        hearts.forEach(drawHeart);
        drawDog();

        currentGameLoop = requestAnimationFrame(animate);
    }

    animate();
}