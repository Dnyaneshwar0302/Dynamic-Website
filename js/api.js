const extraProducts = [
  {
    id: 101,
    title: 'Aurora Z9 Pro',
    description: 'A premium flagship phone balancing cinematic display and long battery life.',
    price: 54999,
    discountPercentage: 12,
    rating: 4.8,
    stock: 18,
    category: 'smartphones',
    brand: 'Samsung',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 102,
    title: 'Nova Air Lite',
    description: 'Impeccably tuned wireless earbuds with deep bass and all-day comfort.',
    price: 12999,
    discountPercentage: 10,
    rating: 4.6,
    stock: 25,
    category: 'audio',
    brand: 'Nothing',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 103,
    title: 'Pixel Studio X',
    description: 'A polished Android experience designed for vivid photography and everyday speed.',
    price: 47999,
    discountPercentage: 8,
    rating: 4.7,
    stock: 12,
    category: 'smartphones',
    brand: 'Google',
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 104,
    title: 'LumenBook Air',
    description: 'Ultra-light laptop with a sharp display and silence-first performance.',
    price: 79999,
    discountPercentage: 15,
    rating: 4.5,
    stock: 9,
    category: 'laptops',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 105,
    title: 'Orbit Watch 3',
    description: 'A modern fitness companion with health insights and an elegant profile.',
    price: 21999,
    discountPercentage: 11,
    rating: 4.4,
    stock: 20,
    category: 'wearables',
    brand: 'OnePlus',
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 106,
    title: 'Halo Smart Speaker',
    description: 'Immersive sound, striking looks, and smart voice controls for every room.',
    price: 14999,
    discountPercentage: 9,
    rating: 4.3,
    stock: 16,
    category: 'audio',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 107,
    title: 'Focus Desk Lite',
    description: 'A minimalist desk companion built for modern work habits and home style.',
    price: 18999,
    discountPercentage: 13,
    rating: 4.6,
    stock: 10,
    category: 'home',
    brand: 'Philips',
    thumbnail: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 108,
    title: 'Vivid Camera Mini',
    description: 'Pocket-sized camera with cinematic color and effortless creative control.',
    price: 32999,
    discountPercentage: 14,
    rating: 4.7,
    stock: 11,
    category: 'cameras',
    brand: 'Sony',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  },
];

const mergeProducts = (products = []) => {
  const merged = [...products];
  const seen = new Set(merged.map((product) => product.id));
  extraProducts.forEach((product) => {
    if (!seen.has(product.id)) {
      merged.push(product);
      seen.add(product.id);
    }
  });
  return merged;
};

const api = {
  async fetchProducts() {
    try {
      const response = await fetch('https://dummyjson.com/products');
      if (!response.ok) throw new Error('Unable to load products');
      const data = await response.json();
      return mergeProducts(data.products || []);
    } catch (error) {
      console.error('API error:', error);
      return mergeProducts([]);
    }
  },

  async fetchProductById(id) {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) throw new Error('Unable to load product');
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      return null;
    }
  },
};
