import './globals.css';
import { Plus_Jakarta_Sans, Poppins } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'], // pilih sesuai kebutuhan
  display: 'swap',
});

export const metadata = {
  title: 'Smart Sales Inventory',
  description: 'Solusi Cerdas untuk Mengelola Penjualan & Stok UMKM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${jakarta.variable} ${poppins.variable} h-full`}
    >
      <body className='h-full w-full min-h-screen m-0 p-0 overflow-x-hidden bg-gray-50'>
        {children}
      </body>
    </html>
  );
}
