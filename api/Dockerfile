# Utilise une image Node.js légère
FROM node:18-alpine

# Définit le dossier de travail dans le conteneur
WORKDIR /app

# Copie le package.json et installe Express
COPY package.json ./
RUN npm install

# Copie le code source (index.js)
COPY index.js ./

# Expose le port 3000
EXPOSE 3000

# Commande pour démarrer l'API
CMD ["node", "index.js"]
