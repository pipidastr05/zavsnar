
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    console.log(phone, password, errorMessage);
    

    // Сбрасываем сообщение об ошибке
    errorMessage.style.display = 'none';

    try {
        // Делаем запрос к JSON Server для поиска пользователя
        const response = await fetch(`http://localhost:3001/users?phone=${phone}`);
        
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }

        const users = await response.json();

        // Проверяем, найден ли пользователь и совпадает ли пароль
        if (users.length > 0 && users[0].password === password) {
            // Успешный вход!
            
            // 1. Сохраняем информацию о пользователе в sessionStorage
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('currentUser', JSON.stringify(users[0])); // Сохраняем объект пользователя

            // 2. Перенаправляем на страницу каталога
            window.location.href = 'index.html';
        } else {
            // Неверные данные
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        errorMessage.textContent = 'Произошла ошибка. Попробуйте позже.';
        errorMessage.style.display = 'block';
    }
});