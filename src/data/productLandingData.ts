// High-resolution local image imports for product landing data
import furlushImg from "../assets/images/furlush_serum_1779770803790.png";
import earwashImg from "../assets/images/squeakier_earwash_1779770834593.png";
import powderImg from "../assets/images/furbreeze_powder_1779770786484.png";
import chewImg from "../assets/images/coffeewood_chew_1779770818895.png";
import founderPhoto from "../assets/images/pawwcious_about_hero_1779615456507.png";
import lifestylePhoto from "../assets/images/pawwcious_heritage_wellness_1779615476075.png";

export interface CoffeeWoodCustomData {
  everydayMoment: {
    eyebrow: string;
    title: string;
    copy: string;
  };
  fitSection: {
    id: string;
    eyebrow: string;
    title: string;
    cards: {
      tag: string;
      title: string;
      desc: string;
    }[];
  };
  decisionGuide: {
    eyebrow: string;
    title: string;
    rows: {
      concern: string;
      response: string;
    }[];
    ctaText: string;
  };
  endOffer: {
    title: string;
    copy: string;
    ctaText: string;
  };
}

export interface VideoReelData {
  videoSrc: string;
  poster?: string;
  title: string;
  subtitle: string;
  gradient: string;
  textColor: string;
  buttonColor: string;
}

export interface ProductLandingData {
  eyebrow: string;
  heroHeadline: string;
  heroIntro: string;
  displayedSize: string;
  heroImg: string;
  lifestyleImg: string;
  founderImg: string;
  lifestyleBadge: string;
  ingredientPills: { line1: string; line2: string }[];
  roadmapTitle: string;
  roadmapSteps: { step: string; title: string; desc: string }[];
  reviewQuote: string;
  reviewerName: string;
  reviewerSource: string;
  benefits: string[];
  bundles: { pack: number; label: string; sizeText: string; savingsText?: string }[];
  comparisons: { frustration: string; approach: string }[];
  formulaItems: { icon: string; title: string; desc: string }[];
  closingLine: string;
  usageSteps: string[];
  specifications: { label: string; value: string }[];
  customerReviews: {
    name: string;
    headline: string;
    quote: string;
    link: string;
    verifiedText: string;
  }[];
  videoReels: VideoReelData[];
  faqs: { q: string; a: string }[];
  // Custom dedicated sections for specific products
  coffeeWoodCustom?: CoffeeWoodCustomData;
}

export function getProductLandingData(pSlug: string): ProductLandingData {
  // 1. SQUEAKEAR EARWASH
  if (pSlug === "squeakear-earwash") {
    return {
      eyebrow: "Ayurvedic Ear Wellness",
      heroHeadline: "Head shaking or smelly ears? Try gentle Ayurvedic ear cleansing.",
      heroIntro: "Made with soothing neem, tulsi, and tea tree extracts to dissolve stubborn wax, calm redness, and eliminate odor safely.",
      displayedSize: "100 ml",
      heroImg: earwashImg,
      lifestyleImg: lifestylePhoto,
      founderImg: founderPhoto,
      lifestyleBadge: "Clean, fresh ears you love to cuddle",
      ingredientPills: [
        { line1: "Neem +", line2: "tulsi" },
        { line1: "Tea tree", line2: "extract" },
        { line1: "Aloe", line2: "hydrosol" },
      ],
      roadmapTitle: "Your ear-cleansing routine",
      roadmapSteps: [
        { step: "01", title: "Check ear", desc: "Notice wax buildup, redness or odor." },
        { step: "02", title: "Apply & massage", desc: "Gently dispense into ear canal and massage base." },
        { step: "30", title: "Clean canal", desc: "Enjoy calm, comfortable, odor-free ears." },
      ],
      reviewQuote: "“Cleared my cocker spaniel’s chronic ear odor in just 3 days without any stinging!”",
      reviewerName: "Pooja Malhotra",
      reviewerSource: "Verified Pawwcious Buyer",
      benefits: [
        "Gentle Ayurvedic formula dissolves dense ear wax without burning",
        "Alcohol-free and steroid-free for everyday ear canal hygiene",
        "Calms itching, head-shaking and yeast odors rapidly",
        "Precision soft dropper nozzle ensures stress-free application",
      ],
      bundles: [
        { pack: 1, label: "Pack of 1", sizeText: "100 ml", savingsText: "Standard bottle" },
        { pack: 2, label: "Pack of 2", sizeText: "2 × 100 ml", savingsText: "SAVE ₹78" },
        { pack: 3, label: "Pack of 3", sizeText: "3 × 100 ml", savingsText: "SAVE ₹198" },
      ],
      comparisons: [
        { frustration: "Harsh chemical burn makes pets panic", approach: "Soothing sting-free botanical herbs" },
        { frustration: "Alcohol strips & dries ear canal", approach: "Hydrating aloe and tulsi extracts" },
        { frustration: "Odor & wax return within days", approach: "Balances natural ear flora long term" },
        { frustration: "Messy hard-plastic applicator", approach: "Soft flexible nozzle designed for pets" },
      ],
      formulaItems: [
        { icon: "🌿", title: "Organic Tulsi & Neem", desc: "Natural antimicrobial barrier that halts yeast and bacterial overgrowth." },
        { icon: "💧", title: "Aloe Vera & Witch Hazel", desc: "Dissolves wax deposits and cools irritated inner ear skin." },
        { icon: "🍃", title: "Micro-dose Tea Tree", desc: "Natural deodorizer formulated at veterinary safe dilution." },
      ],
      closingLine: "Gentle ear care for happy ears and calm pets.",
      usageSteps: [
        "Gently lift your pet's ear flap and inspect the ear canal.",
        "Instill 4–6 drops of Squeakear Earwash directly into the ear canal.",
        "Gently massage the base of the ear for 30 seconds to dissolve wax.",
        "Allow your pet to shake their head, then wipe away loosened wax with cotton.",
      ],
      specifications: [
        { label: "Product name", value: "Pawwcious Squeakear Earwash" },
        { label: "Product type", value: "Natural Pet Ear Cleanser" },
        { label: "Category", value: "Ear Hygiene & Wax Dissolver" },
        { label: "Pet type", value: "Dogs and cats of all breeds" },
        { label: "Key ingredients", value: "Tulsi, Neem, Aloe Vera, Witch Hazel, Tea Tree" },
        { label: "Formula note", value: "Alcohol-free, steroid-free, pH 6.8 balanced" },
        { label: "Size", value: "100 ml" },
        { label: "Origin", value: "Formulated & crafted in India" },
      ],
      customerReviews: [
        {
          name: "Ananya Deshmukh",
          headline: "No more head shaking",
          quote: "My Labrador was constantly shaking his head due to wax build-up. Squeakear cleaned it up in 2 uses!",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
        {
          name: "Sunil Verma",
          headline: "Sting-free & calm",
          quote: "Normally ear cleaners make him run away. This is cooling and non-stinging, he sits calmly.",
          link: "https://pawwcious.com",
          verifiedText: "Amazon Customer Review",
        },
        {
          name: "Dr. K. Nair",
          headline: "Gentle daily maintenance",
          quote: "Ideal pH balance for tropical breeds prone to ear infections. A regular clinic recommendation.",
          link: "https://pawwcious.com",
          verifiedText: "Consulting Canine Vet",
        },
      ],
      videoReels: [
        {
          videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          title: "Ear Wash Routine",
          subtitle: "Cocker Spaniel Ear Care",
          gradient: "from-[#d9e7d4] to-[#8cad8d]",
          textColor: "text-[#2b513c]",
          buttonColor: "text-[#245437]",
        },
        {
          videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          title: "Clean Ears, Calm Pet",
          subtitle: "Gentle Drops Application",
          gradient: "from-[#e8e4d2] to-[#b3a88c]",
          textColor: "text-[#413824]",
          buttonColor: "text-[#3b321c]",
        },
      ],
      faqs: [
        { q: "Is Squeakear safe for cats?", a: "Yes, Squeakear uses veterinary-calibrated low-concentration botanical extracts safe for both dogs and cats." },
        { q: "How frequently can I use this?", a: "For active ear cleaning, use 2–3 times a week. For routine maintenance, once every 7–10 days is ideal." },
        { q: "Can I use cotton swabs inside the ear?", a: "Never insert cotton swabs into the ear canal. Always use a soft cotton pad to wipe the outer ear only." },
      ],
    };
  }

  // 2. FURBREEZE HEAT COOLING POWDER
  if (pSlug === "furbreeze-heat-cooling-powder") {
    return {
      eyebrow: "Ayurvedic Prickly Heat Care",
      heroHeadline: "Hot spots, sweat & prickly heat? Instant cooling relief.",
      heroIntro: "100% talc-free, all-natural cooling powder with vetiver, camphor & arrowroot to absorb dampness, relieve itching, and ward off ticks.",
      displayedSize: "150 g",
      heroImg: powderImg,
      lifestyleImg: lifestylePhoto,
      founderImg: founderPhoto,
      lifestyleBadge: "Cool, fresh comfort all summer long",
      ingredientPills: [
        { line1: "Vetiver +", line2: "khus" },
        { line1: "Arrowroot", line2: "base" },
        { line1: "Camphor +", line2: "neem" },
      ],
      roadmapTitle: "Your summer cooling routine",
      roadmapSteps: [
        { step: "01", title: "Dust coat", desc: "Sprinkle lightly on belly, armpits and paw pads." },
        { step: "02", title: "Rub gently", desc: "Work into fur down to the skin to absorb sweat." },
        { step: "30", title: "Rash-free", desc: "Keep skin clear of fungal heat rash and ticks." },
      ],
      reviewQuote: "“Finally a 100% talc-free powder! My Pug gets severe summer rashes, this cools him down instantly.”",
      reviewerName: "Meera Subramanian",
      reviewerSource: "Verified Pawwcious Buyer",
      benefits: [
        "100% Talc-free, completely non-toxic if licked by your dog or cat",
        "Vetiver (Khus) and Pudina Satva deliver immediate thermal skin cooling",
        "Absorbs heavy dampness in armpits, groin folds and underbelly",
        "Infused with Neem and Camphor to naturally repel ticks, fleas and mites",
      ],
      bundles: [
        { pack: 1, label: "Pack of 1", sizeText: "150 g", savingsText: "Standard bottle" },
        { pack: 2, label: "Pack of 2", sizeText: "2 × 150 g", savingsText: "SAVE ₹99" },
        { pack: 3, label: "Pack of 3", sizeText: "3 × 150 g", savingsText: "SAVE ₹198" },
      ],
      comparisons: [
        { frustration: "Talc-based powders risk respiratory harm", approach: "100% Edible arrowroot & cornstarch" },
        { frustration: "Artificial perfumes irritate sensitive noses", approach: "Earthy natural vetiver & herbal fragrance" },
        { frustration: "Cakes up into damp sticky paste", approach: "Ultra-fine silky powder that brushes clean" },
        { frustration: "Zero insect protection", approach: "Active neem & camphor tick repellent" },
      ],
      formulaItems: [
        { icon: "🌾", title: "Edible Arrowroot Base", desc: "Silky moisture absorber that stays breathable on the epidermis." },
        { icon: "❄️", title: "Vetiver (Khus) & Pudina", desc: "Thermal-cooling Ayurvedic herbs that draw heat away from the skin." },
        { icon: "🛡️", title: "Purified Camphor & Neem", desc: "Botanical defense against damp skin infections and parasites." },
      ],
      closingLine: "Natural heat defense for tropical summers.",
      usageSteps: [
        "Turn the dispenser cap to open the sift holes.",
        "Dust powder lightly over your pet's stomach, groin, underarms, and neck folds.",
        "Gently brush or rub with hands against the hair direction.",
        "Use daily before and after outdoor walks during warm or humid days.",
      ],
      specifications: [
        { label: "Product name", value: "Pawwcious Furbreeze Heat Cooling Powder" },
        { label: "Product type", value: "Ayurvedic Prickly Heat Pet Powder" },
        { label: "Category", value: "Skin Cooling & Moisture Absorption" },
        { label: "Pet type", value: "Dogs and cats of all ages" },
        { label: "Key ingredients", value: "Arrowroot, Vetiver (Khus), Pudina Satva, Neem, Camphor" },
        { label: "Formula note", value: "100% Talc-free, asbestos-free, lick-safe" },
        { label: "Size", value: "150 g" },
        { label: "Origin", value: "Formulated & crafted in India" },
      ],
      customerReviews: [
        {
          name: "Rohit Saxena",
          headline: "Lifesaver in Delhi summer",
          quote: "My Golden was constantly panting and developing red heat spots. Furbreeze calmed it immediately.",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
        {
          name: "Kavita R.",
          headline: "Safe when licked",
          quote: "So relieved it has zero talc. She licks her paws often, and this has no toxic chemicals.",
          link: "https://pawwcious.com",
          verifiedText: "Amazon Reviewer",
        },
        {
          name: "Tanvi Bose",
          headline: "Fresh earthy aroma",
          quote: "Smells like pure vetiver, not synthetic perfumed talc. Kept her coat dry through monsoon.",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
      ],
      videoReels: [
        {
          videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          title: "Dusting Summer Folds",
          subtitle: "Pug Prickly Heat Relief",
          gradient: "from-[#d9e7d4] to-[#8cad8d]",
          textColor: "text-[#2b513c]",
          buttonColor: "text-[#245437]",
        },
        {
          videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          title: "Post-Walk Dusting",
          subtitle: "Tick Defense Routine",
          gradient: "from-[#e8e4d2] to-[#b3a88c]",
          textColor: "text-[#413824]",
          buttonColor: "text-[#3b321c]",
        },
      ],
      faqs: [
        { q: "Is it safe if my pet licks it?", a: "Yes, Furbreeze is 100% talc-free and formulated with food-grade arrowroot and herbal extracts that are lick-safe." },
        { q: "Can I use it on wet fur?", a: "Always apply on dry fur for maximum sweat absorption and smooth dusting." },
        { q: "Does it replace flea & tick collars?", a: "Furbreeze naturally discourages parasites with neem and camphor; for severe infestations, use in conjunction with your vet’s anti-parasitic program." },
      ],
    };
  }

  // 3. COFFEE WOOD CHEW (WITH USER'S CUSTOM DEDICATED SECTIONS)
  if (pSlug === "coffee-wood-chew") {
    return {
      eyebrow: "100% Natural Dental Chews",
      heroHeadline: "Always reaching for the wrong thing? Satisfy chew instincts naturally.",
      heroIntro: "Sustainably harvested from pruned coffee trees. Dense, splinter-free fibers that flake into soft digestible cellulose to clean teeth and calm anxiety.",
      displayedSize: "Small, Medium, Large",
      heroImg: chewImg,
      lifestyleImg: lifestylePhoto,
      founderImg: founderPhoto,
      lifestyleBadge: "Calm chewing joy that saves your furniture",
      ingredientPills: [
        { line1: "100% Coffee", line2: "wood" },
        { line1: "Zero", line2: "calories" },
        { line1: "Non-", line2: "splintering" },
      ],
      roadmapTitle: "Your dental chew journey",
      roadmapSteps: [
        { step: "01", title: "Introduce chew", desc: "Hand to your dog during rest or post-meal time." },
        { step: "02", title: "Soft flaking", desc: "Fibers flake into soft, digestible cellulose threads." },
        { step: "30", title: "Clean teeth", desc: "Notice cleaner teeth, fresher breath and reduced anxiety." },
      ],
      reviewQuote: "“My Beagle is an aggressive chewer who destroyed 3 wooden chairs. This chew has lasted 3 months!”",
      reviewerName: "Vikram Sengupta",
      reviewerSource: "Verified Pawwcious Buyer",
      benefits: [
        "Zero calories, caffeine-free, and 100% natural sustainably harvested wood",
        "Does not splinter into sharp shards like normal sticks or bones",
        "Flakes into soft digestible fibers that floss between teeth to scrape tartar",
        "Releases calming endorphins and saves your footwear and furniture",
      ],
      bundles: [
        { pack: 1, label: "Small Size", sizeText: "For dogs up to 10 kg", savingsText: "Puppies & small breeds" },
        { pack: 2, label: "Medium Size", sizeText: "For dogs 10 – 25 kg", savingsText: "Popular size" },
        { pack: 3, label: "Large Size", sizeText: "For dogs over 25 kg", savingsText: "Strong chewers" },
      ],
      comparisons: [
        { frustration: "Rawhide contains chemicals & chokes pets", approach: "100% Natural plant wood with zero chemicals" },
        { frustration: "Plastic nylon chews ingest microplastics", approach: "Safe, natural cellulose that digests easily" },
        { frustration: "Ordinary garden sticks splinter sharply", approach: "Dense grain flakes into soft gentle threads" },
        { frustration: "High calorie treats cause obesity", approach: "Zero calorie, gluten-free, guilt-free chew" },
      ],
      formulaItems: [
        { icon: "🌳", title: "100% Robusta Coffee Wood", desc: "Dense hardwood harvested only from pruned branches of aged coffee trees." },
        { icon: "🦷", title: "Natural Dental Floss Effect", desc: "Fibers bend and separate to gently scrape away plaque without gum abrasion." },
        { icon: "☕", title: "Naturally Caffeine-Free", desc: "Wood contains zero caffeine, zero sugar, and zero artificial preservatives." },
      ],
      closingLine: "Natural enrichment that channels natural chewing instinct.",
      usageSteps: [
        "Select the correct size based on your dog's weight (Small: <10kg, Medium: 10-25kg, Large: >25kg).",
        "Supervise your pet during chewing sessions.",
        "When chewed down to a small swallowable nub, replace with a fresh stick.",
        "Store in a dry, ventilated area between chewing sessions.",
      ],
      specifications: [
        { label: "Product name", value: "Pawwcious Coffee Wood Chew" },
        { label: "Product type", value: "Natural Wood Dental Dog Chew" },
        { label: "Category", value: "Dental Hygiene & Boredom Relief" },
        { label: "Pet type", value: "Dogs of all breeds & ages" },
        { label: "Key ingredients", value: "100% Natural Pruned Robusta Coffee Wood" },
        { label: "Formula note", value: "Caffeine-free, calorie-free, non-splintering" },
        { label: "Displayed sizes", value: "Small (<10kg), Medium (10-25kg), Large (>25kg)" },
        { label: "Origin", value: "Coorg & Western Ghats, India" },
      ],
      customerReviews: [
        {
          name: "Deepak S.",
          headline: "Saved my wooden dining table",
          quote: "My Indie pup was chewing every piece of wood in the apartment. This stick diverted his energy completely.",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
        {
          name: "Radhika K.",
          headline: "Soft fibers, no sharp shards",
          quote: "Unlike tree branches that shatter dangerously, this just turns into soft powdery fluff that is easy to vacuum.",
          link: "https://pawwcious.com",
          verifiedText: "Amazon Reviewer",
        },
        {
          name: "Gaurav Mehta",
          headline: "Great for teeth",
          quote: "His vet commented on how clean his back molars looked after a month of coffee wood chewing.",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
      ],
      videoReels: [
        {
          videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          title: "Aggressive Chewer Test",
          subtitle: "Indie Pup Chew Session",
          gradient: "from-[#e8e4d2] to-[#b3a88c]",
          textColor: "text-[#413824]",
          buttonColor: "text-[#3b321c]",
        },
        {
          videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          title: "Soft Fiber Flaking",
          subtitle: "Dental Flossing Action",
          gradient: "from-[#d9e7d4] to-[#8cad8d]",
          textColor: "text-[#2b513c]",
          buttonColor: "text-[#245437]",
        },
      ],
      faqs: [
        { q: "Does coffee wood have caffeine?", a: "No. The coffee beans contain caffeine, but the dense wood fiber is completely free of caffeine." },
        { q: "Is it safe if swallowed?", a: "The wood separates into tiny, soft cellulose flakes that pass safely through the canine digestive tract." },
        { q: "How long does one chew last?", a: "Depending on your dog’s chewing vigor, one coffee wood stick typically lasts 1 to 3 months." },
      ],
      // ═══════════════════════════════════════════════════════════════════════
      // USER'S CUSTOM DEDICATED SECTIONS FOR COFFEE WOOD ONLY
      // ═══════════════════════════════════════════════════════════════════════
      coffeeWoodCustom: {
        everydayMoment: {
          eyebrow: "The everyday moment",
          title: "Always reaching for the wrong thing?",
          copy: "Chewing is normal for dogs. When yours reaches for a shoe, chair leg or outdoor stick, redirect them to an option intended for their chew routine and stay nearby while they use it.",
        },
        fitSection: {
          id: "fit",
          eyebrow: "Choose with clarity",
          title: "See the chew. Choose the fit.",
          cards: [
            {
              tag: "01 · Material",
              title: "What it is",
              desc: "Coffee wood dog chew. Show the actual product and confirmed material details.",
            },
            {
              tag: "02 · Size",
              title: "Find the right size",
              desc: "Display measured dimensions and approved guidance for dog size and chewing style.",
            },
            {
              tag: "03 · Wear",
              title: "Know when to replace",
              desc: "Use real close-up wear photos and the final label directions.",
            },
          ],
        },
        decisionGuide: {
          eyebrow: "Decision guide",
          title: "What to consider when choosing a chew",
          rows: [
            {
              concern: "What am I buying?",
              response: "Coffee wood with actual product photos and dimensions",
            },
            {
              concern: "Will it suit my dog?",
              response: "Check the approved size guide and chewing style",
            },
            {
              concern: "Can I leave my dog alone with it?",
              response: "Stay nearby during every chew session",
            },
            {
              concern: "What if it wears down?",
              response: "Inspect and replace according to the label",
            },
          ],
          ctaText: "CHOOSE A CHEW FOR MY DOG",
        },
        endOffer: {
          title: "Ready to find their chew?",
          copy: "Choose a suitable size and keep every session supervised.",
          ctaText: "BACK TO SIZE SELECTION",
        },
      },
    };
  }

  // 4. COMPLETE GROOMING PACK
  if (pSlug === "complete-grooming-pack") {
    return {
      eyebrow: "Ultimate 3-in-1 Ayurvedic Kit",
      heroHeadline: "Complete pet grooming made simple, pure & stress-free.",
      heroIntro: "Includes all 3 full-sized Pawwcious essentials: Furbreeze Powder (150 g), Squeakear Earwash (100 ml), and Furlush Serum (100 ml) for complete head-to-tail wellness.",
      displayedSize: "Contents & individual sizes clearly stated below",
      heroImg: furlushImg,
      lifestyleImg: lifestylePhoto,
      founderImg: founderPhoto,
      lifestyleBadge: "Head-to-tail holistic Ayurvedic routine",
      ingredientPills: [
        { line1: "Furbreeze", line2: "150 g" },
        { line1: "Squeakear", line2: "100 ml" },
        { line1: "Furlush", line2: "100 ml" },
      ],
      roadmapTitle: "Your complete weekly grooming ritual",
      roadmapSteps: [
        { step: "01", title: "Clean ears", desc: "Use Squeakear Earwash (100 ml) to dissolve wax and eliminate yeast." },
        { step: "02", title: "Dust & cool", desc: "Dust Furbreeze Powder (150 g) to absorb sweat, dampness & prickly heat." },
        { step: "30", title: "Nourish coat", desc: "Mist Furlush Serum (100 ml) and brush for mirror shine & anti-tangle." },
      ],
      reviewQuote: "“This complete 3-in-1 kit replaced 7 different salon visits! My pets smell fresh, clean, and happy.”",
      reviewerName: "Nandini & Arjun Rao",
      reviewerSource: "Verified Pawwcious Buyer",
      benefits: [
        "Complete 3-in-1 pack with clearly stated individual sizes: 150 g + 100 ml + 100 ml",
        "Comprehensive care: Coat conditioning, ear wax removal, and prickly heat defense",
        "100% Ayurvedic, non-toxic, chemical-free and lick-safe formulas",
        "Instant bundle savings of ₹148 vs buying items individually",
      ],
      bundles: [
        { pack: 1, label: "Complete 3-in-1 Kit", sizeText: "150 g + 100 ml + 100 ml", savingsText: "SAVE ₹148 INSTANTLY" },
        { pack: 2, label: "Twin Pack (2 Kits)", sizeText: "2 × Complete Kits", savingsText: "SAVE ₹398 (BEST VALUE)" },
      ],
      comparisons: [
        { frustration: "Buying separate products from random brands", approach: "Synchronized Ayurvedic head-to-tail routine" },
        { frustration: "Unclear ingredients and mismatched chemicals", approach: "100% Transparent botanical ingredients" },
        { frustration: "Heavy expensive salon bills", approach: "Easy 5-minute home grooming ritual" },
        { frustration: "Synthetic perfumes and artificial dyes", approach: "Pure herbal extracts with zero toxins" },
      ],
      formulaItems: [
        { icon: "🌸", title: "Furlush Serum (100 ml)", desc: "Moroccan Argan, Jojoba & Aloe leave-in coat serum for silkiness and detangling." },
        { icon: "👂", title: "Squeakear Earwash (100 ml)", desc: "Neem, Tulsi & Tea tree non-stinging ear hygiene wash to eliminate wax and odor." },
        { icon: "❄️", title: "Furbreeze Powder (150 g)", desc: "100% Talc-free Vetiver & Camphor cooling powder to prevent heat rashes and ticks." },
      ],
      closingLine: "Everything your pet needs for daily clinical grooming.",
      usageSteps: [
        "Step 1 (Ears): Apply 4-6 drops of Squeakear (100 ml) into ear canal, massage base, and wipe clean.",
        "Step 2 (Skin): Dust Furbreeze Powder (150 g) on belly and armpits to absorb humidity and sweat.",
        "Step 3 (Coat): Mist Furlush Serum (100 ml) evenly across fur and brush gently for silky gloss.",
      ],
      specifications: [
        { label: "Product name", value: "Pawwcious Complete Grooming Pack" },
        { label: "Pack contents", value: "Furbreeze Powder (150 g) + Squeakear Earwash (100 ml) + Furlush Serum (100 ml)" },
        { label: "Total net quantity", value: "350 g / ml combined" },
        { label: "Category", value: "Complete Head-to-Tail Ayurvedic Grooming" },
        { label: "Pet type", value: "Dogs and cats of all breeds" },
        { label: "Key ingredients", value: "Argan Oil, Jojoba, Aloe Vera, Tulsi, Neem, Vetiver, Camphor" },
        { label: "Safety standard", value: "100% Ayurvedic, Talc-free, Silicone-free, Paraben-free" },
        { label: "Origin", value: "Formulated & crafted in India" },
      ],
      customerReviews: [
        {
          name: "Sandesh Kubsad",
          headline: "Golden Retriever experience",
          quote: "This combo is a boon for my furry Golden Retriever. Lovely fragrance and smooth hairs.",
          link: "https://www.amazon.in/portal/customer-reviews/srp/-/R33CXV0SUENCGV",
          verifiedText: "Amazon Reviewer",
        },
        {
          name: "Priyanka N.",
          headline: "All 3 products are fantastic",
          quote: "The powder kept her rash free, the ear drops stopped her head scratching, and the serum made her coat mirror shiny!",
          link: "https://pawwcious.com",
          verifiedText: "Verified Pawwcious Buyer",
        },
        {
          name: "Dr. A. Sen",
          headline: "Holistic preventive care",
          quote: "Grooming isn't cosmetic; it is preventive healthcare. Having all three in one kit makes compliance easy for pet parents.",
          link: "https://pawwcious.com",
          verifiedText: "Veterinary Dermatologist",
        },
      ],
      videoReels: [
        {
          videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          title: "Complete 3-in-1 Routine",
          subtitle: "Head-to-tail Grooming Ritual",
          gradient: "from-[#d9e7d4] to-[#8cad8d]",
          textColor: "text-[#2b513c]",
          buttonColor: "text-[#245437]",
        },
        {
          videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          title: "Coat + Ear + Powder Care",
          subtitle: "Fast 5-Min Home Grooming",
          gradient: "from-[#e8e4d2] to-[#b3a88c]",
          textColor: "text-[#413824]",
          buttonColor: "text-[#3b321c]",
        },
      ],
      faqs: [
        { q: "What is inside the Complete Grooming Pack?", a: "You receive 3 full-sized products: 1 bottle of Furbreeze Heat Cooling Powder (150 g), 1 bottle of Squeakear Earwash (100 ml), and 1 bottle of Furlush Serum (100 ml)." },
        { q: "Is this pack suitable for both puppies and adult dogs?", a: "Yes, all 3 formulations are non-toxic, gentle, and safe for puppies, kittens, and adult pets." },
        { q: "How long does the complete pack last?", a: "For an average medium-sized pet, the Complete Grooming Pack lasts 2 to 3 months with regular weekly use." },
      ],
    };
  }

  // 5. DEFAULT: FURLUSH SERUM
  return {
    eyebrow: "Ayurvedic Coat Care",
    heroHeadline: "Rough, dry coat? Try a 30-day Furlush routine.",
    heroIntro: "Made with natural ingredients like aloe vera, argan and jojoba, Furlush makes coat care simple for dogs and cats.",
    displayedSize: "100 ml",
    heroImg: furlushImg,
    lifestyleImg: lifestylePhoto,
    founderImg: founderPhoto,
    lifestyleBadge: "A coat you love to cuddle",
    ingredientPills: [
      { line1: "Argan +", line2: "jojoba" },
      { line1: "Aloe", line2: "vera" },
      { line1: "Rose", line2: "hydrosol" },
    ],
    roadmapTitle: "Your coat-care routine",
    roadmapSteps: [
      { step: "01", title: "Take a photo", desc: "Note how your pet’s coat looks and feels before Furlush." },
      { step: "02", title: "Apply & brush", desc: "Use Furlush according to bottle directions and brush through." },
      { step: "30", title: "Look back & compare", desc: "Notice how the coat feels when you pet and brush them." },
    ],
    reviewQuote: "“The hair serum makes the coat smooth, soft, shiny, and easy to manage.”",
    reviewerName: "Sunikhi Nandan Dansu",
    reviewerSource: "Amazon review",
    benefits: [
      "Argan + jojoba oils to condition rough-feeling fur",
      "Silicone-free formula with no sticky coating",
      "Light, non-greasy feel for easy grooming",
      "Compare Day 1 and Day 30 to see how your pet’s coat changes",
    ],
    bundles: [
      { pack: 1, label: "Pack of 1", sizeText: "100 ml", savingsText: "Standard bottle" },
      { pack: 2, label: "Pack of 2", sizeText: "2 × 100 ml", savingsText: "SAVE ₹99" },
      { pack: 3, label: "Pack of 3", sizeText: "3 × 100 ml", savingsText: "SAVE ₹198" },
    ],
    comparisons: [
      { frustration: "Fur feels oily after grooming", approach: "Light, non-greasy feel" },
      { frustration: "Shine comes with a silicone coating", approach: "Silicone-free formula" },
      { frustration: "Unsure what is doing the work", approach: "Named ingredients: aloe vera, argan and jojoba" },
      { frustration: "Grooming feels like another big task", approach: "A simple step in the usual brushing routine" },
    ],
    formulaItems: [
      { icon: "✿", title: "Argan + jojoba oils", desc: "Help condition rough-feeling fur and restore healthy shine." },
      { icon: "❀", title: "Aloe vera + rose hydrosol", desc: "Hydrating botanical base that softens coat texture naturally." },
      { icon: "✧", title: "Silicone-free finish", desc: "Designed to feel light and non-greasy rather than sticky." },
    ],
    closingLine: "Ingredient-led grooming for the coat you touch every day.",
    usageSteps: [
      "Mist lightly across your pet’s dry coat from 8–10 inches away.",
      "Gently brush in the direction of hair growth using a comb or a brush suitable for your pet’s coat.",
      "Pay extra attention to areas that tangle easily, such as behind the ears and around the legs. Don’t pull through tight mats.",
      "During heavier shedding periods, use as often as the bottle label directs. After a bath, wait until the coat is dry.",
    ],
    specifications: [
      { label: "Product name", value: "Pawwcious Furlush Serum" },
      { label: "Product type", value: "Pet coat serum" },
      { label: "Category", value: "Coat and skin grooming" },
      { label: "Pet type", value: "Dogs and cats of all breeds" },
      { label: "Key ingredients", value: "Aloe vera, argan oil, jojoba oil and rose hydrosol" },
      { label: "Formula note", value: "Silicone-free, mineral-oil-free, non-greasy" },
      { label: "Size", value: "100 ml" },
      { label: "Origin", value: "Formulated & crafted in India" },
    ],
    customerReviews: [
      {
        name: "Amazon Reviewer",
        headline: "Coat appearance",
        quote: "The hair serum leaves the coat looking healthy, smooth, and shiny.",
        link: "https://www.amazon.in/portal/customer-reviews/srp/-/R3GS3M98RUHKTD",
        verifiedText: "Verified Purchase",
      },
      {
        name: "Sunikhi Nandan Dansu",
        headline: "Easy to manage",
        quote: "The hair serum makes the coat smooth, soft, shiny, and easy to manage.",
        link: "https://www.amazon.in/portal/customer-reviews/srp/-/R2XN88RAGOTCGB",
        verifiedText: "Verified Amazon Review",
      },
      {
        name: "Sandesh Kubsad",
        headline: "Golden Retriever experience",
        quote: "This combo is a boon for my furry Golden Retriever. Lovely fragrance and smooth hairs.",
        link: "https://www.amazon.in/portal/customer-reviews/srp/-/R33CXV0SUENCGV",
        verifiedText: "Verified Amazon Review",
      },
    ],
    videoReels: [
      {
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        title: "Daily Coat Routine",
        subtitle: "Indie Pup Coat Care",
        gradient: "from-[#d9e7d4] to-[#8cad8d]",
        textColor: "text-[#2b513c]",
        buttonColor: "text-[#245437]",
      },
      {
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        title: "Golden Retriever Shine",
        subtitle: "Day 1 vs Day 30 Check",
        gradient: "from-[#e8e4d2] to-[#b3a88c]",
        textColor: "text-[#413824]",
        buttonColor: "text-[#3b321c]",
      },
    ],
    faqs: [
      { q: "Will Furlush stop my pet from shedding?", a: "No coat serum can stop normal biological shedding. Furlush conditions the coat; regular brushing helps collect loose fur before it spreads around the home." },
      { q: "Will it make the coat oily or sticky?", a: "Furlush is 100% silicone-free and non-greasy. Mist lightly as directed and allow the botanical oils to absorb smoothly." },
      { q: "Can I use it on my cat?", a: "Yes, Furlush is gentle and safe for both cats and dogs." },
      { q: "Will it remove knots and mats?", a: "It softens hair fibers to make brushing easier, but never pull violently on tight mats. A groomer can assist with severe matting." },
      { q: "Does it help if my pet keeps scratching?", a: "Furlush is a coat grooming serum. If scratching persists or you notice redness or hair loss, consult a veterinarian." },
      { q: "Will every pet’s coat look different after 30 days?", a: "Coats vary. Take a photo when you start, follow the label directions, and compare how the coat feels after 30 days." },
    ],
  };
}
