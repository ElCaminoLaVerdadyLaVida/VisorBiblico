// VoiceEngine.js — Narra el pasaje con la voz nativa del navegador
// (Web Speech API). Es la opción C del DCM: voz simple, sin espacializar
// en 3D. No existe una forma estándar de conectar speechSynthesis a un
// grafo de Web Audio, así que la espacialización se queda solo para el
// ambiente (ver AudioEngine.js) — mezclar ambas no es técnicamente
// posible con las APIs web estándar.
//
// ESTADO: esto es enteramente nuevo. En ningún punto del historial de
// este proyecto — ni en el HTML original, ni en ninguna versión anterior
// del documento de contexto — existió una sola línea que reprodujera
// narración real. Está escrito con cuidado sobre la documentación de la
// Web Speech API, pero no se ha podido ejecutar en un navegador real
// desde este chat (sin acceso a red ni pantalla en este entorno).
// Al probarlo con `npm run dev`, confirma en especial:
//   1) que se oye la voz;
//   2) si tu navegador manda el evento 'boundary' por palabra (si no,
//      caerá automáticamente al resaltado por versículo completo);
//   3) si la voz en español disponible en tu sistema suena aceptable.

export class VoiceEngine {
  constructor({ lang = 'es-ES', rate = 0.95 } = {}) {
    this.synth = window.speechSynthesis || null;
    this.lang = lang;
    this.rate = rate;
    this.supported = !!this.synth;

    this.onVerseStart = null; // (verseIndex) => void
    this.onWordBoundary = null; // (verseIndex, charIndex) => void
    this.onVerseEnd = null; // (verseIndex) => void
    this.onSequenceEnd = null; // () => void
    this.onBoundaryUnavailable = null; // (verseIndex) => void

    this._queue = [];
    this._currentIndex = -1;
    this._boundaryFallbackTimer = null;
  }

  // Nota: en varios navegadores getVoices() devuelve una lista vacía
  // hasta que el evento 'voiceschanged' se dispara una vez. Como esto se
  // llama recién al presionar reproducir (después de que la página ya
  // lleva un rato cargada), normalmente ya está poblada — pero si la
  // primera vez no encuentra voz en español, es la causa más probable.
  pickVoice() {
    if (!this.supported) return null;
    const voices = this.synth.getVoices();
    return (
      voices.find((v) => v.lang === this.lang) ||
      voices.find((v) => v.lang && v.lang.startsWith('es')) ||
      null
    );
  }

  // "verses" siempre es el arreglo COMPLETO de la perícopa; "startIndex"
  // es desde qué versículo empezar. (Antes recibía un .slice() del
  // arreglo, lo que reiniciaba el índice en 0 y desincronizaba el
  // resaltado de texto y el cambio de escena al saltar de versículo —
  // corregido antes de que llegaras a probarlo.)
  speakSequence(verses, startIndex = 0) {
    if (!this.supported) return false;
    this.stop();
    this._queue = verses;
    this._currentIndex = startIndex - 1;
    this._speakNext();
    return true;
  }

  _speakNext() {
    this._currentIndex += 1;
    if (this._currentIndex >= this._queue.length) {
      if (this.onSequenceEnd) this.onSequenceEnd();
      return;
    }
    const index = this._currentIndex;
    const verseText = this._queue[index].text;
    const utterance = new SpeechSynthesisUtterance(verseText);
    utterance.lang = this.lang;
    utterance.rate = this.rate;
    const voice = this.pickVoice();
    if (voice) utterance.voice = voice;

    let gotBoundary = false;
    clearTimeout(this._boundaryFallbackTimer);
    this._boundaryFallbackTimer = setTimeout(() => {
      if (!gotBoundary && this.onBoundaryUnavailable) {
        this.onBoundaryUnavailable(index);
      }
    }, 700);

    utterance.onstart = () => {
      if (this.onVerseStart) this.onVerseStart(index);
    };
    utterance.onboundary = (event) => {
      gotBoundary = true;
      if (this.onWordBoundary) this.onWordBoundary(index, event.charIndex);
    };
    utterance.onend = () => {
      clearTimeout(this._boundaryFallbackTimer);
      if (this.onVerseEnd) this.onVerseEnd(index);
      this._speakNext();
    };
    utterance.onerror = () => {
      clearTimeout(this._boundaryFallbackTimer);
      this._speakNext();
    };

    this.synth.speak(utterance);
  }

  pause() {
    if (this.supported && this.synth.speaking) this.synth.pause();
  }

  resume() {
    if (this.supported && this.synth.paused) this.synth.resume();
  }

  stop() {
    clearTimeout(this._boundaryFallbackTimer);
    if (this.supported) this.synth.cancel();
    this._queue = [];
    this._currentIndex = -1;
  }
}
