interface TipBoxProps {
  variant: 'tip' | 'warning' | 'info' | 'budget'
  title?: string
  children: React.ReactNode
}

const variantStyles = {
  tip: {
    border: 'border-l-4 border-l-accent',
    bg: 'bg-accent-light',
    icon: '💡',
    defaultTitle: 'Tip',
  },
  warning: {
    border: 'border-l-4 border-l-warning',
    bg: 'bg-warning-light',
    icon: '⚠️',
    defaultTitle: 'Warning',
  },
  info: {
    border: 'border-l-4 border-l-info',
    bg: 'bg-info-light',
    icon: 'ℹ️',
    defaultTitle: 'Info',
  },
  budget: {
    border: 'border-l-4 border-l-success',
    bg: 'bg-success-light',
    icon: '💰',
    defaultTitle: 'Budget Tip',
  },
}

export function TipBox({ variant, title, children }: TipBoxProps) {
  const styles = variantStyles[variant]

  return (
    <aside className={`${styles.border} ${styles.bg} rounded-r-lg p-6 my-8`}>
      <div className="flex items-start gap-3">
        <span className="text-xl" role="img" aria-hidden="true">
          {styles.icon}
        </span>
        <div>
          <p className="font-medium text-foreground mb-2">
            {title || styles.defaultTitle}
          </p>
          <div className="text-foreground-secondary">
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default TipBox
