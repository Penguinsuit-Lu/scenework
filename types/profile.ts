export type ThemeTexture = 'none' | 'diagonal' | 'dots' | 'grid' | 'paper';

export type SceneTheme = {
  layout: 'myspace' | 'standard';
  accentColor: string;
  secondaryColor: string;
  textColor: string;
  cardColor: string;
  texture: ThemeTexture;
  backgroundOpacity: number; // 0..1
  modules: { id: 'pinned'|'top_films'|'about'|'skills'; enabled: boolean }[];
};

export type TopFilm = {
  title: string;
  year?: number;
};

export type PortfolioItem = {
  type: 'image' | 'video';
  url: string;
  title?: string;
  pinned?: boolean;    // NEW: show in "Pinned Work"
};
