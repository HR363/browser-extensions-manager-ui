async function fetchExtensionsData() {
    try {
      const response = await fetch('./data.json');
      if (!response.ok) {
        throw new Error('Failed to fetch extensions data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching extensions data:', error);
      return [];
    }
  }
  
  function createExtensionCard(extension) {
    const card = document.createElement('div');
    card.className = 'extension-card';
    card.dataset.active = extension.isActive;
    
    card.innerHTML = `
      <img src="${extension.logo}" alt="${extension.name} logo" class="extension-logo">
      <h3 class="extension-name">${extension.name}</h3>
      <p class="extension-description">${extension.description}</p>
      <div class="card-footer">
        <button class="remove-btn">Remove</button>
        <label class="toggle-switch">
          <input type="checkbox" ${extension.isActive ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    `;
    
    const toggleInput = card.querySelector('input[type="checkbox"]');
    toggleInput.addEventListener('change', function() {
      extension.isActive = this.checked;
      card.dataset.active = this.checked;
      applyActiveFilter();
    });
    
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function() {
      card.classList.add('removing');
      setTimeout(() => {
        card.remove();
      }, 300);
    });
    
    return card;
  }
  
  async function renderExtensions() {
    const container = document.getElementById('extensions-container');
    const extensions = await fetchExtensionsData();
    
    extensions.forEach(extension => {
      const card = createExtensionCard(extension);
      container.appendChild(card);
    });
  }
  
  function applyActiveFilter() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const cards = document.querySelectorAll('.extension-card');
    
    cards.forEach(card => {
      if (activeFilter === 'all') {
        card.style.display = 'flex';
      } else if (activeFilter === 'active') {
        card.style.display = card.dataset.active === 'true' ? 'flex' : 'none';
      } else if (activeFilter === 'inactive') {
        card.style.display = card.dataset.active === 'false' ? 'flex' : 'none';
      }
    });
  }
  
  function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDarkScheme.matches) {
      document.body.classList.add('dark-theme');
    }
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
    });
  }
  
  function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyActiveFilter();
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    renderExtensions();
    setupThemeToggle();
    setupFilterButtons();
  });isActive