import type { FaqItem } from '@/types'

interface ArticleFaqProps {
  items: FaqItem[]
}

export function ArticleFaq({ items }: ArticleFaqProps) {
  if (!items || items.length === 0) {
    return (
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <div className="border border-border rounded-lg p-6 bg-background-secondary">
          <p className="text-foreground-muted italic">
            FAQ section coming soon...
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <details
            key={item.id}
            className="group border border-border rounded-lg bg-background"
          >
            <summary className="cursor-pointer p-6 font-medium text-foreground hover:text-primary transition-colors list-none flex justify-between items-center">
              {item.question}
              <span className="text-foreground-muted group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-6 pb-6 text-foreground-secondary">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default ArticleFaq
