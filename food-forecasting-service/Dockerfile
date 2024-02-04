# установка базового образа (host OS)
FROM python:slim

# установка рабочей директории в контейнере
WORKDIR /food-forecasting-service

# копирование файла зависимостей в рабочую директорию
COPY /config/requirements.txt /food-forecasting-service

# установка зависимостей
RUN pip install -r requirements.txt

# копирование содержимого локальной директории src в рабочую директорию
COPY . /food-forecasting-service