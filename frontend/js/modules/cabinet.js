const cabinetScript = () => {
  loadUserEquipment();
  setupLogoutHandler();
};

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

const loadUserEquipment = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      method: "GET",
       credentials: "include", //включает отправку куки
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      }
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("Ошибка загрузки данных пользователя");
        return response.json();
      })
      .then((userData) => {
        console.log("Данные пользователя:", userData);
        console.log("Все ключи:", Object.keys(userData));

        const userInfoContainer = document.querySelector(".user-info");
        userInfoContainer.innerHTML = `
        <p>${userData.last_name} ${userData.first_name} ${userData.father_name}</p>
      `;

        // Проверь конкретно есть ли reserved
        console.log("Есть ли reserved?", "reserved" in userData);
        console.log("reserved:", userData.reserved);

        // Проверь другие возможные поля
        console.log(
          "Есть ли reserved_equipment?",
          "reserved_equipment" in userData
        );
        console.log("Есть ли reservations?", "reservations" in userData);
        // // Отрисовываем данные пользователя
        // renderUserData(userData.reserved);

        // Отрисовываем зарезервированное снаряжение
        renderReservedEquipment(userData.reserved);

        // Отрисовываем выданное снаряжение
        renderIssuedEquipment(userData.issued);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });
  });
};

// // Функция для отрисовки данных пользователя
// const renderUserData = (reservedItems) => {};

// Функция для отрисовки ЗАРЕЗЕРВИРОВАННОГО снаряжения
const renderReservedEquipment = (reservedItems) => {
  const reservedContainer = document.querySelector(".reserved-equipment");

  if (!reservedItems || reservedItems.length === 0) {
    reservedContainer.innerHTML = "<p>Нет зарезервированного снаряжения</p>";
    return;
  }

  reservedContainer.innerHTML = reservedItems
    .map((item) => {
      const equipment = item.equipment;
      return `
        <div class="equipment-card reserved-card" data-id="${equipment.id}">
          <h3>${equipment.name}</h3>
          <p>Категория: ${equipment.category}</p>
          <p>Количество: ${item.amount} шт</p>
          <p>Дата резерва: ${new Date(item.date_take).toLocaleDateString()}</p>
          <p>Комментарий: ${item.description || "нет"}</p>
          <p class="status status-reserved">Зарезервировано</p>
        </div>
      `;
    })
    .join("");
};

// Функция для отрисовки ВЫДАННОГО снаряжения
const renderIssuedEquipment = (issuedItems) => {
  const issuedContainer = document.querySelector(".issued-equipment");

  if (!issuedItems || issuedItems.length === 0) {
    issuedContainer.innerHTML = "<p>Нет выданного снаряжения</p>";
    return;
  }

  issuedContainer.innerHTML = issuedItems
    .map((item) => {
      const equipment = item.equipment;
      return `
        <div class="equipment-card issued-card" data-id="${equipment.id}">
          <h3>${equipment.name}</h3>
          <p>Категория: ${equipment.category}</p>
          <p>Количество: ${item.amount} шт</p>
          <p>Дата выдачи: ${new Date(item.date_take).toLocaleDateString()}</p>
          <p>Комментарий: ${item.description || "нет"}</p>
          <p class="status status-issued">🟢 Выдано</p>
        </div>
      `;
    })
    .join("");
};

// Функция для выхода из аккаунта
const logout = () => {
  // 1. Удаляем токен из localStorage
  localStorage.removeItem("token");

  // 2. Показываем сообщение (опционально)
  console.log("Вы вышли из аккаунта");

  // 3. Перенаправляем на страницу входа
  window.location.href = "login.html";
};

// Функция для настройки обработчиков
const setupLogoutHandler = () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
      event.preventDefault();
      logout();
    });
  }
};

export { cabinetScript };
