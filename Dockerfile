# Установка базового образа Node.js
FROM node:14.17.0 as builder

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование package.json и package-lock.json в рабочую директорию
COPY package*.json ./

# Установка зависимостей через npm
RUN npm install

# Копирование всех файлов проекта в контейнер
COPY . .

# Сборка приложения с помощью webpack
RUN npm run build:prod

# Создание финального контейнера
FROM node:16.13.1

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование собранного приложения из builder-образа в финальный контейнер
COPY --from=builder /app/dist ./dist

# Копирование package.json и package-lock.json в финальный контейнер
COPY package*.json ./

# Установка зависимостей через npm
RUN npm install

# Установка Express.js для службы сервера
RUN npm install express

# Определение порта, на котором будет прослушиваться сервер Express.js
ENV PORT=3000

# Открывает порт в контейнере
EXPOSE $PORT

# Запуск сервера Express.js
CMD ["node", "dist/server/server.js"]