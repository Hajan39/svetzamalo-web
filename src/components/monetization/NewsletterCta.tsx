import { useState } from 'react'

interface NewsletterCtaProps {
  title?: string
  description?: string
  buttonText?: string
  placeholder?: string
  disclaimer?: string
  className?: string
}

export function NewsletterCta({
  title = "Stay Updated",
  description = "Get weekly travel tips, deals, and destination guides delivered to your inbox.",
  buttonText = "Subscribe",
  placeholder = "Your email address",
  disclaimer = "No spam, unsubscribe anytime.",
  className = ""
}: NewsletterCtaProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)
    setEmail('')
  }

  if (isSubmitted) {
    return (
      <div className={`text-center p-6 bg-success-light border border-success rounded-lg ${className}`}>
        <div className="text-2xl mb-2">✅</div>
        <h3 className="text-lg font-semibold text-success mb-2">Thanks for subscribing!</h3>
        <p className="text-success text-sm">Check your inbox for a confirmation email.</p>
      </div>
    )
  }

  return (
    <div className={`bg-primary-light rounded-xl p-5 sm:p-6 md:p-8 text-center ${className}`}>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 md:mb-4">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-foreground-secondary mb-6 md:mb-8 max-w-md mx-auto">
        {description}
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : buttonText}
          </button>
        </div>
        {disclaimer && (
          <p className="text-xs text-foreground-muted mt-4">
            {disclaimer}
          </p>
        )}
      </form>
    </div>
  )
}