// Generic policy loader script
// This script can be used to load and render any policy markdown file

class PolicyLoader {
  constructor(config) {
    this.markdownFile = config.markdownFile;
    this.contentElementId = config.contentElementId;
    this.loadingText = config.loadingText || '読み込み中';
    this.errorText = config.errorText || '読み込みに失敗しました。';
  }

  async loadPolicy() {
    try {
      const response = await fetch(this.markdownFile);
      const markdown = await response.text();

      // Configure marked options
      marked.setOptions({
        breaks: true,
        gfm: true
      });

      // Convert markdown to HTML
      const html = marked.parse(markdown);

      // Insert the rendered HTML into the page
      const contentElement = document.getElementById(this.contentElementId);
      contentElement.innerHTML = html;

      // Apply styling to the rendered content
      this.applyStyles(contentElement);

    } catch (error) {
      console.error('Error loading policy:', error);
      document.getElementById(this.contentElementId).innerHTML = `<p class="error">${this.errorText}</p>`;
    }
  }

  applyStyles(contentElement) {
    // Remove all horizontal rules (hr elements)
    const hrElements = contentElement.querySelectorAll('hr');
    hrElements.forEach(hr => hr.remove());

    // Handle the header (h1 and intro paragraph)
    const h1 = contentElement.querySelector('h1');
    if (h1) {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'policy-header';

      // Store reference to the intro paragraph before moving h1
      const introP = h1.nextElementSibling;

      // Move h1 to header div and add class
      h1.className = 'policy-title';
      headerDiv.appendChild(h1);

      // If there's an intro paragraph, move it too
      if (introP && introP.tagName === 'P') {
        introP.className = 'policy-intro';
        headerDiv.appendChild(introP);
      }

      // Insert the header div at the beginning of the content
      contentElement.insertBefore(headerDiv, contentElement.firstChild);
    }

    // Apply consistent styling to all policy pages
    // Wrap h2 sections in containers
    const h2Elements = contentElement.querySelectorAll('h2');
    h2Elements.forEach(h2 => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'policy-section-item';

      // Insert section div before h2
      h2.parentNode.insertBefore(sectionDiv, h2);

      // Move h2 into section div
      sectionDiv.appendChild(h2);

      // Move all following elements until next h2 or end
      let nextElement = sectionDiv.nextElementSibling;
      while (nextElement && nextElement.tagName !== 'H2') {
        const current = nextElement;
        nextElement = nextElement.nextElementSibling;
        sectionDiv.appendChild(current);
      }
    });

    // Handle the final update date
    const allParagraphs = contentElement.querySelectorAll('p');
    const lastP = allParagraphs[allParagraphs.length - 1];
    if (lastP && (lastP.textContent.includes('最終更新日'))) {
      lastP.className = 'policy-date';
    }
  }
}

// Common mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function () {
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

// Common header scroll effect
function initializeHeaderScroll() {
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });
}

// Initialize common functionality
function initializeCommonFeatures() {
  initializeMobileMenu();
  initializeHeaderScroll();
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCommonFeatures);