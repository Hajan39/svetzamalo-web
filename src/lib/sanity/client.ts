import {createClient} from '@sanity/client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET

if (!projectId) throw new Error('[sanity] PUBLIC_SANITY_PROJECT_ID is not set')
if (!dataset) throw new Error('[sanity] PUBLIC_SANITY_DATASET is not set')

export const SANITY_PROJECT_ID = projectId
export const SANITY_DATASET = dataset
export const SANITY_API_VERSION = import.meta.env.PUBLIC_SANITY_API_VERSION || '2025-01-01'

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  token: import.meta.env.SANITY_API_TOKEN,
  useCdn: !import.meta.env.SANITY_API_TOKEN,
})
