import { apiService } from './api.js';
import { router } from './router.js';

class AuthService {
    initLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        
        try {
            const result = await apiService.login(phone, password);
            apiService.setToken(result.access);
            window.location.href = 'catalog.html';
        } catch (error) {
            // Показываем ошибку пользователю
            this.showError('Неверный номер телефона или пароль');
        }
    }

    logout() {
        apiService.removeToken();
        window.location.href = 'login.html';
    }

    showError(message) {
        // Логика показа ошибки
    }
}

export const authService = new AuthService();