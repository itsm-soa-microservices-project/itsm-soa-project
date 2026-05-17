Notification Service (ITSM)

Description

Le `notification-service` est un microservice événementiel dans le système IT Service Management (ITSM). Il ne gère pas de requêtes directes des utilisateurs et n'expose pas d'API gRPC ou REST.

Rôle principal

- recevoir des événements métiers publiés par les autres microservices via Kafka
- transformer ces événements en notifications exploitables
- retranscrire ces notifications dans la console et, si configuré, envoyer des emails

Architecture globale

request-service / incident-service
            ↓
          Kafka
            ↓
   notification-service
            ↓
  notifications (console / email / logs)

Composants

- `server.js` : point d'entrée du service, initialise le consumer Kafka.
- `src/kafka/consumer.js` : consommateur Kafka abonné aux topics métier `REQUEST_CREATED` et `INCIDENT_CREATED`.
- `src/services/notification.service.js` : logique métier de notification, identification du type d'événement, extraction des données et génération des notifications.
- `src/services/email.service.js` : envoi d'emails de notification si les variables SMTP sont configurées, sinon simple log console.

Comportement

- le service écoute les topics Kafka suivants :
  - `REQUEST_CREATED`
  - `INCIDENT_CREATED`
- pour chaque message JSON reçu, il tente de le parser et de produire une notification.
- il n'expose aucune API externe et fonctionne uniquement en mode event-driven.

Variables d'environnement utiles

- `KAFKA_BROKER` : adresse du broker Kafka (par défaut `localhost:9092`)
- `KAFKA_CLIENT_ID` : identifiant client Kafka
- `KAFKA_GROUP_ID` : groupe de consumer Kafka
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` : configuration SMTP pour l'envoi d'emails
- `NOTIFICATION_EMAIL_FROM`, `NOTIFICATION_EMAIL_TO` : adresses email source et destination

Démarrage

```bash
cd Backend/microservices/notification-service
node server.js
```
