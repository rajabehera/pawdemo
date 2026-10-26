import React, { useEffect, useState } from "react";
import {
    Sparkles,
    ArrowRight,
    Leaf,
    Droplets,
    Flame,
    Shield,
    Activity,
    Compass,
    CheckCheck,
    ShieldCheck,
    Smile,
} from "lucide-react";
import { Product } from "../types";

interface ApothecaryIngredient {
    name: string;
    source: string;
    benefit: string;
    category: "hydration" | "calming" | "protection" | "hygiene" | "enrichment" | "repair";
}

interface ApothecaryProduct {
    id: string;
    name: string;
    displayName: string;
    tagline: string;
    description: string;
    imageUrl: string;
    themeColor: {
        primary: string;
        text: string;
        bg: string;
        border: string;
        lightBg: string;
        accent: string;
    };
    linkedProductSlug: string;
    dosageInstructions: string;
    stats: { label: string; value: string }[];
    ingredients: ApothecaryIngredient[];
}

const vImg = (src: string, _w?: number) => src;

function getBioActivity(ingName: string): number {
    let hash = 0;
    for (let i = 0; i < ingName.length; i++) {
        hash = ingName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 82 + (Math.abs(hash) % 18);
}

const APOTHECARY_DATA: ApothecaryProduct[] = [
    {
        id: "furbreeze",
        name: "Furbreeze Cooling Powder",
        displayName: "Furbreeze Heat Cooling Powder",
        tagline: "Instant Prickly Heat Relief & Sweat Absorption",
        description:
            "Specially formulated for hot and humid environments, this Ayurvedic cooling powder absorbs underbelly sweat moisture, soothes friction irritation, and deters seasonal pests naturally.",
        imageUrl: "/images/pow.webp",
        themeColor: {
            primary: "emerald-805",
            text: "emerald-950",
            bg: "bg-emerald-50",
            border: "border-emerald-250",
            lightBg: "#F0FDF4",
            accent: "text-emerald-700",
        },
        linkedProductSlug: "furbreeze-cooling-powder",
        dosageInstructions:
            "Dust liberally over standard hotspots, armpits, and underbelly twice daily during humid weather or after walks.",
        stats: [
            { label: "Moisture Absorbency", value: "3x Standard Talc" },
            { label: "Cooling Duration", value: "Up to 6 Hours" },
            { label: "Biological Safety", value: "100% Talc-Free" },
        ],
        ingredients: [
            {
                name: "Arrowroot Powder",
                source: "Organic Botanical Starch",
                benefit:
                    "Absorbs excess surface moisture gently without obstructing delicate skin pores, keeping underbellies dry.",
                category: "hygiene",
            },
            {
                name: "Peppermint",
                source: "Therapeutic Essential Oil",
                benefit:
                    "Instantly reduces skin-surface temperature to relieve itching and stop active licking behaviors.",
                category: "calming",
            },
            {
                name: "Zinc Oxide",
                source: "Natural Healing Mineral",
                benefit:
                    "Creates a protective moisture barrier that relieves underbelly friction rash and speed up skin recovery.",
                category: "protection",
            },
            {
                name: "Kaolin Clay",
                source: "Purifying Earth Mineral",
                benefit:
                    "Stops bacterial and yeast proliferation by keeping skin folds and groin areas naturally dry and sanitized.",
                category: "protection",
            },
            {
                name: "Colloidal Oatmeal",
                source: "Finely Ground Whole Oat",
                benefit:
                    "Creates a soothing lipid barrier that actively calms allergen-induced scratch cycles and hot spot zones.",
                category: "calming",
            },
            {
                name: "Lavender",
                source: "Calming Essential Oil Extract",
                benefit:
                    "Deodorizes strong humid pet odors and calms the nervous system through aromatherapeutic sensory relief.",
                category: "calming",
            },
            {
                name: "Neem",
                source: "Ayurvedic Herbal Shield",
                benefit:
                    "Broad-spectrum antiseptic and antifungal extract that acts as a secure guard against seasonal ticks & fleas.",
                category: "protection",
            },
            {
                name: "Rosemary",
                source: "Active Polyphenolic Extract",
                benefit:
                    "Shields skin cells against oxidant stressors, supports skin cell renewal, and deters humid-weather midges.",
                category: "protection",
            },
            {
                name: "Chamomile",
                source: "Apigenin-Rich Petal Extract",
                benefit:
                    "Excellent treatment for localized insect bites or allergen hotspots, instantly comforting angry red skin.",
                category: "calming",
            },
        ],
    },
    {
        id: "furlush",
        name: "Furlush Hair Serum",
        displayName: "Furlush Coat Nourishing Serum",
        tagline: "Intensive Root Restorative & Triple-Coat Gloss",
        description:
            "An Ayurvedic Bhringraj & Moroccan Argan oil spray crafted to halt excessive environmental hairfall, dissolve tangled matting, and protect hair follicles from harsh UV sun bleaching.",
        imageUrl: "/images/furlush_serum.webp",
        themeColor: {
            primary: "amber-805",
            text: "amber-950",
            bg: "bg-amber-50",
            border: "border-amber-250",
            lightBg: "#FFFBEB",
            accent: "text-amber-700",
        },
        linkedProductSlug: "furlush-serum",
        dosageInstructions:
            "Mist lightly directly over the coat, then gently massage or slicker-brush to distribute oils evenly from root to tip.",
        stats: [
            { label: "Shedding Reduction", value: "85% Deficit" },
            { label: "Coat Shine Index", value: "+120% Luster" },
            { label: "Detangling Efficiency", value: "Micro-Smooth Slip" },
        ],
        ingredients: [
            {
                name: "Hemp Seed Oil",
                source: "Omega 3-6-9 EFA Rich Oil",
                benefit:
                    "Nourishes the hair shaft directly at the follicle level to drastically minimize seasonal hair fall by 85%.",
                category: "repair",
            },
            {
                name: "Hyaluronic Acid",
                source: "Bio-Complex Humectant",
                benefit:
                    "Pulls in environmental humidity to lock 1000x its weight in absolute moisture into parched triple-coats.",
                category: "hydration",
            },
            {
                name: "Moroccan Argan Oil",
                source: "Cold-Pressed Kernels",
                benefit:
                    "Restores broken cuticles and acts as a lightweight natural glossing agent without leaving sticky grease.",
                category: "repair",
            },
            {
                name: "Turmeric Extract",
                source: "Curcumin Antioxidant Active",
                benefit:
                    "Neutralizes dermal surface warmth, calming localized micro-irritation and environmental skin triggers.",
                category: "calming",
            },
            {
                name: "Calendula Extract",
                source: "Marigold Cellular Active",
                benefit:
                    "Accelerates tissue synthesis and collagen generation to repair minor skin abrasions or sunburnt zones.",
                category: "repair",
            },
            {
                name: "Aloe Vera + Rose Hydrosol",
                source: "Pure Floral Distillate",
                benefit:
                    "Supplies a cooling, aromatherapeutic tonic that conditions and smells exquisitely of fresh spring roses.",
                category: "hydration",
            },
            {
                name: "Rosehip Seed Oil",
                source: "Vitamin A & C Retinoid Complex",
                benefit:
                    "Promotes deep cellular regeneration of tired hair roots, turning coarse dry coats into velvety skin.",
                category: "repair",
            },
            {
                name: "Panthenol + Niacinamide",
                source: "B-Vitamin Strengthening Unit",
                benefit:
                    "Substantially reinforces the outer hair keratin sheath and shields locks from sunlight-induced fading.",
                category: "protection",
            },
            {
                name: "Jojoba Oil",
                source: "Natural Monounsaturated Esters",
                benefit:
                    "Matches natural pet sebum precisely to soften tough epidermal dander and dissolve persistent coat dander.",
                category: "hydration",
            },
        ],
    },
    {
        id: "coffee_wood",
        name: "Coffee Wood Chew",
        displayName: "Organic Coffee Wood Chew",
        tagline: "Eco-Conscious Mechanical Plaque & Dental Scraper",
        description:
            "A highly dense, 100% natural, caffeine-free chewing branch harvested from Indian coffee estates. It provides satisfying physical enrichment while cleaning teeth.",
        imageUrl: "/images/coffeewood_chew.webp",
        themeColor: {
            primary: "orange-805",
            text: "orange-950",
            bg: "bg-orange-50",
            border: "border-orange-250",
            lightBg: "#FFF7ED",
            accent: "text-orange-700",
        },
        linkedProductSlug: "coffee-wood-chew",
        dosageInstructions:
            "Introduce during chew-anxiety periods, and oversee playtime. Swap out when the wood size fits entirely in the pet's mouth.",
        stats: [
            { label: "Physical Density", value: "High-Caliber Hardwood" },
            { label: "Caffeine Content", value: "0.0% Caffeine-Free" },
            { label: "Environmental Carbon", value: "100% Reclaimed" },
        ],
        ingredients: [
            {
                name: "100% Coffee Wood",
                source: "Reclaimed Arabica Branch",
                benefit:
                    "Densely packed wood harvested from premium shade-grown estates, providing ultimate mechanical biting challenge.",
                category: "enrichment",
            },
            {
                name: "Harvested Sustainably",
                source: "Agro-forestry By-product",
                benefit:
                    "Sourced only when coffee trees surpass their commercial bearing age, promoting circular eco-farming.",
                category: "enrichment",
            },
            {
                name: "Long-Lasting Wear",
                source: "Compressed Fine-Grained Wood",
                benefit:
                    "Maintains its shape over weeks of high-intensity biting, preventing furniture degradation.",
                category: "enrichment",
            },
            {
                name: "No Sharp Splinters",
                source: "Close-Knit Inner Fiber Grid",
                benefit:
                    "Unlike raw forest wood, coffee wood fibers peel off as soft digestible threads to ensure mouth-lining safety.",
                category: "enrichment",
            },
            {
                name: "Naturally Caffeine-Free",
                source: "Untreated Organic Wood",
                benefit:
                    "Offers all the sensory woody enjoyment of coffee plants without stimulating active chemical alkaloids.",
                category: "protection",
            },
            {
                name: "Reduces Boredom & Stress",
                source: "Endorphin-Releasing Playtime",
                benefit:
                    "The natural rhythmic act of chewing triggers endorphins, decreasing anxiety and mental fatigue.",
                category: "calming",
            },
            {
                name: "Mechanical Plaque Cleanser",
                source: "Floss-like Outer Fibers",
                benefit:
                    "As the wood softens, the fine threads gently scrub deep interdental gaps to sweep out sticky plaque.",
                category: "hygiene",
            },
            {
                name: "Eco-Conscious Sourcing",
                source: "Zero Forest Deforestation",
                benefit:
                    "Eliminates timber logging completely: no living forest trees are ever damaged or fallen for this chew.",
                category: "enrichment",
            },
            {
                name: "Friction-Shedding Safety",
                source: "Mouth-Sanitizing Scrub",
                benefit:
                    "Gently massages gum lines, improving blood flow and reducing stinky bad breath at the source.",
                category: "hygiene",
            },
        ],
    },
    {
        id: "squeakier",
        name: "Squeakier Ear Wash",
        displayName: "Squeakier Antiseptic Ear Wash",
        tagline: "Antimicrobial & Yeast Eliminating Otic Solution",
        description:
            "A professional, non-stinging ear hygiene cleanser created to emulsify stubborn inner earwax, eliminate sour yeast odors, and neutralize damp moisture in floppy ears.",
        imageUrl: "/images/squeakier_earwash.webp",
        themeColor: {
            primary: "sky-805",
            text: "sky-950",
            bg: "bg-sky-50",
            border: "border-sky-250",
            lightBg: "#F0F9FF",
            accent: "text-sky-700",
        },
        linkedProductSlug: "squeakear-earwash",
        dosageInstructions:
            "Squeeze 3-5 drops directly inside the ear, gently massage the base of the ear to break wax, and wipe away discharge with a clean cotton pad.",
        stats: [
            { label: "Sting Factor", value: "0.0% Alcohol-Free" },
            { label: "Yeast Invalidation", value: "Broad Spectrum Action" },
            { label: "pH Range", value: "Bio-Compatible 6.2" },
        ],
        ingredients: [
            {
                name: "Leucidal Ferment",
                source: "Radish Root Ferment Filtrate",
                benefit:
                    "High-performance organic peptide preservative that halts target bacteria without stinging raw skin folds.",
                category: "protection",
            },
            {
                name: "Neem Oil Extract",
                source: "Ayurvedic Herbal Essence",
                benefit:
                    "Inhibits common fungal spores and ear mites, ensuring ears stay clean under heavy monsoon weather.",
                category: "protection",
            },
            {
                name: "Aloe Vera Gel",
                source: "Pure Mucilage Juice",
                benefit:
                    "Soothes hot, inflamed ear-flap linings and cools head-shaking irritation quickly and thoroughly.",
                category: "calming",
            },
            {
                name: "Calendula Flower",
                source: "Marigold Active Infusion",
                benefit:
                    "Rich in triterpenes to regenerate minor scratches from aggressive backing or paw scratching.",
                category: "repair",
            },
            {
                name: "Apple Cider Vinegar",
                source: "Naturally Fermented Acid",
                benefit:
                    "Lowers canal pH value just enough to create an environment totally unlivable for stinky yeasts.",
                category: "hygiene",
            },
            {
                name: "Lavender Essential Oil",
                source: "Linalool-rich Extract",
                benefit:
                    "Eradicates sour yeast odors while calming nervous pets during crucial cleaning routines.",
                category: "calming",
            },
            {
                name: "Rosemary Active",
                source: "Terpene-focused Defense",
                benefit:
                    "Cleanses the canal of heavy wax build-up while offering durable protection from persistent ear yeast.",
                category: "protection",
            },
            {
                name: "Chamomile Matricaria",
                source: "Bisabolol-dense Botanical",
                benefit:
                    "Tranquilizes deep otic nerve irritation and stops constant scratching of the ear flap.",
                category: "calming",
            },
            {
                name: "Tea Tree Oil",
                source: "Diluted Purifying Active",
                benefit:
                    "Sourced and precisely calibrated at safe levels to melt sticky internal ear wax plugs and fight infections.",
                category: "hygiene",
            },
        ],
    },
];

interface InteractiveBotanicalApothecaryProps {
    products?: Product[];
    bestSellers: Product[];
    onSelectProduct: (product: Product) => void;
    onSelectView: (viewName: "product" | "blog" | "about" | "contact" | "shop") => void;
}

export function InteractiveBotanicalApothecary({
    products = [],
    bestSellers,
    onSelectProduct,
    onSelectView,
}: InteractiveBotanicalApothecaryProps) {
    const [activeApoId, setActiveApoId] = useState("furbreeze");
    const currentApoProduct =
        APOTHECARY_DATA.find((p) => p.id === activeApoId) || APOTHECARY_DATA[0];

    const [hoveredIng, setHoveredIng] = useState<ApothecaryIngredient | null>(null);
    const [selectedIng, setSelectedIng] = useState<ApothecaryIngredient>(
        currentApoProduct.ingredients[0]
    );

    useEffect(() => {
        const prod = APOTHECARY_DATA.find((p) => p.id === activeApoId) || APOTHECARY_DATA[0];
        setSelectedIng(prod.ingredients[0]);
        setHoveredIng(null);
    }, [activeApoId]);

    return (
        <div
            id="homepage-apothecary-section"
            style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}
            className="bg-[#FAF9F5]/30 border-t border-b border-stone-200/40 py-16 relative overflow-hidden"
        >
            <div
                className="absolute left-10 bottom-12 opacity-30 text-teal-900/10 pointer-events-none"
                aria-hidden="true"
            >
                <svg className="w-56 h-36" viewBox="0 0 100 50" fill="none">
                    <path
                        d="M5 45 C 20 20, 50 10, 95 5 M95 5 C 70 20, 40 40, 5 45"
                        stroke="currentColor"
                        strokeWidth="0.5"
                    />
                    <path
                        d="M15 35 Q 40 25, 75 15"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                    />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="max-w-2xl text-left space-y-2 font-sans">
                        <span className="text-[10px] font-mono tracking-widest text-[#115E59] font-bold uppercase block">
                            Pure Lab Integrity & Wellness Science
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black font-serif italic text-[#1A1F1D] tracking-wide">
                            Interactive Botanical Apothecary
                        </h2>
                        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                            Click a flagship clinical solution below to inspect its individual active ingredient matrix. Hover or select any clean compound to trigger the active laboratory-grade profiler.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#FAF9F5] px-3.5 py-1.5 rounded-full border border-stone-250/50 font-mono text-[10px] text-stone-600 self-start md:self-end">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        100% Non-Toxic & Zero Fillers Sourced
                    </div>
                </div>

                <div className="flex overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 gap-2.5 snap-x scrollbar-thin scrollbar-thumb-stone-200 select-none">
                    {APOTHECARY_DATA.map((prod) => {
                        const isActive = activeApoId === prod.id;

                        return (
                            <button
                                key={prod.id}
                                type="button"
                                onClick={() => setActiveApoId(prod.id)}
                                className={`flex-none snap-start flex items-center gap-3 px-5 py-3.5 rounded-xl border font-sans text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isActive
                                        ? "bg-white text-[#134E4A] border-[#134E4A] border-2 shadow-xs ring-4 ring-teal-500/10"
                                        : "bg-white/60 text-stone-605 border-stone-200/70 hover:bg-white hover:text-stone-900 hover:border-stone-300"
                                    }`}
                            >
                                <div
                                    className={`p-1 rounded-md transition-colors ${isActive ? "bg-teal-50 text-[#134E4A]" : "bg-stone-50 text-stone-400"
                                        }`}
                                >
                                    {prod.id === "furbreeze" && <Flame className="h-4 w-4" aria-hidden="true" />}
                                    {prod.id === "furlush" && <Leaf className="h-4 w-4" aria-hidden="true" />}
                                    {prod.id === "coffee_wood" && <Compass className="h-4 w-4" aria-hidden="true" />}
                                    {prod.id === "squeakier" && <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                                </div>
                                <span>{prod.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <div className="bg-white border border-stone-200/60 rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-2xs relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF9F5]/80 rounded-full filter blur-3xl opacity-60 -mr-10 -mt-10 pointer-events-none" />

                        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-stretch relative z-10">
                            <div className="relative w-36 h-66 sm:w-44 sm:h-64 shrink-0 rounded-2xl overflow-hidden bg-[#FAF9F5] border border-stone-100 flex items-center justify-center p-3.5 group/bottle select-none shadow-3xs">
                                <div
                                    className="absolute inset-0 opacity-15 pointer-events-none text-teal-800/40 p-3"
                                    aria-hidden="true"
                                >
                                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                                        <path
                                            d="M10 90 Q 30 60, 80 20 M80 20 Q 50 70, 10 90"
                                            stroke="currentColor"
                                            strokeWidth="0.75"
                                        />
                                        <circle cx="80" cy="20" r="1.5" fill="currentColor" />
                                    </svg>
                                </div>

                                <img
                                    src={vImg(currentApoProduct.imageUrl, 300)}
                                    alt={currentApoProduct.name}
                                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 scale-[1.5] group-hover/bottle:scale-[1.7]"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between space-y-2.5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[8.5px] font-mono tracking-wider font-extrabold text-[#134E4A] bg-teal-50 px-2 rounded-full uppercase">
                                            Clinical Spec
                                        </span>
                                        <span className="text-[9px] font-mono text-stone-450 font-medium">
                                            ID: {currentApoProduct.id.toUpperCase()}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-[#113C3A] tracking-tight leading-tight select-none">
                                        {currentApoProduct.displayName}
                                    </h3>

                                    <p className="text-[10.5px] font-bold text-teal-850 font-serif italic leading-none block">
                                        {currentApoProduct.tagline}
                                    </p>
                                </div>

                                <p className="text-stone-550 text-[11.5px] leading-relaxed line-clamp-2 md:line-clamp-3">
                                    {currentApoProduct.description}
                                </p>

                                <div className="flex flex-wrap gap-1 pt-1">
                                    {currentApoProduct.stats.map((stat, i) => (
                                        <div
                                            key={i}
                                            className="bg-[#FAF9F5] border border-stone-200/50 px-2 py-0.5 rounded-full flex items-center gap-1 text-[9.5px]"
                                        >
                                            <span className="text-stone-400 font-mono font-medium tracking-wide">
                                                {stat.label}:
                                            </span>
                                            <span className="font-extrabold text-[#113C3A]">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-stone-100 mt-5 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10">
                            <div className="space-y-0.5">
                                <span className="text-[8.5px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                                    VETERINARY USAGE PATHWAY
                                </span>
                                <p className="text-[10.5px] text-stone-600 leading-normal font-sans line-clamp-1">
                                    {currentApoProduct.dosageInstructions}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    const item =
                                        products.find((p) => p.id === currentApoProduct.linkedProductSlug) ||
                                        bestSellers.find((p) => p.id === currentApoProduct.linkedProductSlug);

                                    item ? onSelectProduct(item) : onSelectView("shop");
                                }}
                                className="shrink-0 py-2.5 px-4.5 rounded-xl bg-[#134E4A] hover:bg-[#0F3C39] text-white text-[11px] font-bold font-sans flex items-center justify-center gap-1.5 group transition-colors duration-200 cursor-pointer"
                            >
                                <span>See Details</span>
                                <ArrowRight
                                    className="h-3 w-3 group-hover:translate-x-0.5 transition-transform"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-2 text-left">
                            <span className="text-[8.5px] font-mono tracking-widest text-[#134E4A] font-bold uppercase block mb-1">
                                Active Clinical Compounding (Tap to Inspect)
                            </span>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                {currentApoProduct.ingredients.map((ing, idx) => {
                                    const isSelected = selectedIng.name === ing.name;
                                    const isHovered = hoveredIng?.name === ing.name;

                                    let CatIcon = Sparkles;
                                    let iconColor = "text-sky-600 bg-sky-50";

                                    if (ing.category === "hydration") {
                                        CatIcon = Droplets;
                                        iconColor = "text-cyan-600 bg-cyan-50";
                                    } else if (ing.category === "calming") {
                                        CatIcon = Smile;
                                        iconColor = "text-amber-600 bg-amber-50";
                                    } else if (ing.category === "protection") {
                                        CatIcon = Shield;
                                        iconColor = "text-emerald-500 bg-emerald-50";
                                    } else if (ing.category === "repair") {
                                        CatIcon = Activity;
                                        iconColor = "text-rose-600 bg-rose-50";
                                    } else if (ing.category === "enrichment") {
                                        CatIcon = Compass;
                                        iconColor = "text-orange-500 bg-orange-50";
                                    } else if (ing.category === "hygiene") {
                                        CatIcon = Sparkles;
                                        iconColor = "text-teal-600 bg-teal-50";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedIng(ing)}
                                            onMouseEnter={() => setHoveredIng(ing)}
                                            onMouseLeave={() => setHoveredIng(null)}
                                            className={`text-left px-3 py-2 rounded-xl border bg-white transition-all duration-200 cursor-pointer hover:shadow-3xs flex items-center justify-between gap-1 select-none group ${isSelected
                                                    ? "border-[#134E4A] bg-teal-50/20 shadow-4xs ring-2 ring-[#134E4A]/10"
                                                    : isHovered
                                                        ? "border-stone-400 bg-stone-50/60"
                                                        : "border-stone-150"
                                                }`}
                                        >
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <div className={`p-1 rounded-md shrink-0 ${iconColor}`}>
                                                    <CatIcon className="h-3 w-3" aria-hidden="true" />
                                                </div>

                                                <span className="font-bold text-[11px] text-stone-900 leading-tight truncate group-hover:text-[#134E4A] transition-colors">
                                                    {ing.name}
                                                </span>
                                            </div>

                                            <div
                                                className={`h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-300 ${isSelected ? "bg-[#134E4A] scale-125" : "bg-stone-300 group-hover:bg-stone-400"
                                                    }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {(() => {
                            const active = hoveredIng || selectedIng;

                            return (
                                <div className="bg-[#FAF9F5] border border-stone-200/50 rounded-xl p-4 shadow-3xs relative overflow-hidden transition-all duration-200 text-left min-h-[165px] flex flex-col justify-between">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#134E4A]" />

                                    <div className="space-y-2.5 relative z-10 flex-1 flex flex-col justify-between">
                                        <div className="flex items-center justify-between border-b border-stone-200/40 pb-2 flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <CheckCheck
                                                    className="h-3.5 w-3.5 text-emerald-600 shrink-0"
                                                    aria-hidden="true"
                                                />
                                                <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                                                    ACTIVE COMPOUND DIAGNOSTIC PROFILER
                                                </span>
                                            </div>

                                            <span className="text-[9px] font-mono text-teal-850 font-bold bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full capitalize">
                                                {active.category} Action
                                            </span>
                                        </div>

                                        <div className="space-y-1.5 min-h-[82px] flex flex-col justify-start">
                                            <h4 className="text-sm font-black text-stone-950 flex items-center gap-1.5 flex-wrap">
                                                <span>{active.name}</span>
                                                <span className="text-[10px] font-mono text-stone-400 font-normal">
                                                    ({active.source})
                                                </span>
                                            </h4>

                                            <p className="text-[11.5px] text-stone-650 leading-relaxed font-sans line-clamp-3">
                                                {active.benefit}
                                            </p>
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-stone-200/50 flex items-center gap-3 text-[10.5px]">
                                            <span className="font-mono text-stone-400 uppercase tracking-widest text-[8px] font-bold shrink-0">
                                                Bio-Activity Index
                                            </span>

                                            <div className="flex-1 h-1.5 bg-stone-200/50 rounded-full relative overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 animate-pulse"
                                                    style={{ width: `${getBioActivity(active.name)}%` }}
                                                />
                                            </div>

                                            <span className="font-mono font-bold text-[#134E4A] leading-none shrink-0 text-[10px]">
                                                {getBioActivity(active.name)}% Pure-Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}