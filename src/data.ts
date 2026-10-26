import { Product, Category, Testimonial, Banner, Blog, Coupon, Review, ReviewReel, FreeGiftOption } from "./types";

export const fallbackCategories: Category[] = [
  {
    id: "grooming-hygiene",
    name: "Grooming & Hygiene Care",
    iconName: "Sparkles",
    description: "Daily wellness-focused hygiene essentials."
  },
  {
    id: "coat-skin-wellness",
    name: "Coat & Skin Wellness",
    iconName: "HeartPulse",
    description: "Functional nourishment for skin barrier and coat health."
  },
  {
    id: "chew-enrichment",
    name: "Natural Chew & Enrichment",
    iconName: "Bed",
    description: "Safe chewing alternatives supporting instinctive behavior and dental wellness."
  }
];

export const fallbackProducts: Product[] = [
  {
    id: "furbreeze-cooling-powder",
    name: "Furbreeze Heat Cooling Powder",
    tagline: "Instant prickly heat relief, sweat absorption & tick protection for Indian pets.",
    description: "Furbreeze is positioned here as a dry grooming step for ordinary coat freshness between baths. It does not replace bathing or appropriate care for overheating or a persistent skin concern.",
    category: "grooming-hygiene",
    price: 399,
    originalPrice: 399,
    stock: 75,
    rating: 4.8,
    reviewCount: 4,
    imageUrl: "/images/products/powder/coolingpowder_for_pets_1.webp",
    benefits: [
      "100% talc-free, safe organic cornstarch and arrowroot base",
      "Infused with therapeutic Vetiver (Khus) for natural botanical body cooling",
      "Monsoon-ready Neem extracts actively repel ticks, fleas, and dust mites",
      "Rapid sweat absorption prevents uncomfortable hot spots and yeast skin infections"
    ],
    usage: [
      "Gently sprinkle over your pet's body, avoiding eyes, nose, and open wounds",
      "Massage deep into the coat layers, especially underbelly, groin, and itchy paw pads",
      "Apply before heading out on afternoon walks or after damp rainy turf potty runs",
      "Use 2-3 times weekly, or daily during peak Indian summer heatwaves"
    ],
    isBestSeller: true,
    sizeVariants: ["150g (Fixed Bottle Size)"]
  },
  {
    id: "squeakear-earwash",
    name: "Squeakear Earwash",
    tagline: "Gentle non-stinging ear cleanser to clear moisture, dirt, wax & prevent yeast infections.",
    description: "Pawwcious Squeakear Earwash is designed to make routine dog ear care easier to follow. Use it when cleaning is appropriate, follow the final label directions, and pay attention to how your dog responds. It is a grooming cleanser, not a treatment for ear disease.",
    category: "grooming-hygiene",
    price: 399,
    originalPrice: 399,
    stock: 55,
    rating: 4.9,
    reviewCount: 3,
    imageUrl: "/images/products/earwash/pets_ear_wash_1.webp",
    benefits: [
      "Instantly dries out excess moisture from ear canals post-bath or monsoon walkies",
      "pH-balanced (neutral 6.8 - 7.2) to prevent irritating, painful stinging",
      "Antibacterial Tea Tree Oil shields against opportunistic Malassezia ear yeast",
      "Deodorizes persistent musty ear canal smells with a fresh clean scent"
    ],
    usage: [
      "Apply 4-6 drops of Squeakear Earwash directly into your pet's ear canal",
      "Gently massage the base of the ear for 30 seconds to dissolve deep wax buildup",
      "Let your pet shake their head naturally to flush out dissolved residue",
      "Wipe the outer ear flap gently using a sterile cotton pad or clean cloth"
    ],
    isBestSeller: true,
    sizeVariants: ["100 ml (Fixed Bottle Size)"]
  },
  {
    id: "furlush-serum",
    name: "Furlush Serum",
    tagline: "Luxury Ayurvedic coat shine serum to control heavy hairfall, dander & UV damage.",
    description: "Conquer heavy seasonal hair shedding and dry skin flakes under the intense Indian sun. Furlush Serum is an ultra-premium coat nourishing spray crafted with pure Moroccan argan oil, sweet almond oil, and Ayurvedic Bhringraj. It instantly detangles dry triple-coats, strengthens root follicles to curb hairfall by 85%, and forms a lightweight UV barrier. Delicately scented with premium therapeutic-grade Sandalwood oil.",
    category: "coat-skin-wellness",
    price: 499,
    originalPrice: 499,
    stock: 42,
    rating: 4.7,
    reviewCount: 5,
    imageUrl: "/images/products/serum/Serum_for_pets_7.png",
    benefits: [
      "Reduces daily home shedding, pet dander, and flying fur dramatically within 10 days",
      "Ayurvedic Bhringraj and Amla strengthen active hair follicles from the root",
      "Shields outer pet fur coat from thermal heat, wind dust, and intense UV rays",
      "Completely non-greasy, non-sticky premium mist that won't stain carpets or couches"
    ],
    usage: [
      "Mist lightly across your pet's dry coat from a distance of 8-10 inches",
      "Gently brush through the fur with a slicker brush or comb in the direction of hair growth",
      "Focus heavily on friction-prone areas like behind ears, elbows, and pants to de-matt",
      "Use daily during heavy spring/monsoon shedding cycles or after warm bath sessions"
    ],
    isBestSeller: true,
    sizeVariants: ["100 ml (Fixed Bottle Size)"]
  },
  {
    id: "coffee-wood-chew",
    name: "Pawwcious Coffee Wood Chew",
    tagline: "Sustainably sourced Nilgiri forest wood teeth flosser & stress buster.",
    description: "Prevent destructive chewing on Indian teakwood sofa legs. Sourced ethically from the zero-waste trim crops of coffee plantations in the Nilgiri Hills of Southern India, the Pawwcious Coffee Wood Chew is a 100% natural, caffeine-free, and calorie-free wooden bone. High-density fibers are completely splinter-free, shedding tiny soft wood fibers that act as safe, delicious dental floss to scrap off plaque and scale tartar.",
    category: "chew-enrichment",
    price: 599,
    originalPrice: 699,
    stock: 30,
    rating: 5.0,
    reviewCount: 3,
    imageUrl: "/images/products/coffeewood/coffeewood_for_dogs_2.webp",
    benefits: [
      "100% natural, sustainable, organic Nilgiri mountain wood with zero additives",
      "Splinter-free fiber layout is fully digestible and completely safe for your pet's stomach",
      "Serves as a natural mechanical toothbrush to scrape off thick plaque and tartar",
      "Keeps hyperactive jaws pacified, releasing endorphins to treat separation anxiety"
    ],
    usage: [
      "Select the appropriate size chew (S, M, L) according to your dog's bite size",
      "Hand the coffee raw chew directly to your pet during thunder storming or high-anxiety times",
      "Wash wood with clean water and air dry after prolonged daily chewing sessions",
      "Dispose and replace with a fresh wood chew once it gets tiny enough to swallowed"
    ],
    isBestSeller: true,
    sizeVariants: ["Small (Puppy/Toy)", "Medium (Active Chewers)", "Large (Robust Breed)"]
  },
  {
    id: "complete-grooming-pack",
    name: "Complete Grooming Pack",
    tagline: "100% Organic Furlush Serum",
    description: "Soft fur, smooth combing, and that healthy shine! Furlush Serum turns rough coat days into glow days. ✨,Frizz? Tangles? Dull coat? Furlush Serum brings back the silky bounce your pet deserves. 🐾A few drops, a gentle palm-apply, and her coat looks salon-fresh. Furlush is pure fur luxury. ✨Monsoon humidity can’t win today. Furlush Serum keeps the coat smooth, glossy, and cuddle-ready. 💚From rough and dull to soft and shiny — Furlush Serum makes every grooming session feel premium.",
    category: "grooming-hygiene",
    price: 1199,
    originalPrice: 1247,
    stock: 25,
    rating: 4.8,
    reviewCount: 4,
    imageUrl: "/images/products/grooming_kit/grooming_kit_for_pets_1.webp",
    benefits: [
      "All-in-one professional spa hamper saves over ₹600 compared to individual purchases",
      "Maintains coat immunity against seasonal Indian tick infestations and hotspot sores",
      "Formulated with entirely hand-harvested Indian botanicals (Neem, Aloe, Khus, Amla)",
      "An upscale, highly practical gift set for new pet parents in Bangalore, Mumbai, NCR"
    ],
    usage: [
      "Start by gently cleaning wet ears and wax using the Squeakear Earwash drops",
      "Lather and wash down the dusty coat with the Organic Tick-Repelling Neem Shampoo",
      "Spray Furlush Serum lightly across damp coat and brush smoothly to detangle mats",
      "Gently dust Furbreeze Cooling Powder across the paws and underbelly to lock freshness"
    ],
    isBestSeller: true,
    sizeVariants: ["Standard Complete Kit (Fixed Size)"]
  }
];

export const fallbackBanners: Banner[] = [
  {
    id: "skincare-wellness-revolution",
    title: "Where Healing Journeys Begin.",
    subtitle: "Organic pet wellness for healthier skin, calmer moments, and happier bonds.",
    imageUrl: "/images/pawwcious_serum.webp",
    ctaLink: "#shop",
    ctaText: "Discover More"
  },
  {
    id: "skincare-campaign",
    title: "Premium Grooming, Naturally Better.",
    subtitle: "Purposeful formulas for cooling comfort, coat care, and gentle ear wellness.",
    imageUrl: "/images/pawwcious_coolingpowder.webp",
    ctaLink: "#shop",
    ctaText: "Explore Routine"
  },
  {
    id: "ear-care-campaign",
    title: "Botanical Care, Made for Pets.",
    subtitle: "Plant-powered grooming essentials for everyday comfort.",
    imageUrl: "/images/pawwcious_earwash.webp",
    ctaLink: "#shop",
    ctaText: "Buy Now"
  },
  {
    id: "organic-chew-campaign",
    title: "Enrichment Beyond Ordinary Toys",
    subtitle: "Natural coffee wood chews that support instinctive, healthy chewing.",
    imageUrl: "/images/pawwcious_coffeewood.webp",
    ctaLink: "#shop",
    ctaText: "Shop Now"
  }
];

export const fallbackCoupons: Coupon[] = [
  {
    code: "PAWWCIOUS5",
    discountPercent: 5,
    maxDiscount: 200,
    minCartValue: 999,
    active: true
  },
  {
    code: "ELITEPET20",
    discountPercent: 20,
    maxDiscount: 1000,
    minCartValue: 2499,
    active: true
  },
  {
    code: "FREEDEL",
    discountPercent: 0,
    maxDiscount: 150,
    minCartValue: 499,
    active: true,
    isFreeShipping: true
  },
  {
    code: "BARKSYXPAWWCIOUS10",
    discountPercent: 10,
    maxDiscount: 150,
    minCartValue: 399,
    active: true,
    isFreeShipping: false
  }
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Snigdha Prasad",
    petName: "Milo, Golden Retriever (Mumbai)",
    rating: 5,
    text: "I found the perfect organic products with minimal preservatives. I will definitely recommend this to all the pet parents out there. The glow after the serum is commendable!",
    avatarUrl: "/images/avatar/rev_1.webp"
  },
  {
    id: "t2",
    name: "Samriddhi Sinha",
    petName: "Zoe, Persian Cat (Bengaluru)",
    rating: 5,
    text: "The best pet products for dogs and cats!! The natural ingredients used in these products, like neem, is exactly why I trust it for my dog. Definitely a must try!",
    avatarUrl: "/images/avatar/rev_2.webp"
  },
  {
    id: "t3",
    name: "Neelasoans Forw18",
    petName: "Bruno, Boxer (Delhi NCR)",
    rating: 5,
    text: "I appreciate brands that prioritize pet health over quick profits ❤️",
    avatarUrl: "/images/avatar/rev_3.webp"
  },
  {
    id: "t4",
    name: "Jaiveer",
    petName: "Denver, Golden Retriever (Pune)",
    rating: 5,
    text: "As a first-time pet parent, I was nervous about what products to use. Finding natural, vet-approved care has been a blessing. I feel confident knowing my dog is safe and loved with every product I choose here.",
    avatarUrl: "/images/avatar/rev_5.webp"
  },
  {
    id: "t5",
    name: "Sneha Dewedi",
    petName: "Chloe, Shih Tzu (Hyderabad)",
    rating: 5,
    text: "My cat has very sensitive skin, and most products caused irritation. But these gentle formulas work perfectly- no redness, no discomfort, only a happy, purring kitty.",
    avatarUrl: "/images/avatar/rev_4.webp"
  },
  {
    id: "t6",
    name: "Sony Singh",
    petName: "Consultant Vet (Chennai)",
    rating: 5,
    text: "I love that every formula is vet-approved. It gives me peace of mind, and the best part? My dog actually enjoys it. No stress, only tail wags!",
    avatarUrl: "/images/avatar/rev_6.webp"
  },
  {
    id: "t7",
    name: "Afza Khan",
    petName: "Rocky, Beagle (Kolkata)",
    rating: 5,
    text: "I always look for products I can trust for my cat. This one just feels right,  simple, gentle, and made with care. And seeing her actually enjoy it? That’s everything.",
    avatarUrl: "/images/avatar/rev_7.webp"
  }
];

export const fallbackBlogs: Blog[] = [
  {
    id: "the-borrowed-scent",
    title: "Why Pets Sleep on Your Clothes | The Borrowed Scent",
    summary: "Why do pets sleep on their owner's clothes instead of their own bed? Discover how scent, comfort, and emotional bonding influence where pets choose to rest.",
    content: `Many pet parents notice a curious habit: the moment you leave a sweater or t-shirt on the bed or chair, your dog or cat immediately curls up on it. Even with a premium orthopedic pet bed sitting empty nearby, your worn laundry is their ultimate resting destination.

### Why Scent Matters So Much to Pets
For dogs and cats, scent is the primary way they navigate and understand the world. Your clothes carry a concentrated signature of your scent glands, sweat, and skin cells. 
* **Dogs**: Possess up to 300 million olfactory receptors (compared to a human's 6 million). Your scent triggers the reward centers of a dog's brain, releasing oxytocin and reducing salivary cortisol.
* **Cats**: Have an incredibly sensitive organ called the vomeronasal organ. They use your scent to map safe zones, establish territory, and create a communal "clan scent".

### Familiar Scents Create Emotional Safety
When you leave for work or go out of town, your pet experienced a mild form of separation anxiety. Sleeping on your clothes acts as an emotional surrogate. 
1. **Sensory Comfort**: It feels as though you are there, keeping them safe.
2. **Reduced Stress**: It stabilizes their heart rate during chaotic times like thunderstorms or construction noise.
3. **Familiarity**: In a new place, your worn shirt provides an instant anchor of safety.

### Why Clothes Feel Better Than Their Own Bed
Pet beds, even if regularly cleaned, lack your biological scent marker. In contrast, your clothes are physical representations of you: warmth, protection, and trust. 

*If your pet has intense separation anxiety, pairing your clothes with our **Ashwagandha Calming Drops** can help them find deep, restorative rest.*`,
    author: "Dr. Ananya Goel, BVSc",
    imageUrl: "/images/blogs/best_pet_wellness_2.webp",
    category: "Pet Behavior & Mind",
    readTime: "4 min read",
    createdAt: "May 28, 2026",
    tags: ["Behavior", "Bonding", "Cozy", "Dog Care", "Cat Care"],
    likes: ["customer_mock_uid", "admin_mock_uid"],
    comments: [
      {
        id: "c-bs1",
        userName: "Kiara Sharma",
        userEmail: "kiara@example.com",
        userId: "customer_mock_uid",
        comment: "This explains why Milo always sleeps directly on my wet towels after gym sessions! Such a sweet bonding habit.",
        createdAt: "May 29, 2026"
      }
    ]
  },
  {
    id: "spinach-cottage-cheese-bowl",
    title: "Spinach & Cottage Cheese Bowl – Pawwcious® Recipe",
    summary: "Learn how to prepare a gentle Spinach & Cottage Cheese Bowl for dogs and cats. A Pawwcious homemade recipe supporting natural strength and nourishment.",
    content: `If you are looking to treat your pet to a wholesome, light, and protein-rich homemade treat, this **Spinach & Cottage Cheese Soft Strength Bowl** is a clinical favorite. It combines easily digestible dairy protein with micronutrient-rich fresh leafy greens to support physical vitality.

### 🧂 Ingredients (1-2 Servings)
* **Fresh Cottage Cheese (Paneer / Chenna)**: 100g (unsalted, crumbled)
* **Baby Spinach Leaves**: 1/2 cup (chopped and gently steamed)
* **Boiled White or Brown Rice (or Rolled Oats)**: 2 tablespoons (softly mashed)
* **Flaxseed Powder**: 1/4 teaspoon (for essential Omega-3 fatty acids)

### 🍲 Preparation Method
1. **Prepare the Greens**: Steam the spinach leaves for exactly 2 minutes to break down any tough cell walls. Finely mince them to avoid any choking hazard.
2. **Combine Bases**: In a pet-safe bowl, combine the softly boiled rice or oats with the crumbled cottage cheese.
3. **Meld Together**: Add the steamed chopped spinach and premium flaxseed powder.
4. **Mix Thoroughly**: Stir with a fork until the mixture forms a soft, easily lickable consistency. Serve at room temperature.

### 🌟 Nutritional Benefits
* **Premium Calcium & Casein**: Cottage cheese is low in lactose but high in bio-available calcium and clean dairy protein.
* **Iron & Lutein**: Steamed spinach supplies dietary iron, folate, and vital antioxidants that promote cell regeneration in senior pets.
* **Gut Hydration**: The high moisture content supports delicate kidney filters, reducing crystal formations.

### 🩺 Vet Disclaimer
*Introduce any new food ingredient gradually. While paneer is safe for most pets, animals with lactose intolerance or pancreatitis should consult a veterinarian before consumption.*`,
    author: "Dr. Kabir Sen, Chief Vet Pharmacologist",
    imageUrl: "/images/blogs/pets_recipe_2.webp",
    category: "Wholesome Recipes",
    readTime: "3 min read",
    createdAt: "May 26, 2026",
    tags: ["Recipes", "Nutrition", "Dog Food", "Cat Treat"],
    likes: ["customer_mock_uid"],
    comments: []
  },
  {
    id: "carrot-lentil-gentle-energy-mash",
    title: "Carrot & Lentil Gentle Energy Mash – Pawwcious® Recipe",
    summary: "Give your pet natural nourishment with Pawwcious Carrot & Lentil Gentle Energy Mash, a home recipe supporting digestion, energy, and comfort for dogs and cats.",
    content: `When your companion needs a gentle energy boost or suffers from moderate flatulence, a soft plant-protein mash works wonders. This Vet-Approved recipe is tailored for sensitive digestion.

### 🧂 Ingredients (1–2 Small Servings)
* **Red Lentils (Masoor Dal)**: 3 tablespoons (soaked for 1 hour and pressure cooked until fully mushy)
* **Red Carrots**: 1/2 carrot (finely grated and steamed)
* **Mashed Pumpkin**: 1 tablespoon (unseasoned)
* **Turmeric Root (Haldi)**: A tiny pinch (for natural anti-inflammatory boost)

### 🍲 Method of Preparation
1. **Cook the Dal**: Double-boil the red lentils in plain unsalted water until they are entirely soft and can be easily mashed with a spoon.
2. **Steam the Carrots**: Gently steam the grated carrots to maximize beta-carotene digestion safely.
3. **Combine Elements**: Stir the warm lentils, mashed pumpkin, grated carrots, and the microscopic pinch of turmeric together.
4. **Blend & Cool**: Whip into a smooth paste. Let it cool completely before serving to prevent tongue burns.

### 🌟 Key Health Benefits
* **Soluble Prebiotic Fiber**: Grated carrot stimulates bowel movement, cleaning the digestive tract gently.
* **Hypoallergenic Protein**: Red lentils provide light amino acids without triggering poultry or beef meat allergies.
* **Golden Healing**: Turmeric acts as a natural vascular purifier, boosting immunity.`,
    author: "Dr. Rohit Deshmukh, Lead Vet Dietician",
    imageUrl: "/images/blogs/pets_recipe_1.webp",
    category: "Wholesome Recipes",
    readTime: "3 min read",
    createdAt: "May 24, 2026",
    tags: ["Recipes", "Digestion", "Healthy Pets", "Ayurveda"],
    likes: [],
    comments: []
  },
  {
    id: "the-favorite-fabric-choice",
    title: "The Favorite Fabric Choice: Why Pets Prefer Certain Textures",
    summary: "Why do pets prefer certain blankets, beds, or textures? Learn how fabric choices reflect comfort, emotional safety, temperature needs, and trust.",
    content: `Have you ever wondered why your cat insists on kneeding a specific velvet cushion, or why your Golden Retriever ignores his slick nylon bed for an old frayed wool blanket? Fabric texture is highly sensory for domestic pets.

### 1. Sensory Perception of Fabrics
Dogs and cats experience fabrics not just visually, but with tactile paw-vibration sensors and sensitive hair follicles.
* **Soft Fleece & Velvet**: Replicate the comforting feel of motherly milk-drinking warmth. It triggers the classic paw-kneading behavior in cats (often called "making biscuits").
* **Organic Linen & Breathable Cotton**: Provide a cool thermal surface, ideal for hot tropical afternoons.
* **Coarse Fray/Canvas**: Highly satisfying for dogs who love scratching or nesting before settling down.

### 2. Scent Absorbency Potential
Synthetics (polyester) repel moisture but capture static charge. Organic fabrics (wool, high-density cotton) absorb household pheromones, rapidly holding your personalized biological scent profile. Pets will always choose the fabric that smells most like home!

### 3. Supporting Healthy Fabric Habits
If you notice your pet chewing or eating non-food fabrics (a clinical condition known as **Pica**), it signals nutritional deficiencies or severe chronic boredom. Ensure they have a designated safe blanket made of natural organic fibers, like those in our **Zen-Sleep Bedding** collection.`,
    author: "Dr. Sarah DeSouza, BVSc & AH",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    category: "Grooming & Skin",
    readTime: "4 min read",
    createdAt: "May 21, 2026",
    tags: ["Skin", "Grooming", "Behavior", "Cozy"],
    likes: ["customer_mock_uid"],
    comments: []
  },
  {
    id: "chickpea-pumpkin-gentle-comfort-mash",
    title: "Chickpea & Pumpkin Gentle Comfort Mash – Pawwcious® Recipe",
    summary: "Support your pet’s digestion naturally with Pawwcious Chickpea & Pumpkin Comfort Mash, a soft, protein-rich home recipe for gentle digestion in dogs and cats.",
    content: `When your furry child experiences mild tummy upsets, heavy flatulence, or loose motions, traditional rich dry kibble can strain their colon. This comforting Pumpkin Mash is the perfect bland-diet restorative meal.

### 🧂 Ingredients
* **Cooked Chickpeas (Kabuli Chana)**: 3 tablespoons (fully boiled, skins removed, and mashed to a cream)
* **Fresh Pumpkin Pulp**: 3 tablespoons (steamed and puréed)
* **Organic Coconut Oil**: 1/2 teaspoon (for healthy medium-chain fats)
* **Boiled Rolled Oats**: 1 tablespoon (soft-cooked)

### 🍲 Preparation Method
1. **De-skin Chickpeas**: Ensure you pinch off the translucent chickpea skins after boiling, as they are hard for pets to process. Mash the inner yellow cores.
2. **Puree Pumpkin**: Blend the steamed orange pumpkin into a smooth paste.
3. **Combine & Polish**: Whip the chickpeas, pumpkin paste, and oats together, splashing a drop of pure water if too dense. Stir in the organic coconut oil.
4. **Feed Small Portions**: Offer in small spoonfuls over the day to soothe gastrointestinal inflammation.

### 🌟 Benefits
* **High Soluble Fiber**: Pumpkin is incredibly rich in soluble fiber, which naturally binds loose stools.
* **Low-Allergen Energy**: Highly nutritious, soothing the digestive lining and providing a calm prebiotic boost.`,
    author: "Dr. Kabir Sen, Chief Vet Pharmacologist",
    imageUrl: "/images/blogs/pets_recipe_4.webp",
    category: "Wholesome Recipes",
    readTime: "3 min read",
    createdAt: "May 19, 2026",
    tags: ["Recipes", "Digestion", "Anxiety", "Natural Care"],
    likes: ["admin_mock_uid"],
    comments: []
  },
  {
    id: "the-first-thing-pets-notice",
    title: "The First Thing Pets Notice When They Enter a New Place",
    summary: "What do pets actually notice first when they enter a new place? Discover how dogs and cats read spaces differently from humans through scent and exits.",
    content: `Whether you're visiting a pet-friendly cafe, a friend's house, or moving into a new apartment, your pet sees the environment through a completely different lens than you do. While humans analyze wall colors and furniture arrangements, pets establish an immediate security map.

### 1. The Smelling Ground: Sniffing the Floorboards
The absolute first physical action is lowering the nose. To dogs and cats, a room's history is written on the floor.
* They scan for previous animals (territorial markers), human anxiety hormones, food crumbs, and cleaning chemical traces.
* High-chemical floor cleaners can sting their nostrils, causing occasional sneezing or rubbing behavior.

### 2. Identifying Escape Exits & Tight Spaces
Every animal retains wild survival instincts. Upon entry, they immediately spot:
1. **The Core Entrance/Exit**: Where the pack can flee in an emergency.
2. **Shadow Casts & Blindspots**: Secure dark spots underneath sofas or tables where they can rest without being snuck up on.

### 3. Acoustic Vibrations & Structural Vibe
Before settling, pets stand still, ears rotating slightly. They are listening to the structural hum—refrigerator motors, underlying street traffic, wall pipe water flow, and high-frequency electric lines.

*Pet parent tip: If your dog is panicking in a new hotel or house, spray a tiny spritz of lavender-infused water or place your worn clothing near the room entrance to signal safety.*`,
    author: "Dr. Ananya Goel, BVSc",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
    category: "Pet Behavior & Mind",
    readTime: "5 min read",
    createdAt: "May 15, 2026",
    tags: ["Behavior", "Anxiety", "Tail Wags", "Happy Bond"],
    likes: ["customer_mock_uid", "mock_user_2"],
    comments: []
  },
  {
    id: "the-paw-placement-pause",
    title: "The Paw Placement Pause: Subtle Pet Comfort Signal",
    summary: "Why do pets adjust their front paws before lying down? Discover how this subtle movement reflects comfort, safety, and nervous-system balance.",
    content: `Have you ever noticed your dog or cat circling three times, stopping, and hovering in a half-squat for a few seconds—carefully placing one front paw, then adjusting the other—before ultimately collapsing into a deep sleep? This is known as **The Paw Placement Pause**.

### Why Front Paws Matter
A pet's front paws are packed with highly responsive tactual nerves and temperature glands. Adjusting their placement performs several critical biological checks:
1. **Surface Assessment**: Measuring slope, thermal heat, and material firmness.
2. **Spinal Alignment**: Stretching the neck vertebrae to prevent muscle locking.
3. **Pheromone Secretion**: Paws contain scent sweat glands. Pressing them firmly onto a pillow registers ownership, marking the sleeping turf.

### When You'll Notice It Most
You'll observe this pause frequently on high-quality fabrics, outdoors on real green turf, or on orthopedic bedding like the **Zen-Sleep bed**. It shows that their nervous system has shifted from active vigilance to deep parasympathetic rest.

This simple, beautiful micro-action is a direct signal that your companion feels completely safe, secure, and loved in your presence.`,
    author: "Dr. Sarah DeSouza, BVSc & AH",
    imageUrl: "/images/blogs/best_pet_wellness_1.webp",
    category: "Pet Behavior & Mind",
    readTime: "4 min read",
    createdAt: "May 12, 2026",
    tags: ["Behavior", "Pure Love", "Gentle Paws", "Daily Joy"],
    likes: [],
    comments: []
  },
  {
    id: "the-shoulder-brush",
    title: "The Shoulder Brush: Subtle Pet Bonding Explained",
    summary: "Why do pets gently walk past and brush their shoulder against you without stopping? Learn what this subtle bonding behavior reveals about trust.",
    content: `Sometimes, your pet will march into the room, brush their shoulder or flank firmly against your calf, and walk right past you without asking for a treat or stopping to be pet. This behavior is called **The Shoulder Brush**.

### It's Not Attention-Seeking: It's Silent Union
While a nudging nose means "feed me" and a paw slap means "play", the silent shoulder brush is purely relational.
* **Cats**: Have temporal perfume glands beside their ears. Brushing past you deposit these sweet facial pheromones, wrapping you in their olfactory safe-list.
* **Dogs**: Use it as a physical boundary check. By grazing your skin or clothes, they declare: "We are traveling in a pack together, and I am close by."

### What This Tells You About Trust
A pet that initiates frequent shoulder brushes holds immense trust in your relationship. They do not need to demand pets or vocalize to feel secure. Simply maintaining brief physical friction satisfies their emotional pack-need, assuring them of your supportive presence.`,
    author: "Dr. Kabir Sen, Chief Vet Pharmacologist",
    imageUrl: "/images/blogs/best_pet_wellness_3.webp",
    category: "Pet Behavior & Mind",
    readTime: "3 min read",
    createdAt: "May 09, 2026",
    tags: ["Behavior", "Bonding", "Pure Love", "Daily Joy"],
    likes: ["customer_mock_uid"],
    comments: []
  },
  {
    id: "amaranth-steamed-apple-bowl",
    title: "Amaranth & Steamed Apple Soft Harmony Bowl",
    summary: "Support digestive balance naturally with Pawwcious® Amaranth & Steamed Apple Soft Harmony Bowl 🌾🍎 — a light comfort recipe for dogs and cats.",
    content: `Pets who experience chronic food fatigue, skin dander, or delicate bowel issues thrive on non-grain seeds. This beautiful **Amaranth & Steamed Apple Soft Harmony Bowl** is a highly gut-friendly recipe.

### 🧂 Ingredients
* **Puffed or Cooked Amaranth (Rajgira)**: 2 tablespoons (rich in ancient proteins and gluten-free fiber)
* **Red Apple**: 1/2 apple (peeled, cored, and steamed soft)
* **Warm Bone Broth**: 3 tablespoons (unsalted, organic)
* **Fresh Mint Leaf**: 1 leaf (finely minced, for gas relief)

### 🍲 Preparation Method
1. **Prepare Apple Core**: Ensure all apple seeds are meticulously discarded, as seeds contain amygdalin, which is highly toxic to pets. Steam the skinless flesh until translucent.
2. **Cook Amaranth**: Boil pure amaranth grains in plain water until soft, or use plain unsweetened puffed rajgira.
3. **Mash Together**: Add Warm bone broth to help hydrate the puffed amaranth, mashing the steamed apple into a neat, golden puree.
4. **Whip & Feed**: Top with minced mint. Serve twice weekly to calm hot stomach liners.

### 🌟 Health Benefits
* **High Pectin Fiber**: Apple pectin acts as an exceptional prebiotic bowel stabilizer.
* **Gluten-Free Calm**: Safe for pets suffering from chronic skin dermatitis triggered by wheat or corn gluten.`,
    author: "Dr. Rohit Deshmukh, Lead Nephrologist",
    imageUrl: "/images/blogs/pets_recipe_3.webp",
    category: "Wholesome Recipes",
    readTime: "4 min read",
    createdAt: "May 05, 2026",
    tags: ["Recipes", "Skin", "Nutrition", "Ayurveda"],
    likes: [],
    comments: []
  },
  {
    id: "the-return-loop",
    title: "Why Pets Walk Away — Then Quietly Come Back to the Same Spot",
    summary: "Why do pets leave a comfortable spot only to return moments later? This subtle return loop reveals emotional reassurance and environmental trust.",
    content: `You're sitting on the rug with your pet when they suddenly get up, walk into the hallway, inspect a random wall corner, and then walk back to plop down in the exact spot they just vacated. This is known as **The Return Loop**.

### The Science of Spacial Mapping
This behavior is not accidental or aimless pacing. It holds deep spatial and psychological significance:
1. **Perimeter Verification**: Pets perform brief, instinctive walks to ensure no sudden environmental changes have occurred.
2. **Reassurance Seeking**: Simply glancing at you or brushing their whiskers on their return reaffirms they have permission to rest.
3. **Thermal cooling**: Sometimes, a cozy spot gets too warm. Moving to a cool marble floor for just 30 seconds helps lower skin body temp before they return to nesting on their soft sheets.

### What Should Pet Parents Do?
Never scold or try to block your pet when they perform this loop. It's a natural balancing mechanism. Let them check the doors, stretch their ligaments, and return to their favorite spot of rest beside you with trust.`,
    author: "Dr. Ananya Goel, BVSc",
    imageUrl: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?auto=format&fit=crop&w=800&q=80",
    category: "Pet Behavior & Mind",
    readTime: "3 min read",
    createdAt: "May 02, 2026",
    tags: ["Behavior", "Bonding", "Tail Wags", "Happy Bond"],
    likes: ["customer_mock_uid", "admin_mock_uid"],
    comments: []
  }
];

export const fallbackReviews: Review[] = [
  {
    id: "rev1",
    productId: "furlush-serum",
    productName: "Furlush Serum",
    userName: "Aditya Roy",
    userEmail: "customer@pawwcious.in",
    userId: "customer_mock_uid",
    rating: 5,
    comment: "This has been an absolute game-changer for Zoe's Persian coat under the hot Bangalore sun! The Bhringraj shine is simply supreme. 🐾",
    status: "approved",
    createdAt: "2026-05-20T10:00:00.000Z"
  },
  {
    id: "rev2",
    productId: "furlush-serum",
    productName: "Furlush Serum",
    userName: "Rajas Behera",
    userEmail: "rajasbehera@gmail.com",
    userId: "admin_mock_uid",
    rating: 4,
    comment: "Excellent hairfall control and deep nourishment, highly approved from clinical standpoint for Indian heatwaves.",
    status: "approved",
    createdAt: "2026-05-21T14:30:00.000Z"
  },
  {
    id: "rev3",
    productId: "furbreeze-cooling-powder",
    productName: "Furbreeze Heat Cooling Powder",
    userName: "Anjali Sen",
    userEmail: "customer@pawwcious.in",
    userId: "customer_mock_uid2",
    rating: 5,
    comment: "Amazing talc-free cooling khus experience! Bruno is finally resting without constant summer scratching. Smells divine!",
    status: "approved",
    createdAt: "2026-05-22T09:00:00.000Z"
  },
  {
    id: "rev4",
    productId: "furbreeze-cooling-powder",
    productName: "Furbreeze Heat Cooling Powder",
    userName: "Ramesh Kumar",
    userEmail: "ramesh@example.com",
    userId: "cust_3",
    rating: 4,
    comment: "My Labrador feels so relieved after after walks now. It absorbs all humidity sweat instantly and has kept ticks away successfully.",
    status: "approved",
    createdAt: "2026-05-25T11:20:00.000Z"
  },
  {
    id: "rev5",
    productId: "squeakear-earwash",
    productName: "Squeakear Earwash",
    userName: "Priya Menon",
    userEmail: "priya@example.com",
    userId: "cust_4",
    rating: 5,
    comment: "Excellent ear cleanser. Floppy ears of my Beagle used to get so red and smelly, but Squeakear has cleared the moisture and stopped yeast completely!",
    status: "approved",
    createdAt: "2026-05-26T16:45:00.000Z"
  },
  {
    id: "rev6",
    productId: "squeakear-earwash",
    productName: "Squeakear Earwash",
    userName: "Vikram Seth",
    userEmail: "vikram@example.com",
    userId: "cust_5",
    rating: 5,
    comment: "Very gentle, doesn't sting at all compared to medical drops we tried before. Best ear cleanser for Cocker Spaniels in India.",
    status: "approved",
    createdAt: "2026-05-27T08:15:00.000Z"
  },
  {
    id: "rev7",
    productId: "coffee-wood-chew",
    productName: "Pawwcious Coffee Wood Chew",
    userName: "Rahul Sharma",
    userEmail: "rahul@example.com",
    userId: "cust_6",
    rating: 5,
    comment: "Incredibly durable! Our golden retriever sleeps with this Coffee Wood chew and has completely stopped destroying wooden chair legs.",
    status: "approved",
    createdAt: "2026-05-28T12:00:00.000Z"
  },
  {
    id: "rev8",
    productId: "coffee-wood-chew",
    productName: "Pawwcious Coffee Wood Chew",
    userName: "Tanya Sen",
    userEmail: "tanya@example.com",
    userId: "cust_7",
    rating: 5,
    comment: "I got the large size for our husky, and it's perfect! Doesn't splinter into sharp fragments, just peels off satisfying soft dental fibers.",
    status: "approved",
    createdAt: "2026-05-29T10:30:00.000Z"
  },
  {
    id: "rev9",
    productId: "complete-grooming-pack",
    productName: "Complete Grooming Pack",
    userName: "Shruti Das",
    userEmail: "shruti@example.com",
    userId: "cust_8",
    rating: 5,
    comment: "This pack has saved our summer! Incredible value for money, the Neem shampoo and Furlush serum make our pets coat look royal and fresh.",
    status: "approved",
    createdAt: "2026-05-29T14:00:00.000Z"
  },
  {
    id: "rev10",
    productId: "complete-grooming-pack",
    productName: "Complete Grooming Pack",
    userName: "Karan Johar",
    userEmail: "karan@example.com",
    userId: "cust_9",
    rating: 5,
    comment: "Absolutely pristine custom packaging, premium scent is top tier. Made for deluxe home Spa treats. Full stars!",
    status: "approved",
    createdAt: "2026-05-29T18:22:00.000Z"
  }
];

export const fallbackReviewReels: ReviewReel[] = [
  {
    id: "reel-1",
    videoUrl: "/video/pawwcious_reels_1.mp4",
    imageUrl: "reels_thumbnails/1.webp",
    authorName: "Pawwcious",
    petName: "Era",
    rating: 5,
    caption: "Absolutely saved Era’s coat from monsoon frizz and dryness! ✨Furlush Hair Serum makes the fur feel softer, shinier, and so much easier to manage — without making it sticky or heavy.Perfect for dull, tangled, and rough coats, especially during humid weather. A few drops on the palm, gently applied to the fur, and the glow is visible. 🐾Because healthy fur isn’t just seen… it’s felt. 💚",
    location: "Mumbai, Maharashtra",
    views: "24.5K",
    likes: 1822,
    featuredProductId: "furlush-hair-serum",
    createdAt: "2026-05-20T10:00:00.000Z"
  },
  {
    id: "reel-2",
    videoUrl: "/video/pawwcious_reels_2.mp4",
    imageUrl: "reels_thumbnails/2.webp",
    authorName: "Pawwcious",
    petName: "Mimo",
    rating: 5,
    caption: "Look at that silky shine and smooth finish! Furlush Hair Serum makes detangling her thick coat feel gentle and effortless. Pure coat-care luxury in every drop. ✨",
    location: "Mumbai, Maharashtra",
    views: "18.3K",
    likes: 1245,
    featuredProductId: "furlush-serum",
    createdAt: "2026-05-22T08:30:00.000Z"
  },
  {
    id: "reel-3",
    videoUrl: "/video/pawwcious_reels_3.mp4",
    imageUrl: "reels_thumbnails/3.webp",
    authorName: "Pawwcious",
    petName: "Rocky (Boxer)",
    rating: 5,
    caption: "Clean ears, happy pets! SqueakiEar Ear Wash gently helps remove dirt, wax, and odour — keeping every head shake fresh and comfy. 🐾✨",
    location: "Mumbai, Maharashtra",
    views: "34.1K",
    likes: 2491,
    featuredProductId: "coffee-wood-chew",
    createdAt: "2026-05-25T11:15:00.000Z"
  },
  {
    id: "reel-4",
    videoUrl: "/video/pawwcious_reels_4.mp4",
    imageUrl: "reels_thumbnails/4.webp",
    authorName: "Pawwcious",
    petName: "Milo (Poodle)",
    rating: 5,
    caption: "Monsoon ear care has never been this easy! Check out Squeakear Earwash for absolute dry hygiene and wax-free skin. 🌧️👂",
    location: "Mumbai, Maharashtra",
    views: "85K",
    likes: 1540,
    featuredProductId: "squeakear-earwash",
    createdAt: "2026-05-26T14:20:00.000Z"
  },
  {
    id: "reel-5",
    videoUrl: "/video/pawwcious_reels_5.mp4",
    imageUrl: "reels_thumbnails/5.webp",
    authorName: "Pawwcious",
    petName: "Simba (Persian Cat)",
    rating: 5,
    caption: "Our daily grooming starts with the ultimate Organic Furlush serum! Simply standard of pure Ayurvedic luxury! 🎁💎🐾",
    location: "Mumbai, Maharashtra",
    views: "92K",
    likes: 980,
    featuredProductId: "complete-grooming-pack",
    createdAt: "2026-05-28T09:45:00.000Z"
  },
  {
    id: "reel-6",
    videoUrl: "/video/pawwcious_reels_6.mp4",
    imageUrl: "reels_thumbnails/6.webp",
    authorName: "Pawwcious",
    petName: "Rocky (Boxer)",
    rating: 5,
    caption: "Humidity can be harsh, but Furbreeze brings gentle freshness from the skin up. 💚",
    location: "Mumbai, Maharashtra",
    views: "115K",
    likes: 1920,
    featuredProductId: "complete-grooming-pack",
    createdAt: "2026-05-30T16:10:00.000Z"
  }
];

export const FREE_GIFT_CONFIG = {
  enabled: true,
  giftType: "raakhi",
  fixedQuantity: 1,
  celebrationTitle: "Festive Pet Rakhi Celebration",
  bannerSubtitle: "Special festive blessing for your loyal four-legged companion",
  defaultGiftId: "blue-paw"
};

export const freeRakhiOptions: FreeGiftOption[] = [
  {
    id: "blue-paw",
    name: "Blue Paw Rakhi",
    tagline: "Shining brass paw charm with auspicious crimson & gold silk cord",
    description: "Handcrafted golden brass paw emblem on ultra-soft organic silk thread. Specially curated for your furry family member with skin-friendly hypoallergenic materials.",
    badge: "Most Popular 🐾",
    category: "Festive Rakhi",
    originalPrice: 199,
    imageUrl: "/images/raakhi/blue-paw.png",
    icon: "Crown",
    accentColor: "#063ed9ff"
  },
  {
    id: "golden-star-paw",
    name: "Golden Star Paw Rakhi",
    tagline: "Auspicious miniature Rudraksha bead with silver bell on holy Mauli thread",
    description: "Natural energized 5-Mukhi micro Rudraksha bead paired with hypoallergenic silver charm on traditional holy red-yellow thread for health and longevity.",
    badge: "Blessings & Health ✨",
    category: "Festive Rakhi",
    originalPrice: 199,
    imageUrl: "/images/raakhi/golden-star-paw.png",
    icon: "HeartPulse",
    accentColor: "#B45309"
  },
  {
    id: "infinite-paw",
    name: "Infinite Paw Rakhi",
    tagline: "Festive Kundan centerpiece with soft freshwater pearl accents",
    description: "Luxurious handcrafted Kundan stone on featherlight band with soft pearl beads that sit gently against your pet's collar or fur without tangling.",
    badge: "Festive Glamour ♾️",
    category: "Festive Rakhi",
    originalPrice: 199,
    imageUrl: "/images/raakhi/infinite-paw.png",
    icon: "Sparkles",
    accentColor: "#f06cd3ff"
  },
  {
    id: "blue-evil-eye-protection",
    name: "Suraksha Evil Eye & Turquoise Rakhi",
    tagline: "Protective blue talisman & turquoise beads to ward off Buri Nazar",
    description: "Vibrant protective Evil Eye charm paired with turquoise accents on smooth braided cotton thread to keep your companion safe, sound, and thriving.",
    badge: "Protection & Joy 🧿",
    category: "Festive Rakhi",
    originalPrice: 199,
    imageUrl: "/images/raakhi/blue-evil-eye-protection.png",
    icon: "Shield",
    accentColor: "#0220c7ff"
  },
  {
    id: "kala-chashma-rakhi",
    name: "Kala Chashma Rakhi",
    tagline: "100% plant-dyed organic cotton with hand-embroidered floral motif",
    description: "All-natural, non-toxic plant-dyed organic cotton with biodegradable wooden beads. 100% chew-safe, fur-friendly, and eco-conscious.",
    badge: "Kala Chashma 🕶️",
    category: "Festive Rakhi",
    originalPrice: 199,
    imageUrl: "/images/raakhi/kala-chashma-rakhi.png",
    icon: "Leaf",
    accentColor: "#000000ff"
  }
];

