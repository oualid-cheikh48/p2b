# ETNAir — Plateforme de location en ligne

ETNAir est une plateforme de location à court et moyen terme, inspirée d'Airbnb.
Ce projet a été développé dans le cadre d'un projet scolaire à l'ETNA.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Zustand |
| Backend | Node.js, Express 5, Prisma ORM |
| Base de données | PostgreSQL 15 |
| Stockage fichiers | MinIO (compatible S3) |
| Authentification | JWT + bcrypt |
| Documentation API | Swagger UI |
| Conteneurisation | Docker, Docker Compose |

---

## Prérequis

- Docker Desktop installé et démarré
- Node.js v20+ (via nvm recommandé)
- Git

---

## Installation et démarrage

### 1. Cloner le projet

```bash
git clone git@rendu-git.etna-alternance.net:module-10351/activity-55457/group-1076380.git
cd p2b
```

### 2. Démarrer l'infrastructure Docker

Depuis la racine du projet :

```bash
docker compose up -d
```

Cela démarre automatiquement :
- PostgreSQL sur le port 5433
- L'API Node.js sur le port 3000
- pgAdmin sur le port 5050
- MinIO sur le port 9000

La base de données est initialisée automatiquement avec `schema.sql` et peuplée avec `seed.sql` à la première création du conteneur.

### 3. Configurer le backend

```bash
cd backend
cp .env.example .env
```

Le fichier `.env` est configuré pour Docker par défaut (`@db:5432`) et n'a pas besoin d'être modifié.

Pour initialiser Prisma (à faire une seule fois). Ces commandes passent l'URL locale directement sans modifier le `.env` :

```bash
mkdir -p prisma/migrations/0_init
cp ../schema.sql prisma/migrations/0_init/migration.sql

DATABASE_URL="postgresql://p2b_user:p2b_pass@localhost:5433/p2b_db" npx prisma@5.22.0 migrate resolve --applied 0_init
DATABASE_URL="postgresql://p2b_user:p2b_pass@localhost:5433/p2b_db" npx prisma@5.22.0 generate
```

Pourquoi deux URL differentes :
- `@db:5432` est utilisé par l'API qui tourne dans Docker et connait le conteneur par son nom
- `@localhost:5433` est utilisé par Prisma depuis votre terminal, qui est en dehors de Docker et passe par le port exposé sur la machine

### 4. Démarrer le frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur : http://localhost:5173

---

## Variables d'environnement

Le fichier `.env.example` contient toutes les variables nécessaires.

| Variable | Description | Valeur par défaut |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://p2b_user:p2b_pass@db:5432/p2b_db` |
| `JWT_SECRET` | Clé secrète pour les tokens JWT | a définir |
| `PORT` | Port du serveur API | `3000` |
| `MINIO_ENDPOINT` | Adresse du service MinIO | `minio` |
| `MINIO_PORT` | Port MinIO | `9000` |
| `MINIO_ACCESS_KEY` | Clé d'accès MinIO | `minioadmin` |
| `MINIO_SECRET_KEY` | Clé secrète MinIO | `minioadmin` |
| `MINIO_BUCKET` | Nom du bucket de stockage | `etnair-images` |

---

## Accès aux services

| Service | URL | Identifiants |
|---|---|---|
| Frontend | http://localhost:5173 | — |
| API | http://localhost:3000 | — |
| Documentation Swagger | http://localhost:3000/api-docs | — |
| pgAdmin | http://localhost:5050 | admin@p2b.com / admin |
| MinIO | http://localhost:9000 | minioadmin / minioadmin |

---

## Données de test

Le fichier `seed.sql` peuple automatiquement la base avec :

- 10 utilisateurs (1 admin, 4 hôtes, 5 invités)
- 8 propriétés réparties dans Paris, Lyon, Nice et Bordeaux
- 10 réservations avec différents statuts
- 6 avis, 10 paiements, messages et notifications

Comptes de test disponibles :

| Role | Email | Mot de passe |
|---|---|---|
| Admin | admin@etnair.com | (voir seed.sql) |
| Hote | james.carter@email.com | (voir seed.sql) |
| Invite | oliver.davis@email.com | (voir seed.sql) |

Pour réinitialiser la base de données avec les données initiales :

```bash
docker compose down -v
docker compose up -d
```

---

## Routes API

### Authentification
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Non | Créer un compte |
| POST | `/auth/login` | Non | Connexion et obtention du token JWT |

### Utilisateurs
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/users` | Non | Lister les utilisateurs |
| POST | `/users` | Non | Créer un utilisateur |
| PUT | `/users/:id` | JWT | Modifier un utilisateur |
| DELETE | `/users/:id` | JWT | Supprimer un utilisateur |

### Propriétés
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/properties` | Non | Lister les logements |
| GET | `/properties/:id` | Non | Détails d'un logement |
| POST | `/properties` | JWT | Créer un logement |
| PUT | `/properties/:id` | JWT | Modifier un logement |
| DELETE | `/properties/:id` | JWT | Supprimer un logement |

### Réservations
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/bookings` | Non | Lister les réservations |
| POST | `/bookings` | JWT | Créer une réservation |

### Autres routes
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET/POST | `/reviews` | JWT | Avis |
| GET/POST | `/wishlist` | JWT | Favoris |
| GET/POST | `/messages` | JWT | Messages |
| GET | `/notifications` | JWT | Notifications |
| GET/POST | `/payments` | JWT | Paiements |
| POST | `/upload` | JWT | Upload d'image vers MinIO |

La documentation complète est disponible sur http://localhost:3000/api-docs

---

## Tests

```bash
cd backend
npm test
```

Les tests utilisent des mocks Prisma, aucune base de données n'est nécessaire pour les lancer.

---

## Repartir de zero

Si vous rencontrez des problèmes ou souhaitez repartir d'une base propre :

```bash
docker compose down -v
docker compose up -d
```

---

## Equipe

Projet realise dans le cadre du module C2W-CBI1 a l'ETNA.

