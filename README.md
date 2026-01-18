# CLICOM - Agence Marketing Digital Suisse 🇨🇭

> **"Chez Clicom, on ne fait pas faire, on sait faire."**

Site vitrine haute performance pour l'agence digitale suisse CLICOM, spécialisée en SEO, SEA, Social Media et création de contenu pour PME en Suisse Romande.

---

## 🎯 Objectifs du Projet

- **Performance maximale** : Score Lighthouse visé de 100/100
- **SEO optimisé** : Référencement naturel optimal pour le marché suisse romand
- **Conversion B2B** : Machine à générer des leads qualifiés
- **Design premium** : Identité forte et professionnelle

---

## 🚀 Stack Technique

### Technologies
- **HTML5** : Sémantique parfaite, accessibilité WCAG 2.1
- **CSS3** : Grid/Flexbox, design system, responsive mobile-first
- **JavaScript Vanilla** : Léger, performant, sans dépendances

### Optimisations SEO
- ✅ Balisage Schema.org (LocalBusiness, Service, OfferCatalog)
- ✅ Meta tags OpenGraph & Twitter Cards
- ✅ Hiérarchie H1-H6 optimisée
- ✅ Sitemap.xml et robots.txt
- ✅ URLs canoniques
- ✅ Performance Web Core Vitals

### Hébergement
- **Vercel** : Déploiement automatique, CDN global, HTTPS
- **100% statique** : Pas de backend, temps de chargement minimal

---

## 📁 Structure du Projet

```
Site-Clicom-Isol-/
├── index.html          # Page principale (Landing Page)
├── styles.css          # Design system et responsive
├── script.js           # Interactions JS (menu, formulaire, analytics)
├── vercel.json         # Configuration Vercel (headers, cache)
├── robots.txt          # Instructions pour les crawlers
├── sitemap.xml         # Plan du site pour le SEO
├── .gitignore          # Fichiers à ignorer par Git
└── README.md           # Documentation
```

---

## 🎨 Design System

### Couleurs
- **Bleu primaire** : `#3366ff` (Action, Confiance)
- **Noir premium** : `#1a1a2e` (Autorité, Professionnalisme)
- **Texte** : `#2d3436` (Lisibilité)
- **Arrière-plan** : `#ffffff` et `#f8f9fa`

### Typographie
- **Titres** : Outfit (Google Fonts) - Impactant et moderne
- **Texte** : Inter (Google Fonts) - Confort de lecture

### Breakpoints Responsive
- Mobile : `< 768px`
- Tablet : `768px - 1024px`
- Desktop : `> 1024px`

---

## 🛠️ Fonctionnalités Principales

### Navigation
- Menu sticky avec effet scroll
- Menu hamburger responsive (mobile)
- Smooth scroll vers les sections
- Accessibilité complète (ARIA labels)

### Sections
1. **Hero** : Proposition de valeur, preuve sociale, CTA
2. **Expertises** : 3 piliers (Stratégie, Performance, Content)
3. **Méthode** : Processus 30-60-90 jours
4. **Tarifs** : 3 offres (Starter, Growth, Sur Mesure)
5. **FAQ** : Accordéon SEO-friendly
6. **Contact** : Formulaire validé + coordonnées

### Formulaire de Contact
- Validation en temps réel
- Messages d'erreur personnalisés
- Tracking des conversions (GA4 ready)
- UX optimisée

### Animations
- Fade-in au chargement (Hero)
- Scroll reveal (cartes, timeline)
- Hover effects (boutons, cartes)
- Transitions fluides

### Analytics & Tracking
- Google Analytics 4 prêt à l'emploi
- Tracking des événements :
  - Clics sur CTA
  - Soumission de formulaire
  - Clics téléphone/email
  - Liens externes
- Core Web Vitals monitoring

---

## 📊 Performance & SEO

### Optimisations Performance
- **CSS critique** : Styles inline pour le premier rendu
- **Lazy loading** : Images et backgrounds (IntersectionObserver)
- **Fonts optimisées** : Preconnect pour Google Fonts
- **Cache agressif** : 1 an pour les assets statiques
- **Minification** : Code compressé en production

### Score Lighthouse Visé
- Performance : **100/100**
- Accessibility : **100/100**
- Best Practices : **100/100**
- SEO : **100/100**

### Mots-clés Ciblés
- Agence marketing digital suisse
- SEO Suisse Romande
- SEA Suisse
- Social media marketing Suisse
- Création contenu Genève/Lausanne

---

## 🚀 Déploiement

### 1. Déploiement sur Vercel (Recommandé)

#### Option A : Via GitHub
```bash
# Pusher le code sur GitHub
git add .
git commit -m "Initial commit - CLICOM website"
git push origin claude/clicom-showcase-site-EpLx8

# Sur Vercel.com :
# 1. Connecter votre repo GitHub
# 2. Importer le projet
# 3. Déployer (automatique)
```

#### Option B : Via Vercel CLI
```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### 2. Configuration DNS
Une fois déployé, configurer le domaine personnalisé :
- Aller dans Settings > Domains sur Vercel
- Ajouter `clicom.ch` et `www.clicom.ch`
- Suivre les instructions DNS de Vercel

### 3. Variables d'Environnement (Optionnel)
Si vous ajoutez un backend ou des services tiers :
```bash
# Sur Vercel Dashboard
Settings > Environment Variables

# Ajouter :
# - GOOGLE_ANALYTICS_ID (pour GA4)
# - EMAILJS_SERVICE_ID (pour le formulaire)
# - etc.
```

---

## 🔧 Développement Local

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari)
- Éditeur de code (VS Code recommandé)

### Lancer le site
```bash
# Option 1 : Serveur Python
python3 -m http.server 8000

# Option 2 : Serveur Node.js (http-server)
npx http-server -p 8000

# Option 3 : Live Server (VS Code Extension)
# Clic droit sur index.html > "Open with Live Server"
```

Ouvrir `http://localhost:8000` dans votre navigateur.

---

## 📝 Personnalisation

### Modifier les couleurs
Éditer `styles.css` (lignes 9-14) :
```css
:root {
    --color-primary: #3366ff;      /* Votre couleur principale */
    --color-secondary: #1a1a2e;    /* Votre couleur secondaire */
}
```

### Modifier les tarifs
Éditer `index.html` (section `#tarifs`) :
- Changer les montants
- Ajouter/retirer des fonctionnalités
- Personnaliser les offres

### Ajouter Google Analytics
1. Créer une propriété GA4 sur [analytics.google.com](https://analytics.google.com)
2. Ajouter le code de tracking dans `index.html` (avant `</head>`) :
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📧 Intégration Formulaire (Backend)

Le formulaire actuel affiche une simple alerte. Pour l'intégrer avec un backend :

### Option 1 : EmailJS (Gratuit)
```javascript
// Dans script.js, remplacer la section "Form submission"
emailjs.send('service_id', 'template_id', formData)
    .then(() => alert('Message envoyé !'));
```

### Option 2 : Formspree
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 3 : Backend personnalisé
Créer une API REST et envoyer les données via fetch() dans script.js.

---

## ✅ Checklist Avant Production

- [ ] Remplacer `www.clicom.ch` par votre vrai domaine
- [ ] Ajouter les vraies images (logo, OG image, favicon)
- [ ] Configurer Google Analytics 4
- [ ] Tester le formulaire avec un service d'emailing
- [ ] Vérifier les coordonnées (email, téléphone)
- [ ] Tester sur mobile (Chrome DevTools)
- [ ] Vérifier les liens légaux (Mentions Légales, CGV)
- [ ] Tester le Lighthouse Score
- [ ] Soumettre le sitemap à Google Search Console

---

## 📞 Support & Contact

Pour toute question ou amélioration :
- **Email** : hello@clicom.ch
- **Téléphone** : 078 823 89 50
- **Localisation** : Suisse Romande

---

## 📄 Licence

© 2026 CLICOM - Agence Marketing Digital Suisse. Tous droits réservés.

---

## 🎉 Crédits

Site développé avec ❤️ par Claude Code pour CLICOM.

**Technologies** : HTML5, CSS3, JavaScript Vanilla
**Hébergement** : Vercel
**Fonts** : Google Fonts (Outfit, Inter)
**Icons** : SVG personnalisés
