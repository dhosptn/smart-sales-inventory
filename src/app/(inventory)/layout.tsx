import Navbar from '@/components/Navbar';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      {/* Navbar selalu di atas */}
      <Navbar />

      {/* Konten utama full width */}
      <main className='flex-1 w-full bg-gray-50'>{children}</main>
    </div>
  );
}
