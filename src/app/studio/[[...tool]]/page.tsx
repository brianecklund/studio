
'use client'

// The Sanity Studio component
import {NextStudio} from 'next-sanity/studio'

// Imports the Sanity config file
import config from '../../../../sanity.config'

export default function StudioPage() {
  // Renders the Sanity Studio using the configuration
  return <NextStudio config={config} />
}

// Opt-out of caching for the studio route, ensuring it's always dynamic
export const dynamic = 'force-dynamic';
