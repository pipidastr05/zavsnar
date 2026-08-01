Активация вирт окружения
source venv/Scripts/activate

установка в вирт окруж то что нужно для проекта
pip install -r requirements.txt

Создание файла миграций
python manage.py makemigrations

Применение миграций бд
python manage.py migrate

создание суперпользователя
python manage.py createsuperuser

запуск сервера
python manage.py runserver