function startHappyGame() {
    const gameContainer = document.getElementById("gameContainer");
    gameContainer.innerHTML = "";

    applyMoodEffects("happy");

    document.onkeydown = null;
    document.onkeyup = null;

    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    gameContainer.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = gameContainer.clientWidth;
        canvas.height = gameContainer.clientHeight;

        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ⭐ Dancer object
    const dancer = {
        x: canvas.width / 2,
        y: canvas.height - 180,
        baseY: canvas.height - 180,
        size: 50,
        angle: 0,
        targetAngle: 0,
        jumpOffset: 0,
        targetJump: 0,
        crouchOffset: 0,
        targetCrouch: 0,
        speed: 7,            // ⭐ Horizontal movement speed
        sideBounce: 0,       // ⭐ Cute bounce when sliding
        targetSideBounce: 0
    };

    const sparkles = [];

    function createSparkle(x, y, color = "255, 215, 0") {
        return {
            x,
            y,
            size: 5 + Math.random() * 7,
            alpha: 1,
            fade: 0.02,
            dx: (Math.random() - 0.5) * 2,
            dy: -1.2 - Math.random(),
            color
        };
    }

    let keys = {};
    let instructionText = "Press ↑ ↓ ← → to Dance!";
    let textPulse = 0;
    let lastMoveTime = 0;

    document.addEventListener("keydown", e => {
        keys[e.key] = true;
        handleDanceMove(e.key);
    });

    document.addEventListener("keyup", e => {
        keys[e.key] = false;
    });

    function handleDanceMove(key) {
        const now = Date.now();
        if (now - lastMoveTime < 80) return;
        lastMoveTime = now;

        if (key === "ArrowUp") {
            instructionText = "Jump!";
            dancer.targetJump = -60;
            dancer.targetCrouch = 0;

            for (let i = 0; i < 12; i++) {
                sparkles.push(createSparkle(dancer.x, dancer.baseY - 100, "135, 206, 250"));
            }

        } else if (key === "ArrowDown") {
            instructionText = "Crouch!";
            dancer.targetCrouch = 30;
            dancer.targetJump = 0;

            for (let i = 0; i < 10; i++) {
                sparkles.push(createSparkle(dancer.x, dancer.baseY - 20, "144, 238, 144"));
            }

        } else if (key === "ArrowLeft") {
            instructionText = "Slide Left!";
            dancer.targetAngle -= Math.PI / 2;
            dancer.targetSideBounce = -10;

            for (let i = 0; i < 14; i++) {
                sparkles.push(createSparkle(dancer.x - 60, dancer.baseY - 40, "255, 182, 193"));
            }

        } else if (key === "ArrowRight") {
            instructionText = "Slide Right!";
            dancer.targetAngle += Math.PI / 2;
            dancer.targetSideBounce = 10;

            for (let i = 0; i < 14; i++) {
                sparkles.push(createSparkle(dancer.x + 60, dancer.baseY - 40, "221, 160, 221"));
            }
        }
    }

    function drawDancer() {
        dancer.angle += (dancer.targetAngle - dancer.angle) * 0.2;
        dancer.jumpOffset += (dancer.targetJump - dancer.jumpOffset) * 0.2;
        dancer.crouchOffset += (dancer.targetCrouch - dancer.crouchOffset) * 0.2;
        dancer.sideBounce += (dancer.targetSideBounce - dancer.sideBounce) * 0.2;

        const yPos = dancer.baseY + dancer.jumpOffset + dancer.crouchOffset;

        ctx.save();
        ctx.translate(dancer.x, yPos);
        ctx.rotate(dancer.angle);

        ctx.shadowColor = "#ff66cc";
        ctx.shadowBlur = 25;

        ctx.strokeStyle = "#ff66cc";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";

        // Body
        ctx.beginPath();
        ctx.moveTo(0, -10 + dancer.sideBounce);
        ctx.lineTo(0, 50 + dancer.sideBounce);
        ctx.stroke();

        // Arms
        const armAngle = Math.sin(Date.now() * 0.005) * 0.3;

        ctx.beginPath();
        ctx.moveTo(0, 10 + dancer.sideBounce);
        ctx.lineTo(50 * Math.cos(armAngle), 10 + 50 * Math.sin(armAngle) + dancer.sideBounce);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 10 + dancer.sideBounce);
        ctx.lineTo(-50 * Math.cos(armAngle), 10 + 50 * Math.sin(armAngle) + dancer.sideBounce);
        ctx.stroke();

        // Legs
        const legSpread = dancer.jumpOffset < 0 ? 35 : 15;

        ctx.beginPath();
        ctx.moveTo(0, 50 + dancer.sideBounce);
        ctx.lineTo(legSpread, 100 + dancer.sideBounce);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 50 + dancer.sideBounce);
        ctx.lineTo(-legSpread, 100 + dancer.sideBounce);
        ctx.stroke();

        // Head
        ctx.fillStyle = "#ff66cc";
        ctx.beginPath();
        ctx.arc(0, -40 + dancer.sideBounce, 25, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(-8, -45 + dancer.sideBounce, 4, 0, Math.PI * 2);
        ctx.arc(8, -45 + dancer.sideBounce, 4, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -35 + dancer.sideBounce, 10, 0, Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    function drawSparkles() {
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();

            s.alpha -= s.fade;
            s.x += s.dx;
            s.y += s.dy;

            if (s.alpha <= 0) {
                sparkles.splice(i, 1);
            }
        }
    }

    function drawText() {
        textPulse += 0.05;
        const scale = 1 + Math.sin(textPulse) * 0.06;

        ctx.save();
        ctx.translate(canvas.width / 2, 70);
        ctx.scale(scale, scale);

        ctx.fillStyle = "#ff33aa";
        ctx.font = "32px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillText(instructionText, 0, 0);

        ctx.restore();
    }

    function drawFloor() {
        const stripeHeight = 40;
        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = i % 2 === 0 ? "#ffe4f7" : "#e0f7ff";
            ctx.fillRect(0, canvas.height - (i + 1) * stripeHeight, canvas.width, stripeHeight);
        }
    }

    function update() {
        let didMove = false;

        // Jump
        if (keys["ArrowUp"]) {
            dancer.targetJump = -60;
            didMove = true;

            for (let i = 0; i < 4; i++) {
                sparkles.push(createSparkle(dancer.x, dancer.baseY - 100, "135, 206, 250"));
            }
        } else {
            dancer.targetJump = 0;
        }

        // Crouch
        if (keys["ArrowDown"]) {
            dancer.targetCrouch = 35;
            didMove = true;

            for (let i = 0; i < 4; i++) {
                sparkles.push(createSparkle(dancer.x, dancer.baseY - 20, "144, 238, 144"));
            }
        } else {
            dancer.targetCrouch = 0;
        }

        // ⭐ LEFT movement
        if (keys["ArrowLeft"]) {
            dancer.x -= dancer.speed;
            dancer.targetSideBounce = -10;
            didMove = true;

            dancer.x = Math.max(50, dancer.x);

            for (let i = 0; i < 4; i++) {
                sparkles.push(createSparkle(dancer.x - 60, dancer.baseY - 40, "255, 182, 193"));
            }
        }

        // ⭐ RIGHT movement
        if (keys["ArrowRight"]) {
            dancer.x += dancer.speed;
            dancer.targetSideBounce = 10;
            didMove = true;

            dancer.x = Math.min(canvas.width - 50, dancer.x);

            for (let i = 0; i < 4; i++) {
                sparkles.push(createSparkle(dancer.x + 60, dancer.baseY - 40, "221, 160, 221"));
            }
        }

        // Reset bounce when not sliding
        if (!keys["ArrowLeft"] && !keys["ArrowRight"]) {
            dancer.targetSideBounce = 0;
        }

        instructionText = didMove
            ? "Great moves!"
            : "Press ↑ ↓ ← → to Dance!";

        if (Math.random() < 0.03) {
            sparkles.push(createSparkle(dancer.x, dancer.baseY - 50, "255, 215, 0"));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawFloor();
        drawText();
        drawDancer();
        drawSparkles();
        update();

        requestAnimationFrame(animate);
    }

    animate();
}