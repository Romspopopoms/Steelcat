# Configuration Stripe Webhook & Emails

## 📧 Configuration des Emails avec Ionos

### 1. Récupérer le mot de passe de votre email

1. Connectez-vous à votre compte Ionos
2. Allez dans la section "Email"
3. Notez le mot de passe de l'adresse `sav@steel-cat.com`

### 2. Mettre à jour les variables d'environnement

#### Dans le fichier `.env` local :

Le fichier est déjà configuré avec :
```env
SMTP_HOST="smtp.ionos.fr"
SMTP_PORT="587"
SMTP_USER="sav@steel-cat.com"
SMTP_PASS="VOTRE_MOT_DE_PASSE_EMAIL_ICI"  # ⚠️ À REMPLACER
SMTP_FROM="SteelCat <sav@steel-cat.com>"
```

Remplacez `VOTRE_MOT_DE_PASSE_EMAIL_ICI` par le vrai mot de passe.

#### Dans Vercel (Production) :

1. Allez sur https://vercel.com/romains-projects-eb25d22d/steelcat-ecommerce/settings/environment-variables
2. Ajoutez les variables suivantes :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `SMTP_HOST` | `smtp.ionos.fr` | Production, Preview |
| `SMTP_PORT` | `587` | Production, Preview |
| `SMTP_USER` | `sav@steel-cat.com` | Production, Preview |
| `SMTP_PASS` | `[votre mot de passe]` | Production, Preview |
| `SMTP_FROM` | `SteelCat <sav@steel-cat.com>` | Production, Preview |

3. Cliquez sur **Save** pour chaque variable

---

## 🔐 Configuration du Webhook Stripe

### 1. Créer le webhook sur Stripe

1. **Connectez-vous à Stripe** : https://dashboard.stripe.com/
2. **Allez dans Developers → Webhooks**
3. **Cliquez sur "Add endpoint"**
4. **Configurez l'endpoint** :
   - **URL** : `https://steel-cat.com/api/webhooks/stripe`
   - **Description** : `SteelCat Production Webhook`
   - **Events to send** : Sélectionnez uniquement :
     - ✅ `checkout.session.completed`
   - **Version de l'API** : Laissez la dernière version

5. **Cliquez sur "Add endpoint"**

### 2. Récupérer le Webhook Secret

1. Une fois le webhook créé, cliquez dessus
2. Cliquez sur **"Reveal"** dans la section "Signing secret"
3. Copiez la clé qui commence par `whsec_...`

### 3. Configurer le Webhook Secret

#### Dans le fichier `.env` local :

Remplacez la ligne :
```env
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

Par :
```env
STRIPE_WEBHOOK_SECRET="whsec_VOTRE_VRAI_SECRET_ICI"
```

#### Dans Vercel (Production) :

1. Allez sur https://vercel.com/romains-projects-eb25d22d/steelcat-ecommerce/settings/environment-variables
2. Trouvez la variable `STRIPE_WEBHOOK_SECRET`
3. Cliquez sur les trois points → **Edit**
4. Remplacez par votre nouveau secret `whsec_...`
5. Cliquez sur **Save**

---

## ✅ Vérifier que tout fonctionne

### Test du Webhook Stripe

1. Allez sur https://dashboard.stripe.com/test/webhooks
2. Sélectionnez votre webhook
3. Cliquez sur "Send test webhook"
4. Sélectionnez `checkout.session.completed`
5. Cliquez sur "Send test webhook"
6. Vérifiez que le statut est **200 OK** ✅

### Test des Emails

Pour tester l'envoi d'emails, vous pouvez :
1. Faire une commande de test sur le site
2. Ou utiliser l'API de test (voir ci-dessous)

---

## 🚀 Déploiement

Après avoir configuré toutes les variables :

1. **Dans Vercel** : Le site se redéploiera automatiquement
2. **Vérifiez les logs** :
   - Allez sur https://vercel.com/romains-projects-eb25d22d/steelcat-ecommerce/deployments
   - Cliquez sur le dernier déploiement
   - Vérifiez qu'il n'y a pas d'erreurs

---

## 📝 Variables d'environnement complètes pour Vercel

Voici toutes les variables à configurer dans Vercel :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de la base de données Supabase | `postgres://...` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe | `whsec_...` |
| `SMTP_HOST` | Serveur SMTP Ionos | `smtp.ionos.fr` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USER` | Email d'envoi | `sav@steel-cat.com` |
| `SMTP_PASS` | Mot de passe email | `[votre mot de passe]` |
| `SMTP_FROM` | Nom et email d'expéditeur | `SteelCat <sav@steel-cat.com>` |
| `JWT_SECRET` | Secret pour les tokens JWT | `[un secret aléatoire]` |

---

## 🎨 Templates d'Email

Les emails ont été mis à jour avec un design professionnel incluant :

✅ **Email de confirmation de commande** :
- Header noir avec gradient
- Badge de confirmation vert
- Tableau des produits commandés
- Informations de livraison
- Footer avec liens vers le site

✅ **Email de disponibilité de précommande** :
- Header bleu avec emoji
- Liste des produits disponibles
- Informations sur l'expédition
- Footer avec liens

---

## ❓ Aide

Si vous rencontrez des problèmes :

1. **Vérifiez les logs Vercel** pour voir les erreurs
2. **Testez le webhook** sur Stripe Dashboard
3. **Vérifiez que toutes les variables** sont bien configurées dans Vercel
4. **Vérifiez les credentials Ionos** (email/mot de passe)

---

## 🔒 Sécurité

⚠️ **IMPORTANT** :
- Ne commitez JAMAIS les fichiers `.env` dans Git
- Régénérez la clé Stripe qui a été exposée
- Changez le `JWT_SECRET` en production avec une valeur aléatoire sécurisée
