const renderCatalogCards = () => {
    loadEquipment();
    setupCartHandlers();
}

const loadEquipment = () => {
    const loadEquipmentCardsElement = document.querySelector(".catalog");
    fetch("http://localhost:3000/equipment")
      .then((response) => {
        // console.log( 'response:', response)
        return response.json();
      })
      .then((json) => {
        // console.log(json)

        json.forEach((equipment) => {
          // console.log(equipment)
          const divEquipmentCards = document.createElement("div");
          divEquipmentCards.classList.add("equipment-cards");
          divEquipmentCards.setAttribute("data-id", equipment.id);
          divEquipmentCards.innerHTML = `
        <div>
            <h2>${equipment.name}</h2>
            <p>Статус: <span class=equipment-status>${equipment.status}</span></p>
        </div>
        <button data-card>В корзину</button>
        `;

          // console.log(divEquipmentCards)

          loadEquipmentCardsElement.append(divEquipmentCards);
        });
      });
};

const setupCartHandlers = () => {
  window.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-card")) {
      event.preventDefault();
      console.log("добавлено в корзину");
      
      const card = event.target.closest(".equipment-cards");
      const cardInfo = {
        equipmentId: card.dataset.id,
        name: card.querySelector("h2").innerText,
        status: card.querySelector(".equipment-status").innerText,
      };
      console.log("Данные карточки:", cardInfo);

      addToCart(cardInfo);
    }
  });
};

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


// const renderCatalogCards = () => {
//   const loadEquipmentCardsElement = document.querySelector(".catalog");

//   // Отрисовка всех карточек снаряжения
// //   document.addEventListener("DOMContentLoaded", function () {
   
//     fetch("http://localhost:3000/equipment")
//       .then((response) => {
//         // console.log( 'response:', response)
//         return response.json();
//       })
//       .then((json) => {
//         // console.log(json)

//         json.forEach((equipment) => {
//           // console.log(equipment)
//           const divEquipmentCards = document.createElement("div");
//           divEquipmentCards.classList.add("equipment-cards");
//           divEquipmentCards.setAttribute("data-id", equipment.id);
//           divEquipmentCards.innerHTML = `
//         <div>
//             <h2>${equipment.name}</h2>
//             <p>Статус: <span class=equipment-status>${equipment.status}</span></p>
//         </div>
//         <button data-card>В корзину</button>
//         `;

//           // console.log(divEquipmentCards)

//           loadEquipmentCardsElement.append(divEquipmentCards);
//         });
//       });
// //   });

//   //Добавляю прослушку на всем окне
//   window.addEventListener("click", function (event) {
//      event.preventDefault(); //Останавливаем перезагрузку

//     if (event.target.hasAttribute("data-card")) {
        
//       console.log("добавлено в корзину");
//       //Находим родителя и записываем его в константу
//       const card = event.target.closest(".equipment-cards");
//       //Собираем данные с этого товара и записываем в productInfo
//       const cardInfo = {
//         equipmentId: card.dataset.id,
//         name: card.querySelector("h2").innerText,
//         status: card.querySelector(".equipment-status").innerText,
//       };
//       console.log("Данные карточки:",cardInfo);

//     //   sessionStorage.setItem("currentUserId", "1"); //получаю id текущего пользователя
 
//       // Отправляем данные на сервер
//       addToCart(cardInfo);
//     }
//   });

//   async function addToCart(equipment) {
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
//         const newCartItem = await response.json();
//       console.log('Товар добавлен в корзину на сервере!', newCartItem);
//       // Можно показать уведомление пользователю
//     } else {
//       console.error('Ошибка при добавлении в корзину');
//     }
//   } catch (error) {
//     console.error('Ошибка сети:', error);
//   }
// }
// };

// export { renderCatalogCards };
