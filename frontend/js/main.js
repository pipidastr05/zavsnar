import { scriptAuth } from './modules/script.js';

scriptAuth();

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