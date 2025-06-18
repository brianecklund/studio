
'use client'

// The Sanity Studio component
import {NextStudio} from 'next-sanity/studio'

// Imports the Sanity config file
import config from '../../../../sanity.config'

export default function StudioPage() {
  // Renders the Sanity Studio using the configuration
  return <NextStudio config={config} />
}

// This function is used by Next.js to generate static paths if you're using SSG.
// For the base /studio path, 'tool' would be an empty array.
export function generateStaticParams() {
  return [{ tool: [] }]; // Ensures the /studio path itself is generated
}

// Opt-out of caching for the studio route, ensuring it's always dynamic
export const dynamic = 'force-dynamic';
