import { cn } from '@/lib/utils'

/**
 * Content container with max-width constraints
 * 
 * Sizes:
 * - narrow (768px): Article content, single-column layouts
 * - wide (1024px): Default, multi-column content
 * - full (1280px): Headers, footers, wide layouts
 * 
 * @example
 * // Article page - narrow for optimal reading
 * <Container size="narrow">
 *   <article>...</article>
 * </Container>
 * 
 * // Destinations grid - wide for cards
 * <Container size="wide">
 *   <div className="grid grid-cols-3">...</div>
 * </Container>
 */

interface ContainerProps {
  children: React.ReactNode
  /** Width constraint: narrow (768px), wide (1024px), full (1280px) */
  size?: 'narrow' | 'wide' | 'full'
  /** Additional CSS classes */
  className?: string
  /** HTML element to render as */
  as?: 'div' | 'section' | 'article' | 'main'
}

const SIZE_CLASSES = {
  narrow: 'container-narrow', // 768px - optimal for reading
  wide: 'container-wide',     // 1024px - default
  full: 'container-full',     // 1280px - full width
} as const

export function Container({ 
  children, 
  size = 'wide', 
  className,
  as: Component = 'div' 
}: ContainerProps) {
  return (
    <Component className={cn(SIZE_CLASSES[size], className)}>
      {children}
    </Component>
  )
}

export default Container
