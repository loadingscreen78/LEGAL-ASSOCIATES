
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { MobileShop } from '@/components/mobile/MobileShop';

const fallbackBookData = [
  {
    id: 'book-1',
    title: "Indian Penal Code - Complete Commentary",
    category: "Criminal Law",
    price: 899,
    originalPrice: 1200,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    description: "Comprehensive commentary on IPC with latest amendments",
    rating: 4.8,
    inStock: true
  },
  {
    id: 'book-2',
    title: "Civil Procedure Code Handbook",
    category: "Civil Law",
    price: 750,
    originalPrice: 950,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop",
    description: "Essential guide to civil procedure with case studies",
    rating: 4.6,
    inStock: true
  },
  {
    id: 'book-3',
    title: "Constitutional Law of India",
    category: "Constitutional Law",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop",
    description: "Authoritative text on Indian constitutional law",
    rating: 4.9,
    inStock: true
  },
  {
    id: 'book-4',
    title: "Odisha Land Laws Manual",
    category: "Odisha Law",
    price: 650,
    originalPrice: 800,
    image: "https://images.unsplash.com/photo-1589829545856-d10d85525114?w=400&h=500&fit=crop",
    description: "Complete guide to Odisha land revenue laws",
    rating: 4.5,
    inStock: true
  },
  {
    id: 'book-5',
    title: "Family Law & Personal Laws",
    category: "Family Law",
    price: 540,
    originalPrice: 720,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=500&fit=crop",
    description: "Comprehensive coverage of family and personal laws",
    rating: 4.4,
    inStock: false
  },
  {
    id: 'book-6',
    title: "Tax Laws with Case Studies",
    category: "Tax Law",
    price: 980,
    originalPrice: 1200,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=500&fit=crop",
    description: "Updated tax laws with practical case studies",
    rating: 4.7,
    inStock: true
  }
];

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  console.log('📚 Books Page - Products from hook:', products.length, products);
  console.log('📚 Books Page - Loading:', loading);

  // Use Firebase products (books only) if available, otherwise use fallback
  const booksFromFirebase = products.filter(p => p.category === 'books');
  console.log('📚 Books filtered from Firebase:', booksFromFirebase.length);

  const bookData = booksFromFirebase.length > 0 
    ? booksFromFirebase.map(p => ({
        id: p.id,
        title: p.title,
        category: p.author || 'Books',
        price: p.price,
        originalPrice: p.price * 1.2,
        image: p.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        description: p.description || '',
        rating: 4.5,
        inStock: p.stock > 0
      }))
    : fallbackBookData;

  console.log('📚 Books Page - Final bookData:', bookData.length, 'items');

  const categories = ['All', 'Criminal Law', 'Civil Law', 'Constitutional Law', 'Odisha Law', 'Family Law', 'Tax Law'];
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' }
  ];

  let filteredBooks = bookData.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort books
  filteredBooks = filteredBooks.sort((a, b) => {
    switch (sortBy) {
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

  const handleAddToCart = (book: typeof bookData[0]) => {
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      category: book.category
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0616] to-[#1a0a2e]">
      <Navigation mobileTitle="Books" hideMobileSearchIcon />

      {/* Mobile-first books (< md) */}
      <MobileShop initialCategory="books" lockCategory />

      {/* Desktop / tablet (≥ md) */}
      <main className="hidden md:block pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-serif font-bold text-[#D4AF37] mb-4">
              📚 Our Books
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover our extensive collection of legal books covering all areas of law
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-[#1a0a2e] rounded-xl p-6 mb-8 border border-[#D4AF37]/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[#D4AF37] mb-2 font-semibold">Search Books</label>
                <Input
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#0F0616] border-[#D4AF37]/30 text-white"
                />
              </div>
              <div>
                <label className="block text-[#D4AF37] mb-2 font-semibold">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#0F0616] border border-[#D4AF37]/30 text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#D4AF37] mb-2 font-semibold">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#0F0616] border border-[#D4AF37]/30 text-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                className="group bg-[#1a0a2e] rounded-xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#D4AF37]/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0616]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      onClick={() => handleAddToCart(book)}
                      disabled={!book.inStock}
                      className="bg-[#D4AF37] text-[#0F0616] hover:bg-[#f4d03f] font-semibold transform scale-0 group-hover:scale-100 transition-transform duration-300"
                    >
                      {book.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                  
                  {/* Stock status */}
                  {!book.inStock && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                      Out of Stock
                    </div>
                  )}
                  
                  {/* Discount badge */}
                  {book.originalPrice > book.price && (
                    <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#0F0616] px-3 py-1 rounded-full font-semibold text-sm">
                      {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#D4AF37] text-sm font-semibold bg-[#D4AF37]/10 px-2 py-1 rounded">
                      {book.category}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <span className="text-sm">⭐ {book.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                    {book.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-[#D4AF37]">₹{book.price}</span>
                      {book.originalPrice > book.price && (
                        <span className="text-gray-500 line-through text-sm">₹{book.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(book)}
                    disabled={!book.inStock}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#f4d03f] text-[#0F0616] hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {book.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-400 text-xl">No books found matching your criteria</p>
            </div>
          )}
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Books;
