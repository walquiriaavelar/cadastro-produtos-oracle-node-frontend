function mostrarErroCampo(idCampo, mensagem) {
  const campo = document.getElementById(idCampo);
  let erro = document.getElementById(idCampo + "-erro");

  if (!erro) {
    erro = document.createElement("small");
    erro.id = idCampo + "-erro";
    erro.classList.add("text-red-600", "text-sm");
    campo.insertAdjacentElement("afterend", erro);
  }

  erro.textContent = mensagem;
  campo.classList.add("border", "border-red-500");
}

function limparErroCampo(idCampo) {
  const campo = document.getElementById(idCampo);
  const erro = document.getElementById(idCampo + "-erro");

  if (erro) erro.remove();
  campo.classList.remove("border", "border-red-500");
}

const linhaSelect = document.getElementById('linha');
const familiaSelect = document.getElementById('familia');
const form = document.getElementById('form-produto');
const mensagemDiv = document.getElementById('mensagem');

async function carregarCombos() {
  try {
    const respLinhas = await fetch('http://localhost:3000/linhas-produto');
    const linhas = await respLinhas.json();

    linhaSelect.innerHTML = linhas
      .map(l => `<option value="${l.codgru}">${l.desgru}</option>`)
      .join('');

    linhaSelect.addEventListener('change', async () => {
      const codgru = linhaSelect.value;
      const resp = await fetch(`http://localhost:3000/familias-produto?linha=${codgru}`);
      const familias = await resp.json();

      familiaSelect.innerHTML = familias
        .map(f => `<option value="\${f.codfam}">\${f.desfam}</option>`)
        .join('');
    });

    linhaSelect.dispatchEvent(new Event('change'));
  } catch (error) {
    console.error('Erro ao carregar combos:', error);
  }
}

document.getElementById('unidade').addEventListener('input', function () {
  this.value = this.value.toUpperCase();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  mensagemDiv.classList.add('hidden');
  mensagemDiv.textContent = '';

  const dados = {
    codigo: get('codigo'),
    nome: get('nome'),
    referencia: get('referencia'),
    unidade: get('unidade').toUpperCase(),
    produto_infologia: get('produto-infologia'),
    produto_base: get('produto-base'),
    grupo_produto: get('grupo-produto'),
    linha: linhaSelect.value,
    familia: familiaSelect.value,
    largura: parseFloat(get('largura')),
    comprimento: parseFloat(get('comprimento')),
    cmp_fita: parseFloat(get('cmp-fita')),
    cmp_dobra: parseFloat(get('cmp-dobra')),
    tipo_fundo: get('tipo-fundo'),
    local_aplicacao: get('local-aplicacao'),
    estonar: document.getElementById('estonar').checked,
    acondicionamento: parseInt(get('acondicionamento')),
    temperatura: parseFloat(get('temperatura')),
    tipo_emenda: get('tipo-emenda'),
    cmp_figura: parseFloat(get('cmp-figura')),
    destino_produto: get('destino-produto'),
    tipo_corte_dobra: parseInt(get('tipo-corte-dobra')),
    tipo_manequim: parseInt(get('tipo-manequim')),
    tipo_ourela: get('tipo-ourela'),
    metros_rolo: parseFloat(get('metros-rolo')),
    grupo_preco: parseFloat(get('grupo-preco')),
    unidades_rolo: parseFloat(get('unidades-rolo')),
    tempo_recorte: parseFloat(get('tempo-recorte')),
    origem_enrolamento: parseInt(get('origem-enrolamento')),
    corte_laser: get('corte-laser'),
    acabado1_largura: parseFloat(get('acabado1-largura')),
    acabado1_comprimento: parseFloat(get('acabado1-comprimento')),
    acabado2_largura: parseFloat(get('acabado2-largura')),
    acabado2_comprimento: parseFloat(get('acabado2-comprimento')),
    modelo_recorte_1: get('modelo-recorte-1'),
    modelo_recorte_2: get('modelo-recorte-2'),
    embalagem: get('embalagem'),
    qtd_embalagem: parseFloat(get('qtd-embalagem')),
    origem_ideia: parseInt(get('origem-ideia')),
    marca: get('marca'),
    cliente_detentor: parseFloat(get('cliente-detentor'))
  };

  try {
    const resp = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (resp.ok) {
      mostrarSucesso('Produto cadastrado com sucesso!');
      form.reset();
      linhaSelect.dispatchEvent(new Event('change'));
    } else {
      const erro = await resp.text();
      mostrarErro(`Erro ao cadastrar: \${erro}`);
    }
  } catch (error) {
    console.error(error);
    mostrarErro('Erro na comunicação com servidor');
  }
});

function get(id) {
  return document.getElementById(id).value.trim();
}

function mostrarErro(msg) {
  mensagemDiv.textContent = msg;
  mensagemDiv.className = 'text-center font-medium mt-4 text-red-600';
  mensagemDiv.classList.remove('hidden');
}

function mostrarSucesso(msg) {
  mensagemDiv.textContent = msg;
  mensagemDiv.className = 'text-center font-medium mt-4 text-green-600';
  mensagemDiv.classList.remove('hidden');
}

function validarFormulario() {
  document.querySelectorAll("input, select").forEach(campo => limparErroCampo(campo.id));
  const codigo = get("codigo");
  const nome = get("nome");
  const referencia = get("referencia");
  const unidade = get("unidade");
  const produtoInfologia = get("produto-infologia");
  const linha = linhaSelect.value;
  const familia = familiaSelect.value;
  const largura = parseFloat(get("largura"));
  const comprimento = parseFloat(get("comprimento"));
  const cmpFita = parseFloat(get("cmp-fita"));
  const cmpDobra = parseFloat(get("cmp-dobra"));
  const temperatura = parseFloat(get("temperatura"));
  const acondicionamento = parseInt(get("acondicionamento"));
  const cmpFigura = parseFloat(get("cmp-figura"));
  const origemIdeia = parseInt(get("origem-ideia"));
  const tipoManequim = parseInt(get("tipo-manequim"));
  const tipoFundo = get("tipo-fundo");
  const tipoOurela = get("tipo-ourela");
  const destinoProduto = get("destino-produto");
  const tipoCorteDobra = parseInt(get("tipo-corte-dobra"));
  const metrosRolo = parseFloat(get("metros-rolo"));
  const unidadesRolo = parseFloat(get("unidades-rolo"));
  const marca = get("marca");
  const clienteDetentor = parseFloat(get("cliente-detentor"));

if (!isNaN(cmpDobra) && !isNaN(comprimento) && cmpDobra > comprimento) {
  mostrarErroCampo("formulario", "O Comprimento da Dobra não pode ser maior que o Comprimento do produto.");
  return false;
}


if (!isNaN(cmpFigura) && !isNaN(comprimento) && cmpFigura > comprimento) {
  mostrarErroCampo("formulario", "O Comprimento da Figura não pode ser maior que o Comprimento total.");
  return false;
}

  if (marca && marca.length > 30) {
  mostrarErroCampo("formulario", "Marca deve ter no máximo 30 caracteres.");
  return false;
  }

if (!isNaN(clienteDetentor) && clienteDetentor < 0) {
  mostrarErroCampo("formulario", "Cliente Detentor não pode ser negativo.");
  return false;
}


  if (codigo) {
    mostrarErroCampo("formulario", "Edição de produtos existentes ainda não implementada.");
    return false;
  }

  if (!nome || nome.length > 40) {
    mostrarErroCampo("formulario", "Nome é obrigatório e deve ter no máximo 40 caracteres.");
    return false;
  }

  if (referencia && referencia.length > 30) {
    mostrarErroCampo("formulario", "Referência deve ter no máximo 30 caracteres.");
    return false;
  }

  if (!unidade || !["PC", "MT"].includes(unidade.toUpperCase())) {
    mostrarErroCampo("formulario", "Unidade deve ser 'PC' ou 'MT'.");
    return false;
  }

  if (!produtoInfologia || produtoInfologia.length > 20) {
    mostrarErroCampo("formulario", "Produto Infologia é obrigatório e deve ter até 20 caracteres.");
    return false;
  }

  if (!linha) {
    mostrarErroCampo("formulario", "Linha do produto é obrigatória.");
    return false;
  }

  if (!familia) {
    mostrarErroCampo("formulario", "Família do produto é obrigatória.");
    return false;
  }

  if (isNaN(largura) || largura <= 0) {
    mostrarErroCampo("formulario", "Largura deve ser um número positivo.");
    return false;
  }

  if (isNaN(comprimento) || comprimento <= 0) {
    mostrarErroCampo("formulario", "Comprimento deve ser um número positivo.");
    return false;
  }

  if (!isNaN(cmpFita) && cmpFita < 0) mostrarErroCampo("formulario", "Comprimento de fita não pode ser negativo.");
  return false;
  if (!isNaN(cmpDobra) && cmpDobra < 0) mostrarErroCampo("formulario", "Comprimento de dobra não pode ser negativo.");
  return false;
  if (!isNaN(temperatura) && temperatura < 0) mostrarErroCampo("formulario", "Temperatura não pode ser negativa.");
  return false;
  if (!isNaN(acondicionamento) && acondicionamento < 0) mostrarErroCampo("formulario", "Acondicionamento não pode ser negativo.");
  return false;
  if (!isNaN(cmpFigura) && cmpFigura < 0) mostrarErroCampo("formulario", "Comprimento da Figura não pode ser negativo.");
  return false;

  if (isNaN(origemIdeia) || origemIdeia <= 0) mostrarErroCampo("formulario", "Origem da Ideia é obrigatória e deve ser um número positivo.");
  return false;
  if (isNaN(tipoManequim) || tipoManequim <= 0) mostrarErroCampo("formulario", "Tipo Manequim é obrigatório e deve ser um número positivo.");
  return false;
  if (tipoFundo && tipoFundo.length > 30) mostrarErroCampo("formulario", "Tipo Fundo deve ter no máximo 30 caracteres.");
  return false;
  if (tipoOurela && tipoOurela.length > 30) mostrarErroCampo("formulario", "Tipo Ourela deve ter no máximo 30 caracteres.");
  return false;
  if (!destinoProduto) mostrarErroCampo("formulario", "Destino do Produto é obrigatório.");
  return false;
  if (!isNaN(tipoCorteDobra) && (tipoCorteDobra < 0 || tipoCorteDobra > 9999)) mostrarErroCampo("formulario", "Tipo Corte Dobra deve estar entre 0 e 9999.");
  return false;
  if (!isNaN(metrosRolo) && metrosRolo <= 0) mostrarErroCampo("formulario", "Metros por rolo deve ser positivo.");
  return false;
  if (!isNaN(unidadesRolo) && unidadesRolo <= 0) mostrarErroCampo("formulario", "Unidades por rolo deve ser positivo.");
  return false;

  
    // Validação condicional: Comprimento da Dobra
    const tipoCorteDobra = get('tipo-corte-dobra');
    if (tipoCorteDobra === 'COMP DOBRA') {
        const cmpDobra = parseFloat(get('cmp-dobra'));
        if (isNaN(cmpDobra) || cmpDobra <= 0) {
            mostrarErroCampo("formulario", "Comprimento da Dobra é obrigatório e deve ser maior que zero.");
            return false;
        }
    }

    // Validação condicional: Modelo Recorte obrigatório se tipo = FACA ou NUMERO
    const tipoRecorte = get('tipo-corte-dobra');
    const modeloRecorte = parseFloat(get('modelo-recorte-1')) || 0;
    if ((tipoRecorte === 'FACA' || tipoRecorte === 'NUMERO') && modeloRecorte <= 0) {
        mostrarErroCampo("formulario", "Modelo Recorte é obrigatório e deve ser maior que zero.");
        return false;
    }

    // Validação condicional: Produto Base obrigatório se tipo fundo = FITA
    const tipoFundo = get('tipo-fundo');
    const produtoBase = get('produto-base');
    if (tipoFundo === 'FITA' && !produtoBase) {
        mostrarErroCampo("formulario", "Produto Base é obrigatório quando Tipo Fundo for FITA.");
        return false;
    }

    // Validação condicional: Grupo Preço obrigatório se tipo corte = REC.PREÇO
    if (tipoRecorte === 'REC.PREÇO') {
        const grupoPreco = parseFloat(get('grupo-preco')) || 0;
        if (grupoPreco <= 0) {
            mostrarErroCampo("formulario", "Grupo Preço é obrigatório e deve ser maior que zero.");
            return false;
        }
    }

    // Validação condicional: Acabado1 Largura
    const tipoQtd2 = get('tipo-qtd-2');
    if (tipoQtd2 === 'LARGURA') {
        const acabado1Largura = parseFloat(get('acabado1-largura')) || 0;
        if (acabado1Largura <= 0) {
            mostrarErroCampo("formulario", "Medida Acabada 1 - Largura deve ser maior que zero.");
            return false;
        }
    }

    // Validação condicional: Acabado1 Comprimento
    const tipoQtd3 = get('tipo-qtd-3');
    if (tipoQtd3 === 'COMPR') {
        const acabado1Comprimento = parseFloat(get('acabado1-comprimento')) || 0;
        if (acabado1Comprimento <= 0) {
            mostrarErroCampo("formulario", "Medida Acabada 1 - Comprimento deve ser maior que zero.");
            return false;
        }
    }
    
    // Validação: Medidas Acabadas 2 - Largura e Comprimento se modelo recorte 2 informado
    const modeloRecorte2 = parseFloat(get('modelo-recorte-2')) || 0;
    const tipoQtd2_2 = get('tipo-qtd2-2'); // LARGURA
    const tipoQtd3_2 = get('tipo-qtd3-2'); // COMPR
    if (modeloRecorte2 > 0 && (tipoQtd2_2 === 'LARGURA')) {
        const acabado2Largura = parseFloat(get('acabado2-largura')) || 0;
        if (acabado2Largura <= 0) {
            mostrarErroCampo("formulario", "Medida Acabada 2 - Largura deve ser maior que zero.");
            return false;
        }
    }
    if (modeloRecorte2 > 0 && (tipoQtd3_2 === 'COMPR')) {
        const acabado2Comprimento = parseFloat(get('acabado2-comprimento')) || 0;
        if (acabado2Comprimento <= 0) {
            mostrarErroCampo("formulario", "Medida Acabada 2 - Comprimento deve ser maior que zero.");
            return false;
        }
    }

    // Validação: Largura Acabada (soma dos acabados 1 e 2) <= Largura
    const acabado1Largura = parseFloat(get('acabado1-largura')) || 0;
    const acabado2Largura = parseFloat(get('acabado2-largura')) || 0;
    const largura = parseFloat(get('largura')) || 0;
    const larguraAcabada = acabado1Largura + acabado2Largura;
    if (!isNaN(largura) && larguraAcabada > largura) {
        mostrarErroCampo("formulario", "A soma das Larguras Acabadas não pode ser maior que a Largura do produto.");
        return false;
    }

    // Quantidade Acondicionamento obrigatório se tipo for METROS, PECAS ou UNIDS
    const acond = parseFloat(get('acondicionamento')) || 0;
    const tipoQtd1Acond = get('tipo-qtd1-acond'); // e.g., 'METROS', 'PECAS', 'UNIDS'
    if (acond > 0 && ['METROS', 'PECAS', 'UNIDS'].includes(tipoQtd1Acond)) {
        const qtdAcond = parseFloat(get('qtd-acondicionamento')) || 0;
        if (qtdAcond <= 0) {
            mostrarErroCampo("formulario", "Quantidade de Acondicionamento deve ser maior que zero.");
            return false;
        }
    }

    // Quantidade Embalagem obrigatória se tipo for METROS ou UNIDS
    const embal = parseFloat(get('embalagem')) || 0;
    const tipoQtd1Embal = get('tipo-qtd1-embal'); // e.g., 'METROS', 'UNIDS'
    if (embal > 0 && ['METROS', 'UNIDS'].includes(tipoQtd1Embal)) {
        const qtdEmbal = parseFloat(get('qtd-embalagem')) || 0;
        if (qtdEmbal <= 0) {
            mostrarErroCampo("formulario", "Quantidade de Embalagem deve ser maior que zero.");
            return false;
        }
    }

    // Trama (MM) = Comprimento
    const tramaMM = parseFloat(get('trama-mm')) || 0;
    const comprimento = parseFloat(get('comprimento')) || 0;
    if (tramaMM > 0 && tramaMM !== comprimento) {
        mostrarErroCampo("formulario", "O comprimento da trama deve ser igual ao comprimento do produto.");
        return false;
    }

    // Trama B/T MM obrigatório se Trama B/T informado
    const tramaBT = get('trama-bt');
    const tramaBTMM = get('trama-bt-mm');
    if (tramaBT && !tramaBTMM) {
        mostrarErroCampo("formulario", "O campo Trama (B/T MM) é obrigatório se Trama (B/T) for informado.");
        return false;
    }

    // Cor Figura obrigatória para linhas != Etiqueta Tecida
    const linhaProduto = get('linha-produto');
    const corFigura = get('cor-figura');
    if (linhaProduto !== '01' && !corFigura) {
        mostrarErroCampo("formulario", "Pelo menos uma cor de figura é obrigatória.");
        return false;
    }

    // Comprimento Figura obrigatório para linha 01 se cor figura informada
    const comprimentoFigura = parseFloat(get('comprimento-figura')) || 0;
    if (linhaProduto === '01' && corFigura && comprimentoFigura <= 0) {
        mostrarErroCampo("formulario", "Comprimento da figura obrigatório para Etiqueta Tecida se cor informada.");
        return false;
    }

    // Figura B/T MM obrigatório se Figura B/T informado
    const figuraBT = get('figura-bt');
    const figuraBTMM = get('figura-bt-mm');
    if (figuraBT && !figuraBTMM) {
        mostrarErroCampo("formulario", "O campo Figura B/T MM é obrigatório se Figura B/T for informado.");
        return false;
    }

    // Medida Acabada 1 - Largura
    const modeloRecorte1 = get('modelo-recorte-1');
    const tipoQtd2 = get('tipo-qtd2');
    const de2QtdInf = get('de2qtdinf');
    const acabado1Largura = parseFloat(get('acabado1-largura')) || 0;
    if (modeloRecorte1 && ['O', 'Z'].includes(tipoQtd2) && de2QtdInf === 'LARGURA' && acabado1Largura <= 0) {
      mostrarErroCampo("formulario", "Medida Acabada 1 - Largura é obrigatória e deve ser maior que zero.");
      return false;
    }

    // Medida Acabada 1 - Comprimento
    const tipoQtd3 = get('tipo-qtd3');
    const de3QtdInf = get('de3qtdinf');
    const acabado1Comprimento = parseFloat(get('acabado1-comprimento')) || 0;
    if (modeloRecorte1 && ['O', 'Z'].includes(tipoQtd3) && de3QtdInf === 'COMPR' && acabado1Comprimento <= 0) {
      mostrarErroCampo("formulario", "Medida Acabada 1 - Comprimento é obrigatória e deve ser maior que zero.");
      return false;
    }

    // Medida Acabada 2 - Largura
    const modeloRecorte2 = get('modelo-recorte-2');
    const tipoQtd2_2 = get('tipo-qtd2-2');
    const de2QtdInf_2 = get('de2qtdinf-2');
    const acabado2Largura = parseFloat(get('acabado2-largura')) || 0;
    if (modeloRecorte2 && ['O', 'Z'].includes(tipoQtd2_2) && de2QtdInf_2 === 'LARGURA' && acabado2Largura <= 0) {
      mostrarErroCampo("formulario", "Medida Acabada 2 - Largura é obrigatória e deve ser maior que zero.");
      return false;
    }

    // Medida Acabada 2 - Comprimento
    const tipoQtd3_2 = get('tipo-qtd3-2');
    const de3QtdInf_2 = get('de3qtdinf-2');
    const acabado2Comprimento = parseFloat(get('acabado2-comprimento')) || 0;
    if (modeloRecorte2 && ['O', 'Z'].includes(tipoQtd3_2) && de3QtdInf_2 === 'COMPR' && acabado2Comprimento <= 0) {
      mostrarErroCampo("formulario", "Medida Acabada 2 - Comprimento é obrigatória e deve ser maior que zero.");
      return false;
    }


// Validação extra: Grupo do Produto
if (!get("grupo-produto")) {
  mostrarErroCampo("grupo-produto", "Grupo do Produto é obrigatório.");
  return false;
}

// Validação extra: Produto Base
if (!get("produto-base")) {
  mostrarErroCampo("produto-base", "Produto Base é obrigatório.");
  return false;
}

// Validação extra: Modelo Recorte 1 se tipo for FACA ou NUMERO
const tipoRecorte = get("tipo-corte-dobra");
const modelo1 = get("modelo-recorte-1");
if ((tipoRecorte === "FACA" || tipoRecorte === "NUMERO") && !modelo1) {
  mostrarErroCampo("modelo-recorte-1", "Obrigatório para tipo de recorte FACA ou NUMERO.");
  return false;
}

// Validação extra: Modelo Recorte 2 se informado deve ser numérico > 0
const modelo2 = parseInt(get("modelo-recorte-2"));
if (!isNaN(modelo2) && modelo2 <= 0) {
  mostrarErroCampo("modelo-recorte-2", "Modelo Recorte 2 deve ser maior que 0.");
  return false;
}

  return true;
}

carregarCombos();