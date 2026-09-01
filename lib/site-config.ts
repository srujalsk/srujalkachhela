export interface SiteConfig {
  siteUrl: string;
  basePath: string;
  titleTemplate: string;
  defaultTitle: string;
  description: string;
  author: string;
  locale: string;
  /** Footer visibility — hidden for now, flip to re-enable. */
  showFooter: boolean;
}
