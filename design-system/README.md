# Design System CLICOM

## Tokens & thèmes
- Les tokens de couleur, radius, ombres et motion sont centralisés dans `styles/tokens.css`.
- Le thème sombre est activable via l’attribut `data-theme="dark"` sur `<html>`.
- Préférence utilisateur : `prefers-color-scheme` est respecté par défaut.

## Composants clés
- **Navigation** : sticky, toggle mobile, mode sombre.
- **Hero** : hiérarchie typographique + CTA primaire/secondaire.
- **Pricing** : tableau desktop + cartes mobile, badge recommandé, switch mensuel.
- **Preuves** : témoignages contrôlés, KPI animés, logos.
- **Media** : galerie avec modal accessible et focus trap.
- **Contact** : formulaire validé côté client, focus et messages clairs.

## Accessibilité
- Contrastes AA minimum pour texte principal.
- Focus visibles et états clavier.
- Respect de `prefers-reduced-motion`.
