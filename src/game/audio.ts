/** Very quiet, slow ambient drone built with WebAudio — no audio files needed. */
export class AmbientAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  start() {
    if (this.ctx) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 240;
    filter.connect(master);

    const voices: Array<[number, number, number]> = [
      [55, 0.5, 0],
      [82.5, 0.22, 5],
      [110, 0.1, -4],
    ];
    for (const [freq, level, detune] of voices) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g);
      g.connect(filter);
      osc.start();
    }

    // slow breathing on the filter
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.ctx = ctx;
    this.master = master;
  }

  setMuted(muted: boolean) {
    if (!this.ctx || !this.master) return;
    if (!muted && this.ctx.state === 'suspended') void this.ctx.resume();
    this.master.gain.linearRampToValueAtTime(
      muted ? 0 : 0.07,
      this.ctx.currentTime + 0.5,
    );
  }
}
