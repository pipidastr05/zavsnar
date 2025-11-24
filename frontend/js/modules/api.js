class ApiService {
  constructor() {
    this.token = localStorage.getItem('token'); // Спросим: "А ты помнишь пароль?"
    this.baseURL = 'http://127.0.0.1:8000'; 
  }

  async login(phone_number, password) {
    const response = await fetch(`${this.baseURL}/api/auth/jwt/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number, password }),
    });
    const data = await response.json();
    this.token = data.access; // Записываем токен в блокнотик
    localStorage.setItem('token', this.token); // И кладем копию в сейф
    return data;
  }
  async authorizedFetch(url, options = {}) { //Эта функция автоматически добавляет к каждому запросу "Bearer и токен"
    options.headers = {
      ...options.headers, // Сохраняем старые заголовки
      Authorization: `Bearer ${this.token}`, // Добавляем волшебную фразу
    };
    return fetch(url, options);
  }
  javascript;
  async getCurrentUser() {
    const response = await this.authorizedFetch("/api/auth/users/me/");
    return response.json();
  }

  //Методы работы с токеном
getToken() {
    return localStorage.getItem('token');
}
setToken(token) {
    localStorage.setItem('token', token);
}
removeToken() {
    localStorage.removeItem('token');
}
isAuthenticated() {
    return !!this.getToken();
}
}


export const apiService = new ApiService();

