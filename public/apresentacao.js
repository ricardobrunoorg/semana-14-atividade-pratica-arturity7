const API_URL = "http://localhost:3000";

async function fetchVersoes() {
  const res = await fetch(`${API_URL}/versoes`);
  if (!res.ok) throw new Error("Erro ao buscar versões");
  return res.json();
}

async function fetchCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) throw new Error("Erro ao buscar categorias");
  return res.json();
}

async function fetchAvaliacoes() {
  const res = await fetch(`${API_URL}/avaliacoes`);
  if (!res.ok) throw new Error("Erro ao buscar avaliações");
  return res.json();
}

function renderResumo(versoes, categorias) {
  const totalExtensoes = versoes.reduce((soma, v) => soma + v.extensoes.length, 0);
  const totalDestaques = versoes.filter(v => v.destaque).length;

  const cards = [
    { label: "Versões cadastradas", valor: versoes.length, icone: "bi-window-stack", cor: "#ff7139" },
    { label: "Categorias", valor: categorias.length, icone: "bi-tags-fill", cor: "#9059ff" },
    { label: "Extensões no total", valor: totalExtensoes, icone: "bi-puzzle-fill", cor: "#00b3f4" },
    { label: "Versões em destaque", valor: totalDestaques, icone: "bi-star-fill", cor: "#28a745" }
  ];

  const container = document.getElementById("resumoCards");
  container.innerHTML = cards.map(c => `
    <div class="col-6 col-md-3">
      <div class="resumo-card">
        <i class="bi ${c.icone}" style="color:${c.cor}"></i>
        <span class="resumo-valor">${c.valor}</span>
        <span class="resumo-label">${c.label}</span>
      </div>
    </div>
  `).join("");
}

function renderGraficoPizza(versoes, categorias) {
  const contagem = {};
  categorias.forEach(cat => contagem[cat.nome] = 0);
  versoes.forEach(v => {
    if (contagem[v.categoria] === undefined) contagem[v.categoria] = 0;
    contagem[v.categoria]++;
  });

  const labels = Object.keys(contagem);
  const valores = Object.values(contagem);
  const cores = labels.map(nome => {
    const cat = categorias.find(c => c.nome === nome);
    return cat ? cat.cor : "#8f8f9d";
  });

  new Chart(document.getElementById("graficoPizza"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: valores,
        backgroundColor: cores,
        borderColor: "#2b2a33",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#cfcfd8", font: { size: 12 }, padding: 14 }
        }
      }
    }
  });
}

function renderGraficoBarras(versoes) {
  const ordenadas = [...versoes].sort((a, b) => new Date(a.lancamento) - new Date(b.lancamento));

  new Chart(document.getElementById("graficoBarras"), {
    type: "bar",
    data: {
      labels: ordenadas.map(v => `v${v.versao}`),
      datasets: [{
        label: "Extensões cadastradas",
        data: ordenadas.map(v => v.extensoes.length),
        backgroundColor: ordenadas.map(v => v.cor + "cc"),
        borderColor: ordenadas.map(v => v.cor),
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: "#cfcfd8", font: { size: 11 } },
          grid: { color: "#52505e30" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#cfcfd8", stepSize: 1 },
          grid: { color: "#52505e30" }
        }
      }
    }
  });
}

function renderGraficoLinha(versoes, avaliacoes) {
  const ordenadas = [...versoes].sort((a, b) => new Date(a.lancamento) - new Date(b.lancamento));

  const notas = ordenadas.map(v => {
    const av = avaliacoes.find(a => a.versaoId === v.id);
    return av ? av.nota : 0;
  });

  new Chart(document.getElementById("graficoLinha"), {
    type: "line",
    data: {
      labels: ordenadas.map(v => v.nome),
      datasets: [{
        label: "Nota média (1 a 5)",
        data: notas,
        borderColor: "#ff7139",
        backgroundColor: "#ff713933",
        pointBackgroundColor: "#ff7139",
        pointRadius: 5,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#cfcfd8" } }
      },
      scales: {
        x: {
          ticks: { color: "#cfcfd8", font: { size: 11 } },
          grid: { color: "#52505e30" }
        },
        y: {
          min: 0,
          max: 5,
          ticks: { color: "#cfcfd8", stepSize: 1 },
          grid: { color: "#52505e30" }
        }
      }
    }
  });
}

async function init() {
  try {
    const [versoes, categorias, avaliacoes] = await Promise.all([
      fetchVersoes(),
      fetchCategorias(),
      fetchAvaliacoes()
    ]);

    renderResumo(versoes, categorias);
    renderGraficoPizza(versoes, categorias);
    renderGraficoBarras(versoes);
    renderGraficoLinha(versoes, avaliacoes);

  } catch (err) {
    document.querySelector("main .container").innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-exclamation-triangle" style="font-size:2rem;color:var(--accent-orange)"></i>
        <p class="mt-2" style="color:var(--text-muted)">
          Não foi possível conectar ao servidor.<br>
          Certifique-se de que o JSON Server está rodando em <strong>localhost:3000</strong>.
        </p>
      </div>`;
  }
}

init();