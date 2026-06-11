// ══════════════════════════════════════════════════════════
//  SCRIPT PRINCIPAL — Site Romântico
// ══════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  iniciarSite();
  iniciarContador();
  iniciarReveal();
  carregarGaleria()
  carregarMotivos();
  carregarArvore();
  carregarCapsulas();
  criarParticulas();
  iniciarQuiz();
  iniciarCanvas();

});

// ══════════════════════════════════════════════════════════
//  CANVAS — CORAÇÕES FLUTUANTES
// ══════════════════════════════════════════════════════════

function iniciarCanvas() {
  const canvas = document.getElementById("heartCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let romanticMode = false;

  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  class Heart {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = H + 20;
      this.size = Math.random() * 14 + 6;
      this.speed = Math.random() * 1.2 + 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.03 + 0.01;
      this.color = Math.random() > 0.5 ? "#E63946" : "#FFB6C1";
    }
    update() {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.8;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      const s = this.size / 10;
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.bezierCurveTo(5, -10, 12, -2, 0, 7);
      ctx.bezierCurveTo(-12, -2, -5, -10, 0, -4);
      ctx.fill();
      ctx.restore();
    }
  }

  const hearts = Array.from({ length: 40 }, () => {
    const h = new Heart();
    h.y = Math.random() * H; // distribuição inicial
    return h;
  });

  function animate() {
    ctx.clearRect(0, 0, W, H);
    const count = romanticMode ? hearts.length : Math.floor(hearts.length * 0.4);
    for (let i = 0; i < count; i++) {
      hearts[i].update();
      hearts[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();

  // Expor para o modo romântico
  window.setRomanticCanvas = (on) => { romanticMode = on; };
}

// ══════════════════════════════════════════════════════════
//  TELA INICIAL
// ══════════════════════════════════════════════════════════

function iniciarSite() {
  const btn = document.getElementById("btnEnter");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const splash = document.getElementById("splash");
    splash.style.transition = "opacity 1s ease";
    splash.style.opacity = "0";

    setTimeout(() => {
      splash.style.display = "none";
      document.querySelectorAll(".section, .navbar")
        .forEach(el => el.classList.remove("hidden"));
      window.scrollTo({ top: 0, behavior: "smooth" });
      iniciarReveal();
    }, 900);
  });

  // Modo Romântico Máximo
  const btnRomantic = document.getElementById("btnRomanticMode");
  if (btnRomantic) {
    btnRomantic.addEventListener("click", ativarModoRomantico);
  }
}

// ══════════════════════════════════════════════════════════
//  MODO ROMÂNTICO MÁXIMO
// ══════════════════════════════════════════════════════════

let modoRomaticoAtivo = false;

function ativarModoRomantico() {
  modoRomaticoAtivo = !modoRomaticoAtivo;
  document.body.classList.toggle("romantic-mode", modoRomaticoAtivo);

  if (window.setRomanticCanvas) window.setRomanticCanvas(modoRomaticoAtivo);

  if (modoRomaticoAtivo) {
    chuvaDeCoracoes();
    document.getElementById("btnRomanticMode").style.boxShadow = "0 0 60px rgba(230,57,70,1)";
  } else {
    document.getElementById("btnRomanticMode").style.boxShadow = "";
  }
}

function chuvaDeCoracoes() {
  if (!modoRomaticoAtivo) return;
  const emojis = ["❤️", "💖", "💕", "💗", "💓", "🌹", "✨"];
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position:fixed; top:-40px;
        left:${Math.random()*100}vw;
        font-size:${Math.random()*24+16}px;
        pointer-events:none; z-index:9999;
        animation: confettiFall ${Math.random()*4+4}s linear forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 8000);
    }, i * 150);
  }
  setTimeout(chuvaDeCoracoes, 800);
}

// ══════════════════════════════════════════════════════════
//  PÉTALAS DA TELA INICIAL
// ══════════════════════════════════════════════════════════

function criarParticulas() {
  const container = document.getElementById("splashPetals");
  if (!container) return;

  setInterval(() => {
    const petal = document.createElement("div");
    petal.textContent = ["🌸", "🌺", "❤️", "✨"][Math.floor(Math.random() * 4)];
    const size = Math.random() * 18 + 14;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 5 + 6;

    petal.style.cssText = `
      position:fixed; left:${startX}px; top:-50px;
      font-size:${size}px; pointer-events:none; z-index:1;
    `;
    container.appendChild(petal);

    petal.animate([
      { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${Math.random()*200-100}px, ${window.innerHeight+100}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
    ], { duration: duration * 1000, easing: "linear" });

    setTimeout(() => petal.remove(), duration * 1000);
  }, 350);
}

// ══════════════════════════════════════════════════════════
//  CONTADOR DE AMOR
// ══════════════════════════════════════════════════════════

function iniciarContador() {
  // ★ ALTERE AQUI a data de início do relacionamento
  const dataInicio = new Date("2025-12-18T00:00:00");

  function atualizar(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(valor).padStart(2, "0");
  }

  function tick() {
    const diff = new Date() - dataInicio;
    if (diff < 0) return;
    const dias    = Math.floor(diff / 86400000);
    const horas   = Math.floor(diff / 3600000) % 24;
    const minutos = Math.floor(diff / 60000) % 60;
    const segs    = Math.floor(diff / 1000) % 60;
    atualizar("cDays",    dias);
    atualizar("cHours",   horas);
    atualizar("cMinutes", minutos);
    atualizar("cSeconds", segs);
  }

  tick();
  setInterval(tick, 1000);
}

// ══════════════════════════════════════════════════════════
//  REVEAL AO SCROLL
// ══════════════════════════════════════════════════════════

// ==========================================
// REVEAL SCROLL
// ==========================================

function iniciarReveal() {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.1
    });

    document.querySelectorAll(".reveal").forEach((el) => {
        observer.observe(el);
    });

}


// ==========================================
// TIMELINE MODAL
// ==========================================

// ==========================================
// REVEAL SCROLL
// ==========================================


// ==========================================
// TIMELINE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    iniciarReveal();

    const textos = {
        modal1: {
            titulo: "Como Nos Conhecemos",
            texto: "Escreva aqui a história completa de como vocês se conheceram."
        },
        modal2: {
            titulo: "Primeiro Encontro",
            texto: "Escreva aqui os detalhes do primeiro encontro."
        },
        modal3: {
            titulo: "Primeiro Beijo",
            texto: "Escreva aqui a história do primeiro beijo."
        },
        modal4: {
            titulo: "Nossas Aventuras",
            texto: "Escreva aqui as viagens e momentos especiais."
        },
        modal5: {
            titulo: "Hoje e Para Sempre",
            texto: "Escreva aqui sua mensagem especial."
        }
    };

    // Cria overlay automaticamente
   // Cria overlay apenas se não existir
let overlay = document.getElementById("modalOverlay");

if (!overlay) {

    overlay = document.createElement("div");

    overlay.id = "modalOverlay";
    overlay.className = "modal-overlay";

    document.body.appendChild(overlay);
}

    // Cria modal automaticamente
    const modal = document.createElement("div");
    modal.id = "timelineModal";
    modal.className = "timeline-modal";

    modal.innerHTML = `
        <button class="close-modal">&times;</button>
        <h2 id="timelineModalTitle"></h2>
        <p id="timelineModalText"></p>
    `;

    document.body.appendChild(modal);

    document.querySelectorAll(".btn-details").forEach((btn) => {

        btn.addEventListener("click", (e) => {

            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest(".timeline-card");

            if (!card) return;

            const modalId = card.dataset.modal;

            document.getElementById("timelineModalTitle").textContent =
                textos[modalId]?.titulo || "";

            document.getElementById("timelineModalText").textContent =
                textos[modalId]?.texto || "";

            overlay.classList.add("show");
            modal.classList.add("show");

            document.body.style.overflow = "hidden";
        });

    });

    overlay.addEventListener("click", closeModal);

    modal.querySelector(".close-modal")
        .addEventListener("click", closeModal);

});

function closeModal() {

    const overlay = document.getElementById("modalOverlay");
    const modal = document.getElementById("timelineModal");

    if (modal) {
        modal.classList.remove("show");
    }

    if (overlay) {
        overlay.classList.remove("show");
    }

    document.body.style.overflow = "";
}
// ==========================================
// FECHAR CLICANDO FORA
// ==========================================

document.addEventListener("click", (e) => {

    const overlay = document.getElementById("modalOverlay");

    if (e.target === overlay) {
        closeModal();
    }

});

// ==========================================
// FECHAR COM ESC
// ==========================================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        closeModal();
    }

});

// ==========================================
// GALERIA

// ==========================================

// ==========================================
// GALERIA
// ==========================================

let currentImage = 0;

// ==========================================
// CARREGAR GALERIA
// ==========================================

async function carregarGaleria() {



    console.log("Iniciando galeria");

    const grid = document.getElementById("galleryGrid");

    if (!grid) {
        console.error("galleryGrid não encontrado");
        return;
    }

    try {

        const response = await fetch("fotos.json");

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("JSON:", data);

        const fotos = data.galeria || data;

        grid.innerHTML = "";

        fotos.forEach(foto => {

            console.log("Foto:", foto);

            grid.innerHTML += `
                <div class="gallery-item" data-src="${foto.url}">
                    <img src="${foto.url}" alt="${foto.titulo}">
                </div>
            `;

        });

    } catch(err) {

        console.error(err);

    }
}

// ==========================================
// LIGHTBOX
// ==========================================

function openLightbox(btn) {

    const item = btn.closest(".gallery-item");

    if (!item) return;

    const items =
        document.querySelectorAll(".gallery-item");

    currentImage =
        [...items].indexOf(item);

    document.getElementById("lightboxImg").src =
        item.dataset.src;

    document
        .getElementById("lightbox")
        .classList.add("show");

    document.body.style.overflow = "hidden";
}

function closeLightbox() {

    document
        .getElementById("lightbox")
        .classList.remove("show");

    document.body.style.overflow = "";
}

function lightboxNav(dir, e) {

    if (e) e.stopPropagation();

    const items =
        document.querySelectorAll(".gallery-item");

    currentImage += dir;

    if (currentImage < 0)
        currentImage = items.length - 1;

    if (currentImage >= items.length)
        currentImage = 0;

    document.getElementById("lightboxImg").src =
        items[currentImage].dataset.src;
}

document.addEventListener("DOMContentLoaded", () => {

    const btnSlideshow =
        document.getElementById("btnSlideshow");

    if (btnSlideshow) {

        btnSlideshow.addEventListener("click", () => {
            toggleSlideshow();
        });

    }

});






// ==========================================
// SLIDESHOW
// ==========================================

let slideshowInterval = null;
let slideshowRunning = false;

function toggleSlideshow() {

    const items = document.querySelectorAll(".gallery-item");

    if (items.length === 0) {
        alert("Nenhuma foto encontrada na galeria.");
        return;
    }

    const btn = document.getElementById("btnSlideshow");

    if (!slideshowRunning) {

        slideshowRunning = true;

        btn.innerHTML =
            '<i class="fas fa-pause"></i> Parar';

        currentImage = 0;

        document.getElementById("lightboxImg").src =
            items[currentImage].dataset.src;

        document.getElementById("lightbox")
            .classList.add("show");

        slideshowInterval = setInterval(() => {

            currentImage++;

            if (currentImage >= items.length) {
                currentImage = 0;
            }

            document.getElementById("lightboxImg").src =
                items[currentImage].dataset.src;

        }, 3000);

    } else {

        slideshowRunning = false;

        clearInterval(slideshowInterval);

        btn.innerHTML =
            '<i class="fas fa-play"></i> Slideshow';

        closeLightbox();
    }
}


// ══════════════════════════════════════════════════════════
//  CARTAS DE AMOR
// ══════════════════════════════════════════════════════════

function openEnvelope(el) {
  // Fecha outras abertas
  document.querySelectorAll(".envelope.open").forEach(env => {
    if (env !== el) env.classList.remove("open");
  });
  el.classList.toggle("open");
}

// ══════════════════════════════════════════════════════════
//  PLAYER DE MÚSICA
// ══════════════════════════════════════════════════════════

const playlist = [
  { title: "Chuva de Arroz",                  artist: "Luan Santana",       src: "chuva de arroz.mp3" },
  { title: "Um Beijo",         artist: "Luan Santana",  src: "Um Beijo.mp3" },
  { title: "Stateside",                artist: "PinkPantheress",      src: "PinkPantheress - Stateside (American Version) - Pinkpantheress.mp3" },
  { title: "Tonight", artist: "PinkPantheress",  src: "PinkPantheress - Tonight (Official Video) - Pinkpantheress.mp3" },
  { title: "Oque Falta em Você sou Eu",                    artist: "Marilia Mendonça",        src: "Marília Mendonça - O Que Falta Em Você Sou Eu (Vídeo Oficial) - Marília Mendonça.mp3" }
];

let currentTrack = 0;
let isPlaying    = false;

// Cria elemento de áudio dinamicamente (sem depender de HTML)
const audio = document.createElement("audio");
audio.id = "audioPlayer";
document.body.appendChild(audio);

function playTrack(index) {
  currentTrack = index;
  const track  = playlist[index];

  document.getElementById("playerSong").textContent   = track.title;
  document.getElementById("playerArtist").textContent = track.artist;

  audio.src = track.src;
  audio.volume = parseFloat(document.getElementById("volumeControl")?.value || 0.7);

  audio.play().catch(() => {
    // Autoplay bloqueado — aguarda interação
  });

  isPlaying = true;
  document.getElementById("playIcon").className = "fas fa-pause";

  // Marca faixa ativa
  document.querySelectorAll(".track-item").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });

  // Gira o vinil
  const vinyl = document.getElementById("playerVinyl");
  if (vinyl) vinyl.classList.add("spinning");
}

function togglePlay() {
  if (!audio.src || audio.src === window.location.href) {
    playTrack(currentTrack);
    return;
  }
  if (audio.paused) {
    audio.play();
    isPlaying = true;
    document.getElementById("playIcon").className = "fas fa-pause";
    document.getElementById("playerVinyl").classList.add("spinning");
  } else {
    audio.pause();
    isPlaying = false;
    document.getElementById("playIcon").className = "fas fa-play";
    document.getElementById("playerVinyl")?.classList.remove("spinning");
  }
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % playlist.length;
  playTrack(currentTrack);
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  playTrack(currentTrack);
}

function setVolume(v) {
  audio.volume = parseFloat(v);
}

audio.addEventListener("ended", nextTrack);

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct  = (audio.currentTime / audio.duration) * 100;
  const fill = document.getElementById("progressFill");
  const dot  = document.getElementById("progressDot");
  if (fill) fill.style.width = pct + "%";
  if (dot)  dot.style.left   = pct + "%";

  // Tempo atual
  const el = document.querySelector(".player-times span");
  if (el) {
    const m = Math.floor(audio.currentTime / 60);
    const s = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
    el.textContent = `${m}:${s}`;
  }
});

audio.addEventListener("loadedmetadata", () => {
  const m   = Math.floor(audio.duration / 60);
  const s   = Math.floor(audio.duration % 60).toString().padStart(2, "0");
  const dur = document.getElementById("playerDuration");
  if (dur) dur.textContent = `${m}:${s}`;
});

// Clique na barra de progresso para buscar posição
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("playerProgress");
  if (bar) {
    bar.addEventListener("click", (e) => {
      const rect = bar.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });
  }
});

// ══════════════════════════════════════════════════════════
//  QUIZ DO CASAL
// ══════════════════════════════════════════════════════════

const quizData = [
  {
    pergunta: "Qual foi a primeira comida que comemos juntos?",
    opcoes: ["Bolo", "Doce", "Pão de Queijo", "Pizza"],
    correta: 2
  },
  {
    pergunta: "Qual foi o primeiro presente que eu te dei?",
    opcoes: ["Uma Bolsa", "Um Brinquedo ", "Flores", "Um Colar"],
    correta: 1
  },
  {
    pergunta: "Quem disse 'eu te amo' primeiro?",
    opcoes: ["Fui eu", "Foi ele", "Os dois ao mesmo tempo", "Ainda estamos esperando"],
    correta: 1
  },
  {
    pergunta: "Qual era a cor da minha roupa no nosso primeiro beijo?",
    opcoes: ["Vermelho", "Azul", "Preto", "Branco"],
    correta: 1
  },
  {
    pergunta: "O que mais amamos fazer juntos?",
    opcoes: ["Assistir Anime", "Conversar", "'brincar'", "Tudo isso e muito mais!"],
    correta: 3
  }
];

let quizIndex  = 0;
let quizScore  = 0;
let quizLocked = false;

function iniciarQuiz() {
  renderQuiz();
}

function renderQuiz() {
  const q = quizData[quizIndex];
  if (!q) return;

  const numEl      = document.getElementById("quizNum");
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl  = document.getElementById("quizOptions");
  const fillEl     = document.getElementById("quizProgressFill");

  if (numEl)      numEl.textContent      = `Pergunta ${quizIndex + 1} de ${quizData.length}`;
  if (questionEl) questionEl.textContent = q.pergunta;
  if (fillEl)     fillEl.style.width     = `${((quizIndex + 1) / quizData.length) * 100}%`;

  if (optionsEl) {
    optionsEl.innerHTML = "";
    q.opcoes.forEach((op, i) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt";
      btn.textContent = op;
      btn.addEventListener("click", () => responderQuiz(btn, i === q.correta));
      optionsEl.appendChild(btn);
    });
  }

  quizLocked = false;
}

function responderQuiz(btn, correta) {
  if (quizLocked) return;
  quizLocked = true;

  if (correta) {
    quizScore++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    // Marca a correta
    const opts = document.querySelectorAll(".quiz-opt");
    opts[quizData[quizIndex].correta]?.classList.add("correct");
  }

  // Desabilita todos
  document.querySelectorAll(".quiz-opt").forEach(b => b.disabled = true);

  setTimeout(() => {
    quizIndex++;
    if (quizIndex < quizData.length) {
      renderQuiz();
    } else {
      mostrarResultadoQuiz();
    }
  }, 900);
}

// Compatibilidade com o onclick do HTML (answerQuiz)
function answerQuiz(btn, correct) {
  responderQuiz(btn, correct);
}

function mostrarResultadoQuiz() {
  document.getElementById("quizCard")?.classList.add("hidden");
  const result = document.getElementById("quizResult");
  result?.classList.remove("hidden");

  document.getElementById("quizScore").textContent = quizScore;

  const msgs = [
    "Hmm, precisamos nos conhecer mais! 😅",
    "Quase lá! Continue tentando 💕",
    "Bom! Já nos conhecemos bem 😊",
    "Muito bem! Somos perfeitos juntos! 💖",
    "INCRÍVEL! Um amor perfeito! ❤️🎉"
  ];

  const idx = Math.floor((quizScore / quizData.length) * (msgs.length - 1));
  const msgEl = document.getElementById("quizResultMsg");
  if (msgEl) msgEl.textContent = msgs[idx];

  if (quizScore >= 3) lancarConfetes();
}

function restartQuiz() {
  quizIndex  = 0;
  quizScore  = 0;
  quizLocked = false;
  document.getElementById("quizCard")?.classList.remove("hidden");
  document.getElementById("quizResult")?.classList.add("hidden");
  renderQuiz();
}

// ══════════════════════════════════════════════════════════
//  100 MOTIVOS PELOS QUAIS TE AMO
// ══════════════════════════════════════════════════════════

const motivosLista = [
  "Seu sorriso ilumina meu dia","Sua risada contagiante","Seu jeito de cuidar de mim",
  "Sua companhia","Sua bondade infinita","Seu coração generoso","Sua inteligência",
  "Sua determinação","Sua força","Sua delicadeza","Seu abraço aconchegante",
  "Seu cheiro especial","Seus olhos lindos","Sua voz suave","Seu toque gentil",
  "Como você me ouve","Como você me entende","Sua paciência comigo",
  "Sua honestidade","Sua lealdade","Como você me faz sentir especial",
  "Sua criatividade","Sua energia positiva","Como você transforma meu dia",
  "Seu jeito único de ser","Sua coragem","Como você enfrenta desafios",
  "Sua empatia","Como você cuida das pessoas que ama","Sua humildade",
  "Seu gosto musical","Sua paixão por coisas simples","Como você sorri dormindo",
  "Seus pequenos hábitos","Sua forma de dançar","Como você canta baixinho",
  "Seus gostos peculiares","Como você fica corada","Seu jeito de se animar",
  "Como você me acalma","Sua presença que aquece","Como você me completa",
  "Seu olhar quando me vê","Como você fala meu nome","Seus gestos de carinho",
  "Como você me defende","Sua lealdade incondicional","Sua fé",
  "Como você acredita em mim","Sua visão do mundo","Sua sensibilidade",
  "Como você percebe detalhes","Sua memória afetiva","Como guarda nossas datas",
  "Sua forma de surpreender","Como você demonstra amor","Seus beijos",
  "Seu abraço de fim de dia","Como você segura minha mão","Sua vontade de crescer",
  "Como você me inspira","Seu jeito de me apoiar","Como você é minha paz",
  "Sua forma de resolver conflitos","Sua maturidade emocional","Sua sabedoria",
  "Como você pensa nos outros","Seu sorriso envergonhado","Sua autenticidade",
  "Como não tenta ser outra pessoa","Seu amor pela família","Sua saudade de mim",
  "Como você vibra com minhas vitórias","Como chora em filmes","Sua sensibilidade artística",
  "Seu amor pelos animais","Como você gosta de natureza","Seu jeito de acordar",
  "Sua cara de sono","Como você toma café","Suas opiniões fortes","Sua paixão",
  "Como você argumenta","Sua lógica e intuição","Como você me completa",
  "Seu jeitinho quando está com fome","Como você fica animada","Sua teimosia fofa",
  "Seu ciúme delicado","Como você me faz rir","Suas mensagens surpresa",
  "Como você pensa em mim","Sua presença constante","Como você me conhece",
  "Seus sonhos e planos","Como você fala do futuro","Sua vontade de evoluir",
  "Como você me escolhe todo dia","Sua alma linda","Seu amor genuíno",
  "Por simplesmente ser você"
];

function carregarMotivos() {
  const grid = document.getElementById("reasonsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  motivosLista.forEach((motivo, i) => {
    const emojis = ["❤️","💖","🌹","✨","💕","💗","🥰","💫","🌸","💓"];
    const emoji  = emojis[i % emojis.length];

    const card = document.createElement("div");
    card.className = "reason-card";
    card.innerHTML = `
      <div class="reason-inner">
        <div class="reason-front">
          <span style="font-size:1.8rem">${emoji}</span>
          <span class="reason-num">#${i + 1}</span>
        </div>
        <div class="reason-back">${motivo}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ══════════════════════════════════════════════════════════
//  CÁPSULA DO TEMPO
// ══════════════════════════════════════════════════════════

function sealCapsule() {
  const msg  = document.getElementById("capsuleMsg")?.value.trim();
  const data = document.getElementById("capsuleDate")?.value;

  if (!msg || !data) {
    mostrarAlerta("Preencha a mensagem e a data! ❤️");
    return;
  }

  const lista = JSON.parse(localStorage.getItem("capsulas") || "[]");
  lista.push({ msg, data, criada: new Date().toLocaleDateString("pt-BR") });
  localStorage.setItem("capsulas", JSON.stringify(lista));

  // Animação do cadeado
  const lockIcon = document.getElementById("lockIcon");
  if (lockIcon) {
    lockIcon.className = "fas fa-lock-open";
    setTimeout(() => { lockIcon.className = "fas fa-lock"; }, 1000);
  }

  document.getElementById("capsuleMsg").value  = "";
  document.getElementById("capsuleDate").value = "";

  carregarCapsulas();
  mostrarAlerta("Cápsula selada com amor! 🔒❤️");
}

function carregarCapsulas() {
  const area = document.getElementById("capsuleItems");
  if (!area) return;

  const lista = JSON.parse(localStorage.getItem("capsulas") || "[]");

  if (!lista.length) {
    area.innerHTML = `<p class="empty-msg">Nenhuma cápsula ainda... escreva uma mensagem! ✨</p>`;
    return;
  }

  area.innerHTML = "";
  lista.forEach((item, i) => {
    const hoje       = new Date();
    const dataAbre   = new Date(item.data);
    const podeAbrir  = hoje >= dataAbre;

    const div = document.createElement("div");
    div.className = "capsule-item";
    div.innerHTML = `
      <div class="capsule-item-date">
        🔒 Abre em: ${new Date(item.data + "T00:00:00").toLocaleDateString("pt-BR")}
        ${podeAbrir ? ' — <span style="color:#D4AF37">✅ Disponível!</span>' : ""}
      </div>
      <div class="capsule-item-preview">
        ${podeAbrir
          ? `<span style="color:rgba(255,255,255,0.8)">${item.msg}</span>`
          : '🔐 Mensagem bloqueada até a data...'}
      </div>
      <button onclick="excluirCapsula(${i})" style="
        margin-top:8px; background:rgba(230,57,70,0.2);
        border:1px solid rgba(230,57,70,0.4); color:#FF9AA2;
        border-radius:8px; padding:4px 12px; cursor:pointer;
        font-size:0.75rem;
      ">🗑️ Excluir</button>
    `;
    area.appendChild(div);
  });
}

function excluirCapsula(i) {
  const lista = JSON.parse(localStorage.getItem("capsulas") || "[]");
  lista.splice(i, 1);
  localStorage.setItem("capsulas", JSON.stringify(lista));
  carregarCapsulas();
}

// ══════════════════════════════════════════════════════════
//  ÁRVORE DO AMOR
// ══════════════════════════════════════════════════════════

const momentosArvore = [
  "Primeiro olhar", "Primeiro sorriso", "Primeiro toque",
  "Primeiro beijo", "Primeiro 'eu te amo'", "Primeiro encontro",
  "Primeiro abraço", "Primeiro choro junto", "Primeiro desentendido e reconciliação",
  "Primeira viagem", "Primeira foto juntos", "Primeiro filme juntos",
  "Nosso lugar preferido", "Nossa música", "Nosso prato favorito",
  "Nosso apelido", "Nosso jeito único", "Um sonho compartilhado",
  "Uma conquista juntos", "Infinitos momentos por vir"
];

// Posições folhas na árvore (x%, y%)
const posicoesFolhas = [
  [38,12],[48,10],[58,13],[32,20],[62,22],[26,28],[68,30],
  [35,36],[55,34],[28,44],[65,42],[42,22],[52,24],[38,50],
  [58,50],[33,58],[62,58],[43,65],[52,63],[47,38]
];

function carregarArvore() {
  const area = document.getElementById("treeLeaves");
  if (!area) return;
  area.innerHTML = "";

  momentosArvore.forEach((momento, i) => {
    const pos  = posicoesFolhas[i] || [Math.random()*70+15, Math.random()*60+10];
    const leaf = document.createElement("div");
    leaf.className = "tree-leaf";
    leaf.textContent = momento;
    leaf.style.left   = pos[0] + "%";
    leaf.style.top    = pos[1] + "%";
    leaf.style.animationDelay = (i * 0.15) + "s";
    leaf.style.animationDuration = (2 + Math.random() * 1.5) + "s";

    leaf.addEventListener("click", () => {
      mostrarToast(`🍃 ${momento}`);
    });

    area.appendChild(leaf);
  });
}

// ══════════════════════════════════════════════════════════
//  MENSAGEM SURPRESA
// ══════════════════════════════════════════════════════════

function openSurprise() {
  const modal = document.getElementById("surpriseModal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Cria corações no modal
  const container = document.getElementById("surpriseHearts");
  if (container) {
    container.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      const h = document.createElement("span");
      h.textContent = ["❤️","💖","💕","🌹"][i % 4];
      h.style.cssText = `
        position:absolute;
        left:${Math.random()*90}%;
        top:${Math.random()*80}%;
        font-size:${Math.random()*20+10}px;
        animation: float ${2 + Math.random()*2}s ease-in-out infinite;
        animation-delay:${Math.random()*2}s;
        opacity:0.5;
        pointer-events:none;
      `;
      container.appendChild(h);
    }
  }
}

function closeSurpriseModal() {
  document.getElementById("surpriseModal")?.classList.remove("active");
  document.body.style.overflow = "";
}

// ══════════════════════════════════════════════════════════
//  PEDIDO ESPECIAL
// ══════════════════════════════════════════════════════════

function sayYes() {
  const cel = document.getElementById("celebration");
  if (!cel) return;
  cel.style.display = "flex";

  // Coração de corações
  const ch = document.getElementById("celebrationHearts");
  if (ch) {
    ch.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const h = document.createElement("span");
      h.textContent = ["❤️","💖","💕","🌹","✨","💫"][i % 6];
      h.style.cssText = `
        position:absolute;
        left:${Math.random()*95}%;
        font-size:${Math.random()*30+10}px;
        animation: confettiFall ${Math.random()*3+3}s linear forwards;
        animation-delay:${Math.random()*2}s;
        pointer-events:none;
      `;
      ch.appendChild(h);
    }
  }

  lancarConfetes();
}

function runAway(btn) {
  const pad   = 80;
  const maxX  = window.innerWidth  - pad;
  const maxY  = window.innerHeight - pad;

  const x = Math.random() * maxX - maxX / 2;
  const y = Math.random() * maxY - maxY / 2;

  btn.style.transition  = "transform 0.3s cubic-bezier(0.4,0,0.2,1)";
  btn.style.transform   = `translate(${x}px, ${y}px)`;
  btn.style.position    = "fixed";
}

// ══════════════════════════════════════════════════════════
//  CONFETES
// ══════════════════════════════════════════════════════════

function lancarConfetes() {
  const cores = ["#E63946","#FFB6C1","#D4AF37","#fff","#FF69B4","#FF4081"];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.className = "confetti-piece";
      c.style.cssText = `
        left:${Math.random()*100}vw;
        top:-10px;
        background:${cores[Math.floor(Math.random()*cores.length)]};
        width:${Math.random()*10+5}px;
        height:${Math.random()*10+5}px;
        border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        animation: confettiFall ${Math.random()*4+3}s linear forwards;
        transform: rotate(${Math.random()*360}deg);
      `;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 7000);
    }, i * 40);
  }
}

// ══════════════════════════════════════════════════════════
//  UTILITÁRIOS — TOAST & ALERTA
// ══════════════════════════════════════════════════════════

function mostrarToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `
    position:fixed; bottom:30px; left:50%;
    transform:translateX(-50%) translateY(20px);
    background:rgba(230,57,70,0.9);
    backdrop-filter:blur(10px);
    color:white; padding:12px 28px;
    border-radius:50px; font-size:0.9rem;
    font-family:'Cormorant Garamond',serif;
    font-style:italic;
    z-index:9999; opacity:0;
    transition: all 0.4s ease;
    box-shadow:0 4px 20px rgba(230,57,70,0.5);
    border:1px solid rgba(255,255,255,0.2);
    pointer-events:none;
  `;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = "1"; t.style.transform = "translateX(-50%) translateY(0)"; }, 50);
  setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(-50%) translateY(-10px)"; }, 2800);
  setTimeout(() => t.remove(), 3200);
}

function mostrarAlerta(msg) {
  mostrarToast(msg);
}