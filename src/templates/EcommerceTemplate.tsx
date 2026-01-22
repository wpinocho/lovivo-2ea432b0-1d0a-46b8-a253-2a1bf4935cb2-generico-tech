import { ReactNode } from 'react'
import { PageTemplate } from './PageTemplate'
import { BrandLogoLeft } from '@/components/BrandLogoLeft'
import { SocialLinks } from '@/components/SocialLinks'
import { FloatingCart } from '@/components/FloatingCart'
import { ProfileMenu } from '@/components/ProfileMenu'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Search, ShoppingBag, Menu } from 'lucide-react'
import { useCartUISafe } from '@/components/CartProvider'
import { useCart } from '@/contexts/CartContext'
import { useCollections } from '@/hooks/useCollections'
import { Input } from '@/components/ui/input'
import { ScrollLink } from '@/components/ScrollLink'

/**
 * EDITABLE TEMPLATE - EcommerceTemplate
 * 
 * Template específico para páginas de ecommerce con header, footer y cart.
 * El agente IA puede modificar completamente el diseño, colores, layout.
 */

interface EcommerceTemplateProps {
  children: ReactNode
  pageTitle?: string
  showCart?: boolean
  className?: string
  headerClassName?: string
  footerClassName?: string
  layout?: 'default' | 'full-width' | 'centered'
}

export const EcommerceTemplate = ({
  children,
  pageTitle,
  showCart = true,
  className,
  headerClassName,
  footerClassName,
  layout = 'default'
}: EcommerceTemplateProps) => {
  const cartUI = useCartUISafe()
  const openCart = cartUI?.openCart ?? (() => {})
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()
  const { hasCollections, loading: loadingCollections } = useCollections()

  const header = (
    <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 ${headerClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <BrandLogoLeft />

          {/* Right Icons - Apple Style */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent h-9 w-9"
              aria-label="Buscar"
            >
              <Search className="h-[18px] w-[18px] text-[#1d1d1f]" />
            </Button>
            
            {showCart && (
              <Button
                variant="ghost"
                size="icon"
                onClick={openCart}
                className="relative hover:bg-transparent h-9 w-9"
                aria-label="Ver carrito"
              >
                <ShoppingBag className="h-[18px] w-[18px] text-[#1d1d1f]" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent h-9 w-9"
              aria-label="Menú"
            >
              <Menu className="h-[18px] w-[18px] text-[#1d1d1f]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const footer = (
    <div className={`bg-[#f5f5f7] text-[#1d1d1f] py-8 ${footerClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-[#6e6e73]">
          <p>Copyright © 2025 Tu Tienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <PageTemplate 
        header={header}
        footer={footer}
        className={className}
        layout="full-width"
      >
        {/* Add top padding to account for fixed header */}
        <div className="pt-12">
          {children}
        </div>
      </PageTemplate>
      
      {showCart && <FloatingCart />}
    </>
  )
}