# Study AI MVP

Une application d'analyse de contenu PDF et vidéo YouTube avec intelligence artificielle pour les étudiants.

## 📋 Description

Study AI est une plateforme permettant aux étudiants et enseignants d'analyser des documents PDF et des vidéos YouTube à l'aide de l'intelligence artificielle. Les utilisateurs peuvent importer leur contenu, puis poser des questions à l'IA qui répond en fonction du contenu spécifique des documents.

## ✨ Fonctionnalités

- **Authentification** : Inscription et connexion sécurisées
- **Gestion des documents** : Upload de PDF et intégration de vidéos YouTube
- **Analyse de contenu** : Extraction automatique du texte des PDF et des transcriptions YouTube
- **Chat IA** : Posez des questions en langage naturel sur le contenu de vos documents
- **Historique des questions** : Conservez l'historique de vos échanges avec l'IA
- **RBAC** : Contrôle d'accès basé sur les rôles (étudiant, enseignant, admin)
- **Interface responsive** : Utilisable sur ordinateur, tablette et mobile

## 🛠️ Technologies

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express** - Framework web
- **GraphQL** - API pour les requêtes et mutations
- **Apollo Server** - Serveur GraphQL
- **MongoDB** - Base de données NoSQL
- **JWT** - Authentification par token
- **OpenAI API** - Intégration IA (GPT-4o-mini)
- **Multer** - Gestion des uploads de fichiers
- **PDF-Parse** - Extraction de texte des PDF
- **YouTube Transcript** - Extraction des transcriptions YouTube

### Frontend
- **React** - Bibliothèque UI
- **Material UI** - Composants d'interface utilisateur
- **Apollo Client** - Client GraphQL
- **React Router** - Gestion des routes
- **React Dropzone** - Upload de fichiers par glisser-déposer
- **React Player** - Lecteur vidéo YouTube
- **React Markdown** - Rendu des réponses formatées de l'IA

## 🚀 Installation

### Prérequis
- Node.js (v16+)
- MongoDB
- Compte OpenAI (pour l'API)

### Installation du backend
```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/study-ai-mvp.git
cd study-ai-mvp

# Installer les dépendances du serveur
cd server
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier les valeurs dans .env
```

### Installation du frontend
```bash
# Installer les dépendances du client
cd ../client
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier les valeurs dans .env
```

### Lancement de l'application
```bash
# Démarrer le serveur (dans /server)
npm run dev

# Démarrer le client (dans /client)
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 📚 Documentation API

La documentation de l'API GraphQL est accessible via GraphQL Playground à l'adresse [http://localhost:4000/graphql](http://localhost:4000/graphql) lorsque le serveur est en cours d'exécution.

## 🧪 Tests

```bash
# Exécuter les tests du serveur
cd server
npm test

# Exécuter les tests du client
cd client
npm test
```

## 📁 Structure du projet

```
/study-ai-mvp/
  ├── /client/                  # Frontend React
  │   ├── /public/
  │   ├── /src/
  │   │   ├── /components/      # Composants réutilisables
  │   │   ├── /context/         # Contextes React (Auth, etc.)
  │   │   ├── /graphql/         # Requêtes et mutations GraphQL
  │   │   ├── /pages/           # Pages principales
  │   │   ├── /utils/           # Fonctions utilitaires
  │   │   ├── App.js            # Composant principal
  │   │   └── index.js          # Point d'entrée
  │   └── package.json
  │
  └── /server/                  # Backend Node.js
      ├── /config/              # Configuration
      ├── /models/              # Modèles MongoDB
      ├── /graphql/             # Schémas et résolveurs GraphQL
      ├── /services/            # Services (IA, traitement de documents)
      ├── /middleware/          # Middleware (auth, RBAC)
      ├── /utils/               # Fonctions utilitaires
      ├── /uploads/             # Dossier pour les fichiers uploadés
      ├── server.js             # Point d'entrée du serveur
      └── package.json
```

## 🔒 Variables d'environnement

### Backend (.env)
```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/study-ai-mvp
JWT_SECRET=your-secret-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:4000
```

## 📝 Roadmap

- [ ] Partage de documents entre utilisateurs
- [ ] Génération automatique de résumés
- [ ] Création de quiz à partir du contenu
- [ ] Annotations et surlignage de sections importantes
- [ ] Intégration avec des LMS (Moodle, Canvas, etc.)
- [ ] Application mobile

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## 🙏 Remerciements

- OpenAI pour l'API GPT
- La communauté open-source pour toutes les bibliothèques utilisées