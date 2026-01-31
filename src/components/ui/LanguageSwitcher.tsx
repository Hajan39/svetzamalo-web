import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, ChevronDown } from 'lucide-react'
import { i18n, SUPPORTED_LOCALES, type SupportedLocale } from '@/lib/i18n'

interface LanguageSwitcherProps {
    variant?: 'dropdown'
    showFlags?: boolean
    className?: string
}

export function LanguageSwitcher({
    showFlags = true,
    className = ''
}: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [locale, setLocale] = useState<SupportedLocale>('en')

    useEffect(() => {
        // Load current locale from i18n
        setLocale(i18n.getCurrentLocale())

        // Subscribe to locale changes
        const unsubscribe = i18n.subscribe(setLocale)
        return unsubscribe
    }, [])

    const handleLanguageChange = (newLocale: SupportedLocale) => {
        // Set locale - this will automatically save to localStorage
        i18n.setLocale(newLocale)
        setIsOpen(false)
        // No navigation needed - locale is stored in localStorage and will persist
    }

    // Default dropdown variant
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-secondary-light rounded-lg transition-colors ${className}`}
            >
                {showFlags && (
                    <span className="text-lg">
                        {SUPPORTED_LOCALES.find(l => l.code === locale)?.flag}
                    </span>
                )}
                <span className="uppercase">{locale}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute top-full mt-1 right-0 z-50 min-w-32 bg-background border border-border rounded-lg shadow-lg">
                        {SUPPORTED_LOCALES.map((localeOption) => (
                            <button
                                key={localeOption.code}
                                onClick={() => handleLanguageChange(localeOption.code)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary-light transition-colors ${locale === localeOption.code ? 'bg-primary-light text-primary' : ''
                                    }`}
                            >
                                {showFlags && (
                                    <span className="text-base">{localeOption.flag}</span>
                                )}
                                <span className="text-sm">{localeOption.name}</span>
                                {locale === localeOption.code && (
                                    <Check className="w-4 h-4 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// ============================================================================
// LOCALIZED LINK COMPONENT
// ============================================================================

interface LocalizedLinkProps {
    to: string
    children: React.ReactNode
    className?: string
    [key: string]: any
}

/**
 * Localized Link Component
 *
 * Automatically adds locale prefix to routes for non-default locales.
 */
export function LocalizedLink({ to, children, className, ...props }: LocalizedLinkProps) {
    // For now, use 'en' as default locale (no prefix)
    // TODO: Get current locale from context when implemented
    const currentLocale = 'en'

    // Get localized path
    const localizedPath = currentLocale === 'en' ? to : `/${currentLocale}${to}`

    return (
        <Link to={localizedPath} className={className} {...props}>
            {children}
        </Link>
    )
}