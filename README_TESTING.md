# 🧪 ITSM SOA Project - Guide Complet de Test

Bienvenue! Ce projet est une **architecture microservices SOA** avec API Gateway, gRPC, GraphQL, REST et Kafka.

**Ce guide vous explique comment tester chaque composant.**

---

## 📚 Documentation Disponible

Vous avez 5 fichiers de documentation à votre disposition:

| Fichier | Description | Pour Qui |
|---------|-------------|---------|
| **[GUIDE_TEST_COMPLET.md](GUIDE_TEST_COMPLET.md)** | Guide très détaillé avec architecture, prérequis, étapes de démarrage, et tous les endpoints avec réponses attendues | 👨‍💻 Développeurs complets |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Commandes rapides, peu de texte, juste ce qu'il faut pour tester | ⚡ Commandes rapides |
| **[SCENARIO_TEST_DETAILLE.md](SCENARIO_TEST_DETAILLE.md)** | Scénario pas à pas: enregistrement → création incident → vérification kafka | 📺 Tutoriel visuel |
| **[ENDPOINT_REFERENCE.md](ENDPOINT_REFERENCE.md)** | Référence de tous les endpoints GraphQL, REST, gRPC avec paramètres | 📖 Documentation technique |
| **[ITSM_SOA_Postman_Collection.json](ITSM_SOA_Postman_Collection.json)** | Collection Postman prête à importer | 📮 Import Postman |

---

## 🚀 Démarrage Ultra Rapide (5 minutes)

### 1️⃣ Démarrer l'infrastructure (Docker)

```bash
cd Backend
docker-compose up -d
```

**Vérifier:**
```bash
docker-compose ps
# zookeeper et kafka doivent être UP
```

### 2️⃣ Démarrer les services (5 Terminals)

```bash
# Terminal 1
cd Backend/microservices/auth-service && npm run dev

# Terminal 2  
cd Backend/microservices/incident-service && npm run dev

# Terminal 3
cd Backend/microservices/request-service && npm run dev

# Terminal 4
cd Backend/microservices/notification-service && npm run dev

# Terminal 5
cd Backend/api-gateway && npm run dev
```

### 3️⃣ Tester avec Postman (Importer la collection)

1. Ouvrir Postman
2. **File → Import → ITSM_SOA_Postman_Collection.json**
3. Cliquer sur **GraphQL - Register**
4. Cliquer **Send** ✅

**Résultat attendu:** Token JWT reçu

---

## 📊 Architecture du Système

```
┌─────────────────────────────────────┐
│      API Gateway (PORT 3000)         │
│  • REST: /auth/login                │
│  • GraphQL: /graphql                │
│  • gRPC Clients                     │
└──────────────┬──────────────────────┘
         ↓    ↓    ↓    ↓
    ┌─────────────────────────────┐
    │   MICROSERVICES (gRPC)      │
    │ • Auth (5001)               │
    │ • Incident (5002)           │
    │ • Request (5003)            │
    │ • Notification (5004)       │
    └─────────────┬───────────────┘
         ↓    ↓    ↓
    ┌─────────────────────────────┐
    │   MESSAGE QUEUE (Kafka)     │
    │ • Topics: incidents         │
    │ • Topics: requests          │
    │ • Topics: notifications     │
    └─────────────────────────────┘
```

---

## 🧪 Types de Tests Disponibles

### 1. **REST API**
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
➜ Voir [GUIDE_TEST_COMPLET.md - Tests REST](GUIDE_TEST_COMPLET.md#tests-rest)

---

### 2. **GraphQL API**
```graphql
mutation {
  register(
    email: "user@example.com"
    password: "password123"
    name: "John Doe"
  ) {
    token
    user { id email name }
  }
}
```
➜ Voir [GUIDE_TEST_COMPLET.md - Tests GraphQL](GUIDE_TEST_COMPLET.md#tests-graphql)

---

### 3. **gRPC Services**
```bash
grpcurl -plaintext \
  -d '{"email":"user@example.com","password":"password123"}' \
  localhost:5001 proto.auth.AuthService/Login
```
➜ Voir [GUIDE_TEST_COMPLET.md - Tests gRPC](GUIDE_TEST_COMPLET.md#tests-grpc)

---

### 4. **Kafka Messages**
```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:909 2 \
  --topic incidents \
  --from-beginning
```
➜ Voir [GUIDE_TEST_COMPLET.md - Tests Kafka](GUIDE_TEST_COMPLET.md#tests-kafka)

---

## 📋 Checklist de Vérification

Utilisez cette checklist pour vérifier que tout fonctionne:

### Services Démarrés
- [ ] API Gateway sur port 3000
- [ ] Auth Service gRPC sur port 5001
- [ ] Incident Service gRPC sur port 5002
- [ ] Request Service gRPC sur port 5003
- [ ] Notification Service sur port 5004
- [ ] Kafka sur port 9092
- [ ] Zookeeper sur port 2181

### Tests REST
- [ ] `POST /auth/login` retourne un token

### Tests GraphQL
- [ ] `query { ping }` retourne "pong"
- [ ] `mutation { register(...) }` crée un utilisateur
- [ ] `mutation { login(...) }` retourne un token
- [ ] `mutation { createIncident(...) }` crée un incident
- [ ] `query { getIncidents }` liste les incidents
- [ ] `mutation { createRequest(...) }` crée une demande
- [ ] `query { getRequests }` liste les demandes

### Tests gRPC
- [ ] `grpcurl localhost:5001 list` liste les services
- [ ] `RegisterUser` fonctionne
- [ ] `LoginUser` fonctionne
- [ ] `ListIncidents` retourne des incidents
- [ ] `ListRequests` retourne des demandes

### Tests Kafka
- [ ] Topic `incidents` a des messages
- [ ] Topic `requests` a des messages
- [ ] Topic `notifications` reçoit les notifications
- [ ] Kafdrop UI accessible sur http://localhost:9000

---

## 🔍 Vérifier que Tout Fonctionne

### Commande Rapide (Linux/Mac)

```bash
# Vérifier les ports en écoute
lsof -i :3000
lsof -i :5001
lsof -i :5002
lsof -i :5003
lsof -i :5004
lsof -i :9092
```

### Commande Rapide (Windows)

```powershell
# Vérifier les ports en écoute
netstat -ano | findstr :3000
netstat -ano | findstr :5001
# ... etc
```

---

## 🚨 Erreurs Courantes

### ❌ "Connection refused on port 3000"

**Solution:**
```bash
cd Backend/api-gateway
npm install
npm run dev
```

### ❌ "gRPC Server not available"

**Solution:**
```bash
cd Backend/microservices/auth-service
npm install
npm run dev
```

### ❌ "Cannot connect to Kafka"

**Solution:**
```bash
docker-compose restart kafka zookeeper
```

### ❌ "EADDRINUSE - Port already in use"

**Solution (Windows):**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution (Mac/Linux):**
```bash
lsof -i :3000
kill -9 <PID>
```

---

## 📖 Tutoriels par Type de Teste

### Je veux tester le **REST API**
→ Voir [QUICK_REFERENCE.md - Tests REST](QUICK_REFERENCE.md#5-tests-rest-api-avec-curl-ou-postman)

### Je veux tester le **GraphQL**
→ Voir [QUICK_REFERENCE.md - Tests GraphQL](QUICK_REFERENCE.md#5-tests-graphql-avec-curl-ou-postman)

### Je veux tester le **gRPC**
→ Voir [QUICK_REFERENCE.md - Tests gRPC](QUICK_REFERENCE.md#6-tests-grpc-avec-grpcurl)

### Je veux tester le **Kafka**
→ Voir [QUICK_REFERENCE.md - Tests Kafka](QUICK_REFERENCE.md#7-tests-kafka)

### Je veux un scénario complet
→ Voir [SCENARIO_TEST_DETAILLE.md](SCENARIO_TEST_DETAILLE.md)

### Je veux la référence des endpoints
→ Voir [ENDPOINT_REFERENCE.md](ENDPOINT_REFERENCE.md)

---

## 🎯 Scénario Recommandé (15 minutes)

### Étape 1: Vérifier l'infrastructure (2 min)
```bash
docker-compose ps
lsof -i :3000  # API Gateway
```

### Étape 2: Tester GraphQL Ping (1 min)
Postman → POST /graphql → `{ ping }`

### Étape 3: Créer un utilisateur (2 min)
GraphQL Mutation Register

### Étape 4: Créer un incident (2 min)
GraphQL Mutation CreateIncident

### Étape 5: Lister les incidents (1 min)
GraphQL Query GetIncidents

### Étape 6: Vérifier Kafka (2 min)
```bash
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic incidents \
  --from-beginning
```

### Étape 7: Tester gRPC (2 min)
```bash
grpcurl -plaintext localhost:5001 list
```

### Étape 8: Voir Kafdrop UI (1 min)
http://localhost:9000

---

## 🔗 Ressources Externes

- [GraphQL Documentation](https://graphql.org/learn/)
- [gRPC Documentation](https://grpc.io/docs/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Postman Learning Center](https://learning.postman.com/)

---

## 💡 Pro Tips

### 1. Utiliser des Variables Postman
```
{{base_url}}     → http://localhost:3000
{{token}}        → JWT sauvegardé automatiquement
{{incident_id}}  → Incident créé
```

### 2. Ajouter des Tests Postman
Postman peut vérifier automatiquement les réponses:
```javascript
pm.test("Response is 200", function() {
  pm.response.to.have.status(200);
});
```

### 3. Monitorer les logs en temps réel
```bash
npm run dev 2>&1 | grep -i error
```

### 4. Utiliser Kafdrop pour visualiser Kafka
Kafdrop est déjà dans docker-compose, accédez à http://localhost:9000

### 5. Créer des Aliases
```bash
# Linux/Mac - ajouter à ~/.zshrc
alias start-tests='cd ~/itsm-soa-project/Backend && docker-compose up -d'
```

---

## 📞 Support et Dépannage

### Impossible de démarrer les services

**Vérifier:**
1. Node.js est installé: `node --version`
2. npm est installé: `npm --version`
3. Les dépendances sont installées: `npm install`

**Redémarrer:**
```bash
npm run dev
```

### Impossible de se connecter à Kafka

**Vérifier:**
1. Docker est démarré: `docker ps`
2. docker-compose est en cours d'exécution
3. Port 9092 est libre: `lsof -i :9092`

**Redémarrer:**
```bash
docker-compose restart kafka zookeeper
```

### graphQL retourne "Cannot query field"

**Cause:** API Gateway n'a pas démarré correctement

**Solution:**
```bash
cd Backend/api-gateway
npm install
npm run dev
```

---

## 🎓 Apprentissage Progressif

### Niveau 1: Débutant (15 min)
- [ ] Démarrer tous les services
- [ ] Tester GraphQL Ping
- [ ] Tester REST Login

### Niveau 2: Intermédiaire (30 min)
- [ ] Niveau 1 + Créer un utilisateur
- [ ] Créer un incident
- [ ] Lister les incidents
- [ ] Vérifier les messages Kafka

### Niveau 3: Avancé (1h)
- [ ] Niveau 2 + Tester gRPC directement
- [ ] Tester tous les endpoints
- [ ] Monitorer Kafka en détail
- [ ] Comprendre le flux complet

### Niveau 4: Expert (2h+)
- [ ] Modifier le code des services
- [ ] Ajouter des nouveaux endpoints
- [ ] Implémenter la logique métier
- [ ] Déployer en production

---

## 📊 Statistiques Système

### Microservices
- ✅ 4 Microservices (Auth, Incident, Request, Notification)
- ✅ 4 Ports gRPC différents
- ✅ 1 API Gateway central

### APIs
- ✅ 1 API REST
- ✅ 1 API GraphQL
- ✅ 4 Services gRPC

### Infrastructure
- ✅ 1 Kafka Broker
- ✅ 1 Zookeeper
- ✅ MongoDB (Incidents)
- ✅ PostgreSQL (Auth)
- ✅ RxDB (Requests)

### Topics Kafka
- ✅ incidents
- ✅ requests
- ✅ notifications

---

## 🏆 Objectifs de Test

- ✅ Tester chaque endpoint REST
- ✅ Tester chaque mutation/query GraphQL
- ✅ Tester chaque service gRPC
- ✅ Vérifier les messages Kafka
- ✅ Tester l'intégration complète
- ✅ Monitorer les performances

---

## 📝 Notes Importantes

1. **Ports:** Assurez-vous que tous les ports (3000, 5001-5004, 9092, 2181) sont disponibles
2. **Docker:** Docker Compose doit être installé et en cours d'exécution
3. **Node.js:** Version 14+ requise
4. **Terminal:** Vous aurez besoin de 5-6 terminaux ou d'un multiplexeur (tmux, Screen)

---

## 🎉 Prêt à Commencer?

### Choix 1: Je veux juste démarrer et tester rapidement
→ Allez à [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### Choix 2: Je veux un guide complet et détaillé
→ Allez à [GUIDE_TEST_COMPLET.md](GUIDE_TEST_COMPLET.md)

### Choix 3: Je veux un scénario pas à pas avec explications
→ Allez à [SCENARIO_TEST_DETAILLE.md](SCENARIO_TEST_DETAILLE.md)

### Choix 4: Je veux la référence technique des endpoints
→ Allez à [ENDPOINT_REFERENCE.md](ENDPOINT_REFERENCE.md)

### Choix 5: Je veux importer directement dans Postman
→ Utilisez [ITSM_SOA_Postman_Collection.json](ITSM_SOA_Postman_Collection.json)

---

## 📅 Dernière Mise à Jour

- **Date:** 18 Mai 2026
- **Version:** 1.0.0
- **Statut:** ✅ Complet et Testé
- **Support:** 🟢 Actif

---

**Bonne chance avec vos tests! 🚀**

*Pour des questions, consultez les fichiers de documentation ou réexécutez les commandes de troubleshooting.*
