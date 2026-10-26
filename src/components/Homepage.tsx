import React, { useEffect, useState } from "react";

import heroImg from "../assets/images/complete_grooming_pack_1.png";
import bundleImg from "../assets/images/hompage.webp";
import furlushImg from "../assets/images/furlush_bottle.webp";
import furbreezeImg from "../assets/images/furbreeze_powder.webp";
import squeakearImg from "../assets/images/squeakear_earwash.webp";
import chewImg from "../assets/images/coffee_wood_chew.webp";
import founderImg from "../assets/images/founder.webp";

/* ─────────────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────────────── */
export type RouteKey = "furlush" | "furbreeze" | "squeakear" | "chew" | "pack";

export interface HomePageProps {
  /** Override where each product / pack link goes (defaults below). */
  routes?: Partial<Record<RouteKey, string>>;
  /**
   * Optional SPA navigation handler. When provided, clicks on non-hash links
   * call this instead of doing a full page load (e.g. `navigate` from your router).
   */
  onNavigate?: (href: string) => void;
  /** External "current site" link in the footer. */
  siteUrl?: string;
  banners?: any;
  categories?: any;
  bestSellers?: any;
  blogs?: any;
  testimonials?: any;
  reviewReels?: any;
  onAddTestimonial?: (testimonial: any) => Promise<void> | void;
  onSelectCategory?: (catId: any) => void;
  onSelectProduct?: (product: any) => void;
  onSelectProductReviews?: (product: any) => void;
  onSelectView?: (view: any) => void;
  onSelectBlog?: (blog: any) => void;
  products?: any;
  reviews?: any;
  onAddToCart?: any;
  onInstagramModalToggle?: (isOpen: any) => void;
  [key: string]: any;
}

interface NavItem {
  label: string;
  href: string;
}

interface ConcernItem {
  icon: string;
  title: string;
  blurb: string;
  cta: string;
  route: RouteKey;
  bg: string;
}

interface ProductItem {
  tag: string;
  name: string;
  blurb: string;
  cta: string;
  image: string;
  alt: string;
  route: RouteKey;
  visualBg: string;
}

interface WhyItem {
  title: string;
  text: string;
}

interface QuoteItem {
  quote: string;
  source: string;
}

interface FaqItem {
  q: string;
  a: string;
}

/* ─────────────────────────────────────────────────────────────────────────
   Content
   ───────────────────────────────────────────────────────────────────────── */
const DEFAULT_ROUTES: Record<RouteKey, string> = {
  furlush: "/products/furlush-serum",
  furbreeze: "/products/furbreeze-cooling-powder",
  squeakear: "/products/squeakear-ear-wash",
  chew: "/products/coffee-wood-chew",
  pack: "/products/complete-grooming-pack",
};

const NAV_ITEMS: NavItem[] = [
  { label: "Shop by need", href: "#concerns" },
  { label: "Products", href: "#shop" },
  { label: "Complete Pack", href: "#bundle" },
  { label: "Our story", href: "#story" },
  { label: "FAQs", href: "#faq" },
];

const TRUST_STRIP = [
  { label: "Grooming for dogs & cats" },
  { label: "Named natural ingredients" },
  { label: "Pet-parent founded" },
];

const CONCERNS: ConcernItem[] = [
  { icon: "01 / COAT", title: "Rough-feeling fur", blurb: "Make brushing and coat care feel simpler.", cta: "Explore Furlush →", route: "furlush", bg: "bg-white" },
  { icon: "02 / EARS", title: "Waxy-looking ears", blurb: "Build a gentle ear-cleaning routine.", cta: "Explore Squeakear →", route: "squeakear", bg: "bg-white" },
  { icon: "03 / WARM DAYS", title: "Warm-day grooming", blurb: "Keep a powder in the seasonal routine.", cta: "Explore Furbreeze →", route: "furbreeze", bg: "bg-white" },
  { icon: "04 / DOGS", title: "Chew time", blurb: "A coffee wood chew for supervised play.", cta: "Explore the chew →", route: "chew", bg: "bg-white" },
];

const PRODUCTS: ProductItem[] = [
  { tag: "Coat care · dogs & cats", name: "Furlush Serum", blurb: "A light coat-care step for rough-feeling fur. Mist and brush as directed.", cta: "View Furlush →", image: furlushImg, alt: "Pawwcious Furlush Coat Serum bottle", route: "furlush", visualBg: "bg-[#fcf5f1]" },
  { tag: "Ear care · dogs & cats", name: "Squeakear Ear Wash", blurb: "An at-home cleaning routine for ears that look waxy.", cta: "View Squeakear →", image: squeakearImg, alt: "Pawwcious Squeakear Ear Wash bottle", route: "squeakear", visualBg: "bg-[#f4f8ef]" },
  { tag: "Warm-day grooming · dogs & cats", name: "Furbreeze Powder", blurb: "A powder for your pet’s warm-day grooming routine.", cta: "View Furbreeze →", image: furbreezeImg, alt: "Pawwcious Furbreeze Cooling Powder container", route: "furbreeze", visualBg: "bg-[#f7f3fa]" },
  { tag: "Chew time · dogs only", name: "Coffee Wood Chew", blurb: "A dog chew to offer during supervised chew sessions.", cta: "View Coffee Wood Chew →", image: chewImg, alt: "Pawwcious Coffee Wood Chew", route: "chew", visualBg: "bg-[#f1e9dc]" },
];

const WHY: WhyItem[] = [
  { title: "Furlush", text: "Aloe vera, argan oil and jojoba oil" },
  { title: "Furbreeze", text: "Lavender and aloe vera" },
  { title: "Squeakear", text: "Aloe vera and neem" },
];

const QUOTES: QuoteItem[] = [
  { quote: "“The hair serum leaves the coat looking healthy, smooth, and shiny.”", source: "Amazon reviewer · 18 May 2026 · Serum and ear-wash review" },
  { quote: "“The ear cleaner gently removes dirt and odor without irritating my dog’s ears.”", source: "Sunikhi Nandan Dansu · Amazon · 18 May 2026" },
];

const FAQS: FaqItem[] = [
  { q: "What comes in the Complete Grooming Pack?", a: "One Furlush Coat Serum, one Furbreeze Cooling Powder and one Squeakear Ear Wash. Check the pack page for final sizes and current pricing." },
  { q: "Are all Pawwcious products for dogs and cats?", a: "The grooming products shown here are intended for dogs and cats, subject to each final label. The Coffee Wood Chew is for dogs. Always follow the directions on the individual product." },
  { q: "Can these products treat persistent itching or ear problems?", a: "They are grooming products, not treatments. If your pet has persistent scratching, redness, ear pain or discharge, speak with a veterinarian." },
  { q: "Where does Pawwcious deliver?", a: "Pawwcious ships to serviceable locations across India. The delivery charge and available options should be shown at checkout." },
];

/* ─────────────────────────────────────────────────────────────────────────
   Shared class strings
   ───────────────────────────────────────────────────────────────────────── */
const SERIF = "font-[Inter,system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]";
const FOCUS =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#80a790]";
const SHELL = "max-w-[1180px] mx-auto px-5 md:px-[30px]";
const SECTION = "w-full py-[65px] md:py-[90px]";
const H2 = `${SERIF} font-bold text-[clamp(2rem,7.5vw,3.5rem)] leading-[1.13] tracking-[-.035em] mb-3.5`;
const LIFT =
  "transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_35px_#1b342015]";

/* ─────────────────────────────────────────────────────────────────────────
   Small building blocks
   ───────────────────────────────────────────────────────────────────────── */
function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block text-[11px] font-extrabold tracking-[.15em] uppercase text-[#66836b] ${className}`}
    >
      {children}
    </span>
  );
}

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "light";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function ButtonLink({ href, children, variant = "solid", className = "", onClick }: ButtonLinkProps) {
  const variants = {
    solid: "bg-[#194c3f] border-[#194c3f] text-white hover:bg-[#103c32]",
    outline: "bg-transparent border-[#194c3f] text-[#194c3f] hover:bg-[#e2ebdf]",
    light: "bg-white border-white text-[#194c3f] hover:bg-[#e2ebdf]",
  } as const;

  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center min-h-[49px] px-[19px] py-[11px] border rounded-[10px] text-[13px] font-extrabold no-underline transition-colors ${variants[variant]} ${FOCUS} ${className}`}
    >
      {children}
    </a>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`${SERIF} block text-[28px] font-bold leading-none tracking-[-.055em] whitespace-nowrap ${
        light ? "text-white" : "text-[#194c3f]"
      }`}
    >
      Pawwcious
      <small
        className={`block font-sans text-[8px] font-semibold leading-[1.2] tracking-[.07em] mt-1 ${
          light ? "text-[#c7d9cd]" : "text-[#527060]"
        }`}
      >
        where healing journey begins
      </small>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────────────── */
export function Homepage({
  routes,
  onNavigate,
  siteUrl = "https://pawwcious.com/",
}: HomePageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const r = { ...DEFAULT_ROUTES, ...routes };

  // Smooth in-page anchor scrolling while this page is mounted
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "smooth";
    return () => {
      el.style.scrollBehavior = prev;
    };
  }, []);

  /** Hash links behave natively; other links use `onNavigate` when supplied. */
  const nav =
    (href: string) =>
    (e: React.MouseEvent<HTMLAnchorElement>): void => {
      if (onNavigate && !href.startsWith("#") && !/^https?:/.test(href)) {
        e.preventDefault();
        onNavigate(href);
      }
    };

  return (
    <div className="w-full min-h-screen bg-[#faf8f3] text-[#24342d] text-[15px] leading-normal font-[Inter,system-ui,-apple-system,'Segoe_UI',sans-serif]">
      {/* Announcement banner */}
      

      <main id="top" className="w-full">
        {/* Hero */}
        <section className="w-full bg-[#f8f9f5]">
          <div className={`${SHELL} grid items-center md:min-h-[560px] md:grid-cols-2 gap-8 md:gap-10`}>
            <div className="py-12 md:py-16 md:pr-8">
              <Eyebrow>Thoughtful grooming from pet parents</Eyebrow>
              <h1
                id="hero-title"
                className={`${SERIF} mt-4 mb-5 max-w-[640px] font-bold text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.12] tracking-[-.035em]`}
              >
                Everyday grooming, <span className="text-[#154b39]">without the guesswork.</span>
              </h1>
              <p className="max-w-[530px] text-[1.1rem] text-[#526158] leading-relaxed">
                Coat care, ear cleaning and warm-day grooming for dogs and cats. Find a simple routine that fits your pet.
              </p>
              <div className="mt-7 mb-4 flex flex-wrap items-center gap-[11px]">
                <ButtonLink href={r.pack} onClick={nav(r.pack)}>
                  SHOP THE COMPLETE PACK
                </ButtonLink>
                <ButtonLink href="#shop" variant="outline">
                  EXPLORE PRODUCTS
                </ButtonLink>
              </div>
              <div className="text-[13px] text-[#526158] font-medium">
                Furlush + Furbreeze + Squeakear in one pack
              </div>
            </div>

            <div className="flex items-center justify-center py-6 md:py-8">
              <img
                src={heroImg}
                alt="Furlush coat serum, Furbreeze cooling powder and Squeakear ear wash together"
                className="w-full max-h-[500px] md:max-h-[560px] object-contain mix-blend-multiply select-none"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <div className="w-full border-y border-[#dce5de] bg-white">
          <div className={`${SHELL} grid grid-cols-3 gap-4 py-[19px] text-center`}>
            {TRUST_STRIP.map((t) => (
              <span key={t.label} className="text-xs sm:text-[13px] font-bold text-[#154b39]">
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Shop by need */}
        <section id="concerns" className={`${SECTION} bg-white`}>
          <div className={SHELL}>
            <div className="mb-7">
              <Eyebrow>Start with your pet’s routine</Eyebrow>
              <h2 className={`${H2} mt-2 mb-0`}>What do you need help grooming?</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {CONCERNS.map((c) => (
                <a
                  key={c.title}
                  href={r[c.route]}
                  onClick={nav(r[c.route])}
                  className={`flex min-h-[175px] md:min-h-[195px] flex-col justify-between rounded-2xl p-5 md:p-6 no-underline border border-[#dce5de] bg-white transition-all hover:border-[#8fb3a0] ${LIFT} ${FOCUS}`}
                >
                 <div> <span className="text-[12px] font-extrabold text-[#779889]">{c.icon}</span>
                  
                    <h3 className={`${SERIF} my-2 text-[19px] sm:text-[20px] font-bold leading-[1.12]`}>
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#526158] leading-relaxed mb-2">{c.blurb}</p>
                  </div>  <b className="text-xs text-[#154b39] font-extrabold">{c.cta}</b>
                  
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* The Complete Grooming Pack Component */}
        <section id="bundle" className={`${SECTION} bg-[#f8f9f5]`}>
          <div className={SHELL}>
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="rounded-2xl overflow-hidden bg-[#eee] aspect-square flex items-center justify-center">
                <img
                  src={bundleImg}
                  alt="The three Pawwcious grooming products on a table while a dog is brushed at home"
                  className="w-full h-full object-cover object-[center_55%]"
                  loading="lazy"
                />
              </div>

              <div>
                <Eyebrow>The Complete Grooming Pack</Eyebrow>
                <h2 className={`${H2} mt-2.5 mb-3.5`}>Three grooming needs. One ready-to-go pack.</h2>
                <p className="max-w-[500px] text-[#526158] text-[15px] leading-relaxed">
                  Keep the products for coat care, warm days and ear cleaning together, then reach for the one that fits today.
                </p>
                <ul className="my-5 divide-y divide-[#dce5de] border-b border-[#dce5de]">
                  <li className="flex items-baseline gap-3 py-3 text-sm font-semibold">
                    <strong className="text-[#154b39] text-xs font-extrabold min-w-[70px]">Furlush</strong>
                    <span className="text-[#526158] font-normal">For rough-feeling coats and brushing</span>
                  </li>
                  <li className="flex items-baseline gap-3 py-3 text-sm font-semibold">
                    <strong className="text-[#154b39] text-xs font-extrabold min-w-[70px]">Furbreeze</strong>
                    <span className="text-[#526158] font-normal">For warm-day grooming</span>
                  </li>
                  <li className="flex items-baseline gap-3 py-3 text-sm font-semibold">
                    <strong className="text-[#154b39] text-xs font-extrabold min-w-[70px]">Squeakear</strong>
                    <span className="text-[#526158] font-normal">For routine ear cleaning</span>
                  </li>
                </ul>
                <ButtonLink href={r.pack} onClick={nav(r.pack)} className="mt-2">
                  VIEW THE COMPLETE PACK
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* Product range */}
        <section id="shop" className={`${SECTION} bg-white`}>
          <div className={SHELL}>
            <div className="mb-7">
              <Eyebrow>Shop the range</Eyebrow>
              <h2 className={`${H2} mt-2 mb-0`}>Find their next care step.</h2>
              <p className="mt-2 text-[15px] text-[#526158] max-w-[620px]">
                Choose one product for a specific routine, or explore the Complete Grooming Pack above.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4">
              {PRODUCTS.map((p) => (
                <article
                  key={p.name}
                  className="group flex flex-col h-full overflow-hidden rounded-2xl border border-[#dce5de] bg-white transition-all duration-300 hover:border-[#8fb3a0] hover:shadow-md"
                >
                  <a
                    href={r[p.route]}
                    onClick={nav(r[p.route])}
                    className={`relative flex aspect-square w-full items-center justify-center overflow-hidden p-4 sm:p-5 no-underline transition-colors ${p.visualBg} ${FOCUS}`}
                    aria-label={`View ${p.name}`}
                  >
                    <img
                      src={p.image}
                      alt={p.alt}
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105 select-none"
                      loading="lazy"
                    />
                  </a>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-[#5d806c]">
                        {p.tag}
                      </span>
                      <h3 className={`${SERIF} my-2 text-[18px] sm:text-[19px] font-bold leading-[1.15]`}>
                        {p.name}
                      </h3>
                      <p className="mb-4 text-[13px] leading-relaxed text-[#526158] min-h-[50px]">{p.blurb}</p>
                    </div>
                    <a
                      href={r[p.route]}
                      onClick={nav(r[p.route])}
                      className={`inline-flex items-center gap-1 self-start text-xs font-extrabold text-[#154b39] no-underline hover:underline underline-offset-4 ${FOCUS}`}
                    >
                      {p.cta}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section className={`${SECTION} bg-[#f7f9f6]`}>
          <div className={SHELL}>
            <div className="grid md:grid-cols-[0.88fr_1.12fr] gap-8 md:gap-14 items-center">
              <div>
                <Eyebrow>Know what you’re using</Eyebrow>
                <h2 className={`${H2} mt-2.5 mb-3.5`}>Clear ingredients. Clear purpose.</h2>
                <p className="text-[15px] text-[#526158] mb-4 leading-relaxed">
                  Each product has its own job in the grooming routine. Explore its page for the full label and directions before you use it.
                </p>
                <a
                  href="#shop"
                  className={`text-sm font-extrabold text-[#154b39] underline underline-offset-4 ${FOCUS}`}
                >
                  Explore the products →
                </a>
              </div>
              <div className="grid gap-2.5">
                {WHY.map((w) => (
                  <div key={w.title} className="bg-white border border-[#dce5de] rounded-xl p-4 md:px-5">
                    <b className="block text-[#154b39] font-bold text-sm mb-0.5">{w.title}</b>
                    <span className="text-[14px] text-[#526158]">{w.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className={`${SECTION} bg-white`}>
          <div className={SHELL}>
            <div className="mb-7">
              <Eyebrow>Customer experiences</Eyebrow>
              <h2 className={`${H2} mt-2 mb-0`}>From other pet parents.</h2>
              <p className="mt-2 text-[15px] text-[#526158] max-w-[620px]">
                Excerpts from Amazon reviews discussing the Pawwcious serum and ear wash.
              </p>
            </div>
            <div className="grid gap-3.5 md:grid-cols-2">
              {QUOTES.map((q) => (
                <article
                  key={q.quote}
                  className="rounded-2xl border border-[#dce5de] bg-white p-6 shadow-xs"
                >
                  <blockquote className={`${SERIF} m-0 mb-4 text-[18px] md:text-[19px] leading-[1.4] font-semibold text-[#17271e]`}>
                    {q.quote}
                  </blockquote>
                  <cite className="not-italic text-xs font-medium text-[#526158]">
                    {q.source}
                  </cite>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#526158]">
              Individual customer experiences. Reviews shown here are for the serum and ear wash, rather than for the Complete Grooming Pack.
            </p>
          </div>
        </section>

        {/* Story */}
        <section id="story" className={`${SECTION} bg-[#eef3ed]`}>
          <div className={`${SHELL} max-w-[830px]`}>
            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] gap-6 md:gap-9 items-center">
              <img
                src={founderImg}
                alt="Shashwat , founder of Pawwcious"
                className="w-[100px] h-[160px] md:w-[180px] md:h-[250px] rounded-full object-cover object-[center_top] bg-white shadow-xs"
                loading="lazy"
              />
              <div>
                <Eyebrow>From one pet parent to another</Eyebrow>
                <h2 className={`${H2} mt-2 mb-3 text-[clamp(1.85rem,3.5vw,2.5rem)]`}>Thoughtful care starts at home.</h2>
                <p className="mb-3 text-[15px] text-[#526158] max-w-[600px] leading-relaxed">
                  As a pet parent, founder Shashwat  believes grooming should consider how a product feels for a pet as well as how the coat looks afterward. Pawwcious brings that thinking to everyday care for dogs and cats.
                </p>
                <small className="text-[#154b39] font-bold text-xs block">Shashwat  · Founder, Pawwcious</small>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className={`${SECTION} bg-white`}>
          <div className={`${SHELL} max-w-[790px]`}>
            <div className="mb-6">
              <Eyebrow>Quick answers</Eyebrow>
              <h2 className={`${H2} mt-2 mb-0`}>Before you choose.</h2>
            </div>
            <div className="divide-y divide-[#dce5de]">
              {FAQS.map((f) => (
                <details key={f.q} className="group">
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold text-[#17271e] [&::-webkit-details-marker]:hidden ${FOCUS}`}
                  >
                    <span>{f.q}</span>
                    <span
                      aria-hidden="true"
                      className="text-2xl leading-none text-[#154b39]"
                    >
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-[#526158] text-[15px] leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="w-full bg-[#113729] py-[72px] text-center text-white">
          <div className={SHELL}>
            <Eyebrow className="!text-[#bddac8]">Make the routine your own</Eyebrow>
            <h2
              className={`${SERIF} mx-auto mb-3 mt-2.5 max-w-[720px] font-bold text-[clamp(2rem,4vw,3.3rem)] leading-[1.12] tracking-[-.035em]`}
            >
              Start with what your pet needs today.
            </h2>
            <p className="text-[#d7e4d9] max-w-[620px] mx-auto text-[15px]">
              Explore a single product or keep coat, ear and warm-day grooming together in the Complete Pack.
            </p>
            <ButtonLink href="#shop" variant="light" className="mt-4">
              SHOP PAWWCIOUS
            </ButtonLink>
          </div>
        </section>
      </main>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#dedfd6] bg-white px-[13px] pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] md:hidden">
        <ButtonLink href="#shop" className="w-full">
          SHOP PAWWCIOUS
        </ButtonLink>
      </div>
    </div>
  );
}

export default Homepage;