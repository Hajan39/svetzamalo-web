import {createClient} from '@sanity/client'

export const SANITY_PROJECT_ID = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'bh335dwp'
export const SANITY_DATASET = import.meta.env.PUBLIC_SANITY_DATASET || 'production'
export const SANITY_API_VERSION = import.meta.env.PUBLIC_SANITY_API_VERSION || '2025-01-01'

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  token: import.meta.env.SANITY_API_TOKEN || import.meta.env.PUBLIC_SANITY_READ_TOKEN,
  useCdn: !import.meta.env.SANITY_API_TOKEN,
})
