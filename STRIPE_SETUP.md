# Configuration Stripe pour SteelCat

## 🚀 Installation

Stripe est déjà installé dans le projet. Si vous rencontrez des problèmes, réinstallez les dépendances :

```bash
npm install
```

## 🔑 Obtenir vos clés API Stripe

### 1. Créer un compte Stripe

Si vous n'avez pas encore de compte Stripe :
1. Rendez-vous sur https://dashboard.stripe.com/register
2. Créez votre compte (gratuit)
3. Activez le mode **Test** (en haut à droite du dashboard)

### 2. Récupérer vos clés API

1. Connectez-vous à votre Dashboard Stripe
2. Activez le **mode Test** (toggle en haut à droite)
3. Allez dans **Développeurs > Clés API** : https://dashboard.stripe.com/test/apikeys
4. Vous verrez deux clés :
   - **Clé publiable** (commence par `pk_test_`)
   - **Clé secrète** (commence par `sk_test_` - à garder confidentielle !)

### 3. Configurer le projet

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Ajoutez vos clés :

```env
# Stripe Keys (Mode Test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici

# URL de base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Sauvegardez** le fichier `.env.local`

### 4. Redémarrer le serveur

```bash
npm run dev
```

## ✅ Tester le paiement

### Mode Test Stripe

En mode test, utilisez ces cartes bancaires de test :

| Carte | Numéro | Résultat |
|-------|--------|----------|
| **Succès** | `4242 4242 4242 4242` | Paiement réussi ✅ |
| **Refusé** | `4000 0000 0000 0002` | Paiement refusé ❌ |
| **3D Secure** | `4000 0027 6000 3184` | Nécessite authentification 🔐 |

**Autres informations pour tester :**
- Date d'expiration : n'importe quelle date future (ex: `12/25`)
- CVV : n'importe quel 3 chiffres (ex: `123`)
- Code postal : n'importe quel code (ex: `75001`)

### Flux de paiement complet

1. Allez sur http://localhost:3000/produit
2. Sélectionnez un produit et "Ajouter au panier"
3. Cliquez sur l'icône panier et "Passer la commande"
4. Remplissez le formulaire de livraison
5. Cliquez sur "Procéder au paiement sécurisé"
6. Vous serez redirigé vers la page Stripe Checkout
7. Utilisez la carte test `4242 4242 4242 4242`
8. Après validation, vous serez redirigé vers la page de confirmation

## 📊 Voir les paiements dans le Dashboard

1. Allez sur https://dashboard.stripe.com/test/payments
2. Vous verrez tous les paiements test effectués
3. Cliquez sur un paiement pour voir les détails

## 🔄 Webhooks (optionnel - pour production)

Pour recevoir des notifications en temps réel (commande payée, remboursement, etc.) :

### En développement local

1. Installez Stripe CLI : https://stripe.com/docs/stripe-cli
2. Lancez :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks
   ```
3. Stripe CLI vous donnera un **signing secret** (commence par `whsec_`)
4. Ajoutez-le dans `.env.local` :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
   ```

### En production

1. Allez dans **Développeurs > Webhooks** : https://dashboard.stripe.com/webhooks
2. Cliquez sur "Ajouter un endpoint"
3. URL : `https://votre-domaine.com/api/webhooks`
4. Événements à écouter :
   - `checkout.session.completed` - Paiement réussi
   - `payment_intent.payment_failed` - Paiement échoué
   - `charge.refunded` - Remboursement

## 🌐 Passer en mode Production

⚠️ **Ne passez en production qu'après avoir testé complètement !**

### 1. Activer le mode Production

1. Dans le Dashboard Stripe, désactivez le mode Test
2. Allez dans **Développeurs > Clés API**
3. Récupérez vos clés de **Production** (commencent par `pk_live_` et `sk_live_`)

### 2. Mettre à jour les variables d'environnement

Mettez à jour `.env.local` (ou variables d'environnement de votre hébergeur) :

```env
# Stripe Keys (PRODUCTION)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete

# URL de production
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
```

### 3. Vérification de sécurité

- ✅ Ne jamais commiter les clés dans Git (`.env.local` est dans `.gitignore`)
- ✅ Utiliser des variables d'environnement sur votre hébergeur (Vercel, Netlify, etc.)
- ✅ Activer l'authentification 3D Secure (activé par défaut)
- ✅ Configurer les webhooks pour tracer les paiements

## 🛠 Dépannage

### Erreur "Stripe publishable key not found"

➡️ Vérifiez que `.env.local` contient bien `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
➡️ Redémarrez le serveur : `npm run dev`

### Erreur "Invalid API key"

➡️ Vérifiez que vous utilisez bien les clés du **mode Test** (commencent par `pk_test_` et `sk_test_`)
➡️ Pas d'espaces avant/après les clés dans `.env.local`

### La redirection vers Stripe ne fonctionne pas

➡️ Vérifiez la console du navigateur pour les erreurs
➡️ Vérifiez que `NEXT_PUBLIC_BASE_URL=http://localhost:3000` dans `.env.local`

### Le paiement réussit mais pas de redirection

➡️ Vérifiez que l'URL de success dans l'API route est correcte
➡️ Vérifiez que les URLs success/cancel sont bien configurées

## 📚 Ressources

- Documentation Stripe : https://stripe.com/docs
- Dashboard Stripe : https://dashboard.stripe.com
- Cartes de test : https://stripe.com/docs/testing
- Stripe CLI : https://stripe.com/docs/stripe-cli

## 🆘 Support

En cas de problème :
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs Stripe : https://dashboard.stripe.com/test/logs
3. Consultez la doc Stripe : https://stripe.com/docs

---

**Note** : Ce guide utilise le mode Test de Stripe. Aucun vrai argent ne sera débité lors des tests.
