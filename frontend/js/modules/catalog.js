//Загрузка содержимого страницы
const renderCatalogCards = () => {
  loadCategory();
  loadEquipment();
  applyFilters();
};

//Сохраняю в переменные ссылки на DOM-элементы
const loadCategoryFilterElement = document.querySelector(
  ".load-category-filter",
); //Блок категорий
const loadEquipmentCardsElement = document.querySelector(".catalog"); //блок с карточками

//Отрисовка существующих категорий
const loadCategory = () => {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:8000/api/category/", {
      method: "get",
      headers: { "Content-Type": "application/json" }, //ообщает серверу, что тело запроса отправлено в формате JSON
      credentials: "include", //включает отправку куки
    })
      .then((response) => {
        // console.log("response:", response);
        return response.json();
      })
      .then((categoryData) => {
        console.log("Данные категорий:", categoryData);

        loadCategoryFilterElement.innerHTML = categoryData
          .map((item) => {
            return `
            <div>
              <input type="radio" data-category="${item.slug}" id="category_${item.id}" class="category-filter" value="${item.slug}" name="scales" />
              <label for="category_${item.id}">${item.name}</label>
            </div>
              `;
          })
          //.map() проходит по каждому элементу массива и преобразует его
          //({ name }) - это деструктуризация: берет только свойство name из каждого объекта
          // Получаем ["<p>Верёвки</p>","<p>Карабины</p>","<p>Палатки</p>"]
          .join("");
        //Объединяет все элементы массива в одну строку; "" - означает "без разделителей между элементами"
        // Получаем "<p>Верёвки</p><p>Карабины</p><p>Палатки</p>"
      });
  });
};

//Отрисовка карточек каталога
const loadEquipment = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/equipment/", {
      method: "get",
      headers: { "Content-Type": "application/json" }, //ообщает серверу, что тело запроса отправлено в формате JSON
      credentials: "include", //включает отправку куки
    })
      .then((response) => {
        return response.json();
      })
      .then((equipmentData) => {
        console.log("Все данные снаряжения:", equipmentData);

        // Извлекаем массив снаряжения из поля results
        // equipmentData имеет структуру: {count, next, previous, results: [...]}
        const equipment = equipmentData.results;

        // 7. Передаем данные в функцию отрисовки
        console.log(equipment);

        // renderEquipment(equipment);

        loadEquipmentCardsElement.innerHTML = equipment
          .map((item) => {
            const available =
              item.amount - item.amount_reserved - item.amount_issued;
            let status = "в наличии";

            if (available <= 0) {
              status = item.amount_reserved > 0 ? "забронировано" : "на руках";
            }

            return `
          <div class="equipment-cards" data-id="${item.id}" data-category="${
            item.category
          }">
            
          <div class="equipment-cards-items">
            <h3>${item.name}</h3>
            <p>Статус: <span class="status">${status}</span></p>
            <p>Доступно: ${available} из ${item.amount}</p>
          </div>
            <button class="add-to-cart-btn" ${available <= 0 ? "disabled" : ""}>
              В ЗАЯВКУ
            </button>
          </div>
        `;
          })
          .join("");
      });
  });
  addToCart();
};

//Отрисовка карточки выбранной категории
const selectCategory = () => {
  // 1. Находим все выбранные чекбоксы категорий
  const selectedRadio = document.querySelectorAll(".category-filter:checked");
  console.log(selectedRadio);
  //2. Нахожу слаги этих категорий
  const selectedSlug = Array.from(selectedRadio).map(
    (checkbox) => checkbox.value,
  );
  console.log("Слаги категорий:", selectedSlug);
  //3. Отображаю на странице карточки в соответствии с выбранным слагом
  const token = localStorage.getItem("token");

  fetch(`http://127.0.0.1:8000/api/equipment/?category=${selectedSlug}`, {
    method: "get",
    headers: { "Content-Type": "application/json" }, //ообщает серверу, что тело запроса отправлено в формате JSON
    credentials: "include", //включает отправку куки
  })
    .then((response) => {
      return response.json();
    })
    .then((equipmentData) => {
      console.log("Все данные снаряжения:", equipmentData);

      // Извлекаем массив снаряжения из поля results
      // equipmentData имеет структуру: {count, next, previous, results: [...]}
      const equipment = equipmentData.results;

      // 7. Передаем данные в функцию отрисовки
      console.log(equipment);

      // renderEquipment(equipment);

      loadEquipmentCardsElement.innerHTML = equipment
        .map((item) => {
          const available =
            item.amount - item.amount_reserved - item.amount_issued;
          let status = "в наличии";

          if (available <= 0) {
            status = item.amount_reserved > 0 ? "забронировано" : "на руках";
          }

          return `
          <div class="equipment-cards" data-id="${item.id}" data-category="${
            item.category
          }">
            
          <div class="equipment-cards-item">
            <h3>${item.name}</h3>
            <p>Статус: <span class="status">${status}</span></p>
            <p>Доступно: ${available} из ${item.amount}</p>
          </div>
            <button class="add-to-cart-btn" ${available <= 0 ? "disabled" : ""}>
              В ЗАЯВКУ
            </button>
          </div>
        `;
        })
        .join("");
    });
};

//Работа кнопки применить фильтры
const applyFilters = () => {
  const applyFiltersBtn = document.querySelector(".apply-filters-button");
  applyFiltersBtn.addEventListener("click", function (event) {
    event.preventDefault();
    selectCategory();
  });
};

// //Работа кнопки очистить фильтры
// const clearFilters = () => {
//   const clearFiltersBtn = document.querySelector(".clear-filters-button");
//   applyFiltersBtn.addEventListener("click", function (event) {
//     event.preventDefault();
//     loadCategory();
//   });
// };

// Функция получения CSRF токена из cookie (добавьте в начало файла)
function getCSRFToken() {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("csrftoken=")) {
        cookieValue = decodeURIComponent(cookie.substring("csrftoken=".length));
        break;
      }
    }
  }
  return cookieValue;
}

//Добавление в корзину
const addToCart = () => {
  document.addEventListener("DOMContentLoaded", function () {
    //Добавляю прослушку на всем окнe для
    window.addEventListener("click", function (event) {
      // event.preventDefault();
      if (event.target.classList.contains("add-to-cart-btn")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        //Нахожу родителя и записываю его в константу
        const card = event.target.closest(".equipment-cards");
        console.log(card);
        //Нахожу id снаряжения в data-id
        const cardId = card.dataset.id;
        console.log(cardId);
        fetch("http://127.0.0.1:8000/api/reservingcart/", {
          method: "post",
          credentials: "include", //включает отправку куки
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          }, //ообщает серверу, что тело запроса отправлено в формате JSON
          body: JSON.stringify({
            equipment: `${cardId}`,
            amount: "1",
          }),
        });
      }
    });
  });
};

// const goToReservation = () => {
//   document.addEventListener("DOMContentLoaded", function () {
//     //Добавляю прослушку на всем окне
//     window.addEventListener("click", function (event) {
//       // event.preventDefault();
//       if (event.target.classList.contains("go-to-reserv-btn")) {
//         window.location.href = "http://127.0.0.1:5500/frontend/reservation.html";
//       }
//     });
//   });
// };
// goToReservation();
//Работа кнопки добавить в корзину

export { renderCatalogCards };
