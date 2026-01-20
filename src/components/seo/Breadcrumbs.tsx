import { Link } from '@tanstack/react-router'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-foreground-muted">
        <li>
          <Link to="/" className="hover:text-accent transition-colors">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link to={item.href} className="hover:text-accent transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground-secondary">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
