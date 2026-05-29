import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { MobileShop } from '@/components/mobile/MobileShop';
import { Loader2 } from 'lucide-react';

/**
 * Journals renders ONLY real Supabase products in the `journals` category.
 * No mock fallbacks — when the catalog is empty (or still loading) the user
 * sees a clear empty / loading state instead of fake titles.
 */
const PLACEHOLDER_IMG = '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png';

const Journals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const journalData = products
    .filter((p) => p.category === 'journals')
    .map((p) => ({
      id: p.id,
      title: p.title,
      year: p.created_at ? new Date(p.created_at).getFullYear().toString() : new Date().getFullYear().toString(),
      type: 'Journal',
      image: p.image_url && p.image_url.trim() ? p.image_url : PLACEHOLDER_IMG,
      description: p.description || 'Comprehensive legal resource for professionals.',
      price: p.price,
      inStock: p.stock > 0,
    }));

  const types = ['All', 'Digest', 'Handbook', 'Bare Act', 'Manual', 'Journal'];

  // Build the year list dynamically from real data so admins don't need
  // to ship a code change every time a new year of journals is added.
  const yearsFromData = Array.from(new Set(journalData.map((j) => j.year))).sort((a, b) => Number(b) - Number(a));
  const years = ['All', ...yearsFromData];

  const filteredJournals = journalData.filter((journal) => {
    const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || journal.type === selectedType;
    const matchesYear = selectedYear === 'All' || journal.year === selectedYear;
    return matchesSearch && matchesType && matchesYear;
  });

  const handleJournalClick = (journalId: string) => navigate(`/journal/${journalId}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0616] to-[#1a0a2e] dark:from-gray-900 dark:to-gray-800">
      <Navigation mobileTitle="Journals" hideMobileSearchIcon />

      {/* Mobile-first journals (< md) */}
      <MobileShop initialCategory="journals" lockCategory />

      {/* Desktop / tablet (≥ md) */}
      <main className="hidden md:block pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-serif font-bold text-[#D4AF37] mb-4">
              📘 Our Journals
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore our comprehensive collection of legal journals, digests, and handbooks
            </p>
          </div>

          {/* Filters */}
          <div className="bg-[#1a0a2e] dark:bg-gray-800 rounded-xl p-6 mb-8 border border-[#D4AF37]/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[#D4AF37] mb-2 font-semibold">Search</label>
                <Input
                  placeholder="Search journals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#0F0616] dark:bg-gray-700 border-[#D4AF37]/30 text-white"
                />
              </div>
              <div>
                <label className="block text-[#D4AF37] mb-2 font-semibold">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#0F0616] dark:bg-gray-700 border border-[#D4AF37]/30 text-white"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#D4AF37] mb-2 font-semibold">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#0F0616] dark:bg-gray-700 border border-[#D4AF37]/30 text-white"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('All');
                    setSelectedYear('All');
                  }}
                  variant="outline"
                  className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0616]"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Loading / empty / no-match */}
          {loading && journalData.length === 0 ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-[#D4AF37]" />
              <p className="text-gray-400 text-base">Loading journals…</p>
            </div>
          ) : journalData.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📘</div>
              <p className="text-2xl font-serif font-bold text-[#D4AF37] mb-2">No journals published yet</p>
              <p className="text-gray-400 max-w-md mx-auto">
                The editorial team is preparing the next edition. Check back soon, or call us at +91 94370 19131 to enquire about subscriptions.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredJournals.map((journal, index) => (
                  <div
                    key={journal.id}
                    className="group bg-[#1a0a2e] dark:bg-gray-800 rounded-xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#D4AF37]/20 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleJournalClick(journal.id)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={journal.image}
                        alt={journal.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0616]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#0F0616] px-3 py-1 rounded-full font-semibold text-sm">
                        {journal.year}
                      </div>
                      <div className="absolute top-4 left-4 bg-[#0F0616]/80 text-[#D4AF37] px-3 py-1 rounded-full font-semibold text-sm">
                        {journal.type}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-[#D4AF37] mb-2 group-hover:text-[#f4d03f] transition-colors">
                        {journal.title}
                      </h3>
                      <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                        {journal.description}
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#f4d03f] text-[#0F0616] hover:scale-105 transition-all duration-300 font-semibold"
                        disabled={!journal.inStock}
                      >
                        {journal.inStock ? 'View Details' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredJournals.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-400 text-xl">No journals match your filters</p>
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

export default Journals;
