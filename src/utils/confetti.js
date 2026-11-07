import confetti from 'canvas-confetti';

export function fireVictoryConfetti() {
  if (typeof window === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#FF70A6', '#FFD670', '#70D6FF']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#D8B4FE', '#FF9770', '#E9FF70']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#FF70A6', '#A855F7', '#6EE7B7']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    shapes: ['star'],
    colors: ['#FFE600', '#FF70A6', '#70D6FF']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#FFD670', '#FF70A6']
  });
}

export function fireBubbleSparkles(x, y) {
  if (typeof window === 'undefined') return;

  // Normalize client coordinates to 0..1 for confetti origin
  const originX = Math.max(0, Math.min(1, x / window.innerWidth));
  const originY = Math.max(0, Math.min(1, y / window.innerHeight));

  confetti({
    particleCount: 25,
    spread: 50,
    startVelocity: 20,
    origin: { x: originX, y: originY },
    colors: ['#FF70A6', '#FFD670', '#70D6FF', '#D8B4FE'],
    shapes: ['circle', 'star'],
    scalar: 0.8,
    ticks: 40,
    gravity: 0.6,
  });
}
