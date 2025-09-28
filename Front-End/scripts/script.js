let chatState = "normal"; // valores: "normal", "aguardando-exame", "aguardando-procedimento"
let aguardandoEspecialidade = false;
let especialidadeEscolhida = "";
const userId = localStorage.getItem("userId");
const formCadastro = document.getElementById("form-cadastro");
const campos = document.querySelectorAll(".require");
const spans = document.querySelectorAll(".span-require");
let i;

const usuarioId = localStorage.getItem('usuario_id');
if (usuarioId) {
  console.log('Usuário está logado com ID:', usuarioId);
  // Esconde botão de login se existir
  const loginBtn = document.getElementById('login');
  if (loginBtn) loginBtn.style.display = 'none';
  // Esconde botão de cadastro se existir
  const cadastroBtn = document.getElementById('cadastro');
  if (cadastroBtn) cadastroBtn.style.display = 'none';
  // Adiciona botão de sair se não existir
  if (!document.getElementById('logout')) {
    const sairBtn = document.createElement('button');
    sairBtn.id = 'logout';
    sairBtn.textContent = 'Sair';
    sairBtn.style.marginLeft = '10px';
    sairBtn.onclick = function() {
      localStorage.removeItem('usuario_id');
      window.location.reload();
    };
    // Insere o botão sair dentro do .login-cadastro
    const loginCadastroDiv = document.querySelector('.login-cadastro');
    if (loginCadastroDiv) {
      loginCadastroDiv.appendChild(sairBtn);
    } else {
      document.body.appendChild(sairBtn);
    }
  }
}


function setError(index) {
  campos[index].style.border = "2px solid #e63946";
}

function removeError(index) {
  campos[index].style.border = "";
}

function adicionaSpan(index, texto) {
  spans[index].innerHTML = texto;
}
function removeSpan(index, texto) {
  spans[index].innerHTML = texto;
}

campos[0].addEventListener("input", () => {
  i = 0;
  if (campos[i].value.length < 3) {
    setError(i);
    adicionaSpan(i, "Nome inválido: tem menos de 3 letras");
  } else {
    removeError(i);
    removeSpan(i, "");
  }
});
campos[1].addEventListener("input", () => {
  i = 1;
  if (campos[i].value.length !== 11) {
    setError(i);
    adicionaSpan(i, "CPF inválido");
  } else {
    removeError(i);
    removeSpan(i, "");
  }
});
campos[2].addEventListener("input", () => {
  i = 2;
  console.log(campos[i].value);
  if (campos[i].value > "2025-09-27") {
    setError(i);
    adicionaSpan(i, "Data Inválida");
  } else {
    removeError(i);
    removeSpan(i, "");
  }
});

campos[5].addEventListener("input", () => {
  i = 5;
  if (campos[i].value.length !== 8) {
    setError(i);
    adicionaSpan(i, "CEP Inválido");
  } else {
    removeError(i);
    removeSpan(i, "");
  }
});

campos[7].addEventListener("input", () => {
  i = 7;
  console.log(campos[i].value);
  if (campos[i].value <= 0) {
    setError(i);
    adicionaSpan(i, "Numero inválido");
  } else {
    removeError(i);
    removeSpan(i, "");
  }
});

campos[11].addEventListener("input", () => {
  i = 11;
  if (campos[i].value.length < 8) {
    setError(i);
    adicionaSpan(i, "Senha deve conter no mínimo 8 caracteres");
  } else {
    removeError(i);
    removeSpan(i, "");
  }
});
campos[12].addEventListener("input", () => {
  i = 12;
  if (campos[i].value !== campos[9].value) {
    setError(i);
    adicionaSpan(i, "Senhas devem ser iguais");
  } else {
    removeError(i);
    removeSpan(i, "");
  }
});

// let cep = document.getElementById("cep").value;

// let urlCep = `https://viacep.com.br/ws/${cep}/json/`;

// fetch(urlCep)
//   .then((response) => response.json())
//   .then((data) => {
//     if (data.erro) {
//       limpaCampo();
//       return;
//     }
//     document.getElementById("rua").value = data.logradouro;
//     document.getElementById("bairro").value = data.bairro;
//     document.getElementById("cidade").value = data.localidade;
//     document.getElementById("uf").value = data.uf;
//   })

//   .catch((error) => {
//     console.error("Erro ao buscar o CEP: ", error);
//   });

async function enviarPergunta() {
  const questionInput = document.getElementById("question");
  const question = questionInput.value.trim();
  const resposta = document.getElementById("resposta");

  if (!question) {
    const aviso = document.createElement("p");
    aviso.setAttribute("class", "alerta");
    aviso.innerText = "Por favor, digite uma pergunta.";
    resposta.appendChild(aviso);
    return;
  }
  // Se o chat está aguardando resposta para exame ou procedimento, não envia para IA
  if (chatState === "aguardando-exame") {
    if (question.toLowerCase() === "exame") {
      fluxoExame();
      questionInput.value = "";
      return;
    } else if (question.toLowerCase() === "procedimento") {
      chatState = "normal";
      fluxoProcedimento();
      questionInput.value = "";
      return;
    } else {
      respostaChat("Resposta inválida. Digite 'exame' ou 'procedimento'.");
      questionInput.value = "";
      return;
    }
  }

  // Se o chat está no fluxo de agendamento, exibe a mensagem do usuário e não envia para IA
  if (chatState === "agendamento") {
    const perguntaEl = document.createElement("div");
    perguntaEl.classList.add("mensagem", "usuario");
    perguntaEl.textContent = question;
    resposta.appendChild(perguntaEl);
    handleAgendamentoPergunta(question, questionInput);
    return;
  }

  // Fluxo normal: envia para IA
  const perguntaEl = document.createElement("div");
  perguntaEl.classList.add("mensagem", "usuario");
  perguntaEl.textContent = question;
  resposta.appendChild(perguntaEl);
  questionInput.value = "";

  try {
    const res = await fetch(
      "https://semidiurnal-undespondently-gertie.ngrok-free.dev/question",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      }
    );
  const data = await res.json();
  // Usa a função respostaChat para garantir formatação igual à do chat
  respostaChat(data.response || "Sem resposta da IA.");
  console.log('barra fas: ' + data.response);
  } catch (err) {
    console.error("Erro na requisição:", err);
    const erroEl = document.createElement("div");
    erroEl.classList.add("mensagem", "erro");
    erroEl.textContent = "Erro ao se comunicar com o servidor.";
    resposta.appendChild(erroEl);
  }
}

function respostaChat(texto) {
  const resposta = document.getElementById("resposta"); // container do chat
  const respostaEl = document.createElement("div");
  respostaEl.classList.add("mensagem", "bot");
  // Detecta listas numeradas (1. item) e converte em <ol><li>...</li></ol>
  let formatado = texto;
  // Aplica negrito para **texto**
  formatado = formatado.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  if (/\d+\.\s/.test(formatado)) {
    const linhas = formatado.split(/\r?\n/);
    let lista = [];
    let outros = [];
    linhas.forEach(linha => {
      const match = linha.match(/^\s*(\d+)\.\s+(.*)/);
      if (match) {
        lista.push(match[2]);
      } else {
        if (lista.length > 1) {
          outros.push('<ol>' + lista.map(item => `<li>${item}</li>`).join('') + '</ol>');
          lista = [];
        } else if (lista.length === 1) {
          outros.push('1. ' + lista[0]);
          lista = [];
        }
        if (linha.trim()) outros.push(linha);
      }
    });
    if (lista.length > 1) {
      outros.push('<ol>' + lista.map(item => `<li>${item}</li>`).join('') + '</ol>');
    } else if (lista.length === 1) {
      outros.push('&nbsp;1. ' + lista[0]);
    }
    formatado = outros.join('<br>');
  } else {
    formatado = formatado.replace(/\r\n|\n\n|\r\r/g, '<br><br>');
    formatado = formatado.replace(/\n|\r/g, '<br>');
  }
  respostaEl.innerHTML = formatado;
  resposta.appendChild(respostaEl);
  // Scroll automático para o final do chat
  resposta.scrollTop = resposta.scrollHeight;
}

function chatAuditoria() {
  respostaChat(
    "O arquivo é de exame ou procedimento? (responda 'exame' ou 'procedimento')"
  );
  chatState = "aguardando-exame";
}
function fluxoExame() {
  const resposta = document.getElementById("resposta"); // área de respostas

  // Aviso para o usuário
  const aviso = document.createElement("p");
  aviso.innerText = "Por favor, adicione o arquivo do exame.";
  resposta.appendChild(aviso);

  // Container do input e botão
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("input", "bot");

  // Input de arquivo
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = "application/pdf";
  inputFile.id = "pdfFile";
  inputContainer.appendChild(inputFile);

  // Botão de enviar
  const btnEnviar = document.createElement("button");
  btnEnviar.id = "submitBtn";
  btnEnviar.textContent = "Enviar arquivo";
  btnEnviar.style.marginLeft = "10px";
  btnEnviar.style.marginTop = "10px";
  inputContainer.appendChild(btnEnviar);

  resposta.appendChild(inputContainer);

  btnEnviar.addEventListener("click", async () => {
    const fileInput = document.getElementById("pdfFile");
    // const statusDiv = document.getElementById("status");
    // statusDiv.textContent = "";

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Por favor, selecione um arquivo PDF.");
      return;
    }
    let respostaBot = "Recebemos seu exame. Logo teremos os resultados.";
    aviso.remove();
    inputContainer.remove();

    // Mostra resposta do bot no chat
    respostaChat(respostaBot);

    const file = fileInput.files[0];
    // statusDiv.textContent = "Lendo o PDF e extraindo texto via OCR...";

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textoExtraido = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        // statusDiv.textContent = `Processando página ${i} de ${pdf.numPages}...`;
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport })
          .promise;
        // OCR com Tesseract.js
        const {
          data: { text },
        } = await Tesseract.recognize(canvas, "por");
        textoExtraido += `Texto extraído de página ${i}:\n` + text + "\n\n";
      }
      // Exibir apenas o texto após 'Exames Laboratoriais' e enviar para o backend como texto separado por vírgula
      let textoFiltrado = textoExtraido;
      const idx = textoExtraido.toLowerCase().indexOf("exames laboratoriais");
      if (idx !== -1) {
        textoFiltrado = textoExtraido
          .slice(idx + "exames laboratoriais".length)
          .trim();
      }
      // Separar exames por linha, removendo vazios
      const exames = textoFiltrado
        .split(/\n|\r/)
        .map((e) => e.trim())
        .filter((e) => e);
      const examesTexto = exames.join("|");
      console.log("Enviando exames para o backend...");
      console.log(examesTexto);
      // Enviar para o backend como texto separado por vírgula
      fetch(
        "https://semidiurnal-undespondently-gertie.ngrok-free.dev/autorizacao",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: examesTexto,
        }
      )
        .then((res) => res.text())
        .then((data) => {
          console.log("Exames enviados com sucesso!");
          // const pre = document.createElement("pre");
          // pre.textContent = data;
          // statusDiv.appendChild(pre);
          // console.log(pre);
          // let resultado = {
          //   "termo":"data."
          // }
          const resultado = Array.isArray(data) ? data : JSON.parse(data);

          resultado.forEach((element) => {
            if (element.resultado.length > 0) {
              const auditoria = element.resultado[0].Auditoria;
              if (auditoria == "NÃO") {
                respostaBot = `Exame: ${element.termo}: Não precisa de auditoria`;
                respostaChat(respostaBot);
              } else if (auditoria == "AUDITORIA") {
                respostaBot = `Exame: ${element.termo}: Precisa de auditoria. Tempo máximo para resposta é de 5 (cinco) dias`;
                respostaChat(respostaBot);
              } else{
                console.log('Elemento:', element.resultado[1].Auditoria);
                respostaBot = `Exame: ${element.termo}: Precisa de auditoria. Tempo máximo para resposta é de 10 (dez) dias`;
                respostaChat(respostaBot);
              }
            } else {
              respostaBot =
                "Sem resultado de auditoria. Você pode ter enviado o tipo de arquivo errado.";
              respostaChat(respostaBot);
            }
          });
        })
        .catch((err) => {
          console.log("Erro ao enviar para o backend: " + err.message);
        });
    } catch (err) {
      console.log("Erro ao ler o PDF: " + err.message);
    }
  });
  chatState = "normal";
}

function fluxoProcedimento() {
  const resposta = document.getElementById("resposta"); // área de respostas

  // Aviso para o usuário
  const aviso = document.createElement("p");
  aviso.innerText = "Por favor, adicione o arquivo do exame.";
  resposta.appendChild(aviso);

  // Container do input e botão
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("input", "bot");

  // Input de arquivo
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = "application/pdf";
  inputFile.id = "pdfFile";
  inputContainer.appendChild(inputFile);

  // Botão de enviar
  const btnEnviar = document.createElement("button");
  btnEnviar.id = "submitBtn";
  btnEnviar.textContent = "Enviar arquivo";
  btnEnviar.style.marginLeft = "10px";
  btnEnviar.style.marginTop = "10px";
  inputContainer.appendChild(btnEnviar);

  resposta.appendChild(inputContainer);

  btnEnviar.addEventListener("click", async () => {
    const fileInput = document.getElementById("pdfFile");
    //const statusDiv = document.getElementById("status");
    //statusDiv.textContent = "";

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Por favor, selecione um arquivo PDF.");
      return;
    }

    let respostaBot = "Recebemos seu exame. Logo teremos os resultados.";
    aviso.remove();
    inputContainer.remove();

    // Mostra resposta do bot no chat
    respostaChat(respostaBot);

    const file = fileInput.files[0];
    //statusDiv.textContent = "Lendo o PDF e extraindo texto via OCR...";

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textoExtraido = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        //statusDiv.textContent = `Processando página ${i} de ${pdf.numPages}...`;
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport })
          .promise;
        // OCR com Tesseract.js
        const {
          data: { text },
        } = await Tesseract.recognize(canvas, "por");
        textoExtraido += `Texto extraído de página ${i}:\n` + text + "\n\n";
      }
      // Filtrar pelo nome do arquivo: se contiver 'procedimento', trata como procedimento, senão como exame laboratorial
      const nomeArquivo = file.name.toLowerCase();
      let textoFiltrado = "";
      let exames = [];
      if (nomeArquivo.includes("procedimento")) {
        // Procedimento: junta tudo em uma linha, remove data do início
        const textoLower = textoExtraido.toLowerCase();
        // Procurar última ocorrência de 'Data:'
        const idxData = textoLower.lastIndexOf("data:");
        if (idxData !== -1) {
          textoFiltrado = textoExtraido.slice(idxData + "data:".length).trim();
          // Pega só o primeiro bloco de texto (até linha em branco ou assinatura)
          textoFiltrado = textoFiltrado
            .split(/\n\s*\n|\n\s*Dr\.|\n\s*CRM:/i)[0]
            .trim();
        } else {
          textoFiltrado = textoExtraido.trim();
        }
        // Remove a data do início, se houver
        textoFiltrado = textoFiltrado.replace(
          /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}\s*/,
          ""
        );
        // Junta todas as linhas em uma só, separadas por espaço
        const linhaUnica = textoFiltrado
          .split(/\n|\r/)
          .map((e) => e.trim())
          .filter((e) => e)
          .join(" ");
        exames = linhaUnica ? [linhaUnica] : [];
      } else {
        // Exame laboratorial: cada linha é um exame
        const textoLower = textoExtraido.toLowerCase();
        const idxExames = textoLower.indexOf("exames laboratoriais");
        if (idxExames !== -1) {
          textoFiltrado = textoExtraido
            .slice(idxExames + "exames laboratoriais".length)
            .trim();
          exames = textoFiltrado
            .split(/\n|\r/)
            .map((e) => e.trim())
            .filter((e) => e);
        } else {
          // fallback: tudo em uma linha
          textoFiltrado = textoExtraido.trim();
          exames = textoFiltrado ? [textoFiltrado] : [];
        }
      }
      const examesTexto = exames.join(", ");
      //statusDiv.textContent = "Enviando exames para o backend...";
      console.log(examesTexto);
      fetch(
        "https://semidiurnal-undespondently-gertie.ngrok-free.dev/autorizacao",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: examesTexto,
        }
      )
        .then((res) => res.text())
        .then((data) => {
          console.log("Exames enviados com sucesso!");
          // const pre = document.createElement("pre");
          // pre.textContent = data;
          // statusDiv.appendChild(pre);
          // console.log(pre);
          // let resultado = {
          //   "termo":"data."
          // }
          const resultado = Array.isArray(data) ? data : JSON.parse(data);
          console.log(data);
          resultado.forEach((element) => {
            if (element.resultado.length > 0) {
              const auditoria = element.resultado[0].Auditoria;
              if (auditoria == "NÃO") {
                respostaBot = `Procedimento: ${element.termo}: Não precisa de auditoria`;
                respostaChat(respostaBot);
              } else if (auditoria == "AUDITORIA") {
                respostaBot = `Procedimento: ${element.termo}: Precisa de auditoria. Tempo máximo para resposta é de 5 (cinco) dias`;
                respostaChat(respostaBot);
              } else {
                respostaBot = `Procedimento: ${element.termo}: Precisa de auditoria. Tempo máximo para resposta é de 10 (dez) dias`;
                respostaChat(respostaBot);
              }
            } else {
              respostaBot =
                "Sem resultado de auditoria. Você pode ter enviado o tipo de arquivo errado.";
              respostaChat(respostaBot);
            }
          });
        })
        .catch((err) => {
          console.log("Erro ao enviar para o backend: " + err.message);
        });
    } catch (err) {
      console.log("Erro ao ler o PDF: " + err.message);
    }
  });
}

// --- INÍCIO DO FLUXO DE AGENDAMENTO ---

function consultaAgenda() {
  chatState = "agendamento";
  aguardandoEspecialidade = true;
  window.medicosDisponiveis = undefined;
  window.medicoSelecionado = undefined;
  window.horariosDisponiveis = undefined;
  window.agendamentoFinalizado = false;
  iniciarAgendamento();
}

function iniciarAgendamento() {
  if (!userId) {
    respostaChat("Usuário não identificado. Faça login novamente.");
    return;
  }
  respostaChat("Qual especialidade você deseja para a consulta?");
  aguardandoEspecialidade = true;
}

async function receberEspecialidade(especialidade) {
  especialidadeEscolhida = especialidade;
  aguardandoEspecialidade = false;
  // Garante que o chat continue barrando a IA até o fim do agendamento
  chatState = "agendamento";
  await buscarMedicosPorRegiaoEEspecialidade(especialidadeEscolhida);
}

async function buscarMedicosPorRegiaoEEspecialidade(especialidade) {
  respostaChat(`Buscando médicos de ${especialidade} na sua região...`);
  try {
    const res = await fetch(
      "https://semidiurnal-undespondently-gertie.ngrok-free.dev/medicos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: userId,
          especialidades: especialidade,
        }),
      }
    );
    const medicos = await res.json();
    if (!Array.isArray(medicos) || medicos.length === 0) {
      respostaChat(
        "Nenhum médico encontrado para essa especialidade na sua região."
      );
      return;
    }
    respostaChat("Escolha um dos médicos abaixo, digitando o nome ou ID:");
    medicos.forEach((med) => {
      respostaChat(
        `ID: ${med.MEDICO_ID} | Nome: ${med.NOME} | Especialidade: ${med.ESPECIALIDADE}`
      );
    });
    window.medicosDisponiveis = medicos;
  } catch (err) {
    respostaChat("Erro ao buscar médicos: " + err.message);
  }
}

async function escolherMedico(medicoEscolhido) {
  // Salva a data selecionada para uso posterior
  window.dataSelecionadaAgendamento = null;
  const medicos = window.medicosDisponiveis || [];
  const medico = medicos.find(
    (m) =>
      m.MEDICO_ID == medicoEscolhido ||
      m.NOME.toLowerCase() === medicoEscolhido.toLowerCase()
  );
  if (!medico) {
    respostaChat("Médico não encontrado. Tente novamente.");
    return;
  }
  window.medicoSelecionado = medico;
  // Exibe campo para o usuário escolher a data (ano, mês, dia)
  const resposta = document.getElementById("resposta");
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("input", "bot");
  const label = document.createElement("label");
  label.textContent = `Escolha o dia para consultar com Dr(a). ${medico.NOME}: `;
  label.style.marginRight = "10px";
  const inputDate = document.createElement("input");
  inputDate.type = "date";
  inputDate.id = "dataConsulta";
  inputDate.style.marginRight = "10px";
  const btnEnviar = document.createElement("button");
  btnEnviar.textContent = "Buscar horários";
  btnEnviar.onclick = async () => {
    const dataSelecionada = inputDate.value;
    if (!dataSelecionada) {
      respostaChat("Por favor, selecione uma data.");
      return;
    }
    respostaChat(
      `Buscando horários disponíveis para o dia ${dataSelecionada}...`
    );
    inputContainer.remove();
    window.dataSelecionadaAgendamento = dataSelecionada;
    try {
      const res = await fetch(
        "https://semidiurnal-undespondently-gertie.ngrok-free.dev/getAgendamentos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medico_id: medico.MEDICO_ID,
            data: dataSelecionada,
          }),
        }
      );
      const horariosJson = await res.json();
      let horarios = [];
      if (Array.isArray(horariosJson)) {
        horarios = horariosJson;
      } else if (
        horariosJson &&
        Array.isArray(horariosJson.horariosDisponiveis)
      ) {
        horarios = horariosJson.horariosDisponiveis;
      }
      if (!Array.isArray(horarios) || horarios.length === 0) {
        respostaChat("Nenhum horário disponível para este médico neste dia.");
        return;
      }
      respostaChat("Escolha um horário disponível:");
      horarios.forEach((h) => {
        // Se for string tipo '2025-09-28 08:00', mostra só a hora
        let hora = h;
        if (typeof h === "string" && h.includes(" ")) {
          hora = h.split(" ")[1];
        }
        respostaChat(`Horário: ${hora}`);
      });
      window.horariosDisponiveis = horarios;
    } catch (err) {
      respostaChat("Erro ao buscar horários: " + err.message);
    }
  };
  inputContainer.appendChild(label);
  inputContainer.appendChild(inputDate);
  inputContainer.appendChild(btnEnviar);
  resposta.appendChild(inputContainer);
}

async function agendarConsulta(dia, horario) {
  const medico = window.medicoSelecionado;
  if (!medico) {
    respostaChat("Selecione um médico antes de agendar.");
    return;
  }
  respostaChat(
    `Agendando consulta para o dia ${dia} às ${horario} com Dr(a). ${medico.NOME}...`
  );
  console.log(`${dia} ${horario}`);
  try {
    const res = await fetch(
      "https://semidiurnal-undespondently-gertie.ngrok-free.dev/agendamentos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: userId,
          medico_id: medico.MEDICO_ID,
          data: `${dia} ${horario}`,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na resposta do servidor");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Resposta do agendamento:", data.mensagem);
        respostaChat(data.mensagem || "Agendamento realizado com sucesso!");
        // if (data.status === 1) {
        //   respostaChat("Agendamento realizado com sucesso!");
        // } else {
        //   respostaChat("Não foi possível agendar. Tente novamente.");
        // }
      });
    //const resultado = await res.json();
  } catch (err) {
    respostaChat("Erro ao agendar: " + err.message);
  }
}

// Função central para controlar o fluxo de perguntas do agendamento
function handleAgendamentoPergunta(question, questionInput) {
  if (aguardandoEspecialidade) {
    receberEspecialidade(question);
    questionInput.value = "";
    return;
  }
  if (window.medicosDisponiveis && !window.medicoSelecionado) {
    escolherMedico(question);
    questionInput.value = "";
    return;
  }
  if (
    window.horariosDisponiveis &&
    window.medicoSelecionado &&
    !window.agendamentoFinalizado
  ) {
    // Permite que o usuário responda apenas com o horário (hh:mm)
    const horario = question.trim();
    const dia = window.dataSelecionadaAgendamento;
    if (horario && dia) {
      agendarConsulta(dia, horario).then(() => {
        window.agendamentoFinalizado = true;
        chatState = "normal";
      });
    } else {
      respostaChat(
        "Por favor, selecione um horário válido clicando em um dos horários disponíveis."
      );
    }
    questionInput.value = "";
    return;
  }
  // Se chegou aqui, aguarda próximo passo do fluxo
  return;
}
// --- FIM DO FLUXO DE AGENDAMENTO ---


