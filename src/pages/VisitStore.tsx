import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MobileVisitStore } from '@/components/mobile/MobileVisitStore';

const storeImages = [
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    alt: "Store exterior",
    caption: "Our main store in Cuttack"
  },
  {
    src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
    alt: "Book shelves",
    caption: "Extensive law book collection"
  },
  {
    src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop",
    alt: "Reading area",
    caption: "Comfortable reading area for customers"
  },
  {
    src: "https://images.unsplash.com/photo-1589829545856-d10d85525114?w=800&h=600&fit=crop",
    alt: "Customer service",
    caption: "Dedicated customer service desk"
  }
];

const VisitStore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0616] to-[#1a0a2e]">
      <Navigation mobileTitle="Visit store" mobileShowBack />

      {/* Mobile view (< md) */}
      <MobileVisitStore />

      {/* Desktop / tablet (≥ md) */}
      <main className="hidden md:block pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-serif font-bold text-[#D4AF37] mb-4">
              📍 Visit Our Store
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience our extensive collection of legal books and personalized service in person
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Store Information */}
            <div className="space-y-8 animate-fade-in">
              {/* Contact Details */}
              <div className="bg-[#1a0a2e] rounded-xl p-8 border border-[#D4AF37]/20">
                <h2 className="text-3xl font-serif font-bold text-[#D4AF37] mb-6">
                  Store Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📍</div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">Address</h3>
                      <p className="text-gray-300">
                        LEGAL ASSOCIATES<br/>
                        (Law Book Sellers, Publishers & Suppliers)<br/>
                        High Court Road<br/>
                        Cuttack - 753002 (Odisha)<br/>
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📞</div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">Phone</h3>
                      <p className="text-gray-300">0671-2910130 (Office)</p>
                      <p className="text-gray-300">94370-19131 (Mobile)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">Email</h3>
                      <p className="text-gray-300">akshaya.ocr@gmail.com</p>
                      <p className="text-gray-300">legalassociates.ocr@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🕒</div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">Store Hours</h3>
                      <div className="text-gray-300 space-y-1">
                        <p><span className="font-medium">Monday - Friday:</span> 10:00 AM - 8:00 PM</p>
                        <p><span className="font-medium">Saturday:</span> 10:00 AM - 6:00 PM</p>
                        <p><span className="font-medium">Sunday:</span> 11:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    onClick={() => window.open('tel:+916712910130', '_self')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                  >
                    📞 Call Now
                  </Button>
                  <Button
                    onClick={() => window.open('https://maps.google.com/?q=Cuttack,Odisha', '_blank')}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#f4d03f] text-[#0F0616] font-semibold py-3"
                  >
                    📍 Get Directions
                  </Button>
                </div>
              </div>

              {/* Services */}
              <div className="bg-[#1a0a2e] rounded-xl p-8 border border-[#D4AF37]/20">
                <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-6">
                  Our Services
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-[#0F0616]/50 rounded-lg">
                    <span className="text-xl">📚</span>
                    <span className="text-white">Book Consultation</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-[#0F0616]/50 rounded-lg">
                    <span className="text-xl">🚚</span>
                    <span className="text-white">Home Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-[#0F0616]/50 rounded-lg">
                    <span className="text-xl">📋</span>
                    <span className="text-white">Custom Orders</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-[#0F0616]/50 rounded-lg">
                    <span className="text-xl">💳</span>
                    <span className="text-white">Multiple Payment Options</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-[#1a0a2e] rounded-xl p-6 border border-[#D4AF37]/20 h-full">
                <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-6">
                  Find Us Here
                </h2>
                
                {/* Embedded Google Map */}
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58874.08683982052!2d85.77406543125!3d20.462520599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sCuttack%2C%20Odisha!5e0!3m2!1sen!2sin!4v1639476543210!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-300"
                  ></iframe>
                </div>
                
                <div className="mt-4 p-4 bg-[#D4AF37]/10 rounded-lg">
                  <p className="text-[#D4AF37] font-semibold text-center">
                    📍 Easily accessible from all parts of Cuttack city
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Store Gallery */}
          <div className="mb-16">
            <h2 className="text-4xl font-serif font-bold text-[#D4AF37] text-center mb-12 animate-fade-in">
              Inside Our Store
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {storeImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl animate-fade-in hover:scale-105 transition-transform duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0616]/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-semibold text-lg">{image.caption}</p>
                  </div>
                  
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <div className="bg-[#D4AF37] text-[#0F0616] px-4 py-2 rounded-full font-semibold">
                      🔍 View Full Size
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Visit Us */}
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#f4d03f]/10 rounded-2xl p-8 border border-[#D4AF37]/20">
              <h2 className="text-3xl font-serif font-bold text-[#D4AF37] text-center mb-8">
                Why Visit Our Store?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-4xl mb-4">📖</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Browse Before Buying</h3>
                  <p className="text-gray-300">Examine books thoroughly before making your purchase decision</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-4xl mb-4">👨‍💼</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Expert Guidance</h3>
                  <p className="text-gray-300">Get personalized recommendations from our legal book experts</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Instant Availability</h3>
                  <p className="text-gray-300">Take your books home immediately without waiting for delivery</p>
                </div>
              </div>
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

export default VisitStore;
