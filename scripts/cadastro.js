document
  .getElementById("form-cadastro")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const url =
      "https://semidiurnal-undespondently-gertie.ngrok-free.dev/cadastro";
    let dadosCadastro = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      senha: document.getElementById("senha").value,
      datanascimento: document.getElementById("dataNasc").value,
      logradouro: document.getElementById("logradouro").value,
      bairro: document.getElementById("bairro").value,
      uf: document.getElementById("uf").value,
      numerocasa: document.getElementById("numero").value,
      telefone: document.getElementById("telefone").value,
      cpf: document.getElementById("cpf").value,
      cep: document.getElementById("cep").value,
      cidade: document.getElementById("cidade").value,
    };
    console.log(dadosCadastro);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dadosCadastro),
    })
      .then((resposta) => {
        console.log(resposta);
        return resposta.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((erro) => {
        console.error(erro);
      });
  });
