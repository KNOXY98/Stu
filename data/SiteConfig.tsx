import { ISiteConfig } from "../src/types"

export const config: ISiteConfig = {
  home: "prelaunch",
  readThreshold: 42000,
  softReadThreshold: 7000,
  conciergeSync: 30000,
  impressionsDelay: 22000,
  slogan: "The Internet Fixers | Tech Incubators",
  footer:
    "Tract Stack by At Risk Media | Intelligent no-code landing pages for product-market-fit validation",
  social: [
    {
      name: "Twitter",
      href: "https://twitter.com/AtRiskMedia",
    },
    {
      name: "GitLab",
      href: "https://gitlab.com/AtRiskMedia",
    },
    {
      name: "GitHub",
      href: "https://github.com/AtRiskMedia",
    },
  ],
  localStorageKey: `shopify_checkout_id`,
  initializeShopify: true,
}
