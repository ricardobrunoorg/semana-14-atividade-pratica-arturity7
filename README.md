# Firefox — Versões & Extensões

**Aluno:** Arthur Gabriel  
**Matrícula:** 924860  
**Curso:** Engenharia de Software — 1º Período — Turma Manhã

---

## Como rodar o projeto

### 1. Instalar dependências (só na primeira vez)

```bash
npm install -g json-server
```

### 2. Iniciar o JSON Server

Na pasta raiz do projeto:

```bash
json-server --watch db/db.json --port 3000 --static public
```

### 3. Abrir no navegador

```
http://localhost:3000
```

---

## Estrutura do projeto

```
/
├── public/                  ← Front-end servido pelo JSON Server
│   ├── index.html           ← Home com carousel e cards
│   ├── script.js            ← Lógica da home (fetch + render)
│   ├── details.html         ← Página de detalhes de uma versão
│   ├── details.js           ← Lógica de detalhes (URLSearchParams + fetch)
│   ├── cadastro_versao.html ← Formulário de cadastro
│   ├── cadastro_versao.js   ← Lógica do cadastro (POST via fetch)
│   ├── style.css            ← Estilos visuais
│   └── img/                 ← Imagens dos logos
│       ├── 2013.png
│       ├── 2019.png
│       ├── 2021.png
│       └── mozilla.png
└── db/
    └── db.json              ← Banco de dados da API REST
```

---

## Estrutura do db.json

### Coleções

| Coleção | O que guarda |
|---|---|
| `versoes` | Cada versão do Firefox com nome, descrição, imagem, categoria, tags e extensões associadas |
| `categorias` | Lista das categorias possíveis com nome, descrição e cor |
| `comentarios` | Comentários de usuários vinculados a uma versão por `versaoId` |
| `avaliacoes` | Nota (1-5) de cada versão vinculada por `versaoId` |

### Modelo de um item da coleção `versoes`

```json
{
  "id": 1,
  "nome": "Firefox 57 — Quantum",
  "versao": "57.0",
  "descricaoCurta": "Motor Quantum: 2x mais rápido e 30% menos memória que o Chrome.",
  "descricaoCompleta": "Texto detalhado...",
  "imagem": "img/2013.png",
  "categoria": "Performance",
  "lancamento": "2017-11-14",
  "destaque": true,
  "cor": "#ff7139",
  "tags": ["quantum", "rust", "performance"],
  "extensoes": [
    {
      "nome": "uBlock Origin",
      "icone": "bi-shield-fill-check",
      "cor": "#e44d26",
      "descricao": "Bloqueador de anúncios leve e open-source."
    }
  ]
}
```

---

## Rotas da API disponíveis

| Método | Rota | Descrição |
|---|---|---|
| GET | `/versoes` | Lista todas as versões |
| GET | `/versoes/:id` | Busca uma versão pelo ID |
| POST | `/versoes` | Cadastra uma nova versão |
| GET | `/categorias` | Lista todas as categorias |
| GET | `/comentarios?versaoId=:id` | Busca comentários de uma versão |
| GET | `/avaliacoes?versaoId=:id` | Busca avaliação de uma versão |

---

**Antes** — estado inicial com os dados do db.json
![Gráficos antes](/public/img/apresentacao.png.png)

**Depois** — após cadastrar uma nova versão pelo formulário
![Gráficos depois](/public/img/apresentacao2.png.png)

---

## Apresentação Dinâmica de Dados (Chart.js)

A página `apresentacao.html` consome os dados do JSON Server e exibe três gráficos
construídos com **Chart.js**:

| Gráfico | Tipo | O que mostra |
|---|---|---|
| Versões por Categoria | Pizza | Distribuição das versões cadastradas entre as categorias (Performance, Privacidade, Design, etc.) |
| Extensões por Versão | Barras | Quantidade de extensões associadas a cada versão, ordenadas por data de lançamento |
| Avaliação Média por Versão | Linha | Nota (1 a 5) de cada versão, consumida da coleção `avaliacoes` |

Os dados são buscados via `fetch` assíncrono direto da API (`/versoes`, `/categorias`,
`/avaliacoes`) — qualquer alteração feita pelo formulário de cadastro ou diretamente
no `db.json` reflete automaticamente nos gráficos ao recarregar a página.

### Prints da funcionalidade

> Adicione aqui pelo menos 2 prints da página de estatísticas com dados diferentes
> (por exemplo, antes e depois de cadastrar uma nova versão pelo formulário).

---

## Histórico de versões (tags)

| Tag | Descrição |
|---|---|
| `v1.0` | Ambiente de desenvolvimento inicial — migração do projeto anterior |
| `v2.0` | Implementação da apresentação dinâmica com Chart.js |
| `v3.0` | Documentação final do projeto |