export type ResourceCategoryStyle = {
  card: string;
  accent: string;
  badge: string;
  iconBg: string;
  hoverGlow: string;
};

export const DEFAULT_CATEGORY_STYLE: ResourceCategoryStyle = {
  card: `
    border-border
    bg-card
  `,
  accent: "bg-muted",
  badge: `
    bg-muted
    text-muted-foreground
    border-border
  `,
  iconBg: "bg-muted",
  hoverGlow: "hover:shadow-md",
};

export const CATEGORY_STYLES: Record<string, ResourceCategoryStyle> = {
  frontend: {
    card: `
      border-sky-200/70 dark:border-sky-900/60
      bg-gradient-to-br from-sky-50 via-background to-background
      dark:from-sky-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-sky-500",
    badge: `
      border-sky-200 bg-sky-100 text-sky-700
      dark:border-sky-800 dark:bg-sky-900/50 dark:text-sky-300
    `,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    hoverGlow: "hover:shadow-sky-100 dark:hover:shadow-sky-950/30",
  },

  backend: {
    card: `
      border-emerald-200/70 dark:border-emerald-900/60
      bg-gradient-to-br from-emerald-50 via-background to-background
      dark:from-emerald-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-emerald-500",
    badge: `
      border-emerald-200 bg-emerald-100 text-emerald-700
      dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300
    `,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    hoverGlow: "hover:shadow-emerald-100 dark:hover:shadow-emerald-950/30",
  },

  fullstack: {
    card: `
      border-violet-200/70 dark:border-violet-900/60
      bg-gradient-to-br from-violet-50 via-background to-background
      dark:from-violet-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-violet-500",
    badge: `
      border-violet-200 bg-violet-100 text-violet-700
      dark:border-violet-800 dark:bg-violet-900/50 dark:text-violet-300
    `,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    hoverGlow: "hover:shadow-violet-100 dark:hover:shadow-violet-950/30",
  },

  devops: {
    card: `
      border-orange-200/70 dark:border-orange-900/60
      bg-gradient-to-br from-orange-50 via-background to-background
      dark:from-orange-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-orange-500",
    badge: `
      border-orange-200 bg-orange-100 text-orange-700
      dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300
    `,
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    hoverGlow: "hover:shadow-orange-100 dark:hover:shadow-orange-950/30",
  },

  testing: {
    card: `
      border-amber-200/70 dark:border-amber-900/60
      bg-gradient-to-br from-amber-50 via-background to-background
      dark:from-amber-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-amber-500",
    badge: `
      border-amber-200 bg-amber-100 text-amber-700
      dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-300
    `,
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    hoverGlow: "hover:shadow-amber-100 dark:hover:shadow-amber-950/30",
  },

  database: {
    card: `
      border-cyan-200/70 dark:border-cyan-900/60
      bg-gradient-to-br from-cyan-50 via-background to-background
      dark:from-cyan-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-cyan-500",
    badge: `
      border-cyan-200 bg-cyan-100 text-cyan-700
      dark:border-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300
    `,
    iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
    hoverGlow: "hover:shadow-cyan-100 dark:hover:shadow-cyan-950/30",
  },

  design: {
    card: `
      border-pink-200/70 dark:border-pink-900/60
      bg-gradient-to-br from-pink-50 via-background to-background
      dark:from-pink-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-pink-500",
    badge: `
      border-pink-200 bg-pink-100 text-pink-700
      dark:border-pink-800 dark:bg-pink-900/50 dark:text-pink-300
    `,
    iconBg: "bg-pink-100 dark:bg-pink-900/40",
    hoverGlow: "hover:shadow-pink-100 dark:hover:shadow-pink-950/30",
  },

  api: {
    card: `
      border-indigo-200/70 dark:border-indigo-900/60
      bg-gradient-to-br from-indigo-50 via-background to-background
      dark:from-indigo-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-indigo-500",
    badge: `
      border-indigo-200 bg-indigo-100 text-indigo-700
      dark:border-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300
    `,
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    hoverGlow: "hover:shadow-indigo-100 dark:hover:shadow-indigo-950/30",
  },

  cms: {
    card: `
      border-lime-200/70 dark:border-lime-900/60
      bg-gradient-to-br from-lime-50 via-background to-background
      dark:from-lime-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-lime-500",
    badge: `
      border-lime-200 bg-lime-100 text-lime-700
      dark:border-lime-800 dark:bg-lime-900/50 dark:text-lime-300
    `,
    iconBg: "bg-lime-100 dark:bg-lime-900/40",
    hoverGlow: "hover:shadow-lime-100 dark:hover:shadow-lime-950/30",
  },

  hosting: {
    card: `
      border-teal-200/70 dark:border-teal-900/60
      bg-gradient-to-br from-teal-50 via-background to-background
      dark:from-teal-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-teal-500",
    badge: `
      border-teal-200 bg-teal-100 text-teal-700
      dark:border-teal-800 dark:bg-teal-900/50 dark:text-teal-300
    `,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    hoverGlow: "hover:shadow-teal-100 dark:hover:shadow-teal-950/30",
  },

  authentication: {
    card: `
      border-rose-200/70 dark:border-rose-900/60
      bg-gradient-to-br from-rose-50 via-background to-background
      dark:from-rose-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-rose-500",
    badge: `
      border-rose-200 bg-rose-100 text-rose-700
      dark:border-rose-800 dark:bg-rose-900/50 dark:text-rose-300
    `,
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    hoverGlow: "hover:shadow-rose-100 dark:hover:shadow-rose-950/30",
  },

  ai: {
    card: `
      border-fuchsia-200/70 dark:border-fuchsia-900/60
      bg-gradient-to-br from-fuchsia-50 via-background to-background
      dark:from-fuchsia-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-fuchsia-500",
    badge: `
      border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700
      dark:border-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300
    `,
    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/40",
    hoverGlow: "hover:shadow-fuchsia-100 dark:hover:shadow-fuchsia-950/30",
  },

  analytics: {
    card: `
      border-blue-200/70 dark:border-blue-900/60
      bg-gradient-to-br from-blue-50 via-background to-background
      dark:from-blue-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-blue-500",
    badge: `
      border-blue-200 bg-blue-100 text-blue-700
      dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300
    `,
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    hoverGlow: "hover:shadow-blue-100 dark:hover:shadow-blue-950/30",
  },

  productivity: {
    card: `
      border-purple-200/70 dark:border-purple-900/60
      bg-gradient-to-br from-purple-50 via-background to-background
      dark:from-purple-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-purple-500",
    badge: `
      border-purple-200 bg-purple-100 text-purple-700
      dark:border-purple-800 dark:bg-purple-900/50 dark:text-purple-300
    `,
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    hoverGlow: "hover:shadow-purple-100 dark:hover:shadow-purple-950/30",
  },

  security: {
    card: `
      border-red-200/70 dark:border-red-900/60
      bg-gradient-to-br from-red-50 via-background to-background
      dark:from-red-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-red-500",
    badge: `
      border-red-200 bg-red-100 text-red-700
      dark:border-red-800 dark:bg-red-900/50 dark:text-red-300
    `,
    iconBg: "bg-red-100 dark:bg-red-900/40",
    hoverGlow: "hover:shadow-red-100 dark:hover:shadow-red-950/30",
  },

  mobile: {
    card: `
      border-slate-300/70 dark:border-slate-700/70
      bg-gradient-to-br from-slate-50 via-background to-background
      dark:from-slate-900/40 dark:via-background dark:to-background
    `,
    accent: "bg-slate-500",
    badge: `
      border-slate-200 bg-slate-100 text-slate-700
      dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300
    `,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    hoverGlow: "hover:shadow-slate-200 dark:hover:shadow-slate-900/30",
  },

  deployment: {
    card: `
      border-yellow-200/70 dark:border-yellow-900/60
      bg-gradient-to-br from-yellow-50 via-background to-background
      dark:from-yellow-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-yellow-500",
    badge: `
      border-yellow-200 bg-yellow-100 text-yellow-700
      dark:border-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300
    `,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
    hoverGlow: "hover:shadow-yellow-100 dark:hover:shadow-yellow-950/30",
  },

  monitoring: {
    card: `
      border-green-200/70 dark:border-green-900/60
      bg-gradient-to-br from-green-50 via-background to-background
      dark:from-green-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-green-500",
    badge: `
      border-green-200 bg-green-100 text-green-700
      dark:border-green-800 dark:bg-green-900/50 dark:text-green-300
    `,
    iconBg: "bg-green-100 dark:bg-green-900/40",
    hoverGlow: "hover:shadow-green-100 dark:hover:shadow-green-950/30",
  },

  collaboration: {
    card: `
      border-violet-200/70 dark:border-violet-900/60
      bg-gradient-to-br from-violet-50 via-background to-background
      dark:from-violet-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-violet-500",
    badge: `
      border-violet-200 bg-violet-100 text-violet-700
      dark:border-violet-800 dark:bg-violet-900/50 dark:text-violet-300
    `,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    hoverGlow: "hover:shadow-violet-100 dark:hover:shadow-violet-950/30",
  },

  learning: {
    card: `
      border-emerald-200/70 dark:border-emerald-900/60
      bg-gradient-to-br from-emerald-50 via-background to-background
      dark:from-emerald-950/30 dark:via-background dark:to-background
    `,
    accent: "bg-emerald-500",
    badge: `
      border-emerald-200 bg-emerald-100 text-emerald-700
      dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300
    `,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    hoverGlow: "hover:shadow-emerald-100 dark:hover:shadow-emerald-950/30",
  },
};

export function getCategoryStyle(category?: string): ResourceCategoryStyle {
  if (!category) return DEFAULT_CATEGORY_STYLE;
  return CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE;
}
