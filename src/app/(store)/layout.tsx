import { StoreNav } from '@/components/store/StoreNav'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <StoreNav />
      <main>{children}</main>
    </div>
  )
}
