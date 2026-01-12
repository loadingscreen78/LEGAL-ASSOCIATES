
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';

const fallbackJournalData = [
  {
    id: 1,
    title: "Odisha Law Journal",
    year: "2024",
    type: "Digest",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    description: "Comprehensive legal digest covering Odisha state laws"
  },
  {
    id: 2,
    title: "Criminal Law Review",
    year: "2024",
    type: "Handbook",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop",
    description: "Latest updates in criminal law procedures"
  },
  {
    id: 3,
    title: "Civil Procedure Code",
    year: "2023",
    type: "Bare Act",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop",
    description: "Complete civil procedure code with amendments"
  },
  {
    id: 4,
    title: "Constitutional Law Digest",
    year: "2024",
    type: "Digest",
    image: "https://images.unsplash.com/photo-1589829545856-d10d85525114?w=400&h=500&fit=crop",
    description: "Constitutional law principles and landmark cases"
  },
  {
    id: 5,
    title: "Family Law Handbook",
    year: "2023",
    type: "Handbook",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=500&fit=crop",
    description: "Comprehensive guide to family law matters"
  },
  {
    id: 6,
    title: "Tax Laws Manual",
    year: "2024",
    type: "Manual",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=500&fit=crop",
    description: "Updated tax laws and regulations"
  }
];

const Journals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  console.log('📘 Journals Page - Products from hook:', products.length, products);
  console.log('📘 Journals Page - Loading:', loading);

  // Use Firebase products (journals only) if available, otherwise use fallback
  const journalsFromFirebase = products.filter(p => p.category === 'journals');
  console.log('📘 Journals filtered from Firebase:', journalsFromFirebase.length);

  const journalData = journalsFromFirebase.length > 0 
    ? journalsFromFirebase.map((p, index) => {
        // Generate a simple numeric ID from the index
        const numericId = index + 1;
        console.log('📘 Mapping journal:', {
          firebaseId: p.id,
          numericId: numericId,
          title: p.title,
          image_url: p.image_url,
          description: p.description,
          has_image: !!p.image_url
        });
        return {
          id: numericId,
          firebaseId: p.id, // Keep original Firebase ID for matching
          title: p.title,
          year: new Date().getFullYear().toString(),
          type: 'Journal',
          image: p.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
          description: p.description || 'No description available',
          price: p.price,
          inStock: p.stock > 0
        };
      })
    : fallbackJournalData;

  console.log('📘 Journals Page - Final journalData:', journalData.length, 'items');

  const types = ['All', 'Digest', 'Handbook', 'Bare Act', 'Manual', 'Journal'];
  const years = ['All', '2024', '2023', '2022'];

  const filteredJournals = journalData.filter(journal => {
    const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || journal.type === selectedType;
    const matchesYear = selectedYear === 'All' || journal.year === selectedYear;
    return matchesSearch && matchesType && matchesYear;
  });

  const handleJournalClick = (journalId: number) => {
    // Navigate to journal details page
    navigate(`/journal/${journalId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0616] to-[#1a0a2e] dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <main className="pt-24 pb-12">
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
                  {types.map(type => (
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
                  {years.map(year => (
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

          {/* Journal Grid */}
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
                  <p className="text-gray-300 mb-4 text-sm">
                    {journal.description}
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#f4d03f] text-[#0F0616] hover:scale-105 transition-all duration-300 font-semibold"
                    disabled={'inStock' in journal && !journal.inStock}
                  >
                    {'inStock' in journal && !journal.inStock ? 'Out of Stock' : 'View Details'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredJournals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-400 text-xl">No journals found matching your criteria</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Journals;
