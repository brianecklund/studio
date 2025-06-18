// src/app/studio/[[...index]]/page.tsx
'use client';

// This file is part of a route conflict and should ideally be deleted.
// It conflicts with src/app/studio/[[...tool]]/page.tsx
// This version is neutered to prevent errors.

export default function DeprecatedStudioIndexPage() {
  // Render nothing or a placeholder to avoid Sanity Studio initialization
  // and any potential conflicts with the correct [[...tool]] route.
  return null;
}

// This function is required for dynamic segment pages, 
// but we return an empty array or a self-consistent param 
// to avoid claiming paths meant for the [[...tool]] route.
export function generateStaticParams() {
  return [{ index: [] }]; // Matches its own slug name `index`
}

// Opt-out of caching for this deprecated route.
export const dynamic = 'force-dynamic';
