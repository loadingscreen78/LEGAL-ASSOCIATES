import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Minus, Plus, Mail, Phone, MapPin, ShoppingCart, Shield } from 'lucide-react';
import { MobileOCR } from '@/components/mobile/MobileOCR';

const OrissaCriminalReports = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [yearlyQuantity, setYearlyQuantity] = useState(1);
  const [partQuantity, setPartQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<'yearly' | 'part'>('yearly');

  const journalData = {
    title: "Orissa Criminal Reports",
    subtitle: "A Monthly Criminal Law Journal (Published on 1st of every month)",
    image: "/lovable-uploads/441f5d29-2c1e-4b01-8bf0-1ec3f24cc58d.png",
    yearlyPrice: 3200,
    partPrice: 450,
    citation: "[2025] 99 OCR",
    edition: "July 2025",
    yearsOfService: 38,
    currentYear: 2025
  };

  const handleAddToCart = () => {
    const isYearly = selectedOption === 'yearly';
    const quantity = isYearly ? yearlyQuantity : partQuantity;
    const price = isYearly ? journalData.yearlyPrice : journalData.partPrice;
    const title = isYearly ? `${journalData.title} - Yearly Subscription` : `${journalData.title} - Single Part`;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `ocr-${selectedOption}-${Date.now()}-${i}`,
        title: title,
        price: price,
        image: journalData.image,
        category: 'Journal Subscription'
      });
    }

    // Reset quantities
    setYearlyQuantity(1);
    setPartQuantity(1);
  };

  const handleProceedToCheckout = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation mobileTitle="Reports" mobileShowBack />

      {/* Mobile view (< md) */}
      <MobileOCR />

      {/* Desktop / tablet (≥ md) */}
      <main className="hidden md:block pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
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
            {/* Journal Image & Badge */}
            <div className="animate-fade-in">
              <div className="relative group">
                <img 
                  src={journalData.image} 
                  alt={journalData.title}
                  className="w-full max-w-lg mx-auto rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Years of Service Badge */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-full flex flex-col items-center justify-center text-accent-foreground shadow-xl animate-float">
                  <span className="text-2xl font-bold">{journalData.yearsOfService}</span>
                  <span className="text-xs font-semibold">YEARS</span>
                </div>

                {/* Legal Associates Logo */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  LA
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Journal Details */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Title and Badge */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">
                      {journalData.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      {journalData.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="secondary" className="bg-accent/10 text-accent px-4 py-2">
                    Edition: {journalData.edition}
                  </Badge>
                  <Badge variant="outline" className="border-primary text-primary px-4 py-2">
                    Citation: {journalData.citation}
                  </Badge>
                </div>
              </div>

              {/* Story Section */}
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent flex items-center">
                    📖 Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    Reporting all Criminal Judgements (reportable and unreported) of the Orissa High Court, Supreme Court and important other High Court decisions.
                  </p>
                </CardContent>
              </Card>

              {/* Editorial Team */}
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent flex items-center">
                    👥 Editorial Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary">Chief Editor (in charge):</h4>
                      <p className="text-foreground">Justice M. M. DAS (Retd.)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Associate Chief Editor:</h4>
                      <p className="text-foreground">Justice Dr. D. P. Choudhury (Retd.)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Printed, Published, Edited & Owned by:</h4>
                      <p className="text-foreground">Mr. Akshaya Kumar Deo</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Associate Editors:</h4>
                      <p className="text-foreground">Mr. Debiprasad Dhal, Mr. Manoranjan Acharya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Section */}
              <Card className="border-accent/20 bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent flex items-center">
                    🛒 Subscription Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Subscription Type Selector */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedOption('yearly')}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          selectedOption === 'yearly'
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="text-center">
                          <h3 className="font-bold text-lg">Yearly Subscription</h3>
                          <p className="text-2xl font-bold text-accent">₹{journalData.yearlyPrice.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">12 Monthly Issues</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setSelectedOption('part')}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          selectedOption === 'part'
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="text-center">
                          <h3 className="font-bold text-lg">Single Part</h3>
                          <p className="text-2xl font-bold text-accent">₹{journalData.partPrice}</p>
                          <p className="text-sm text-muted-foreground">Monthly Issue</p>
                        </div>
                      </button>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-center space-x-4">
                      <span className="text-foreground font-semibold">Quantity:</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (selectedOption === 'yearly') {
                              setYearlyQuantity(Math.max(1, yearlyQuantity - 1));
                            } else {
                              setPartQuantity(Math.max(1, partQuantity - 1));
                            }
                          }}
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-12 text-center font-bold text-lg text-foreground">
                          {selectedOption === 'yearly' ? yearlyQuantity : partQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (selectedOption === 'yearly') {
                              setYearlyQuantity(yearlyQuantity + 1);
                            } else {
                              setPartQuantity(partQuantity + 1);
                            }
                          }}
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
                        ₹{((selectedOption === 'yearly' ? journalData.yearlyPrice : journalData.partPrice) * 
                          (selectedOption === 'yearly' ? yearlyQuantity : partQuantity)).toLocaleString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className="w-full h-12 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-lg"
                      >
                        <ShoppingCart className="mr-2" size={20} />
                        Add to Cart
                      </Button>
                      
                      <Button
                        onClick={handleProceedToCheckout}
                        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Shield className="mr-2" size={20} />
                        Proceed to Checkout
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                      📦 Free shipping on orders above ₹500 | 🔒 Secure payment processing
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent flex items-center">
                    📞 Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-accent" size={20} />
                      <div>
                        <p className="font-semibold text-primary">LEGAL ASSOCIATES</p>
                        <p className="text-muted-foreground text-sm">(Law Book Sellers, Publishers & Suppliers)</p>
                        <p className="text-foreground">High Court Road, Cuttack-753002 (Odisha)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="text-accent" size={20} />
                      <div>
                        <p className="text-foreground">0671-2910130(O) | 94370-19131(M)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="text-accent" size={20} />
                      <div>
                        <p className="text-foreground">akshaya.ocr@gmail.com</p>
                        <p className="text-foreground">legalassociates.ocr@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default OrissaCriminalReports;
