document.addEventListener('DOMContentLoaded', () => {
// LOGIKA SIMULATOR LEVEL SANKSI POIN
  const pointSlider = document.getElementById('point-slider');
  const pointDisplay = document.getElementById('point-display');
  const gaugeFill = document.getElementById('gauge-bar-fill');
  const statusBox = document.getElementById('gauge-status-box');
  const statusTitle = document.getElementById('gauge-status-title');
  const statusDesc = document.getElementById('gauge-status-desc');

  if (pointSlider) {
    pointSlider.addEventListener('input', (e) => {
      const points = parseInt(e.target.value);
      pointDisplay.textContent = points;
      gaugeFill.style.width = `${points}%`;

      if (points > 80) {
        // Status Aman (100 - 81)
        gaugeFill.style.backgroundColor = '#22c55e';
        statusBox.style.backgroundColor = '#dcfce7';
        statusBox.style.borderLeftColor = '#22c55e';
        statusTitle.style.color = '#15803d';
        statusTitle.textContent = 'STATUS: AMAN / SANGAT BAIK';
        statusDesc.style.color = '#166534';
        statusDesc.textContent = 'Siswa dalam kondisi aman dan belum membutuhkan tindakan pembinaan khusus.';
      } else if (points > 60) {
        // Status SP-1 (80 - 61)
        gaugeFill.style.backgroundColor = '#eab308';
        statusBox.style.backgroundColor = '#fef9c3';
        statusBox.style.borderLeftColor = '#eab308';
        statusTitle.style.color = '#a16207';
        statusTitle.textContent = '⚠️ SANKSI: SURAT PERINGATAN 1 (SP-1)';
        statusDesc.style.color = '#854d0e';
        statusDesc.textContent = 'Pembinaan oleh Wali Kelas, Pembina Kesiswaan, dan Pemanggilan Orang Tua/Wali.';
      } else if (points > 40) {
        // Status SP-2 (60 - 41)
        gaugeFill.style.backgroundColor = '#f97316';
        statusBox.style.backgroundColor = '#ffedd5';
        statusBox.style.borderLeftColor = '#f97316';
        statusTitle.style.color = '#c2410c';
        statusTitle.textContent = '⚠️ SANKSI: SURAT PERINGATAN 2 (SP-2)';
        statusDesc.style.color = '#9a3412';
        statusDesc.textContent = 'Pembinaan intensif oleh Wakasek Kesiswaan, Tim BP/BK, dan Psikolog Sekolah.';
      } else if (points > 30) {
        // Status Surat Perjanjian (40 - 31)
        gaugeFill.style.backgroundColor = '#ef4444';
        statusBox.style.backgroundColor = '#fee2e2';
        statusBox.style.borderLeftColor = '#ef4444';
        statusTitle.style.color = '#b91c1c';
        statusTitle.textContent = '🚨 BAHAYA: SURAT PERJANJIAN & PERNYATAAN';
        statusDesc.style.color = '#991b1b';
        statusDesc.textContent = 'Siswa terancam tidak naik kelas dan wajib menandatangani Surat Perjanjian Khusus.';
      } else {
        // Status SP-3 / Dikeluarkan (30 - 0)
        gaugeFill.style.backgroundColor = '#7f1d1d';
        statusBox.style.backgroundColor = '#fecdd3';
        statusBox.style.borderLeftColor = '#7f1d1d';
        statusTitle.style.color = '#881337';
        statusTitle.textContent = '⛔ SANKSI MAX: SP-3 / DIKELUARKAN';
        statusDesc.style.color = '#4c0519';
        statusDesc.textContent = 'Batas pengurangan poin penuh (100). Siswa dikembalikan kepada Orang Tua / Wali Murid.';
      }
    });
  }
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

  // 5. FITUR SEARCH MULTI-RESULT & NEXT RESULT ON ENTER/CLICK
  const searchInput = document.getElementById('search-input');
  const searchIcon = document.querySelector('.search-icon');
  const mainContent = document.querySelector('main .card');

  let searchMatches = [];
  let currentIndex = -1;
  let lastQuery = '';

  if (searchInput && mainContent) {
    // Jalankan pencarian jika tombol Enter ditekan
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    });

    // Jalankan pencarian jika ikon kaca pembesar 🔍 diklik
    if (searchIcon) {
      searchIcon.style.cursor = 'pointer';
      searchIcon.addEventListener('click', () => {
        handleSearch();
      });
    }

    // Reset pencarian jika teks dihapus
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query === '') {
        removeHighlights(mainContent);
        searchMatches = [];
        currentIndex = -1;
        lastQuery = '';
      }
    });
  }

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (query.length < 2) {
      showToast('Ketik minimal 2 karakter', 'danger');
      return;
    }

    // Jika kata kunci baru, kumpulkan semua hasil pencarian dari awal
    if (query !== lastQuery) {
      removeHighlights(mainContent);
      searchMatches = [];
      currentIndex = 0;
      lastQuery = query;

      const elements = mainContent.querySelectorAll('p, li, td, h2, h3');

      elements.forEach(el => {
        if (el.classList.contains('btn-share-link')) return;

        const text = el.textContent.toLowerCase();
        if (text.includes(query)) {
          searchMatches.push(el);
          highlightTextNodes(el, query);
        }
      });

      if (searchMatches.length === 0) {
        showToast('Aturan ini tidak ada di dalam buku pedoman', 'danger');
        return;
      }
    } else {
      // Jika kata kunci sama dan ditekan Search/Enter lagi, lanjut ke hasil berikutnya
      if (searchMatches.length > 0) {
        currentIndex = (currentIndex + 1) % searchMatches.length;
      }
    }

    if (searchMatches.length > 0) {
      const targetElement = searchMatches[currentIndex];

      // Hitung posisi offset agar tidak tertutup header
      const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 80;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 30;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Animasi kilau kuning sementara pada elemen aktif
      targetElement.style.transition = 'background-color 0.4s ease';
      const originalBg = targetElement.style.backgroundColor;
      targetElement.style.backgroundColor = '#facc15';
      
      setTimeout(() => {
        targetElement.style.backgroundColor = originalBg;
      }, 1800);

      showToast(`Hasil ${currentIndex + 1} dari ${searchMatches.length} untuk "${query}"`);
    }
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
    if (node.nodeType === 3) {
      const val = node.nodeValue;
      const index = val.toLowerCase().indexOf(query);

      if (index >= 0) {
        const mark = document.createElement('mark');
        mark.className = 'highlight';
        mark.textContent = val.substring(index, index + query.length);

        const after = node.splitText(index);
        after.nodeValue = after.nodeValue.substring(query.length);
        after.parentNode.insertBefore(mark, after);
      }
    } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|button|mark)$/i.test(node.tagName)) {
      for (let i = 0; i < node.childNodes.length; i++) {
        highlightTextNodes(node.childNodes[i], query);
      }
    }
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
