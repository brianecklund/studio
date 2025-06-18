
// src/app/studio/[[...index]]/page.tsx
'use client';

// This file is part of a route conflict and should ideally be deleted.
// It conflicts with src/app/studio/[[...tool]]/page.tsx
// This version is modified to be as inert as possible.

export default function DeprecatedStudioIndexPage() {
  // Render nothing to avoid Sanity Studio initialization
  // and any potential conflicts with the correct [[...tool]] route.
  return null;
}

// Opt-out of caching for this deprecated route.
export const dynamic = 'force-dynamic';
