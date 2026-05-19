# 📚 RÉFÉRENCE COMPLÈTE DES ENDPOINTS

## 🗂️ INDEX RAPIDE

| Type | Endpoint | Port | Doc |
|------|----------|------|-----|
| **REST** | POST /auth/login | 3000 | [REST](#rest-api) |
| **GraphQL** | POST /graphql | 3000 | [GraphQL](#graphql-api) |
| **gRPC** | Auth Service | 5001 | [gRPC Auth](#grpc-auth-service) |
| **gRPC** | Incident Service | 5002 | [gRPC Incident](#grpc-incident-service) |
| **gRPC** | Request Service | 5003 | [gRPC Request](#grpc-request-service) |
| **Kafka** | Topics | 9092 | [Kafka](#kafka-topics) |
| **UI** | Kafdrop | 9000 | [http://localhost:9000](#kafdrop) |

---

## 🌐 REST API

### Base URL
```
http://localhost:3000
```

### Endpoint: Login

**Route:** `/auth/login`
**Méthode:** `POST`
**Content-Type:** `application/json`

**Paramètres (Body):**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Réponse (200 OK):**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "roles": ["string"]
  }
}
```

**Erreurs:**
```json
{
  "error": "Unauthorized - Invalid credentials" // 401
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## 📊 GraphQL API

### Base URL
```
http://localhost:3000/graphql
```

### Schema Complet

```graphql
type Query {
  ping: String
  getRequests: [Request]
  getIncidents: [Incident]
}

type Mutation {
  register(email: String!, password: String!, name: String): AuthPayload
  login(email: String!, password: String!): AuthPayload
  createRequest(...): Request
  createIncident(...): Incident
}

type User {
  id: ID
  email: String
  name: String
  roles: [String]
}

type AuthPayload {
  token: String
  user: User
}

type Request {
  id: ID
  title: String
  description: String
  category: String
  priority: String
  status: String
  userId: String
  assigneeId: String
  createdAt: String
  updatedAt: String
}

type Incident {
  id: ID
  title: String
  description: String
  status: String
  priority: String
  reporterId: String
  assigneeId: String
  createdAt: String
  updatedAt: String
}
```

---

### Query: Ping

**Description:** Test simple pour vérifier que GraphQL fonctionne

**Query:**
```graphql
{
  ping
}
```

**Réponse:**
```json
{
  "data": {
    "ping": "pong"
  }
}
```

---

### Mutation: Register

**Description:** Enregistrer un nouvel utilisateur

**Input:**
- `email` (String, required) - Email unique
- `password` (String, required) - Mot de passe sécurisé
- `name` (String, optional) - Nom de l'utilisateur

**Mutation:**
```graphql
mutation {
  register(
    email: "john@example.com"
    password: "SecurePass123!"
    name: "John Doe"
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

**Réponse:**
```json
{
  "data": {
    "register": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "1",
        "email": "john@example.com",
        "name": "John Doe",
        "roles": ["user"]
      }
    }
  }
}
```

---

### Mutation: Login

**Description:** Se connecter et obtenir un JWT token

**Input:**
- `email` (String, required)
- `password` (String, required)

**Mutation:**
```graphql
mutation {
  login(
    email: "john@example.com"
    password: "SecurePass123!"
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

**Réponse:**
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "1",
        "email": "john@example.com",
        "name": "John Doe",
        "roles": ["user"]
      }
    }
  }
}
```

---

### Mutation: Create Incident

**Description:** Créer un nouvel incident

**Input:**
- `title` (String, required) - Titre de l'incident
- `description` (String, optional) - Description détaillée
- `priority` (String, optional) - Priorité: LOW, MEDIUM, HIGH, CRITICAL

**Mutation:**
```graphql
mutation {
  createIncident(
    title: "Database Connection Error"
    description: "Main database is not responding"
    priority: "CRITICAL"
  ) {
    id
    title
    description
    status
    priority
    reporterId
    createdAt
  }
}
```

**Réponse:**
```json
{
  "data": {
    "createIncident": {
      "id": "incident-1",
      "title": "Database Connection Error",
      "description": "Main database is not responding",
      "status": "OPEN",
      "priority": "CRITICAL",
      "reporterId": "1",
      "createdAt": "2026-05-18T10:30:00Z"
    }
  }
}
```

---

### Query: Get All Incidents

**Description:** Récupérer la liste de tous les incidents

**Query:**
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
    updatedAt
  }
}
```

**Réponse:**
```json
{
  "data": {
    "getIncidents": [
      {
        "id": "incident-1",
        "title": "Database Connection Error",
        "description": "Main database is not responding",
        "status": "OPEN",
        "priority": "CRITICAL",
        "reporterId": "1",
        "assigneeId": null,
        "createdAt": "2026-05-18T10:30:00Z",
        "updatedAt": "2026-05-18T10:30:00Z"
      }
    ]
  }
}
```

---

### Mutation: Create Request

**Description:** Créer une nouvelle demande

**Input:**
- `title` (String, required)
- `description` (String, optional)
- `category` (String, optional) - Ex: HARDWARE, SOFTWARE, IT, etc.
- `priority` (String, optional) - LOW, MEDIUM, HIGH, CRITICAL
- `userId` (String, optional) - ID du demandeur

**Mutation:**
```graphql
mutation {
  createRequest(
    title: "New Laptop"
    description: "Need a new laptop for development"
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

**Réponse:**
```json
{
  "data": {
    "createRequest": {
      "id": "req-1",
      "title": "New Laptop",
      "description": "Need a new laptop for development",
      "category": "HARDWARE",
      "priority": "MEDIUM",
      "status": "PENDING",
      "createdAt": "2026-05-18T10:35:00Z"
    }
  }
}
```

---

### Query: Get All Requests

**Description:** Récupérer la liste de toutes les demandes

**Query:**
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
    updatedAt
  }
}
```

**Réponse:**
```json
{
  "data": {
    "getRequests": [
      {
        "id": "req-1",
        "title": "New Laptop",
        "description": "Need a new laptop for development",
        "category": "HARDWARE",
        "priority": "MEDIUM",
        "status": "PENDING",
        "userId": "1",
        "assigneeId": null,
        "createdAt": "2026-05-18T10:35:00Z",
        "updatedAt": "2026-05-18T10:35:00Z"
      }
    ]
  }
}
```

---

## 🔌 gRPC Services

### gRPC Auth Service

**Port:** 5001
**Package:** `proto.auth`
**Serveur:** `AuthService`

#### RPC Methods

##### 1. Register

**Requête:**
```protobuf
message RegisterRequest {
  string email = 1;
  string password = 2;
  string name = 3;
}
```

**Réponse:**
```protobuf
message RegisterResponse {
  User user = 1;
  string token = 2;
}
```

**Exemple grpcurl:**
```bash
grpcurl -plaintext \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}' \
  localhost:5001 proto.auth.AuthService/Register
```

---

##### 2. Login

**Requête:**
```protobuf
message LoginRequest {
  string email = 1;
  string password = 2;
}
```

**Réponse:**
```protobuf
message LoginResponse {
  string token = 1;
  User user = 2;
}
```

**Exemple grpcurl:**
```bash
grpcurl -plaintext \
  -d '{"email":"user@example.com","password":"pass123"}' \
  localhost:5001 proto.auth.AuthService/Login
```

---

##### 3. VerifyToken

**Requête:**
```protobuf
message VerifyTokenRequest {
  string token = 1;
}
```

**Réponse:**
```protobuf
message VerifyTokenResponse {
  bool valid = 1;
  User user = 2;
}
```

**Exemple grpcurl:**
```bash
grpcurl -plaintext \
  -d '{"token":"YOUR_JWT_TOKEN"}' \
  localhost:5001 proto.auth.AuthService/VerifyToken
```

---

### gRPC Incident Service

**Port:** 5002
**Package:** `proto.incident`
**Serveur:** `IncidentService`

#### RPC Methods

##### 1. CreateIncident

**Requête:**
```protobuf
message CreateIncidentRequest {
  Incident incident = 1;
}
```

**Réponse:**
```protobuf
message CreateIncidentResponse {
  Incident incident = 1;
}
```

**Exemple grpcurl:**
```bash
grpcurl -plaintext \
  -d '{
    "incident":{
      "title":"Network Issue",
      "description":"Intermittent connectivity",
      "status":"OPEN",
      "reporter_id":"1",
      "priority":"HIGH"
    }
  }' \
  localhost:5002 proto.incident.IncidentService/CreateIncident
```

---

##### 2. ListIncidents

**Requête:**
```protobuf
message ListIncidentsRequest {
  int32 page = 1;
  int32 page_size = 2;
  string status = 3;
}
```

**Réponse:**
```protobuf
message ListIncidentsResponse {
  repeated Incident incidents = 1;
  int32 total = 2;
}
```

**Exemple grpcurl:**
```bash
grpcurl -plaintext \
  -d '{"page":1,"page_size":10,"status":""}' \
  localhost:5002 proto.incident.IncidentService/ListIncidents
```

---

##### 3. GetIncident

**Requête:**
```protobuf
message GetIncidentRequest {
  string id = 1;
}
```

**Réponse:**
```protobuf
message GetIncidentResponse {
  Incident incident = 1;
}
```

**Exemple grpcurl:**
```bash
grpcurl -plaintext \
  -d '{"id":"incident-1"}' \
  localhost:5002 proto.incident.IncidentService/GetIncident
```

---

##### 4. UpdateIncident

**Requête:**
```protobuf
message UpdateIncidentRequest {
  Incident incident = 1;
}
```

**Réponse:**
```protobuf
message UpdateIncidentResponse {
  Incident incident = 1;
}
```

---

##### 5. DeleteIncident

**Requête:**
```protobuf
message DeleteIncidentRequest {
  string id = 1;
}
```

**Réponse:**
```protobuf
message DeleteIncidentResponse {
  bool success = 1;
}
```

---

### gRPC Request Service

**Port:** 5003
**Package:** `proto.request`
**Serveur:** `RequestService`

#### RPC Methods (identiques aux incidents)

**Available Methods:**
- `CreateRequest`
- `ListRequests`
- `GetRequest`
- `UpdateRequest`
- `DeleteRequest`

**Format similaire au Incident Service**

---

## 📡 Kafka Topics

### Topic: incidents

**Description:** Événements liés aux incidents

**Partition:** 1
**Replication Factor:** 1

**Schéma des Messages:**
```json
{
  "event_type": "INCIDENT_CREATED | INCIDENT_UPDATED | INCIDENT_DELETED",
  "incident_id": "string",
  "timestamp": "ISO 8601",
  "data": {
    "title": "string",
    "description": "string",
    "priority": "string",
    "status": "string",
    "reporter_id": "string"
  }
}
```

---

### Topic: requests

**Description:** Événements liés aux demandes

**Partition:** 1
**Replication Factor:** 1

**Schéma des Messages:**
```json
{
  "event_type": "REQUEST_CREATED | REQUEST_UPDATED | REQUEST_DELETED",
  "request_id": "string",
  "timestamp": "ISO 8601",
  "data": {
    "title": "string",
    "category": "string",
    "priority": "string",
    "status": "string",
    "requester_id": "string"
  }
}
```

---

### Topic: notifications

**Description:** Notifications générées par le Notification Service

**Partition:** 1
**Replication Factor:** 1

**Schéma des Messages:**
```json
{
  "notification_type": "EMAIL | SMS | PUSH",
  "recipient": "string",
  "subject": "string",
  "body": "string",
  "timestamp": "ISO 8601",
  "related_id": "string",
  "related_type": "INCIDENT | REQUEST"
}
```

---

### Commandes Kafka Utiles

**Lister tous les topics:**
```bash
docker exec kafka kafka-topics \
  --list \
  --bootstrap-server localhost:9092
```

**Consommer les messages d'un topic:**
```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic incidents \
  --from-beginning
```

**Compter les messages:**
```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic incidents \
  --from-beginning \
  | wc -l
```

---

## 🎯 Kafdrop UI

**URL:** http://localhost:9000

### Fonctionnalités

1. **Voir tous les topics**
   - Topics → Sélectionner topic
   - Voir nombre de partitions
   - Voir nombre total de messages

2. **Visualiser les messages**
   - Cliquer sur un message
   - Voir contenu JSON formaté
   - Voir timestamp et partition

3. **Monitorer en temps réel**
   - Les nouveaux messages apparaissent automatiquement
   - Voir la progression (offset)

---

## 🔗 URLs de Référence Rapide

```
API Gateway:        http://localhost:3000
GraphQL Endpoint:   http://localhost:3000/graphql
REST Login:         http://localhost:3000/auth/login

Auth Service gRPC:  localhost:5001
Incident gRPC:      localhost:5002
Request gRPC:       localhost:5003
Notification:       localhost:5004

Kafka Broker:       localhost:9092
Zookeeper:          localhost:2181
Kafdrop UI:         http://localhost:9000
```

---

## 📝 Codes de Statut HTTP

```
200 OK              Requête réussie
201 Created         Ressource créée
400 Bad Request     Requête invalide
401 Unauthorized    Non authentifié
403 Forbidden       Non autorisé
404 Not Found       Ressource non trouvée
500 Server Error    Erreur serveur
```

---

## 🔒 Headers HTTP Recommandés

```
Content-Type:       application/json
Authorization:      Bearer YOUR_JWT_TOKEN (si applicable)
X-Request-ID:       unique-identifier
X-Correlation-ID:   correlation-id
```

---

## 📚 Fichiers de Documentation

1. **GUIDE_TEST_COMPLET.md** - Guide détaillé complet
2. **QUICK_REFERENCE.md** - Commandes rapides
3. **SCENARIO_TEST_DETAILLE.md** - Scénario pas à pas
4. **ENDPOINT_REFERENCE.md** (ce fichier) - Référence des endpoints
5. **ITSM_SOA_Postman_Collection.json** - Collection Postman

---

**Dernière mise à jour:** 18 Mai 2026
