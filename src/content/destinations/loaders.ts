import type { Destination } from '@/types'
import { destinations } from './data'

export function getDestinations(): Destination[] {
  return destinations
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug)
}

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id)
}

export function getDestinationsByContinent(continent: string): Destination[] {
  return destinations.filter((d) => d.continent === continent)
}
