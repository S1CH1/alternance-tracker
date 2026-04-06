# Alternance Tracker

Application web de suivi de candidatures d'alternance.

## Stack technique

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- Prisma + SQLite
- Framer Motion
- Lucide React

## Port

- **3001** (http://192.168.50.2:3001)

## Démarrage (dev)

```bash
docker compose up -d --build
```

## Démarrage (prod)

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Arrêt

```bash
docker compose down
```

## Base de données

- Dev : `./data/dev.db`
- Prod : `./data/prod.db`
- Studio Prisma : `npm run db:studio` (port 5555)

## Fichiers uploadés

Stockés dans `./uploads/` (gitignore, monté en volume Docker).

## Fonctionnalités

- Dashboard avec stats (total, en cours, entretiens, acceptées)
- Filtres par statut
- Ajout de candidature avec upload PDF (CV, LM, offre)
- Détail avec prévisualisation PDF inline
- Changement de statut inline
- Notes éditables par candidature
