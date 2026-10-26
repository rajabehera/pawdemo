import React from "react";
import { motion } from "motion/react";
import { Heart, Check, Star, Award, Sparkles, Bot, ChevronRight, MessageSquare, Mail } from "lucide-react";
import { trackWhatsAppClick } from "../analytics";

interface AboutPageProps {
  onGoAI: () => void;
  onGoContact: () => void;
}

interface Pillar {
  label: string;
  image: string;
  alt: string;
  icon: React.ReactNode;
  badge: string;
  title: string;
  text: string;
  tags: { highlight?: boolean; label: string }[];
}

const PILLARS: Pillar[] = [
  {
    label: "Standard I",
    image: "/images/standards_mission_1780720499286.webp",
    alt: "Paw Mission - The Botanical Purity Promise",
    icon: <Award className="h-4 w-4" />,
    badge: "Purity Mandate",
    title: "Paw Mission",
    text: "To nurture every pet's life through clinical-grade botanical care, trusted dermal therapeutics, and uncompromising natural purity. We make daily healing routines joyful, protective, and restorative for sensitive coats and families who adore them.",
    tags: [
      { highlight: true, label: "🌱 Eco-Cert Sourced" },
      { label: "⚡ pH-Safe" },
      { label: "🛡️ Non-Toxic" },
    ],
  },
  {
    label: "Standard II",
    image: "/images/standards_vision_1780720515100.webp",
    alt: "Paw Vision - Clinical Veterinary Trust",
    icon: <Sparkles className="h-4 w-4" />,
    badge: "Clinical Core",
    title: "Paw Vision",
    text: "To pioneer a new era of pet wellness skincare across India, where pet parents move past cosmetic grooming toward scientifically formulated epidermal immunity. We aim to be the gold standard of care, backed by veterinary research and clinical integrity.",
    tags: [
      { highlight: true, label: "👩‍⚕️ Vet Approved" },
      { label: "🔬 Clinical Testing" },
      { label: "🧬 Bio-Active" },
    ],
  },
  {
    label: "Standard III",
    image: "/images/standards_love_1780720532360.webp",
    alt: "Paw Love - Heartfelt Holistic Healing",
    icon: <Heart className="h-4 w-4" />,
    badge: "Sincere Devotion",
    title: "Paw Love",
    text: "Every drop we formulate is born of absolute devotion and profound respect for pet biology. True healing comes from the therapeutic power of nature, processed with clinical gentleness. We celebrate the sacred bonds and joyful tails that make our life complete.",
    tags: [
      { highlight: true, label: "💛 Hand-Packed" },
      { label: "🌸 Hypoallergenic" },
      { label: "✨ Cruelty-Free" },
    ],
  },
];

const EIGHT_PILLARS = [
  { title: "Gentle Paws", desc: "Soothing natural extracts for highly sensitive pads, skin, and ears." },
  { title: "Happy Bond", desc: "Formulated to deepen the lifelong energetic & emotional link." },
  { title: "Daily Joy", desc: "Elevating grooming into daily sensory pleasure and sensory comfort." },
  { title: "Tail Wags", desc: "Obvious real results that keep tails high and coat shines long." },
  { title: "Pure Love", desc: "No synthetic sulfates, chemical dyes, parabens, or fillers-ever." },
  { title: "Vet Approved", desc: "Evaluated by top healthcare experts for safety, pH and clinical-grade purity." },
  { title: "Healthy Pets", desc: "Holistic, deep systemic care to boost cellular health & daily activity." },
  { title: "Natural Care", desc: "Heritage Ayurvedic secrets sourced sustainably from 100% organic growers." },
];

const STORY_POINTS = [
  "Our journey began with love for pets at home, creating products that deliver care, comfort, and thoughtful attention daily.",
  "Every formula blends natural ingredients with expert guidance to ensure safe, effective, and nurturing care for pets every day.",
  "We dream of a world where pets thrive, enjoying daily care that brings joy, comfort, and meaningful moments to all companions.",
];

const PillarCard: React.FC<{ pillar: Pillar }> = ({ pillar }) => (
  <div className="bg-[#FAF9F5] dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-teal-700/40 transition-all duration-500 flex flex-col justify-between group">
    <div>
      <div className="aspect-[4/3] w-full bg-stone-100 dark:bg-stone-800 relative overflow-hidden">
        <img
          src={pillar.image}
          alt={pillar.alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

        <span className="absolute top-3 left-3 bg-white/95 dark:bg-stone-900/90 text-teal-850 dark:text-teal-400 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border border-stone-100/60 dark:border-stone-800 shadow-sm">
          {pillar.label}
        </span>

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-teal-850/90 backdrop-blur-xs flex items-center justify-center text-amber-300">
            {pillar.icon}
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-white font-extrabold">{pillar.badge}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-3">
        <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100 font-serif italic group-hover:text-teal-850 dark:group-hover:text-teal-400 transition-colors duration-300">
          {pillar.title}
        </h4>
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-medium">{pillar.text}</p>
      </div>
    </div>

    <div className="px-5 sm:px-6 pb-5">
      <div className="pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex flex-wrap gap-1.5">
        {pillar.tags.map((tag) => (
          <span
            key={tag.label}
            className={
              tag.highlight
                ? "text-[8.5px] uppercase font-mono bg-teal-50 dark:bg-teal-950/35 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded font-bold border border-teal-100/60 dark:border-teal-900/30"
                : "text-[8.5px] uppercase font-mono bg-[#FAF9F5] dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded font-bold border border-stone-200/50"
            }
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export const AboutPage: React.FC<AboutPageProps> = ({ onGoAI, onGoContact }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      id="static-about-page"
      className="max-w-6xl mx-auto pb-12 sm:pb-16 space-y-12 sm:space-y-16"
    >
      {/* Hero heading */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-stone-900 border border-teal-100 dark:border-teal-900/40 text-teal-850 dark:text-teal-400 text-[10px] font-mono font-semibold tracking-wider uppercase">
          <Heart className="h-3 w-3 text-teal-600 dark:text-teal-400 animate-pulse" />
          Our Heritage & Philosophy
        </span>
        <h1 className="text-2xl sm:text-4.5xl font-black font-serif italic text-stone-955 dark:text-stone-100 tracking-wide leading-tight mt-1">
          Inspired by Nature, Guided by Love
        </h1>
        <div className="h-[1px] w-12 bg-amber-500/40 mx-auto my-3" />
        <p className="text-xs sm:text-sm text-stone-550 dark:text-stone-400 leading-relaxed max-w-lg mx-auto">
          Our heartfelt journey to craft premium, purely organic, and expert-approved botanical care guidelines prioritizing your pet's refined health.
        </p>
      </div>

      {/* Hero banner */}
      <div className="relative group overflow-hidden rounded-3xl border border-stone-200/80 shadow-md">
        <img
          src="/images/pawwcious_about_hero_1779615456507.webp"
          alt="Pawwcious Luxury Pet Wellness Lifestyle"
          referrerPolicy="no-referrer"
          className="w-full aspect-[16/9] md:aspect-[21/11] object-cover hover:scale-[1.05] transition-transform duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/45 to-transparent p-4 sm:p-6 flex items-end justify-between text-white">
          <span className="text-[9px] sm:text-xs font-mono tracking-widest uppercase opacity-90 drop-shadow-sm">The Pawwcious Lifestyle</span>
          <span className="text-[8px] sm:text-[10px] font-mono text-stone-200 border border-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">Premium Fine Art</span>
        </div>
      </div>

      {/* Brand story */}
      <div className="border-t border-b border-stone-150 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-12 lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#115E59] font-bold block">Who We Are?</span>
            <h2 className="text-xl sm:text-3.5xl font-bold font-serif italic text-stone-900 leading-tight">
              A Heartfelt Journey Shaped by Our Bond with Pets
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-stone-605 space-y-4 leading-relaxed font-sans font-medium">
            <p>
              Pawwcious isn’t just a brand — it’s a heartfelt journey shaped by our bond with pets. What started as a small idea to give them safer, gentler choices has grown into a promise of wellness and happiness for every wagging tail and purring heart.
            </p>
            <div className="space-y-3.5 pt-2">
              {STORY_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="mt-1 h-3.5 w-3.5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-12 lg:col-span-5 flex justify-center">
          <div className="relative p-2 bg-[#FAF9F5] rounded-2xl border border-stone-200/80 shadow-sm max-w-sm w-full">
            <img
              src="/images/pawwcious_heritage_wellness_1779615476075.webp"
              alt="Pawwcious Luxury Editorial Dropper Bottle Still Life"
              referrerPolicy="no-referrer"
              className="w-full aspect-square object-cover rounded-xl"
            />
            <div className="text-center pt-2 pb-0.5">
              <p className="text-[9px] font-mono uppercase text-stone-400 font-bold tracking-widest">Est. 2025 • Wellness Apothecary</p>
            </div>
          </div>
        </div>
      </div>

      {/* Three pillars */}
      <div className="space-y-10" id="standards-section">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-[10px] font-mono uppercase tracking-widest font-bold border border-teal-100 dark:border-teal-900/30">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500 animate-pulse" />
            The Pillars of Wellness
          </span>
          <h3 className="text-2xl sm:text-3.5xl font-extrabold font-serif italic text-stone-900 dark:text-white leading-tight">
            Our Sacred Golden Standards
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Every formulation is a testament to clinical precision, Ayurvedic heritage, and uncompromising safety for your pet’s skin health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <PillarCard key={p.label} pillar={p} />
          ))}
        </div>
      </div>

      {/* Wide banner */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-stone-200/50 shadow-md">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-stone-950/10 mix-blend-multiply z-10" />
        <img
          src="/images/paww_golden_standards_banner_1780294463947.webp"
          alt="Paww Golden Standards Holistic Botanical Care"
          className="w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 md:bottom-8 md:left-8 md:right-8 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div className="space-y-1" />
          <span className="text-[9px] sm:text-[10px] text-teal-100 font-mono tracking-wider opacity-90 sm:opacity-100 bg-black/30 sm:bg-transparent px-2 py-1 rounded backdrop-blur-sm sm:backdrop-blur-none shrink-0">
            © Paww Wellness Apothecary
          </span>
        </div>
      </div>

      {/* 8 pillars */}
      <div className="space-y-6 pt-4">
        <div className="text-center max-w-lg mx-auto space-y-1.5 font-sans">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#115E59] block">Loved By Pets & Owners</span>
          <h3 className="text-lg sm:text-2xl font-bold font-serif italic">The 8 Pillars of Wholesome Care</h3>
          <p className="text-[11px] text-stone-400 font-mono">Why thousands of Indian pet parents trust the Pawwcious journey.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EIGHT_PILLARS.map((item) => (
            <div key={item.title} className="bg-stone-50/50 border border-stone-150/80 p-4 rounded-xl space-y-1 hover:bg-teal-50/30 transition-all duration-200">
              <div className="h-2 w-2 rounded-full bg-teal-600" />
              <h5 className="font-bold text-xs text-stone-900 tracking-tight pt-1.5">{item.title}</h5>
              <p className="text-[10px] text-stone-500 leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-teal-900 text-white rounded-2xl p-6 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center select-none shadow-md">
        <div className="space-y-1">
          <p className="text-xl sm:text-3xl font-black text-amber-300 font-mono">100%</p>
          <p className="text-[10px] sm:text-xs text-teal-100 tracking-wider font-mono uppercase">Ayurvedic Botany</p>
        </div>
        <div className="space-y-1 border-l border-teal-700/60 pl-2">
          <p className="text-xl sm:text-3xl font-black text-amber-300 font-mono">GMP</p>
          <p className="text-[10px] sm:text-xs text-teal-100 tracking-wider font-mono uppercase">100% organic</p>
        </div>
        <div className="space-y-1 border-l border-teal-700/60 pl-2 lg:border-l">
          <p className="text-xl sm:text-3xl font-black text-amber-300 font-mono">3K+</p>
          <p className="text-[10px] sm:text-xs text-teal-100 tracking-wider font-mono uppercase">Healed Companions</p>
        </div>
        <div className="space-y-1 border-l border-teal-700/60 pl-2">
          <p className="text-xl sm:text-3xl font-black text-amber-300 font-mono">pH 7+</p>
          <p className="text-[10px] sm:text-xs text-teal-100 tracking-wider font-mono uppercase">Skin Safe Formulas</p>
        </div>
      </div>

      {/* Support hub */}
      <div id="about-questions-section" className="bg-[#FAF8F2] dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden transition-opacity duration-300 mt-12 group">
        <div className="absolute right-0 top-0 w-[450px] h-[450px] bg-gradient-to-br from-amber-200/10 to-teal-100/5 dark:from-amber-900/15 dark:to-teal-900/5 rounded-full filter blur-3xl pointer-events-none -mr-40 -mt-40 transition-all duration-500 group-hover:opacity-80" />
        <div className="absolute left-0 bottom-0 w-[350px] h-[350px] bg-gradient-to-tr from-stone-200/15 to-emerald-100/5 dark:from-stone-950/15 dark:to-emerald-900/5 rounded-full filter blur-3xl pointer-events-none -ml-30 -mb-30" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center text-left">
          {/* Left pitch */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/80 dark:bg-[#122b1c] text-emerald-800 dark:text-emerald-300 text-[10px] font-mono tracking-widest font-bold uppercase border border-emerald-250/40 dark:border-emerald-900/40 select-none shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pawwcious Apothecary Care
              </span>
              <h3 className="text-3xl sm:text-4.5xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-[1.12] font-sans">
                Still have questions? <br />
                <span className="text-emerald-800 dark:text-teal-400 font-serif italic font-normal block mt-1.5">We&apos;re here to help!</span>
              </h3>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-350 leading-relaxed max-w-lg font-sans">
              Whether you are looking for physical pH skin-balanced formulation logs, custom-tailoring for reactive pet coat hydration, or general boutique advice, we have curated multiple direct lines of guidance.
            </p>

            <div className="space-y-4 pt-1 border-t border-stone-200/40 dark:border-stone-800">
              <div className="flex gap-3 items-start text-xs text-stone-600 dark:text-stone-300">
                <div className="h-5.5 w-5.5 rounded-full bg-[#FCFAF2] dark:bg-stone-950 flex items-center justify-center text-amber-500 border border-amber-200/40 dark:border-amber-800/40 shrink-0 shadow-2xs">
                  <Sparkles className="h-3 w-3" />
                </div>
                <div className="space-y-0.5">
                  <strong className="font-bold text-stone-900 dark:text-white block font-sans">24/7 Companion Caredesk</strong>
                  <span className="text-stone-500 dark:text-stone-400 leading-relaxed">Our custom, deep-trained AI coach is equipped with expert veterinary botanicals data.</span>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs text-stone-600 dark:text-stone-300">
                <div className="h-5.5 w-5.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/30 dark:border-emerald-900/30 shrink-0 shadow-2xs">
                  <Check className="h-3 w-3" />
                </div>
                <div className="space-y-0.5">
                  <strong className="font-bold text-stone-900 dark:text-white block font-sans">100% Clean Formulation Pledges</strong>
                  <span className="text-stone-500 dark:text-stone-400 leading-relaxed">All support recommendations reflect true pH-balanced, chemical-free standards.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right channels */}
          <div className="lg:col-span-6 space-y-4">
            {/* AI coach */}
            <button
              onClick={onGoAI}
              className="w-full text-left bg-white/70 dark:bg-stone-950/80 border border-stone-200/80 dark:border-stone-800/85 hover:border-teal-500/50 dark:hover:border-teal-400/50 rounded-2xl p-5 shadow-sm transition-opacity duration-300 hover:shadow-md hover:-translate-y-0.5 group/ai cursor-pointer relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-teal-150/10 dark:bg-teal-900/5 rounded-full filter blur-xl pointer-events-none -mr-8 -mt-8" />
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-650 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40 shrink-0">
                  <Bot className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-sm tracking-tight text-stone-900 dark:text-white">PawBuddy AI Pet Coach</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-mono font-black tracking-wider uppercase">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live Now
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-normal font-sans">
                    Ask instantly about custom recipes, summer care tips, coat-shine formulations, or appropriate luxury outfits.
                  </p>
                  <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400 pt-1 group-hover/ai:text-teal-550 dark:group-hover/ai:text-teal-300">
                    Consult Coach Now <ChevronRight className="h-3 w-3 transition-transform group-hover/ai:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </button>

            {/* WhatsApp */}
            <a
              href="https://www.whatsapp.com/channel/0029VbBTCZX5EjxqmY9Iit2s"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("WhatsApp Broadcast Channel Card")}
              className="block text-left bg-white/70 dark:bg-stone-950/80 border border-stone-200/80 dark:border-stone-800/85 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 rounded-2xl p-5 shadow-sm transition-opacity duration-300 hover:shadow-md hover:-translate-y-0.5 group/wa relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-150/10 dark:bg-emerald-950/5 rounded-full filter blur-xl pointer-events-none -mr-8 -mt-8" />
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-650 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-sm tracking-tight text-stone-900 dark:text-white">Apothecary Broadcast</span>
                    <span className="text-[9.5px] font-mono text-stone-401 dark:text-stone-400">12.4K joined</span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-normal font-sans">
                    Join our verified WhatsApp Channel for direct herbalist logs, daily flash discount coupon drops, and batch alerts.
                  </p>
                  <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 pt-1 group-hover/wa:text-emerald-500/70 dark:group-hover/wa:text-emerald-300">
                    Join Live Broadcast <ChevronRight className="h-3 w-3 transition-transform group-hover/wa:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </a>

            {/* Support ticket */}
            <button
              onClick={onGoContact}
              className="w-full text-left bg-white/70 dark:bg-stone-950/80 border border-stone-200/80 dark:border-stone-800/85 hover:border-amber-500/50 dark:hover:border-amber-400/50 rounded-2xl p-5 shadow-sm transition-opacity duration-300 hover:shadow-md hover:-translate-y-0.5 group/inq cursor-pointer relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-150/10 dark:bg-amber-900/5 rounded-full filter blur-xl pointer-events-none -mr-8 -mt-8" />
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-650 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-sm tracking-tight text-stone-900 dark:text-white">Bespoke Support Ticket</span>
                    <span className="text-[9.5px] font-mono text-stone-401 dark:text-stone-400">Response SLA &lt; 2h</span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-normal font-sans">
                    File a custom skin-allergy formulation query or address trackings directly to our apothecary team.
                  </p>
                  <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-500 pt-1 group-hover/inq:text-amber-550 dark:group-hover/inq:text-amber-300 font-bold">
                    Submit Custom Ticket <ChevronRight className="h-3 w-3 transition-transform group-hover/inq:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
