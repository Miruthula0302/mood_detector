function startAngryGame() {
    const container = document.getElementById("gameContainer");
    container.innerHTML = "";
    container.style.position = "relative";

    applyMoodEffects("angry");

    let score = 0;
    let highScore = Number(localStorage.getItem("angryHighScore")) || 0;
    let combo = 0;
    let lastHitTime = 0;
    let rageActive = false;
    let frenzyActive = false;
    let vignetteAlpha = 0;
    let flashAlpha = 0;
    let emojiLevel = 0;

    const scoreDiv = document.createElement("div");
    scoreDiv.innerText = "Score: 0";
    scoreDiv.style.cssText = "font-size:26px;font-weight:bold;color:#ff4444;position:absolute;top:10px;left:10px;z-index:10;transition:transform 0.2s ease;";
    container.appendChild(scoreDiv);

    const highScoreDiv = document.createElement("div");
    highScoreDiv.innerText = "High Score: " + highScore;
    highScoreDiv.style.cssText = "font-size:22px;font-weight:bold;color:#ff8800;position:absolute;top:45px;left:10px;z-index:10;";
    container.appendChild(highScoreDiv);

    const comboDiv = document.createElement("div");
    comboDiv.innerText = "Combo: x1";
    comboDiv.style.cssText = "font-size:20px;font-weight:bold;color:#ffaa00;position:absolute;top:10px;right:10px;z-index:10;";
    container.appendChild(comboDiv);

    const emojiDiv = document.createElement("div");
    emojiDiv.innerText = "😐";
    emojiDiv.style.cssText = "font-size:30px;position:absolute;top:45px;right:10px;z-index:10;";
    container.appendChild(emojiDiv);

    const canvas = document.createElement("canvas");
    canvas.style.borderRadius = "16px";
    canvas.style.boxShadow = "0 0 20px rgba(255,0,0,0.3)";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const bubbles = [];
    const MAX_BUBBLES = 12;
    const colors = [
        "rgba(255,99,132,0.8)",
        "rgba(255,159,64,0.8)",
        "rgba(255,205,86,0.8)",
        "rgba(75,192,192,0.8)",
        "rgba(54,162,235,0.8)",
        "rgba(153,102,255,0.8)"
    ];

    function createBubble() {
        return {
            x: Math.random() * (canvas.width - 80) + 40,
            y: Math.random() * (canvas.height - 80) + 40,
            radius: 25 + Math.random() * 25,
            color: colors[Math.floor(Math.random() * colors.length)],
            wobble: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6
        };
    }

    for (let i = 0; i < MAX_BUBBLES; i++) bubbles.push(createBubble());

    const popAnimations = [];
    const comboTexts = [];
    const comboWords = ["Great!", "Boom!", "Awesome!", "Pop!", "Nice!", "Wow!"];
    const blastParticles = [];
    const blastRings = [];
    const lightningBolts = [];

    function drawBubble(b) {
        b.wobble += 0.05;
        const wobbleOffset = Math.sin(b.wobble) * 3;
        const speedFactor = rageActive ? 2 : 1;
        b.x += b.vx * speedFactor;
        b.y += b.vy * speedFactor;
        if (b.x < 40 || b.x > canvas.width - 40) b.vx *= -1;
        if (b.y < 40 || b.y > canvas.height - 40) b.vy *= -1;

        ctx.save();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(b.x + wobbleOffset, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
    }

    function drawPopAnimations() {
        for (let i = popAnimations.length - 1; i >= 0; i--) {
            const p = popAnimations[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.lineWidth = 5;
            ctx.stroke();
            p.radius -= p.shrinkSpeed;
            p.alpha -= 0.05;
            if (p.alpha <= 0 || p.radius <= 0) popAnimations.splice(i, 1);
        }
    }

    function drawComboTexts() {
        for (let i = comboTexts.length - 1; i >= 0; i--) {
            const t = comboTexts[i];
            ctx.font = "bold 28px Comic Sans MS";
            ctx.textAlign = "center";
            ctx.fillStyle = `rgba(255,255,0,${t.alpha})`;
            ctx.strokeStyle = `rgba(0,0,0,${t.alpha})`;
            ctx.lineWidth = 3;
            ctx.strokeText(t.text, t.x, t.y);
            ctx.fillText(t.text, t.x, t.y);
            t.y -= t.riseSpeed;
            t.alpha -= 0.02;
            if (t.alpha <= 0) comboTexts.splice(i, 1);
        }
    }

    function triggerFullScreenBlast(originX, originY, mega = false) {
        flashAlpha = mega ? 0.9 : 0.5;
        blastRings.push({
            x: originX,
            y: originY,
            radius: 20,
            alpha: 1,
            mega
        });
        const count = mega ? 200 : 80;
        for (let i = 0; i < count; i++) {
            blastParticles.push({
                x: originX,
                y: originY,
                size: (mega ? 10 : 8) + Math.random() * (mega ? 14 : 10),
                vx: (Math.random() - 0.5) * (mega ? 18 : 12),
                vy: (Math.random() - 0.5) * (mega ? 18 : 12),
                alpha: 1,
                color: `rgba(${200 + Math.random()*55},${50 + Math.random()*50},0,`
            });
        }
    }

    function drawBlastEffects() {
        if (flashAlpha > 0) {
            ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            flashAlpha -= 0.03;
        }
        for (let i = blastParticles.length - 1; i >= 0; i--) {
            const p = blastParticles[i];
            ctx.beginPath();
            ctx.fillStyle = p.color + p.alpha + ")";
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            p.size *= 0.95;
            if (p.alpha <= 0) blastParticles.splice(i, 1);
        }
        for (let i = blastRings.length - 1; i >= 0; i--) {
            const r = blastRings[i];
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${r.alpha})`;
            ctx.lineWidth = r.mega ? 10 : 8;
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.stroke();
            r.radius += r.mega ? 20 : 12;
            r.alpha -= 0.03;
            if (r.alpha <= 0) blastRings.splice(i, 1);
        }
    }

    function triggerLightning(x, y) {
        const segments = [];
        const startX = x + (Math.random() - 0.5) * 100;
        let curX = startX;
        let curY = 0;
        while (curY < y) {
            const nextX = curX + (Math.random() - 0.5) * 60;
            const nextY = curY + 40 + Math.random() * 30;
            segments.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });
            curX = nextX;
            curY = nextY;
        }
        lightningBolts.push({ segments, alpha: 1 });
    }

    function drawLightning() {
        for (let i = lightningBolts.length - 1; i >= 0; i--) {
            const bolt = lightningBolts[i];
            ctx.strokeStyle = `rgba(255,255,255,${bolt.alpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            bolt.segments.forEach((s, idx) => {
                if (idx === 0) ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
            });
            ctx.stroke();
            bolt.alpha -= 0.05;
            if (bolt.alpha <= 0) lightningBolts.splice(i, 1);
        }
    }

    function drawVignette() {
        if (vignetteAlpha <= 0) return;
        const grd = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            Math.min(canvas.width, canvas.height) / 4,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height) / 1.2
        );
        grd.addColorStop(0, "rgba(0,0,0,0)");
        grd.addColorStop(1, `rgba(180,0,0,${vignetteAlpha})`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!rageActive) vignetteAlpha = Math.max(0, vignetteAlpha - 0.01);
    }

    function updateEmoji() {
        let level = 0;
        if (score >= 60 && score < 120) level = 1;
        else if (score >= 120 && score < 200) level = 2;
        else if (score >= 200) level = 3;
        if (level !== emojiLevel) {
            emojiLevel = level;
            emojiDiv.innerText = ["😐", "😠", "😡", "🤬"][emojiLevel];
        }
    }

    function triggerRage() {
        if (rageActive) return;
        rageActive = true;
        vignetteAlpha = 0.5;
        comboDiv.style.color = "#ff3300";
        setTimeout(() => {
            rageActive = false;
            comboDiv.style.color = "#ffaa00";
        }, 5000);
    }

    function triggerFrenzy() {
        frenzyActive = true;
        for (let i = 0; i < 20; i++) bubbles.push(createBubble());
        setTimeout(() => {
            frenzyActive = false;
            while (bubbles.length > MAX_BUBBLES) bubbles.pop();
        }, 3000);
    }

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        bubbles.forEach((b, i) => {
            const dist = Math.hypot(b.x - x, b.y - y);
            if (dist < b.radius) {
                const now = performance.now();
                if (now - lastHitTime < 800) combo++;
                else combo = 1;
                lastHitTime = now;
                const points = rageActive ? 2 : 1;
                score += points;
                scoreDiv.innerText = "Score: " + score;
                comboDiv.innerText = "Combo: x" + combo;

                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("angryHighScore", highScore);
                    highScoreDiv.innerText = "High Score: " + highScore;
                }

                scoreDiv.style.transform = "scale(1.2)";
                setTimeout(() => (scoreDiv.style.transform = "scale(1)"), 150);

                popAnimations.push({
                    x: b.x,
                    y: b.y,
                    radius: b.radius,
                    alpha: 1,
                    shrinkSpeed: 0.5
                });

                comboTexts.push({
                    text: comboWords[Math.floor(Math.random() * comboWords.length)],
                    x: b.x,
                    y: b.y,
                    alpha: 1,
                    riseSpeed: 1.2
                });

                if (score % 10 === 0) triggerFullScreenBlast(b.x, b.y, false);
                if (score % 50 === 0) triggerFullScreenBlast(b.x, b.y, true);
                if (score % 25 === 0) triggerRage();
                if (score % 40 === 0) triggerFrenzy();
                if (rageActive) triggerLightning(b.x, b.y);

                updateEmoji();
                bubbles[i] = createBubble();
            }
        });
    });

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach(drawBubble);
        drawPopAnimations();
        drawBlastEffects();
        drawComboTexts();
        drawLightning();
        drawVignette();
        requestAnimationFrame(render);
    }

    render();
}