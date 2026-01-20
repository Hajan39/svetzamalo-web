/**
 * Content block types for structured article content
 */

export interface HeadingBlock {
  type: 'heading'
  id: string
  level: 2 | 3 | 4
  text: string
}

export interface TextBlock {
  type: 'text'
  content: string
}

export interface ImageBlock {
  type: 'image'
  src: string
  alt: string
  caption?: string
}

export interface TipBlock {
  type: 'tip'
  variant: 'tip' | 'warning' | 'info' | 'budget'
  title?: string
  content: string
}

export interface ListBlock {
  type: 'list'
  style: 'bullet' | 'numbered'
  items: string[]
}

export interface MonetizationPlaceholder {
  type: 'monetization'
  slotId: string
}

export type ContentBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | TipBlock
  | ListBlock
  | MonetizationPlaceholder
