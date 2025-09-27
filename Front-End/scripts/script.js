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
  const resposta = document.getElementById("resposta"); // área de resposta

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
