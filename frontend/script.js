//Получение данных с формы
const formElement = document.querySelector("form");

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

  fetch("http://localhost:3000/profile", {
    method: "post",
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
