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
  sendCart();
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

const sendCart = () => {
  document.addEventListener("DOMContentLoaded", function () {
    //Добавляю прослушку на всем окнe для
    window.addEventListener("click", function (event) {
      if (event.target.classList.contains("reserv-btn")) {
        event.preventDefault();
        const commentElement = document.querySelector(".comment");
        const commentText = commentElement.value.trim();

        console.log("Комментарий:", commentText);

// 2. Проверяем что комментарий не пустой
        if (!commentText) {
          alert("Пожалуйста, добавьте комментарий (куда, зачем)");
          return;
        }

        const token = localStorage.getItem("token");
        
        // 3. Отправляем запрос на подтверждение резервирования
        fetch("http://127.0.0.1:8000/api/reservingcart/reserv/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description: commentText,  // комментарий пользователя
          }),
        })
        .then(response => {
          if (!response.ok) throw new Error('Ошибка отправки заявки');
          return response.json();
        })
        .then(data => {
          console.log("Заявка отправлена на рассмотрение:", data);
          alert("Заявка отправлена на рассмотрение администратору!");
          
          // Очищаем текстовое поле после успешной отправки
          commentElement.value = "";
          
          // Опционально: перенаправляем на другую страницу
          // window.location.href = "success.html";
        })
        .catch(error => {
          console.error("Ошибка отправки:", error);
          alert("Ошибка при отправке заявки. Попробуйте еще раз.");
            });
      }
    });
  });
};
        //Нахожу родителя и записываю его в константу
        // const card = event.target.closest(".comment");
        // console.log(card);
        // //Нахожу id снаряжения в data-id
        // const cardId = card.dataset.id;
        // console.log(cardId);
        // const token = localStorage.getItem("token");
        // fetch("http://127.0.0.1:8000/api/reservingcart/", {
        //   method: "post",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`,
        //   },
        //   body: JSON.stringify({
        //     equipment: `${cardId}`,
        //     amount: "1",
        //   }),
        // });


export { catalogScript };
export { checkTokenReserv };
