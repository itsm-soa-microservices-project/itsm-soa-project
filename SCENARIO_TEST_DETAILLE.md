# 📸 SCÉNARIO DE TEST PAS À PAS AVEC RÉSULTATS ATTENDUS

## 🎬 SCÉNARIO: Créer et Gérer un Incident IT

Cet exemple montre le flux complet: enregistrement → connexion → création d'incident → visualisation.

---

## ÉTAPE 1: Vérifier que tous les services sont démarrés

### Commandes de vérification

```bash
# Vérifier Docker
docker-compose ps

# Sortie attendue:
# NAME                  STATUS
# zookeeper            Up (healthy)
# kafka                Up (healthy)
```

```bash
# Vérifier les services Node.js
lsof -i :3000    # API Gateway
lsof -i :5001    # Auth Service
lsof -i :5002    # Incident Service
lsof -i :5003    # Request Service
```

**Tous les ports doivent être LISTEN (en écoute)**

---

## ÉTAPE 2: Ouvrir Postman

### Action
1. Lancer Postman
2. Importer la collection: **File → Import → ITSM_SOA_Postman_Collection.json**
3. Créer un nouveau Environment: **ITSM_SOA_TEST**

### Configuration de l'Environment
```json
{
  "token": "",
  "incident_id": "",
  "request_id": "",
  "base_url": "http://localhost:3000"
}
```

---

## ÉTAPE 3: Enregistrer un nouvel utilisateur (GraphQL)

### Requête Postman

**Onglet:** New Tab
**Méthode:** POST
**URL:** `{{base_url}}/graphql`

**Headers:**
```
Content-Type: application/json
```

**Body (raw - GraphQL Query):**
```graphql
mutation {
  register(
    email: "alice@company.com"
    password: "SecurePass123!"
    name: "Alice Johnson"
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

### Résultat attendu (200 OK)

```json
{
  "data": {
    "register": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFsaWNlQGNvbXBhbnkuY29tIn0.xyz123",
      "user": {
        "id": "1",
        "email": "alice@company.com",
        "name": "Alice Johnson",
        "roles": ["user"]
      }
    }
  }
}
```

### Action Postman
1. Après la réponse, aller à l'onglet **Tests**
2. Ajouter un script pour sauvegarder le token:

```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.register.token);
    pm.environment.set("user_id", jsonData.data.register.user.id);
    console.log("✓ Utilisateur créé et token sauvegardé");
}
```

3. Cliquer **Send**

---

## ÉTAPE 4: Se connecter (GraphQL)

### Requête Postman

**URL:** `{{base_url}}/graphql`

**Body:**
```graphql
mutation {
  login(
    email: "alice@company.com"
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

### Résultat attendu (200 OK)

```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.abc789",
      "user": {
        "id": "1",
        "email": "alice@company.com",
        "name": "Alice Johnson",
        "roles": ["user"]
      }
    }
  }
}
```

**✓ Le token est maintenant disponible dans `{{token}}`**

---

## ÉTAPE 5: Créer un Incident (GraphQL)

### Requête Postman

**URL:** `{{base_url}}/graphql`

**Body:**
```graphql
mutation {
  createIncident(
    title: "Production Database Timeout"
    description: "The main database is timing out and affecting all services"
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

### Résultat attendu (200 OK)

```json
{
  "data": {
    "createIncident": {
      "id": "incident-001",
      "title": "Production Database Timeout",
      "description": "The main database is timing out and affecting all services",
      "status": "OPEN",
      "priority": "CRITICAL",
      "reporterId": "1",
      "createdAt": "2026-05-18T14:30:45.123Z"
    }
  }
}
```

### Actions à Postman
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("incident_id", jsonData.data.createIncident.id);
    console.log("✓ Incident créé:", jsonData.data.createIncident.id);
}
```

---

## ÉTAPE 6: Vérifier le message Kafka (Incident créé)

### Commander une nouvelle fenêtre Terminal

```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic incidents \
  --from-beginning \
  --max-messages 1
```

### Message attendu

```json
{
  "event_type": "INCIDENT_CREATED",
  "incident_id": "incident-001",
  "timestamp": "2026-05-18T14:30:45.123Z",
  "data": {
    "title": "Production Database Timeout",
    "description": "The main database is timing out and affecting all services",
    "priority": "CRITICAL",
    "reporter_id": "1"
  }
}
```

**✓ Le Notification Service reçoit ce message et peut envoyer une alerte email**

---

## ÉTAPE 7: Récupérer tous les Incidents (GraphQL)

### Requête Postman

**URL:** `{{base_url}}/graphql`

**Body:**
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

### Résultat attendu (200 OK)

```json
{
  "data": {
    "getIncidents": [
      {
        "id": "incident-001",
        "title": "Production Database Timeout",
        "description": "The main database is timing out and affecting all services",
        "status": "OPEN",
        "priority": "CRITICAL",
        "reporterId": "1",
        "assigneeId": null,
        "createdAt": "2026-05-18T14:30:45.123Z",
        "updatedAt": "2026-05-18T14:30:45.123Z"
      }
    ]
  }
}
```

---

## ÉTAPE 8: Créer une Demande (GraphQL)

### Requête Postman

**URL:** `{{base_url}}/graphql`

**Body:**
```graphql
mutation {
  createRequest(
    title: "Emergency Database Scaling"
    description: "Need to scale database immediately to handle current load"
    category: "INFRASTRUCTURE"
    priority: "CRITICAL"
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

### Résultat attendu (200 OK)

```json
{
  "data": {
    "createRequest": {
      "id": "req-001",
      "title": "Emergency Database Scaling",
      "description": "Need to scale database immediately to handle current load",
      "category": "INFRASTRUCTURE",
      "priority": "CRITICAL",
      "status": "PENDING",
      "createdAt": "2026-05-18T14:31:20.456Z"
    }
  }
}
```

---

## ÉTAPE 9: Vérifier le message Kafka (Demande créée)

```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic requests \
  --from-beginning \
  --max-messages 1
```

### Message attendu

```json
{
  "event_type": "REQUEST_CREATED",
  "request_id": "req-001",
  "timestamp": "2026-05-18T14:31:20.456Z",
  "data": {
    "title": "Emergency Database Scaling",
    "priority": "CRITICAL",
    "requester_id": "1",
    "category": "INFRASTRUCTURE"
  }
}
```

---

## ÉTAPE 10: Tester gRPC directement

### Récupérer tous les incidents via gRPC

```bash
grpcurl -plaintext \
  -d '{"page":1,"page_size":10,"status":""}' \
  localhost:5002 proto.incident.IncidentService/ListIncidents
```

### Résultat attendu

```json
{
  "incidents": [
    {
      "id": "incident-001",
      "title": "Production Database Timeout",
      "description": "The main database is timing out and affecting all services",
      "status": "OPEN",
      "reporter_id": "1",
      "assignee_id": "",
      "priority": "CRITICAL",
      "created_at": "1716030645123",
      "updated_at": "1716030645123"
    }
  ],
  "total": 1
}
```

---

## ÉTAPE 11: Vérifier dans Kafdrop UI

### Ouvrir le navigateur

1. Aller à: `http://localhost:9000`
2. Cliquer sur **Topics**
3. Sélectionner topic: `incidents`
4. Voir les messages publiés

**Vous verrez:**
- Total de messages par topic
- Les données de chaque message
- Timestamps
- Partitions

---

## ÉTAPE 12: Tester avec REST API

### Login REST

**Requête Postman:**

**Méthode:** POST
**URL:** `{{base_url}}/auth/login`
**Body:**
```json
{
  "email": "alice@company.com",
  "password": "SecurePass123!"
}
```

### Résultat attendu (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.xyz",
  "user": {
    "id": "1",
    "email": "alice@company.com",
    "name": "Alice Johnson",
    "roles": ["user"]
  }
}
```

---

## 📊 Résumé du Flux Complet

```
┌─────────────────────────────────────────────────────────┐
│ 1. REGISTER (GraphQL)                                   │
│    Email: alice@company.com → Token sauvegardé         │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. LOGIN (GraphQL)                                       │
│    Email + Password → Token confirmé                    │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. CREATE INCIDENT (GraphQL)                            │
│    Title + Description → incident-001 créé             │
└────────────────┬────────────────────────────────────────┘
                 ↓
        ┌────────┴────────┐
        ↓                 ↓
    ┌────────────┐   ┌──────────────┐
    │GraphQL DB  │   │Kafka Topic   │
    │incident-001│   │"incidents"   │
    └────────────┘   └──────┬───────┘
                            ↓
                    ┌────────────────────┐
                    │Notification Service│
                    │(Consomme message)  │
                    │Envoie alerte email │
                    └────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. GET INCIDENTS (GraphQL)                              │
│    Récupère la liste avec incident-001                 │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. CREATE REQUEST (GraphQL)                             │
│    Title + Category → req-001 créé                     │
└────────────────┬────────────────────────────────────────┘
                 ↓
        ┌────────┴────────┐
        ↓                 ↓
    ┌────────────┐   ┌──────────────┐
    │GraphQL DB  │   │Kafka Topic   │
    │req-001     │   │"requests"    │
    └────────────┘   └──────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 6. LIST INCIDENTS (gRPC)                                │
│    Via gRPC directement du service                      │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Vérification

- [ ] Tous les services démarrés sur les bons ports
- [ ] Enregistrement d'utilisateur réussi
- [ ] Login réussi (token obtenu)
- [ ] Création d'incident réussie
- [ ] Incident visible dans getIncidents
- [ ] Message Kafka visible dans topic "incidents"
- [ ] Création de demande réussie
- [ ] Message Kafka visible dans topic "requests"
- [ ] gRPC ListIncidents fonctionne
- [ ] REST Login fonctionne
- [ ] Kafdrop UI accessible et affiche les messages

**Si tous les points sont verts ✅, votre architecture SOA fonctionne complètement!**

---

## 🚨 Erreurs Courantes et Solutions

### Erreur: "GraphQL Error: Cannot query field 'ping'"

**Cause:** Le service GraphQL n'a pas démarré correctement

**Solution:**
```bash
cd Backend/api-gateway
npm install
npm run dev
```

---

### Erreur: "gRPC Server not available"

**Cause:** Le service microservice n'est pas en cours d'exécution

**Solution:**
```bash
lsof -i :5001  # Vérifier si Auth Service tourne
# Si rien n'apparaît, démarrer:
cd Backend/microservices/auth-service
npm run dev
```

---

### Erreur: "ECONNREFUSED 127.0.0.1:9092"

**Cause:** Kafka n'est pas en cours d'exécution

**Solution:**
```bash
cd Backend
docker-compose up -d kafka zookeeper
docker-compose ps
```

---

### Erreur: "Cannot find module 'express'"

**Cause:** Les dépendances npm ne sont pas installées

**Solution:**
```bash
cd Backend/api-gateway
npm install
# Puis redémarrer
npm run dev
```

---

## 💡 Conseils Pro

### 1. Utiliser des Variables Postman
```
{{base_url}}  → http://localhost:3000
{{token}}     → JWT token
{{incident_id}} → Dernier incident créé
```

### 2. Ajouter des Tests Postman
```javascript
pm.test("Response is 200", () => {
  pm.response.to.have.status(200);
});

pm.test("Response has data", () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData.data).to.exist;
});
```

### 3. Monitorer les logs en direct
```bash
# Pour voir tous les logs d'un service:
npm run dev 2>&1 | grep -i "error\|warning"
```

### 4. Utiliser Thunder Client (Alternative à Postman)
Si vous préférez une alternative plus légère à Postman, Thunder Client est disponible directement dans VS Code!

---

## 📸 Screenshots Attendus

### Screenshot 1: Postman - Response du Register
```
Status: 200 OK
Body (JSON):
{
  "data": {
    "register": {
      "token": "eyJhbGc...",
      "user": {
        "id": "1",
        "email": "alice@company.com",
        "name": "Alice Johnson",
        "roles": ["user"]
      }
    }
  }
}
```

### Screenshot 2: Kafdrop - Messages Kafka
```
Topics:
  - incidents (2 messages)
  - requests (1 message)
  - notifications (1 message)

Clicking on "incidents" shows:
[
  {
    "event_type": "INCIDENT_CREATED",
    "incident_id": "incident-001",
    "timestamp": "2026-05-18T14:30:45.123Z",
    ...
  }
]
```

### Screenshot 3: Terminal - grpcurl Response
```
$ grpcurl -plaintext ...
{
  "incidents": [
    {
      "id": "incident-001",
      "title": "Production Database Timeout",
      "status": "OPEN",
      "priority": "CRITICAL"
    }
  ],
  "total": 1
}
```

---

**Fin du scénario. Vous avez maintenant testé:**
- ✅ REST API
- ✅ GraphQL API
- ✅ gRPC Services
- ✅ Kafka Message Queue
- ✅ Intégration complète SOA

**Bravo! 🎉**

