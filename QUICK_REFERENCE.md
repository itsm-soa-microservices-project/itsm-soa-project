# 🚀 QUICK START - Commandes Rapides de Test

## 1️⃣ Démarrer les Infrastructure (Docker)

```bash
cd Backend
docker-compose up -d
docker-compose ps  # Vérifier que tout est UP
```

---

## 2️⃣ Démarrer les Microservices (4 Terminals)

### Terminal 1: Auth Service
```bash
cd Backend/microservices/auth-service
npm install  # Première fois seulement
npm run dev  # ou node server.js
# Attend: ✓ gRPC Server listening on 0.0.0.0:5001
```

### Terminal 2: Incident Service
```bash
cd Backend/microservices/incident-service
npm install
npm run dev
# Attend: ✓ gRPC Server listening on 0.0.0.0:5002
```

### Terminal 3: Request Service
```bash
cd Backend/microservices/request-service
npm install
npm run dev
# Attend: ✓ gRPC Server listening on 0.0.0.0:5003
```

### Terminal 4: Notification Service
```bash
cd Backend/microservices/notification-service
npm install
npm run dev
# Attend: ✓ Notification Service running on 0.0.0.0:5004
```

### Terminal 5: API Gateway
```bash
cd Backend/api-gateway
npm install
npm run dev
# Attend: 🚀 Gateway running on http://localhost:3000
```

---

## 3️⃣ Vérifications Rapides

### ✅ Vérifier que tout est en cours d'exécution

```bash
# Vérifier les ports
lsof -i :3000    # API Gateway
lsof -i :5001    # Auth Service gRPC
lsof -i :5002    # Incident Service gRPC
lsof -i :5003    # Request Service gRPC
lsof -i :5004    # Notification Service
lsof -i :9092    # Kafka
```

**Alternative Windows:**
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :5001
netstat -ano | findstr :5002
# etc...
```

---

## 4️⃣ Tests REST (avec curl ou Postman)

### Test 1: REST Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Réponse attendue:**
```json
{"token": "...", "user": {...}}
```

---

## 5️⃣ Tests GraphQL (avec curl ou Postman)

### Test 1: Ping
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ ping }"}'
```

### Test 2: Register
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { register(email: \"user@example.com\", password: \"pass123\", name: \"John\") { token user { id email } } }"}'
```

### Test 3: Login
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(email: \"user@example.com\", password: \"pass123\") { token user { id email } } }"}'
```

### Test 4: Create Incident
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createIncident(title: \"Server Down\", description: \"Not responding\", priority: \"HIGH\") { id title status } }"}'
```

### Test 5: Get Incidents
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ getIncidents { id title status } }"}'
```

### Test 6: Create Request
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createRequest(title: \"Laptop\", description: \"Need laptop\", category: \"HW\", priority: \"MEDIUM\", userId: \"1\") { id title } }"}'
```

### Test 7: Get Requests
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ getRequests { id title category } }"}'
```

---

## 6️⃣ Tests gRPC (avec grpcurl)

### Installation de grpcurl

```bash
# Avec Go:
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest

# Avec Homebrew (Mac):
brew install grpcurl

# Avec Chocolatey (Windows):
choco install grpcurl
```

### Test 1: List Auth Service Methods
```bash
grpcurl -plaintext localhost:5001 list
```

### Test 2: Register User
```bash
grpcurl -plaintext \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}' \
  localhost:5001 proto.auth.AuthService/Register
```

### Test 3: Login
```bash
grpcurl -plaintext \
  -d '{"email":"user@example.com","password":"pass123"}' \
  localhost:5001 proto.auth.AuthService/Login
```

### Test 4: Verify Token
```bash
grpcurl -plaintext \
  -d '{"token":"YOUR_TOKEN_HERE"}' \
  localhost:5001 proto.auth.AuthService/VerifyToken
```

### Test 5: List Incidents (gRPC)
```bash
grpcurl -plaintext \
  -d '{"page":1,"page_size":10,"status":""}' \
  localhost:5002 proto.incident.IncidentService/ListIncidents
```

### Test 6: Create Incident (gRPC)
```bash
grpcurl -plaintext \
  -d '{
    "incident":{
      "title":"Database Error",
      "description":"Connection failed",
      "status":"OPEN",
      "reporter_id":"1",
      "priority":"CRITICAL"
    }
  }' \
  localhost:5002 proto.incident.IncidentService/CreateIncident
```

### Test 7: List Requests (gRPC)
```bash
grpcurl -plaintext \
  -d '{"page":1,"page_size":10,"status":""}' \
  localhost:5003 proto.request.RequestService/ListRequests
```

### Test 8: Create Request (gRPC)
```bash
grpcurl -plaintext \
  -d '{
    "request":{
      "title":"New Laptop",
      "description":"For development",
      "status":"PENDING",
      "requester_id":"1",
      "category":"HARDWARE",
      "priority":"HIGH"
    }
  }' \
  localhost:5003 proto.request.RequestService/CreateRequest
```

---

## 7️⃣ Tests Kafka

### Démarrer Kafdrop (UI Web)
```bash
docker run -d \
  --name kafdrop \
  -p 9000:9000 \
  -e KAFKA_BROKERCONNECT=localhost:9092 \
  obsidiandynamics/kafdrop:latest
```

**Accéder à:** http://localhost:9000

### Lister les Topics
```bash
docker exec kafka kafka-topics \
  --list \
  --bootstrap-server localhost:9092
```

### Lire les messages (Incidents)
```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic incidents \
  --from-beginning
```

### Lire les messages (Requests)
```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic requests \
  --from-beginning
```

### Lire les messages (Notifications)
```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic notifications \
  --from-beginning
```

---

## 📱 Utiliser Postman

### Option 1: Importer la Collection

1. Ouvrir Postman
2. Cliquer **File → Import**
3. Sélectionner `ITSM_SOA_Postman_Collection.json`
4. Cliquer **Import**

Vous aurez accès à tous les endpoints pré-configurés!

### Option 2: Créer manuellement

1. Cliquer **+** pour créer une nouvelle requête
2. Sélectionner **POST**
3. URL: `http://localhost:3000/graphql`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{"query":"{ ping }"}
```
6. Cliquer **Send**

---

## ⚠️ Troubleshooting Rapide

### Port déjà utilisé

```bash
# Trouver le processus
lsof -i :3000  # Remplacer 3000 par le port

# Arrêter le processus (get PID from above)
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Services ne démarrent pas

```bash
# Vérifier les dépendances
npm install

# Vérifier les fichiers .env
cat .env

# Voir les logs d'erreur
npm run dev  # Sans bg pour voir les logs
```

### Kafka ne fonctionne pas

```bash
# Redémarrer Kafka
docker-compose restart kafka zookeeper

# Vérifier les logs
docker-compose logs kafka
docker-compose logs zookeeper
```

### gRPC Connection refused

```bash
# Vérifier que le service est démarré
lsof -i :5001  # Pour Auth Service

# Redémarrer le service
cd Backend/microservices/auth-service
npm run dev
```

---

## 🎯 Ordre de Test Recommandé

1. ✅ Vérifier tous les services démarrés
2. ✅ GraphQL Ping
3. ✅ GraphQL Register + Login
4. ✅ REST Login
5. ✅ GraphQL Create Incident
6. ✅ GraphQL Get Incidents
7. ✅ GraphQL Create Request
8. ✅ GraphQL Get Requests
9. ✅ gRPC Auth Service
10. ✅ gRPC Incident Service
11. ✅ gRPC Request Service
12. ✅ Vérifier les messages Kafka

---

## 📊 Variables Postman à Sauvegarder

Après chaque login/register, le token est sauvegardé automatiquement:

```
{{token}} - JWT Token
{{incident_id}} - Dernier ID incident créé
{{request_id}} - Dernier ID demande créée
```

---

## 🔗 URLs Importantes

| Service | URL | Port |
|---------|-----|------|
| API Gateway | http://localhost:3000 | 3000 |
| GraphQL | http://localhost:3000/graphql | 3000 |
| Auth Service gRPC | localhost:5001 | 5001 |
| Incident Service gRPC | localhost:5002 | 5002 |
| Request Service gRPC | localhost:5003 | 5003 |
| Notification Service | localhost:5004 | 5004 |
| Kafka | localhost:9092 | 9092 |
| Zookeeper | localhost:2181 | 2181 |
| Kafdrop UI | http://localhost:9000 | 9000 |

---

## ✨ Shortcuts (create alias)

### Linux/Mac

```bash
# Ajouter à ~/.zshrc ou ~/.bashrc:

alias start-itsm-docker='cd ~/itsm-soa-project/Backend && docker-compose up -d'
alias stop-itsm-docker='cd ~/itsm-soa-project/Backend && docker-compose down'
alias start-auth='cd ~/itsm-soa-project/Backend/microservices/auth-service && npm run dev'
alias start-incident='cd ~/itsm-soa-project/Backend/microservices/incident-service && npm run dev'
alias start-request='cd ~/itsm-soa-project/Backend/microservices/request-service && npm run dev'
alias start-notification='cd ~/itsm-soa-project/Backend/microservices/notification-service && npm run dev'
alias start-gateway='cd ~/itsm-soa-project/Backend/api-gateway && npm run dev'

# Utilisation:
start-itsm-docker  # Démarre Docker
start-auth         # Démarre Auth Service
# etc...
```

---

**Bonne chance avec les tests! 🎉**
