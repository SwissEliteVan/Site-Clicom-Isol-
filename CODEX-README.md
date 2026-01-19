# CODEX - Site Marketing Digital Suisse Romande

🇨🇭 Agence de marketing digital spécialisée pour les entreprises de Suisse romande (Genève, Lausanne, Fribourg, Valais, Neuchâtel).

## 📁 Structure du Projet

```
codex-site/
├── codex-index.html          # Page principale (à renommer en index.html)
├── codex-css-main.css        # Styles principaux
├── codex-css-responsive.css  # Media queries responsive
├── codex-js-main.js          # JavaScript principal
├── css/
│   ├── main.css              # Styles principaux (production)
│   ├── responsive.css        # Responsive design
│   └── swiss-theme.css       # Thème suisse
├── js/
│   ├── main.js               # JavaScript principal
│   └── analytics-local.js    # Analytics local
├── images/
│   ├── optimized/            # Images WebP optimisées
│   ├── logos/                # Logos clients
│   └── team/                 # Photos équipe
├── content/
│   ├── blog/                 # Articles de blog
│   ├── cas-clients/          # Études de cas
│   └── ressources/           # Ressources téléchargeables
└── assets/
    ├── fonts/                # Polices personnalisées
    └── icons/                # Icônes SVG
```

## 🎨 Design System

### Couleurs Swiss Theme

```css
--swiss-blue: #0a3d62;    /* Bleu profond (lacs suisses) */
--swiss-red: #eb3b5a;      /* Rouge suisse */
--swiss-white: #f9f9f9;    /* Blanc neige */
--swiss-gray: #4a4a4a;     /* Gris urbain */
--swiss-green: #00b894;    /* Vert alpage */
--swiss-dark: #2d3436;     /* Noir élégant */
```

### Typographie

- **Primaire**: Inter (Google Fonts)
- **Secondaire**: Helvetica Neue, Arial
- **Tailles**: System de scale fluide avec `clamp()`

### Espacements

Basé sur un système de 8px:
- `--space-xs`: 8px
- `--space-sm`: 16px
- `--space-md`: 24px
- `--space-lg`: 32px
- `--space-xl`: 48px
- `--space-2xl`: 64px

## 🚀 Fonctionnalités

### ✅ Implémenté

1. **Navigation responsive** avec menu mobile
2. **Hero section** avec CTA et trust badges
3. **Services grid** (6 services principaux)
4. **Localisation** - Couverture de la Suisse romande
5. **Formulaire de contact** avec validation
6. **Trust badges** (Swiss Made, LPD, paiements locaux)
7. **Audit gratuit** section CTA
8. **Footer** complet avec liens
9. **SEO optimisé** (Schema.org, meta tags géo-localisées)
10. **Analytics local** avec tracking des événements
11. **Smooth scrolling** entre sections
12. **Honeypot anti-spam** dans formulaire
13. **Mobile-first responsive** design
14. **Accessibilité** (ARIA labels, focus visible)

### 🔧 Composants JavaScript

- **MobileNavigation**: Gestion du menu hamburger
- **SmoothScroll**: Navigation fluide entre sections
- **ContactForm**: Validation et soumission formulaire
- **Analytics**: Tracking local des événements
- **ScrollAnimations**: Animations au scroll
- **Utils**: Fonctions utilitaires (debounce, throttle, etc.)

## 📱 Responsive Breakpoints

```css
/* Mobile */      < 768px     (défaut)
/* Tablet */      >= 768px
/* Desktop */     >= 1024px
/* Large */       >= 1280px
/* XL */          >= 1440px
/* Ultra Wide */  >= 1920px
```

## 🔌 Intégration Backend

### Configuration API

Modifiez l'URL de l'API dans `codex-js-main.js`:

```javascript
const CODEX = {
    config: {
        apiUrl: 'https://votre-backend.ch/api/contact.php',
        // ...
    }
};
```

### Format de données formulaire

```json
{
    "entreprise": "Nom de la société",
    "contact_name": "Prénom Nom",
    "localite": "geneve",
    "email": "email@exemple.ch",
    "telephone": "+41 XX XXX XX XX",
    "besoin": "nouveau-site",
    "message": "Description du projet..."
}
```

### Réponse API attendue

```json
{
    "success": true,
    "message": "Merci ! Nous vous recontactons sous 24h.",
    "client_id": 123
}
```

## 🎯 SEO & Marketing

### Mots-clés ciblés

**Primaires**:
- agence marketing digital Lausanne
- SEO Genève
- création site web Suisse romande
- stratégie digitale Fribourg
- référencement naturel Neuchâtel

**Secondaires**:
- entreprise web Vaud
- communication digitale Valais
- audit SEO gratuit Genève
- formateur Google Ads Lausanne

**Locaux par secteur**:
- PME digitale Genève
- restaurant référencement Lausanne
- commerce en ligne Fribourg
- hôtel marketing digital Valais

### Schema.org

Le site inclut des données structurées:
- `@type: ProfessionalService`
- Coordonnées géographiques (Lausanne)
- Zones desservies (tous les cantons romands)
- Informations de contact

## 📊 Analytics & Tracking

### Événements trackés

1. **Navigation**
   - `page_view`: Vue de page
   - `navigation`: Clics navigation
   - `service_click`: Clics sur services
   - `cta_click`: Clics sur CTA

2. **Conversions**
   - `form_submission_success`: Formulaire envoyé
   - `form_submission_error`: Erreur formulaire
   - `audit_request`: Demande d'audit
   - `phone_call_click`: Clic sur téléphone
   - `email_click`: Clic sur email

3. **Engagement**
   - `scroll_depth`: Profondeur de scroll (25%, 50%, 75%, 100%)
   - `visitor_detected`: Détection visiteur suisse

### Configuration Analytics

```javascript
const analyticsConfig = {
    trackLocalEngagement: true,
    trackCantons: true,
    trackLocalKeywords: true,
    conversionEvents: [
        'contact_form_submit',
        'audit_request',
        'service_click_local',
        'phone_call_ch'
    ]
};
```

## 🔒 Sécurité & Confidentialité

### Conformité LPD (Loi suisse sur la Protection des Données)

- Honeypot anti-spam activé
- Validation côté client et serveur
- HTTPS obligatoire en production
- Pas de cookies tiers
- Analytics local (pas de Google Analytics)

### Validation Formulaire

- Email: Format standard
- Téléphone: Format suisse `+41 XX XXX XX XX`
- Champs obligatoires marqués avec `*`
- Messages d'erreur en français

## 🚀 Déploiement

### 1. Préparation des fichiers

```bash
# Renommer les fichiers
mv codex-index.html index.html
mkdir -p css js images assets
mv codex-css-main.css css/main.css
mv codex-css-responsive.css css/responsive.css
mv codex-js-main.js js/main.js
```

### 2. Optimisation des images

Convertir toutes les images en WebP:

```bash
# Installer cwebp (si nécessaire)
brew install webp  # macOS
apt install webp   # Linux

# Convertir
cwebp -q 85 image.jpg -o images/optimized/image.webp
```

### 3. Minification (Production)

```bash
# CSS
npm install -g csso-cli
csso css/main.css -o css/main.min.css

# JavaScript
npm install -g terser
terser js/main.js -o js/main.min.js --compress --mangle
```

### 4. Backend (Hostinger/cPanel)

1. Uploader les fichiers PHP vers `/public_html/api/`
2. Configurer `api/config.php` avec vos credentials
3. Importer `database/schema.sql` via phpMyAdmin
4. Tester l'endpoint: `https://votre-domaine.ch/api/contact.php`

### 5. Frontend (Vercel/Netlify)

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

## 📈 Performance

### Objectifs Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimisations implémentées

- ✅ Images WebP avec fallback
- ✅ Lazy loading images
- ✅ Préchargement des fonts
- ✅ CSS critique inline (optionnel)
- ✅ JavaScript defer/async
- ✅ Compression Gzip/Brotli (serveur)
- ✅ Cache-Control headers
- ✅ Minification CSS/JS

## 🛠️ Maintenance

### Mettre à jour le contenu

1. **Services**: Modifier section `#services` dans `index.html`
2. **Villes**: Modifier section `#localisation`
3. **Footer**: Modifier section `<footer>`
4. **Formulaire**: Ajuster champs dans section `#contact`

### Ajouter un nouvel article de blog

Créer dans `content/blog/`:

```html
<!-- article-titre.html -->
<article class="blog-post">
    <header class="post-header">
        <span class="post-category">SEO Local</span>
        <h1>Titre de l'article</h1>
        <div class="post-meta">
            <span class="post-date">15.01.2024</span>
            <span class="post-reading-time">5 min</span>
        </div>
    </header>
    <!-- Contenu -->
</article>
```

## 📞 Support

- **Email**: contact@codex.ch
- **Téléphone**: +41 21 XXX XX XX
- **Documentation**: Voir ce README

## 📄 Licence

© 2024 Codex - Tous droits réservés

---

**Créé par**: Claude (Anthropic)
**Version**: 1.0.0
**Dernière mise à jour**: Janvier 2024
