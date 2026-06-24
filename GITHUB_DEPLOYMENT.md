# 📤 Guide de Déploiement sur GitHub

## Étapes pour Publier sur GitHub

### 1. Créer un Repository sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite
3. Sélectionnez **"New repository"**
4. Remplissez les informations :
   - **Repository name** : `finanzplus-austria-form`
   - **Description** : `Formulaire d'éligibilité au prêt FinanzPlus Austria (Version allemande)`
   - **Visibility** : Public ou Private (selon votre choix)
   - ⚠️ **NE PAS** cocher "Initialize this repository with a README"
5. Cliquez sur **"Create repository"**

### 2. Lier votre Projet Local au Repository GitHub

Copiez l'URL de votre nouveau repository (elle ressemble à : `https://github.com/votre-username/finanzplus-austria-form.git`)

Puis exécutez dans votre terminal :

```bash
git remote add origin https://github.com/votre-username/finanzplus-austria-form.git
git branch -M main
git push -u origin main
```

### 3. Vérification

Retournez sur GitHub et actualisez la page. Vous devriez voir tous vos fichiers !

## 🔒 Sécurité Importante

⚠️ **ATTENTION** : Le fichier `backend/.env` contenant vos identifiants email est déjà dans `.gitignore` et ne sera PAS publié sur GitHub. C'est normal et sécurisé !

## 📁 Structure Publiée sur GitHub

```
finanzplus-austria-form/
├── backend/
│   ├── server.js
│   ├── .env.example (modèle de configuration)
│   ├── package.json
│   └── uploads/
├── frontend/
│   └── src/
│       ├── App.js (formulaire en allemand)
│       └── App.css
├── README.md
├── GUIDE_DEMARRAGE.md
└── .gitignore
```

## 🌐 Déploiement en Production (Optionnel)

### Option 1 : Vercel (Frontend) + Render (Backend)

**Frontend sur Vercel :**
1. Allez sur [vercel.com](https://vercel.com)
2. Importez votre repository GitHub
3. Configurez le build :
   - **Framework Preset** : Create React App
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`

**Backend sur Render :**
1. Allez sur [render.com](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repository GitHub
4. Configurez :
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
5. Ajoutez les variables d'environnement :
   - `EMAIL_HOST` : smtp.protonmail.com
   - `EMAIL_PORT` : 587
   - `EMAIL_USER` : votre_email@proton.me
   - `EMAIL_PASS` : votre_mot_de_passe_application

### Option 2 : Heroku (Full Stack)

```bash
# Installer Heroku CLI
# Puis :
heroku create finanzplus-austria
heroku config:set EMAIL_USER=votre_email@proton.me
heroku config:set EMAIL_PASS=votre_mot_de_passe
git push heroku main
```

## 📝 Commandes Git Utiles

```bash
# Voir le statut
git status

# Ajouter des modifications
git add .

# Créer un commit
git commit -m "Description des changements"

# Envoyer sur GitHub
git push origin main

# Voir l'historique
git log --oneline

# Créer une nouvelle branche
git checkout -b nouvelle-fonctionnalite

# Fusionner une branche
git checkout main
git merge nouvelle-fonctionnalite
```

## 🔄 Mettre à Jour le Repository

Après avoir fait des modifications :

```bash
git add .
git commit -m "Description de vos modifications"
git push origin main
```

## 👥 Collaborer

Pour inviter des collaborateurs :
1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** → **Collaborators**
3. Ajoutez les utilisateurs GitHub

## 📊 GitHub Pages (Pour Documentation)

Si vous voulez héberger la documentation :
1. Allez dans **Settings** → **Pages**
2. Sélectionnez la branche `main`
3. Votre documentation sera accessible à : `https://votre-username.github.io/finanzplus-austria-form/`

## 🆘 Problèmes Courants

### Erreur : "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/votre-username/finanzplus-austria-form.git
```

### Erreur : "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Fichiers sensibles accidentellement commités
```bash
git rm --cached backend/.env
git commit -m "Remove sensitive file"
git push origin main
```

## ✅ Checklist Avant Publication

- [ ] Le fichier `.env` est dans `.gitignore`
- [ ] Le README.md est à jour
- [ ] Tous les fichiers nécessaires sont commités
- [ ] Le code fonctionne en local
- [ ] Les dépendances sont listées dans `package.json`
- [ ] La documentation est claire

---

**Votre projet est maintenant prêt pour GitHub ! 🚀**