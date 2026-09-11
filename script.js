document.addEventListener('DOMContentLoaded', () => {

  // 1. Fitur Auto-Hide Header saat Scroll ke Bawah
  let lastScrollTop = 0;
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 50) {
      if (header) header.classList.add('header-hidden');
    } else {
      if (header) header.classList.remove('header-hidden');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  // 2. Fitur Toggle Hamburger & Close Button Sidebar Mobile
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const sidebar = document.querySelector('aside');
  const navLinksList = document.querySelectorAll('nav ul li a');

  if (sidebar) {
    if (menuToggle) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('sidebar-open');
      });
    }

    if (menuClose) {
      menuClose.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
      });
    }

    navLinksList.forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }

  // 3. Fitur Menyorot Navigasi Sidebar Saat Di-scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul li a');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Fitur Quick Share Link Per Bab (Salin Link 🔗)
  const sectionTitles = document.querySelectorAll('.section-title');

  sectionTitles.forEach(title => {
    const section = title.closest('section');
    if (!section || !section.id) return;

    const shareBtn = document.createElement('button');
    shareBtn.className = 'btn-share-link';
    shareBtn.setAttribute('title', 'Salin link bab ini');
    shareBtn.setAttribute('aria-label', 'Salin link bab ini');
    shareBtn.innerHTML = '🔗';

    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const shareUrl = `${window.location.origin}${window.location.pathname}#${section.id}`;

      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Link bagian ini berhasil disalin!');
      }).catch(() => {
        showToast('Gagal menyalin link', 'danger');
      });
    });

    title.appendChild(shareBtn);
  });

  // 5. FITUR LIVE SEARCH & TEXT HIGHLIGHTING
  const searchInput = document.getElementById('search-input');
  const mainContent = document.querySelector('main .card');

  if (searchInput && mainContent) {
    let searchDebounce = null;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);

      searchDebounce = setTimeout(() => {
        const query = e.target.value.trim().toLowerCase();

        // Clear existing highlights
        removeHighlights(mainContent);

        if (query.length < 2) {
          return;
        }

        // Apply highlighting
        const matchCount = highlightTextNodes(mainContent, query);

        if (matchCount > 0) {
          showToast(`Ditemukan ${matchCount} kata kunci "${query}"`);
        } else {
          showToast(`Tidak ditemukan kata kunci "${query}"`, 'danger');
        }
      }, 300);
    });
  }

  function removeHighlights(container) {
    const marks = container.querySelectorAll('mark.highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function highlightTextNodes(node, query) {
    let count = 0;
    if (node.nodeType === 3) { // Text node
      const val = node.nodeValue;
      const index = val.toLowerCase().indexOf(query);

      if (index >= 0) {
        const mark = document.createElement('mark');
        mark.className = 'highlight';
        mark.textContent = val.substring(index, index + query.length);

        const after = node.splitText(index);
        after.nodeValue = after.nodeValue.substring(query.length);
        after.parentNode.insertBefore(mark, after);

        count++;
      }
    } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|button|mark)$/i.test(node.tagName)) {
      for (let i = 0; i < node.childNodes.length; i++) {
        count += highlightTextNodes(node.childNodes[i], query);
      }
    }
    return count;
  }

  // 6. Logika Tombol Back to Top
  const btnBackToTop = document.getElementById('btn-back-to-top');

  if (btnBackToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btnBackToTop.classList.add('show');
      } else {
        btnBackToTop.classList.remove('show');
      }
    });

    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});

// FUNGSI TOAST NOTIFICATION
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'danger' ? 'danger' : ''}`;
  toast.innerHTML = `${type === 'danger' ? '⚠️' : '✅'} ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}