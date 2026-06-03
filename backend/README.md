# ETNAir — Backend API

API REST Node.js/Express pour la plateforme de location ETNAir.

## Stack technique

- **Node.js** + **Express 5**
- **PostgreSQL** + **Prisma ORM**
- **JWT** (authentification)
- **bcrypt** (hashage mot de passe)
- **Swagger** (documentation `/api-docs`)
- **MinIO** (stockage d'images)
- **Jest** + **Supertest** (tests)

## Lancement avec Docker (recommandé)

```bash
# À la racine du projet (dossier p2b/)
docker-compose up --build
```

Cela démarre automatiquement :
- PostgreSQL sur le port 5432
- MinIO sur le port 9000 (console : 9001)
- L'API sur le port 3000

## Lancement manuel (sans Docker)

```bash
cd backend
cp .env.example .env
# Remplir les valeurs dans .env

npm install
npx prisma migrate dev --name init
npm start
```

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://user:pass@localhost:5432/etnair_db` |
| `JWT_SECRET` | Clé secrète JWT | `supersecretkey` |
| `PORT` | Port du serveur | `3000` |
| `MINIO_ENDPOINT` | Adresse MinIO | `localhost` |
| `MINIO_PORT` | Port MinIO | `9000` |
| `MINIO_ACCESS_KEY` | Clé accès MinIO | `minioadmin` |
| `MINIO_SECRET_KEY` | Clé secrète MinIO | `minioadmin` |
| `MINIO_BUCKET` | Nom du bucket | `etnair-images` |

## Routes disponibles

### Auth
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Non | Créer un compte |
| POST | `/auth/login` | Non | Connexion + token JWT |

### Users
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/users` | Non | Lister les utilisateurs |
| POST | `/users` | Non | Créer un utilisateur |

### Properties
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/properties` | Non | Lister les logements |
| GET | `/properties/:id` | Non | Détails d'un logement |
| POST | `/properties` | JWT | Créer un logement |
| PUT | `/properties/:id` | JWT | Modifier un logement |
| DELETE | `/properties/:id` | JWT | Supprimer un logement |

### Bookings
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/bookings` | Non | Lister les réservations |
| POST | `/bookings` | JWT | Créer une réservation |

### Reviews
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/reviews` | Non | Lister les avis |
| POST | `/reviews` | JWT | Publier un avis |

### Wishlist
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/wishlist` | Non | Lister les favoris |
| POST | `/wishlist` | JWT | Ajouter aux favoris |

### Messages
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/messages` | JWT | Lire les messages |
| POST | `/messages` | JWT | Envoyer un message |

### Notifications
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | JWT | Voir les notifications |

### Payments
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/payments` | JWT | Lister les paiements |
| POST | `/payments` | JWT | Créer un paiement |

### Upload (MinIO)
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/upload` | JWT | Uploader une image de logement |

## Documentation Swagger

Accessible sur : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Authentification JWT

Les routes protégées nécessitent le header :
```
Authorization: <token>
```

Obtenir un token via `POST /auth/login`.

## Tests

```bash
npm test
```

Les tests utilisent des mocks Prisma — aucune base de données nécessaire.

## Exemples de requêtes

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Jean","last_name":"Dupont","email":"jean@test.com","password":"motdepasse123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jean@test.com","password":"motdepasse123"}'
```

### Créer un logement (avec token)
```bash
curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: <votre_token>" \
  -d '{"owner_id":1,"title":"Appart Paris","description":"Bel appartement","price_per_night":85,"max_guests":4,"city":"Paris","country":"France"}'
```

### Uploader une image (avec token)
```bash
curl -X POST http://localhost:3000/upload \
  -H "Authorization: <votre_token>" \
  -F "image=@/chemin/vers/photo.jpg" \
  -F "property_id=1" \
  -F "is_main=true"
```
