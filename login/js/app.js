// const BASE_API_URL = "http://localhost:3000"
const BASE_API_URL = "https://api-gatewayirent.herokuapp.com/user"
const btnSignin = document.querySelector("#signin")
const btnSendSignin = document.querySelector("#sendSignin")
const btnSignup = document.querySelector("#signup")
const body = document.querySelector("body")

btnSignin.addEventListener("click", function () {
  body.className = "sign-in-js";
});
btnSignup.addEventListener("click", function () {
  body.className = "sign-up-js";
});

btnSendSignin.addEventListener("click", async function (e) {
  e.preventDefault()
  // pegar os valores dos campos
  const inputEmail = document.getElementById("singinEmail")
  const inputPassword = document.getElementById("singinPassword")
  const login = {
    email: inputEmail.value,
    password: inputPassword.value,
  }
  // envia para o backend
  const response = await fetch(`${BASE_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(login)
  })
  const data = await response.json()
  if (response.status === 200) {
    const { token, user } = data
    localStorage.setItem('jwt', JSON.stringify(token))
    localStorage.setItem('user', JSON.stringify(user))
    alert(`Seja bem-vindo ${user.name}!`)
    window.location.href = '/login/cadastrarClientes.html'
  } else {
    console.log(data)
    alert(data)
  }
})