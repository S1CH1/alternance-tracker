# MEMORY — alternance-tracker

## Création initiale — 2026-04-03

### Ce qui a été fait
- Création complète de l'application depuis zéro
- Stack : Next.js 15 App Router + TypeScript + Tailwind CSS v4 + Prisma SQLite + Framer Motion + Lucide React
- Design system dark/cyberpunk avec CSS variables (--bg, --cyan, --purple, etc.)
- Port 3001 (portfolio sur 3000)

### Fichiers créés
- `app/globals.css` — design system CSS variables
- `app/layout.tsx` — layout global avec Navbar
- `app/page.tsx` — Dashboard avec stats, filtres, liste candidatures
- `app/nouvelle/page.tsx` — formulaire ajout candidature + upload fichiers
- `app/candidature/[id]/page.tsx` — détail avec prévisualisation PDF inline
- `app/api/candidatures/route.ts` — GET liste, POST création
- `app/api/candidatures/[id]/route.ts` — GET, PATCH, DELETE par id
- `app/api/upload/route.ts` — upload PDF vers /app/uploads
- `app/api/files/[...path]/route.ts` — servir les fichiers uploadés
- `components/Navbar.tsx` — navigation avec branding S1CH1_
- `components/StatCard.tsx` — card statistique animée Framer Motion
- `components/CandidatureCard.tsx` — ligne candidature avec actions
- `components/StatusBadge.tsx` — badge coloré par statut
- `components/FileUpload.tsx` — zone drag & drop upload PDF
- `lib/prisma.ts` — singleton Prisma client
- `prisma/schema.prisma` — modèle Candidature
- `Dockerfile`, `Dockerfile.prod`, `docker-compose.yml`, `docker-compose.prod.yml`

### Décisions techniques
- SQLite via Prisma (simple, pas de container DB séparé)
- Fichiers uploadés dans `/app/uploads` (volume Docker persistant)
- Sécurité upload : vérification type PDF, taille max 10 MB, protection traversée répertoire
- `npm run dev` avec flag `-p 3001` pour éviter conflit avec portfolio

### Mise à jour 2026-04-08

#### Nouvelles fonctionnalités ajoutées
- **Entretiens** : modèle Prisma `Entretien` (date, type, notes, résultat) lié à `Candidature` par `candidatureId` avec cascade delete
- API : `GET/POST /api/candidatures/[id]/entretiens`, `PATCH/DELETE /api/entretiens/[id]`
- UI : section Entretiens dans la page détail candidature — ajout, affichage, résultat (En attente/Positif/Négatif), suppression
- Ajout d'un entretien passe automatiquement le statut candidature à "Entretien" si pas déjà avancé
- **Stat "Refusées"** ajoutée dans le dashboard (5 stats : Total, En cours, Entretiens, Acceptées, Refusées)
- **Responsive** : CSS classes `.stats-row`, `.content-cols`, `.cand-row-inner`, `.detail-header-row` + breakpoints 960px/640px dans globals.css
- **Navbar** : hamburger menu sur mobile (`<640px`) avec panel déroulant

### TODO
- [ ] Pagination si beaucoup de candidatures
- [ ] Export CSV/Excel
- [ ] Rappels/alertes par date de relance
- [ ] Statistiques avancées (graphiques)
