import { Button } from '@/components/ui/button';
import { EcommerceTemplate } from '@/templates/EcommerceTemplate';
import type { UseIndexLogicReturn } from '@/components/headless/HeadlessIndex';
import { Link } from 'react-router-dom';

/**
 * EDITABLE UI - IndexUI
 * 
 * Apple-style homepage layout
 */

interface IndexUIProps {
  logic: UseIndexLogicReturn;
}

export const IndexUI = ({ logic }: IndexUIProps) => {
  const {
    filteredProducts,
    loading,
  } = logic;

  if (loading) {
    return (
      <EcommerceTemplate showCart={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </EcommerceTemplate>
    );
  }

  // Ordenar productos para mostrarlos en el orden correcto
  const phone = filteredProducts.find(p => p.title.includes('Phone'));
  const watch = filteredProducts.find(p => p.title.includes('WATCH'));
  const pad = filteredProducts.find(p => p.title.includes('Pad'));
  const laptop = filteredProducts.find(p => p.title.includes('Book'));
  const earbuds = filteredProducts.find(p => p.title.includes('Pods'));

  const products = [phone, watch, pad, laptop, earbuds].filter(Boolean);

  // Colores de fondo alternados estilo Apple
  const backgrounds = ['bg-[#f5f5f7]', 'bg-white', 'bg-[#d6ebf5]', 'bg-black', 'bg-white'];

  return (
    <EcommerceTemplate showCart={true}>
      {/* Hero Sections - Apple Style */}
      <div className="w-full">
        {products.map((product, index) => {
          if (!product) return null;
          
          const bgClass = backgrounds[index] || 'bg-white';
          const isBlack = bgClass === 'bg-black';
          const isBlue = bgClass === 'bg-[#d6ebf5]';
          const textColor = isBlack ? 'text-white' : 'text-[#1d1d1f]';
          const subtitleColor = isBlack ? 'text-gray-300' : 'text-[#6e6e73]';

          return (
            <section key={product.id} className={`${bgClass} w-full py-12 md:py-16`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title Area */}
                <div className="text-center mb-6">
                  {product.title.includes('WATCH') ? (
                    <h2 className={`sf-pro-display text-3xl md:text-5xl font-semibold ${textColor} mb-2`}>
                      <span className="inline-block align-middle mr-2">
                        <img 
                          src="https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/object/public/message-images/temp_1769113778423_38f706ff/1769113778424-zqetvxcwiyb.png"
                          alt=""
                          className="h-10 md:h-12 w-auto inline-block"
                          style={{ filter: isBlack ? 'brightness(0) invert(1)' : 'none' }}
                        />
                      </span>
                      <span style={{ fontSize: '25px', fontWeight: '900' }} className="inline-block align-middle">WATCH SERIES 11</span>
                    </h2>
                  ) : product.title.includes('Pad') ? (
                    <h2 className={`sf-pro-display text-3xl md:text-5xl font-semibold ${textColor} mb-2`}>
                      <span className="inline-block align-middle mr-2">
                        <img 
                          src="https://ptgmltivisbtvmoxwnhd.supabase.co/storage/v1/object/public/message-images/temp_1769113778423_38f706ff/1769113778424-zqetvxcwiyb.png"
                          alt=""
                          className="h-10 md:h-12 w-auto inline-block"
                        />
                      </span>
                      <span className="inline-block align-middle">
                        Pad <span className="font-light italic">air</span>
                      </span>
                    </h2>
                  ) : (
                    <h2 className={`sf-pro-display text-3xl md:text-5xl font-semibold ${textColor} mb-2`}>
                      {product.title}
                    </h2>
                  )}
                  
                  <p style={{ fontWeight: '500', letterSpacing: '-1px', fontFamily: 'DM Sans, sans-serif' }} className={`sf-pro-text text-base md:text-xl ${subtitleColor} max-w-3xl mx-auto font-normal leading-relaxed`}>
                    {product.description}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row items-center justify-center gap-4 mb-8">
                  <Link to={`/productos/${product.slug}`}>
                    <Button 
                      size="lg" 
                      className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full px-6 font-normal"
                    >
                      Más información
                    </Button>
                  </Link>
                  <Link to={`/productos/${product.slug}`}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className={`rounded-full px-6 font-normal ${
                        isBlack 
                          ? 'border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white' 
                          : 'border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white'
                      }`}
                    >
                      Comprar
                    </Button>
                  </Link>
                </div>

                {/* Product Image */}
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-2xl">
                    <img 
                      src={product.images?.[0]} 
                      alt={product.title}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </EcommerceTemplate>
  );
};