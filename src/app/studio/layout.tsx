
// This layout is specifically for the Sanity Studio route
// It ensures that the global app layout (header, footer) doesn't apply to the studio.

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
