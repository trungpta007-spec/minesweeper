import { useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SOUND_KEY } from '../constants/difficulties';

export type SoundName = 'click' | 'reveal' | 'flag' | 'explosion' | 'victory' | 'hint';

/**
 * Every effect is synthesized on the fly with the WebAudio API instead of
 * shipping audio files, so the game stays a single self-contained bundle.
 * The AudioContext is created lazily on first use since browsers block audio
 * until a user gesture occurs.
 */
export function useSound() {
  const [muted, setMuted] = useLocalStorage<boolean>(SOUND_KEY, false);
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const tone = useCallback(
    (ctx: AudioContext, freq: number, startOffset: number, duration: number, type: OscillatorType, gainPeak: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const startAt = ctx.currentTime + startOffset;
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.02);
    },
    []
  );

  const play = useCallback(
    (name: SoundName) => {
      if (muted) return;
      try {
        const ctx = getContext();
        switch (name) {
          case 'click':
            tone(ctx, 520, 0, 0.06, 'sine', 0.12);
            break;
          case 'reveal':
            tone(ctx, 660, 0, 0.08, 'sine', 0.1);
            break;
          case 'flag':
            tone(ctx, 880, 0, 0.05, 'triangle', 0.12);
            tone(ctx, 1100, 0.04, 0.06, 'triangle', 0.08);
            break;
          case 'hint':
            tone(ctx, 740, 0, 0.07, 'triangle', 0.1);
            tone(ctx, 990, 0.06, 0.09, 'triangle', 0.09);
            break;
          case 'explosion': {
            const noise = ctx.createBufferSource();
            const bufferSize = ctx.sampleRate * 0.35;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            noise.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.35, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 900;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
            tone(ctx, 90, 0, 0.3, 'sawtooth', 0.2);
            break;
          }
          case 'victory':
            [523, 659, 784, 1047].forEach((freq, i) => tone(ctx, freq, i * 0.09, 0.22, 'triangle', 0.11));
            break;
        }
      } catch {
        // Audio unavailable — fail silently, sound is decorative.
      }
    },
    [muted, getContext, tone]
  );

  return { play, muted, toggleMuted: () => setMuted((m) => !m) };
}
