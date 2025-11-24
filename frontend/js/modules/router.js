import { apiService } from './api.js';

class Router {
    checkAuth() {
        if (apiService.isAuthenticated()) {
            // Если пользователь авторизован и на странице login - перенаправляем в каталог
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'catalog.html';
            }
        } else {
            // Если пользователь не авторизован и пытается зайти в каталог - перенаправляем на логин
            if (window.location.pathname.includes('catalog.html')) {
                window.location.href = 'login.html';
            }
        }
    }
}

export const router = new Router();