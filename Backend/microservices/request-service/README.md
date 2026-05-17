Request Service (ITSM)

Description

Le `request-service` est un microservice du système IT Service Management (ITSM) responsable de la gestion des demandes de service (service requests).
Ces demandes concernent des besoins planifiés (ex. installation de logiciel, demande d'accès, demande de matériel, configuration standard), et non des incidents.

Architecture

Client → API Gateway → gRPC → request-service → RxDB (local NoSQL, persistance via LokiJS) → Kafka → notification-service

Composants et rôles

- `src/models/request.model.js` : encapsule les opérations CRUD sur RxDB et sert d'interface entre le service et la base locale.
- `src/services/request.service.js` : contient la logique métier (création de request, préparation des données métier comme `id`, `status`, `createdAt`, `updatedAt`).
- `src/grpc/handler.js` : reçoit les appels gRPC (depuis l'API Gateway), appelle le service métier, renvoie la réponse gRPC et déclenche les événements Kafka (topic d'événements).
- `src/grpc/server.js` : expose le service `RequestService` sur un port (ex: 5003) et connecte les méthodes gRPC aux handlers.
- `src/rxdb/` : configuration et schéma RxDB (LokiJS) pour stockage local des requests.
- `src/kafka/` : producteur/consommateur Kafka (publisher d'événements). Pour l'instant, la logique Kafka peut rester inactive ou mockée.

Notes importantes

- Les identifiants (`id`) sont des UUID (`crypto.randomUUID()`), et les timestamps sont stockés en ISO string.
- Le schéma gRPC se trouve dans `proto/request.proto` (format aligné avec les handlers du service).

Prochaines étapes possibles

- Ajouter validation d'entrée et gestion d'erreurs plus robuste.
- Exposer des filtres/pagination pour `GetRequests`.
- Intégrer les événements Kafka avec des topics définis et consommateurs (notification-service).
