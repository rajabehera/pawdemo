import React, { useState, useEffect, useRef } from "react";
import {
    Check, Heart, Volume2, VolumeX, Eye, Tv,
    Play, Instagram, ChevronLeft, ChevronRight,
} from "lucide-react";
import { ReviewReel } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InstagramPost {
    id: string;
    type: "image" | "reel";
    imageUrl: string;
    videoUrl?: string;
    authorName: string;
    authorAvatar: string;
    likes: number;
    hasLiked?: boolean;
    views?: string;
    caption: string;
    location?: string;
    comments: { user: string; text: string; time: string }[];
    featuredProductId: string;
    instagramEmbedCode?: string;
}

// ─── Static fallback reels ────────────────────────────────────────────────────

const DEFAULT_REELS: InstagramPost[] = [
    {
        id: "reel-1",
        type: "reel",
        imageUrl: "/reels_thumbnails/1.webp",
        videoUrl: "/video/pawwcious_reels_1.mp4",
        authorName: "era",
        authorAvatar: "/images/lo.webp",
        likes: 12400,
        hasLiked: false,
        views: "1.2M",
        caption: "Our monsoon itch cooling powder ritual is pure magic! Say goodbye to sticky summer sweat with 100% talc-free Furbreeze. 🐾🌧️ #HotDogsIndia #CoolingPowderPets",
        location: "Mumbai Juhu Beach",
        featuredProductId: "furbreeze-cooling-powder",
        comments: [
            { user: "bru_thegoldie", text: "Furlush made Bruno’s coat so soft and shiny! The monsoon frizz is finally under control.", time: "1d ago" },
            { user: "priya_paws", text: "Love that it doesn’t feel sticky or heavy. Just a few drops and the fur looks so much healthier.", time: "20h ago" },
            { user: "mumbai_petmom", text: "This is super useful for humid weather! My dog’s coat feels smoother after every use.", time: "16h ago" },

        ],
    },
    {
        id: "reel-2",
        type: "reel",
        imageUrl: "/reels_thumbnails/2.webp",
        videoUrl: "/video/pawwcious_reels_2.mp4",
        authorName: "mimi_persian_cat",
        authorAvatar: "/images/lo.webp",
        likes: 8520,
        hasLiked: false,
        views: "850K",
        caption: "Getting that royal coat shine after a long grooming spa! Furlush Serum makes brushing double coats a breeze. Essential for Indian weather! 💎✨",
        location: "Bengaluru, Club Row",
        featuredProductId: "furlush-serum",
        comments: [
            { user: "simba_diaries", text: "The shine after applying Furlush is actually visible. Perfect for dull and rough coats.", time: "12h ago" },
            { user: "catmom_neha", text: "Finally found something that helps with tangles without making the fur oily.", time: "8h ago" },
        ],
    },
    {
        id: "reel-3",
        type: "reel",
        imageUrl: "/reels_thumbnails/3.webp",
        videoUrl: "/video/pawwcious_reels_3.mp4",
        authorName: "leo_frenchie",
        authorAvatar: "/images/lo.webp",
        likes: 21500,
        hasLiked: false,
        views: "2.1M",
        caption: "Clean ears, happy pets! SqueakiEar Ear Wash gently helps remove dirt, wax, and odour — keeping every head shake fresh and comfy. 🐾✨",
        location: "Delhi, DLF Phase 5",
        featuredProductId: "coffee-wood-chew",
        comments: [
            { user: "buddy_thebeagle", text: "SqueakiEar made ear cleaning so much easier! No more constant scratching and head shaking.", time: "1d ago" },
            { user: "priya_paws", text: "Love that it feels gentle and helps with that ear odour. Super useful for monsoon care.", time: "19h ago" },

        ],
    },
    {
        id: "reel-4",
        type: "reel",
        imageUrl: "/reels_thumbnails/4.webp",
        videoUrl: "/video/pawwcious_reels_4.mp4",
        authorName: "milo_the_poodle",
        authorAvatar: "/images/lo.webp",
        likes: 15400,
        hasLiked: false,
        views: "1.5M",
        caption: "Monsoon ear care has never been this easy! Check out Squeakear Earwash for absolute dry hygiene and wax-free skin. 🌧️👂 #PetGroomingIndia #EarCleanse",
        location: "Chennai, Tamil Nadu",
        featuredProductId: "squeakear-earwash",
        comments: [
            { user: "mumbai_petmom", text: "Finally an ear wash that doesn’t feel harsh. My dog stays so much calmer during cleaning.", time: "14h ago" },
            { user: "simba_diaries", text: "Clean ears and fresh cuddles! This is definitely staying in our grooming kit.", time: "9h ago" },
            { user: "catmom_neha", text: "So helpful for keeping wax and dirt under control, especially in humid weather.", time: "5h ago" },
        ],
    },
    {
        id: "reel-5",
        type: "reel",
        imageUrl: "/reels_thumbnails/5.webp",
        videoUrl: "/video/pawwcious_reels_5.mp4",
        authorName: "simba_the_cat",
        authorAvatar: "/images/lo.webp",
        likes: 9800,
        hasLiked: false,
        views: "980K",
        caption: "Soft fur, smooth combing, and that healthy shine! Furlush Serum turns rough coat days into glow days. ✨,Frizz? Tangles? Dull coat? Furlush Serum brings back the silky bounce your pet deserves. 🐾A few drops, a gentle palm-apply, and her coat looks salon-fresh. Furlush is pure fur luxury. ✨Monsoon humidity can’t win today. Furlush Serum keeps the coat smooth, glossy, and cuddle-ready. 💚From rough and dull to soft and shiny — Furlush Serum makes every grooming session feel premium.",
        location: "Kolkata, WB",
        featuredProductId: "complete-grooming-pack",
        comments: [
            { user: "zoya_thegoldie", text: "Furlush gave her coat such a soft shine! It looks like a mini grooming session at home.", time: "1d ago" },
            { user: "mumbai_pawrent", text: "This helped so much with monsoon frizz. The coat feels smoother without becoming oily.", time: "21h ago" },

        ],
    },
    {
        id: "reel-6",
        type: "reel",
        imageUrl: "/reels_thumbnails/6.webp",
        videoUrl: "/video/pawwcious_reels_6.mp4",
        authorName: "glitter_the_golden",
        authorAvatar: "/images/lo.webp",
        likes: 19300,
        hasLiked: false,
        views: "1.9M",
        caption: "Humidity can be harsh, but Furbreeze brings gentle freshness from the skin up. 💚",
        location: "Hyderabad, Telangana",
        featuredProductId: "coffee-wood-chew",
        comments: [
            { user: "mumbai_pawrent", text: "Furbreeze helped so much with the Juhu humidity. My dog feels fresher after every walk.", time: "1d ago" },
            { user: "golden_boy", text: "The Vetiver Khus scent is so calming! Love that it’s talc-free and gentle.", time: "22h ago" },
            { user: "bella_thebeagle", text: "This was super useful for sweaty paws and belly folds during humid weather.", time: "18h ago" },

        ],
    },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface InstagramReelsSectionProps {
    reviewReels?: ReviewReel[];
    onInstagramModalToggle?: (isOpen: boolean) => void;
    followersCount?: number;
    postsCount?: number;
}

// ─── ReelCard (defined outside parent so key prop doesn't conflict) ───────────

interface ReelCardProps {
    reel: InstagramPost;
    extraClass?: string;
    onOpen: (reel: InstagramPost) => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, extraClass = "", onOpen }) => (
    <div
        onClick={() => onOpen(reel)}
        className={`relative aspect-[9/16] rounded-2xl overflow-hidden shadow-xl cursor-pointer border border-stone-900 bg-stone-900 group transition-opacity duration-300 hover:scale-[1.03] hover:ring-2 hover:ring-teal-500/80 hover:shadow-[0_0_20px_rgba(20,184,166,0.35)] ${extraClass}`}
    >
        <div className="absolute inset-0 bg-stone-950/45 group-hover:bg-stone-950/20 z-10 transition duration-300" />
        <img
            src={reel.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-500"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
        />

        {/* Views badge */}
        <span className="absolute top-2.5 right-2.5 z-20 bg-stone-950/85 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-stone-850 flex items-center gap-1 select-none">
            <Eye className="h-2.5 w-2.5 text-stone-350" />
            {reel.views}
        </span>

        {/* Bottom info */}
        <div className="absolute inset-x-3 bottom-3.5 z-20 space-y-1 text-white">
            <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-full bg-stone-800 border border-stone-700 overflow-hidden shrink-0">
                    <img src={reel.authorAvatar} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
                <span className="font-bold text-[9.5px] tracking-tight text-stone-200 truncate">@{reel.authorName}</span>
            </div>
            <p className="text-[9px] text-stone-300 leading-normal line-clamp-1 font-serif italic">{reel.caption}</p>
            <div className="flex items-center gap-2 pt-0.5 text-[8px] font-mono text-stone-400">
                <span className="flex items-center gap-0.5 text-red-400">
                    <Heart className="h-2.5 w-2.5 fill-current" />
                    {reel.likes >= 1000 ? `${(reel.likes / 1000).toFixed(1)}K` : reel.likes}
                </span>
                <span>•</span>
                <span className="text-teal-400 font-extrabold uppercase tracking-widest text-[7px]">Tap to play</span>
            </div>
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 z-15 flex items-center justify-center scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition duration-300">
            <div className="bg-white/95 text-stone-950 p-2.5 rounded-full shadow-lg">
                <Play className="h-4 w-4 fill-current text-teal-850 ml-0.5" />
            </div>
        </div>
    </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export function InstagramReelsSection({
    reviewReels = [],
    onInstagramModalToggle,
    followersCount = 48240,
    postsCount = 182,
}: InstagramReelsSectionProps) {
    // Merge Firestore review reels over the default static reels
    const [reels, setReels] = useState<InstagramPost[]>(DEFAULT_REELS);

    useEffect(() => {
        if (!reviewReels || reviewReels.length === 0) return;

        setReels((prev) => {
            const mapped: InstagramPost[] = reviewReels.map((reel) => {
                const existing = prev.find((p) => p.id === reel.id);
                return {
                    id: reel.id,
                    type: "reel",
                    imageUrl: reel.imageUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400",
                    videoUrl: reel.videoUrl,
                    authorName: (reel.authorName || "Anonymous").replace(/\s+/g, "_").toLowerCase(),
                    authorAvatar: "/images/lo.webp",
                    likes: existing ? existing.likes : (Number(reel.likes) || 0),
                    hasLiked: existing?.hasLiked ?? false,
                    views: reel.views || "1.2K",
                    caption: reel.caption,
                    location: reel.location || "India",
                    comments: existing?.comments ?? [
                        { user: "clinical_vet_care", text: `Highly recommended! Premium formula for ${reel.petName || "your pet"}.`, time: "1h ago" },
                    ],
                    featuredProductId: reel.featuredProductId || "",
                    instagramEmbedCode: reel.instagramEmbedCode || "",
                };
            });

            // Replace static defaults with CMS reels, keeping any static ones not overridden
            const staticIds = new Set(mapped.map((r) => r.id));
            const kept = prev.filter((p) => !staticIds.has(p.id));
            return [...kept, ...mapped];
        });
    }, [reviewReels]);

    // ─── Modal state ────────────────────────────────────────────────────────────

    const [selectedReel, setSelectedReel] = useState<InstagramPost | null>(null);
    const [muted, setMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [reelProgress, setReelProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = selectedReel ? "hidden" : "";
        onInstagramModalToggle?.(!!selectedReel);
        return () => {
            document.body.style.overflow = "";
            onInstagramModalToggle?.(false);
        };
    }, [selectedReel, onInstagramModalToggle]);

    // Process Instagram embed when modal opens
    useEffect(() => {
        if (selectedReel?.instagramEmbedCode) {
            const id = "instagram-embed-script";
            let script = document.getElementById(id) as HTMLScriptElement | null;
            const process = () => (window as any).instgrm?.Embeds?.process();
            if (!script) {
                script = document.createElement("script");
                script.id = id;
                script.async = true;
                script.src = "//www.instagram.com/embed.js";
                script.onload = () => setTimeout(process, 150);
                document.body.appendChild(script);
            } else {
                setTimeout(process, 150);
            }
        }
    }, [selectedReel]);

    // Simulate reel progress bar
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (selectedReel && selectedReel.instagramEmbedCode && isPlaying) {
            interval = setInterval(() => {
                setReelProgress((prev) => {
                    if (prev >= 100) {
                        if (videoRef.current) videoRef.current.currentTime = 0;
                        return 0;
                    }
                    return prev + 1.5;
                });
            }, 150);
        } else if (!selectedReel) {
            setReelProgress(0);
        }
        return () => clearInterval(interval);
    }, [selectedReel, isPlaying]);

    useEffect(() => {
        if (!selectedReel || selectedReel.instagramEmbedCode) return;
        const video = videoRef.current;
        if (video) {
            if (isPlaying) {
                video.play().catch((err) => {
                    console.log("HTML5 Video playback failed or was prevented:", err);
                });
            } else {
                video.pause();
            }
        }
    }, [isPlaying, selectedReel]);

    const openReel = (reel: InstagramPost) => {
        setSelectedReel(reel);
        setIsPlaying(true);
        setReelProgress(0);
    };

    const navigateReel = (dir: "prev" | "next") => {
        if (!selectedReel) return;
        const idx = reels.findIndex((r) => r.id === selectedReel.id);
        const next = dir === "next"
            ? (idx + 1) % reels.length
            : (idx - 1 + reels.length) % reels.length;
        openReel(reels[next]);
    };

    const toggleLike = (id: string) => {
        setReels((prev) =>
            prev.map((r) =>
                r.id === id
                    ? { ...r, hasLiked: !r.hasLiked, likes: r.hasLiked ? r.likes - 1 : r.likes + 1 }
                    : r
            )
        );
        if (selectedReel?.id === id) {
            setSelectedReel((prev) =>
                prev ? { ...prev, hasLiked: !prev.hasLiked, likes: prev.hasLiked ? prev.likes - 1 : prev.likes + 1 } : prev
            );
        }
    };

    // ─── Layout state ────────────────────────────────────────────────────────────

    const [layout, setLayout] = useState<"marquee" | "carousel" | "grid">("marquee");
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const mobileGridRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll for carousel + grid
    useEffect(() => {
        if (layout === "marquee") return;
        const container = layout === "carousel" ? carouselRef.current : mobileGridRef.current;
        if (!container) return;

        let interval: ReturnType<typeof setInterval>;

        const tick = () => {
            interval = setInterval(() => {
                requestAnimationFrame(() => {
                    const { scrollLeft, scrollWidth, clientWidth } = container;
                    if (scrollLeft + clientWidth >= scrollWidth - 15) {
                        container.scrollTo({ left: 0, behavior: "smooth" });
                    } else {
                        container.scrollBy({ left: 196, behavior: "smooth" });
                    }
                });
            }, 3500);
        };

        tick();
        const pause = () => clearInterval(interval);
        const resume = () => { clearInterval(interval); tick(); };

        container.addEventListener("touchstart", pause, { passive: true });
        container.addEventListener("touchend", resume, { passive: true });
        container.addEventListener("mouseenter", pause);
        container.addEventListener("mouseleave", resume);

        return () => {
            clearInterval(interval);
            container.removeEventListener("touchstart", pause);
            container.removeEventListener("touchend", resume);
            container.removeEventListener("mouseenter", pause);
            container.removeEventListener("mouseleave", resume);
        };
    }, [layout, reels]);

    const scrollCarousel = (dir: "prev" | "next") => {
        const el = carouselRef.current;
        if (!el) return;
        requestAnimationFrame(() => {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            const amount = clientWidth * 0.8;
            if (dir === "next") {
                scrollLeft + clientWidth >= scrollWidth - 15
                    ? el.scrollTo({ left: 0, behavior: "smooth" })
                    : el.scrollBy({ left: amount, behavior: "smooth" });
            } else {
                scrollLeft <= 15
                    ? el.scrollTo({ left: scrollWidth, behavior: "smooth" })
                    : el.scrollBy({ left: -amount, behavior: "smooth" });
            }
        });
    };
    const instagramUrl = "https://instagram.com/pawwcious";

    // ─── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className="w-full text-left bg-stone-950 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden border border-stone-900/70 shadow-2xl">

            {/* Decorative Instagram icon */}
            <div className="absolute right-5 -top-5 opacity-5 text-teal-400 pointer-events-none">
                <Instagram className="h-44 w-44" />
            </div>

            {/* ── Profile header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-stone-900 pb-6 mb-8 gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    {/* Avatar with gradient ring */}
                    <div className="relative p-1 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600">
                        <img
                            src="/images/lo.webp"
                            alt="Pawwcious"
                            className="w-14 h-14 rounded-full border-2 border-stone-950 object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-0.5 rounded-full border border-stone-950 flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 stroke-[4px]" />
                        </span>
                    </div>

                    {/* Profile info */}
                    <div>
                        <div className="flex items-center gap-2">
                            <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans font-black text-base text-stone-100 hover:text-amber-400 transition cursor-pointer tracking-tight"
                            >
                                @pawwcious
                            </a>
                            <span className="bg-stone-850 text-[9px] font-mono text-stone-405 px-1.5 py-0.5 rounded border border-stone-800 uppercase font-bold tracking-wider">
                                Official
                            </span>
                        </div>
                        <p className="text-[10px] text-stone-400 mt-0.5 font-sans leading-relaxed">
                            Pawwcious – Premium Pet Wellness<br />
                            Natural grooming • Herbal healing 🌿<br />
                            Because every pet deserves a gentler, purer world 🐾
                        </p>
                        <div className="flex items-center gap-3.5 mt-2 font-mono text-[9.5px] text-stone-400 font-semibold">
                            <div><span className="text-white font-bold">{postsCount}</span> posts</div>
                            <div><span className="text-white font-bold">{followersCount.toLocaleString()}</span> followers</div>
                            <div><span className="text-teal-400 font-bold">4.9★</span> raved</div>
                        </div>
                    </div>
                </div>

                {/* Open Instagram CTA */}
                <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 border border-stone-850 bg-stone-900/60 hover:bg-stone-900 text-xs font-semibold text-stone-300 px-5 py-2.5 rounded-xl transition"
                >
                    <Instagram className="h-3.5 w-3.5 text-stone-400" />
                    Open Instagram
                </a>
            </div>

            {/* ── Story Reels Cinema ── */}
            <div className="relative z-10">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-900/60">
                    <div className="flex items-center gap-2">
                        <Tv className="h-4.5 w-4.5 text-amber-500" />
                        <div>
                            <h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-wider text-stone-100 flex items-center gap-2">
                                Story Reels Cinema
                                <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded font-mono uppercase tracking-normal">
                                    Reels Curation 🍿
                                </span>
                            </h3>
                            <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                                Continuous auto-playing immersive pet wellness short videos.
                            </p>
                        </div>
                    </div>

                    {/* Layout switcher */}
                    <div className="flex items-center bg-stone-900/80 p-0.5 rounded-lg border border-stone-850/75 select-none self-start sm:self-auto">
                        {(["marquee", "carousel", "grid"] as const).map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => setLayout(opt)}
                                className={`text-[9.5px] font-mono uppercase font-black px-3 py-1.5 rounded-md transition cursor-pointer ${layout === opt ? "bg-teal-600 text-white shadow-sm" : "text-stone-450 hover:text-stone-200"
                                    }`}
                            >
                                {opt === "marquee" ? "Infinite Tape 🍿" : opt === "carousel" ? "Carousel 🎠" : "Compact Grid 🖥️"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Marquee layout ── */}
                {layout === "marquee" && (
                    <div className="relative w-full overflow-hidden py-4">
                        <style>{`
              @keyframes marquee-scroll {  0% { transform: translate3d(0, 0, 0); }
                  100% { transform: translate3d(-50%, 0, 0); }}
              .reels-marquee { display:flex; gap:1.5rem; width:max-content; animation:marquee-scroll 32s linear infinite; }
              .reels-marquee:hover { animation-play-state:paused; }
            `}</style>
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-stone-950 to-transparent z-20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-stone-950 to-transparent z-20 pointer-events-none" />
                        <div className="reels-marquee">
                            {[...reels, ...reels].map((reel, idx) => (
                                <ReelCard key={`${reel.id}-m-${idx}`} reel={reel} onOpen={openReel} extraClass="w-[180px] sm:w-[210px] shrink-0" />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Carousel layout ── */}
                {layout === "carousel" && (
                    <div className="relative group/carousel">
                        <button
                            type="button"
                            onClick={() => scrollCarousel("prev")}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 bg-stone-900/90 hover:bg-teal-900 border border-stone-800 text-white rounded-full p-2.5 transition shadow-lg hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
                        >
                            <ChevronLeft className="h-4.5 w-4.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollCarousel("next")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 bg-stone-900/90 hover:bg-teal-900 border border-stone-800 text-white rounded-full p-2.5 transition shadow-lg hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
                        >
                            <ChevronRight className="h-4.5 w-4.5" />
                        </button>
                        <div
                            ref={carouselRef}
                            className="flex gap-5 overflow-x-auto scrollbar-none py-4 scroll-smooth snap-x snap-mandatory"
                        >
                            {reels.map((reel) => (
                                <ReelCard key={`${reel.id}-c`} reel={reel} onOpen={openReel} extraClass="w-[200px] sm:w-[230px] shrink-0 snap-start" />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Grid layout ── */}
                {layout === "grid" && (
                    <div className="relative">
                        <div className="flex md:hidden items-center justify-between px-1 mb-2 text-[#A1A1AA] text-[9px] uppercase tracking-wider font-mono">
                            <span>◀ Swipe Story Reel ▶</span>
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-750" />
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-750" />
                            </span>
                        </div>
                        <div
                            ref={mobileGridRef}
                            className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none md:grid-cols-6 gap-4 py-4 md:py-2 px-1 scrollbar-none scroll-smooth select-none"
                        >
                            {reels.map((reel) => (
                                <ReelCard
                                    key={`${reel.id}-g`}
                                    reel={reel}
                                    onOpen={openReel}
                                    extraClass="w-[150px] sm:w-[180px] md:w-auto shrink-0 md:shrink snap-start"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Reel modal ── */}
            {selectedReel && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 md:p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm"
                        onClick={() => setSelectedReel(null)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white text-stone-900 rounded-3xl overflow-hidden max-w-4xl w-full h-[85vh] md:h-[650px] lg:h-[700px] max-h-[90vh] md:max-h-[85vh] flex flex-col md:flex-row shadow-2xl border border-stone-200/90 z-10">


                        {/* Close */}
                        <button
                            type="button"
                            onClick={() => setSelectedReel(null)}
                            className="absolute top-4 right-4 z-50 bg-stone-950/80 hover:bg-stone-900 text-white rounded-full p-2 transition active:scale-95 shadow border border-stone-800"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Video area */}
                        <div className="w-full md:w-[420px] lg:w-[450px] shrink-0 bg-stone-950 flex items-center justify-center relative h-[45vh] md:h-full">
                            {/* Nav arrows */}
                            {(["prev", "next"] as const).map((dir) => (
                                <button
                                    key={dir}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); navigateReel(dir); }}
                                    className={`absolute ${dir === "prev" ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 z-30 bg-stone-950/80 hover:bg-teal-900 border border-stone-800 hover:border-teal-500 text-white p-2.5 rounded-full transition shadow-lg cursor-pointer hover:scale-105 active:scale-95`}
                                >
                                    {dir === "prev" ? <ChevronLeft className="h-4.5 w-4.5" /> : <ChevronRight className="h-4.5 w-4.5" />}
                                </button>
                            ))}

                            {selectedReel.instagramEmbedCode ? (
                                <div className="w-full h-full flex items-center justify-center overflow-y-auto p-4">
                                    <div
                                        className="w-full max-w-sm mx-auto bg-white rounded-2xl p-2 origin-center scale-[0.8] sm:scale-90 md:scale-95"
                                        dangerouslySetInnerHTML={{ __html: selectedReel.instagramEmbedCode }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        src={selectedReel.videoUrl}
                                        autoPlay={isPlaying}
                                        loop
                                        muted={muted}
                                        className="w-full h-full object-contain max-h-full bg-stone-950 cursor-pointer"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        onTimeUpdate={(e) => {
                                            const video = e.currentTarget;
                                            if (video.duration) {
                                                setReelProgress((video.currentTime / video.duration) * 100);
                                            }
                                        }}
                                    />
                                    {!isPlaying && (
                                        <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center pointer-events-none">
                                            <div className="bg-white/95 p-4 rounded-full shadow-xl">
                                                <Play className="h-6 w-6 fill-current text-teal-850" />
                                            </div>
                                        </div>
                                    )}
                                    {/* Progress bar */}
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-800 z-20">
                                        <div
                                            className="h-full bg-teal-400 transition-all duration-150"
                                            style={{ width: `${reelProgress}%` }}
                                        />
                                    </div>
                                    {/* Volume toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setMuted(!muted)}
                                        className="absolute bottom-4 right-4 z-20 bg-stone-950/80 hover:bg-stone-900 text-white rounded-xl p-2.5 border border-stone-805 transition active:scale-95"
                                    >
                                        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </button>
                                </>
                            )}

                            {/* Position indicator */}
                            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                                <span className="bg-stone-950/80 border border-stone-800 text-amber-300 font-mono text-[9px] px-2 py-1 rounded-xl">
                                    {selectedReel.views} views
                                </span>
                                <span className="bg-teal-900/85 border border-teal-850/60 text-teal-200 font-mono text-[9px] px-2 py-1 rounded-xl font-bold">
                                    {reels.findIndex((r) => r.id === selectedReel.id) + 1} of {reels.length}
                                </span>
                            </div>
                        </div>

                        {/* Info panel */}
                        <div className="flex-1 bg-[#FAF9F5] border-t md:border-t-0 md:border-l border-stone-200/60 p-5 md:p-6 flex flex-col justify-between h-[40vh] md:h-full min-h-0">

                            {/* Author Row (Fixed top) */}
                            <div className="flex items-center gap-3 pb-3.5 border-b border-stone-200 shrink-0">
                                <img
                                    src={selectedReel.authorAvatar}
                                    alt=""
                                    className="h-10 w-10 rounded-full object-cover border border-stone-200 shrink-0"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-sans font-black text-xs text-stone-900">@{selectedReel.authorName}</span>
                                        <span className="h-1.5 w-1.5 rounded-full bg-teal-600 shrink-0" />
                                    </div>
                                    <span className="text-[10px] text-stone-450 block font-mono font-medium">
                                        {selectedReel.location || "Instagram Community"}
                                    </span>
                                </div>
                            </div>

                            {/* Scrollable Caption + Comments area */}
                            <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0 scrollbar-thin">
                                <div className="flex gap-3 text-xs leading-relaxed">
                                    <img src={selectedReel.authorAvatar} alt="" className="h-7 w-7 rounded-full object-cover border border-stone-200 shrink-0" />
                                    <div>
                                        <p className="text-stone-900 font-sans">
                                            <span className="font-extrabold mr-1.5 text-stone-950">@{selectedReel.authorName}</span>
                                            {selectedReel.caption}
                                        </p>
                                        <span className="text-[9px] text-stone-400 font-mono block mt-1.5">Official Curation</span>
                                    </div>
                                </div>

                                {selectedReel.comments.map((c, i) => (
                                    <div key={i} className="flex gap-3 text-xs leading-normal">
                                        <div className="h-7 w-7 rounded-full bg-stone-200 font-mono text-[9px] font-black flex items-center justify-center text-stone-650 uppercase border border-stone-300 shrink-0">
                                            {c.user.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-stone-850">
                                                <span className="font-bold mr-1.5 text-stone-900">@{c.user}</span>
                                                {c.text}
                                            </p>
                                            <span className="text-[9px] text-stone-405 font-mono block mt-0.5">{c.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Like bar (Fixed bottom) */}
                            <div className="border-t border-stone-200 pt-4 flex items-center justify-between text-stone-700 shrink-0">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleLike(selectedReel.id)}
                                        className="transition active:scale-[0.85]"
                                    >
                                        <Heart
                                            className={`h-5 w-5 ${selectedReel.hasLiked
                                                ? "fill-red-500 text-red-500 stroke-red-500"
                                                : "text-stone-800"
                                                }`}
                                        />
                                    </button>
                                    <span className="text-xs font-serif font-black text-stone-900">
                                        {selectedReel.likes.toLocaleString()} likes
                                    </span>
                                </div>
                                <span className="text-[9px] text-stone-400 font-mono font-bold uppercase tracking-wider">
                                    Verified Bio-Match
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}