const scriptAuth = () => {
  //Получение данных с формы
  const formElement = document.querySelector("form"); //нашла форму в html-документе
  const errorElement = document.querySelector('.error') //нашла div для сообщений об ошибке

  formElement.addEventListener("submit", (event) => {
    //в форме отслеживаю событие submit (клик по кнопке)
    event.preventDefault(); //отменяю стандартное поведение (перезагрузка страницы после нажатия конпки)

    const formData = new FormData(formElement); //FormData автоматически собирает данные из полей формы
    const formDataObject = Object.fromEntries(formData);
    
    // Превращает собранные данные в js-объект типа {phone_number: '89835763081', password: '12345678'},
    // где первая чать - атрибут name в инпуте формы

    fetch('http://127.0.0.1:8000/api/auth/jwt/create/', {
      method: "post",
      headers: { "Content-Type": "application/json" }, //ообщает серверу, что тело запроса отправлено в формате JSON
      body: JSON.stringify({
        //превращаю объект в строку (json)
        ...formDataObject, //разворачиваю объект, чтобы все поля попали в тело запроса
      }),
    })

    .then((response) => {
        console.log("response:", response);

        if (!response.ok) { //если запрос НЕ успешен (не ок)
          const errorMessage =
            response.status === 401 //код ответа сервера = 401
            //Тернарный оператор (короткий способ написать if/else через ? и :).
              ? "Неправильный номер или пароль" //Если статус 401, тогда "Неправильный..."
              : "Что-то пошло не так :("; //иначе "Что-то..."

          throw new Error(errorMessage); //создает объект ошибки с сообщением
        }

        return response.json(); //получаю сырой ответ от сервера и преобразую его в json
      })

      .then((json) => {
        console.log("json:", json); //получаю уже готовые данные и вывожу их в консоль

        // СОХРАНяю ТОКЕН В localStorage
        localStorage.setItem("token", json.access);
        console.log("Токен сохранен!");

        window.location.href = "http://127.0.0.1:5500/frontend/catalog.html"; // ПЕРЕНАПРАВляю НА СТРАНИЦУ КАТАЛОГА
      })

       .catch((error) => { //это обработчик ошибок, он ловит ошибки, которые мы "кинули" (throw) ранее 
        errorElement.innerHTML = error.message //в диве, который я нашла в начале, отображается сообщение об ошибке
    });
  });
};

export { scriptAuth };
