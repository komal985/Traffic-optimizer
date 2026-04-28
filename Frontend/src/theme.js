export const tokens = {
  light: {
    /* =========================
       Core Background System
    ========================== */
    bg: '#f8fafc',                  // Slate 50
    bgElevated: '#ffffff',
    bgSurface: 'rgba(255, 255, 255, 0.75)',
    bgCard: 'rgba(255, 255, 255, 0.6)',
    bgHover: 'rgba(241, 245, 249, 0.9)',

    /* =========================
       Text System
    ========================== */
    textPrimary: '#020617',          // Slate 950
    textSecondary: '#334155',        // Slate 700
    textMuted: '#64748b',            // Slate 500
    textDisabled: '#94a3b8',         // Slate 400

    /* =========================
       Brand & Accent Colors
    ========================== */
    primary: '#0284c7',              // Sky 600
    primaryHover: '#0369a1',         // Sky 700
    secondary: '#4f46e5',            // Indigo 600
    secondaryHover: '#4338ca',       // Indigo 700

    /* =========================
       State Colors
    ========================== */
    success: '#16a34a',
    successBg: 'rgba(22, 163, 74, 0.12)',
    warning: '#d97706',
    warningBg: 'rgba(217, 119, 6, 0.12)',
    error: '#dc2626',
    errorBg: 'rgba(220, 38, 38, 0.12)',
    info: '#2563eb',
    infoBg: 'rgba(37, 99, 235, 0.12)',

    /* =========================
       UI Structure
    ========================== */
    border: 'rgba(15, 23, 42, 0.12)',
    divider: 'rgba(15, 23, 42, 0.08)',
    outlineFocus: 'rgba(2, 132, 199, 0.4)',

    /* =========================
       Effects
    ========================== */
    backdrop: 'blur(14px) saturate(140%)',
    shadowSm: '0 2px 8px rgba(0,0,0,0.06)',
    shadowMd: '0 8px 24px rgba(0,0,0,0.1)',
    shadowLg: '0 16px 48px rgba(0,0,0,0.12)',

    /* =========================
       Gradients
    ========================== */
    gradientPrimary:
      'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    gradientSubtle:
      'linear-gradient(180deg, rgba(14,165,233,0.12), rgba(99,102,241,0.04))',
  },

  dark: {
    /* =========================
       Core Background System
    ========================== */
    bg: '#020617',                 // Slate 950 – true dark
    bgElevated: '#020617ee',        // Slight translucency
    bgSurface: 'rgba(15, 23, 42, 0.75)', // Main glass surface
    bgCard: 'rgba(30, 41, 59, 0.65)',    // Card layer
    bgHover: 'rgba(51, 65, 85, 0.6)',

    /* =========================
       Text System
    ========================== */
    textPrimary: '#f8fafc',         // Slate 50
    textSecondary: '#cbd5f5',       // Slate 300
    textMuted: '#94a3b8',           // Slate 400
    textDisabled: '#64748b',        // Slate 500

    /* =========================
       Brand & Accent Colors
    ========================== */
    primary: '#38bdf8',             // Sky 400
    primaryHover: '#0ea5e9',        // Sky 500
    secondary: '#818cf8',           // Indigo 400
    secondaryHover: '#6366f1',      // Indigo 500

    /* =========================
       State Colors
    ========================== */
    success: '#4ade80',
    successBg: 'rgba(74, 222, 128, 0.15)',
    warning: '#fbbf24',
    warningBg: 'rgba(251, 191, 36, 0.15)',
    error: '#f87171',
    errorBg: 'rgba(248, 113, 113, 0.15)',
    info: '#60a5fa',
    infoBg: 'rgba(96, 165, 250, 0.15)',

    /* =========================
       UI Structure
    ========================== */
    border: 'rgba(148, 163, 184, 0.18)',
    divider: 'rgba(148, 163, 184, 0.12)',
    outlineFocus: 'rgba(56, 189, 248, 0.5)',

    /* =========================
       Effects
    ========================== */
    backdrop: 'blur(14px) saturate(140%)',
    shadowSm: '0 2px 8px rgba(0,0,0,0.25)',
    shadowMd: '0 8px 24px rgba(0,0,0,0.35)',
    shadowLg: '0 16px 48px rgba(0,0,0,0.45)',

    /* =========================
       Gradients
    ========================== */
    gradientPrimary:
      'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
    gradientSubtle:
      'linear-gradient(180deg, rgba(56,189,248,0.15), rgba(129,140,248,0.05))',
  }
};
