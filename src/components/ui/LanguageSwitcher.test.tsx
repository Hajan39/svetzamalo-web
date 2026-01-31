import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LanguageSwitcher } from './LanguageSwitcher'

// Mock window.location
const mockReplace = vi.fn()
delete (window as any).location
window.location = { ...window.location, replace: mockReplace }

describe('LanguageSwitcher', () => {
  it('renders language options', () => {
    render(<LanguageSwitcher />)

    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    expect(screen.getByText('🇨🇿')).toBeInTheDocument()
    expect(screen.getByText('🇪🇸')).toBeInTheDocument()
    expect(screen.getByText('🇩🇪')).toBeInTheDocument()
  })

  it('shows dropdown when clicked', () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /switch language/i })
    fireEvent.click(button)

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Čeština')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
    expect(screen.getByText('Deutsch')).toBeInTheDocument()
  })

  it('changes language when option is selected', () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /switch language/i })
    fireEvent.click(button)

    const czechOption = screen.getByText('Čeština')
    fireEvent.click(czechOption)

    expect(mockReplace).toHaveBeenCalledWith('/cs/')
  })

  it('closes dropdown when clicking outside', () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /switch language/i })
    fireEvent.click(button)

    expect(screen.getByText('English')).toBeInTheDocument()

    // Click outside (backdrop)
    fireEvent.click(document.body)

    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })
})