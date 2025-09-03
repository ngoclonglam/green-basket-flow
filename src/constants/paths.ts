const env = import.meta.env;

export const PUBLIC_ASSETS = {
    HERO_IMAGE: env.VITE_BASE_URL === '/' ? '/assets/hero-vegetables.jpg' : `${env.VITE_BASE_URL}assets/hero-vegetables.jpg`,
    HERO_VIDEO: env.VITE_BASE_URL === '/' ? '/assets/hero-farmer.mp4' : `${env.VITE_BASE_URL}assets/hero-farmer.mp4`,
    // Add more asset paths as needed
}