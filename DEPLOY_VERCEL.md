# 🚀 Guide de Déploiement Vercel - VeriCertis Frontend

## ✅ Préparation Effectuée

### Fichiers de Configuration
- ✅ `.env.production` - Variables pour production (Render backend)
- ✅ `.env.local` - Variables pour développement local
- ✅ `.env.example` - Template pour nouveaux développeurs
- ✅ `vercel.json` - Configuration Vercel avec rewrites API

### URL Backend Configurée
```
https://vericertis-backend.onrender.com/api/v1
```

---

## 🌐 Déploiement sur Vercel

### Méthode 1 : Via le Dashboard Vercel (Recommandé)

#### 1. Créer un compte Vercel
- Allez sur https://vercel.com
- Connectez-vous avec GitHub

#### 2. Importer le Projet
- Cliquez sur "Add New..." → "Project"
- Sélectionnez votre repo `VerifCertif_frontend`
- Vercel détectera automatiquement Next.js

#### 3. Configurer le Projet
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build (auto-détecté)
Output Directory: .next (auto-détecté)
Install Command: npm install (auto-détecté)
```

#### 4. Variables d'Environnement
Vercel chargera automatiquement `.env.production`, mais vous pouvez vérifier/ajouter :

```
NEXT_PUBLIC_API_URL = https://vericertis-backend.onrender.com/api/v1
NEXT_PUBLIC_APP_NAME = VeriCertis
NEXT_PUBLIC_ENV = production
```

#### 5. Déployer
- Cliquez sur "Deploy"
- Attendez 2-3 minutes
- Votre app sera disponible sur `https://verif-certif-frontend.vercel.app`

---

### Méthode 2 : Via CLI Vercel

#### 1. Installer Vercel CLI
```bash
npm install -g vercel
```

#### 2. Se connecter
```bash
vercel login
```

#### 3. Déployer
```bash
cd C:\Mes_Dossiers\Memoire\VerifCertif_frontend
vercel
```

#### 4. Configuration Interactive
```
? Set up and deploy? [Y/n] y
? Which scope? Votre compte
? Link to existing project? [y/N] n
? What's your project's name? vericertis-frontend
? In which directory is your code located? ./
```

#### 5. Production Deploy
```bash
vercel --prod
```

---

## 🔧 Configuration Post-Déploiement

### 1. Configurer le Domaine Personnalisé (Optionnel)
- Dashboard Vercel → Project Settings → Domains
- Ajouter : `vericertis.com` ou votre domaine

### 2. Configurer CORS sur le Backend
Ajoutez votre domaine Vercel dans le backend Laravel :

**Sur Render (Backend) :**
1. Dashboard Render → veriCertis-backend → Environment
2. Ajoutez :
   ```
   FRONTEND_URL=https://votre-app.vercel.app
   ```

**Dans le code Laravel (config/cors.php) :**
```php
'allowed_origins' => [
    'http://localhost:3000',
    'https://votre-app.vercel.app',
],
```

### 3. Mettre à jour les URLs de Redirection
Si vous utilisez l'authentification OAuth, mettez à jour les callback URLs.

---

## ✅ Vérifications Post-Déploiement

### 1. Test de l'API
Ouvrez la console du navigateur sur votre app Vercel :
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
// Devrait afficher: https://vericertis-backend.onrender.com/api/v1
```

### 2. Test de Connexion
```bash
# Testez depuis votre navigateur
https://votre-app.vercel.app/login

# Ouvrez DevTools → Network
# Vérifiez que les requêtes vont vers Render
```

### 3. Test API Direct
```bash
curl https://vericertis-backend.onrender.com/api/v1/offres
```

---

## 🐛 Résolution des Problèmes

### Erreur CORS
**Symptôme :** `Access-Control-Allow-Origin` error dans la console

**Solution :**
1. Vérifiez `config/cors.php` sur le backend
2. Redéployez le backend après modification
3. Videz le cache du navigateur

### Build Failed
**Symptôme :** Erreur pendant le build sur Vercel

**Solution :**
```bash
# Testez localement d'abord
npm run build

# Si ça marche, poussez et redéployez
git add .
git commit -m "Fix build"
git push
```

### API Timeout
**Symptôme :** Requests timeout après 30s

**Render Free Tier :** L'API "dort" après 15 min d'inactivité
- Premier accès = ~30s de réveil
- Solution : Passez à un plan payant ou acceptez le délai

### Variables d'Environnement Non Chargées
**Solution :**
```bash
# Vérifiez que les variables sont bien définies
vercel env ls

# Ajoutez manuellement si besoin
vercel env add NEXT_PUBLIC_API_URL production
```

---

## 🔄 Déploiement Automatique

### Configuration CI/CD
Vercel déploie automatiquement :
- **Chaque push sur `main`** → Production
- **Chaque pull request** → Preview deployment
- **Chaque branch** → Branch deployment

### Hooks de Déploiement
Dans `vercel.json`, ajoutez des hooks si nécessaire :
```json
{
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

---

## 📊 Monitoring

### Analytics Vercel (Gratuit)
- Dashboard → Votre projet → Analytics
- Voit : Trafic, Erreurs, Performance

### Logs en Temps Réel
```bash
vercel logs votre-app.vercel.app
```

---

## 🚀 Optimisations

### 1. Edge Functions
Vercel déploie automatiquement Next.js sur l'Edge (CDN global)

### 2. Image Optimization
Next.js Image component optimisé automatiquement

### 3. Caching
```javascript
// Dans vos pages API
export const config = {
  runtime: 'edge',
}
```

---

## 📝 Commandes Utiles

### Développement Local avec Env Production
```bash
# Tester avec les variables de production
npm run build
npm start
```

### Voir les Déploiements
```bash
vercel ls
```

### Rollback
```bash
vercel rollback
```

### Promouvoir un Preview en Production
```bash
vercel promote <deployment-url>
```

---

## 🔐 Sécurité

### Headers de Sécurité
Déjà configurés dans `vercel.json` :
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block

### HTTPS
- ✅ Automatique sur Vercel
- ✅ Certificat SSL gratuit

### Variables d'Environnement
- ✅ Chiffrées au repos
- ✅ Jamais exposées dans les logs

---

## 📦 Checklist Finale

Avant de déployer, vérifiez :

- [x] `.env.production` créé avec URL Render
- [x] `vercel.json` configuré
- [x] `.gitignore` mis à jour
- [x] CORS configuré sur le backend
- [x] Tests locaux passent (`npm run build`)
- [ ] Commit et push
- [ ] Compte Vercel créé
- [ ] Projet importé sur Vercel
- [ ] Variables d'env vérifiées
- [ ] Premier déploiement lancé
- [ ] Tests post-déploiement effectués

---

## 🎉 C'est Prêt !

Une fois déployé, votre application sera accessible sur :
```
https://votre-app.vercel.app
```

Et communiquera avec le backend sur :
```
https://vericertis-backend.onrender.com
```

**Prochaines Étapes :**
1. Testez toutes les fonctionnalités
2. Configurez un domaine personnalisé
3. Activez les analytics
4. Configurez les alertes d'erreurs

Bon déploiement ! 🚀
