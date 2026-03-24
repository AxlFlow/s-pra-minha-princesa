const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// tela
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener("resize", () => {
  resizeCanvas();
  generateHeart();
  syncParticles();
});

// variáveis
let particles = [];
let heartPoints = [];

let formingHeart = false;
let exploded = false;
let fadeOut = false;

// 💬 SUA MENSAGEM (EDITE AQUI)
const mensagemFinal =
"Esse site é dedicado a minha princesa, Amandha de Quadros 💚\n\n" + 
"Eu te amo de uma forma que eu não consigo explicar\n" +
 "Eu sempre vou te amar, não importa o que aconteça\n" +
  "Voce é a mulher com quem eu sempre sonhei, cada momento com voce parece um sonho do qual eu nunca quero acordar\n\n" +
"Estou com saudades da minha princesinha💚\n"

// 💚 coração
function heartFunction(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y: -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
  };
}

// gerar coração
function generateHeart() {
  heartPoints = [];

  let scale = Math.min(canvas.width, canvas.height) / 45;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let t = 0; t < Math.PI * 2; t += 0.02) {
    let pos = heartFunction(t);

    heartPoints.push({
      x: centerX + pos.x * scale,
      y: centerY + pos.y * scale
    });
  }
}

// sincronizar partículas (otimizado pra celular)
function syncParticles() {
  particles = [];

  const maxParticles = window.innerWidth < 600 ? 700 : heartPoints.length;

  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1
    });
  }
}

// animação
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    if (!heartPoints[i]) return;

    if (!exploded) {
      p.x += p.vx;
      p.y += p.vy;
    }

    if (formingHeart) {
      p.x += (heartPoints[i].x - p.x) * 0.08;
      p.y += (heartPoints[i].y - p.y) * 0.08;
    }

    if (fadeOut) {
      p.life -= 0.01;
    }

    if (p.life <= 0) return;

    ctx.fillStyle = `rgba(0,255,136,${p.life})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

// mostrar texto
function mostrarTextoFinal() {
  const el = document.getElementById("textoFinal");
  el.innerHTML = mensagemFinal.replace(/\n/g, "<br>");
  el.style.opacity = 1;
}

// iniciar
generateHeart();
syncParticles();
animate();

// botão
document.getElementById("startBtn").onclick = () => {
  document.getElementById("tela-inicial").style.display = "none";

  // 🎵 tocar música (funciona no iPhone por causa do clique)
  const iframe = document.getElementById("player");
  iframe.src = "https://www.youtube.com/embed/WiinVuzh4DA?autoplay=1&playsinline=1";

  setTimeout(() => exploded = true, 300);
  setTimeout(() => formingHeart = true, 1200);

  setTimeout(() => fadeOut = true, 5000);

  setTimeout(() => {
    mostrarTextoFinal();
  }, 6500);
};