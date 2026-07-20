const audio = document.getElementById('audio');
const heroEngineButton = document.getElementById('heroEngineButton');
const soundEngineButton = document.getElementById('soundEngineButton');
const restartSoundButton = document.getElementById('restartSound');
const soundStatus = document.getElementById('soundStatus');
const heroEngineHint = document.getElementById('heroEngineHint');
const wave = document.querySelector('.wave');

const engineButtons = [heroEngineButton, soundEngineButton].filter(Boolean);

function setEngineState(isRunning) {
  engineButtons.forEach(button => button.classList.toggle('engine-on', isRunning));
  if (wave) wave.classList.toggle('playing', isRunning);

  if (soundStatus) {
    soundStatus.textContent = isRunning
      ? 'BMW M4 Sound läuft'
      : 'Motor ist aus';
  }

  if (heroEngineHint) {
    heroEngineHint.textContent = isRunning
      ? 'Sound läuft – nochmals klicken zum Stoppen.'
      : 'Klicken, um den originalen M4-Sound zu starten.';
  }
}

async function startEngine({scrollToSound = false} = {}) {
  if (scrollToSound) {
    document.getElementById('sound')?.scrollIntoView({behavior:'smooth', block:'center'});
  }

  if (audio.paused) {
    try {
      await audio.play();
      setEngineState(true);
    } catch (error) {
      setEngineState(false);
      alert('Der Browser konnte den Sound nicht starten. Bitte nochmals auf START ENGINE klicken.');
    }
  } else {
    audio.pause();
    setEngineState(false);
  }
}

heroEngineButton?.addEventListener('click', () => startEngine({scrollToSound:true}));
soundEngineButton?.addEventListener('click', () => startEngine());

restartSoundButton?.addEventListener('click', async () => {
  audio.currentTime = 0;
  try {
    await audio.play();
    setEngineState(true);
  } catch (error) {
    setEngineState(false);
  }
});

audio.addEventListener('play', () => setEngineState(true));
audio.addEventListener('pause', () => setEngineState(false));
audio.addEventListener('ended', () => {
  audio.currentTime = 0;
  setEngineState(false);
});

// Galerie / Lightbox
const box = document.getElementById('lightbox');
const image = document.getElementById('lightboxImage');

document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    image.src = card.dataset.image;
    box.showModal();
  });
});

document.getElementById('closeLightbox')?.addEventListener('click', () => box.close());
box?.addEventListener('click', event => {
  if (event.target === box) box.close();
});

// Anfrage für E-Mail und WhatsApp
function buildRequestText() {
  const value = id => document.getElementById(id)?.value.trim() || '________________';

  return `Hallo SS Prestige Cars,

ich interessiere mich für eine Miete des BMW M4 Competition.

Mietbeginn: ${value('requestFrom')}
Rückgabe: ${value('requestTo')}
Gewünschter Tarif: ${value('requestTariff')}

Name: ${value('requestName')}
Telefon: ${value('requestPhone')}
E-Mail: ${value('requestEmail')}

Nachricht: ${value('requestMessage')}

Bitte prüfen Sie die Verfügbarkeit und senden Sie mir die weiteren Informationen. Vielen Dank.`;
}

document.getElementById('dynamicWhatsApp')?.addEventListener('click', event => {
  event.preventDefault();
  window.open(
    `https://wa.me/41797862408?text=${encodeURIComponent(buildRequestText())}`,
    '_blank',
    'noopener'
  );
});

document.getElementById('requestForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const subject = encodeURIComponent('Mietanfrage BMW M4 Competition');
  const body = encodeURIComponent(buildRequestText());
  window.location.href =
    `mailto:ssprestigecars.ch@gmail.com?subject=${subject}&body=${body}`;
});


// SOUND CHECK VIDEO LIGHTBOX
const videoCard = document.getElementById('videoGalleryCard');
const videoLightbox = document.getElementById('videoLightbox');
const soundcheckVideo = document.getElementById('soundcheckVideo');
const closeVideoLightbox = document.getElementById('closeVideoLightbox');

async function openSoundcheckVideo() {
  if (!videoLightbox || !soundcheckVideo) return;

  if (!videoLightbox.open) {
    videoLightbox.showModal();
  }

  soundcheckVideo.currentTime = 0;

  try {
    await soundcheckVideo.play();
  } catch (error) {
    // Browser may require a second direct click; controls remain visible.
  }
}

function closeSoundcheckVideo() {
  if (!videoLightbox || !soundcheckVideo) return;
  soundcheckVideo.pause();
  soundcheckVideo.currentTime = 0;
  videoLightbox.close();
}

videoCard?.addEventListener('click', openSoundcheckVideo);
closeVideoLightbox?.addEventListener('click', closeSoundcheckVideo);

videoLightbox?.addEventListener('click', event => {
  if (event.target === videoLightbox) closeSoundcheckVideo();
});

soundcheckVideo?.addEventListener('ended', () => {
  soundcheckVideo.currentTime = 0;
});

// START ENGINE opens the Soundcheck video.
heroEngineButton?.addEventListener('click', event => {
  event.stopImmediatePropagation();
  document.getElementById('galerie')?.scrollIntoView({behavior:'smooth', block:'center'});
  setTimeout(openSoundcheckVideo, 500);
}, true);

soundEngineButton?.addEventListener('click', event => {
  event.stopImmediatePropagation();
  openSoundcheckVideo();
}, true);
