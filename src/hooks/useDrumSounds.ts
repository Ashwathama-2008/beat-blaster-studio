// Custom hook for drum sounds
import { useCallback } from 'react';

interface AudioContextRef {
  context: AudioContext | null;
}

const audioContextRef: AudioContextRef = { context: null };

const getAudioContext = (): AudioContext => {
  if (!audioContextRef.context) {
    audioContextRef.context = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContextRef.context;
};

// Create synthetic drum sounds using Web Audio API
const createSyntheticSound = (frequency: number, type: 'kick' | 'snare' | 'hihat' | 'openhat' | 'tom' | 'crash' | 'ride') => {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  const now = context.currentTime;

  switch (type) {
    case 'kick':
      oscillator.frequency.setValueAtTime(60, now);
      oscillator.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
      gainNode.gain.setValueAtTime(1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, now);
      break;
    case 'snare':
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(0.01, now + 0.2);
      gainNode.gain.setValueAtTime(0.8, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      break;
    case 'hihat':
      oscillator.frequency.setValueAtTime(8000, now);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(5000, now);
      break;
    case 'openhat':
      oscillator.frequency.setValueAtTime(6000, now);
      gainNode.gain.setValueAtTime(0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(4000, now);
      break;
    case 'tom':
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, now + 0.3);
      gainNode.gain.setValueAtTime(0.8, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      break;
    case 'crash':
      oscillator.frequency.setValueAtTime(3000, now);
      gainNode.gain.setValueAtTime(0.6, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, now);
      break;
    case 'ride':
      oscillator.frequency.setValueAtTime(4000, now);
      gainNode.gain.setValueAtTime(0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3000, now);
      break;
  }

  oscillator.type = type === 'kick' || type === 'tom' ? 'sine' : 'sawtooth';
  oscillator.start(now);
  oscillator.stop(now + (type === 'crash' || type === 'ride' ? 1 : type === 'kick' ? 0.5 : 0.3));
};

const playAudioFile = async (url: string): Promise<void> => {
  try {
    const audio = new Audio(url);
    audio.volume = 0.7;
    await audio.play();
  } catch (error) {
    console.warn(`Could not play audio file: ${url}`, error);
  }
};

export const useDrumSounds = () => {
  const playSound = useCallback(async (drumType: string) => {
    // First try to resume audio context if needed
    const context = getAudioContext();
    if (context.state === 'suspended') {
      await context.resume();
    }

    // Try to play audio files first, fallback to synthetic sounds
    switch (drumType) {
      case 'kick':
        try {
          await playAudioFile('/sounds/kick.wav');
        } catch {
          createSyntheticSound(60, 'kick');
        }
        break;
      case 'snare':
        try {
          await playAudioFile('/sounds/snare.wav');
        } catch {
          createSyntheticSound(200, 'snare');
        }
        break;
      case 'hihat':
        createSyntheticSound(8000, 'hihat');
        break;
      case 'openhat':
        createSyntheticSound(6000, 'openhat');
        break;
      case 'tom':
        try {
          await playAudioFile('/sounds/tom.wav');
        } catch {
          createSyntheticSound(150, 'tom');
        }
        break;
      case 'crash':
        try {
          await playAudioFile('/sounds/crash.wav');
        } catch {
          createSyntheticSound(3000, 'crash');
        }
        break;
      case 'ride':
        try {
          await playAudioFile('/sounds/ride.wav');
        } catch {
          createSyntheticSound(4000, 'ride');
        }
        break;
      default:
        createSyntheticSound(440, 'tom');
    }
  }, []);

  return { playSound };
};