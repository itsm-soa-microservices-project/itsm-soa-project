# 🧪 GUIDE COMPLET DE TEST - ITSM SOA PROJECT

## 📋 TABLE DES MATIÈRES
1. [Architecture et Ports](#architecture)
2. [Prérequis et Installation](#prérequis)
3. [Étapes de Démarrage](#démarrage)
4. [Tests REST API](#tests-rest)
5. [Tests GraphQL](#tests-graphql)
6. [Tests gRPC](#tests-grpc)
7. [Tests Kafka](#tests-kafka)
8. [Scénario Complet d'Intégration](#scénario-complet)

---

## 🏗️ Architecture et Ports {#architecture}

```
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY (PORT 3000)               │
│  • REST: /auth/login                                    │
│  • GraphQL: /graphql                                    │
│  • gRPC Clients → Microservices                         │
└─────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────┐
│                    MICROSERVICES                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Auth Service (PORT 5001)                         │    │
│  │ • gRPC Server                                    │    │
│  │ • PostgreSQL DB                                  │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Incident Service (PORT 5002)                     │    │
│  │ • gRPC Server                                    │    │
│  │ • MongoDB DB                                     │    │
│  │ • Kafka Producer/Consumer                        │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Request Service (PORT 5003)                      │    │
│  │ • gRPC Server                                    │    │
│  │ • RxDB                                           │    │
│  │ • Kafka Producer/Consumer                        │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Notification Service (PORT 5004)                 │    │
│  │ • Kafka Consumer                                 │    │
│  │ • Email Service                                  │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────┐
│              INFRASTRUCTURE                               │
│  • Kafka (PORT 9092)                                     │
│  • Zookeeper (PORT 2181)                                 │
│  • MongoDB (PORT 27017)                                  │
│  • PostgreSQL (PORT 5432)                                │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Prérequis et Installation {#prérequis}

### Outils Requis
- ✅ **Postman** (pour tester les APIs REST/GraphQL)
- ✅ **Node.js** (v14+)
- ✅ **Docker & Docker Compose** (pour les services)
- ✅ **MongoDB Compass** (pour visualiser MongoDB)
- ✅ **pgAdmin** (pour visualiser PostgreSQL)
- ✅ **Kafka Tool** ou **kafdrop** (pour visualiser Kafka)
- ✅ **grpcurl** (pour tester gRPC directement)

### Installation des dépendances

```bash
# Auth Service
cd Backend/microservices/auth-service
npm install

# Incident Service
cd Backend/microservices/incident-service
npm install

# Request Service
cd Backend/microservices/request-service
npm install

# Notification Service
cd Backend/microservices/notification-service
npm install

# API Gateway
cd Backend/api-gateway
npm install
```

---

## 🚀 Étapes de Démarrage {#démarrage}

### Étape 1: Démarrer les Services d'Infrastructure (Kafka, MongoDB, etc.)

```bash
cd Backend
docker-compose up -d
```

**Vérifier que tout est démarré:**
```bash
docker-compose ps
```

**Expected Output:**
```
zookeeper        UP (healthy)
kafka            UP (healthy)
```

### Étape 2: Démarrer les Microservices

**Terminal 1 - Auth Service:**
```bash
cd Backend/microservices/auth-service
npm run dev  # ou node server.js
# Expected: gRPC Server listening on 0.0.0.0:5001
```

**Terminal 2 - Incident Service:**
```bash
cd Backend/microservices/incident-service
npm run dev
# Expected: gRPC Server listening on 0.0.0.0:5002
```

**Terminal 3 - Request Service:**
```bash
cd Backend/microservices/request-service
npm run dev
# Expected: gRPC Server listening on 0.0.0.0:5003
```

**Terminal 4 - Notification Service:**
```bash
cd Backend/microservices/notification-service
npm run dev
# Expected: Notification Service listening on 0.0.0.0:5004
```

### Étape 3: Démarrer l'API Gateway

**Terminal 5 - API Gateway:**
```bash
cd Backend/api-gateway
npm run dev  # ou node server.js
# Expected: 🚀 Gateway running on http://localhost:3000
```

---

## 🌐 Tests REST API {#tests-rest}

### URL de base
```
http://localhost:3000
```

### Endpoint 1: Login REST

**Method:** `POST`
**URL:** `http://localhost:3000/auth/login`
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (raw JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["user"]
  }
}
```

**Erreur Possible:**
```json
{
  "error": "Unauthorized - Invalid credentials"
}
```

---

## 📊 Tests GraphQL {#tests-graphql}

### URL de base
```
http://localhost:3000/graphql
```

### Endpoint 1: Test de Connexion (Query)

**Method:** `POST`
**URL:** `http://localhost:3000/graphql`
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (raw JSON):**
```json
{
  "query": "{ ping }"
}
```

**Expected Response:**
```json
{
  "data": {
    "ping": "pong"
  }
}
```

---

### Endpoint 2: Register User (Mutation)

**Method:** `POST`
**URL:** `http://localhost:3000/graphql`

**Body (raw JSON):**
```json
{
  "query": "mutation { register(email: \"newuser@example.com\", password: \"password123\", name: \"Jane Doe\") { token user { id email name roles } } }"
}
```

**Ou formaté (plus lisible):**
```graphql
mutation {
  register(
    email: "newuser@example.com"
    password: "password123"
    name: "Jane Doe"
  ) {
    token
    user {
      id
      email
      name
      roles
    }
  }
}
```

**Expected Response (201):**
```json
{
  "data": {
    "register": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "123",
        "email": "newuser@example.com",
        "name": "Jane Doe",
        "roles": ["user"]
      }
    }
  }
}
```

---

### Endpoint 3: Login User (Mutation)

**Method:** `POST`
**URL:** `http://localhost:3000/graphql`

**Body (GraphQL):**
```graphql
mutation {
  login(email: "user@example.com", password: "password123") {
    token
    user {
      id
      email
      name
      roles
    }
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "1",
        "email": "user@example.com",
        "name": "John Doe",
        "roles": ["user"]
      }
    }
  }
}
```

---

### Endpoint 4: Create Incident (Mutation)

**Method:** `POST`
**URL:** `http://localhost:3000/graphql`

**Body (GraphQL):**
```graphql
mutation {
  createIncident(
    title: "Server Down"
    description: "Main server is not responding"
    priority: "HIGH"
  ) {
    id
    title
    description
    status
    priority
    createdAt
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "createIncident": {
      "id": "incident-1",
      "title": "Server Down",
      "description": "Main server is not responding",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2026-05-18T10:30:00Z"
    }
  }
}
```

---

### Endpoint 5: Get All Incidents (Query)

**Method:** `POST`
**URL:** `http://localhost:3000/graphql`

**Body (GraphQL):**
```graphql
query {
  getIncidents {
    id
    title
    description
    status
    priority
    reporterId
    assigneeId
    createdAt
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "getIncidents": [
      {
        "id": "incident-1",
        "title": "Server Down",
        "description": "Main server is not responding",
        "status": "OPEN",
        "priority": "HIGH",
        "reporterId": "1",
        "assigneeId": null,
        "createdAt": "2026-05-18T10:30:00Z"
      }
    ]
  }
}
```

---

### Endpoint 6: Create Request (Mutation)

**Method:** `POST`
**URL:** `http://localhost:3000/graphql`

**Body (GraphQL):**
```graphql
mutation {
  createRequest(
    title: "Upgrade RAM"
    description: "Need to upgrade server RAM to 64GB"
    category: "HARDWARE"
    priority: "MEDIUM"
    userId: "1"
  ) {
    id
    title
    description
    category
    priority
    status
    createdAt
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "createRequest": {
      "id": "req-1",
      "title": "Upgrade RAM",
      "description": "Need to upgrade server RAM to 64GB",
      "category": "HARDWARE",
      "priority": "MEDIUM",
      "status": "PENDING",
      "createdAt": "2026-05-18T10:35:00Z"
    }
  }
}
```

---

### Endpoint 7: Get All Requests (Query)

**Method:** `POST`
**URL:** `http://localhost:3000/graphql`

**Body (GraphQL):**
```graphql
query {
  getRequests {
    id
    title
    description
    category
    priority
    status
    userId
    assigneeId
    createdAt
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "getRequests": [
      {
        "id": "req-1",
        "title": "Upgrade RAM",
        "description": "Need to upgrade server RAM to 64GB",
        "category": "HARDWARE",
        "priority": "MEDIUM",
        "status": "PENDING",
        "userId": "1",
        "assigneeId": null,
        "createdAt": "2026-05-18T10:35:00Z"
      }
    ]
  }
}
```

---

## 🔌 Tests gRPC {#tests-grpc}

Pour tester gRPC, utilisez **grpcurl**.

### Installation de grpcurl

```bash
# Avec Go installé:
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest

# Ou Homebrew (Mac):
brew install grpcurl

# Ou Chocolatey (Windows):
choco install grpcurl
```

---

### Test 1: Vérifier la disponibilité du service Auth

```bash
grpcurl -plaintext localhost:5001 list
```

**Expected Output:**
```
proto.auth.AuthService
grpc.reflection.v1.ServerReflection
grpc.reflection.v1alpha.ServerReflection
```

---

### Test 2: Enregistrer un utilisateur (Auth Service)

```bash
grpcurl -plaintext \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}' \
  localhost:5001 proto.auth.AuthService/Register
```

**Expected Output:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["user"],
    "created_at": "1716030600000",
    "updated_at": "1716030600000"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Test 3: Se connecter (Auth Service)

```bash
grpcurl -plaintext \
  -d '{"email":"user@example.com","password":"password123"}' \
  localhost:5001 proto.auth.AuthService/Login
```

**Expected Output:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["user"],
    "created_at": "1716030600000",
    "updated_at": "1716030600000"
  }
}
```

---

### Test 4: Vérifier le token (Auth Service)

```bash
grpcurl -plaintext \
  -d '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}' \
  localhost:5001 proto.auth.AuthService/VerifyToken
```

**Expected Output:**
```json
{
  "valid": true,
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["user"]
  }
}
```

---

### Test 5: Lister les incidents (Incident Service)

```bash
grpcurl -plaintext \
  -d '{"page":1,"page_size":10,"status":""}' \
  localhost:5002 proto.incident.IncidentService/ListIncidents
```

**Expected Output:**
```json
{
  "incidents": [
    {
      "id": "incident-1",
      "title": "Server Down",
      "description": "Main server is not responding",
      "status": "OPEN",
      "reporter_id": "1",
      "assignee_id": "",
      "priority": "HIGH",
      "created_at": "1716030600000",
      "updated_at": "1716030600000"
    }
  ],
  "total": 1
}
```

---

### Test 6: Créer un incident (Incident Service)

```bash
grpcurl -plaintext \
  -d '{
    "incident":{
      "title":"Database Error",
      "description":"Database connection failed",
      "status":"OPEN",
      "reporter_id":"1",
      "priority":"CRITICAL"
    }
  }' \
  localhost:5002 proto.incident.IncidentService/CreateIncident
```

**Expected Output:**
```json
{
  "incident": {
    "id": "incident-2",
    "title": "Database Error",
    "description": "Database connection failed",
    "status": "OPEN",
    "reporter_id": "1",
    "priority": "CRITICAL",
    "created_at": "1716030700000",
    "updated_at": "1716030700000"
  }
}
```

---

### Test 7: Lister les demandes (Request Service)

```bash
grpcurl -plaintext \
  -d '{"page":1,"page_size":10,"status":""}' \
  localhost:5003 proto.request.RequestService/ListRequests
```

**Expected Output:**
```json
{
  "requests": [
    {
      "id": "req-1",
      "title": "Upgrade RAM",
      "description": "Need to upgrade server RAM to 64GB",
      "status": "PENDING",
      "requester_id": "1",
      "category": "HARDWARE",
      "priority": "MEDIUM",
      "created_at": "1716030600000",
      "updated_at": "1716030600000"
    }
  ],
  "total": 1
}
```

---

### Test 8: Créer une demande (Request Service)

```bash
grpcurl -plaintext \
  -d '{
    "request":{
      "title":"New Laptop",
      "description":"Need a new laptop for development",
      "status":"PENDING",
      "requester_id":"1",
      "category":"HARDWARE",
      "priority":"HIGH"
    }
  }' \
  localhost:5003 proto.request.RequestService/CreateRequest
```

**Expected Output:**
```json
{
  "request": {
    "id": "req-2",
    "title": "New Laptop",
    "description": "Need a new laptop for development",
    "status": "PENDING",
    "requester_id": "1",
    "category": "HARDWARE",
    "priority": "HIGH",
    "created_at": "1716030700000",
    "updated_at": "1716030700000"
  }
}
```

---

## 📡 Tests Kafka {#tests-kafka}

### Installation de Kafdrop (Interface Web pour Kafka)

```bash
docker run -d \
  --name kafdrop \
  -p 9000:9000 \
  -e KAFKA_BROKERCONNECT=localhost:9092 \
  obsidiandynamics/kafdrop:latest
```

**Accédez à:** `http://localhost:9000`

---

### Observer les Topics Kafka

Vérifier que les topics sont créés:
```bash
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092
```

**Topics attendus:**
- `incidents` - Events des incidents
- `requests` - Events des requêtes
- `notifications` - Notifications envoyées

---

### Lire les messages d'un topic

```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic incidents \
  --from-beginning
```

### Créer un incident (génère un message Kafka)

Utilisez le GraphQL pour créer un incident:

```graphql
mutation {
  createIncident(
    title: "Network Issue"
    description: "Intermittent network connectivity"
    priority: "MEDIUM"
  ) {
    id
  }
}
```

**Message Kafka produit:**
```json
{
  "event_type": "INCIDENT_CREATED",
  "incident_id": "incident-3",
  "timestamp": "2026-05-18T10:45:00Z",
  "data": {
    "title": "Network Issue",
    "description": "Intermittent network connectivity",
    "priority": "MEDIUM"
  }
}
```

---

## 🔄 Scénario Complet d'Intégration {#scénario-complet}

### 📝 Étape 1: Enregistrer un utilisateur

**Postman - GraphQL:**

```json
{
  "query": "mutation { register(email: \"employee@company.com\", password: \"secure123\", name: \"Alice Johnson\") { token user { id email name } } }"
}
```

**Réponse attendue:**
- Token JWT
- User ID (eg: "1")

---

### 📝 Étape 2: Se connecter

**Postman - REST ou GraphQL:**

```json
{
  "email": "employee@company.com",
  "password": "secure123"
}
```

**Sauvegarder le token:** `{{TOKEN}}`

---

### 📝 Étape 3: Créer un incident

**Postman - GraphQL avec token:**

```json
{
  "query": "mutation { createIncident(title: \"Production Alert\", description: \"High CPU usage on server 3\", priority: \"CRITICAL\") { id title status } }"
}
```

**Vérifier dans Kafdrop:** Un message est produit dans le topic `incidents`

---

### 📝 Étape 4: Créer une demande

**Postman - GraphQL:**

```json
{
  "query": "mutation { createRequest(title: \"VPN Setup\", description: \"Setup VPN for remote work\", category: \"IT\", priority: \"HIGH\", userId: \"1\") { id status } }"
}
```

**Vérifier dans Kafdrop:** Un message est produit dans le topic `requests`

---

### 📝 Étape 5: Lister tous les incidents

**Postman - GraphQL:**

```json
{
  "query": "{ getIncidents { id title status priority } }"
}
```

---

### 📝 Étape 6: Lister toutes les demandes

**Postman - GraphQL:**

```json
{
  "query": "{ getRequests { id title status category } }"
}
```

---

### 📝 Étape 7: Vérifier les notifications

**Terminal:**

```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic notifications \
  --from-beginning
```

---

## ⚠️ Troubleshooting

### Problème: "Connection refused" sur le port 3000

**Solution:**
```bash
# Vérifier que le gateway est en cours d'exécution
lsof -i :3000

# Démarrer le gateway
cd Backend/api-gateway
npm run dev
```

---

### Problème: "gRPC Connection refused" sur le port 5001

**Solution:**
```bash
# Vérifier les services
lsof -i :5001
lsof -i :5002
lsof -i :5003

# Redémarrer les services
cd Backend/microservices/auth-service
npm run dev
```

---

### Problème: Kafka non démarré

**Solution:**
```bash
# Vérifier les conteneurs
docker-compose ps

# Redémarrer les services
docker-compose restart kafka zookeeper
```

---

### Problème: "EADDRINUSE" port déjà utilisé

**Solution (Windows):**
```powershell
# Trouver le processus utilisant le port
netstat -ano | findstr :3000

# Arrêter le processus (remplacer PID par le numéro)
taskkill /PID <PID> /F
```

---

## 📚 Postman Collection JSON

Voici une collection Postman importable:

```json
{
  "info": {
    "name": "ITSM SOA Project",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Auth - REST Login",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "http://localhost:3000/auth/login", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["auth", "login"]},
        "body": {"mode": "raw", "raw": "{\"email\":\"user@example.com\",\"password\":\"password123\"}"}
      }
    },
    {
      "name": "GraphQL - Register",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "http://localhost:3000/graphql", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["graphql"]},
        "body": {"mode": "raw", "raw": "{\"query\":\"mutation { register(email: \\\"newuser@example.com\\\", password: \\\"password123\\\", name: \\\"Jane Doe\\\") { token user { id email name roles } } }\"}"}
      }
    },
    {
      "name": "GraphQL - Create Incident",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "http://localhost:3000/graphql", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["graphql"]},
        "body": {"mode": "raw", "raw": "{\"query\":\"mutation { createIncident(title: \\\"Server Down\\\", description: \\\"Main server is not responding\\\", priority: \\\"HIGH\\\") { id title description status priority createdAt } }\"}"}
      }
    },
    {
      "name": "GraphQL - Get Incidents",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "http://localhost:3000/graphql", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["graphql"]},
        "body": {"mode": "raw", "raw": "{\"query\":\"query { getIncidents { id title description status priority reporterId assigneeId createdAt } }\"}"}
      }
    },
    {
      "name": "GraphQL - Create Request",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "http://localhost:3000/graphql", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["graphql"]},
        "body": {"mode": "raw", "raw": "{\"query\":\"mutation { createRequest(title: \\\"Upgrade RAM\\\", description: \\\"Need to upgrade server RAM to 64GB\\\", category: \\\"HARDWARE\\\", priority: \\\"MEDIUM\\\", userId: \\\"1\\\") { id title description category priority status createdAt } }\"}"}
      }
    },
    {
      "name": "GraphQL - Get Requests",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "http://localhost:3000/graphql", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["graphql"]},
        "body": {"mode": "raw", "raw": "{\"query\":\"query { getRequests { id title description category priority status userId assigneeId createdAt } }\"}"}
      }
    }
  ]
}
```

**Import dans Postman:**
1. Ouvrir Postman
2. Cliquer sur **Import** (haut à gauche)
3. Sélectionner **Raw text** et coller le JSON
4. Cliquer sur **Import**

---

## ✅ Checklist de Vérification

- [ ] Docker Compose démarré et tous les services en cours d'exécution
- [ ] Auth Service sur port 5001
- [ ] Incident Service sur port 5002
- [ ] Request Service sur port 5003
- [ ] Notification Service sur port 5004
- [ ] API Gateway sur port 3000
- [ ] Kafka sur port 9092
- [ ] Zookeeper sur port 2181
- [ ] GraphQL /graphql accessible
- [ ] REST /auth/login accessible
- [ ] Grpcurl peut se connecter aux services
- [ ] Kafdrop accessible sur http://localhost:9000
- [ ] Messages Kafka visibles dans les topics

---

## 📞 Contact & Support

Pour plus d'informations, consultez:
- 📄 Proto files: `Backend/proto/*.proto`
- 📄 Services source: `Backend/microservices/*/src/`
- 📄 API Gateway source: `Backend/api-gateway/src/`

---

**Dernière mise à jour:** 18 Mai 2026
**Version:** 1.0.0
