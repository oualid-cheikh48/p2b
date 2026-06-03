# Étape 1 : Le "Builder" (On utilise Node pour compiler le code Vite)
FROM node:20-alpine AS build
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et compilation
COPY . .
RUN npm run build

# Étape 2 : Le Serveur Web de production (Ultra léger)
FROM nginx:alpine

# On récupère uniquement les fichiers statiques générés
COPY --from=build /app/dist /usr/share/nginx/html

# On expose le port standard HTTP
EXPOSE 80

# Lancement du serveur NGINX
CMD ["nginx", "-g", "daemon off;"]
