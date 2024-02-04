# установка базового образа (host OS)
FROM python:slim

# установка рабочей директории в контейнере
WORKDIR /social-parameter-forecasting-service

# копирование файла зависимостей в рабочую директорию
COPY /config/requirements.txt /social-parameter-forecasting-service

# установка зависимостей
RUN pip install -r requirements.txt

# копирование содержимого локальной директории src в рабочую директорию
COPY . /social-parameter-forecasting-service