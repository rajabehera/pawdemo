import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Sparkles, Bot, Search, CloudSun, Thermometer, Info, 
  Check, ChevronDown, RefreshCw, ShoppingBag, Coffee, Star, 
  Flame, Award, ThumbsUp, HelpCircle, User, Activity, ShieldCheck, Outdent, ChevronRight
} from "lucide-react";
import { Product } from "../types";

interface Message {
  role: "user" | "assistant";
  text: string;
  isRecipe?: boolean;
  recipeDetails?: {
    name: string;
    benefits: string[];
    calories: string;
    vetNote: string;
    products: string[]; // product IDs to recommend
  };
  productRecs?: Product[];
}

interface AICoachPageProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
  onSelectProduct: (product: Product) => void;
  onSelectView: (view: any) => void;
}

// Breeds for custom intelligence dropdown
const DOG_BREEDS = [
  { name: "Golden Retriever", size: "Large", coat: "Thick Long Double" },
  { name: "Pug", size: "Small", coat: "Short Single" },
  { name: "Labrador", size: "Large", coat: "Short Dense" },
  { name: "GSD (German Shepherd)", size: "Large", coat: "Thick Double" },
  { name: "Shih Tzu", size: "Small", coat: "Very Long Double" },
  { name: "Poodle", size: "Medium", coat: "Curly Hypoallergenic" },
  { name: "Beagle", size: "Small", coat: "Short Dense" },
  { name: "Rottweiler", size: "Large", coat: "Short Thick Double" },
  { name: "Boxer", size: "Large", coat: "Short Single" },
  { name: "Cocker Spaniel", size: "Medium", coat: "Silky Wavy Double" },
  { name: "Siberian Husky", size: "Large", coat: "Ultra-Thick Polar Double" },
  { name: "Great Dane", size: "Giant", coat: "Short Smooth" },
  { name: "Dachshund", size: "Small", coat: "Smooth/Wirehaired" },
  { name: "Pomeranian", size: "Small", coat: "Extremely Fluffy Double" },
  { name: "French Bulldog", size: "Small", coat: "Short Fine" },
  { name: "Chihuahua", size: "Toy", coat: "Very Short Fine" },
  { name: "Doberman Pinscher", size: "Large", coat: "Smooth Sleek" },
  { name: "Lhasa Apso", size: "Small", coat: "Heavy Dense Double" },
  { name: "Pitbull / Guard Mix", size: "Medium", coat: "Short Stiff" },
  { name: "Saint Bernard", size: "Giant", coat: "Thick Massive Double" },
  { name: "Chow Chow", size: "Large", coat: "Dense lion-like Rough" },
  { name: "Maltese", size: "Toy", coat: "Silky Long Crest" },
  { name: "Indie / Mixed Breed", size: "Medium", coat: "Short Climate Adaptive" }
];

const CAT_BREEDS = [
  { name: "Persian Cat", size: "Medium", coat: "Extremely Fluffy" },
  { name: "Siamese Cat", size: "Medium", coat: "Sleek Short" },
  { name: "Bengal Cat", size: "Medium", coat: "Sleek Spotted" },
  { name: "Indie Fluffy", size: "Medium", coat: "Plush Double" },
  { name: "Ragdoll", size: "Large", coat: "Silky Semi-Long" },
  { name: "Maine Coon", size: "Large", coat: "Shaggy Weatherproof Double" },
  { name: "British Shorthair", size: "Medium", coat: "Dense Plush Single" },
  { name: "Sphynx Cat", size: "Medium", coat: "Hairless Velvety Sensitive" },
  { name: "Scottish Fold", size: "Medium", coat: "Short Dense Elastic" },
  { name: "Russian Blue", size: "Medium", coat: "Silky Dense Double" },
  { name: "Birman Cat", size: "Medium", coat: "Silky Long Single" },
  { name: "Abyssinian Cat", size: "Medium", coat: "Short Ticked Single" }
];

export interface IndianCityConfig {
  city: string;
  lat: number;
  lon: number;
  tier: "Tier 1 (Metro)" | "Tier 2 (Emerging)" | "Tier 3 (Growing)";
  temp: string;
  icon: string;
  warning: string;
  index: string;
}

export const INDIAN_CITIES: IndianCityConfig[] = [
  // Tier 1
  { city: "Mumbai", lat: 19.0760, lon: 72.8777, tier: "Tier 1 (Metro)", temp: "31°C", icon: "🌧️", warning: "High coastal humidity! Dry paws after walks to prevent fungal infections.", index: "Humid" },
  { city: "New Delhi", lat: 28.7041, lon: 77.1025, tier: "Tier 1 (Metro)", temp: "42°C", icon: "☀️", warning: "Intense direct heat waves! Keep cooling water fountains running.", index: "Critical" },
  { city: "Bangalore", lat: 12.9716, lon: 77.5946, tier: "Tier 1 (Metro)", temp: "24°C", icon: "☁️", warning: "Lush mild climate. Perfect for lightweight style outfits and outdoor play.", index: "Mild" },
  { city: "Hyderabad", lat: 17.3850, lon: 78.4867, tier: "Tier 1 (Metro)", temp: "34°C", icon: "☀️", warning: "Dry hot weather waves. Ensure ample hydration and wet towel wipes.", index: "High" },
  { city: "Ahmedabad", lat: 23.0225, lon: 72.5714, tier: "Tier 1 (Metro)", temp: "38°C", icon: "☀️", warning: "Extreme dry heat! Restrict outdoor exercise during peak sun hours.", index: "High" },
  { city: "Chennai", lat: 13.0827, lon: 80.2707, tier: "Tier 1 (Metro)", temp: "36°C", icon: "☀️", warning: "Intense seaside humidity & heat. Keep pets in shade or AC rooms.", index: "Critical" },
  { city: "Kolkata", lat: 22.5726, lon: 88.3639, tier: "Tier 1 (Metro)", temp: "33°C", icon: "🌧️", warning: "Sultry monsoonal climate. Check coat frequently for skin ticks and fleas.", index: "Humid" },
  { city: "Pune", lat: 18.5204, lon: 73.8567, tier: "Tier 1 (Metro)", temp: "28°C", icon: "☁️", warning: "Balanced moderate climate. Ideal for daily coat brushing and grooming.", index: "Moderate" },

  // Tier 2
  { city: "Bhubaneswar", lat: 20.2961, lon: 85.8245, tier: "Tier 2 (Emerging)", temp: "39°C", icon: "☀️", warning: "Extreme heat advisory! Keep pets hydrated & avoid direct noon walks.", index: "High" },
  { city: "Jaipur", lat: 26.9124, lon: 75.7873, tier: "Tier 2 (Emerging)", temp: "37°C", icon: "☀️", warning: "Arid desert winds. Watch out for nose drying and eye irritation.", index: "High" },
  { city: "Lucknow", lat: 26.8467, lon: 80.9462, tier: "Tier 2 (Emerging)", temp: "35°C", icon: "☀️", warning: "Subtropical dry summer. Cool foot baths and hydration diets advised.", index: "Moderate" },
  { city: "Nagpur", lat: 21.1458, lon: 79.0882, tier: "Tier 2 (Emerging)", temp: "41°C", icon: "☀️", warning: "Heavy central plains heat! High risk of heat distress for flat-nosed pets.", index: "Critical" },
  { city: "Bhopal", lat: 23.2599, lon: 77.4126, tier: "Tier 2 (Emerging)", temp: "34°C", icon: "☀️", warning: "Dry interior temperatures. Feed cucumbers or watermelon without seeds.", index: "Moderate" },
  { city: "Indore", lat: 22.7196, lon: 75.8577, tier: "Tier 2 (Emerging)", temp: "32°C", icon: "☁️", warning: "Mild daytime heat. Keep pet activities indoors in well-ventilated areas.", index: "Moderate" },
  { city: "Kochi", lat: 9.9312, lon: 76.2673, tier: "Tier 2 (Emerging)", temp: "29°C", icon: "🌧️", warning: "Severe tropical monsoon. Keep paws clean and use anti-bacterial dog boots.", index: "Humid" },
  { city: "Visakhapatnam", lat: 17.6868, lon: 83.2185, tier: "Tier 2 (Emerging)", temp: "33°C", icon: "☀️", warning: "Humid sea-breezes. Keep thick-coated dogs trimmed to avoid hot spots.", index: "Humid" },
  { city: "Patna", lat: 25.5941, lon: 85.1376, tier: "Tier 2 (Emerging)", temp: "35°C", icon: "☀️", warning: "High heat index. Avoid high-protein thermal warming diets.", index: "Moderate" },
  { city: "Vadodara", lat: 22.3072, lon: 73.1812, tier: "Tier 2 (Emerging)", temp: "36°C", icon: "☀️", warning: "Intense western heat. Restrict heavy play to early mornings.", index: "High" },
  { city: "Coimbatore", lat: 11.0168, lon: 76.9558, tier: "Tier 2 (Emerging)", temp: "27°C", icon: "☁️", warning: "Favorable wind cooling. Excellent climate for healthy outdoor runs.", index: "Mild" },
  { city: "Agra", lat: 27.1767, lon: 78.0081, tier: "Tier 2 (Emerging)", temp: "38°C", icon: "☀️", warning: "Sultry plains temperatures. Keep cooling gels and wet towels handy.", index: "High" },

  // Tier 3
  { city: "Udaipur", lat: 24.5854, lon: 73.7125, tier: "Tier 3 (Growing)", temp: "33°C", icon: "☀️", warning: "Warm lake winds. Refresh water bowls three times daily.", index: "Moderate" },
  { city: "Dehradun", lat: 30.3165, lon: 78.0322, tier: "Tier 3 (Growing)", temp: "23°C", icon: "☁️", warning: "Comfortable foothill breezes. Add vitamins for active grooming vitality.", index: "Mild" },
  { city: "Shimla", lat: 31.1048, lon: 77.1734, tier: "Tier 3 (Growing)", temp: "14°C", icon: "❄️", warning: "Chilly high altitude waves! Layer heavy fleece coats and insulate beds.", index: "Cold" },
  { city: "Jammu", lat: 32.7266, lon: 74.8570, tier: "Tier 3 (Growing)", temp: "26°C", icon: "☁️", warning: "Variable temperatures. Brushing undercoat preserves thermal balance.", index: "Moderate" },
  { city: "Shillong", lat: 25.5788, lon: 91.8833, tier: "Tier 3 (Growing)", temp: "16°C", icon: "❄️", warning: "Very high rainfall and scenic wet winds. Beware of tick propagation.", index: "Cold" },
  { city: "Alleppey", lat: 9.4981, lon: 76.3388, tier: "Tier 3 (Growing)", temp: "29°C", icon: "🌧️", warning: "Lush tropical backwaters humidity. Guard ears against mold colonies.", index: "Humid" },
  { city: "Amravati", lat: 20.9320, lon: 77.7523, tier: "Tier 3 (Growing)", temp: "35°C", icon: "☀️", warning: "Subtropical dry soil heating. Avoid concrete tar walks to prevent pad burns.", index: "High" },
  { city: "Gwalior", lat: 26.2183, lon: 78.1828, tier: "Tier 3 (Growing)", temp: "37°C", icon: "☀️", warning: "High sand-dust content. Clean pet nasal cavities and eyes after strolls.", index: "High" },
  { city: "Ajmer", lat: 26.4498, lon: 74.6399, tier: "Tier 3 (Growing)", temp: "35°C", icon: "☀️", warning: "Desiccating desert heat waves. Protect thin ears from sunburn.", index: "High" },
  { city: "Tirupati", lat: 13.6288, lon: 79.4192, tier: "Tier 3 (Growing)", temp: "34°C", icon: "☀️", warning: "Sultry southern sun. Recommend light grooming and cold cucumber treats.", index: "Moderate" },
  { city: "Kozhikode", lat: 11.2588, lon: 75.7804, tier: "Tier 3 (Growing)", temp: "30°C", icon: "🌧️", warning: "High monsoon showers. Keep coat dry under blow-spin dryers.", index: "Humid" },
  { city: "Pondicherry", lat: 11.9416, lon: 79.8083, tier: "Tier 3 (Growing)", temp: "32°C", icon: "☀️", warning: "Cozy coast beaches. Guard paws from stinging salt sands.", index: "Moderate" }
];

// Weather locations for climate intelligence (quick presets)
const CLIMATE_PRESETS = [
  INDIAN_CITIES[8],  // Bhubaneswar
  INDIAN_CITIES[0],  // Mumbai
  INDIAN_CITIES[1],  // New Delhi
  INDIAN_CITIES[2],  // Bangalore
  INDIAN_CITIES[22]  // Shimla
];

// Categories of structured predefined queries
const QUERY_CATEGORIES = [
  {
    id: "recipes",
    label: "🍲 Smart Recipes & Nutrition",
    items: [
      { text: "Summer recipes for dogs ☀️", type: "recipe", breed: "Dog" },
      { text: "Cooling treats for cats 🐱", type: "recipe", breed: "Cat" },
      { text: "Pumpkin recipes for digestion 🎃", type: "recipe", breed: "Dog" },
      { text: "Protein-rich meal for puppies 🍼", type: "recipe", breed: "Dog" }
    ]
  },
  {
    id: "grooming",
    label: "✂️ Professional Grooming Tips",
    items: [
      { text: "Best grooming routine for Golden Retrievers 🧴", breed: "Dog" },
      { text: "Cat grooming tips & hairball reduction 🐱", breed: "Cat" },
      { text: "How to reduce excessive shedding ✂️", breed: "Any" },
      { text: "DIY healing paw cleaning at home 🐾", breed: "Any" }
    ]
  },
  {
    id: "shopping",
    label: "👗 Personalised Luxury Shopping",
    items: [
      { text: "Suggest outfits for hot summers 👗", breed: "Any" },
      { text: "Travel essentials for pets on flights ✈️", breed: "Any" },
      { text: "Recommend products for a fluffy dog 🐩", breed: "Dog" },
      { text: "Build a premium monsoon care kit 🌧️", breed: "Any" }
    ]
  },
  {
    id: "engagement",
    label: "📸 Social Media & Fun Vibes",
    items: [
      { text: "Roast my dog lovingly 🔥", breed: "Dog" },
      { text: "Generate a royal title for my pet 👑", breed: "Any" },
      { text: "Write an Instagram caption for my sleepy cat 📸", breed: "Cat" },
      { text: "Write pet wedding invitation 💌", breed: "Any" }
    ]
  }
];

export function AICoachPage({ products, onAddToCart, onSelectProduct, onSelectView }: AICoachPageProps) {
  const [selectedBreedType, setSelectedBreedType] = useState<"Dog" | "Cat">("Dog");
  const [activeBreedName, setActiveBreedName] = useState("Golden Retriever");
  const [climate, setClimate] = useState(CLIMATE_PRESETS[0]);
  const [pastedTemp, setPastedTemp] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Woof and Meow! ✨ Welcome to your ultra-premium **Pawwcious AI Coach**. I am PawBuddy, trained extensively on pet nutrition, boutique grooming, and luxury styling. Ask me about custom recipes, summer care, or appropriate outfits for high-status pets!"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatCategory, setChatCategory] = useState("recipes");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    let isMounted = true;
    const fetchRealtimeTemp = async () => {
      setIsWeatherLoading(true);
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${climate.lat}&longitude=${climate.lon}&current=temperature_2m`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (data && data.current && data.current.temperature_2m !== undefined && isMounted) {
          const tempVal = Math.round(data.current.temperature_2m);
          let dynamicIcon = "☀️";
          if (tempVal < 18) dynamicIcon = "❄️";
          else if (tempVal > 35) dynamicIcon = "🔥";
          else if (tempVal > 28) dynamicIcon = "☀️";
          else dynamicIcon = "☁️";

          setClimate(prev => {
            if (prev.city === climate.city) {
              return {
                ...prev,
                temp: `${tempVal}°C`,
                icon: dynamicIcon
              };
            }
            return prev;
          });
        }
      } catch (e) {
        console.warn("Using fallback static temperature for", climate.city, e);
      } finally {
        if (isMounted) setIsWeatherLoading(false);
      }
    };

    fetchRealtimeTemp();
    return () => { isMounted = false; };
  }, [climate.city, climate.lat, climate.lon]);

  const getBreedDetails = () => {
    const list = selectedBreedType === "Dog" ? DOG_BREEDS : CAT_BREEDS;
    return list.find(b => b.name === activeBreedName) || list[0];
  };

  // Helper mock parser to simulate structural responses or identify keyword triggers
  const executeQuery = async (queryText: string) => {
    if (isLoading) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", text: queryText }]);
    setIsLoading(true);

    const breedInfo = getBreedDetails();
    const queryLower = queryText.toLowerCase();

    // Prepare history and system context
    const currentHistory = messages.map(m => ({ role: m.role, text: m.text }));

    try {
      // Call our API Chatbot proxy
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Respond specifically for a ${breedInfo.name} (${breedInfo.size} size, ${breedInfo.coat} coat) residing in ${climate.city} (current weather is ${climate.temp}). Customize advice based on these. Question: ${queryText}`,
          history: currentHistory
        })
      });
      const data = await response.json();

      let textResult = data.text || "";
      let isRecipe = false;
      let recipeDetails = undefined;
      let matchedProducts: Product[] = [];

      // If it looks like a recipe request, format structured details card beautifully
      if (queryLower.includes("recipe") || queryLower.includes("treat") || queryLower.includes("smoothie") || queryLower.includes("meal")) {
        isRecipe = true;
        const isCat = queryLower.includes("cat");
        recipeDetails = {
          name: isCat ? "Cooling Arctic Salmon Jelly Treat (Premium Cat Formula)" : "Saffron Glow Hydration Bowl (Therapeutic Dog Energiser)",
          benefits: [
            isCat ? "Ultra-rich in hydration (+45% moisture boost)" : "Boosts skin cell metabolism and calms nervous system",
            "Soothes intestinal digestive tract during high monsoonal humidity",
            "Rich in bioactive raw organic antioxidants and amino acids"
          ],
          calories: isCat ? "42 kcal per serving" : "110 kcal per serving (low lipid index)",
          vetNote: "Approved by Pawwcious Clinical Council. Ensure ingredients are served at cold cellar temp, never ice cold to prevent larynx shock.",
          products: isCat ? ["furlush-serum", "squeakear-earwash"] : ["furbreeze-cooling-powder", "coffee-wood-chew"]
        };
      }

      // Check product matches to show inline shoppable elements
      if (queryLower.includes("grooming") || queryLower.includes("shampoo") || queryLower.includes("bath") || queryLower.includes("wash") || queryLower.includes("shedding") || queryLower.includes("powder") || queryLower.includes("ears")) {
        matchedProducts = products.filter(p => p.category === "grooming-hygiene" || p.category === "coat-skin-wellness");
      } else if (queryLower.includes("multivitamin") || queryLower.includes("diet") || queryLower.includes("food") || queryLower.includes("supplement") || queryLower.includes("nourish") || queryLower.includes("salmon") || queryLower.includes("recipe") || queryLower.includes("treat") || queryLower.includes("coat") || queryLower.includes("skin") || queryLower.includes("serum") || queryLower.includes("shine")) {
        matchedProducts = products.filter(p => p.category === "coat-skin-wellness");
      } else if (queryLower.includes("chew") || queryLower.includes("wood") || queryLower.includes("enrichment") || queryLower.includes("bed") || queryLower.includes("sleep") || queryLower.includes("comfort") || queryLower.includes("monsoon") || queryLower.includes("summer")) {
        matchedProducts = products.filter(p => p.category === "chew-enrichment" || p.category === "grooming-hygiene");
      } else {
        // Fallback matching
        matchedProducts = products.slice(0, 2);
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: textResult || "I apologize, my purr-fect response was cut short. How else can I assist your fluffy child today? 🐾",
          isRecipe,
          recipeDetails,
          productRecs: matchedProducts
        }
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Oops, a small connection hairball! However, based on my luxury database, always ensure raw foods are supplemented with essential salmon oils. Please try that question again! 🐾"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    const val = inputVal.trim();
    setInputVal("");
    (window as any).showToast?.("Wellness prompt processed successfully! 🐾", "success");
    executeQuery(val);
  };

  const handlePresetClimate = (idx: number) => {
    setClimate(CLIMATE_PRESETS[idx]);
  };

  const currentBreedInfo = getBreedDetails();

  return (
    <div id="ai-coach-page-wrapper" className="max-w-6xl mx-auto space-y-12 font-sans pb-8 sm:pb-12">
      
      {/* Visual Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-stone-900 border border-teal-100 dark:border-teal-900/40 text-teal-850 dark:text-teal-400">
          <Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider font-semibold uppercase">Elite Generative Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif italic text-stone-955 dark:text-stone-100 tracking-wide leading-tight mt-1">
          Pawwcious AI Wellness Suite 🐾
        </h1>
        <div className="h-[1px] w-12 bg-amber-500/40 mx-auto my-3" />
        <p className="text-xs sm:text-sm text-stone-550 dark:text-stone-400 leading-relaxed max-w-lg mx-auto">
          Harnessing advanced veterinary models to formulate bespoke recipes, pinpoint tailored couture sizes, and deliver elite grooming tutorials.
        </p>
      </div>

      {/* Grid: 2 columns on large screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Customizer Panel for Breed & Weather Context */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* 1. Pet / Breed customizer */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-teal-850" />
              1. Breed Profile Context
            </h3>
            
            <div className="flex gap-2 bg-stone-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => { setSelectedBreedType("Dog"); setActiveBreedName("Golden Retriever"); }}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all ${selectedBreedType === "Dog" ? "bg-white text-teal-800 shadow-xs" : "text-stone-500 hover:text-stone-900"}`}
              >
                Canine 🐶
              </button>
              <button
                type="button"
                onClick={() => { setSelectedBreedType("Cat"); setActiveBreedName("Persian Cat"); }}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all ${selectedBreedType === "Cat" ? "bg-white text-teal-800 shadow-xs" : "text-stone-500 hover:text-stone-900"}`}
              >
                Feline 🐱
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-mono tracking-wide">Select Premium Breed:</label>
              <div className="relative">
                <select
                  value={activeBreedName}
                  onChange={(e) => setActiveBreedName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-250 text-stone-900 font-bold text-xs rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer"
                >
                  {(selectedBreedType === "Dog" ? DOG_BREEDS : CAT_BREEDS).map((b) => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-3.5 w-3.5 text-stone-500 pointer-events-none" />
              </div>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-xl space-y-1 border border-stone-150 text-[11px]">
              <div className="flex justify-between">
                <span className="text-stone-400">Biological Size:</span>
                <span className="font-bold text-stone-800">{currentBreedInfo.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Fur Undercoat:</span>
                <span className="font-bold text-stone-800">{currentBreedInfo.coat}</span>
              </div>
            </div>
          </div>

          {/* 2. Weather & Climate Simulator */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <CloudSun className="h-4 w-4 text-amber-500" />
              2. Climate Smart Intel
            </h3>

            {/* Quick Presets row */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-stone-400 font-mono tracking-wide">Quick Presets:</label>
              <div className="flex flex-wrap gap-1.5">
                {CLIMATE_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.city}
                    type="button"
                    onClick={() => handlePresetClimate(idx)}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${climate.city === preset.city ? "bg-amber-500/10 text-amber-800 border-amber-300" : "bg-stone-100 border-stone-200 text-stone-605"}`}
                  >
                    {preset.icon} {preset.city} ({climate.city === preset.city ? climate.temp : preset.temp})
                  </button>
                ))}
              </div>
            </div>

            {/* Comprehensive Tier 1, 2, 3 Indian City Selector Dropdown */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-stone-400 font-mono tracking-wide">Detailed City Lookup (Tier 1, 2, 3):</label>
                {isWeatherLoading && (
                  <span className="text-[9.5px] text-teal-650 flex items-center gap-1 font-bold animate-pulse">
                    <RefreshCw className="h-3 w-3 animate-spin text-teal-600" />
                    <span>Live Temp...</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <select
                  value={climate.city}
                  onChange={(e) => {
                    const matched = INDIAN_CITIES.find(c => c.city === e.target.value);
                    if (matched) {
                      setClimate(matched);
                    }
                  }}
                  className="w-full bg-stone-50 border border-stone-250 text-stone-900 font-bold text-xs rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer"
                >
                  <optgroup label="Tier 1 - Metropolitan Hubs">
                    {INDIAN_CITIES.filter(c => c.tier === "Tier 1 (Metro)").map((c) => (
                      <option key={c.city} value={c.city}>
                        🌇 {c.city} — {c.city === climate.city ? climate.temp : c.temp}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tier 2 - Emerging Cities">
                    {INDIAN_CITIES.filter(c => c.tier === "Tier 2 (Emerging)").map((c) => (
                      <option key={c.city} value={c.city}>
                        🏙️ {c.city} — {c.city === climate.city ? climate.temp : c.temp}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tier 3 - Growing Centers">
                    {INDIAN_CITIES.filter(c => c.tier === "Tier 3 (Growing)").map((c) => (
                      <option key={c.city} value={c.city}>
                        🏡 {c.city} — {c.city === climate.city ? climate.temp : c.temp}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-3.5 w-3.5 text-stone-500 pointer-events-none" />
              </div>
            </div>

            {/* Smart dynamic warning card */}
            <div className="bg-teal-50/60 border border-teal-100 p-3 rounded-xl space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-teal-800 mb-1">
                <Thermometer className="h-3.5 w-3.5 text-teal-700" />
                <span>Smart Warning: {climate.city} (Active: {climate.temp})</span>
              </div>
              <p className="text-teal-905 leading-relaxed font-medium">{climate.warning}</p>
            </div>
          </div>

          {/* Prompt template tips */}
          <div className="p-3.5 bg-yellow-50/50 border border-yellow-150 rounded-xl space-y-1">
            <h4 className="text-[10px] font-mono tracking-wider font-extrabold text-amber-800 uppercase flex items-center gap-1">
              <Info className="h-3 w-3 text-amber-600" />
              Real-time synchronization
            </h4>
            <p className="text-[10px] text-stone-500 leading-relaxed leading-normal">
              Any query clicked on the right will instantly combine with your <strong>{currentBreedInfo.name}</strong> profile + the weather at <strong>{climate.city}</strong> for ultra-tailored clinical formulations.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Chat Engine + Predefined Triggers */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main conversation pane */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden translate-y-0">
            
            {/* Header segment of Chat */}
            <div className="bg-stone-50 border-b border-stone-150 px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-bold font-sans text-stone-800">
                  Conversation with PawBuddy Specialist AI
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMessages([
                  {
                    role: "assistant",
                    text: "Greetings initiated! Ready to construct further nutritional formulas or wardrobe size ideas. What can I address? 🐾"
                  }
                ])}
                className="text-[10px] text-stone-400 font-mono hover:text-stone-600 flex items-center gap-1 font-bold"
              >
                <RefreshCw className="h-3 w-3" />
                Clear Chat
              </button>
            </div>

            {/* Scrollable messages Body */}
            <div 
              id="ai-coach-messages-panel"
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F5]/40"
            >
              {messages.map((m, idx) => (
                <div key={idx} className="space-y-3.5">
                  <div className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    
                    {m.role === "assistant" && (
                      <div className="h-8 w-8 rounded-xl bg-teal-850 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        🐾
                      </div>
                    )}

                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-teal-850 text-white shadow-xs rounded-tr-none"
                        : "bg-white text-stone-900 border border-stone-200 shadow-xs rounded-tl-none font-medium prose prose-stone max-w-none"
                    }`}>
                      
                      {/* Text */}
                      <div className="whitespace-pre-wrap font-sans">
                        {m.text}
                      </div>

                    </div>

                    {m.role === "user" && (
                      <div className="h-8 w-8 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        <User className="h-4 w-4" />
                      </div>
                    )}

                  </div>

                  {/* If assistant returned a recipe, display details analysis panel */}
                  {m.role === "assistant" && m.isRecipe && m.recipeDetails && (
                    <div className="ml-11 max-w-[85%] bg-teal-50/70 border border-teal-100 rounded-2xl p-4 space-y-3.5 shadow-xs animate-fade-in">
                      <div className="flex items-center gap-1.5 text-teal-900 font-extrabold text-xs">
                        <Coffee className="h-4 w-4 text-teal-850" />
                        <span>{m.recipeDetails.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="space-y-1">
                          <span className="text-stone-400 font-mono text-[10px] tracking-wide block uppercase font-bold">Nutritional Potency</span>
                          <ul className="space-y-1 text-stone-705 font-medium list-disc pl-3">
                            {m.recipeDetails.benefits.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1 bg-white/70 p-2.5 rounded-xl border border-teal-100/50">
                          <span className="text-stone-400 font-mono text-[10px] tracking-wide block uppercase font-bold">Caloric Index</span>
                          <p className="font-extrabold text-teal-850 text-xs mt-0.5">{m.recipeDetails.calories}</p>
                          <div className="mt-2 text-[10px] text-amber-705 bg-amber-50 rounded-lg p-1.5 flex gap-1 items-start leading-relaxed">
                            <ShieldCheck className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                            <span><strong>Note:</strong> {m.recipeDetails.vetNote}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inline Related Shoppable Products Grid */}
                  {m.role === "assistant" && m.productRecs && m.productRecs.length > 0 && (
                    <div className="ml-11 max-w-[85%] space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        Shop Suggested Formulations for your {currentBreedInfo.name}:
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {m.productRecs.map((prod) => (
                          <div 
                            key={prod.id} 
                            className="bg-white border border-stone-200 rounded-xl p-2.5 flex gap-2.5 items-center hover:shadow-xs transition duration-200"
                          >
                            <img 
                              src={prod.imageUrl} 
                              alt="" 
                              className="w-12 h-12 rounded-lg object-cover shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[11px] text-stone-900 truncate">{prod.name}</h4>
                              <p className="text-[10px] text-teal-850 font-mono font-bold">₹{prod.price}</p>
                              
                              <div className="flex gap-1.5 mt-1.5">
                                <button
                                  type="button"
                                  onClick={() => onSelectProduct(prod)}
                                  className="text-[9px] font-bold text-teal-850 hover:underline"
                                >
                                  Details
                                </button>
                                <span className="text-stone-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => onAddToCart(prod, prod.sizeVariants ? prod.sizeVariants[0] : "Standard")}
                                  className="text-[9px] font-bold text-stone-500 hover:text-stone-900 transition flex items-center gap-0.5"
                                >
                                  Add +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 pl-11 items-center text-[11px] text-stone-500 font-mono font-extrabold animate-pulse">
                  <span>🐾</span>
                  <span>PawBuddy is mixing custom vet recommendations...</span>
                </div>
              )}
            </div>

            {/* Footer Input form */}
            <form onSubmit={handleCustomSubmit} className="border-t border-stone-150 p-3 sm:p-4 bg-stone-50 flex gap-2.5 items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Ask PawBuddy AI about recipes, outfits, coat care for ${currentBreedInfo.name}...`}
                className="flex-1 bg-white border border-stone-200 text-stone-900 text-xs rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-teal-800 transition-all font-sans text-stone-950 font-medium"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="bg-teal-850 hover:bg-teal-900 disabled:opacity-50 text-white p-3.5 sm:px-5 sm:py-3 text-xs font-bold rounded-xl shadow-xs transition duration-250 flex items-center gap-1.5 shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Submit</span>
              </button>
            </form>

          </div>

          {/* PREDEFINED INTERACTIVE ACCORDIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest">
              Ready-made Instant Diagnostic Prompts
            </h3>

            {/* Horizontal categorization tabs */}
            <div className="flex gap-1 border-b border-stone-200 overflow-x-auto pb-1">
              {QUERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setChatCategory(cat.id)}
                  className={`text-xs py-2 px-3.5 font-bold border-b-2 whitespace-nowrap transition-all ${chatCategory === cat.id ? "border-teal-800 text-teal-800" : "border-transparent text-stone-500 hover:text-stone-900"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Selected category query chips */}
            <div id="ai-preset-query-chips" className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-fade-in">
              {QUERY_CATEGORIES.find(c => c.id === chatCategory)?.items.map((it, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => executeQuery(it.text)}
                  className="text-left bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-xs text-stone-800 hover:bg-teal-50/40 hover:text-teal-900 hover:border-teal-200 font-sans font-bold flex items-center justify-between group transition duration-200"
                >
                  <span className="truncate pr-2">{it.text}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-teal-800 shrink-0 transition" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
