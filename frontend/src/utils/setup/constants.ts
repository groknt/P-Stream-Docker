const getEnv = (key: string, fallback: string | undefined) => {
  if (typeof window !== "undefined" && (window as any).__CONFIG__) {
    return (window as any).__CONFIG__[`VITE_${key}`] ?? fallback;
  }

  return fallback;
};

export const APP_VERSION = import.meta.env.PACKAGE_VERSION;
export const DISCORD_LINK = "https://discord.gg/7z6znYgrTG";
export const GITHUB_LINK = "https://github.com/p-stream/p-stream";

export const GA_ID = getEnv("GA_ID", import.meta.env.VITE_GA_ID);
export const BACKEND_URL = getEnv(
  "BACKEND_URL",
  import.meta.env.VITE_BACKEND_URL,
);
