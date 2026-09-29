/**
 * Jure Travel - Executive Digital Card Interactive Controller
 * Matías Fernández Jure
 */

document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen Logic
  const splash = document.getElementById('splashScreen');
  const enterBtn = document.getElementById('splashEnterBtn');
  const mainWrap = document.getElementById('mainContent');

  function dismissSplash() {
    if (!splash) return;
    splash.classList.add('fade-out');
    if (mainWrap) {
      mainWrap.classList.add('visible');
    }
    setTimeout(() => {
      splash.style.display = 'none';
    }, 700);
  }

  // Auto dismiss splash after 2.4s or on user interaction
  const autoSplashTimer = setTimeout(dismissSplash, 2600);

  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearTimeout(autoSplashTimer);
      dismissSplash();
    });
  }

  if (splash) {
    splash.addEventListener('click', (e) => {
      // If clicked anywhere on splash, dismiss immediately
      clearTimeout(autoSplashTimer);
      dismissSplash();
    });
  }

  // Toast Notification System
  const toast = document.getElementById('toast');
  let toastTimeout;

  window.showToast = function(message, icon = 'fa-circle-check') {
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // vCard (.vcf) Generator and Downloader
  const saveContactBtn = document.getElementById('saveContactBtn');
  const saveContactFloating = document.getElementById('saveContactFloating');

  function downloadVCard() {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Fernández Jure;Matías;Javier;;',
      'FN:Matías Javier Fernández Jure',
      'ORG:Jure Travel',
      'TITLE:CEO & Owner (Executive MBA)',
      'TEL;TYPE=CELL,VOICE,PREF:+5493812061066',
      'EMAIL;TYPE=WORK,INTERNET:matias@juretravel.com',
      'URL:https://juretravel.netlify.app/',
      'NOTE:CUIL: 20-32460762-6 | Agencia de Viajes y Turismo de Alta Gama',
      'X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/traveljure',
      'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/mfjure9/',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Matias_Fernandez_Jure_Travel.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('¡Contacto listo para guardar!', 'fa-address-card');
  }

  if (saveContactBtn) saveContactBtn.addEventListener('click', downloadVCard);
  if (saveContactFloating) saveContactFloating.addEventListener('click', downloadVCard);

  // Copy Email Function
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = 'matias@juretravel.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copiado: ' + email, 'fa-copy');
      }).catch(() => {
        showToast('matias@juretravel.com', 'fa-envelope');
      });
    });
  }

  // QR Code Modal Logic
  const qrModal = document.getElementById('qrModal');
  const openQrBtn = document.getElementById('openQrBtn');
  const closeQrBtn = document.getElementById('closeQrBtn');
  const qrContainer = document.getElementById('qrcode');
  const shareNativeBtn = document.getElementById('shareNativeBtn');
  const copyLinkModalBtn = document.getElementById('copyLinkModalBtn');

  let qrGenerated = false;

  function generateQRCode() {
    if (qrGenerated || !qrContainer) return;
    const currentUrl = window.location.href;
    
    // Check if QRCode library loaded
    if (typeof QRCode !== 'undefined') {
      qrContainer.innerHTML = '';
      new QRCode(qrContainer, {
        text: currentUrl,
        width: 190,
        height: 190,
        colorDark: "#081b2e",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      qrGenerated = true;
    } else {
      // Fallback to QR API image
      qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=${encodeURIComponent(currentUrl)}&color=081b2e&bgcolor=ffffff" alt="QR Code" style="border-radius: 12px; width: 190px; height: 190px;" />`;
      qrGenerated = true;
    }
  }

  function openModal() {
    if (!qrModal) return;
    generateQRCode();
    qrModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!qrModal) return;
    qrModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openQrBtn) openQrBtn.addEventListener('click', openModal);
  if (closeQrBtn) closeQrBtn.addEventListener('click', closeModal);

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        closeModal();
      }
    });
  }

  // Share Native / Web Share API
  if (shareNativeBtn) {
    shareNativeBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Matías Fernández Jure | CEO Jure Travel',
        text: 'Tarjeta digital ejecutiva de Matías Fernández Jure - CEO & Owner de Jure Travel.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          showToast('¡Compartido con éxito!', 'fa-paper-plane');
        } catch (err) {
          // user cancelled or failed
        }
      } else {
        // Fallback copy link
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Enlace de tarjeta copiado', 'fa-link');
        });
      }
    });
  }

  if (copyLinkModalBtn) {
    copyLinkModalBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Enlace copiado al portapapeles', 'fa-check-double');
      });
    });
  }

  // 3D Glass Card Tilt Effect (Interactive on Desktop)
  const glassCard = document.querySelector('.glass-card');
  if (glassCard && window.matchMedia('(pointer: fine)').matches) {
    const handleMouseMove = (e) => {
      const rect = glassCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      glassCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      
      // Dynamic light glare effect position
      glassCard.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      glassCard.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    };

    const handleMouseLeave = () => {
      glassCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    };

    glassCard.addEventListener('mousemove', handleMouseMove);
    glassCard.addEventListener('mouseleave', handleMouseLeave);
  }

  // Ripple effect on button clicks
  document.querySelectorAll('.glass-btn, .action-pill, .social-icon-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
});
