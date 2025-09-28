const formCadastro = document.getElementById("form-cadastro");
const campos = document.querySelectorAll(".require");
const spans = document.querySelectorAll(".span-require");
let i;
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
  const question = document.getElementById("question").value.trim(); // pega o texto digitado
  // área de resposta
  const resposta = document.getElementById("resposta");
  // Se o campo estiver vazio, mostra aviso
  if (!question) {
    const aviso = document.createElement("p");
    aviso.innerText = "Por favor, digite uma pergunta.";
    resposta.appendChild(aviso);
    return;
  }

  // Enquanto espera a resposta, mostra "Carregando..."
  const perguntaEl = document.createElement("div");
  perguntaEl.classList.add("mensagem", "usuario");
  perguntaEl.textContent = "Você: " + question;
  resposta.appendChild(perguntaEl);

  // Limpa o input
  document.getElementById("question").value = "";

  try {
    // Faz requisição POST ao backend em Node.js (rota /api/chat)
    const res = await fetch(
      "https://semidiurnal-undespondently-gertie.ngrok-free.dev/question",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }), // envia a pergunta no corpo
      }
    );

    // Converte resposta em JSON
    const data = await res.json();

    // Mostra a resposta da IA no HTML
    const respostaEl = document.createElement("div");
    respostaEl.classList.add("mensagem", "bot");
    respostaEl.textContent =
      "AutoMed: " + (data.response || "Sem resposta da IA.");
    resposta.appendChild(respostaEl);

    resposta.scrollTop = resposta.scrollHeight;
  } catch (err) {
    // Caso aconteça algum erro (ex.: servidor desligado)
    console.error("Erro na requisição:", err);
    const erroEl = document.createElement("div");
    erroEl.classList.add("mensagem", "erro");
    erroEl.textContent = "Erro ao se comunicar com o servidor.";
    resposta.appendChild(erroEl);
  }
}

function chatAuditoria() {
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
      statusDiv.textContent = "Por favor, selecione um arquivo PDF.";
      return;
    }
    let respostaBot = "Recebemos seu exame. Logo teremos os resultados.";

    inputContainer.remove();

    // Mostra resposta do bot no chat
    const respostaEl = document.createElement("div");
    respostaEl.classList.add("mensagem", "bot");
    respostaEl.textContent = "AutoMed: " + respostaBot;
    resposta.appendChild(respostaEl);

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
          body: JSON.stringify(examesTexto),
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
          const resultado = data;
          resultado.forEach((element) => {
            if (element.resultado.length > 0) {
              console.log("Auditoria", element.resultado[0].Auditoria);
            } else {
              console.log("Sem resultado de auditoria");
            }
          });
          console.log(data[1].value);
          respostaBot = data;
          const respostaEl = document.createElement("div");
          respostaEl.classList.add("mensagem", "bot");
          respostaEl.textContent = "AutoMed: " + respostaBot;
          resposta.appendChild(respostaEl);
        })
        .catch((err) => {
          console.log("Erro ao enviar para o backend: " + err.message);
        });
    } catch (err) {
      console.log("Erro ao ler o PDF: " + err.message);
    }
  });
}
