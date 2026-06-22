const API_URL = "http://localhost:3000";

document.getElementById("inputCorPicker").addEventListener("input", function () {
  document.getElementById("inputCor").value = this.value;
});

document.getElementById("inputCor").addEventListener("input", function () {
  if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
    document.getElementById("inputCorPicker").value = this.value;
  }
});

function mostrarAlerta(tipo, mensagem) {
  const box = document.getElementById("alertaBox");
  box.innerHTML = `
    <div class="alert alert-${tipo} d-flex align-items-center gap-2" role="alert">
      <i class="bi bi-${tipo === "success" ? "check-circle-fill" : "exclamation-triangle-fill"}"></i>
      ${mensagem}
    </div>`;
  setTimeout(() => { box.innerHTML = ""; }, 4000);
}

function limparFormulario() {
  document.getElementById("inputNome").value = "";
  document.getElementById("inputVersao").value = "";
  document.getElementById("inputDescCurta").value = "";
  document.getElementById("inputDescCompleta").value = "";
  document.getElementById("inputCategoria").value = "";
  document.getElementById("inputLancamento").value = "";
  document.getElementById("inputImagem").value = "";
  document.getElementById("inputCor").value = "#ff7139";
  document.getElementById("inputCorPicker").value = "#ff7139";
  document.getElementById("inputTags").value = "";
  document.getElementById("destaqueNao").checked = true;
}

function validarCampos(dados) {
  if (!dados.nome) return "Preencha o nome da versão.";
  if (!dados.versao) return "Preencha o número da versão.";
  if (!dados.descricaoCurta) return "Preencha a descrição curta.";
  if (!dados.descricaoCompleta) return "Preencha a descrição completa.";
  if (!dados.categoria) return "Selecione uma categoria.";
  if (!dados.lancamento) return "Preencha a data de lançamento.";
  return null;
}

document.getElementById("btnSalvar").addEventListener("click", async function () {
  const nome         = document.getElementById("inputNome").value.trim();
  const versao       = document.getElementById("inputVersao").value.trim();
  const descCurta    = document.getElementById("inputDescCurta").value.trim();
  const descCompleta = document.getElementById("inputDescCompleta").value.trim();
  const categoria    = document.getElementById("inputCategoria").value;
  const lancamento   = document.getElementById("inputLancamento").value;
  const imagem       = document.getElementById("inputImagem").value.trim() || "img/2019.png";
  const cor          = document.getElementById("inputCor").value.trim() || "#ff7139";
  const tagsRaw      = document.getElementById("inputTags").value.trim();
  const destaque     = document.querySelector('input[name="destaque"]:checked').value === "true";

  const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];

  const novaVersao = {
    nome,
    versao,
    descricaoCurta: descCurta,
    descricaoCompleta: descCompleta,
    imagem,
    categoria,
    lancamento,
    destaque,
    cor,
    tags,
    extensoes: []
  };

  const erro = validarCampos(novaVersao);
  if (erro) {
    mostrarAlerta("warning", erro);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/versoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaVersao)
    });

    if (!res.ok) throw new Error("Erro ao salvar");

    mostrarAlerta("success", `Versão <strong>${nome}</strong> cadastrada com sucesso!`);
    limparFormulario();

  } catch {
    mostrarAlerta("danger", "Não foi possível salvar. Verifique se o JSON Server está rodando em <strong>localhost:3000</strong>.");
  }
});

document.getElementById("btnLimpar").addEventListener("click", limparFormulario);