import { useState } from 'react';
import { X, MapPin, Clock, Phone, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { id: 1, src: "/lovable-uploads/d90dde4b-fcdf-452e-9612-348fa7878292.png", alt: "Legal Associates Store Front", title: "Our Main Store", subtitle: "Cuttack, Odisha" },
  { id: 2, src: "/lovable-uploads/ea49d3b2-43d9-4804-a469-5140b187a2cd.png", alt: "Book Collection Shelves", title: "Extensive Collection", subtitle: "10,000+ Books" },
  { id: 3, src: "/lovable-uploads/05aad5e3-2ff1-4e0e-b661-9e54d1abc8f8.png", alt: "Book Storage Area", title: "Organized Storage", subtitle: "Easy Access" },
  { id: 4, src: "/lovable-uploads/3aae5ba8-c193-41c2-9091-ae565a588bd4.png", alt: "Book Aisle", title: "Browse In-Store", subtitle: "Personal Service" },
  { id: 5, src: "/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png", alt: "Legal Books Stack", title: "Premium Quality", subtitle: "Trusted Publishers" },
  { id: 6, src: "/lovable-uploads/cef2bd9f-6509-4ace-be37-df626c82073e.png", alt: "Archive Collection", title: "Historical Archives", subtitle: "Rare Editions" }
];

const storeInfo = {
  address: "Main Road, Cuttack, Odisha 753001",
  hours: "Mon-Sat: 10:00 AM - 8:00 PM",
  phone: "+91 XXXXX XXXXX",
  mapUrl: "https://maps.google.com"
};

export const StoreGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % galleryImages.length 
      : (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[newIndex].id);
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#F8F9FA' }}>
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Visit Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6" style={{ color: '#2D3E50' }}>
              Experience Our <span style={{ color: '#D4AF37' }}>Store</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: '#666666' }}>
              Step inside our modern legal bookstore in the heart of Cuttack. Browse through thousands of legal publications with expert guidance.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                  <MapPin className="w-6 h-6" style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#2D3E50' }}>Location</p>
                  <p className="text-sm" style={{ color: '#666666' }}>{storeInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                  <Clock className="w-6 h-6" style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#2D3E50' }}>Working Hours</p>
                  <p className="text-sm" style={{ color: '#666666' }}>{storeInfo.hours}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                  <Phone className="w-6 h-6" style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#2D3E50' }}>Contact</p>
                  <p className="text-sm" style={{ color: '#666666' }}>{storeInfo.phone}</p>
                </div>
              </div>
            </div>

            <a href={storeInfo.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105" style={{ background: '#2D3E50', color: '#FFFFFF' }}>
              Get Directions <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {galleryImages.slice(0, 4).map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${index === 0 ? 'col-span-2 h-64' : 'h-48'}`}
                onClick={() => setSelectedImage(image.id)}
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
                style={{ boxShadow: hoveredImage === image.id ? '0 20px 40px rgba(45, 62, 80, 0.2)' : '0 4px 20px rgba(0,0,0,0.1)' }}
              >
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-700" style={{ transform: hoveredImage === image.id ? 'scale(1.1)' : 'scale(1)' }} />
                <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(45, 62, 80, 0.8) 0%, transparent 60%)', opacity: hoveredImage === image.id ? 1 : 0.6 }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif font-bold text-lg" style={{ color: '#FFFFFF' }}>{image.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{image.subtitle}</p>
                </div>
                {hoveredImage === image.id && (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center animate-scale-in" style={{ background: '#D4AF37' }}>
                    <ExternalLink className="w-5 h-5" style={{ color: '#2D3E50' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.slice(2).map((image) => (
            <div key={image.id} className="relative overflow-hidden rounded-xl cursor-pointer h-40 transition-all duration-500 hover:scale-105" onClick={() => setSelectedImage(image.id)} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45, 62, 80, 0.6) 0%, transparent 60%)' }} />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(16, 24, 32, 0.95)' }} onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <X className="w-6 h-6" style={{ color: '#FFFFFF' }} />
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <ChevronLeft className="w-6 h-6" style={{ color: '#FFFFFF' }} />
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <ChevronRight className="w-6 h-6" style={{ color: '#FFFFFF' }} />
          </button>

          <div className="max-w-5xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
            <img src={galleryImages.find(img => img.id === selectedImage)?.src} alt={galleryImages.find(img => img.id === selectedImage)?.alt} className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
            <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <h3 className="font-serif font-bold text-2xl" style={{ color: '#FFFFFF' }}>{galleryImages.find(img => img.id === selectedImage)?.title}</h3>
              <p style={{ color: '#D4AF37' }}>{galleryImages.find(img => img.id === selectedImage)?.subtitle}</p>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((img) => (
              <button key={img.id} onClick={(e) => { e.stopPropagation(); setSelectedImage(img.id); }} className="w-3 h-3 rounded-full transition-all duration-300" style={{ background: selectedImage === img.id ? '#D4AF37' : 'rgba(255,255,255,0.3)', transform: selectedImage === img.id ? 'scale(1.3)' : 'scale(1)' }} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
