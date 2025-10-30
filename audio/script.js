/**
 * Audio Slide Player - FINAL VERSION with Modular Slide Type System
 */
import { slideTypeRegistry } from './slideTypes/registerSlideTypes.js';

// Make textAnimationTimeout globally accessible
window.textAnimationTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  // ---------- DOM ----------
  let audioPlayer           = document.getElementById('audio-player');
  const playerContainer     = document.getElementById('player-container');
  const slideDisplay        = document.getElementById('slide-display');
  const slideImageContainer = document.getElementById('slide-image-container');
  const slideTextContainer  = document.getElementById('slide-text-container');
  const slideTextContent    = document.getElementById('slide-text-content') || slideTextContainer;
  const sourceLinkWrap      = document.getElementById('source-link-wrap');
  const zoomHintEl          = document.getElementById('zoom-hint');
  const quizOverlay         = document.getElementById('quiz-overlay');

  // ---------- STATE ----------
  let slidesData = [];
  let currentSlideIndex = -1;
  let hideControlsTimeout;
  let presentationId = 'test2'; // A default ID

  // ---------- UTILS ----------
  const getId = () => presentationId;
  const getSlideType = (slide) => slide.layout || slide.type || 'classic_bullet_point';

  function parseTimestamp(ts) {
    if (typeof ts === 'number') return ts;
    if (!ts) return 0;
    const parts = String(ts).replace(':', '_').split('_');
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return (minutes * 60) + seconds;
  }

  const escapeHTML = (s) => String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---------- RENDER ----------
  function renderSlide(slideIndex) {
    if (slideIndex === -1 || !slidesData[slideIndex]) {
      slideImageContainer.innerHTML = '';
      slideTextContent.innerHTML = '<p style="align-self:center; text-align:center;">Presentation loading...</p>';
      return;
    }

    const slide = slidesData[slideIndex];
    const slideType = getSlideType(slide);
    const id = getId();
    
    const imageFilename = slide.image_filename || `${slide.index + 1}.png`;
    const imagePath = `images/${id}/${imageFilename}`;

    slideDisplay.className = `type-${slideType.replace(/_/g, '-')}`;

    // Create the appropriate slide type instance
    const slideTypeInstance = slideTypeRegistry.create(slideType, slide, slideTextContent, slideImageContainer);
    
    // Render the slide
    slideTypeInstance.render(imagePath);

    if (window.renderMathInElement) {
      renderMathInElement(slideTextContent, { 
        delimiters: [
          {left: '$$', right: '$$', display: true}, 
          {left: '$', right: '$', display: false}
        ] 
      });
    }
    requestAnimationFrame(fitTextBlock);
  }

  function startTextAnimation(slide) {
    clearTimeout(window.textAnimationTimeout);
    if (!slide) return;
    const slideType = getSlideType(slide);
    const duration = slide.duration || 15;
    let initialDelay = 1500, staggerDelay = 900;

    if (duration > 20) { initialDelay = 2500; staggerDelay = 1200; }
    else if (duration < 8) { initialDelay = 500; staggerDelay = 400; }

    // Create the appropriate slide type instance
    const slideTypeInstance = slideTypeRegistry.create(slideType, slide, slideTextContent, slideImageContainer);
    
    // Start the animation
    slideTypeInstance.startAnimation();
  }

  function fitTextBlock() {
    if (!slideTextContainer || !slideTextContent) return;
    const slide = slidesData[currentSlideIndex];
    if (!slide) return;
    const slideType = getSlideType(slide);
    const shouldScale = ['quote', 'reflective_question', 'title', 'only_text', 'question_prompt', 'key_definition'].includes(slideType);
    slideTextContent.style.transform = 'scale(1)';
    if (!shouldScale) return;
    const containerW = slideTextContainer.clientWidth, containerH = slideTextContainer.clientHeight;
    const contentW = slideTextContent.scrollWidth, contentH = slideTextContent.scrollHeight;
    if (containerW <= 0 || containerH <= 0 || contentW <= 0 || contentH <= 0) return;
    const scale = Math.min((containerW - 40) / contentW, (containerH - 40) / contentH, 1);
    slideTextContent.style.transform = `scale(${scale})`;
  }

  const resizeObserver = new ResizeObserver(() => requestAnimationFrame(fitTextBlock));
  if (slideDisplay) resizeObserver.observe(slideDisplay);
  if (slideTextContainer) resizeObserver.observe(slideTextContainer);

  function attachBasicAudioListeners(aEl) {
    aEl.addEventListener('timeupdate', () => updateSlide(aEl.currentTime));
    aEl.addEventListener('seeking', () => updateSlide(aEl.currentTime));
    aEl.addEventListener('play', () => {
        resetHideControlsTimer();
    });
    aEl.addEventListener('pause', () => { 
        clearTimeout(hideControlsTimeout); 
        showControls(); 
    });
  }

  function replaceAudioElementWithClone() {
    const clone = audioPlayer.cloneNode(true);
    audioPlayer.parentNode.replaceChild(clone, audioPlayer);
    audioPlayer = document.getElementById('audio-player');
    attachBasicAudioListeners(audioPlayer);
  }

  function tryLocalFallback(baseName) {
    const a = audioPlayer;
    const exts = ['.mp3', '.m4a', '.wav', '.mp4'];
    let i = 0;
    const tryNext = () => {
      i++;
      if (i < exts.length) { a.src = `audio/${baseName}${exts[i]}`; a.load(); } 
      else { console.error(`No local audio found for '${baseName}'.`); }
    };
    a.addEventListener('error', tryNext);
    a.addEventListener('canplay', () => a.removeEventListener('error', tryNext), { once: true });
    a.src = `audio/${baseName}${exts[0]}`;
    a.load();
  }

  function setAudioSourceFromConfigOrLocal(mp3Url, id) {
    replaceAudioElementWithClone();
    if (mp3Url && typeof mp3Url === 'string' && mp3Url.trim() !== '') {
      const onError = () => { audioPlayer.removeEventListener('error', onError); tryLocalFallback(id); };
      audioPlayer.addEventListener('error', onError, { once: true });
      audioPlayer.src = mp3Url.trim();
      audioPlayer.load();
    } else {
      tryLocalFallback(id);
    }
  }

  function updateSlide(currentTime) {
    let slideToShowIndex = -1;
    for (let i = 0; i < slidesData.length; i++) {
      if (currentTime >= slidesData[i].timestamp) slideToShowIndex = i;
      else break;
    }
    if (slideToShowIndex !== currentSlideIndex) {
      const isInitialLoad = currentSlideIndex === -1;
      clearTimeout(window.textAnimationTimeout);
      const slide = slidesData[slideToShowIndex];
      if (slide && (getSlideType(slide) === 'quiz')) {
        audioPlayer.pause();
        displayQuiz(slide);
      } else {
        quizOverlay.style.display = 'none';
        renderSlide(slideToShowIndex);
        setTimeout(() => startTextAnimation(slide), isInitialLoad ? 50 : 400);
      }
      currentSlideIndex = slideToShowIndex;
    }
  }

  function displayQuiz(slide) {
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const feedbackEl = document.getElementById('quiz-feedback');
    questionEl.textContent = slide.question;
    optionsEl.innerHTML = '';
    feedbackEl.textContent = '';
    slide.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => {
            if (option.isCorrect) {
                feedbackEl.textContent = 'Correct!';
                feedbackEl.style.color = '#68d391';
                setTimeout(() => { quizOverlay.style.display = 'none'; audioPlayer.play(); }, 1000);
            } else {
                feedbackEl.textContent = 'Incorrect. Please try again.';
                feedbackEl.style.color = '#fc8181';
            }
        };
        optionsEl.appendChild(button);
    });
    quizOverlay.style.display = 'flex';
  }

  function setZoomHintText() {
    if (!zoomHintEl) return;
    const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const minus = isApple ? '⌘−' : 'Ctrl−';
    const reset = isApple ? '⌘0' : 'Ctrl+0';
    zoomHintEl.textContent = `Tipp: Browser-Zoom verkleinern (${minus}). Zurücksetzen: ${reset}.`;
  }

  function showControls() { audioPlayer.classList.remove('hidden'); }
  function hideControls() { audioPlayer.classList.add('hidden'); }
  function resetHideControlsTimer() {
    clearTimeout(hideControlsTimeout);
    showControls();
    hideControlsTimeout = setTimeout(hideControls, 2500);
  }

  if (slideDisplay) {
    slideDisplay.addEventListener('mousemove', resetHideControlsTimer);
    slideDisplay.addEventListener('mouseleave', () => { hideControlsTimeout = setTimeout(hideControls, 400); });
  }

  function loadPresentation(id, rawData) {
    presentationId = id;
    currentSlideIndex = -1;
    quizOverlay.style.display = 'none';
    const { source, entries, mp3 } = rawData;
        if (sourceLinkWrap) {
            if (source) {
                const linkRegex = /\[(.+?)\]\((.+?)\)/; // Regex to find [text](url)
                const match = source.match(linkRegex);

                if (match && match[1] && match[2]) {
                    // It's a Markdown link
                    const linkText = escapeHTML(match[1]);
                    const linkUrl = match[2];
                    sourceLinkWrap.innerHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
                } else if (source.startsWith('http')) {
                    // It's just a plain URL
                    sourceLinkWrap.innerHTML = `<a href="${source}" target="_blank" rel="noopener noreferrer">${escapeHTML(source)}</a>`;
                } else {
                    // It's plain text
                    sourceLinkWrap.textContent = source;
                }
            } else {
                // No source provided
                sourceLinkWrap.innerHTML = '–';
            }
        }
        setAudioSourceFromConfigOrLocal(mp3, id);

    audioPlayer.addEventListener('loadedmetadata', () => {
        const audioDuration = audioPlayer.duration;
        slidesData = (entries || [])
            .map((item, index) => ({ ...item, index, timestamp: parseTimestamp(item.timestamp) }))
            .sort((a, b) => a.timestamp - b.timestamp);
        slidesData.forEach((slide, index) => {
            slide.duration = (index < slidesData.length - 1)
                ? slidesData[index + 1].timestamp - slide.timestamp
                : audioDuration - slide.timestamp;
        });
        
        // Always load the first slide immediately
        if (slidesData.length > 0) {
            renderSlide(0);
            setTimeout(() => startTextAnimation(slidesData[0]), 50);
            currentSlideIndex = 0;
        }
        
        resetHideControlsTimer();
    }, { once: true });
  }

  // This listener handles data sent from the editor iframe
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'loadData') {
        const id = event.data.id || 'test'; // Default to 'test' if editor sends no ID
        loadPresentation(id, event.data.data);
    }
  });

  function initialize() {
    setZoomHintText();
    attachBasicAudioListeners(audioPlayer);
    
    // This block runs ONLY when the page is opened directly, NOT in the editor's iframe
    if (window.self === window.top) {
      // Use the 'Id' from URL, or default to 'test' if it's missing
      const id = new URLSearchParams(location.search).get('Id') || 'test';
      const slidesFile = `${id}.json`;
      fetch(`json/${slidesFile}`)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then(rawData => loadPresentation(id, rawData))
        .catch(error => {
          console.error("Error loading presentation data:", error);
          if (slideTextContent) {
            slideTextContent.innerHTML = `<p style="color:red;">Fehler: Konnte die Slides nicht laden (${escapeHTML(slidesFile)}).</p>`;
          }
        });
    }
  }

  initialize();
});