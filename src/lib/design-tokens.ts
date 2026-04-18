export const colors = {
  primary: {
    ink: "#0D0D0D",
    paper: "#F7F5F0",
    accent: "#FF4D00",
    accentSoft: "#FFF0EA",
  },
  secondary: {
    blue: "#1A3FFF",
    yellow: "#FFE600",
    green: "#00C46A",
  },
  neutral: {
    gray100: "#F0EDE8",
    gray300: "#C4BFB8",
    gray500: "#7A746E",
    gray700: "#3D3935",
  },
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const borderRadius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  full: "9999px",
} as const;

export const shadows = {
  sm: "2px 2px 0 0 #0D0D0D",
  md: "4px 4px 0 0 #0D0D0D",
  lg: "6px 6px 0 0 #0D0D0D",
  xl: "8px 8px 0 0 #0D0D0D",
} as const;

export const typography = {
  fonts: {
    display: "var(--font-syne)",
    body: "var(--font-dm-sans)",
    mono: "var(--font-dm-mono)",
  },
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const transitions = {
  fast: "100ms ease",
  normal: "200ms ease",
  slow: "300ms ease",
} as const;

export const zIndex = {
  base: "0",
  dropdown: "100",
  sticky: "200",
  modal: "300",
  popover: "400",
  toast: "500",
} as const;