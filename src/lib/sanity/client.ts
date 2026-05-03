import {sanityClient} from 'sanity:client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET

if (!projectId) throw new Error('[sanity] PUBLIC_SANITY_PROJECT_ID is not set')
if (!dataset) throw new Error('[sanity] PUBLIC_SANITY_DATASET is not set')

export const SANITY_PROJECT_ID = projectId
export const SANITY_DATASET = dataset
export const SANITY_API_VERSION = import.meta.env.PUBLIC_SANITY_API_VERSION || '2025-01-01'

export {sanityClient}
