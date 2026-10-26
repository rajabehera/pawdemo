import React from "react";
import { ChevronRight, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export type PolicyTab = "privacy" | "terms" | "shipping" | "refund" | "faq";

interface FooterProps {
  /** Used only to remove the top margin on the home page. */
  isHome: boolean;
  onGoHome: () => void;
  onGoAI: () => void;
  onGoShopCategory: (categoryId: string) => void;
  onGoPolicy: (tab: PolicyTab) => void;
  onGoSitemap: () => void;
}

const LINK_BASE =
  "w-full text-left py-3.5 md:py-1 px-4 md:px-0 bg-stone-850/45 md:bg-transparent hover:bg-stone-800 md:hover:bg-transparent border border-stone-800/50 md:border-transparent rounded-xl md:rounded-none transition-all cursor-pointer flex items-center justify-between md:inline-flex min-h-[46px] md:min-h-0 select-none active:scale-[0.99] md:active:scale-100";

const SOCIAL_BASE =
  "bg-stone-850 hover:bg-stone-800 text-stone-300 border border-stone-800/80 rounded-xl py-3.5 px-4 md:p-2 text-[12.5px] md:text-[10px] flex items-center justify-center md:justify-start gap-2.5 md:gap-1.5 transition-all outline-none focus:outline-none min-h-[46px] md:min-h-0 font-mono active:scale-95";

const CONTACT_BASE =
  "flex items-center justify-between py-3.5 md:py-1 px-4 md:px-0 bg-stone-850/45 md:bg-transparent hover:bg-stone-800 md:hover:bg-transparent border border-stone-800/50 md:border-transparent rounded-xl md:rounded-none text-stone-300 md:text-stone-400 hover:text-white transition-all duration-200 group min-h-[46px] md:min-h-0 select-none active:scale-[0.99] md:active:scale-100";

interface FooterLinkProps {
  onClick: () => void;
  children: React.ReactNode;
  /** Highlighted variant (used for the AI coach link). */
  accent?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({ onClick, children, accent }) => (
  <li className="w-full">
    <button
      type="button"
      onClick={onClick}
      className={`${LINK_BASE} ${accent ? "hover:text-teal-400 font-bold" : "hover:text-white"}`}
    >
      {children}
      <ChevronRight className={`h-4 w-4 md:hidden ${accent ? "text-stone-400" : "text-stone-500"}`} />
    </button>
  </li>
);

const PolicyLabel: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <span className="flex items-center gap-2.5">
    <span className="text-stone-400 text-sm">{icon}</span>
    <span>{label}</span>
  </span>
);

export const Footer: React.FC<FooterProps> = ({
  isHome,
  onGoHome,
  onGoAI,
  onGoShopCategory,
  onGoPolicy,
  onGoSitemap,
}) => {
  return (
    <footer
      className={`bg-[#102e25] border-t border-stone-850 text-stone-300 font-sans text-xs pt-16 pb-28 md:pb-8 px-6 sm:px-12 relative overflow-hidden ${isHome ? "mt-0" : "mt-16"}`}
    >
      {/* Ambient backlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.03),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.02),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-stone-800">
          {/* Column 1: Brand + contact */}
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2">
              <img src="/images/pawwcious_logo.webp" alt="pawwcious footer logo" width="25px" height="25px" loading="lazy" decoding="async" />
              <span className="font-extrabold text-sm tracking-wider uppercase text-white font-mono">Pawwcious</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed font-light">
              India's elite digital ecosystem catering to haute-couture wellness, clinical-grade supplements, and botanical grooming matrices for respected pet companions.
            </p>

            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider font-mono">Concierge Hub</p>
              <div className="flex flex-col gap-3 md:gap-2 text-[13px] md:text-[11px] text-stone-400">
                <a href="tel:+919876543210" className={CONTACT_BASE}>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="h-3.5 w-3.5 text-amber-500 group-hover:scale-110 transition shrink-0" />
                    </div>
                    <span>+91 98765 43210</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-stone-500 md:hidden" />
                </a>
                <a href="mailto:pawwcious@gmail.com" className={CONTACT_BASE}>
                  <div className="flex items-center gap-3 max-w-full overflow-hidden">
                    <div className="h-6 w-6 bg-teal-500/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="h-3.5 w-3.5 text-teal-400 group-hover:scale-110 transition shrink-0" />
                    </div>
                    <span className="truncate">pawwcious@gmail.com</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-stone-500 md:hidden shrink-0" />
                </a>
                <div className="flex items-start gap-3 md:gap-2 pt-2 md:pt-1 text-stone-400 md:text-stone-450 leading-relaxed text-[12px] md:text-[11px]">
                  <span className="text-[14px] md:text-[12px] shrink-0">📍</span>
                  <span>Customs Colony, Marol Military Road, Andheri (E), 400059</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Curated ranges */}
          <div className="space-y-4 text-left">
            <p className="font-extrabold text-[12px] uppercase text-white tracking-widest font-mono">Curated Ranges</p>
            <ul className="flex flex-col gap-3 md:gap-2 text-[13px] md:text-[11px] text-stone-300 md:text-stone-400 w-full">
              <FooterLink onClick={onGoHome}>
                <span>Home Base</span>
              </FooterLink>
              <FooterLink onClick={() => onGoShopCategory("coat-skin-wellness")}>
                <span>Organic Supplements & Vitality</span>
              </FooterLink>
              <FooterLink onClick={() => onGoShopCategory("grooming-hygiene")}>
                <span>Aromatherapy Bath Elixirs</span>
              </FooterLink>
              <FooterLink onClick={onGoAI} accent>
                <span className="flex items-center gap-1.5 md:gap-1 text-teal-350 md:text-stone-300">
                  AI Vet Wellness Coach <span className="text-amber-300 animate-pulse">✨</span>
                </span>
              </FooterLink>
            </ul>
          </div>

          {/* Column 3: Support & policy */}
          <div className="space-y-4 text-left">
            <p className="font-extrabold text-[12px] uppercase text-white tracking-widest font-mono">Support & Policy</p>
            <ul className="flex flex-col gap-3 md:gap-2 text-[13px] md:text-[11px] text-stone-300 md:text-stone-400 w-full">
              <FooterLink onClick={() => onGoPolicy("faq")}>
                <PolicyLabel icon="❔" label="Support FAQs" />
              </FooterLink>
              <FooterLink onClick={() => onGoPolicy("privacy")}>
                <PolicyLabel icon="🛡️" label="Privacy Policy" />
              </FooterLink>
              <FooterLink onClick={() => onGoPolicy("terms")}>
                <PolicyLabel icon="📑" label="Terms & Conditions" />
              </FooterLink>
              <FooterLink onClick={() => onGoPolicy("shipping")}>
                <PolicyLabel icon="🚚" label="Shipping and Delivery Policy" />
              </FooterLink>
              <FooterLink onClick={() => onGoPolicy("refund")}>
                <PolicyLabel icon="↩️" label="Refund & Cancellation Policy" />
              </FooterLink>
              <FooterLink onClick={onGoSitemap}>
                <PolicyLabel icon="🗺️" label="Sitemap (HTML & XML)" />
              </FooterLink>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="space-y-4 text-left">
            <p className="font-extrabold text-[12px] uppercase text-white tracking-widest font-mono">Connect With Us</p>
            <p className="text-[11px] text-stone-400 leading-relaxed font-light">
              Follow our official accounts for bespoke veterinary drops and society galas.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 md:gap-2">
              <a href="https://instagram.com/pawwcious" target="_blank" rel="noreferrer" className={`${SOCIAL_BASE} hover:text-pink-400`}>
                <Instagram className="h-4.5 w-4.5 md:h-3.5 md:w-3.5" />
                <span>Instagram</span>
              </a>
              <a href="https://facebook.com/pawwcious" target="_blank" rel="noreferrer" className={`${SOCIAL_BASE} hover:text-blue-400`}>
                <Facebook className="h-4.5 w-4.5 md:h-3.5 md:w-3.5" />
                <span>Facebook</span>
              </a>
              <a href="https://x.com/pawwcious" target="_blank" rel="noreferrer" className={`${SOCIAL_BASE} hover:text-white col-span-2 sm:col-span-1 md:col-span-1`}>
                <Twitter className="h-4.5 w-4.5 md:h-3.5 md:w-3.5" />
                <span>X</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-stone-500 font-mono">
          <div className="space-y-1 text-center md:text-left">
            <p>© 2026 Pawwcious. All rights reserved.</p>
            <p>
              Website designed and developed by{" "}
              <a href="https://rajabehera.in" target="_blank" rel="noopener noreferrer">Raja Behera</a>
            </p>
          </div>
          <div className="flex gap-4 shrink-0 text-stone-400 text-right">
            <span>GSTIN: 27AABCP1234F1Z8</span>
            <span>•</span>
            <span>CIN: U85100MH2026PTC394852</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
