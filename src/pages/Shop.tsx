
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';

// Fallback data in case Firebase is empty
const fallbackData = [
  {
    id: 'shop-1',
    title: "Complete Criminal Law Set",
    category: "Bundle",
    price: 2999,
    originalPrice: 4500,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    description: "Comprehensive set including IPC, CrPC, and Evidence Act with commentaries",
    rating: 4.9,
    inStock: true,
    bestseller: true
  },
  {
    id: 'shop-2',
    title: "Civil Law Master Collection",
    category: "Bundle",
    price: 3499,
    originalPrice: 5200,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop",
    description: "Complete civil law collection with CPC, Contract Act, and Property Laws",
    rating: 4.8,
    inStock: true,
    featured: true
  },
  {
    id: 'shop-3',
    title: "Odisha Legal Practice Guide",
    category: "Specialty",
    price: 1299,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop",
    description: "Essential guide for practicing law in Odisha courts",
    rating: 4.7,
    inStock: true,
    newArrival: true
  },
  {
    id: 'shop-4',
    title: "Constitutional Law Essentials",
    category: "Core",
    price: 899,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1589829545856-d10d85525114?w=400&h=500&fit=crop",
    description: "Must-have constitutional law reference for students and practitioners",
    rating: 4.6,
    inStock: true
  },
  {
    id: 'shop-5',
    title: "Family & Personal Laws",
    category: "Specialty",
    price: 699,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=500&fit=crop",
    description: "Comprehensive coverage of all personal laws in India",
    rating: 4.5,
    inStock: true
  },
  {
    id: 'shop-6',
    title: "Tax Law Complete Guide",
    category: "Specialty",
    price: 1099,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=500&fit=crop",
    description: "Updated tax laws with GST and Income Tax provisions",
    rating: 4.4,
    inStock: false
  },
  {
    id: 'shop-7',
    title: "Beginner's Law Study Kit",
    category: "Starter",
    price: 1899,
    originalPrice: 2800,
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400&h=500&fit=crop",
    description: "Perfect starter kit for new law students",
    rating: 4.8,
    inStock: true,
    newArrival: true
  },
  {
    id: 'shop-8',
    title: "Professional Practice Manual",
    category: "Professional",
    price: 1599,
    originalPrice: 2100,
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=500&fit=crop",
    description: "Complete guide for professional legal practice",
    rating: 4.7,
    inStock: true,
    featured: true
  }
];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  console.log('🛍️ Shop Page - Products from hook:', products.length, products);
  console.log('🛍️ Shop Page - Loading:', loading);

  // Use Firebase products if available, otherwise use fallback
  const shopData = products.length > 0 ? products.map(p => {
    console.log('🛍️ Mapping product:', {
      id: p.id,
      title: p.title,
      category: p.category,
      image_url: p.image_url,
      has_image: !!p.image_url
    });
    return {
      id: p.id,
      title: p.title,
      category: p.category || 'books',
      price: p.price,
      originalPrice: p.price * 1.3, // Calculate discount
      image: p.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      description: p.description || '',
      rating: 4.5,
      inStock: p.stock > 0,
      bestseller: false,
      featured: false,
      newArrival: false
    };
  }) : fallbackData;

  console.log('🛍️ Shop Page - Final shopData:', shopData.length, 'items');

  const categories = ['All', 'books', 'journals', 'catalogs'];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'name', label: 'Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  let filteredProducts = shopData.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStock = !showOnlyInStock || product.inStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.bestseller && !b.bestseller) return -1;
        if (!a.bestseller && b.bestseller) return 1;
        if (a.newArrival && !b.newArrival) return -1;
        if (!a.newArrival && b.newArrival) return 1;
        return 0;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: typeof shopData[0]) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-serif font-bold text-primary mb-4">
              🛍️ Shop Now
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete legal book collections and specialized packages for every legal professional
            </p>
          </div>

          {/* Featured Banner */}
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl p-8 mb-8 border border-accent/30 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-accent mb-2">
                🎉 Special Offer - Up to 40% Off!
              </h2>
              <p className="text-lg text-foreground">
                Limited time offer on all book bundles and collections
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-xl p-6 mb-8 border border-border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="block text-accent mb-2 font-semibold">Search Products</label>
                <Input
                  placeholder="Search books and collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-accent mb-2 font-semibold">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 rounded-md bg-background border border-border text-foreground"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-accent mb-2 font-semibold">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 rounded-md bg-background border border-border text-foreground"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center space-x-2 text-accent cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                    className="w-4 h-4 text-accent bg-background border-border rounded focus:ring-accent"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:border-accent/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/20 animate-fade-in relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
                  {product.bestseller && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      🔥 Bestseller
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ Featured
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      🆕 New
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {product.originalPrice > product.price && (
                  <div className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold text-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold transform scale-0 group-hover:scale-100 transition-transform duration-300"
                    >
                      {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                  
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent text-xs font-semibold bg-accent/10 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <span className="text-xs">⭐ {product.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-serif font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-3 text-xs line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-accent">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-muted-foreground line-through text-xs">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-muted-foreground text-xl">No products found matching your criteria</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
