
// This route enables showing the Sanity Studio at /studio

'use client'

import {NextStudio} from 'next-sanity/studio'
import config from '../../../../sanity.config' // Adjust path if your sanity.config is elsewhere

export default function StudioPage() {
  //  Supports the same props as `import {Studio} from 'sanity'`, `config` is required
  return <NextStudio config={config} />
}

// If you have static exports enabled, make sure to add this so the slug route is generated.
export function generateStaticParams() {
  return [{ index: [] }]; // Renders the studio at /studio
}

// Opt-out of caching for the studio route
export const dynamic = 'force-dynamic';

