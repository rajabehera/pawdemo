import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Mail, Phone, MapPin, Send, Sparkles, CheckCircle, Heart, MessageSquare
} from "lucide-react";
import { trackContactSubmit } from "../analytics";

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  petName: string;
  petType: string;
  subject: string;
  message: string;
}

export function ContactPage() {
  const [formData, setFormData] = useState<ContactFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    petName: "",
    petType: "dog",
    subject: "general",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});

  const validate = (): boolean => {
    const tempErrors: Partial<Record<keyof ContactFormState, string>> = {};
    if (!formData.firstName.trim()) tempErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) tempErrors.lastName = "Surname/Last name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) tempErrors.message = "Please write your message";
    if (formData.phone.trim() && formData.phone.replace(/\D/g, "").length !== 10) {
      tempErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

       try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send enquiry.");

      setIsSubmitting(false);
      setIsSubmitted(true);
      trackContactSubmit(formData.subject, `${formData.firstName} ${formData.lastName}`);
      (window as any).showToast?.("Enquiry Carriage sent! We will reach out within 2 hours. 🐾", "success");
    } catch (err: any) {
      setIsSubmitting(false);
      (window as any).showToast?.(err.message || "Failed to send enquiry. Please try again.", "error");
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      petName: "",
      petType: "dog",
      subject: "general",
      message: ""
    });
    setIsSubmitted(false);
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto pb-8 sm:pb-12 space-y-12">
      {/* Brand Elegant Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-stone-900 border border-teal-100 dark:border-teal-900/40 text-teal-850 dark:text-teal-400">
          <Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider font-semibold uppercase">Enquiry Atelier</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif italic text-stone-955 dark:text-stone-100 tracking-wide leading-tight mt-1">
          Let’s Connect & Converse
        </h1>
        <div className="h-[1px] w-12 bg-amber-500/40 mx-auto my-3" />
        <p className="text-xs sm:text-sm text-stone-550 dark:text-stone-405 leading-relaxed max-w-lg mx-auto">
          Don’t make us pout… let’s chat! At Pawwcious, your pet’s health and happiness come first. Our dedicated care team is here to guide you and answer any questions.
        </p>
      </div>



      {/* Premium Editorial Hero banner */}
      <div className="relative group overflow-hidden rounded-3xl border border-stone-200/80 shadow-md">
        <img
          src="/images/pawwcious_contact.png"
          alt="Pawwcious Luxury Pet Wellness Lifestyle"
          referrerPolicy="no-referrer"
          className="w-full aspect-[16/7] md:aspect-[21/9] object-cover  hover:scale-[1.05] transition-transform duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/45 to-transparent p-4 sm:p-6 flex items-end justify-between text-white">
          <span className="text-[9px] sm:text-xs font-mono tracking-widest uppercase opacity-90 drop-shadow-sm">The Pawwcious Connect</span>
          <span className="text-[8px] sm:text-[10px] font-mono text-stone-200 border border-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">Nature’s Secret Call</span>
        </div>
      </div>

      {/* Main Grid: Information & Luxury Contact Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Premium Infocards & Social Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-stone-50/70 rounded-2xl border border-stone-200/60 p-6 sm:p-7 space-y-6 relative overflow-hidden">
            {/* Soft backdrop element for aesthetic luxury appeal */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-44 w-44 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-teal-700 uppercase font-bold">LIAISON CONCIERGE</span>
              <h2 className="text-lg font-bold text-stone-900">Direct Touchpoints</h2>
              <p className="text-xs text-stone-500">Reach the specialists at our luxury canine and feline apothecary.</p>
            </div>

            <div className="space-y-5">
              {/* Phone Channel */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-lg bg-white border border-stone-150 inline-flex shadow-sm text-teal-700">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono uppercase text-stone-400 font-semibold tracking-wider">Call or WhatsApp</p>
                  <a href="https://wa.me/918019902546" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-stone-850 hover:text-teal-700 transition-colors block">
                    +91 91234 56789
                  </a>
                  <p className="text-[10px] text-stone-500">Instant assistance & grooming advice</p>
                </div>
              </div>

              {/* Email Channel */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-lg bg-white border border-stone-150 inline-flex shadow-sm text-teal-700">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono uppercase text-stone-400 font-semibold tracking-wider">Electronic Post</p>
                  <a href="mailto:pawwcious@gmail.com" className="text-xs font-bold text-stone-850 hover:text-teal-700 transition-colors block">
                    pawwcious@gmail.com
                  </a>
                  <p className="text-[10px] text-stone-500">Custom formula recipes & general inquiries</p>
                </div>
              </div>

              {/* HQ Address */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-lg bg-white border border-stone-150 inline-flex shadow-sm text-teal-700">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono uppercase text-stone-400 font-semibold tracking-wider">HQ Atelier</p>
                  <p className="text-xs font-bold text-stone-850">
                    Customs Colony, Marol Military Road, Andheri (E), 400059
                  </p>
                  <p className="text-[10px] text-stone-500">Visiting is available by pre-booked appointments</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center gap-2 bg-white/75 p-3 rounded-xl border border-stone-100">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-teal-100 flex items-center justify-center text-[10px]">🐕</span>
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-100 flex items-center justify-center text-[10px]">🐈</span>
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-emerald-100 flex items-center justify-center text-[10px]">❤️</span>
                </div>
                <p className="text-[10px] text-stone-550 font-medium">
                  We reply within <span className="font-bold text-teal-700">1-2 hours</span> during apothecary hours. Talk to us!
                </p>
              </div>
            </div>
          </div>

          {/* Guarantee Badge card */}
          <div className="bg-teal-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Heart className="h-24 w-24 fill-white text-white" />
            </div>
            <div className="relative space-y-2.5 z-10">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
                <span className="text-[9px] font-mono tracking-widest text-teal-200 uppercase font-bold">PAWWCIOUS ASSURANCE</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-amber-100">Ayurvedic, Vet-Approved & Non-Toxic</h3>
              <p className="text-xs text-teal-100/95 leading-relaxed">
                Every Pawwcious formulation is ph-balanced, meticulously 100% organic, skin-safe (pH 7+), and developed with gentle ancient wisdom to safeguard your dog or cat’s protective epidermal layer.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Contact Form */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm relative">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-5"
              >
                <div className="inline-flex p-3 rounded-full bg-teal-50 border border-teal-150 text-teal-700 animate-bounce">
                  <CheckCircle className="h-10 w-10 text-teal-600" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-xl font-bold text-stone-900 font-sans">Enquiry Transmitted Beautifully!</h2>
                  <p className="text-xs text-stone-550 leading-relaxed font-sans">
                    Bow-wow, thank you for writing to us! Our human concierge has received your details and is fetching an expert apothecary answer. Rest assured, your pet's wellness is our priority.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-xl p-4 max-w-xs mx-auto text-left border border-stone-150 space-y-1.5 text-xs font-mono">
                  <p className="text-stone-400 uppercase text-[9px] tracking-wider font-bold">Transaction Blueprint</p>
                  <p className="text-stone-700"><span className="text-stone-400">Recipient:</span> {formData.firstName} {formData.lastName}</p>
                  <p className="text-stone-700"><span className="text-stone-400">Companion:</span> {formData.petName || "None specified"} ({formData.petType})</p>
                  <p className="text-stone-700"><span className="text-stone-400">Inquiry category:</span> <span className="capitalize">{formData.subject}</span></p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-150 uppercase tracking-wider"
                >
                  Write Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 font-sans">Enquiry Carriage</h2>
                  <p className="text-[11px] text-stone-400">Let's craft the perfect skin & coat journey or answer your delivery questions.</p>
                </div>

                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${errors.firstName ? "border-rose-400 focus:ring-rose-200" : "border-stone-200 focus:ring-teal-100 focus:border-teal-700"} focus:ring focus:outline-none bg-stone-50/50 hover:bg-stone-50/20 transition-all`}
                      placeholder="e.g. Rohini"
                    />
                    {errors.firstName && <p className="text-[10px] text-rose-500 font-mono">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Surname / Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${errors.lastName ? "border-rose-400 focus:ring-rose-200" : "border-stone-200 focus:ring-teal-100 focus:border-teal-700"} focus:ring focus:outline-none bg-stone-50/50 hover:bg-stone-50/20 transition-all`}
                      placeholder="e.g. Joshi"
                    />
                    {errors.lastName && <p className="text-[10px] text-rose-500 font-mono">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${errors.email ? "border-rose-400 focus:ring-rose-200" : "border-stone-200 focus:ring-teal-100 focus:border-teal-700"} focus:ring focus:outline-none bg-stone-50/50 hover:bg-stone-50/20 transition-all`}
                      placeholder="e.g. rohini@example.com"
                    />
                    {errors.email && <p className="text-[10px] text-rose-500 font-mono">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Phone / WhatsApp (10 digits only)</label>
                    <input
                      type="tel"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData({ ...formData, phone: val });
                      }}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring focus:ring-teal-100 focus:border-teal-700 focus:outline-none bg-stone-50/50 hover:bg-stone-50/20 transition-all font-mono"
                      placeholder="e.g. 9876543210"
                    />
                    {errors.phone && <p className="text-[10px] text-rose-500 font-mono">{errors.phone}</p>}
                  </div>
                </div>

                {/* Pet Specific Premium Touches */}
                <div className="bg-stone-50/80 rounded-xl p-3.5 border border-stone-150 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-stone-400 font-mono font-bold uppercase tracking-widest">Pet's Name</label>
                    <input
                      type="text"
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-teal-600 transition-all"
                      placeholder="e.g. Bruno (Optional)"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-stone-400 font-mono font-bold uppercase tracking-widest">Pet Companion Type</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {["dog", "cat", "other"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, petType: type })}
                          className={`py-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${formData.petType === type ? "bg-teal-700 text-white border-teal-700 ring-2 ring-teal-100" : "bg-white text-stone-500 border-stone-250 hover:bg-stone-50"}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Inquiry Category / Subject */}
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Inquiry Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring focus:ring-teal-100 focus:border-teal-700 focus:outline-none bg-stone-50/50 transition-all cursor-pointer font-sans"
                  >
                    <option value="general">General Care & Chat</option>
                    <option value="skin-advice">Ayurvedic Coat & Skin Advice</option>
                    <option value="order-support">Order Support & Logistics</option>
                    <option value="wholesale">Wholesale & Veterinary Partners</option>
                    <option value="feedback">Feedback & Ingredient Enquiries</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Your Message *</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${errors.message ? "border-rose-400 focus:ring-rose-200" : "border-stone-200 focus:ring-teal-100 focus:border-teal-700"} focus:ring focus:outline-none bg-stone-50/50 hover:bg-stone-50/20 transition-all`}
                    placeholder="Tell us everything about your pet, your skin care goals, or details of your inquiry..."
                  />
                  {errors.message && <p className="text-[10px] text-rose-500 font-mono">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-teal-800 hover:bg-teal-900 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-teal-100 ${isSubmitting ? "opacity-75 cursor-not-allowed" : "cursor-pointer active:scale-[0.99]"}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 text-teal-200" />
                      <span>Send Carriage Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
