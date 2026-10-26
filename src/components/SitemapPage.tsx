import React, { useState, useMemo } from "react";
import {
  Map, FileCode, Search, ChevronRight, Check, ExternalLink,
  Layers, Sparkles, BookOpen, ShoppingBag, Shield, ArrowRight,
  HelpCircle, Compass, RefreshCw
} from "lucide-react";
import { Product, Blog, Category } from "../types";

interface SitemapPageProps {
  products?: Product[];
  blogs?: Blog[];
  categories?: Category[];
  onNavigate: (view: string, blogId?: string) => void;
  onNavigateProduct?: (product: Product) => void;
}

interface SitemapItem {
  loc: string;
  displayPath: string;
  title: string;
  description: string;
  category: "Core Pages" | "Shop Catalog" | "Wellness Journal" | "Legal & Support";
  priority: string;
  changefreq: string;
  view?: string;
  targetId?: string;
}

export function SitemapPage({
  products = [],
  blogs = [],
  categories = [],
  onNavigate,
  onNavigateProduct
}: SitemapPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Generate dynamic sitemap entries reflecting live products and journal entries
  const allUrls = useMemo<SitemapItem[]>(() => {
    const list: SitemapItem[] = [
      {
        loc: "https://pawwcious.com/",
        displayPath: "/",
        title: "Pawwcious Home — Luxury Pet Wellness & Canine Nutrition",
        description: "Botanical wellness matrices, clinical canine supplements, and artisanal grooming.",
        category: "Core Pages",
        priority: "1.0",
        changefreq: "daily",
        view: "home"
      },
      {
        loc: "https://pawwcious.com/product",
        displayPath: "/product",
        title: "Shop All Collections — Ayurvedic Canine Formulations",
        description: "Browse certified organic nutrition, coat elixirs, and pet grooming remedies.",
        category: "Shop Catalog",
        priority: "0.9",
        changefreq: "daily",
        view: "shop"
      },
      {
        loc: "https://pawwcious.com/ai",
        displayPath: "/ai",
        title: "AI Pet Wellness Coach — PawBuddy Instant Insights",
        description: "Interactive AI consultation for diet charts, summer coat care, and symptom checks.",
        category: "Core Pages",
        priority: "0.85",
        changefreq: "weekly",
        view: "ai"
      },
      {
        loc: "https://pawwcious.com/blog",
        displayPath: "/blog",
        title: "Pawwcious Journal — Canine Health, Grooming & Diet",
        description: "Expert vet-reviewed botanical care guides, ingredient spotlights, and pet routines.",
        category: "Wellness Journal",
        priority: "0.8",
        changefreq: "weekly",
        view: "blog"
      },
      {
        loc: "https://pawwcious.com/about",
        displayPath: "/about",
        title: "About Pawwcious — Our Botanical Heritage & Philosophy",
        description: "Discover our mission, laboratory testing standards, and cruelty-free promise.",
        category: "Core Pages",
        priority: "0.7",
        changefreq: "monthly",
        view: "about"
      },
      {
        loc: "https://pawwcious.com/contact",
        displayPath: "/contact",
        title: "Contact Concierge — Delhi NCR Headquarters",
        description: "Reach our apothecary concierge for bespoke orders, inquiries, or support.",
        category: "Core Pages",
        priority: "0.7",
        changefreq: "monthly",
        view: "contact"
      },
      {
        loc: "https://pawwcious.com/faq",
        displayPath: "/faq",
        title: "Help Center & FAQs — Orders, Payments & Tracking",
        description: "Answers to shipping timelines, COD, ingredients, and returns processing.",
        category: "Legal & Support",
        priority: "0.6",
        changefreq: "monthly",
        view: "faq"
      },
      {
        loc: "https://pawwcious.com/terms",
        displayPath: "/terms",
        title: "Terms & Conditions of Service",
        description: "Official legal terms governed by Consumer Protection (E-Commerce) Rules.",
        category: "Legal & Support",
        priority: "0.5",
        changefreq: "monthly",
        view: "terms"
      },
      {
        loc: "https://pawwcious.com/privacy",
        displayPath: "/privacy",
        title: "Privacy & Data Protection Policy (DPDP Act Compliant)",
        description: "How Pawwcious protects customer data under India's Digital Personal Data Protection Act.",
        category: "Legal & Support",
        priority: "0.5",
        changefreq: "monthly",
        view: "privacy"
      }
    ];

    // Append dynamic blog articles
    if (blogs && blogs.length > 0) {
      blogs.forEach((b) => {
        const titleSlug = b.title
          ? b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          : b.id;
        list.push({
          loc: `https://pawwcious.com/blog/${titleSlug}`,
          displayPath: `/blog/${titleSlug}`,
          title: `${b.title} — Pawwcious Journal`,
          description: b.summary || "Veterinary guidance and botanical dog care insight.",
          category: "Wellness Journal",
          priority: "0.75",
          changefreq: "weekly",
          view: "blog",
          targetId: b.id
        });
      });
    }

    // Append dynamic products
    if (products && products.length > 0) {
      products.forEach((p) => {
        const pSlug = p.name
          ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          : p.id;
        list.push({
          loc: `https://pawwcious.com/shop?product=${p.id}`,
          displayPath: `/product/${pSlug}`,
          title: `${p.name} — ${p.tagline || "Premium Botanical Formulation"}`,
          description: p.description?.slice(0, 120) || "Ayurvedic pet wellness and botanical grooming matrix.",
          category: "Shop Catalog",
          priority: "0.8",
          changefreq: "weekly",
          view: "shop",
          targetId: p.id
        });
      });
    }

    return list;
  }, [blogs, products]);

  const categoryGroups = ["All", "Core Pages", "Shop Catalog", "Wellness Journal", "Legal & Support"];

  const filteredUrls = useMemo(() => {
    return allUrls.filter((item) => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchQuery =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.displayPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [allUrls, activeCategory, searchQuery]);

  const handleCopyXmlUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://pawwcious.com";
    const url = `${origin}/sitemap.xml`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-10 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C2E2B] via-[#162522] to-stone-900 text-stone-100 p-8 sm:p-12 border border-emerald-950 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold tracking-wide">
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pawwcious Official Sitemap & SEO Index</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif italic tracking-wide text-white">
            Complete Website Directory & Sitemap
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Welcome to the Pawwcious architectural index. This sitemap indexes all verified, crawlable landing pages,
            curated botanical formulations, veterinary wellness articles, and regulatory consumer policies.
          </p>

          {/* Quick Stats & XML Link */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-stone-700/60 rounded-xl px-3.5 py-2 text-xs font-mono text-stone-300">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{allUrls.length} Total Indexed URLs</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-stone-700/60 rounded-xl px-3.5 py-2 text-xs font-mono text-stone-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>sitemaps.org 0.9 Standard</span>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>View Raw sitemap.xml</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
            <button
              onClick={handleCopyXmlUrl}
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 rounded-xl px-3.5 py-2 text-xs font-mono transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
              <span>{copied ? "URL Copied!" : "Copy XML URL"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sitemap by title, path, or keyword (e.g. shampoo, refund, journal, ai)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-700 dark:focus:ring-teal-500"
            />
          </div>

          {/* Quick Counter */}
          <div className="text-xs text-stone-500 dark:text-stone-400 font-mono self-end md:self-center shrink-0">
            Showing <strong className="text-stone-900 dark:text-stone-100">{filteredUrls.length}</strong> of {allUrls.length} links
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categoryGroups.map((cat) => {
            const isActive = activeCategory === cat;
            const count = cat === "All" ? allUrls.length : allUrls.filter(u => u.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#1C2E2B] text-amber-300 dark:bg-amber-400 dark:text-stone-950 shadow-xs"
                    : "bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? "bg-white/20 dark:bg-black/20" : "bg-stone-200 dark:bg-stone-800"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* URL Grid by Category if "All", or filtered list */}
      <div className="space-y-8">
        {filteredUrls.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-12 text-center space-y-3">
            <Compass className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">No matching URLs found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No index entries matched "{searchQuery}". Try searching for another term or click Reset Filters.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-2 px-4 py-2 text-xs font-bold bg-[#1C2E2B] text-white rounded-xl hover:bg-stone-800 cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUrls.map((item, index) => {
              const handleDirectNavigate = () => {
                if (item.view === "blog" && item.targetId && blogs) {
                  const targetBlog = blogs.find(b => b.id === item.targetId);
                  if (targetBlog) {
                    onNavigate("blog", targetBlog.id);
                    return;
                  }
                }
                if (item.view === "shop" && item.targetId && products && onNavigateProduct) {
                  const targetProd = products.find(p => p.id === item.targetId);
                  if (targetProd) {
                    onNavigateProduct(targetProd);
                    return;
                  }
                }
                if (item.view) {
                  onNavigate(item.view);
                }
              };

              return (
                <div
                  key={`${item.displayPath}-${index}`}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800/90 p-5 hover:border-teal-600/50 dark:hover:border-teal-400/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-850 text-teal-800 dark:text-teal-400 border border-stone-200/50 dark:border-stone-750">
                          {item.displayPath}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
                          Priority {item.priority}
                        </span>
                        <span className="bg-stone-100 dark:bg-stone-850 text-stone-500 px-1.5 py-0.5 rounded">
                          {item.changefreq}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Action bottom bar */}
                  <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-stone-400 truncate max-w-[200px]">
                      {item.loc}
                    </span>

                    <button
                      type="button"
                      onClick={handleDirectNavigate}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-[#1C2E2B] dark:bg-stone-850 dark:hover:bg-teal-700 text-stone-700 hover:text-white dark:text-stone-300 dark:hover:text-white font-medium text-xs transition-colors cursor-pointer group-hover:bg-[#1C2E2B] group-hover:text-white"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Crawl Information Box */}
      <div className="bg-stone-50 dark:bg-stone-900/60 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 text-xs text-stone-600 dark:text-stone-400">
        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>SEO & Webmaster Crawling Guidelines</span>
        </h4>
        <p className="leading-relaxed">
          The Pawwcious platform dynamically maintains compliance with the standard sitemaps protocol (<a href="https://www.sitemaps.org" target="_blank" rel="noopener noreferrer" className="underline text-teal-700 dark:text-teal-400">sitemaps.org</a>).
          Our XML endpoint (<code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">/sitemap.xml</code>) is registered with Google Search Console, Bing Webmaster Tools, and Yandex.
          Canonical tags, Schema.org Organization structured microdata, and OpenGraph tags are synchronized on all individual page views.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-[11px]">
          <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1">
            <span>/robots.txt</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 font-bold text-teal-700 dark:text-teal-400">
            <span>/sitemap.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
