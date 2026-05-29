import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { MobileShop } from '@/components/mobile/MobileShop';
import { Loader2 } from 'lucide-react';

/**
 * Books renders ONLY real Supabase products in the `books` category.
 * No mock fallback titles. Empty state and loading state are explicit.
 */
const PLACEHOLDER_IMG = '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png';

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  const bookData = products
    .filter((p) => p.category === 'books')
    .map((p) => ({
      id: p.id,
      title: p.title,
      category: p.author || 'Books',
      price: p.price,
      originalPrice: p.price * 1.2,
      image: p.image_url && p.image_url.trim() ? p.image_url : PLACEHOLDER_IMG,
      description: p.description || '',
      rating: 4.5,
      inStock: p.stock > 0,
    }));

  const categories = ['All', 'Criminal Law', 'Civil Law', 'Constitutional Law', 'Odisha Law', 'Family Law', 'Tax Law'];
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
  ];

  let filteredBooks = bookData.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  filteredBooks = filteredBooks.sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.title.localeCompare(b.title);
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const handleAddToCart = (book: typeof bookData[number]) => {
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      category: book.category,
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
                  {categories.map((category) => (
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
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading / empty / no-match states */}
          {loading && bookData.length === 0 ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-[#D4AF37]" />
              <p className="text-gray-400 text-base">Loading the catalog…</p>
            </div>
          ) : bookData.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-2xl font-serif font-bold text-[#D4AF37] mb-2">The catalog is being prepared</p>
              <p className="text-gray-400 max-w-md mx-auto">
                Our team is uploading the latest legal books. Check back soon, or call us at +91 94370 19131 for direct orders.
              </p>
            </div>
          ) : (
            <>
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
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
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

                      {!book.inStock && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                          Out of Stock
                        </div>
                      )}

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
                  <p className="text-gray-400 text-xl">No books match your search</p>
                </div>
              )}
            </>
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
