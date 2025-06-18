
'use client'

// The Sanity Studio component
import {NextStudio} from 'next-sanity/studio'

// Imports the Sanity config file
// Corrected path: from src/app/studio/[[...tool]]/page.tsx to root/sanity.config.ts
import config from '../../../../../sanity.config'

export default function StudioPage() {
  // Renders the Sanity Studio using the configuration
  // The `params` object is not directly used here as NextStudio handles routing internally.
  return <NextStudio config={config} />
}

// This function is used by Next.js to generate static paths if you're using SSG.
// For a dynamic route like [[...tool]], it tells Next.js what are the possible values for 'tool'.
// For the base /studio path, 'tool' would be an empty array.
export function generateStaticParams() {
  return [{ tool: [] }]; // Ensures the /studio path itself is generated
}

// Opt-out of caching for the studio route, ensuring it's always dynamic
export const dynamic = 'force-dynamic';
