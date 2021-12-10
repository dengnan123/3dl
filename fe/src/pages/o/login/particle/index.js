import './particles';

const ParticleInit = elementId => {
  const isDark = false;
  window.particlesJS(elementId, {
    particles: {
      color: isDark ? '#333' : '#ddd',
      shape: 'circle', // "circle", "edge" or "triangle"
      opacity: 0.8,
      size: 8,
      size_random: true,
      nb: 80,
      line_linked: {
        enable_auto: true,
        distance: 300,
        color: isDark ? '#333' : '#666',
        opacity: 0.8,
        width: 1,
        condensed_mode: {
          enable: false,
          rotateX: 600,
          rotateY: 600,
        },
      },
      anim: {
        enable: true,
        speed: 1,
      },
    },
    interactivity: {
      enable: true,
      mouse: {
        distance: 500,
      },
      detect_on: 'canvas', // "canvas" or "window"
      mode: 'grab',
      line_linked: {
        opacity: 0.5,
      },
      events: {
        onclick: {
          enable: false,
          mode: 'push', // "push" or "remove"
          nb: 4,
        },
      },
    },
    /* Retina Display Support */
    retina_detect: true,
  });
};

export default ParticleInit;
