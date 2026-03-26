export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#hero" },
      { label: "Capabilities", href: "#features" },
      { label: "Network", href: "#features" },
      { label: "Manifest", href: "#manifest" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#story" },
      { label: "Careers", href: "#final-cta" },
      { label: "Press", href: "#manifest" },
      { label: "Contact", href: "#footer" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#features" },
      { label: "Security", href: "#features" },
      { label: "Status", href: "#story" },
      { label: "Support", href: "#final-cta" },
    ],
  },
];

export const footerLegalLinks: FooterLink[] = [
  { label: "Privacy", href: "#footer" },
  { label: "Terms", href: "#footer" },
];

