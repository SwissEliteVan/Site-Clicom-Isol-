(function () {
  var root = document.documentElement;
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var storedTheme = window.localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
    var label = themeToggle.querySelector('.theme-label');
    var icon = themeToggle.querySelector('span[aria-hidden="true"]');
    if (label) label.textContent = theme === 'dark' ? 'Mode clair' : 'Mode sombre';
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  applyTheme(storedTheme || (prefersDark.matches ? 'dark' : 'light'));

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  if (prefersDark.addEventListener) {
    prefersDark.addEventListener('change', function (event) {
      if (!window.localStorage.getItem('theme')) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  var progress = document.querySelector('.progress span');
  if (progress) {
    var onScroll = function () {
      var doc = document.documentElement;
      var total = doc.scrollHeight - doc.clientHeight;
      var scrolled = doc.scrollTop || document.body.scrollTop;
      var pct = total ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      progress.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var switchEl = document.querySelector('.switch');
  if (switchEl) {
    var pricingNote = document.getElementById('pricing-note');
    var switchLive = document.querySelector('.switch-live');
    var priceValues = [].slice.call(document.querySelectorAll('.price-value'));
    var billingLabels = [].slice.call(document.querySelectorAll('.billing-label'));
    var updatePrices = function (monthly) {
      priceValues.forEach(function (el) {
        var value = monthly ? el.getAttribute('data-price-monthly') : el.getAttribute('data-price-unique');
        if (value) el.textContent = value;
      });
      billingLabels.forEach(function (el) {
        var value = monthly ? el.getAttribute('data-billing-monthly') : el.getAttribute('data-billing-unique');
        if (value) el.textContent = value;
      });
      if (pricingNote) {
        pricingNote.textContent = monthly
          ? 'Mode mensuel sélectionné. Packs lissés sur 12 mois, mandat en mensuel. Hors TVA.'
          : 'Mode unique sélectionné. Packs en paiement unique, mandat en mensuel. Hors TVA.';
      }
    };
    var updateSwitch = function (state) {
      switchEl.setAttribute('aria-checked', String(state));
      if (switchLive) {
        switchLive.textContent = state
          ? 'Mode mensuel sélectionné. Tarifs actualisés.'
          : 'Mode unique sélectionné. Tarifs actualisés.';
      }
      updatePrices(state);
    };
    switchEl.addEventListener('click', function () {
      var state = switchEl.getAttribute('aria-checked') === 'true';
      updateSwitch(!state);
    });
    switchEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchEl.click();
      }
    });
    updateSwitch(false);
  }

  var calcForm = document.querySelector('[data-calculator]');
  if (calcForm) {
    var resultEl = calcForm.querySelector('[data-estimate]');
    var cta = calcForm.querySelector('[data-estimate-cta]');
    var formatCHF = function (value) {
      return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(value);
    };
    var round05 = function (value) {
      return Math.round(value / 0.05) * 0.05;
    };
    calcForm.addEventListener('input', function () {
      var base = Number(calcForm.querySelector('[name="base"]:checked')?.value || 0);
      var options = 0;
      calcForm.querySelectorAll('[name="option"]:checked').forEach(function (opt) {
        options += Number(opt.value || 0);
      });
      var estimate = round05(base + options);
      if (resultEl) resultEl.textContent = formatCHF(estimate) + ' hors TVA';
      if (cta) {
        var params = new URLSearchParams(window.location.search);
        params.set('offre', calcForm.querySelector('[name="base"]:checked')?.dataset.offer || 'sur-mesure');
        params.set('estimation', String(estimate));
        cta.href = '/contact/?' + params.toString();
      }
    });
    calcForm.dispatchEvent(new Event('input'));
  }

  var steps = [].slice.call(document.querySelectorAll('[data-step]'));
  if (steps.length) {
    var current = 0;
    var form = document.querySelector('[data-multi-step]');
    var status = form ? form.querySelector('[data-step-status]') : null;
    var saveState = function () {
      if (!form) return;
      var data = {};
      form.querySelectorAll('input, textarea, select').forEach(function (field) {
        if (field.name) data[field.name] = field.value;
      });
      window.localStorage.setItem('clicom-contact', JSON.stringify(data));
    };
    var restoreState = function () {
      if (!form) return;
      var saved = window.localStorage.getItem('clicom-contact');
      if (!saved) return;
      try {
        var data = JSON.parse(saved);
        Object.keys(data).forEach(function (key) {
          var field = form.querySelector('[name="' + key + '"]');
          if (field) field.value = data[key];
        });
      } catch (e) {}
    };
    var showStep = function (index) {
      steps.forEach(function (step, i) {
        step.hidden = i !== index;
      });
      current = index;
      if (status) status.textContent = 'Étape ' + (index + 1) + ' sur ' + steps.length;
    };
    if (form) {
      form.addEventListener('input', saveState);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        window.localStorage.removeItem('clicom-contact');
        window.location.href = '/merci/';
      });
    }
    document.querySelectorAll('[data-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (current < steps.length - 1) showStep(current + 1);
      });
    });
    document.querySelectorAll('[data-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (current > 0) showStep(current - 1);
      });
    });
    restoreState();
    showStep(0);
  }

  var utmFields = document.querySelectorAll('[data-utm]');
  if (utmFields.length) {
    var params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referrer', 'offre', 'estimation'].forEach(
      function (key) {
        var value = params.get(key) || window.sessionStorage.getItem(key);
        if (!value && key === 'referrer') value = document.referrer;
        if (value) window.sessionStorage.setItem(key, value);
      }
    );
    utmFields.forEach(function (field) {
      var key = field.getAttribute('data-utm');
      var value = window.sessionStorage.getItem(key);
      if (value) field.value = value;
    });
  }

  var dialog = document.querySelector('[data-gate-dialog]');
  if (dialog) {
    var openBtn = document.querySelector('[data-gate-open]');
    var closeBtn = dialog.querySelector('[data-gate-close]');
    var consent = dialog.querySelector('[data-gate-consent]');
    var download = dialog.querySelector('[data-gate-download]');
    var trap = function (event) {
      if (event.key !== 'Tab') return;
      var focusables = dialog.querySelectorAll('button, [href], input, [tabindex]:not([tabindex=\"-1\"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    if (openBtn) {
      openBtn.addEventListener('click', function () {
        dialog.showModal();
        var target = dialog.querySelector('[data-gate-close]');
        if (target) target.focus();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dialog.close();
      });
    }
    if (consent && download) {
      var sync = function () {
        var enabled = consent.checked;
        download.setAttribute('aria-disabled', String(!enabled));
        download.tabIndex = enabled ? 0 : -1;
        download.style.pointerEvents = enabled ? 'auto' : 'none';
      };
      consent.addEventListener('change', sync);
      sync();
    }
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') dialog.close();
      trap(event);
    });
  }

  var blogData = window.__BLOG_POSTS__;
  if (blogData && Array.isArray(blogData.posts)) {
    var searchInput = document.querySelector('[data-search]');
    var list = document.querySelector('[data-post-list]');
    var pageLabel = document.querySelector('[data-page-label]');
    var perPage = 3;
    var currentPage = 1;
    var render = function (posts) {
      if (!list) return;
      list.textContent = '';
      posts.forEach(function (post) {
        var item = document.createElement('article');
        item.className = 'card';
        var meta = document.createElement('p');
        meta.className = 'meta';
        meta.textContent = post.category + ' · ' + post.readingTime;
        var title = document.createElement('h3');
        var link = document.createElement('a');
        link.href = post.url;
        link.textContent = post.title;
        title.appendChild(link);
        var desc = document.createElement('p');
        desc.textContent = post.description;
        var cta = document.createElement('a');
        cta.className = 'ghost';
        cta.href = post.url;
        cta.textContent = "Lire l'article";
        item.appendChild(meta);
        item.appendChild(title);
        item.appendChild(desc);
        item.appendChild(cta);
        list.appendChild(item);
      });
    };
    var paginate = function (posts, page) {
      var start = (page - 1) * perPage;
      return posts.slice(start, start + perPage);
    };
    var update = function () {
      var query = searchInput ? searchInput.value.toLowerCase() : '';
      var filtered = blogData.posts.filter(function (post) {
        return post.title.toLowerCase().includes(query) || post.tags.join(' ').toLowerCase().includes(query);
      });
      var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
      if (currentPage > totalPages) currentPage = totalPages;
      render(paginate(filtered, currentPage));
      if (pageLabel) pageLabel.textContent = 'Page ' + currentPage + ' / ' + totalPages;
    };
    if (searchInput) searchInput.addEventListener('input', function () {
      currentPage = 1;
      update();
    });
    document.querySelectorAll('[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentPage = Math.max(1, currentPage + Number(btn.getAttribute('data-page')));
        update();
      });
    });
    update();
  }
})();
