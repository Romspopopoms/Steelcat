# 🎉 Système de Précommandes SteelCat - Documentation

## 📦 Fonctionnalités Implémentées

### ✅ Backend & Base de Données
- **Base de données Supabase** configurée avec Prisma
- **4 modèles** : Product, Order, OrderItem, Admin
- **3 variantes SteelCat** créées avec prix promo (125€ → 29.90€, 49.90€, 69.90€)
- Gestion automatique du stock et des compteurs de promo

### ✅ Système de Précommandes
- **Statuts de produits** : En stock, Précommande, Rupture de stock
- **Dates de disponibilité** affichées sur les produits en précommande
- **Badges visuels** sur la page produit et dans le panier
- **Gestion intelligente** des commandes mixtes (stock + précommande)

### ✅ Promotions Limitées
- **Prix barrés** : 125€ → 99.90€ (exemple)
- **Compteur de places** : "Plus que X places restantes" (limite : 20)
- **Désactivation automatique** de la promo quand la limite est atteinte
- Mise à jour du compteur après chaque paiement validé

### ✅ Paiements & Commandes
- **Stripe Checkout** intégré
- **Webhook Stripe** pour confirmer les paiements
- Création automatique des commandes en base de données
- **Mise à jour du stock** après paiement confirmé
- Historique complet des commandes

### ✅ Notifications Email
- **Email de confirmation** de commande (HTML professionnel)
- **Email de disponibilité** pour les précommandes
- Templates personnalisés avec détails de commande
- Envoi automatique via webhook et actions admin

### ✅ Tableau de Bord Admin
- **Authentification sécurisée** (JWT + cookies HTTP-only)
- **Dashboard** avec statistiques (CA, commandes, stock faible)
- **Gestion des produits** : modifier stock, prix, statuts, dates de dispo
- **Gestion des commandes** : voir détails, changer statuts
- **Suivi des précommandes** : notifier clients, gérer disponibilités
- Navigation responsive avec sidebar

---

## 🔧 Configuration

### 1. Variables d'Environnement

Le fichier `.env` contient déjà vos configurations Supabase. Vous devez compléter :

```env
# SMTP - Configurez votre serveur d'envoi d'emails
SMTP_HOST="smtp.gmail.com"           # Ou votre serveur SMTP
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"    # Votre email
SMTP_PASS="votre-mot-de-passe-app"   # Mot de passe d'application Gmail
SMTP_FROM="SteelCat <votre-email@gmail.com>"

# Stripe Webhook (après déploiement ou avec Stripe CLI)
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# JWT Secret (générez un secret fort en production)
JWT_SECRET="votre-secret-jwt-super-securise-changez-moi-en-production"

# Next.js Base URL (pour Stripe)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # En local
# NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"  # En production
```

### 2. Configuration SMTP Gmail

Si vous utilisez Gmail :

1. Allez sur https://myaccount.google.com/security
2. Activez la "Validation en deux étapes"
3. Allez dans "Mots de passe des applications"
4. Créez un mot de passe pour "Mail" / "Autre"
5. Utilisez ce mot de passe dans `SMTP_PASS`

### 3. Configuration Stripe Webhook

#### En local (développement) :

```bash
# Installer Stripe CLI
npm install -g stripe

# Se connecter
stripe login

# Lancer le webhook en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copiez le webhook secret qui s'affiche et mettez-le dans `STRIPE_WEBHOOK_SECRET`.

#### En production :

1. Allez sur https://dashboard.stripe.com/webhooks
2. Créez un endpoint : `https://votre-domaine.com/api/webhooks/stripe`
3. Sélectionnez l'événement : `checkout.session.completed`
4. Copiez le webhook secret dans votre `.env`

---

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur http://localhost:3000

---

## 👤 Accès Admin

### Connexion
- **URL** : http://localhost:3000/admin/login
- **Email** : admin@steelcat.fr
- **Mot de passe** : admin123

⚠️ **IMPORTANT** : Changez ce mot de passe par défaut !

### Changer le mot de passe admin

```bash
# Dans un terminal Node.js ou via script
node
> const bcrypt = require('bcryptjs');
> const hash = bcrypt.hashSync('VotreNouveauMotDePasse', 10);
> console.log(hash);
```

Puis mettez à jour dans la base de données :

```sql
UPDATE "Admin"
SET password = 'hash_généré_ci-dessus'
WHERE email = 'admin@steelcat.fr';
```

---

## 📝 Utilisation du Système

### Créer une Précommande

1. **Admin Dashboard** → **Produits**
2. Cliquez sur "Modifier" pour un produit
3. Changez le **Statut** en "Précommande"
4. Définissez une **Date de disponibilité estimée**
5. Sauvegardez

Le produit affichera maintenant :
- Badge "Précommande" sur la page produit
- Date de disponibilité
- Message personnalisé dans le panier

### Gérer les Promotions

1. **Admin Dashboard** → **Produits**
2. Cliquez sur "Modifier"
3. Cochez "Activer la promotion limitée"
4. Définissez la **Limite de promotion** (ex: 20)
5. Définissez le **Prix actuel** (prix promo)

Le système affichera :
- Prix barré (prix original)
- "Plus que X places restantes"
- Désactivation auto quand limite atteinte

### Notifier les Clients de Précommandes

1. **Admin Dashboard** → **Précommandes**
2. Trouvez la précommande à traiter
3. Cliquez sur "Marquer disponible"

Actions automatiques :
- ✉️ Email de notification envoyé au client
- Statut passé à "En cours de traitement"
- Flag `notificationSent` à true

### Gérer les Commandes

1. **Admin Dashboard** → **Commandes**
2. Cliquez sur "Détails" pour voir une commande
3. Changez le statut :
   - **Payée** : Paiement confirmé
   - **En cours** : En préparation
   - **Expédiée** : Envoyée au client
   - **Livrée** : Réceptionnée
   - **Annulée** : Commande annulée

---

## 🧪 Tester le Flux Complet

### Test d'une Précommande

1. Configurez un produit en précommande (voir ci-dessus)
2. Ajoutez-le au panier depuis la page produit
3. Vérifiez que le badge "Précommande" apparaît dans le panier
4. Passez la commande (checkout)
5. Payez avec la carte de test Stripe : `4242 4242 4242 4242`
6. Vérifiez la réception de l'email de confirmation
7. Dans l'admin, allez sur "Précommandes"
8. Marquez la commande comme disponible
9. Vérifiez la réception de l'email de notification de disponibilité

### Test d'une Promo Limitée

1. Configurez une promo avec limite de 20 unités
2. Vérifiez l'affichage du compteur sur la page produit
3. Simulez des achats
4. Vérifiez que le compteur diminue après paiement
5. Vérifiez la désactivation auto à 20 ventes

---

## 📊 Structure de la Base de Données

### Product
- Informations produit (nom, poids, description)
- **Stock** et **statut** (IN_STOCK, PRE_ORDER, OUT_OF_STOCK)
- Prix original et actuel
- **Promo** : hasPromo, promoLimit, promoSold
- **Précommande** : availableDate, preOrderCount
- Images

### Order
- Numéro de commande unique
- Informations client complètes
- **Statut** : PENDING, PAID, PRE_ORDER, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- Montants (subtotal, shipping, total)
- **Stripe** : sessionId, paymentIntent
- **Précommande** : isPreOrder, estimatedDelivery, notificationSent
- Dates : createdAt, paidAt, shippedAt, deliveredAt

### OrderItem
- Lien Order ↔ Product
- Quantités et prix au moment de l'achat
- Snapshot des infos produit

### Admin
- Email, nom, mot de passe (bcrypt)
- Permissions (gestion produits, commandes, analytics)

---

## 🔐 Sécurité

### ✅ Implémenté
- Hachage des mots de passe avec bcryptjs
- JWT avec cookies HTTP-only
- Authentification requise pour toutes les routes admin
- Validation des données avec Zod
- Protection CSRF via sameSite cookies

### ⚠️ À faire en production
- Changer tous les secrets par défaut
- Activer HTTPS obligatoire
- Configurer des limites de rate limiting
- Ajouter un système de logs d'audit
- Implémenter 2FA pour l'admin

---

## 🎨 Personnalisation

### Modifier les Produits Initiaux

Éditez `prisma/seed.ts` et relancez :

```bash
npm run db:seed
```

### Modifier les Templates d'Email

Les templates sont dans `src/lib/email.ts` :
- `sendOrderConfirmationEmail()` : Email de confirmation
- `sendAvailabilityNotificationEmail()` : Email de dispo

### Ajouter des Champs Produit

1. Modifiez `prisma/schema.prisma`
2. Créez une migration : `npx prisma migrate dev --name add_field`
3. Mettez à jour les interfaces TypeScript
4. Mettez à jour les pages admin et frontend

---

## 🐛 Dépannage

### Les emails ne s'envoient pas
- Vérifiez les credentials SMTP dans `.env`
- Pour Gmail, utilisez un mot de passe d'application
- Vérifiez les logs console : `console.log` dans `src/lib/email.ts`

### Le webhook Stripe ne fonctionne pas
- En local : lancez `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
- Vérifiez les logs : Dashboard Stripe → Webhooks → Logs

### Erreurs de connexion à la base de données
- Vérifiez `DATABASE_URL` dans `.env`
- Testez la connexion : `npx prisma studio`
- Régénérez le client : `npx prisma generate`

### Les stocks ne se mettent pas à jour
- Le webhook Stripe doit être configuré
- Les paiements doivent être confirmés (pas en mode test échoué)
- Vérifiez les logs du webhook dans la console

---

## 📈 Améliorations Futures

### À court terme
- [ ] Export CSV des commandes
- [ ] Recherche/filtres avancés dans l'admin
- [ ] Tableau de bord avec graphiques (Chart.js)
- [ ] Gestion des retours/remboursements

### À moyen terme
- [ ] Multi-produits (pas seulement SteelCat)
- [ ] Gestion des fournisseurs
- [ ] Système de bons de réduction
- [ ] Programme de fidélité

### À long terme
- [ ] Application mobile admin
- [ ] Intégration avec des plateformes de livraison
- [ ] Analytics avancées
- [ ] Multi-langue

---

## 📞 Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Consultez les logs console
3. Vérifiez le dashboard Stripe pour les paiements
4. Utilisez Prisma Studio pour inspecter la BDD : `npx prisma studio`

---

## 🎊 Récapitulatif

Vous avez maintenant un **système complet de précommandes** avec :
- ✅ Gestion des stocks en temps réel
- ✅ Promotions limitées avec compteur
- ✅ Paiements Stripe sécurisés
- ✅ Emails automatiques personnalisés
- ✅ Tableau de bord admin complet
- ✅ Suivi des précommandes
- ✅ Base de données robuste (Supabase)

**Bon e-commerce ! 🚀**
