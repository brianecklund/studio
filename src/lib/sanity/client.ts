
import {createClient, type SanityClient} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

if (!projectId) {
  throw new Error("The environment variable NEXT_PUBLIC_SANITY_PROJECT_ID is not set.")
}
if (!dataset) {
  throw new Error("The environment variable NEXT_PUBLIC_SANITY_DATASET is not set.")
}
if (!apiVersion) {
  throw new Error("The environment variable NEXT_PUBLIC_SANITY_API_VERSION is not set.")
}


export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: typeof document !== 'undefined', // server-side is statically generated, client-side uses CDN
  // перспектива: 'published', // Use 'previewDrafts' for draft mode
})

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}
