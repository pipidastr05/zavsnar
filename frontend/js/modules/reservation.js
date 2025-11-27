//Проверка токена
const checkTokenReserv = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Токен не найден, перенаправляю на логин");
    window.location.href = "login.html";
  } else {
    console.log("Токен найден, можно работать");
  }
};

const catalogScript = () => {
  loadResEquipment();
  document.addEventListener("DOMContentLoaded", function () {
    loadResEquipment();
    setupRemoveHandlers();
  });
};

//Сохраняю в переменные ссылки на DOM-элементы
const loadEquipmentCardsElement = document.querySelector(
  ".load-equipment-cards"
);

//Отрисовка карточек каталога
const loadResEquipment = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/reservingcart/", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((cartItems) => {
        console.log("Все данные снаряжения:", cartItems);

        loadEquipmentCardsElement.innerHTML = cartItems
          .map((item) => {
            const equipment = item.equipment;

            return `
           <div class="equipment-cards" data-id="${equipment.id}">
              <div>
                <h3>${equipment.name}</h3>
                <p>Категория: ${equipment.category}</p>
                <p>Количество: ${item.amount} шт</p>
                <p>Описание: ${equipment.description}</p>
              </div>
              <button class="remove-from-cart-btn" data-cart-id="${item.id}">
                Удалить из корзины
              </button>
            </div>
        `;
          })
          .join("");
      });
  });
};

// Обработчик для кнопок удаления из корзины
const setupRemoveHandlers = () => {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
      const cartItemId = event.target.getAttribute("data-cart-id");
      removeFromCart(cartItemId);
    }
  });
};

const removeFromCart = (cartItemId) => {
  const token = localStorage.getItem("token");

  fetch(`http://127.0.0.1:8000/api/reservingcart/${cartItemId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Удалено из корзины");
        loadResEquipment(); // Перезагружаем корзину
      }
    })
    .catch((error) => {
      console.error("Ошибка удаления:", error);
    });
};

// Не забудь вызвать в DOMContentLoaded

export { catalogScript };
export { checkTokenReserv };
