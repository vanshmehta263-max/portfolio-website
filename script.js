
// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
});

document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.textContent = "☰";
    });
});

// AUTOMATIC COPYRIGHT YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// SCROLL REVEAL ANIMATION
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

document.querySelectorAll(
    ".hero-content, .hero-visual, .content-section, .contact-section"
).forEach(element => {
    element.classList.add("reveal");
    observer.observe(element);
});

// 3D LOGO MOUSE MOVEMENT
const logoStage = document.querySelector(".logo-stage");

document.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 760) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 20;
    const y = (event.clientY / window.innerHeight - 0.5) * 20;

    logoStage.style.transform =
        `translateY(-8px) rotateY(${x}deg) rotateX(${-y}deg)`;
});

document.addEventListener("mouseleave", () => {
    logoStage.style.transform = "";
});


// ======================================
// PREMIUM 3D ORBITAL SCULPTURE BACKGROUND
// ======================================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let W, H;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let animationId;

const isMobile = () => window.innerWidth < 700;

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);

window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / W - 0.5) * 2;
    targetY = (e.clientY / H - 0.5) * 2;
});

// 3D ROTATION
function rotate3D(p, ax, ay, az) {
    let { x, y, z } = p;

    let cos = Math.cos(ax);
    let sin = Math.sin(ax);

    let y1 = y * cos - z * sin;
    let z1 = y * sin + z * cos;

    y = y1;
    z = z1;

    cos = Math.cos(ay);
    sin = Math.sin(ay);

    let x1 = x * cos + z * sin;
    z1 = -x * sin + z * cos;

    x = x1;
    z = z1;

    cos = Math.cos(az);
    sin = Math.sin(az);

    x1 = x * cos - y * sin;
    y1 = x * sin + y * cos;

    return { x: x1, y: y1, z };
}

// PERSPECTIVE PROJECTION
function project(p) {
    const camera = isMobile() ? 6.8 : 7.5;
    const depth = camera / (camera - p.z);

    return {
        x: W / 2 + p.x * depth * Math.min(W, H) * 0.105,
        y: H * 0.48 + p.y * depth * Math.min(W, H) * 0.105,
        depth
    };
}

// DRAW 3D LINE
function drawLine(a, b, color, opacity = 1, thickness = 1) {
    const p1 = project(a);
    const p2 = project(b);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity *
        Math.min(1, (p1.depth + p2.depth) / 2);

    ctx.lineWidth = thickness;
    ctx.stroke();

    ctx.globalAlpha = 1;
}

// ORBITAL RINGS
function drawOrbit(time, radius, tilt, rotation, color) {
    const points = [];
    const segments = 120;

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;

        const point = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
            z: 0
        };

        points.push(
            rotate3D(
                point,
                tilt + Math.sin(time * 0.3) * 0.08,
                rotation,
                time * 0.15
            )
        );
    }

    for (let i = 0; i < segments; i++) {
        drawLine(points[i], points[i + 1], color, 0.48, 1);
    }
}

// PARAMETRIC 3D KNOT
function drawKnot(time) {
    const major = isMobile() ? 1.05 : 1.35;
    const tube = 0.38;
    const rings = 100;
    const sides = 12;

    const vertices = [];

    for (let i = 0; i <= rings; i++) {
        const t = (i / rings) * Math.PI * 2;

        const centerRadius = major + tube * Math.cos(3 * t);

        const center = {
            x: centerRadius * Math.cos(2 * t),
            y: centerRadius * Math.sin(2 * t),
            z: tube * Math.sin(3 * t)
        };

        const row = [];

        for (let j = 0; j <= sides; j++) {
            const u = (j / sides) * Math.PI * 2;

            const point = {
                x: center.x + 0.09 * Math.cos(u) * Math.cos(2 * t),
                y: center.y + 0.09 * Math.cos(u) * Math.sin(2 * t),
                z: center.z + 0.09 * Math.sin(u)
            };

            row.push(
                rotate3D(
                    point,
                    time * 0.18 + mouseY * 0.18,
                    time * 0.23 + mouseX * 0.18,
                    time * 0.12
                )
            );
        }

        vertices.push(row);
    }

    // Tube structure
    for (let i = 0; i < rings; i++) {
        for (let j = 0; j < sides; j++) {
            const a = vertices[i][j];
            const b = vertices[i + 1][j];
            const c = vertices[i][j + 1];

            const depth = (a.z + b.z) / 2;

            const color = depth > 0
                ? "#70dfff"
                : "#a17aff";

            drawLine(a, b, color, 0.48, 0.85);
            drawLine(a, c, color, 0.30, 0.65);
        }
    }
}

// BACKGROUND GLOW
function drawGlow() {
    const gradient = ctx.createRadialGradient(
        W / 2, H * 0.48, 10,
        W / 2, H * 0.48, Math.min(W, H) * 0.48
    );

    gradient.addColorStop(0, "rgba(91, 61, 190, 0.10)");
    gradient.addColorStop(0.5, "rgba(37, 101, 190, 0.035)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
}

// MAIN ANIMATION
function animate(time) {
    const t = time * 0.001;

    mouseX += (targetX - mouseX) * 0.035;
    mouseY += (targetY - mouseY) * 0.035;

    ctx.clearRect(0, 0, W, H);

    drawGlow();

    // Three-dimensional orbital rings
    drawOrbit(t, 2.5, 1.2, 0.5, "#9872ff");
    drawOrbit(t, 2.15, 0.5, 1.2, "#46cfff");
    drawOrbit(t, 2.8, 1.8, 0.8, "#8762ec");

    // Floating 3D geometric knot
    drawKnot(t);

    animationId = requestAnimationFrame(animate);
}

// START
resize();
animate(0);

// SAVE PERFORMANCE WHEN TAB IS HIDDEN
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(animate);
    }
});

// Connecting nearby particles
for (let j = index + 1; j < particles.length; j++) {
    const other = particles[j];

    const dx = particle.x - other.x;
    const dy = particle.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 105) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);

        ctx.strokeStyle =
            `rgba(130, 110, 255, ${0.12 * (1 - distance / 105)})`;

        ctx.lineWidth = 0.6;
        ctx.stroke();
    }
}
    

animationFrame = requestAnimationFrame(animateBackground);


window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animateBackground();

// CLEAN UP ANIMATION WHEN PAGE IS HIDDEN
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        cancelAnimationFrame(animationFrame);
    } else {
        cancelAnimationFrame(animationFrame);
        animateBackground();
    }
});
