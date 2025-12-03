# Déploiement sur Vercel

Guide opérationnel pour passer de l'environnement local à une production Vercel avec PostgreSQL.

## 1. Préparer Prisma pour deux environnements

### Fichier `prisma/schema.prisma`
- Le datasource fixe désormais `provider = "postgresql"` avec `url = env("DATABASE_URL")` pour rester compatible Vercel.
- En développement comme en production, utilisez une URL PostgreSQL (locale ou distante) via `DATABASE_URL`.

### Génération et migrations
- Local (PostgreSQL, ex. Docker ou Supabase) :
  ```bash
  npm install
  npx prisma generate
  npx prisma migrate dev
  npm run dev
  ```
- Production (PostgreSQL) :
  - Les migrations existantes sont déployées avec :
    ```bash
    npx prisma migrate deploy
    ```
  - Ce script est disponible via `npm run prisma:migrate:deploy` et peut être exécuté depuis un terminal Vercel ou un job externe.

### Bonnes pratiques Prisma sur Vercel
- Le client Prisma est instancié une seule fois via `src/lib/prisma.ts` (usage de la variable globale en dev, nouveau client en prod) pour éviter les fuites de connexions.
- Ne pas déployer de routes Edge qui utilisent Prisma ; rester sur le runtime Node (valeur par défaut du routeur App).

## 2. Variables d'environnement à renseigner sur Vercel
Ajoutez-les dans **Project Settings > Environment Variables** :

| Nom | Description | Exemple |
| --- | ----------- | ------- |
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:password@host:5432/dbname` |
| `NEXT_PUBLIC_APP_URL` | URL publique du site | `https://maconpro.vercel.app` |
| `AUTH_SECRET` | Secret pour la signature des sessions | chaîne aléatoire longue |

> Astuce : créez au moins l'environnement **Production**. Dupliquez les variables pour **Preview** si vous déployez des branches.

## 3. Configuration du projet
- `package.json` contient les scripts attendus par Vercel : `build` (`next build`) et `start` (`next start`).
- `postinstall` exécute `prisma generate` pour disposer du client Prisma lors du build.
- La version Node recommandée est `>=18.18.0` (déclarée dans `engines`).
- Aucun `vercel.json` spécifique n'est requis : le preset **Next.js** suffit.

## 4. Guide pas-à-pas

### A. Préparation locale
1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Générer Prisma et appliquer les migrations sur votre base PostgreSQL locale ou distante :
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
3. Vérifier le build Next.js :
   ```bash
   npm run build
   ```

### B. Mise en place du dépôt GitHub
1. Initialiser Git si besoin :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Créer un dépôt GitHub et lier la remote :
   ```bash
   git remote add origin git@github.com:VOTRE_COMPTE/maconpro-factures.git
   git push -u origin main
   ```

### C. Déploiement Vercel
1. Se connecter sur [vercel.com](https://vercel.com) et cliquer sur **New Project**.
2. Importer le dépôt GitHub `maconpro-factures`.
3. Vérifier les options détectées :
   - Framework Preset : **Next.js**
   - Build Command : `next build`
   - Output Directory : `.next`
4. Avant de lancer le déploiement, ajouter les variables d'environnement listées ci-dessus dans **Settings > Environment Variables** (au minimum en Production).
5. Lancer le déploiement. Vercel build et publie automatiquement.

### D. Base de données PostgreSQL en production
1. Créer une base (Supabase, Vercel Postgres ou équivalent) et récupérer l'URL `DATABASE_URL`.
2. Coller cette URL dans les variables d'environnement Vercel.
3. Appliquer les migrations sur la base distante après le premier déploiement :
   - Option simple : ouvrir un terminal Vercel (ou utiliser `vercel env pull` localement) et exécuter :
     ```bash
     npm run prisma:migrate:deploy
     ```
   - Alternative : déclencher ce script depuis un job CI/CD pointant sur la même base.

## 5. Gestion des erreurs et debug
- **Logs de build** : visibles dans Vercel > Project > Deployments > onglet **Build Logs**.
- **Logs runtime** : onglet **Functions / Logs** pour les routes serverless.
- **Erreurs courantes** :
  - `DATABASE_URL` manquant ou incorrect → vérifier l'URL et les variables sur Vercel.
  - Migrations non appliquées → exécuter `npm run prisma:migrate:deploy` sur la base de prod.
  - `AUTH_SECRET` absent → ajouter une chaîne aléatoire (32+ caractères) dans les variables d'env.
- Pour reproduire en local avec PostgreSQL : définir `DATABASE_URL` vers votre instance locale (ex. `postgresql://postgres:postgres@localhost:5432/maconpro`) puis lancer `npx prisma migrate dev`.

## 6. Check-list rapide avant prod
- [ ] Variables d'environnement ajoutées sur Vercel (Production + éventuellement Preview).
- [ ] Base PostgreSQL créée et accessible.
- [ ] Migrations appliquées (`npm run prisma:migrate:deploy`).
- [ ] Build local OK (`npm run build`).
- [ ] Secrets (`AUTH_SECRET`) générés et non committés.

