function startNeutralGame() {
    const messageDiv = document.getElementById("encouragementMessage");
    messageDiv.innerText = "Relax and doodle something fun 🎨";

    const container = document.getElementById("gameContainer");
    container.innerHTML = "";

    // ✅ MAIN LAYOUT (canvas left, colors right)
    container.style.display = "flex";
    container.style.gap = "20px";
    container.style.alignItems = "flex-start";

    // ✅ COLOR PANEL (right side)
    const colors = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#3742fa", "#a55eea", "#ffffff", "#000000"];
    let currentColor = null;

    const colorPanel = document.createElement("div");
    colorPanel.style.display = "flex";
    colorPanel.style.flexDirection = "column";
    colorPanel.style.gap = "10px";
    colorPanel.style.padding = "10px";
    colorPanel.style.border = "2px solid #ccc";
    colorPanel.style.borderRadius = "10px";
    colorPanel.style.background = "#f7f7f7";

    const title = document.createElement("div");
    title.innerText = "Colors";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "5px";
    colorPanel.appendChild(title);

    colors.forEach(col => {
        const btn = document.createElement("div");
        btn.style.width = "30px";
        btn.style.height = "30px";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.border = "2px solid #333";
        btn.style.background = col;

        btn.onclick = () => {
            currentColor = col;
            messageDiv.innerText = "Color selected! 🎨";
        };

        colorPanel.appendChild(btn);
    });

    // ✅ CANVAS (left side)
    const canvasWrapper = document.createElement("div");
    canvasWrapper.style.display = "flex";
    canvasWrapper.style.flexDirection = "column";
    canvasWrapper.style.gap = "10px";

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.border = "2px solid #ccc";
    canvasWrapper.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000"; // ✅ default color

    let drawing = false;
    let strokeCount = 0;
    let hue = 0;
    const sparkles = [];

    // ✅ Start drawing
    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        ctx.beginPath();

        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    // ✅ Stop drawing
    canvas.addEventListener("mouseup", () => {
        drawing = false;
        strokeCount++;

        if (strokeCount === 10) {
            showReward("Beautiful doodles! You earned a Creativity Badge 🎗️");
        }
    });

    canvas.addEventListener("mouseleave", () => drawing = false);

    // ✅ Drawing movement
    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (currentColor) {
            ctx.strokeStyle = currentColor;
        } else {
            hue = (hue + 2) % 360;
            ctx.strokeStyle = `hsl(${hue}, 80%, 40%)`;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        sparkles.push({
            x,
            y,
            size: 2 + Math.random() * 3,
            life: 20,
            color: currentColor || `hsl(${hue}, 90%, 70%)`
        });
    });

    // ✅ Clear button
    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear Drawing";
    clearBtn.className = "play-again";
    clearBtn.onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokeCount = 0;
        messageDiv.innerText = "Canvas cleared! Try a new doodle ✏️";
    };
    canvasWrapper.appendChild(clearBtn);

    // ✅ Add both sections to container
    container.appendChild(canvasWrapper);
    container.appendChild(colorPanel);

    // ✅ Sparkle animation
    function drawSparkles() {
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.life--;

            ctx.globalAlpha = s.life / 20;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            if (s.life <= 0) sparkles.splice(i, 1);
        }

        requestAnimationFrame(drawSparkles);
    }

    drawSparkles();
}