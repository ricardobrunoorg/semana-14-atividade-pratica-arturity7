const API_URL = "http://localhost:3000";

function formatarData(str) {
  const [ano, mes, dia] = str.split("-");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${dia} ${meses[parseInt(mes) - 1]}. ${ano}`;
}

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

function criarSlide(versao, ativo) {
  const slide = document.createElement("div");
  slide.className = `carousel-item${ativo ? " active" : ""}`;
  slide.innerHTML = `
    <div class="carousel-slide-inner">
      <div class="carousel-slide-img">
        <img src="${versao.imagem}" alt="${versao.nome}" />
      </div>
      <div class="carousel-slide-body">
        <span class="versao-badge" style="background:${versao.cor}22;color:${versao.cor};border:1px solid ${versao.cor}44">
          v${versao.versao}
        </span>
        <h3 class="carousel-slide-title">${versao.nome}</h3>
        <p class="carousel-slide-desc">${versao.descricaoCurta}</p>
        <p class="carousel-slide-data"><i class="bi bi-calendar3"></i> ${formatarData(versao.lancamento)}</p>
        <a href="details.html?id=${versao.id}" class="btn-ver-mais">
          Ver detalhes <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
  return slide;
}

function renderCarousel(destaques) {
  const inner = document.getElementById("carouselInner");
  const indicators = document.getElementById("carouselIndicators");
  inner.innerHTML = "";
  indicators.innerHTML = "";

  destaques.forEach((v, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("data-bs-target", "#carouselDestaques");
    btn.setAttribute("data-bs-slide-to", i);
    btn.setAttribute("aria-label", `Slide ${i + 1}`);
    if (i === 0) {
      btn.classList.add("active");
      btn.setAttribute("aria-current", "true");
    }
    indicators.appendChild(btn);
    inner.appendChild(criarSlide(v, i === 0));
  });
}

function criarCard(versao) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-lg-4";
  col.innerHTML = `
    <div class="versao-card" onclick="location.href='details.html?id=${versao.id}'" style="cursor:pointer">
      <div class="versao-card-img">
        <img src="${versao.imagem}" alt="${versao.nome}" />
        ${versao.destaque ? '<span class="badge-destaque">★ Destaque</span>' : ""}
      </div>
      <div class="versao-card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="versao-badge" style="background:${versao.cor}22;color:${versao.cor};border:1px solid ${versao.cor}44">
            v${versao.versao}
          </span>
          <span class="versao-data"><i class="bi bi-calendar3"></i> ${formatarData(versao.lancamento)}</span>
        </div>
        <h3 class="versao-card-title">${versao.nome}</h3>
        <p class="versao-card-desc">${versao.descricaoCurta}</p>
        <div class="versao-card-footer">
          <span class="ext-count"><i class="bi bi-puzzle"></i> ${versao.extensoes.length} extensões</span>
          <span class="ver-link">Ver mais <i class="bi bi-chevron-right"></i></span>
        </div>
      </div>
    </div>
  `;
  return col;
}

function renderCards(versoes) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  if (versoes.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search" style="font-size:2rem;color:var(--text-muted)"></i>
        <p class="mt-2" style="color:var(--text-muted)">Nenhuma versão encontrada.</p>
      </div>`;
    return;
  }

  versoes.forEach(v => grid.appendChild(criarCard(v)));
}

function popularFiltro(categorias) {
  const select = document.getElementById("filtroCategoria");
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.nome;
    opt.textContent = cat.nome;
    select.appendChild(opt);
  });
}

async function init() {
  try {
    const [versoes, categorias] = await Promise.all([fetchVersoes(), fetchCategorias()]);

    const destaques = versoes.filter(v => v.destaque);
    renderCarousel(destaques);
    renderCards(versoes);
    popularFiltro(categorias);

    document.getElementById("searchInput").addEventListener("input", function () {
      const termo = this.value.toLowerCase();
      const catFiltro = document.getElementById("filtroCategoria").value;
      const filtradas = versoes.filter(v => {
        const bateTermo = v.nome.toLowerCase().includes(termo) ||
                          v.descricaoCurta.toLowerCase().includes(termo) ||
                          v.tags.some(t => t.includes(termo));
        const bateCategoria = catFiltro === "" || v.categoria === catFiltro;
        return bateTermo && bateCategoria;
      });
      renderCards(filtradas);
    });

    document.getElementById("filtroCategoria").addEventListener("change", function () {
      const catFiltro = this.value;
      const termo = document.getElementById("searchInput").value.toLowerCase();
      const filtradas = versoes.filter(v => {
        const bateTermo = v.nome.toLowerCase().includes(termo) ||
                          v.descricaoCurta.toLowerCase().includes(termo) ||
                          v.tags.some(t => t.includes(termo));
        const bateCategoria = catFiltro === "" || v.categoria === catFiltro;
        return bateTermo && bateCategoria;
      });
      renderCards(filtradas);
    });

  } catch (err) {
    document.getElementById("cardsGrid").innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-exclamation-triangle" style="font-size:2rem;color:var(--accent-orange)"></i>
        <p class="mt-2" style="color:var(--text-muted)">
          Não foi possível conectar ao servidor.<br>
          Certifique-se de que o JSON Server está rodando em <strong>localhost:3000</strong>.
        </p>
      </div>`;
    document.getElementById("carouselInner").innerHTML = `
      <div class="carousel-item active">
        <div class="carousel-slide-inner d-flex align-items-center justify-content-center">
          <p style="color:var(--text-muted)">Servidor indisponível.</p>
        </div>
      </div>`;
  }
}

init();