import type { ArticleSection, ContentBlock } from '@/types'

interface ArticleRendererProps {
  sections?: ArticleSection[]
  contentBlocks?: ContentBlock[]
}

/**
 * ArticleRenderer - Optimized component for long-form reading
 *
 * Features:
 * - Excellent typography with Tailwind
 * - Support for headings, paragraphs, lists, images
 * - No ads injected between content
 * - Focus on readability and flow
 * - Responsive design
 */
export function ArticleRenderer({ sections, contentBlocks }: ArticleRendererProps) {
  // If contentBlocks are provided, use the structured renderer
  if (contentBlocks && contentBlocks.length > 0) {
    return <StructuredArticleRenderer contentBlocks={contentBlocks} />
  }

  // Fall back to simple section renderer for backward compatibility
  if (sections && sections.length > 0) {
    return <SimpleSectionRenderer sections={sections} />
  }

  return null
}

/**
 * Structured Article Renderer - Handles content blocks
 */
function StructuredArticleRenderer({ contentBlocks }: { contentBlocks: ContentBlock[] }) {
  return (
    <div className="article-content max-w-none">
      {contentBlocks.map((block, index) => (
        <ContentBlockRenderer key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  )
}

/**
 * Simple Section Renderer - For backward compatibility
 */
function SimpleSectionRenderer({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="article-content space-y-8 max-w-none">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-foreground mb-6 leading-tight">
            {section.title}
          </h2>
          <div className="max-w-none text-foreground leading-relaxed">
            <p className="text-lg leading-loose mb-4">{section.content}</p>
          </div>
        </section>
      ))}
    </div>
  )
}

/**
 * Content Block Renderer - Individual block types
 */
function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlockRenderer block={block} />
    case 'text':
      return <TextBlockRenderer block={block} />
    case 'image':
      return <ImageBlockRenderer block={block} />
    case 'tip':
      return <TipBlockRenderer block={block} />
    case 'list':
      return <ListBlockRenderer block={block} />
    case 'monetization':
      // Skip monetization blocks for clean reading experience
      return null
    default:
      return null
  }
}

/**
 * Heading Block - Clean, hierarchical typography
 */
function HeadingBlockRenderer({ block }: { block: ContentBlock & { type: 'heading' } }) {
  const className = {
    2: 'text-3xl font-bold text-foreground mb-6 leading-tight scroll-mt-24',
    3: 'text-2xl font-semibold text-foreground mb-4 leading-tight mt-8',
    4: 'text-xl font-semibold text-foreground mb-3 leading-tight mt-6',
  }[block.level]

  const Component = `h${block.level}` as keyof JSX.IntrinsicElements

  return (
    <Component id={block.id} className={className}>
      {block.text}
    </Component>
  )
}

/**
 * Text Block - Optimized paragraph typography
 */
function TextBlockRenderer({ block }: { block: ContentBlock & { type: 'text' } }) {
  return (
    <p className="text-lg text-foreground-secondary leading-loose mb-6 last:mb-0">
      {block.content}
    </p>
  )
}

/**
 * Image Block - Clean, readable image presentation with performance optimization
 */
function ImageBlockRenderer({ block }: { block: ContentBlock & { type: 'image' } }) {
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg bg-background-secondary">
        <img
          src={block.src}
          alt={block.alt}
          className="w-full h-auto object-cover transition-opacity duration-300"
          loading="lazy"
          decoding="async"
          // Performance: Modern image attributes
          fetchPriority={block.priority ? 'high' : 'auto'}
          // SEO: Add structured data for images
          itemProp="image"
        />
      </div>
      {block.caption && (
        <figcaption className="text-sm text-foreground-muted mt-3 text-center italic" itemProp="caption">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Tip Block - Contextual information with good visual hierarchy
 */
function TipBlockRenderer({ block }: { block: ContentBlock & { type: 'tip' } }) {
  const styles = {
    tip: 'border-primary/20 bg-primary-light',
    warning: 'border-warning bg-warning-light',
    info: 'border-info bg-info-light',
    budget: 'border-success bg-success-light',
  }

  const icons = {
    tip: '💡',
    warning: '⚠️',
    info: 'ℹ️',
    budget: '💰',
  }

  return (
    <div className={`border-l-4 p-6 my-6 rounded-r-lg ${styles[block.variant]}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0" aria-hidden="true">
          {icons[block.variant]}
        </span>
        <div className="flex-1">
          {block.title && (
            <h4 className="font-semibold text-foreground mb-2">
              {block.title}
            </h4>
          )}
          <div className="text-foreground-secondary leading-relaxed">
            <p>{block.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * List Block - Clean, readable list formatting
 */
function ListBlockRenderer({ block }: { block: ContentBlock & { type: 'list' } }) {
  const Component = block.style === 'numbered' ? 'ol' : 'ul'

  return (
    <Component className={`my-6 ml-6 ${block.style === 'numbered' ? 'list-decimal' : 'list-disc'} space-y-2`}>
      {block.items.map((item) => (
        <li key={item} className="text-lg text-foreground-secondary leading-relaxed pl-2">
          {item}
        </li>
      ))}
    </Component>
  )
}

export default ArticleRenderer