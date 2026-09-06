/**
 * GOD — Global Opportunity & Data Intelligence
 * Central Design & Motion System Tokens
 */

export const themeTokens = {
  colors: {
    base: {
      void: '#02040a',        // Deepest dark cinematic background
      surface: '#050814',     // Primary dark surface
      elevated: '#0a0f24',    // Hover & elevated card surface
      overlay: '#0d1430',     // Top layer modals & overlays
    },
    borders: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      accent: 'rgba(56, 189, 248, 0.15)',
      active: 'rgba(56, 189, 248, 0.4)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
    },
    signal: {
      positive: '#10b981',    // Discrete tech emerald
      negative: '#f43f5e',    // Discrete coral red
      neutral: '#38bdf8',     // Subtle cyan blue
      warning: '#f59e0b',     // Discrete amber
    },
    ai: {
      primary: '#0284c7',     // GOD AI Engine primary accent
      glow: 'rgba(2, 132, 199, 0.25)',
      violet: '#6366f1',
    },
  },

  motion: {
    micro: 'transition-all duration-100 ease-out',
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-250 ease-in-out',
    slow: 'transition-all duration-400 ease-in-out',
    ambient: 'animate-pulse duration-1000',
  },

  typography: {
    tabular: 'font-mono tabular-nums tracking-tight',
    heading: 'font-sans font-black tracking-tight uppercase',
    label: 'font-mono text-[9px] uppercase tracking-wider text-slate-400',
  }
};
