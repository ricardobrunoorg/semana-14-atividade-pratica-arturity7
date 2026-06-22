const API_URL = "http://localhost:3000";

function formatarData(str) {
  const [ano, mes, dia] = str.split("-");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${dia} ${meses[parseInt(mes) - 1]}. ${ano}`;
}

async function fetchVersaoPorId(id) {
  const res = await fetch(`${API_URL}/versoes/${id}`);
  if (!res.ok) throw new Error("Versão não encontrada");
  return res.json();
}

async function fetchTodasVersoes() {
  const res = await fetch(`${API_URL}/versoes`);
  if (!res.ok) throw new Error("Erro ao buscar versões");
  return res.json();
}

async function fetchComentarios(versaoId) {
  const res = await fetch(`${API_URL}/comentarios?versaoId=${versaoId}`);
  if (!res.ok) return [];
  return res.json();
}

function renderExtensoes(extensoes) {
  return extensoes.map(ext => `
    <div class="col-6 col-md-3">
      <div class="ext-card">
        <div class="ext-icon" style="background:${ext.cor}18;border-color:${ext.cor}33">
          <i class="bi ${ext.icone}" style="font-size:1.8rem;color:${ext.cor}"></i>
        </div>
        <p class="ext-nome">${ext.nome}</p>
        <p class="ext-desc">${ext.descricao}</p>
      </div>
    </div>
  `).join("");
}

function renderTags(tags) {
  return tags.map(tag => `<span class="tag-chip">${tag}</span>`).join("");
}

function renderComentarios(comentarios) {
  if (comentarios.length === 0) {
    return `<p style="color:var(--text-muted);font-size:.85rem">Nenhum comentário ainda.</p>`;
  }
  return comentarios.map(c => `
    <div class="comentario-item">
      <div class="d-flex align-items-center gap-2 mb-1">
        <i class="bi bi-person-circle" style="color:var(--text-muted);font-size:1.1rem"></i>
        <strong style="font-size:.85rem;color:var(--text)">${c.autor}</strong>
        <span style="font-size:.72rem;color:var(--text-muted);margin-left:auto">${formatarData(c.data)}</span>
      </div>
      <p style="font-size:.82rem;color:var(--text-sub);margin:0">${c.texto}</p>
    </div>
  `).join("");
}

function renderDetalhe(versao, todas, comentarios) {
  document.title = `${versao.nome} — Firefox`;

  const idx = todas.findIndex(v => v.id === versao.id);
  const anterior = idx > 0 ? todas[idx - 1] : null;
  const proxima = idx < todas.length - 1 ? todas[idx + 1] : null;

  const container = document.getElementById("detalheContainer");
  container.innerHTML = `
    <div class="container py-4">

      <a href="index.html" class="btn-voltar mb-4 d-inline-flex align-items-center gap-2">
        <i class="bi bi-arrow-left"></i> Todas as versões
      </a>

      <section class="detalhe-section mb-5">
        <h2 class="section-title mb-4">
          <span class="title-pill">Informações Gerais</span>
        </h2>
        <div class="detalhe-card">
          <div class="row g-4 align-items-center">
            <div class="col-12 col-md-3 text-center">
              <div class="detalhe-img-wrap">
                <img src="${versao.imagem}" alt="${versao.nome}" class="detalhe-img" />
                <div class="detalhe-img-glow" style="background:radial-gradient(circle,${versao.cor}55,transparent 70%)"></div>
              </div>
            </div>
            <div class="col-12 col-md-9">
              <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
                <span class="versao-badge versao-badge-lg" style="background:${versao.cor}22;color:${versao.cor};border:1px solid ${versao.cor}66">
                  v${versao.versao}
                </span>
                ${versao.destaque ? '<span class="badge-destaque">★ Destaque</span>' : ""}
              </div>
              <h1 class="detalhe-titulo">${versao.nome}</h1>
              <p class="detalhe-desc">${versao.descricaoCurta}</p>
              <p class="detalhe-conteudo">${versao.descricaoCompleta}</p>
              <div class="row g-3 mt-1">
                <div class="col-6 col-md-4">
                  <div class="info-item">
                    <i class="bi bi-tag info-icon"></i>
                    <span class="info-label">Versão</span>
                    <span class="info-valor">${versao.versao}</span>
                  </div>
                </div>
                <div class="col-6 col-md-4">
                  <div class="info-item">
                    <i class="bi bi-calendar3 info-icon"></i>
                    <span class="info-label">Lançamento</span>
                    <span class="info-valor">${formatarData(versao.lancamento)}</span>
                  </div>
                </div>
                <div class="col-6 col-md-4">
                  <div class="info-item">
                    <i class="bi bi-layers info-icon"></i>
                    <span class="info-label">Categoria</span>
                    <span class="info-valor">${versao.categoria}</span>
                  </div>
                </div>
                <div class="col-6 col-md-4">
                  <div class="info-item">
                    <i class="bi bi-puzzle info-icon"></i>
                    <span class="info-label">Extensões</span>
                    <span class="info-valor">${versao.extensoes.length} nesta versão</span>
                  </div>
                </div>
                <div class="col-6 col-md-4">
                  <div class="info-item">
                    <i class="bi bi-star info-icon"></i>
                    <span class="info-label">Status</span>
                    <span class="info-valor">${versao.destaque ? "Em destaque" : "Regular"}</span>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <p style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:8px">Tags</p>
                <div class="d-flex flex-wrap gap-2">
                  ${renderTags(versao.tags)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="detalhe-section mb-5">
        <h2 class="section-title mb-4">
          <span class="title-pill">Extensões Associadas</span>
        </h2>
        <div class="row g-3">
          ${renderExtensoes(versao.extensoes)}
        </div>
      </section>

      <section class="detalhe-section mb-5">
        <h2 class="section-title mb-4">
          <span class="title-pill">Comentários</span>
        </h2>
        <div class="comentarios-lista">
          ${renderComentarios(comentarios)}
        </div>
      </section>

      <div class="nav-versoes d-flex justify-content-between align-items-center">
        <div>
          ${anterior ? `<a href="details.html?id=${anterior.id}" class="btn-nav-versao"><i class="bi bi-chevron-left"></i> ${anterior.versao}</a>` : ""}
        </div>
        <a href="index.html" class="btn-voltar d-inline-flex align-items-center gap-2">
          <i class="bi bi-grid"></i> Ver todas
        </a>
        <div>
          ${proxima ? `<a href="details.html?id=${proxima.id}" class="btn-nav-versao">${proxima.versao} <i class="bi bi-chevron-right"></i></a>` : ""}
        </div>
      </div>

    </div>
  `;
}

function mostrarErro(mensagem) {
  document.getElementById("detalheContainer").innerHTML = `
    <div class="container py-5 text-center">
      <i class="bi bi-emoji-frown" style="font-size:3rem;color:var(--text-muted)"></i>
      <h2 class="mt-3" style="color:var(--text)">${mensagem}</h2>
      <a href="index.html" class="btn-ver-mais mt-3 d-inline-flex align-items-center gap-2">
        <i class="bi bi-arrow-left"></i> Voltar para a home
      </a>
    </div>`;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    mostrarErro("Nenhuma versão foi selecionada.");
    return;
  }

  try {
    const [versao, todas, comentarios] = await Promise.all([
      fetchVersaoPorId(id),
      fetchTodasVersoes(),
      fetchComentarios(id)
    ]);

    renderDetalhe(versao, todas, comentarios);

  } catch (err) {
    if (err.message === "Versão não encontrada") {
      mostrarErro(`Versão com ID "${id}" não existe.`);
    } else {
      mostrarErro("Não foi possível conectar ao servidor.");
    }
  }
}

init();