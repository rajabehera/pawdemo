export interface User {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  benefits: string[];
  usage: string[];
  isBestSeller: boolean;
  sizeVariants: string[];
  sizePrices?: Record<string, number>;
  sizeOriginalPrices?: Record<string, number>;
  galleryImages?: string[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLink: string;
  ctaText: string;
  order?: number;
}

export interface BlogComment {
  id: string;
  userName: string;
  userEmail: string;
  userId: string;
  comment: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  imageUrl: string;
  category: string;
  readTime: string;
  createdAt: string;
  tags?: string[];
  likes?: string[]; // Array of userIds or emails who liked the post
  comments?: BlogComment[];
  isPopular?: boolean;
  galleryImages?: string[];
}

export interface ShippingDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface FreeGiftOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  category: string;
  originalPrice: number;
  imageUrl: string;
  icon: string;
  accentColor: string;
}

export interface SelectedFreeGift {
  giftId: string;
  name: string;
  designName: string;
  quantity: number;
  imageUrl: string;
  price: number;
}
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  orderId: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    selectedSize: string;
  }[];
  freeGift?: SelectedFreeGift | null;
  totalAmount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  gstAmount: number;
  shipmentId?: string | number;
  shippingDetails: ShippingDetails;
  paymentMethod: "COD" | "Online";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentId?: string;
  shippingStatus: "Order Received" | "AWB Generated" | "In Transit" | "Delivered" | "Cancelled";
  awbNumber?: string;
  estimatedDelivery?: string;
  courierPartner?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minCartValue: number;
  active: boolean;
  isFreeShipping?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  petName: string;
  rating: number;
  text: string;
  avatarUrl: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userEmail: string;
  userId: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface ReviewReel {
  id: string;
  videoUrl: string;
  imageUrl: string;
  authorName: string;
  petName: string;
  rating: number;
  caption: string;
  location?: string;
  views?: string;
  likes?: number;
  featuredProductId?: string;
  instagramEmbedCode?: string;
  createdAt: string;
}
