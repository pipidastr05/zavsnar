//Проверка токена
const checkToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Токен не найден, перенаправляю на логин");
    window.location.href = "login.html";
  } else {
    console.log("Токен найден, можно работать");
  }
};

//Загрузка содержимого страницы
const renderCatalogCards = () => {
  loadEquipment();
  // setupCartHandlers();
};

//Сохраняю в переменные ссылки на DOM-элементы
const loadCategoryFilterElement = document.querySelector(
  ".load-category-filter"
);
const loadEquipmentCardsElement = document.querySelector(".catalog");

//Отрисовка существующих категорий
const loadEquipment = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/api/category/", {
      method: "get",
      headers: {
        "Content-Type": "application/json", //ообщает серверу, что тело запроса отправлено в формате JSON
        Authorization: `Bearer ${token}`, //авторизованный запрос
      },
    })
      .then((response) => {
        // console.log("response:", response);
        return response.json();
      })
      .then((json) => {
        // console.log(json);

        loadCategoryFilterElement.innerHTML = json
          .map(({ name }) => `<p>${name}</p>`)
          //.map() проходит по каждому элементу массива и преобразует его
          //({ name }) - это деструктуризация: берет только свойство name из каждого объекта
          // Получаем ["<p>Верёвки</p>","<p>Карабины</p>","<p>Палатки</p>"]
          .join("");
        //Объединяет все элементы массива в одну строку; "" - означает "без разделителей между элементами"
        // Получаем "<p>Верёвки</p><p>Карабины</p><p>Палатки</p>"
      });
  });
};

// const loadEquipment = () => {
//   //
//   const loadEquipmentCardsElement = document.querySelector(".catalog");
//   fetch("http://localhost:3000/equipment")
//     .then((response) => {
//       // console.log( 'response:', response)
//       return response.json();
//     })
//     .then((json) => {
//       // console.log(json)

//       json.forEach((equipment) => {
//         // console.log(equipment)
//         const divEquipmentCards = document.createElement("div");
//         divEquipmentCards.classList.add("equipment-cards");
//         divEquipmentCards.setAttribute("data-id", equipment.id);
//         divEquipmentCards.innerHTML = `
//         <div>
//             <h2>${equipment.name}</h2>
//             <p>Статус: <span class=equipment-status>${equipment.status}</span></p>
//         </div>
//         <button data-card>В корзину</button>
//         `;

//         // console.log(divEquipmentCards)

//         loadEquipmentCardsElement.append(divEquipmentCards);
//       });
//     });
// };

// const setupCartHandlers = () => {
//   window.addEventListener("click", function (event) {
//     if (event.target.hasAttribute("data-card")) {
//       event.preventDefault();
//       console.log("добавлено в корзину");

//       const card = event.target.closest(".equipment-cards");
//       const cardInfo = {
//         equipmentId: card.dataset.id,
//         name: card.querySelector("h2").innerText,
//         status: card.querySelector(".equipment-status").innerText,
//       };
//       console.log("Данные карточки:", cardInfo);

//       addToCart(cardInfo);
//     }
//   });
// };

// async function addToCart(equipment) {
//   try {
//     const response = await fetch('http://localhost:3000/cart', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         equipmentId: equipment.equipmentId,
//         name: equipment.name,
//         status: equipment.status
//       })
//     });

//     if (response.ok) {
//       const newCartItem = await response.json();
//       console.log('Товар добавлен в корзину на сервере!', newCartItem);
//     } else {
//       console.error('Ошибка при добавлении в корзину');
//     }
//   } catch (error) {
//     console.error('Ошибка сети:', error);
//   }
// }

export { renderCatalogCards };
export { checkToken };
