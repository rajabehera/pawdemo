import React, { useState, useEffect } from "react";
import { Shield, FileText, Truck, RotateCcw, HelpCircle, Mail, MapPin, Phone, CheckCircle2, ChevronRight, Lock, ExternalLink } from "lucide-react";

type PolicyTab = "privacy" | "terms" | "shipping" | "refund" | "faq";

interface PrivacyPolicyPageProps {
  initialTab?: PolicyTab;
  onNavigateHome?: () => void;
  onNavigateShop?: () => void;
}

export function PrivacyPolicyPage({ initialTab = "privacy", onNavigateHome, onNavigateShop }: PrivacyPolicyPageProps) {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  // Helper to scroll smoothly to content viewer with precise header offset
  const scrollToContent = (forceScroll = false) => {
    const isMobile = window.innerWidth < 1024;
    // On desktop, we only auto-scroll if requested explicitly
    if (!forceScroll && !isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setTimeout(() => {
      const contentEl = document.getElementById("policy-content-viewer");
      if (contentEl) {
        // Offset height of sticky header (approx 80px) plus extra padding
        const headerOffset = isMobile ? 84 : 100;
        const elementPosition = contentEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 80);
  };

  useEffect(() => {
    setActiveTab(initialTab);
    scrollToContent();
  }, [initialTab]);

  const tabs = [
    { id: "privacy", label: "Privacy Policy", icon: Shield, subtitle: "Data protection & safety (DPDP Act compliant)" },
    { id: "terms", label: "Terms & Conditions", icon: FileText, subtitle: "Indian e-commerce usage guidelines" },
    { id: "shipping", label: "Shipping & Fulfillment", icon: Truck, subtitle: "Dispatches, COD & delivery timescales" },
    { id: "refund", label: "Cancellation & Refunds", icon: RotateCcw, subtitle: "Easy returns & payment reversal policies" },
    { id: "faq", label: "Customer Support FAQs", icon: HelpCircle, subtitle: "Quick answers to common issues" },
  ] as const;

  return (
    <div id="seo-compliance-policy-hub" className="max-w-6xl mx-auto py-8 sm:py-16 px-4 space-y-12">

      {/* Search Engine Optimized Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#9d7d4c] dark:text-amber-450 uppercase bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 px-4 py-2 rounded-full select-none inline-flex items-center gap-2">
          <Shield className="h-3 w-3 text-teal-700 dark:text-teal-400" />
          Indian Consumer Protection Act (E-Commerce) Compliant Page
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight pt-1">
          Pawwcious Compliance, Policies & Support Center
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto font-sans leading-relaxed">
          Official guidelines, consumer contracts, and data practices for <strong>Pawwcious Luxury Wellness Pvt. Ltd.</strong> protecting pet parents across 26,000+ PIN codes in India.
        </p>
      </div>

      {/* Main Grid: Interactive Sidebar Navigation + Rich Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Hand Sidebar Navigation Cards - Non-sticky on mobile, sticky only on desktop */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-stone-950 border border-stone-150 dark:border-stone-850 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-stone-550 uppercase font-black">
              Corporate Legal Framework
            </h3>
            <div className="flex flex-col gap-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`policy-tab-btn-${tab.id}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      scrollToContent(true);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition duration-200 flex items-start gap-3 cursor-pointer group ${isSelected
                      ? "bg-[#1f2d29] dark:bg-[#2c3e38] text-white border-[#1f2d29] shadow-sm"
                      : "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-150 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850"
                      }`}
                  >
                    <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 transition ${isSelected ? "text-amber-400" : "text-stone-400 group-hover:text-teal-700"
                      }`} />
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold tracking-wide uppercase font-sans">
                        {tab.label}
                      </p>
                      <p className={`text-[9px] truncate font-light ${isSelected ? "text-teal-100" : "text-stone-400 dark:text-stone-500"
                        }`}>
                        {tab.subtitle}
                      </p>
                    </div>
                    <ChevronRight className={`mt-1.5 h-3.5 w-3.5 shrink-0 opacity-40 transition ${isSelected ? "translate-x-0.5 opacity-100" : "group-hover:translate-x-0.5"
                      }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Return & Shop Navigation Assistance */}
          <div className="bg-[#FAF9F5] dark:bg-stone-900/60 p-5 rounded-2xl border border-stone-150 dark:border-stone-850 text-center space-y-3">
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#9d7d4c] dark:text-amber-450 uppercase">
              Need immediate assistance?
            </span>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Our Bangalore based dedicated concierge service is active 24/7. Chat live with the **AI Vet Coach** or contact our support team.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onNavigateShop}
                className="w-full text-[10px] font-bold py-2.5 px-4 bg-teal-850 hover:bg-teal-900 text-white rounded-xl tracking-widest uppercase transition inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                Return to Shop Catalog
              </button>
              <button
                onClick={onNavigateHome}
                className="w-full text-[10px] font-bold py-2.5 px-4 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-850 transition tracking-widest uppercase cursor-pointer"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>

        {/* Right Hand Side Page Content Container - Fully Detailed and indexable */}
        <div id="policy-content-viewer" className="scroll-mt-24 lg:col-span-8 bg-white dark:bg-stone-950 border border-stone-150 dark:border-stone-850 p-6 sm:p-10 rounded-3xl shadow-sm text-left">

          {/* PRIVACY POLICY VIEW */}
          {activeTab === "privacy" && (
            <article className="space-y-8 font-sans pb-10">
              <div className="border-b border-stone-100 dark:border-stone-850 pb-5 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400">
                  <Shield className="h-6 w-6 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Regulatory Secure Protocol</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                  Privacy Policy & Personal Data Protections
                </h2>
                <p className="text-[10px] font-mono text-stone-400">
                  Last Updated: June 19, 2026 • Compliant under DPDP Act 2023, IT Rules 2011 & Consumer Protection Act 2019
                </p>
              </div>

              {/* Table of Contents Section (Custom styled box) */}
              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-850 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
                  <span className="text-amber-500 font-extrabold font-sans">#</span> Table of Contents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <a href="#sec-1" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">01.</span> Introduction
                  </a>
                  <a href="#sec-2" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">02.</span> Information We Collect
                  </a>
                  <a href="#sec-3" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">03.</span> How We Use Your Information
                  </a>
                  <a href="#sec-4" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">04.</span> Information Sharing
                  </a>
                  <a href="#sec-5" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">05.</span> Data Retention
                  </a>
                  <a href="#sec-6" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">06.</span> Data Security
                  </a>
                  <a href="#sec-7" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">07.</span> Your Rights
                  </a>
                  <a href="#sec-8" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">08.</span> Cookies & Tracking
                  </a>
                  <a href="#sec-9" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">09.</span> Third-Party Links
                  </a>
                  <a href="#sec-10" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">10.</span> Children’s Privacy
                  </a>
                  <a href="#sec-11" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">11.</span> International Transfers
                  </a>
                  <a href="#sec-12" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">12.</span> Grievance Redressal
                  </a>
                  <a href="#sec-13" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">13.</span> Policy Updates
                  </a>
                  <a href="#sec-14" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">14.</span> Contact Information
                  </a>
                  <a href="#sec-15" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">15.</span> Consent
                  </a>
                </div>
              </div>

              {/* Main Content Sections */}
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-7 leading-relaxed font-light">

                {/* 1. Introduction */}
                <section id="sec-1" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">01.</span> Introduction
                  </h3>
                  <p>
                    <strong>Pawwcious</strong> (“we,” “us,” “our,” or “Company”) is deeply committed to protecting the privacy and personal credentials of our users. This Privacy Policy details how we collect, use, disclose, safely retain, and shield your personal information when you navigate our website{" "}
                    <a href="https://www.pawwcious.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-teal-400 hover:underline">
                      https://www.pawwcious.com
                    </a>{" "}
                    (“Website”) or purchase our natural luxury pet care products.
                  </p>
                  <p className="bg-stone-50 dark:bg-stone-900 p-3.5 border-l-2 border-amber-500 rounded-r-xl">
                    This Privacy Policy is published in strict compliance with:
                    <span className="block mt-1 pl-3 font-medium text-[11.5px] text-stone-600 dark:text-stone-400">
                      • Section 43A of the Information Technology Act, 2000<br />
                      • Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (IT Rules 2011)<br />
                      • Consumer Protection Act, 2019 and Consumer Protection (E-commerce) Rules, 2020
                    </span>
                  </p>
                  <p>
                    By accessing our Website or utilizing our Services, you explicitly consent to the collection, use, storage, and safe disclosure of your personal information as fully styled in this Privacy Policy.
                  </p>
                </section>

                {/* 2. Information We Collect */}
                <section id="sec-2" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">02.</span> Information We Collect
                  </h3>

                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200 mt-2">
                    2.1 Personal Information
                  </h4>
                  <p>We collect the following classes of personal credentials to execute premium services:</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-stone-150 dark:border-stone-850 rounded-xl p-3.5 bg-[#FAF9F5]/40 dark:bg-stone-905">
                      <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs mb-1.5">
                        <span className="text-sm">👤</span> Contact Information:
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 text-xs">
                        <li>Full legal name</li>
                        <li>Email address</li>
                        <li>Phone/mobile number</li>
                        <li>Billing & shipping address</li>
                        <li>PIN code / postal code</li>
                      </ul>
                    </div>

                    <div className="border border-stone-150 dark:border-stone-850 rounded-xl p-3.5 bg-[#FAF9F5]/40 dark:bg-stone-905">
                      <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs mb-1.5">
                        <span className="text-sm">🛒</span> Order Information:
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 text-xs">
                        <li>Purchase history logs</li>
                        <li>Order specific preferences</li>
                        <li>Product reviews and ratings</li>
                        <li>Payment method information (processed securely through authorized gateways)</li>
                      </ul>
                    </div>

                    <div className="border border-stone-150 dark:border-stone-850 rounded-xl p-3.5 bg-[#FAF9F5]/40 dark:bg-stone-905">
                      <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs mb-1.5">
                        <span className="text-sm">⚙️</span> Account Information:
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 text-xs">
                        <li>Username and credentials</li>
                        <li>Account default preferences</li>
                        <li>Subscription configurations</li>
                        <li>Communication & dispatch logs</li>
                      </ul>
                    </div>

                    <div className="border border-stone-150 dark:border-stone-850 rounded-xl p-3.5 bg-[#FAF9F5]/40 dark:bg-stone-905">
                      <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs mb-1.5">
                        <span className="text-sm">🐾</span> Pet Information:
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 text-xs">
                        <li>Companion name, breed, age, and size</li>
                        <li>Health status (for AI recommendations)</li>
                        <li>Pet care & dietary preferences</li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200 mt-3 pt-2">
                    2.2 Automatically Collected Information
                  </h4>
                  <p>When you browse our digital storefront, we automatically record parameters of your session:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                    <li>Internet Protocol (IP) address</li>
                    <li>Web browser type and version</li>
                    <li>Hardware device metrics (system type, operating state)</li>
                    <li>Duration of visit and unique pages inspected</li>
                    <li>Referring external URL</li>
                    <li>General geographic location coordinates</li>
                    <li>Cookies and browser storage indicators</li>
                  </ul>

                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200 mt-3 pt-2">
                    2.3 Sensitive Personal Data
                  </h4>
                  <p>As parsed under the IT Rules 2011, we may safely process:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                    <li><strong>Financial Information:</strong> Card tokens or bank choices (routed directly via PCI-compliant gateway environments).</li>
                    <li><strong>Pet Health Information:</strong> Pet physical conditions explicitly and voluntarily entered inside our AI Diagnoses modules.</li>
                  </ul>
                </section>

                {/* 3. How We Use Your Information */}
                <section id="sec-3" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">03.</span> How We Use Your Information
                  </h3>

                  <div className="space-y-3">
                    <p className="font-bold text-xs text-stone-855 dark:text-stone-200">3.1 Service Provision</p>
                    <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                      <li>Authorizing, packing, and dispatching your orders safely.</li>
                      <li>Setting up and managing your client account profile.</li>
                      <li>Providing responsive concierge customer support diagnostics.</li>
                      <li>Resolving return validations and cancellation refunds.</li>
                      <li>Delivering automatic dispatch tracking emails and AWB SMS updates.</li>
                    </ul>

                    <p className="font-bold text-xs text-stone-855 dark:text-stone-200 pt-1">3.2 Communication</p>
                    <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                      <li>Responding to tickets and chats.</li>
                      <li>Sharing verified seasonal promotional notices (strictly with your opt-in).</li>
                      <li>Curating customized pet aromatherapy and supplement warnings.</li>
                      <li>Exposing critical policy changes or service disruptions.</li>
                    </ul>

                    <p className="font-bold text-xs text-stone-855 dark:text-stone-200 pt-1">3.3 Business Operations</p>
                    <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                      <li>Upgrading Website performance, speeds, and checkout UI.</li>
                      <li>Evaluating user flows for market research and inventory management.</li>
                      <li>Combating bot activity, transaction abuse, and fraud.</li>
                      <li>Complying with central tax (GST) and legal record directives.</li>
                    </ul>

                    <p className="font-bold text-xs text-stone-855 dark:text-stone-200 pt-1">3.4 Marketing and Personalization</p>
                    <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                      <li>Tailoring customized layout experiences.</li>
                      <li>Suggesting complementary health elixirs.</li>
                      <li>Conducting voluntary survey and response drives.</li>
                    </ul>
                  </div>
                </section>

                {/* 4. Information Sharing */}
                <section id="sec-4" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">04.</span> Information Sharing and Disclosure
                  </h3>
                  <p>
                    We never barter or sell your database entries. We only disclose records strictly inside these bounds:
                  </p>
                  <p className="font-bold text-xs text-stone-855 dark:text-stone-200 mt-2">4.1 Third-Party Service Providers</p>
                  <p>We work with vetted service partners to secure standard e-commerce functions:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                    <li>Payment processing (including PhonePe or Razorpay nodes).</li>
                    <li>Dispatch and logistics (including Air Waybill integrations like Shiprocket).</li>
                    <li>SMS and WhatsApp notifications channels.</li>
                    <li>Secure development hosts and cloud servers.</li>
                  </ul>

                  <p className="font-bold text-xs text-stone-855 dark:text-stone-200 pt-2">4.2 Legal Compliance</p>
                  <p>
                    We may output account records under compliance or when mandatory to guard security, satisfy regulatory e-commerce audits, defend legal rights, or execute court rulings.
                  </p>
                </section>

                {/* 5. Data Retention */}
                <section id="sec-5" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">05.</span> Data Retention
                  </h3>
                  <p>
                    We keep your credentials only as long as necessary to provide stable service or meet compliance parameters. Account settings remain stored until you explicitly request profile deletion. Tax invoices, sales receipts, and tracking records are securely archived for <strong>7 years</strong> for auditing and central income declaration protocols in India.
                  </p>
                </section>

                {/* 6. Data Security */}
                <section id="sec-6" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">06.</span> Data Security
                  </h3>
                  <p>
                    We have launched rigorous administrative and technical protocols to shield your information:
                  </p>

                  <div className="space-y-3">
                    <div className="border border-stone-150 dark:border-stone-850 p-4 rounded-xl space-y-1.5 bg-stone-50/50 dark:bg-stone-900/40">
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span>🔐</span> Technical Measures
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 pl-5">
                        All transit records are wrapped in active Secure Sockets Layer (SSL) encryption. Servers are fortified behind custom proxy firewalls with continuous patches and data-at-rest encryption modules.
                      </p>
                    </div>

                    <div className="border border-stone-150 dark:border-stone-850 p-4 rounded-xl space-y-1.5 bg-stone-50/50 dark:bg-stone-900/40">
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span>👥</span> Administrative Measures
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 pl-5">
                        Internal employees undergo routine data protection sessions. Access to core tables is highly curated, and our developers run rigorous automated server checks.
                      </p>
                    </div>

                    <div className="border border-stone-150 dark:border-stone-850 p-4 rounded-xl space-y-1.5 bg-stone-50/50 dark:bg-stone-900/40">
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span>🏢</span> Physical Measures
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 pl-5">
                        Our codebases and systems reside inside premier, continuously monitored global cloud centers with absolute physical barriers and secure clearances.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 7. Your Rights */}
                <section id="sec-7" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">07.</span> Your Rights
                  </h3>
                  <p>In accordance with Indian laws, you hold clear, enforceable rights regarding your files:</p>

                  <div className="space-y-3 pl-4 border-l-2 border-stone-200 dark:border-stone-800">
                    <div>
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100">• Access and Correction</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        You can request summaries of collected details, correct outdated records, and demand complete transparency over handling methods.
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100">• Withdrawal of Consent</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        You may withdraw your consent for any non-essential processing at any stage, or unsubscribe from seasonal catalogs and emails.
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100">• Data Deletion</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        You hold the right to demand complete erasure of your credentials, provided we aren't bound by statutory tax, safety audits, or legal mandates to keep them.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-stone-500 mt-2">
                    To trigger any of these rights, drop us an email at{" "}
                    <a href="mailto:pawwcious@gmail.com" className="text-teal-700 font-mono dark:text-teal-400 hover:underline">
                      pawwcious@gmail.com
                    </a>.
                  </p>
                </section>

                {/* 8. Cookies & Tracking */}
                <section id="sec-8" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">08.</span> Cookies and Tracking Technologies
                  </h3>
                  <p>
                    Our Website uses cookies to save layout configurations, avoid re-logs, inspect click rates, and ensure our cart mechanics perform without failure. You can configure cookie blocking directly via browser menus, though certain interactive checkout blocks might be affected.
                  </p>
                </section>

                {/* 9. Third-Party Links */}
                <section id="sec-9" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">09.</span> Third-Party Links
                  </h3>
                  <p>
                    We might occasionally integrate third-party links (logistics utilities, payment redirects, or external resources). Since we do not audit outside code, we are not responsible for their individual protocols. Ensure you review their legal rules.
                  </p>
                </section>

                {/* 10. Children’s Privacy */}
                <section id="sec-10" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">10.</span> Children’s Privacy
                  </h3>
                  <p>
                    Our store is strictly optimized to serve adults older than <strong>18 years</strong>. We do not deliberately index or record information of minors. If we detect minor entries, we move instantly to execute complete wipe filters.
                  </p>
                </section>

                {/* 11. International Transfers */}
                <section id="sec-11" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">11.</span> International Data Transfers
                  </h3>
                  <p>
                    Our data storage structures primary operate and scale directly in <strong>India</strong>. In event of external cloud backup routing, we enforce strict encryption standards ensuring full compliance with national frameworks.
                  </p>
                </section>

                {/* 12. Grievance Redressal */}
                <section id="sec-12" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-emerald-900/10 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">12.</span> Grievance Redressal
                  </h3>
                  <p>
                    If you hold inquiries, disputes, or security complaints over historical handling, please approach our authorized Grievance Officer:
                  </p>

                  <div className="border border-[#b39e7d]/30 rounded-2xl p-5 space-y-3.5 bg-gradient-to-br from-[#FAF9F5]/80 via-white/40 to-stone-100/50 dark:from-stone-900/60 dark:to-stone-950/60">
                    <div>
                      <p className="text-[10px] font-mono tracking-wider font-extrabold text-amber-600 dark:text-amber-450 uppercase">
                        Official Grievance Officer (India)
                      </p>
                      <p className="font-black text-stone-900 dark:text-stone-100 text-sm mt-0.5">
                        Name: Shatank Srivastava
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-650 dark:text-stone-350">
                      <div className="flex items-center gap-2.5">
                        <Mail className="h-4 w-4 text-emerald-850 dark:text-teal-400 shrink-0" />
                        <a href="mailto:wecare@pawwcious.com" className="font-mono hover:underline text-stone-900 dark:text-stone-100 font-bold">
                          wecare@pawwcious.com
                        </a>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-emerald-850 dark:text-teal-400 shrink-0" />
                        <span className="font-mono text-stone-900 dark:text-stone-100 font-bold">
                          +91-7977081337 / +91-9637246914
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-stone-400 text-xs shrink-0 select-none">🕒</span>
                        <span>Working hours: Mon–Sat, 10 AM – 6 PM IST</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-500 italic border-t border-stone-200/50 dark:border-stone-800 pt-2.5">
                      We acknowledge all complaints within <strong>48 hours</strong> and work to isolate and completely resolve matters and bugs within <strong>30 days</strong>.
                    </p>
                  </div>
                </section>

                {/* 13. Policy Updates */}
                <section id="sec-13" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">13.</span> Updates to This Policy
                  </h3>
                  <p>
                    We might revise pages of this Privacy Policy to reflect e-commerce code updates or new statutory guidelines. In case of updates we will communicate via:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                    <li>Publishing the freshly revised layout on our Website.</li>
                    <li>Sending circular update logs inline or via email (for material updates).</li>
                    <li>Placing notification banners atop active shopping views.</li>
                  </ul>
                </section>

                {/* 14. Contact Information */}
                <section id="sec-14" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">14.</span> Contact Information
                  </h3>
                  <p>For any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
                  <div className="bg-[#FAF9F5]/30 dark:bg-stone-900/30 p-4 rounded-xl border border-stone-200/50 dark:border-stone-800 space-y-1 text-xs">
                    <p className="font-black text-stone-900 dark:text-stone-100">Pawwcious</p>
                    <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-stone-400" /> <a href="mailto:pawwcious@gmail.com" className="font-mono hover:underline">pawwcious@gmail.com</a></p>
                    <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-stone-400" /> <span className="font-mono text-stone-700 dark:text-stone-300 font-medium">+91-7977081337 / +91-9637246914</span></p>
                    <p className="flex items-center gap-2"><ExternalLink className="h-3.5 w-3.5 text-stone-400" /> <a href="https://www.pawwcious.com" target="_blank" rel="noopener noreferrer" className="hover:underline">https://www.pawwcious.com</a></p>
                  </div>
                </section>

                {/* 15. Consent */}
                <section id="sec-15" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">15.</span> Consent & Effectiveness
                  </h3>
                  <p>
                    By interacting with our Website and luxury products, you explicitly confirm that you have read, understood, and agree to be bound by all of the provisions parsed on this page.
                  </p>

                  <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-emerald-50/15 dark:bg-stone-900/20 text-xs text-stone-650 dark:text-stone-350 space-y-2 mt-4">
                    <p className="font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                      Policy Effectiveness Statement
                    </p>
                    <p>
                      This Privacy Policy is effective as of the date last updated above and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
                    </p>
                  </div>
                </section>

              </div>
            </article>
          )}

          {/* TERMS & CONDITIONS VIEW */}
          {activeTab === "terms" && (
            <article className="space-y-8 font-sans pb-10">
              <div className="border-b border-stone-100 dark:border-stone-850 pb-5 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400">
                  <FileText className="h-6 w-6 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Commercial Legal Terms</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                  Terms & Conditions of Service
                </h2>
                <p className="text-[10px] font-mono text-stone-400">
                  Last Updated: June 19, 2026 • Legally binding in the Republic of India under Indian Laws
                </p>
              </div>

              {/* Table of Contents Section (Custom styled box) */}
              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-850 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
                  <span className="text-amber-500 font-extrabold font-sans">#</span> Terms Table of Contents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <a href="#sec-t-1" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">01.</span> Introduction & Acceptance
                  </a>
                  <a href="#sec-t-2" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">02.</span> Definitions
                  </a>
                  <a href="#sec-t-3" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">03.</span> Eligibility & Registration
                  </a>
                  <a href="#sec-t-4" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">04.</span> Products & Services
                  </a>
                  <a href="#sec-t-5" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">05.</span> Ordering & Pricing
                  </a>
                  <a href="#sec-t-6" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">06.</span> Payment Terms
                  </a>
                  <a href="#sec-t-7" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">07.</span> Shipping & Delivery
                  </a>
                  <a href="#sec-t-8" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">08.</span> Returns & Refunds
                  </a>
                  <a href="#sec-t-9" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">09.</span> User Conduct
                  </a>
                  <a href="#sec-t-10" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">10.</span> Intellectual Property
                  </a>
                  <a href="#sec-t-11" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">11.</span> Privacy & Data Protection
                  </a>
                  <a href="#sec-t-12" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">12.</span> Disclaimers & Liability
                  </a>
                  <a href="#sec-t-13" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">13.</span> Indemnification
                  </a>
                  <a href="#sec-t-14" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">14.</span> Third-Party Services
                  </a>
                  <a href="#sec-t-15" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">15.</span> Dispute Resolution
                  </a>
                  <a href="#sec-t-16" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">16.</span> Termination
                  </a>
                  <a href="#sec-t-17" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">17.</span> Modifications
                  </a>
                  <a href="#sec-t-18" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">18.</span> Severability
                  </a>
                  <a href="#sec-t-19" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">19.</span> Entire Agreement
                  </a>
                  <a href="#sec-t-20" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">20.</span> Contact Information
                  </a>
                  <a href="#sec-t-21" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">21.</span> Additional Terms
                  </a>
                  <a href="#sec-t-22" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">22.</span> Compliance
                  </a>
                  <a href="#sec-t-23" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">23.</span> Acknowledgment
                  </a>
                </div>
              </div>

              {/* Main Content Sections */}
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-7 leading-relaxed font-light">

                {/* 1. Introduction & Acceptance */}
                <section id="sec-t-1" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">01.</span> Introduction and Acceptance
                  </h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                      1.1 Agreement to Terms
                    </p>
                    <p>
                      These Terms and Conditions (“Terms”, “Agreement”) constitute a legally binding agreement between you (“User”, “Customer”, “you”) and <strong>Pawwcious</strong> (“Company”, “we”, “us”, “our”) concerning your access to and use of the{" "}
                      <a href="https://www.pawwcious.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-teal-400 hover:underline">
                        https://www.pawwcious.com
                      </a>{" "}
                      website (“Website”) and the purchase of products and services (“Services”).
                    </p>

                    <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                      1.2 Acceptance
                    </p>
                    <p>
                      By accessing our Website, creating a personalized profile account, or placing an active commercial checkout order, you acknowledge that you have read, understood, and explicitly agree to be bound by these Terms and all applicable laws and national regulations.
                    </p>

                    <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                      1.3 Legal Compliance
                    </p>
                    <p className="bg-stone-50 dark:bg-stone-900 p-3.5 border-l-2 border-emerald-700 rounded-r-xl">
                      These Terms are compiled and published in strict accordance with:
                      <span className="block mt-1 pl-3 font-medium text-[11.5px] text-stone-600 dark:text-stone-400 font-mono text-left space-y-0.5">
                        • Information Technology Act, 2000 and subsequent amendments;<br />
                        • Consumer Protection Act, 2019 and Consumer Protection (E-commerce) Rules, 2020;<br />
                        • Indian Contract Act, 1872 & Sale of Goods Act, 1930;<br />
                        • Foreign Exchange Management Act (FEMA), 1999.
                      </span>
                    </p>
                  </div>
                </section>

                {/* 2. Definitions */}
                <section id="sec-t-2" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">02.</span> Definitions
                  </h3>
                  <p>In this Agreement, the following terms hold precise contractual meanings:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                    <div className="p-3 border border-stone-100 dark:border-stone-850 rounded-xl">
                      <p className="font-bold text-xs text-stone-950 dark:text-stone-100">“Account”</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">The customer profile register generated voluntarily on our premium Website checkout.</p>
                    </div>
                    <div className="p-3 border border-stone-100 dark:border-stone-850 rounded-xl">
                      <p className="font-bold text-xs text-stone-950 dark:text-stone-100">“Content”</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">All text, graphics, vector icons, active unboxing reel videos, layouts, and software codes.</p>
                    </div>
                    <div className="p-3 border border-stone-100 dark:border-stone-850 rounded-xl">
                      <p className="font-bold text-xs text-stone-950 dark:text-stone-100">“Order”</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">A deliberate commercial checkout request initiated to purchase natural products on our platform.</p>
                    </div>
                    <div className="p-3 border border-stone-100 dark:border-stone-850 rounded-xl">
                      <p className="font-bold text-xs text-stone-950 dark:text-stone-100">“Products”</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">Natural premium pet care supplements, aromatherapy drops, wood masticators, or powders sold here.</p>
                    </div>
                  </div>
                </section>

                {/* 3. Eligibility & Registration */}
                <section id="sec-t-3" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">03.</span> Eligibility and Account Registration
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    3.1 Eligibility Requirements
                  </p>
                  <p>To execute purchase actions or register customer records, you must fulfill all eligibility pillars:</p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center">
                      <span className="text-lg">🎂</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1 uppercase">Age Requirement</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">At least 18 years of age</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center">
                      <span className="text-lg">⚖️</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1 uppercase">Legal Capacity</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Capacity to enter agreements</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center">
                      <span className="text-lg">🇮🇳</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1 uppercase">Residency</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Indian resident for domestic sales</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center">
                      <span className="text-lg">✅</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1 uppercase">Information</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Accurate legal billing details</p>
                    </div>
                  </div>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 mt-2">
                    3.2 Account Creation and Credentials
                  </p>
                  <p>
                    You may optionally set up a member account to track order logs. You hold sole liability to protect your passwords and handle actions occurring under your login. You must report security cracks instantly.
                  </p>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 mt-2">
                    3.3 Account Termination
                  </p>
                  <p>
                    We reserve absolute authority to freeze, lock, or erase any client records if we identify fraudulent actions, abusive language against concierge staff, legal terms violation, or counterfeit order placements.
                  </p>
                </section>

                {/* 4. Products & Services */}
                <section id="sec-t-4" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">04.</span> Products and Services
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    4.1 Product Information Accuracy
                  </p>
                  <p>
                    We strive to present precise colors, weights, botanical sources, and ingredient lists across active grooming elixirs and masticators. We cannot promise absolute real-time site updates or guarantee that physical labels on small-batch production remain completely immune to visual variance.
                  </p>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 mt-2">
                    4.2 Premium Product Categories
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="p-3 border border-stone-100 dark:border-stone-850 rounded-xl text-center bg-stone-50/50 dark:bg-stone-900/30">
                      <span className="text-lg">🧴</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1">Grooming Products</p>
                    </div>
                    <div className="p-3 border border-stone-100 dark:border-stone-850 rounded-xl text-center bg-stone-50/50 dark:bg-stone-900/30">
                      <span className="text-lg">🧸</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1">Sustainable Toys</p>
                    </div>
                    <div className="p-3 border border-stone-100 dark:border-stone-850 rounded-xl text-center bg-stone-50/50 dark:bg-stone-900/30">
                      <span className="text-lg">💊</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1">Health Supplements</p>
                    </div>
                    <div className="p-3 border border-stone-100 dark:border-stone-850 rounded-xl text-center bg-stone-50/50 dark:bg-stone-900/30">
                      <span className="text-lg">🛠️</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1">Care Accessories</p>
                    </div>
                  </div>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 mt-2">
                    4.3 Product Safety & Quality Variations
                  </p>
                  <p>
                    Natural plant extracts show variance in viscosity, tone, or herbal flagrance. Always test supplements or serums on a small patch of coat, and immediately consult a certified veterinarian (BVSc) in case of any natural botanical allergen sensitivities.
                  </p>
                </section>

                {/* 5. Ordering & Pricing */}
                <section id="sec-t-5" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">05.</span> Ordering and Pricing
                  </h3>
                  <p>
                    Prices displayed on catalog pages are listed in Indian Rupees (INR) and are inclusive of Integrated Goods and Services Tax (IGST) or equivalent local CGST/SGST. Order checkouts are only valid once authorized completely. We reserve the right to cancel orders arising from extreme server errors or typo pricing bugs.
                  </p>
                </section>

                {/* 6. Payment Terms */}
                <section id="sec-t-6" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">06.</span> Payment Terms
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    6.1 Authorized Payment Methods
                  </p>
                  <p>We work with national integrated gateway frameworks to securely process payments:</p>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-2 border border-stone-150 dark:border-stone-850 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200">
                      💳 Cards (Visa/MC)
                    </div>
                    <div className="p-2 border border-stone-150 dark:border-stone-850 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200">
                      🏦 Net Banking
                    </div>
                    <div className="p-2 border border-stone-150 dark:border-stone-850 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200">
                      📱 UPI Networks
                    </div>
                    <div className="p-2 border border-stone-150 dark:border-stone-850 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200">
                      💰 Wallets
                    </div>
                    <div className="p-2 border border-stone-150 dark:border-stone-850 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200">
                      💸 COD Verification
                    </div>
                  </div>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 mt-2">
                    6.2 Extreme Payment Security
                  </p>
                  <div className="bg-[#FAF9F5]/45 dark:bg-stone-900/40 p-4 border border-stone-250 dark:border-stone-800 rounded-xl flex items-start gap-4">
                    <Lock className="h-5 w-5 text-teal-800 dark:text-teal-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                        Absolute PCI-DSS Encryption
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                        We maintain zero-trace financial systems. Credit strings, UPI PIN details, or net banking logins bypass our server environments completely and are routed to audited bank gateways via SSL end-to-end.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 7. Shipping & Delivery */}
                <section id="sec-t-7" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">07.</span> Shipping and Delivery
                  </h3>
                  <p>
                    Order dispatch occurs via our <strong>Shiprocket logistics pane</strong> within <strong>24 working hours</strong> of transaction clearance. Normal metropolitan transits are completed in <strong>48 to 72 hours</strong>. We are not liable for transit hold-ups arising strictly from extreme natural blockades, political strikes, or pin-code isolation parameters.
                  </p>
                </section>

                {/* 8. Returns & Refunds */}
                <section id="sec-t-8" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">08.</span> Returns and Refunds
                  </h3>
                  <p>
                    Under hygienic animal healthcare laws, opened bottles, unsealed powders, or bitten wood masticators are ineligible for returns. For defective containers or unboxing transit breaks, please file unboxing footage at{" "}
                    <a href="mailto:pawwcious@gmail.com" className="font-mono text-emerald-850 dark:text-teal-400 font-medium">
                      pawwcious@gmail.com
                    </a>{" "}
                    within <strong>7 days</strong>. Refund reversals to your original gateway take <strong>5 to 7 corporate banking days</strong>.
                  </p>
                </section>

                {/* 9. User Conduct */}
                <section id="sec-t-9" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">09.</span> User Conduct and Responsibilities
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    9.1 Acceptable Use Guidelines
                  </p>
                  <p>You agree to navigate our Website using ethical browser scripts, keep profile records accurate, respect brand copyright marks, and use natural care solutions strictly for legal pet hygiene support.</p>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    9.2 Prohibited Activities
                  </p>
                  <p>We maintain strict filters preventing database probing, code extraction, SQL injects, artificial transaction spam, false product reviews, or threats of defamation against our support or manufacturing units.</p>
                </section>

                {/* 10. Intellectual Property */}
                <section id="sec-t-10" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">10.</span> Intellectual Property
                  </h3>
                  <p>
                    All visual layout blueprints, Furbreeze or Furlush trademark identities, packaging typography, custom vectors, product descriptions, patent codes, and AI response patterns are protected under Indian and International Intellectual Property Laws. Unauthorized cloning, scraping, or branding replication will trigger dynamic injunction suits.
                  </p>
                </section>

                {/* 11. Privacy & Data Protection */}
                <section id="sec-t-11" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">11.</span> Privacy and Data Protection
                  </h3>
                  <p>
                    Your personal information is processed under standard regulatory conditions outlined strictly in our verified Privacy Policy section. We satisfy key encryption parameters specified in DPDP Act, 2023.
                  </p>
                </section>

                {/* 12. Disclaimers & Liability */}
                <section id="sec-t-12" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">12.</span> Disclaimers and Limitation of Liability
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    12.1 Service Availability
                  </p>
                  <p>The Website storefront is delivered strictly using standard cloud hosts on an “as is” and “as available” structural footing without continuous uptime warranties.</p>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    12.2 Premium Product Disclaimers
                  </p>
                  <div className="border-l-4 border-amber-500 pl-4 py-1.5 text-stone-650 dark:text-stone-400 bg-amber-50/50 dark:bg-amber-950/20 italic">
                    <strong>Veterinary Care Notice:</strong> Holistic products are formulated for natural topical comfort, smell neutralization, and hair care support. They do not constitute pharmacological drug classifications, anti-parasitic prescriptions, or emergency animal medicines. Always utilize BVSc recommendations.
                  </div>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-2">
                    12.3 Limitation of Liability
                  </p>
                  <p>
                    To the maximum legal degree of Indian laws, our absolute liability for any direct or cumulative claims is strictly capped at the physical order payment amount received from you for the specific product in question. No indirect, collateral, or punitive safety damages of any scale are recoverable.
                  </p>
                </section>

                {/* 13. Indemnification */}
                <section id="sec-t-13" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-[#b39e7d]/30 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">13.</span> Indemnification
                  </h3>
                  <p>
                    You agree to hold, defend, and insulate <strong>Pawwcious</strong>, its developer squad, logistical network affiliates, and company directors immune to any legal expenses, attorney payments, or structural losses that crop up because of your improper browser misuse or direct violation of these provisions.
                  </p>
                </section>

                {/* 14. Third-Party Services */}
                <section id="sec-t-14" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">14.</span> Third-Party Services
                  </h3>
                  <p>
                    We coordinate checkout, SMS, maps, tracking, and unboxing feeds via outside developers (including Shiprocket, Razorpay, or PhonePe nodes). Since we do not edit their frameworks directly, we cannot warrant their persistent uptime or structural integrity.
                  </p>
                </section>

                {/* 15. Dispute Resolution */}
                <section id="sec-t-15" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-[#b39e7d]/30 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">15.</span> Dispute Resolution
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    15.1 Governing Law
                  </p>
                  <p>This Agreement and all physical transaction invoices are strictly governed according to the laws of the Republic of India without applying traditional conflicts of legal theory.</p>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    15.2 Judicial Jurisdiction
                  </p>
                  <p>
                    Any legal discrepancies, civil suits, or claims arising from consumer safety arguments shall be strictly files and processed under the exclusive legal jurisdiction of tribunals and courts in <strong>Hyderabad, India</strong>.
                  </p>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    15.3 Alternative Dispute Resolution Hierarchy
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center">
                      <div className="h-6 w-6 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-1">1</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Concierge Service</p>
                      <p className="text-[10px] text-stone-500">Fast analysis via direct support</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center">
                      <div className="h-6 w-6 bg-teal-500/10 text-teal-600 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-1">2</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Executive Mediation</p>
                      <p className="text-[10px] text-stone-500">Escalated review through our Grievance Cell</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center">
                      <div className="h-6 w-6 bg-stone-500/10 text-stone-600 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-1">3</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Arbitration</p>
                      <p className="text-[10px] text-stone-500">Legal arbitration in Hyderabad</p>
                    </div>
                  </div>
                </section>

                {/* 16. Termination */}
                <section id="sec-t-16" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">16.</span> Termination
                  </h3>
                  <p>
                    We reserve unilateral powers to block account login access, refuse checkout completions, or terminate loyalty discounts for any customer without notice if structural violations of our safety guidelines or contract rules are observed.
                  </p>
                </section>

                {/* 17. Modifications */}
                <section id="sec-t-17" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">17.</span> Modifications of Terms
                  </h3>
                  <p>
                    We hold absolute freedom to modify any sentences of these Terms to keep up with central GST regulations, Consumer Protection rules, or e-commerce structures. Check this page routinely. Continued access constitutes absolute consent to modified codes.
                  </p>
                </section>

                {/* 18. Severability */}
                <section id="sec-t-18" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">18.</span> Severability
                  </h3>
                  <p>
                    If any specific clause or sentence of this legal Agreement is ruled void, unlawful, or unenforceable by any courtroom of Hyderabad, that sentence shall be severed without weakening the binding integrity of any of the remaining sections.
                  </p>
                </section>

                {/* 19. Entire Agreement */}
                <section id="sec-t-19" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">19.</span> Entire Agreement
                  </h3>
                  <p>
                    These Terms & Conditions, together with our corresponding Privacy Policy and Order Receipts, represent the entire physical and legal understanding between you and <strong>Pawwcious</strong>.
                  </p>
                </section>

                {/* 20. Contact Information */}
                <section id="sec-t-20" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-[#b39e7d]/20 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">20.</span> Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                      <p className="text-xs font-mono font-extrabold uppercase text-amber-600">Customer Support Desk</p>
                      <p className="flex items-center gap-2 text-xs"><Mail className="h-3.5 w-3.5 text-stone-400" /> <a href="mailto:pawwcious@gmail.com" className="font-mono hover:underline">pawwcious@gmail.com</a></p>
                      <p className="flex items-center gap-2 text-xs"><Phone className="h-3.5 w-3.5 text-stone-400" /> <span className="font-mono text-stone-700 dark:text-stone-300 font-medium">+91-7977081337 / +91-9637246914</span></p>
                      <p className="text-[11px] text-stone-500 leading-relaxed font-sans mt-1">
                        🏢 Villa no 31, Road no 10, Symphony Park Homes, Krishna Reddy Pet, Beeramguda, Patancheru, Pin 502032
                      </p>
                    </div>

                    <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                      <p className="text-xs font-mono font-extrabold uppercase text-teal-600">Grievance Redressal Cell</p>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 font-mono">Officer: Shatank Srivastava</p>
                      <p className="flex items-center gap-2 text-xs"><Mail className="h-3.5 w-3.5 text-stone-400" /> <a href="mailto:wecare@pawwcious.com" className="font-mono hover:underline">wecare@pawwcious.com</a></p>
                      <p className="flex items-center gap-2 text-xs"><Phone className="h-3.5 w-3.5 text-stone-400" /> <span className="font-mono text-stone-700 dark:text-stone-300 font-medium">+91-7977081337 / +91-9637246914</span></p>
                      <p className="text-[10px] text-stone-400 italic">Response Protocol: Acknowledged within 48 hours, fully resolved under 30 days.</p>
                    </div>
                  </div>
                </section>

                {/* 21. Additional Terms */}
                <section id="sec-t-21" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">21.</span> Additional Terms
                  </h3>
                  <p>
                    Special discount codes, free seasonal samples, review contests, or automated subscriptions may carry additional pop-up terms. In case of conflicts, specific promotion rules will override standard boilerplate terms.
                  </p>
                </section>

                {/* 22. Compliance */}
                <section id="sec-t-22" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">22.</span> Compliance and Regulatory Information
                  </h3>

                  <div className="space-y-2.5">
                    <p className="font-bold text-xs text-stone-955 dark:text-stone-100">22.1 GST Compliance</p>
                    <p className="pl-4">Tax breakdown invoices are dispatched automatically upon each transaction clearance. Product listings carry inclusive central e-commerce tax calculations.</p>

                    <p className="font-bold text-xs text-stone-955 dark:text-stone-100">22.2 Animal Welfare Compliance</p>
                    <p className="pl-4">We are strict animal lovers. All botanical oils and minerals are ethically sourced from PETA-compliant, cruelty-free suppliers ensuring standard domestic wellness boundaries.</p>
                  </div>
                </section>

                {/* 23. Acknowledgment */}
                <section id="sec-t-23" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">23.</span> Acknowledgment & Consent
                  </h3>
                  <p>By entering our platform nodes and purchasing our solutions, you explicitly certify that:</p>

                  <ul className="list-disc pl-5 space-y-1.5 text-stone-605 dark:text-stone-400">
                    <li>You have read, understood, and agreed to be bound by these legal Terms and Conditions.</li>
                    <li>You represent sufficient age and contract authority to commit transactions.</li>
                    <li>You acknowledge natural product sensitivities and veterinary guidelines.</li>
                    <li>You accept full legal liability over checking out using verified payment modes.</li>
                  </ul>

                  <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-emerald-50/15 dark:bg-stone-900/20 text-xs text-stone-650 dark:text-stone-350 space-y-2 mt-4">
                    <p className="font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 text-center">
                      Binding Legal Agreement Status
                    </p>
                    <p className="text-center">
                      This constitutes our final, binding legal terms contract. If you require further clarification, direct lines to our Hyderabad Legal and Grievance desks remain continuously open.
                    </p>
                  </div>
                </section>

              </div>
            </article>
          )}

          {/* SHIPPING & FULFILLMENT LOGISTICS VIEW */}
          {activeTab === "shipping" && (
            <article className="space-y-8 font-sans pb-10">
              <div className="border-b border-stone-100 dark:border-stone-850 pb-5 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400">
                  <Truck className="h-6 w-6 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Fulfillment Standards</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                  Shipping, Transit & Delivery Policy
                </h2>
                <p className="text-[10px] font-mono text-stone-400">
                  Last Updated: June 19, 2026 • Dispatched via Shiprocket Network • Serving 26k+ Indian Locations
                </p>
              </div>

              {/* Table of Contents Section (Custom styled box) */}
              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-850 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
                  <span className="text-amber-500 font-extrabold font-sans">#</span> Shipping Table of Contents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <a href="#sec-s-1" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">01.</span> Introduction
                  </a>
                  <a href="#sec-s-2" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">02.</span> Shipping Coverage
                  </a>
                  <a href="#sec-s-3" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">03.</span> Shipping Methods
                  </a>
                  <a href="#sec-s-4" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">04.</span> Order Processing
                  </a>
                  <a href="#sec-s-5" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">05.</span> Shipping Costs
                  </a>
                  <a href="#sec-s-6" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">06.</span> Delivery Process
                  </a>
                  <a href="#sec-s-7" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">07.</span> Order Tracking
                  </a>
                  <a href="#sec-s-8" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">08.</span> Delivery Locations
                  </a>
                  <a href="#sec-s-9" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">09.</span> Delivery Charges
                  </a>
                  <a href="#sec-s-10" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">10.</span> Cash on Delivery
                  </a>
                  <a href="#sec-s-11" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">11.</span> Packaging & Handling
                  </a>
                  <a href="#sec-s-12" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">12.</span> Delivery Issues
                  </a>
                  <a href="#sec-s-13" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">13.</span> Failed Delivery
                  </a>
                  <a href="#sec-s-14" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">14.</span> Force Majeure
                  </a>
                  <a href="#sec-s-15" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">15.</span> Special Services
                  </a>
                  <a href="#sec-s-16" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">16.</span> Customer Responsibilities
                  </a>
                  <a href="#sec-s-17" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">17.</span> Contact Information
                  </a>
                  <a href="#sec-s-18" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">18.</span> Policy Updates
                  </a>
                  <a href="#sec-s-19" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">19.</span> Acceptance
                  </a>
                </div>
              </div>

              {/* Main Content Sections */}
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-7 leading-relaxed font-light">

                {/* 1. Introduction */}
                <section id="sec-s-1" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">01.</span> Introduction
                  </h3>
                  <p>
                    This Shipping and Delivery Policy outlines the terms and conditions for the shipping and delivery of products purchased from <strong>Pawwcious</strong> through our website{" "}
                    <a href="https://www.pawwcious.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-teal-400 hover:underline">
                      https://www.pawwcious.com
                    </a>{" "}
                    (“Website”). We are committed to providing reliable, timely, and secure delivery services for all our natural pet care products.
                  </p>
                  <p className="bg-stone-50 dark:bg-stone-900 p-3.5 border-l-2 border-emerald-750/70 rounded-r-xl">
                    This policy complies with:
                    <span className="block mt-1 pl-3 font-medium text-[11.5px] text-stone-600 dark:text-stone-400">
                      • Consumer Protection Act, 2019<br />
                      • Consumer Protection (E-commerce) Rules, 2020<br />
                      • Indian Post Office Act, 1898<br />
                      • Motor Transport Workers Act, 1961
                    </span>
                  </p>
                </section>

                {/* 2. Shipping Coverage */}
                <section id="sec-s-2" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">02.</span> Shipping Coverage
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center bg-stone-50/30 dark:bg-stone-900/20">
                      <span className="text-lg">🇮🇳</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1 uppercase">Domestic Shipping</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">All major cities and metro areas across India with courier connectivity</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center bg-stone-50/30 dark:bg-stone-900/20">
                      <span className="text-lg">🌏</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1 uppercase">International Shipping</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Currently not available. We only deliver within India</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl text-center bg-stone-50/30 dark:bg-stone-900/20">
                      <span className="text-lg">🚫</span>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mt-1 uppercase">Shipping Restrictions</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Security restricted areas, remote locations, P.O. Box addresses</p>
                    </div>
                  </div>
                </section>

                {/* 3. Shipping Methods */}
                <section id="sec-s-3" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">03.</span> Shipping Methods and Timeframes
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-stone-150 dark:border-stone-850 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-[#FAF9F5]/40 dark:bg-stone-905">
                      <div>
                        <p className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span className="text-emerald-705">📦</span> Standard Shipping
                        </p>
                        <ul className="list-disc pl-5 mt-1 text-[11.5px] text-stone-600 dark:text-stone-400 space-y-0.5">
                          <li>Delivery Time: <strong>5-7 business days</strong></li>
                          <li>Coverage: All serviceable areas</li>
                          <li>Tracking: Provided for all orders</li>
                          <li>Cost: As displayed at checkout</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 border border-stone-150 dark:border-stone-850 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-[#FAF9F5]/40 dark:bg-stone-905">
                      <div>
                        <p className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span className="text-amber-605">⚡</span> Express Shipping
                        </p>
                        <ul className="list-disc pl-5 mt-1 text-[11.5px] text-stone-600 dark:text-stone-400 space-y-0.5">
                          <li>Delivery Time: <strong>2-3 business days</strong></li>
                          <li>Coverage: Major cities and metro areas</li>
                          <li>Tracking: Real-time tracking available</li>
                          <li>Cost: Premium charges apply</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 border border-[#b39e7d]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-gradient-to-r from-amber-50/40 to-teal-50/10 dark:from-stone-900/60 dark:to-stone-950/60">
                      <div>
                        <p className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span className="text-teal-705">🌇</span> Same Day Delivery
                        </p>
                        <ul className="list-disc pl-5 mt-1 text-[11.5px] text-stone-600 dark:text-stone-400 space-y-0.5">
                          <li>Delivery Time: <strong>Within 24 hours</strong></li>
                          <li>Coverage: Select metro cities</li>
                          <li>Cut-off Time: Orders before <strong>2:01 PM IST</strong></li>
                          <li>Cost: Premium charges apply</li>
                          <li>Available in: Mumbai, Delhi, Bangalore, Pune, Hyderabad</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Order Processing */}
                <section id="sec-s-4" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">04.</span> Order Processing Time
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    4.1 Standard Processing
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <div className="h-6 w-6 bg-teal-500/10 text-teal-650 rounded-full flex items-center justify-center font-bold text-xs mb-1">1</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Processing Time</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">1-2 business days for standard orders</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <div className="h-6 w-6 bg-teal-500/10 text-teal-650 rounded-full flex items-center justify-center font-bold text-xs mb-1">2</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Working Days</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Monday to Saturday (excluding public holidays)</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <div className="h-6 w-6 bg-teal-500/10 text-teal-650 rounded-full flex items-center justify-center font-bold text-xs mb-1">3</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Cut-off Time</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">3:00 PM for same-day processing</p>
                    </div>
                  </div>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    4.2 Order Confirmations
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1 text-xs">
                    <li>Order confirmation email sent immediately after payment</li>
                    <li>Processing confirmation sent when order is packed</li>
                    <li>Shipping confirmation with tracking details sent upon dispatch</li>
                  </ul>
                </section>

                {/* 5. Shipping Costs */}
                <section id="sec-s-5" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">05.</span> Shipping Costs
                  </h3>
                  <div className="border border-stone-150 dark:border-stone-850 rounded-2xl p-4 space-y-2 bg-[#FAF9F5]/45 dark:bg-stone-900/40">
                    <p className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wide">
                      Free Shipping Benefits:
                    </p>
                    <ul className="list-disc pl-5 text-stone-600 dark:text-stone-400 text-xs space-y-1">
                      <li>Minimum Order Value: <strong>₹999 and above</strong></li>
                      <li>Applicable To: Standard shipping only</li>
                      <li>Coverage: All serviceable areas</li>
                      <li>Exclusions: Bulky items may have additional charges</li>
                    </ul>
                  </div>
                  <p>
                    <strong>Transparent Pricing:</strong> All shipping charges are displayed at checkout before payment. No hidden charges or surprise fees.
                  </p>
                </section>

                {/* 6. Delivery Process */}
                <section id="sec-s-6" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">06.</span> Delivery Process
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    6.1 Delivery Attempt
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li>Primary Attempt: Delivery attempted at provided address</li>
                    <li>Contact: Customer contacted via phone/SMS before delivery</li>
                    <li>Delivery Window: Generally between 9:00 AM to 7:00 PM</li>
                    <li>Identification: Delivery executive will carry company identification</li>
                  </ul>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    6.2 Delivery Confirmation
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li>Recipient Verification: Photo ID verification may be required</li>
                    <li>Signature Required: For orders above ₹2,000</li>
                    <li>Delivery Proof: SMS and email confirmation sent</li>
                    <li>Photos: Delivery photos may be taken for verification</li>
                  </ul>
                </section>

                {/* 7. Order Tracking */}
                <section id="sec-s-7" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">07.</span> Order Tracking
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-stone-150 dark:border-stone-850 p-4 rounded-xl space-y-2 bg-stone-50/50 dark:bg-stone-900/40">
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wide">7.1 Tracking Methods</p>
                      <ul className="list-disc pl-5 text-xs text-stone-600 dark:text-stone-400 space-y-1">
                        <li>Website: Track orders on <a href="https://www.pawwcious.com" className="text-teal-700 hover:underline">https://www.pawwcious.com</a></li>
                        <li>SMS: Send order number to +91-7977081337</li>
                        <li>Email: Contact our customer service team</li>
                        <li>Phone: Call customer service for assistance</li>
                      </ul>
                    </div>

                    <div className="border border-stone-150 dark:border-stone-850 p-4 rounded-xl space-y-2 bg-stone-50/50 dark:bg-stone-900/40">
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wide">7.2 Tracking Statuses</p>
                      <div className="flex flex-wrap gap-1.5 text-[9.5px] font-mono">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded">✅ Order Confirmed</span>
                        <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-650 rounded">⚙️ Processing</span>
                        <span className="px-2 py-0.5 bg-neutral-550/10 text-neutral-600 dark:text-neutral-400 rounded">📦 Packed</span>
                        <span className="px-2 py-0.5 bg-teal-500/10 text-teal-650 rounded">🚚 Shipped</span>
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-650 rounded">🛣️ In Transit</span>
                        <span className="px-2 py-0.5 bg-pink-500/10 text-pink-600 rounded">🏠 Out for Delivery</span>
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-650 rounded">🎉 Delivered</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 8. Delivery Locations */}
                <section id="sec-s-8" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">08.</span> Delivery Locations
                  </h3>
                  <p>
                    Our delivery reaches across domestic Indian networks. If any specific regional area or terminal remains non-serviceable due to unexpected local blocks or courier cuts, our coordination team will coordinate alternative addresses or complete full refunds.
                  </p>
                </section>

                {/* 9. Delivery Charges */}
                <section id="sec-s-9" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-[#b39e7d]/35 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">09.</span> Delivery Charges Breakdown
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                    <table className="w-full text-xs text-left text-stone-650 dark:text-stone-350">
                      <thead className="text-[10px] uppercase font-mono bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-350">
                        <tr>
                          <th className="p-3">Order Value</th>
                          <th className="p-3">Metro Cities</th>
                          <th className="p-3">Tier 1 Cities</th>
                          <th className="p-3">Tier 2/3 Cities</th>
                          <th className="p-3">Rural Areas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-150 dark:divide-stone-850">
                        <tr>
                          <td className="p-3">Below ₹500</td>
                          <td className="p-3 font-mono">₹99</td>
                          <td className="p-3 font-mono">₹120</td>
                          <td className="p-3 font-mono">₹150</td>
                          <td className="p-3 font-mono">₹200</td>
                        </tr>
                        <tr>
                          <td className="p-3">₹500-₹998</td>
                          <td className="p-3 font-mono">₹70</td>
                          <td className="p-3 font-mono">₹90</td>
                          <td className="p-3 font-mono">₹120</td>
                          <td className="p-3 font-mono">₹150</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-emerald-850 dark:text-teal-400">₹999+</td>
                          <td className="p-3 font-bold text-emerald-850 dark:text-teal-400">FREE</td>
                          <td className="p-3 font-bold text-emerald-850 dark:text-teal-400">FREE</td>
                          <td className="p-3 font-bold text-emerald-850 dark:text-teal-400">FREE</td>
                          <td className="p-3 font-mono">₹50</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-stone-500 italic mt-1 pl-1">
                    Express Shipping Rates: Metro Cities: ₹200-₹300 • Tier 1 Cities: ₹250-₹350 (Limited Coverage: Subject to availability)
                  </p>
                </section>

                {/* 10. Cash on Delivery */}
                <section id="sec-s-10" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">10.</span> Cash on Delivery (COD)
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    10.1 COD Availability
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li>Available for orders up to <strong>₹5,000</strong></li>
                    <li>Not available for express or same-day delivery</li>
                    <li>Additional COD charges: <strong>₹50 per order</strong></li>
                  </ul>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    10.2 COD Payment Guidelines
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li>Exact Amount: Please keep exact change ready</li>
                    <li>Payment Methods: Cash only (no checks or cards)</li>
                    <li>Receipt: COD receipt provided upon payment</li>
                  </ul>
                </section>

                {/* 11. Packaging & Handling */}
                <section id="sec-s-11" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">11.</span> Packaging and Handling
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    11.1 Packaging Standards
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li>Eco-friendly: Sustainable packaging materials used</li>
                    <li>Product Protection: Secure packaging to prevent damage</li>
                    <li>Hygiene: Food-grade packaging for pet consumables</li>
                    <li>Branding: Pawwcious branded packaging</li>
                  </ul>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    11.2 Special Handling
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li>Fragile Items: Extra cushioning and ‘Handle with Care’ labels</li>
                    <li>Temperature Sensitive: Cold chain maintained where required</li>
                    <li>Liquid Products: Leak-proof packaging</li>
                    <li>Sharp Objects: Safe packaging for pet tools</li>
                  </ul>
                </section>

                {/* 12. Delivery Issues */}
                <section id="sec-s-12" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">12.</span> Delivery Issues
                  </h3>
                  <p>
                    For transit blockades, liquid box leakage, or damaged bottles, record a brief unboxing video within 7 days and contact us. We maintain direct support structures to coordinate rapid delivery replacements or complete refund reversals.
                  </p>
                </section>

                {/* 13. Failed Delivery */}
                <section id="sec-s-13" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">13.</span> Failed Delivery and Returns
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    13.1 Failed Delivery Process
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <span className="text-[#b39e7d] font-bold block text-xs">1</span>
                      <p className="font-extrabold text-[10px] text-stone-800 dark:text-stone-200 mt-1 uppercase">Immediate Notify</p>
                      <p className="text-[9px] text-stone-500">Customer informed immediate via SMS/call</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <span className="text-[#b39e7d] font-bold block text-xs">2</span>
                      <p className="font-extrabold text-[10px] text-stone-800 dark:text-stone-200 mt-1 uppercase">Re-attempt</p>
                      <p className="text-[9px] text-stone-500">Up to 3 delivery attempts made</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <span className="text-[#b39e7d] font-bold block text-xs">3</span>
                      <p className="font-extrabold text-[10px] text-stone-800 dark:text-stone-200 mt-1 uppercase">Local Storage</p>
                      <p className="text-[9px] text-stone-500">Package held at local facility for 7 days</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <span className="text-[#b39e7d] font-bold block text-xs">4</span>
                      <p className="font-extrabold text-[10px] text-stone-800 dark:text-stone-200 mt-1 uppercase">Return Origin</p>
                      <p className="text-[9px] text-stone-500">If undelivered after all attempts</p>
                    </div>
                  </div>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    13.2 Return to Origin (RTO)
                  </p>
                  <p>
                    RTO Charges: Customer liable for return shipping costs. Refund Process: Refund processed after deducting RTO charges. Timeline: 7-10 business days for RTO processing.
                  </p>
                </section>

                {/* 14. Force Majeure */}
                <section id="sec-s-14" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">14.</span> Force Majeure
                  </h3>
                  <p>
                    Pawwcious remains immune to delivery breaches or late arrivals arising from act of God, extreme monsoons, regional cyclones, national blockades, strikes, or political disruptions.
                  </p>
                </section>

                {/* 15. Special Services */}
                <section id="sec-s-15" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">15.</span> Special Services
                  </h3>
                  <p>
                    Specific heavy consignment shipping, custom luxury gift box wraps, and subscription plans have special dispatch slots. Extra logistics guidelines are displayed clearly inside those purchase funnels.
                  </p>
                </section>

                {/* 16. Customer Responsibilities */}
                <section id="sec-s-16" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">16.</span> Customer Responsibilities
                  </h3>
                  <p>
                    By buying natural elixirs here, you represent proper input of active contact numbers, pin codes, and addresses. You hold full responsibility to respond to delivery carrier dials or plan suitable alternative pick-up times.
                  </p>
                </section>

                {/* 17. Contact Information */}
                <section id="sec-s-17" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-[#b39e7d]/35 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">17.</span> Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                      <p className="text-xs font-mono font-extrabold uppercase text-[#b39e7d]">Customer Service Team</p>
                      <p className="flex items-center gap-2 text-xs"><Mail className="h-3.5 w-3.5 text-stone-400" /> <a href="mailto:shipping@pawwcious.com" className="font-mono hover:underline text-stone-900 dark:text-stone-100 font-bold">shipping@pawwcious.com</a></p>
                      <p className="flex items-center gap-2 text-xs"><Phone className="h-3.5 w-3.5 text-stone-400" /> <span className="font-mono text-stone-700 dark:text-stone-300 font-bold">+91-7977081337 / +91-9637246914</span></p>
                      <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                        Business Hours: Monday to Saturday, 9:00 AM to 6:00 PM IST
                      </p>
                    </div>

                    <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                      <p className="text-xs font-mono font-extrabold uppercase text-teal-650">Return / Exchange Address</p>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 font-mono">Pawwcious Returns Department</p>
                      <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                        🏢 Villa no 31, Road no 10, Symphony Park Homes, Krishna Reddy Pet, Beeramguda, Patancheru, Hyderabad, Telangana – Pin 502032
                      </p>
                      <p className="text-[10px] text-stone-400 italic">Contact phone: +91-7977081337 / +91-9637246914</p>
                    </div>
                  </div>
                </section>

                {/* 18. Policy Updates */}
                <section id="sec-s-18" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-101 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">18.</span> policy Updates
                  </h3>
                  <p>
                    We might revise pages of this Shipping Policy to reflect logistics rate updates or new postal guidelines.
                  </p>
                </section>

                {/* 19. Acceptance */}
                <section id="sec-s-19" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">19.</span> Policy Agreement & Acceptance
                  </h3>
                  <p>By placing an order with <strong>Pawwcious</strong>, you acknowledge that you have read, understood, and agree to be bound by this Shipping and Delivery Policy. If you do not agree with any part of this policy, please contact our customer service team before placing your order.</p>

                  <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-emerald-50/15 dark:bg-stone-900/20 text-xs text-stone-650 dark:text-stone-350 space-y-2 mt-4">
                    <p className="font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 text-center">
                      Shipping Policy Status
                    </p>
                    <p className="text-center">
                      This Shipping and Delivery Policy is effective as of the date last updated above and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on our website.
                    </p>
                  </div>
                </section>

              </div>
            </article>
          )}

          {/* REFUNDS, RETURNS & CANCELLATIONS VIEW */}
          {activeTab === "refund" && (
            <article className="space-y-8 font-sans pb-10">
              <div className="border-b border-stone-100 dark:border-stone-850 pb-5 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400">
                  <RotateCcw className="h-6 w-6 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Customer Protection</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                  Refund & Return Policy
                </h2>
                <p className="text-[10px] font-mono text-stone-400">
                  Last Updated: June 19, 2026 • Compliant with Indian Consumer Protection Rules
                </p>
              </div>

              {/* Table of Contents Section (Custom styled box) */}
              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-850 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
                  <span className="text-amber-500 font-extrabold font-sans">#</span> Return & Refund Table of Contents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <a href="#sec-r-1" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">01.</span> Introduction
                  </a>
                  <a href="#sec-r-2" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">02.</span> General Return Policy
                  </a>
                  <a href="#sec-r-3" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">03.</span> Non-Returnable Items
                  </a>
                  <a href="#sec-r-4" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">04.</span> Return Process
                  </a>
                  <a href="#sec-r-5" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">05.</span> Refund Process
                  </a>
                  <a href="#sec-r-6" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">06.</span> Special Circumstances
                  </a>
                  <a href="#sec-r-7" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">07.</span> Contact Information
                  </a>
                  <a href="#sec-r-8" className="hover:text-amber-600 dark:hover:text-amber-450 transition flex items-center gap-1.5">
                    <span className="font-mono text-stone-400">08.</span> Acceptance
                  </a>
                </div>
              </div>

              {/* Main Content Sections */}
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-7 leading-relaxed font-light">

                {/* 1. Introduction */}
                <section id="sec-r-1" className="scroll-mt-28 space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">01.</span> Introduction
                  </h3>
                  <p>
                    We are committed to providing high-quality natural pet care products and ensuring customer satisfaction. This Refund and Return Policy outlines the terms and conditions for returns, exchanges, and refunds for products purchased from our Website{" "}
                    <a href="https://www.pawwcious.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-teal-400 hover:underline">
                      https://www.pawwcious.com
                    </a>{" "}
                    (“Website”).
                  </p>
                  <p className="bg-stone-50 dark:bg-stone-900 p-3.5 border-l-2 border-emerald-750/70 rounded-r-xl">
                    This policy complies with:
                    <span className="block mt-1 pl-3 font-medium text-[11.5px] text-stone-600 dark:text-stone-400">
                      • Consumer Protection Act, 2019<br />
                      • Consumer Protection (E-commerce) Rules, 2020<br />
                      • Indian Contract Act, 1872<br />
                      • Sale of Goods Act, 1930
                    </span>
                  </p>
                </section>

                {/* 2. General Return Policy */}
                <section id="sec-r-2" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">02.</span> General Return Policy
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    2.1 Return Window
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                    <table className="w-full text-xs text-left text-stone-650 dark:text-stone-350">
                      <thead className="text-[10px] uppercase font-mono bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-350">
                        <tr>
                          <th className="p-3">Product Type</th>
                          <th className="p-3">Return Window</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-150 dark:divide-stone-850">
                        <tr>
                          <td className="p-3">Standard Products</td>
                          <td className="p-3 font-bold text-emerald-855 dark:text-teal-400">7 days from delivery</td>
                        </tr>
                        <tr>
                          <td className="p-3">Defective/Damaged Products</td>
                          <td className="p-3 font-bold text-amber-700 dark:text-amber-450">48 hours from delivery</td>
                        </tr>
                        <tr>
                          <td className="p-3">Wrong Product Delivered</td>
                          <td className="p-3 font-bold text-amber-700 dark:text-amber-450">48 hours from delivery</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    2.2 Return Eligibility Criteria
                  </p>
                  <p>
                    To be eligible for a return, products must meet the following conditions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-stone-150 dark:border-stone-850 rounded-xl space-y-2 bg-stone-50/50 dark:bg-stone-900/40">
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wide">For Standard Returns</p>
                      <ul className="list-disc pl-5 text-[11.5px] text-stone-600 dark:text-stone-400 space-y-1">
                        <li>Product must be in original, unused condition</li>
                        <li>Original packaging must be intact and undamaged</li>
                        <li>All labels, tags, and seals must be present</li>
                        <li>Product must not be expired or near expiry</li>
                        <li>Valid purchase receipt or order confirmation required</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-stone-150 dark:border-stone-850 rounded-xl space-y-2 bg-stone-50/50 dark:bg-stone-900/40">
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wide">For Defective/Damaged Products</p>
                      <ul className="list-disc pl-5 text-[11.5px] text-stone-600 dark:text-stone-400 space-y-1">
                        <li>Clear evidence of manufacturing defect or damage</li>
                        <li>Product received in damaged condition during delivery</li>
                        <li>Packaging damage that affects product integrity</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 3. Non-Returnable Items */}
                <section id="sec-r-3" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">03.</span> Non-Returnable Items
                  </h3>
                  <p>
                    The following items cannot be returned for hygiene, safety, and regulatory reasons:
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 border border-[#b39e7d]/35 rounded-xl bg-amber-50/10 dark:bg-stone-900/40 space-y-2">
                      <p className="font-bold text-xs text-red-800 dark:text-red-420 uppercase tracking-wide">
                        3.1 Completely Non-Returnable:
                      </p>
                      <ul className="list-disc pl-5 text-stone-600 dark:text-stone-400 text-xs space-y-1.5">
                        <li><strong>Opened/Used Grooming Products:</strong> Shampoos, conditioners, ear washes, and serums that have been opened or used.</li>
                        <li><strong>Opened Supplements:</strong> Any health supplements or nutritional products that have been opened.</li>
                        <li><strong>Opened Treats and Food:</strong> Pet treats, food items, or edible products that have been opened.</li>
                        <li><strong>Personalized Items:</strong> Custom-made or personalized pet accessories.</li>
                        <li><strong>Clearance/Sale Items:</strong> Products marked as final sale or clearance items.</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-stone-150 dark:border-stone-850 rounded-xl bg-[#FAF9F5]/40 dark:bg-stone-905 space-y-2">
                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                        3.2 Returnable Only if Defective/Damaged:
                      </p>
                      <ul className="list-disc pl-5 text-stone-650 dark:text-stone-400 text-xs space-y-1">
                        <li>Unopened grooming products</li>
                        <li>Unopened supplements and health products</li>
                        <li>Unopened pet treats and food items</li>
                        <li>Toys and accessories (only if manufacturing defects)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 4. Return Process */}
                <section id="sec-r-4" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">04.</span> Return Process
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    4.1 How to Initiate a Return
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 border border-stone-150 dark:border-stone-850 rounded-xl space-y-1.5">
                      <div className="h-6 w-6 bg-teal-500/10 text-teal-650 rounded-full flex items-center justify-center font-bold text-xs">1</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Contact Team</p>
                      <p className="text-[10px] text-stone-500 leading-normal">
                        Contact support within the eligible return window:<br />
                        📩 <a href="mailto:pawwcious@gmail.com" className="hover:underline font-bold text-teal-800 dark:text-teal-400">pawwcious@gmail.com</a><br />
                        📞 <span className="font-mono font-bold">+91-7977081337</span><br />
                        💬 WhatsApp: <span className="font-mono font-bold">+91-9637246914</span>
                      </p>
                    </div>
                    <div className="p-4 border border-stone-150 dark:border-stone-850 rounded-xl space-y-1.5">
                      <div className="h-6 w-6 bg-teal-500/10 text-teal-650 rounded-full flex items-center justify-center font-bold text-xs">2</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Provide Info</p>
                      <p className="text-[10px] text-stone-500 leading-normal font-sans">
                        Provide Order/invoice number, SKU, return reason, clear product photos (for damaged items), and registered email address.
                      </p>
                    </div>
                    <div className="p-4 border border-[#b39e7d]/30 rounded-xl bg-gradient-to-r from-amber-50/20 to-teal-50/10 dark:from-stone-900/40 dark:to-stone-950/40 space-y-1.5">
                      <div className="h-6 w-6 bg-[#b39e7d]/20 text-[#b39e7d] rounded-full flex items-center justify-center font-bold text-xs">3</div>
                      <p className="font-bold text-[11px] text-stone-900 dark:text-stone-100">Authorization</p>
                      <p className="text-[10px] text-stone-500 leading-normal font-sans">
                        Our compliance team reviews the request within <strong>24 hours</strong>. If approved, you will get a Return Authorization Number (RAN) with detailed shipping guidelines.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 5. Refund Process */}
                <section id="sec-r-5" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">05.</span> Refund Process
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    5.1 Refund Timeline
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <p className="font-bold text-[11px] text-[#9d7d4c] uppercase font-mono">1. Inspection Period</p>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1">2-3 business days</p>
                      <p className="text-[10px] text-stone-500">After receiving returned product at warehouse</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <p className="font-bold text-[11px] text-[#9d7d4c] uppercase font-mono">2. Processing</p>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1">5-7 business days</p>
                      <p className="text-[10px] text-stone-500">After internal inspection approval</p>
                    </div>
                    <div className="p-3 border border-stone-150 dark:border-stone-850 rounded-xl">
                      <p className="font-bold text-[11px] text-[#9d7d4c] uppercase font-mono">3. Bank Credit</p>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1">5-10 business days</p>
                      <p className="text-[10px] text-stone-500">Depending completely on your bank/payment gateway</p>
                    </div>
                  </div>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    5.2 Refund Methods
                  </p>
                  <p>Refunds will be reversed through the same channel used during check-out:</p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li><strong>Online Payments:</strong> Reverses back to credit/debit cards, UPI, net banking, or digital wallets.</li>
                    <li><strong>Cash on Delivery (COD):</strong> Direct bank transfer to the account details provided by you to our support department.</li>
                  </ul>
                </section>

                {/* 6. Special Circumstances */}
                <section id="sec-r-6" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">06.</span> Special Circumstances
                  </h3>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    6.1 Expired Products
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li>All products sent to users must have a minimum of <strong>6 months</strong> shelf life at delivery point.</li>
                    <li>Products expiring within 30 days of delivery are eligible for a full refund.</li>
                    <li>Expired products delivered are fully refundable.</li>
                  </ul>

                  <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 pt-1">
                    6.2 Allergic Reactions
                  </p>
                  <p>
                    If your pet experiences allergic reactions to our natural pet care products:
                  </p>
                  <ul className="list-disc pl-5 text-stone-605 dark:text-stone-400 space-y-1">
                    <li>Stop use immediately and consult a registered veterinarian.</li>
                    <li>Unopened portion of the order is eligible for return.</li>
                    <li>Please provide veterinaty documentation if available to help us investigate.</li>
                  </ul>
                </section>

                {/* 7. Contact Information */}
                <section id="sec-r-7" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-[#b39e7d]/35 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">07.</span> Contact Information
                  </h3>

                  <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2 max-w-md bg-stone-50/50 dark:bg-stone-900/20">
                    <p className="text-xs font-mono font-extrabold uppercase text-[#b39e7d]">Customer Service Team</p>
                    <p className="flex items-center gap-2 text-xs"><Mail className="h-3.5 w-3.5 text-stone-400" /> <a href="mailto:pawwcious@gmail.com" className="font-mono hover:underline text-stone-900 dark:text-stone-100 font-bold">pawwcious@gmail.com</a></p>
                    <p className="flex items-center gap-2 text-xs"><Phone className="h-3.5 w-3.5 text-stone-400" /> <span className="font-mono text-stone-700 dark:text-stone-300 font-bold">+91-7977081337 / +91-9637246914</span></p>
                    <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                      Business Hours: Monday to Saturday, 9:00 AM to 6:00 PM IST
                    </p>
                  </div>
                </section>

                {/* 8. Acceptance */}
                <section id="sec-r-8" className="scroll-mt-28 space-y-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-105 text-sm sm:text-base flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-1.5">
                    <span className="text-amber-500 font-mono text-xs sm:text-sm">08.</span> Policy Agreement & Acceptance
                  </h3>
                  <p>By placing an order with <strong>Pawwcious</strong>, you acknowledge that you have read, understood, and agree to be bound by this Refund and Return Policy. If you do not agree with any part of this policy, please do not place an order with us.</p>

                  <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-[#FAF9F5]/30 dark:bg-stone-900/20 text-xs text-stone-650 dark:text-stone-350 space-y-2 mt-4">
                    <p className="font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 text-center">
                      Refund Policy Statement
                    </p>
                    <p className="text-center">
                      This policy is effective for all transactions on our website. Future revisions posted online will be immediately in effect for subsequent transactions.
                    </p>
                  </div>
                </section>

              </div>
            </article>
          )}

          {/* FAQS & CUSTOMER SUPPORT INFO */}
          {activeTab === "faq" && (
            <article className="space-y-6 font-sans">
              <div className="border-b border-stone-100 dark:border-stone-850 pb-5 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400">
                  <HelpCircle className="h-6 w-6 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Support Portal</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                  Regularly Asked Support Questions
                </h2>
                <p className="text-[10px] font-mono text-stone-400">
                  Direct Answers • Quick Veterinary Assistance
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Is Furbreeze Cooling Powder safe for all breeds of dogs and cats?",
                    a: "Absolutely! Furbreeze is 100% talc-free, crafted with high-purity cornstarch and aromatic vetiver. It is extremely safe for daily application to soothe heat rashes, skin friction, and sweat moisture in flat-faced pugs, senior labs, Persian kittens, and double-coat huskies."
                  },
                  {
                    q: "My dog flooded their ear with water. How quickly does Squeakear Earwash work?",
                    a: "Squeakear Earwash contains an ultra-swift moisture evaporation catalyst that dries out ear canals within 30 seconds of application. Standard treatment once weekly completely locks out opportunistic yeast growth during monsoon rains."
                  },
                  {
                    q: "Where is the Pawwcious Coffee Wood masticator sourced from?",
                    a: "Our Premium Coffee Wood Chews are harvested strictly in a zero-waste, sustainable trim loop around coffee crops in the high Nilgiri Hills of Southern India. They are completely splinter-free, non-toxic, and caffeine-free."
                  },
                  {
                    q: "Are the elixirs and serums safe if my pet accidentally licks them?",
                    a: "Yes! All grooming products, including the Lavender baths and Furlush Serums, utilize strictly human-grade, food-safe organic carrier oils. However, always apply sparingly and brush deep inside to secure coat fiber maximum absorption."
                  },
                  {
                    q: "How can I trace my Delhivery shipment in real time?",
                    a: "Click on the user profile top navigation, select the 'My Orders' center, and retrieve the live tracking status updates. Live tracking displays your package's active transit milestones, sorting hubs, and AWB logistics timeline instantly."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-850 p-4 rounded-2xl text-left space-y-1">
                    <p className="font-extrabold text-stone-950 dark:text-stone-100 text-xs flex items-start gap-1.5 leading-snug">
                      <CheckCircle2 className="h-4 w-4 text-teal-800 dark:text-teal-400 shrink-0 mt-0.5" />
                      Q: {item.q}
                    </p>
                    <p className="text-stone-600 dark:text-stone-400 text-xs font-light leading-relaxed pl-5.5">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          )}

        </div>

      </div>

    </div>
  );
}
