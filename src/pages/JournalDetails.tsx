import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

const journalsData = {
  1: {
    id: 1,
    title: "Orissa High Court Digest",
    image: "/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png",
    description: "Comprehensive digest of Orissa High Court judgments",
    year: "2024",
    price: 799,
    story: "The Orissa High Court Digest is an essential resource for legal professionals and researchers, providing comprehensive coverage of judgments and case laws from the Orissa High Court. Stay updated with the latest legal precedents and interpretations.",
    credits: {
      chiefEditor: "Dr. Legal Expert",
      associateEditors: ["Adv. Case Law", "Adv. Judgment Analysis"],
      publisher: "Law Publications India"
    }
  },
  2: {
    id: 2,
    title: "Criminal Major Acts",
    image: "/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png",
    description: "Complete compilation of criminal law statutes",
    year: "2024",
    price: 699,
    story: "Criminal Major Acts is a complete compilation of criminal law statutes, including the Indian Penal Code, Criminal Procedure Code, and Evidence Act. This resource is invaluable for law students, practitioners, and anyone seeking a thorough understanding of criminal law.",
    credits: {
      chiefEditor: "Adv. Criminal Law",
      associateEditors: ["Dr. Statute Analysis", "Adv. Legal Amendments"],
      publisher: "Statute House India"
    }
  },
  3: {
    id: 3,
    title: "Civil Procedure Code Commentary",
    image: "/lovable-uploads/20716325-0e93-4a46-bfec-60bd22b17411.png",
    description: "In-depth analysis of Civil Procedure Code",
    year: "2023",
    price: 899,
    story: "The Civil Procedure Code Commentary offers an in-depth analysis of the Civil Procedure Code, providing insights into legal procedures, case management, and dispute resolution. This commentary is an indispensable guide for civil law practitioners and students.",
    credits: {
      chiefEditor: "Dr. Civil Law Expert",
      associateEditors: ["Adv. Procedure Analysis", "Adv. Case Management"],
      publisher: "Civil Law Publications"
    }
  },
  4: {
    id: 4,
    title: "Bare Acts Collection",
    image: "/lovable-uploads/cef2bd9f-6509-4ace-be37-df626c82073e.png",
    description: "Essential legal acts and amendments",
    year: "2024",
    price: 599,
    story: "The Bare Acts Collection is an essential compilation of legal acts and amendments, providing quick access to the most important legal statutes. This collection is a must-have for legal professionals, students, and anyone needing to reference legal acts.",
    credits: {
      chiefEditor: "Adv. Legal Compilations",
      associateEditors: ["Dr. Statute Amendments", "Adv. Act References"],
      publisher: "Law Literature House"
    }
  }
};

const JournalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [journal, setJournal] = useState<any>(null);

  useEffect(() => {
    console.log('JournalDetails - ID from URL:', id);
    console.log('JournalDetails - All products:', products);
    
    const journalId = id ? parseInt(id) : null;
    console.log('JournalDetails - Parsed ID:', journalId);
    
    // Get journals with category 'journals'
    const journals = products.filter(p => p.category === 'journals');
    console.log('Filtered journals:', journals);
    
    // Find by index (since we use index + 1 as ID in Journals page)
    const firebaseJournal = journalId ? journals[journalId - 1] : null;
    console.log('Found Firebase journal:', firebaseJournal);

    if (firebaseJournal) {
      // Map Firebase product to journal format
      const mappedJournal = {
        id: journalId,
        title: firebaseJournal.title,
        image: firebaseJournal.image_url || '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png',
        description: firebaseJournal.description || 'No description available',
        year: new Date().getFullYear().toString(),
        price: firebaseJournal.price,
        story: firebaseJournal.description || 'Comprehensive legal resource for professionals and students.',
        credits: {
          chiefEditor: firebaseJournal.author || 'Editorial Team',
          associateEditors: ['Legal Experts', 'Case Law Analysts'],
          publisher: 'Law Publications India'
        }
      };
      console.log('Setting journal to:', mappedJournal);
      setJournal(mappedJournal);
    } else if (journalId && journalId >= 1 && journalId <= 4) {
      // Fallback to hardcoded data
      console.log('Using hardcoded journal data');
      setJournal(journalsData[journalId as 1 | 2 | 3 | 4]);
    } else {
      console.log('No journal found - setting to null');
      setJournal(null);
    }
  }, [id, products]);

  if (!journal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Journal Not Found</h1>
          <Button onClick={() => navigate('/journals')}>
            Back to Journals
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `journal-${journal.id}`,
        title: journal.title,
        price: journal.price,
        image: journal.image,
        category: 'Journal'
      });
    }
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <div className="flex items-center mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/journals')}
              className="mr-4 text-foreground hover:text-accent"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Journals
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Journal Image */}
            <div className="animate-fade-in">
              <div className="relative group">
                <img 
                  src={journal.image} 
                  alt={journal.title}
                  className="w-full max-w-md mx-auto rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Journal Details */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Title and Description */}
              <div>
                <h1 className="text-4xl font-serif font-bold text-primary mb-4">
                  {journal.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {journal.description}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                    Edition {journal.year}
                  </span>
                  <span className="text-accent font-bold text-2xl">
                    ₹{journal.price}
                  </span>
                </div>
              </div>

              {/* Story Section */}
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent flex items-center">
                    📖 Journal Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {journal.story}
                  </p>
                </CardContent>
              </Card>

              {/* Credits Section */}
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent flex items-center">
                    👥 Editorial Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-primary">Chief Editor:</h4>
                      <p className="text-foreground">{journal.credits.chiefEditor}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Associate Editors:</h4>
                      <p className="text-foreground">{journal.credits.associateEditors.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Publisher:</h4>
                      <p className="text-foreground">{journal.credits.publisher}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shopping Section */}
              <Card className="border-accent/20 bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent flex items-center">
                    🛒 Order Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4">
                      <span className="text-foreground font-semibold">Quantity:</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-12 text-center font-bold text-lg text-foreground">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(quantity + 1)}
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                      <span className="text-lg font-semibold text-foreground">Total:</span>
                      <span className="text-2xl font-bold text-accent">
                        ₹{(journal.price * quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      🛒 Add to Cart ({quantity} {quantity === 1 ? 'copy' : 'copies'})
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      📦 Free shipping on orders above ₹500
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JournalDetails;
