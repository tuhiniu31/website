/**
 * Dr. Ohidujjaman Tuhin - Academic & Research Portfolio
 * Interactive Features & Data System
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initPublicationSearchAndFilter();
  initBibtexModal();
  initStatsCounter();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   Theme Management (Light / Dark)
   ========================================================================== */

function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('site-theme', newTheme);
    });
  }
}

/* ==========================================================================
   Navigation & Sticky Header & ScrollSpy
   ========================================================================== */

function initNavigation() {
  const header = document.querySelector('.header');
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   Publication Filtering & Live Search
   ========================================================================== */

function initPublicationSearchAndFilter() {
  const searchInput = document.getElementById('pub-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubItems = document.querySelectorAll('.publication-item');
  const countDisplay = document.getElementById('pub-count');

  let activeCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    let visibleCount = 0;

    pubItems.forEach(item => {
      const categories = (item.getAttribute('data-categories') || '').toLowerCase().split(' ');
      const textContent = item.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all') || categories.includes(activeCategory);
      const matchesSearch = !searchTerm || textContent.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        item.style.display = 'flex';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} of ${pubItems.length} publications`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // Initial count
  applyFilters();
}

/* ==========================================================================
   BibTeX Modal & Copy
   ========================================================================== */

const bibtexDatabase = {
  "tuhin2024illcondition": `@article{tuhin2024illcondition,
  title={Ill-condition Enhancement for BC Speech Using RMC Method},
  author={Ohidujjaman and Hasan, Mahmudul and Zhang, Shiming and Huda, Mohammad Nurul and Uddin, Mohammad Shorif},
  journal={International Journal of Speech Technology},
  year={2024},
  publisher={Springer Nature},
  doi={10.1007/s10772-024-10159-9},
  note={Indexed in Scopus Q1, CiteScore 5.0}
}`,

  "tuhin2024spectral": `@article{tuhin2024spectral,
  title={Spectral Analysis of Bone-Conducted Speech Using Modified Linear Prediction},
  author={Ohidujjaman and Hasan, Mahmudul and Zhang, Shiming and Huda, Mohammad Nurul and Uddin, Mohammad Shorif},
  journal={International Journal of Speech Technology},
  year={2024},
  publisher={Springer Nature},
  doi={10.1007/s10772-024-10151-3},
  note={Indexed in Scopus Q1, CiteScore 5.0}
}`,

  "tuhin2023packet": `@article{tuhin2023packet,
  title={Packet Loss Compensation for VoIP through Bone-Conducted Speech Using Modified Linear Prediction},
  author={Ohidujjaman and Yasui, Nozomiko and Sugiura, Yosuke and Shimamura, Tetsuya and Makinae, Hisanori},
  journal={IEEJ Transactions on Electrical and Electronic Engineering},
  volume={18},
  number={11},
  pages={1774--1782},
  year={2023},
  publisher={Wiley / IEEJ},
  doi={10.1002/tee.23907}
}`,

  "tuhin2024regularized": `@article{tuhin2024regularized,
  title={Regularized Modified Covariance Method for Spectral Analysis of Bone-Conducted Speech},
  author={Ohidujjaman and Sugiura, Yosuke and Yasui, Nozomiko and Shimamura, Tetsuya and Makinae, Hisanori},
  journal={Journal of Signal Processing},
  volume={28},
  number={3},
  pages={77--83},
  year={2024},
  publisher={Research Institute of Signal Processing (RISP), Japan},
  doi={10.2299/jsp.28.77}
}`,

  "tuhin2024residual": `@article{tuhin2024residual,
  title={Packet Loss Concealment Estimating Residual Errors of Forward-Backward Linear Prediction for Bone-Conducted Speech},
  author={Ohidujjaman and Yasui, Nozomiko and Sugiura, Yosuke and Shimamura, Tetsuya and Makinae, Hisanori},
  journal={International Journal of Advanced Computer Science and Applications (IJACSA)},
  volume={15},
  number={4},
  year={2024},
  doi={10.14569/IJACSA.2024.01504126}
}`,

  "uddin2024watermarking": `@article{uddin2024watermarking,
  title={Audio Watermarking: A Comprehensive Review},
  author={Uddin, Mohammad Shorif and Ohidujjaman and Hasan, Mahmudul and Shimamura, Tetsuya},
  journal={International Journal of Advanced Computer Science and Applications (IJACSA)},
  volume={15},
  number={5},
  year={2024},
  doi={10.14569/IJACSA.2024.01505141}
}`,

  "tuhin2024ivsp": `@inproceedings{tuhin2024ivsp,
  title={Packet Loss Concealment Using Regularized Modified Linear Prediction through Bone-Conducted Speech},
  author={Ohidujjaman and Sugiura, Yosuke and Shimamura, Tetsuya and Makinae, Hisanori},
  booktitle={Proceedings of the 2024 6th International Conference on Image, Video and Signal Processing (IVSP 2024)},
  pages={1--5},
  year={2024},
  publisher={ACM},
  address={Meiji University Ikuta Campus, Kawasaki, Japan},
  doi={10.1145/3655755.3655774},
  note={Best Paper Award Winner}
}`,

  "tuhin2021translation": `@inproceedings{tuhin2021translation,
  title={Automatic Machine Translation for Bangla and English Resolving Ambiguities},
  author={Ohidujjaman and Faysal, Fahim and Sumon, Shams and Huda, Mohammad Nurul},
  booktitle={2021 2nd International Conference on Robotics, Electrical and Signal Processing Techniques (ICREST)},
  pages={525--529},
  year={2021},
  organization={IEEE},
  doi={10.1109/ICREST51555.2021.9331085}
}`,

  "tuhin2021papr": `@inproceedings{tuhin2021papr,
  title={PAPR Reduction of OFDM Signal by Scrutiny of BER Assessment and SPS-SLM Method via AWGN Channel},
  author={Ohidujjaman and others and Huda, Mohammad Nurul},
  booktitle={2021 6th International Conference on Inventive Computation Technologies (ICICT)},
  pages={1120--1125},
  year={2021},
  organization={IEEE},
  doi={10.1109/ICICT50816.2021.9358762}
}`,

  "tuhin2014saf": `@inproceedings{tuhin2014saf,
  title={Enhancement of Speech Signal by Originating Computational Iteration using SAF},
  author={Hasan, Mahmudul and Ohidujjaman and Huda, Mohammad Nurul},
  booktitle={2014 IEEE International Symposium on Signal Processing and Information Technology (ISSPIT)},
  pages={000216--000220},
  year={2014},
  organization={IEEE},
  doi={10.1109/ISSPIT.2014.7300561}
}`,

  "tuhin2021voicecode": `@inproceedings{tuhin2021voicecode,
  title={Code Generator based on Voice Command for Multiple Programming Language},
  author={Hossain, Sakib and Emi, Mabia Akter and Mishu, Mohsina Hossain and Zannat, Raihana and Ohidujjaman},
  booktitle={2021 12th International Conference on Computing Communication and Networking Technologies (ICCCNT)},
  year={2021},
  organization={IEEE},
  doi={10.1109/ICCCNT51525.2021.9579880}
}`
};

function initBibtexModal() {
  const modalBackdrop = document.getElementById('bibtex-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const bibtexBox = document.getElementById('bibtex-code');
  const copyBtn = document.getElementById('copy-bibtex-btn');
  const citeButtons = document.querySelectorAll('.cite-btn');

  if (!modalBackdrop || !bibtexBox) return;

  citeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-bibtex-key');
      const entry = bibtexDatabase[key] || generateDefaultBibtex(btn);
      bibtexBox.textContent = entry;
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (copyBtn) {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy BibTeX';
      }
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = bibtexBox.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy BibTeX';
        }, 2200);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  }
}

function generateDefaultBibtex(btn) {
  const pubItem = btn.closest('.publication-item');
  const title = pubItem ? pubItem.querySelector('.pub-title').textContent.trim() : 'Research Article';
  const authors = pubItem ? pubItem.querySelector('.pub-authors').textContent.trim() : 'Dr. Ohidujjaman';
  const venue = pubItem ? pubItem.querySelector('.pub-venue').textContent.trim() : 'Academic Publication';
  const year = pubItem ? pubItem.querySelector('.pub-year').textContent.trim() : '2024';

  return `@article{ohidujjaman${year},
  title={${title}},
  author={${authors}},
  journal={${venue}},
  year={${year}},
  publisher={Academic Press}
}`;
}

/* ==========================================================================
   Stats Counter Animation
   ========================================================================== */

function initStatsCounter() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  if (!statValues.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = easeOutQuad(progress);
          const currentVal = Math.floor(easeProgress * target);

          el.textContent = currentVal + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(val => observer.observe(val));
}

function easeOutQuad(t) {
  return t * (2 - t);
}

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    // Construct mailto link as fallback
    const recipient = 'ohidujjaman@cse.uiu.ac.bd';
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject || 'Inquiry from Dr. Ohidujjaman Tuhin Website')}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message)}`;

    if (statusDiv) {
      statusDiv.className = 'form-submit-status success';
      statusDiv.innerHTML = `<strong>Thank you, ${name}!</strong> Your message has been prepared. <a href="${mailtoLink}" style="text-decoration:underline; font-weight:600; color:inherit;">Click here to send directly via your email client</a>.`;
    }

    // Attempt direct email client opening
    window.location.href = mailtoLink;
  });
}

/* ==========================================================================
   Back to Top
   ========================================================================== */

function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
