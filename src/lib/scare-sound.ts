// Synthesized sound effects via the Web Audio API. No audio files needed.

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!Ctor) return null;

  if (!sharedContext || sharedContext.state === 'closed') {
    sharedContext = new Ctor();
  }
  if (sharedContext.state === 'suspended') {
    sharedContext.resume().catch(() => {});
  }
  return sharedContext;
}

function noiseBurst(ctx: AudioContext, destination: AudioNode, startAt: number, duration: number, gainPeak: number) {
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2200;
  filter.Q.value = 0.7;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  source.start(startAt);
  source.stop(startAt + duration);
}

export function playJumpScareSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  const now = ctx.currentTime;

  // Harsh noise burst for the initial "shriek" texture.
  noiseBurst(ctx, master, now, 0.4, 0.6);

  // Descending shriek: a detuned sawtooth sweeping down in pitch.
  const shriek = ctx.createOscillator();
  shriek.type = 'sawtooth';
  shriek.frequency.setValueAtTime(1800, now);
  shriek.frequency.exponentialRampToValueAtTime(180, now + 0.55);

  const shriekGain = ctx.createGain();
  shriekGain.gain.setValueAtTime(0.0001, now);
  shriekGain.gain.linearRampToValueAtTime(0.5, now + 0.03);
  shriekGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

  shriek.connect(shriekGain);
  shriekGain.connect(master);
  shriek.start(now);
  shriek.stop(now + 0.65);

  // Low sub-bass thump for physical "impact".
  const thump = ctx.createOscillator();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(120, now);
  thump.frequency.exponentialRampToValueAtTime(40, now + 0.25);

  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(0.8, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

  thump.connect(thumpGain);
  thumpGain.connect(master);
  thump.start(now);
  thump.stop(now + 0.3);
}

export function playVictoryChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const startAt = now + i * 0.09;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(0.4, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.5);

    osc.connect(gain);
    gain.connect(master);
    osc.start(startAt);
    osc.stop(startAt + 0.55);
  });
}
