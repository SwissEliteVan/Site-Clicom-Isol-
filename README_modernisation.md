# Modernisation CLICOM

## Objectifs
- Rehausser la perception premium sans perte de contenu ni SEO.
- Améliorer l’accessibilité WCAG 2.1 AA et la performance perçue.
- Introduire un mode sombre, un pricing dynamique et des micro-interactions sobres.

## Principales améliorations
- **Système de design** : tokens centralisés dans `styles/tokens.css` (clair/sombre).
- **Navigation** : CTA aligné, toggle mobile, thème clair/sombre persistant.
- **Hero** : hiérarchie visuelle renforcée et cartes d’impact.
- **Tarifs** : switch unique/mensuel avec mises à jour de prix et mentions.
- **Accessibilité** : focus visibles, skip links, réduction d’animations respectée.
- **SEO** : canonical + JSON-LD WebSite/BreadcrumbList.

## Maintenance
- Ajuster les couleurs via les variables dans `styles/tokens.css`.
- Les cartes pricing utilisent `data-price-unique` / `data-price-monthly`.
- Le toggle thème applique `data-theme` sur `<html>`.

## À poursuivre
- Ajouter des tests automatisés (axe/Playwright) si un environnement Node est prévu.
- Brancher une vraie API de contact et un stockage de leads sécurisé.
