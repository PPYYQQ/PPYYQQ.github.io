/*******************************
 * Theme (Light / Dark) Toggle *
 *******************************/
function initThemeToggle() {
  let isAnimating = false; 
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'theme-toggle';
  
  toggleBtn.style.cssText = `
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    outline: none;
  `;
  
  const iconContainer = document.createElement('div');
  iconContainer.style.cssText = `
    position: relative;
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 2px; 
    left: -3.5px;
  `;

  const icon = document.createElement('img');
  icon.style.cssText = `
    width: 100%;
    height: 100%;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;
  iconContainer.appendChild(icon);
  toggleBtn.appendChild(iconContainer);
  
  function createParticles() {
    const particles = [];
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        opacity: 0;
        background: var(--link-color);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
      `;
      iconContainer.appendChild(particle);
      particles.push(particle);
    }
    return particles;
  }
  
  const particles = createParticles();
  
  const linkP = document.querySelectorAll('td[style*="width:63%"] p')[3];
  if (linkP) {
    linkP.appendChild(document.createTextNode(' \u00A0/\u00A0 '));
    linkP.appendChild(toggleBtn);
  }
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
  
  function updateIcon() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    icon.src = isDark ? 'static/images/icon/moon.png' : 'static/images/icon/sun.png';
    icon.alt = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  
  updateIcon();
  
  function triggerExplosion() {
    if (isAnimating) return; 
    
    isAnimating = true;
    
    toggleBtn.style.pointerEvents = 'none';
    
    icon.style.transform = 'scale(3)';
    icon.style.opacity = '0.7';
    
    particles.forEach((particle, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const distance = 30;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      particle.style.opacity = '1';
      particle.style.transition = 'all 0.4s ease-out';
      
      setTimeout(() => {
        particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`;
        particle.style.opacity = '0';
      }, i * 30);
    });
    
    setTimeout(() => {
      icon.style.transform = 'scale(0)';
      icon.style.opacity = '0';
      
      setTimeout(() => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon();
        
        setTimeout(() => {
          icon.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.5)';
          icon.style.transform = 'scale(1)';
          icon.style.opacity = '1';
          
          particles.forEach(particle => {
            particle.style.transition = 'none';
            particle.style.transform = 'translate(-50%, -50%) scale(1)';
            particle.style.opacity = '0';
          });
          
          setTimeout(() => {
            toggleBtn.style.pointerEvents = 'auto';
            isAnimating = false;
          }, 100);
          
        }, 100); 
        
      }, 150);
      
    }, 300); 
  }
  
  let hoverTransform = '';
  
  toggleBtn.addEventListener('mouseenter', () => {
    if (!isAnimating && icon.style.transform === 'scale(1)' || icon.style.transform === '') {
      hoverTransform = 'scale(1.15)';
      icon.style.transform = hoverTransform;
    }
  });
  
  toggleBtn.addEventListener('mouseleave', () => {
    if (!isAnimating && icon.style.transform === hoverTransform) {
      icon.style.transform = 'scale(1)';
    }
  });
  
  toggleBtn.addEventListener('click', triggerExplosion);
}


/****************************************
 * Teaser Image Responsive Functionality *
 ****************************************/
function initTeaserFeature() {
    const paperRows = document.querySelectorAll('table tbody tr');
    
    paperRows.forEach(row => {
        const firstCell = row.querySelector('td:first-child');
        const secondCell = row.querySelector('td:nth-child(2)');
        
        if (firstCell && secondCell && firstCell.querySelector('img') && secondCell.querySelector('papertitle')) {
            firstCell.classList.add('teaser-cell');
            firstCell.querySelector('img').classList.add('teaser-image');
            
            if (!secondCell.querySelector('.teaser-link')) {
                const teaserLink = document.createElement('a');
                teaserLink.href = '#';
                teaserLink.className = 'teaser-link';
                teaserLink.style.display = 'none';
                teaserLink.style.marginLeft = '10px';
                teaserLink.textContent = '[Teaser]';
                
                const papertitle = secondCell.querySelector('papertitle');
                papertitle.parentNode.insertBefore(teaserLink, papertitle.nextSibling);
            }
        }
    });

    function adjustTeasers() {
        const teaserCells = document.querySelectorAll('.teaser-cell');
        
        teaserCells.forEach(teaserCell => {
            const row = teaserCell.parentElement;
            const contentCell = row.querySelector('td:nth-child(2)');
            const teaserLink = contentCell.querySelector('.teaser-link');
            
            if (window.innerWidth < 640) {
                teaserCell.style.display = 'none';
                teaserLink.style.display = 'inline';
            } else {
                teaserCell.style.display = '';
                teaserLink.style.display = 'none';
                
                const mobileTeaser = contentCell.querySelector('.mobile-teaser');
                if (mobileTeaser) mobileTeaser.remove();
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('teaser-link')) {
            e.preventDefault();
            
            const contentCell = e.target.closest('td');
            const row = contentCell.parentElement;
            const teaserCell = row.querySelector('.teaser-cell');
            
            let mobileTeaser = contentCell.querySelector('.mobile-teaser');
            
            if (mobileTeaser) {
                mobileTeaser.remove();
            } else {
                mobileTeaser = document.createElement('div');
                mobileTeaser.className = 'mobile-teaser';
                mobileTeaser.style.width = '100%';
                mobileTeaser.style.textAlign = 'center';
                mobileTeaser.style.margin = '10px 0';
                
                const newImage = document.createElement('img');
                newImage.src = teaserCell.querySelector('img').src;
                newImage.style.maxWidth = '100%';
                newImage.style.height = 'auto';
                
                mobileTeaser.appendChild(newImage);
                
                const firstBr = contentCell.querySelector('br');
                firstBr.parentNode.insertBefore(mobileTeaser, firstBr.nextSibling);
            }
        }
    });

    adjustTeasers();

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjustTeasers, 100);
    });
}


/***************************
 * Abstract Toggle Feature *
 ***************************/
function initAbstractFeature() {
    document.querySelectorAll('abs').forEach(abs => {
        abs.style.display = 'none';
    });

    document.querySelectorAll('p').forEach(p => {
        if (p.textContent.trim().startsWith('tl;dr:')) {
            p.style.display = 'block';
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href="#"]') && e.target.textContent === '[Abs]') {
            e.preventDefault();
            const contentCell = e.target.closest('td');
            const abstract = contentCell.querySelector('abs');
            const tldr = Array.from(contentCell.querySelectorAll('p'))
                .find(p => p.textContent.trim().startsWith('tl;dr:'));
            
            if (abstract && tldr) {
                const showAbs = abstract.style.display === 'none';
                abstract.style.display = showAbs ? 'block' : 'none';
                tldr.style.display = showAbs ? 'none' : 'block';
            }
        }
    });
}


/************************
 * DOM Initialization   *
 ************************/
document.addEventListener('DOMContentLoaded', function() {
    // Align teaser + content at top
    document.querySelectorAll('table tbody tr td').forEach(cell => {
        if (cell.querySelector('img') || cell.querySelector('papertitle')) {
            cell.style.verticalAlign = 'top';
        }
    });

    initThemeToggle();     // 🌗 Dark / Light
    initTeaserFeature();  // 🖼️ Teaser responsive
    initAbstractFeature();// 📄 Abstract toggle
});
