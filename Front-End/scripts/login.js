document.getElementById("form-login").addEventListener("submit", function (e) {
  e.preventDefault();

  const url = "https://semidiurnal-undespondently-gertie.ngrok-free.dev/login";
  let dadosLogin = {
    email: document.getElementById("loginEmail").value,
    senha: document.getElementById("loginSenha").value,
  };

  let resp;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Indica que os dados enviados são JSON
    },
    body: JSON.stringify(dadosLogin),
  })
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error(`Erro na requisição: ${resposta.status}`);
      }
      resp = resposta;

      console.log(resp.status);
      console.log(resp);

      return resp.json();
    })
    .then((data) => {
      console.log(data[0]);
      if (data[0].USUARIO_ID > 0) {
        // Salva o ID do usuário no localStorage
        localStorage.setItem("userId", data[0].USUARIO_ID);
        window.location.href = "../telas/index.html";
        console.log("Login Efetuado");
      } else {
        alert("Usuario nao encontrado");
      }
    })
    .catch((erro) => {
      console.error("Erro ao enviar os dados: ", erro);
      console.log(dadosLogin);
      let teste = JSON.stringify(dadosLogin);
      console.log(teste);
    });
});

function teste(id) {
  return id;
}

// ...existing code...
