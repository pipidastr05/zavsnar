const scriptAuth = () => {
//Получение данных с формы
const formElement = document.querySelector("form");
console.log(formElement);


formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  //   fetch('http://localhost:3000/profile')
  //       .then((response) => {
  //         console.log('response:', response)
  //         return response.json()
  //       })
  //       .then(json => console.log(json))

  const formData = new FormData(formElement);
  const formDataObject = Object.fromEntries(formData);
  console.log(formDataObject);

//   const numberInfo = {
//       equipmentId: card.dataset.id,
//       name: card.querySelector("h2").innerText,
//       status: card.querySelector(".equipment-status").innerText,
//     };
//     console.log(cardInfo);


  fetch("http://127.0.0.1:8000/api/auth/jwt/create/", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formDataObject,

    }),
  })
    .then((response) => {
      console.log("response:", response);

      return response.json();
    })
    .then((json) => {
        console.log('json:',json)
    })
});
}

export { scriptAuth };