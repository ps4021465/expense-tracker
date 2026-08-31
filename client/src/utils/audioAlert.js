/**
 * Web Audio API synthesized alarm sound generator
 * Generates an audible alarm beep sequence without relying on external media files.
 */
let audioCtx = null;
let isAlarmPlaying = false;
let alarmInterval = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play a single two-tone warning beep
 */
const playBeepTone = (frequency, duration, type = 'sine') => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Smooth envelope attack and release
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
};

/**
 * Trigger an audible repeating alarm sequence (Urgent dual-frequency chime)
 */
export const playBudgetAlarm = () => {
  if (isAlarmPlaying) return;
  isAlarmPlaying = true;

  const playSequence = () => {
    // High-low alarm chime
    playBeepTone(880, 0.15, 'triangle'); // Tone 1 (A5)
    setTimeout(() => {
      if (isAlarmPlaying) {
        playBeepTone(659.25, 0.25, 'sine'); // Tone 2 (E5)
      }
    }, 180);
  };

  playSequence();
  // Repeat every 1.1 seconds until stopped
  alarmInterval = setInterval(() => {
    if (isAlarmPlaying) {
      playSequence();
    } else {
      clearInterval(alarmInterval);
    }
  }, 1100);
};

/**
 * Stop the active alarm sound
 */
export const stopBudgetAlarm = () => {
  isAlarmPlaying = false;
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
};
