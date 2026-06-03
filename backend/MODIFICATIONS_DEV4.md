# Modifications effectuées par DEV4

## DEV2 — API & Routes Lead

---

### 1. `server.js`

**Ce qui a changé :**
```js
// AVANT
const app = require("./src/app");
app.listen(process.env.PORT || 3000, ...);

// APRÈS
require("dotenv").config(); // ← ligne ajoutée
const app = require("./src/app");
app.listen(process.env.PORT || 3000, ...);
```

**Pourquoi :**
Sans `require("dotenv").config()`, Node.js ne lit jamais le fichier `.env`.
Résultat : `DATABASE_URL` et `JWT_SECRET` restaient `undefined`.
- Prisma refusait de se connecter à PostgreSQL
- Tous les tokens JWT étaient invalides

---

### 2. `src/app.js`

**Ce qui a changé :**
- Import de `swagger-ui-express` et de la config Swagger ajoutés
- Route `/api-docs` ajoutée pour exposer la documentation
- 5 nouvelles routes branchées : `/reviews`, `/wishlist`, `/messages`, `/notifications`, `/payments`

**Pourquoi :**
- Swagger = livrable obligatoire DEV4
- Les 5 controllers (review, wishlist, message, notification, payment) existaient déjà mais n'étaient branchés nulle part → inaccessibles

---

### 3. `src/routes/property.routes.js`

**Ce qui a changé :**
```js
// AVANT
router.post("/", controller.create);       // ← create n'existe pas dans le controller
router.get("/", controller.getAll);        // ← getAll n'existe pas dans le controller
router.get("/:id", controller.getOne);     // ← getOne n'existe pas dans le controller
// PUT et DELETE manquants

// APRÈS
router.get("/", controller.getAllProperties);
router.get("/:id", controller.getPropertyById);
router.post("/", authMiddleware, controller.createProperty);
router.put("/:id", authMiddleware, controller.updateProperty);    // ← ajouté
router.delete("/:id", authMiddleware, controller.deleteProperty); // ← ajouté
// + commentaires Swagger sur chaque route
```

**Pourquoi :**
Le controller exportait `getAllProperties`, `getPropertyById`, `createProperty`, `updateProperty`, `deleteProperty`.
Les routes appelaient `create`, `getAll`, `getOne` qui n'existaient pas → `TypeError: controller.create is not a function` au runtime.
Les routes PUT et DELETE étaient absentes alors que le controller et le service les supportaient.

---

### 4. `src/routes/user.routes.js`

**Ce qui a changé :**
- Commentaires Swagger `@swagger` ajoutés sur `GET /users` et `POST /users`

**Pourquoi :**
La logique du fichier n'a pas été touchée.
Les commentaires Swagger sont nécessaires pour que `/api-docs` affiche ces routes dans la documentation.

---

### 5. `src/routes/booking.routes.js`

**Ce qui a changé :**
- Commentaires Swagger `@swagger` complétés avec les détails du body (champs, types, exemples)

**Pourquoi :**
Le fichier avait déjà une ébauche de Swagger mais incomplète (pas de requestBody documenté).
Complétion pour que la doc soit utilisable.

---

### 6. `src/services/property.service.js`

**Ce qui a changé :**
```js
// AVANT
exports.create = async (data) => { ... }
exports.getAll = async () => { ... }
exports.getOne = async (id) => { ... }
// updateProperty et deleteProperty absents

// APRÈS
exports.getAllProperties = async () => { ... }
exports.getPropertyById = async (id) => { ... }
exports.createProperty = async (data) => { ... }
exports.updateProperty = async (id, data) => { ... } // ← ajouté
exports.deleteProperty = async (id) => { ... }       // ← ajouté
```

**Pourquoi :**
Le controller appelait `propertyService.getAllProperties()`, `propertyService.getPropertyById()`, etc.
Le service exportait `create`, `getAll`, `getOne` → noms différents → `TypeError` au runtime.
`updateProperty` et `deleteProperty` étaient complètement absents du service alors que le controller les appelait.

---

### 7. `src/services/booking.service.js`

**Ce qui a changé :**
```js
// AVANT
exports.create = async (data) => { ... }
exports.getAll = async () => { ... }

// APRÈS
exports.createBooking = async (data) => { ... }
exports.getAllBookings = async () => { ... }
```

**Pourquoi :**
Le controller appelait `bookingService.getAllBookings()` et `bookingService.createBooking()`.
Le service exportait `create` et `getAll` → noms différents → `TypeError` au runtime.

---

## DEV3 — Auth & Security Lead

---

### 8. `src/controllers/auth.controller.js`

**Ce qui a changé :**
```js
// AVANT
const token = await authService.login(req.body);

// APRÈS
const token = await authService.login(req.body.email, req.body.password);
```

**Pourquoi :**
`authService.login` attend 2 paramètres séparés : `email` et `password`.
Le controller passait `req.body` (un objet entier) comme premier paramètre.
Résultat : `email` recevait `{ email: "...", password: "..." }` au lieu d'une string → `User not found` → 401 systématiquement.

---

### 9. `src/routes/auth.routes.js`

**Ce qui a changé :**
```js
// AVANT
(fichier vide — 1 ligne vide)

// APRÈS
router.post("/register", authController.register);
router.post("/login", authController.login);
// + commentaires Swagger complets
```

**Pourquoi :**
Le fichier existait mais était totalement vide.
Sans les routes définies, `POST /auth/register` et `POST /auth/login` retournaient 404.
C'est le point d'entrée principal de l'authentification → critique.

---

## Fichiers créés par DEV4 (nouveaux, pas modifiés)

| Fichier | Rôle |
|---|---|
| `src/config/swagger.js` | Configuration Swagger (titre, version, bearerAuth) |
| `src/routes/review.routes.js` | Routes GET + POST /reviews |
| `src/routes/wishlist.routes.js` | Routes GET + POST /wishlist |
| `src/routes/message.routes.js` | Routes GET + POST /messages |
| `src/routes/notification.routes.js` | Route GET /notifications |
| `src/routes/payment.routes.js` | Routes GET + POST /payments |
| `src/services/review.service.js` | Logique DB pour les avis |
| `src/services/wishlist.service.js` | Logique DB pour les favoris |
| `src/services/message.service.js` | Logique DB pour les messages |
| `src/services/notification.service.js` | Logique DB pour les notifications |
| `src/services/payment.service.js` | Logique DB pour les paiements |
| `tests/auth.test.js` | 5 tests : register + login |
| `tests/user.test.js` | 2 tests : GET + POST users |
| `tests/property.test.js` | 8 tests : CRUD properties + JWT |
| `tests/booking.test.js` | 3 tests : GET + POST bookings + JWT |
| `jest.config.js` | Configuration Jest |
| `.env.example` | Exemple de variables d'environnement |
| `README.md` | Documentation complète de l'API |
| `package.json` | swagger-jsdoc, swagger-ui-express, jest, supertest, nodemon ajoutés |
