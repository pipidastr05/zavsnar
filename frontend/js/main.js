console.log('main.js загружен!');

import { scriptAuth } from './modules/auth.js';
import {renderCatalogCards} from './modules/catalog.js';
import {checkTokenCatalog} from './modules/catalog.js';
import {scriptRegister} from './modules/register.js';
import {checkTokenReserv} from './modules/reservation.js';
import {catalogScript} from './modules/reservation.js';
import {cabinetScript} from './modules/cabinet.js';

if (window.location.href.includes('register.html')) {
  scriptRegister();
}

if (window.location.href.includes('login.html')) {
  console.log('Запускаем auth модуль');
  scriptAuth();
} else {
  console.log('Это не страница входа');
}

if (window.location.href.includes('catalog.html')) {
  renderCatalogCards();
  checkTokenCatalog();
}

if (window.location.href.includes('reservation.html')) {
  checkTokenReserv();
  catalogScript();
}

if (window.location.href.includes('cabinet.html')) {
  cabinetScript();
}

// import { router } from './modules/router.js';
// import { authService } from './modules/auth.js';

// // При загрузке приложения проверяем авторизацию
// document.addEventListener('DOMContentLoaded', function() {
//     router.checkAuth();
    
//     // Если мы на странице логина - инициализируем форму входа
//     if (window.location.pathname.includes('login.html')) {
//         authService.initLoginForm();
//     }
    
//     // Если мы на странице каталога - загружаем карточки
//     if (window.location.pathname.includes('catalog.html')) {
//         // Здесь будет инициализация каталога
//     }
// });

// import { renderCatalogCards } from "./modules/loadCards.js";

// renderCatalogCards();