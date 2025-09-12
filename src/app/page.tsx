'use client';

import { motion } from 'framer-motion';
import {
  UploadCloud,
  TrendingUp,
  AlertTriangle,
  Users,
  FileText,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Brain,
} from 'lucide-react';
import UploadCSV from '@/components/UploadCSV';

export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='p-6 md:p-10 lg:p-12 w-full max-w-7xl mx-auto leading-relaxed bg-[#FBFBFB] h-full '
    >
      {/* Header Section */}
      <motion.section
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full text-center mb-12 py-10 px-6 rounded-none md:rounded-xl bg-gradient-to-r from-[#E8F9FF] to-[#C5BAFF]'
      >
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold pb-5 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600'>
          Smart Sales & Inventory Insight
        </h1>
        <p className='text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto'>
          Solusi Cerdas untuk Mengelola Penjualan & Stok UMKM
        </p>
      </motion.section>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column - Intro & Features */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Intro Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='p-8 rounded-2xl bg-white shadow-md border border-[#C4D9FF]'
          >
            <p className='mb-6 text-lg lg:text-xl'>
              <b>Smart Sales & Inventory Insight</b> adalah platform berbasis
              web yang dirancang khusus untuk membantu <b>UMKM</b> dalam
              mengelola penjualan dan stok barang secara lebih{' '}
              <b>efisien, akurat,</b> dan <b>cerdas</b>.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Features */}
              <div className='p-5 rounded-lg bg-[#E8F9FF]'>
                <div className='flex items-center mb-4'>
                  <Zap className='text-blue-600 mr-2' size={24} />
                  <h2 className='text-xl font-semibold text-blue-700'>
                    Fitur Unggulan
                  </h2>
                </div>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <CheckCircle
                      className='text-green-500 mr-2 mt-1'
                      size={18}
                    />
                    <span>
                      <b>Dashboard Analisis</b> - Pantau penjualan, tren produk,
                      dan stok secara real-time
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle
                      className='text-green-500 mr-2 mt-1'
                      size={18}
                    />
                    <span>
                      <b>AI Prediksi Permintaan</b> - Ramal kebutuhan stok masa
                      depan dengan machine learning
                    </span>
                  </li>
                </ul>
              </div>

              {/* Problems Solved */}
              <div className='p-5 rounded-lg bg-[#E8F9FF]'>
                <div className='flex items-center mb-4'>
                  <AlertTriangle className='text-orange-500 mr-2' size={24} />
                  <h2 className='text-xl font-semibold text-blue-700'>
                    Solusi Masalah
                  </h2>
                </div>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <ArrowRight
                      className='text-purple-500 mr-2 mt-1'
                      size={18}
                    />
                    <span>
                      Hindari <b>overstock</b> dan <b>stockout</b>
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <ArrowRight
                      className='text-purple-500 mr-2 mt-1'
                      size={18}
                    />
                    <span>Optimalkan manajemen inventori</span>
                  </li>
                  <li className='flex items-start'>
                    <ArrowRight
                      className='text-purple-500 mr-2 mt-1'
                      size={18}
                    />
                    <span>Tingkatkan efisiensi operasional</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Beneficiaries */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='p-8 rounded-2xl bg-white shadow-md border border-[#C4D9FF]'
          >
            <div className='flex items-center mb-6'>
              <Users className='text-blue-600 mr-2' size={28} />
              <h2 className='text-2xl font-semibold text-blue-700'>
                Siapa yang Terbantu?
              </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='text-center p-5 rounded-lg bg-[#E8F9FF] hover:bg-[#C4D9FF] transition-colors duration-300'>
                <div className='bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Users className='text-blue-600' size={24} />
                </div>
                <h3 className='font-semibold text-lg'>Pemilik UMKM</h3>
              </div>

              <div className='text-center p-5 rounded-lg bg-[#E8F9FF] hover:bg-[#C4D9FF] transition-colors duration-300'>
                <div className='bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <BarChart3 className='text-blue-600' size={24} />
                </div>
                <h3 className='font-semibold text-lg'>Bagian Gudang</h3>
              </div>

              <div className='text-center p-5 rounded-lg bg-[#E8F9FF] hover:bg-[#C4D9FF] transition-colors duration-300'>
                <div className='bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <TrendingUp className='text-blue-600' size={24} />
                </div>
                <h3 className='font-semibold text-lg'>Bagian Penjualan</h3>
              </div>
            </div>
          </motion.section>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='p-8 rounded-2xl bg-gradient-to-br from-[#E8F9FF] to-[#C5BAFF] shadow-md'
          >
            <div className='flex items-center justify-center mb-6'></div>

            <UploadCSV />
          </motion.section>
        </div>

        {/* Right Column - Data Guide & Upload */}
        <div className='space-y-8'>
          {/* Data Guide */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='p-8 rounded-2xl bg-white shadow-md border border-[#C4D9FF]'
          >
            <div className='flex items-center mb-5'>
              <FileText className='text-blue-600 mr-2' size={28} />
              <h2 className='text-2xl font-semibold text-blue-700'>
                Panduan Data
              </h2>
            </div>

            <p className='mb-4 text-lg'>
              Sistem ini membutuhkan file dengan struktur berikut:
            </p>

            <div className='bg-gray-100 p-5 rounded-lg mb-6 overflow-x-auto'>
              <pre className='text-sm'>
                {`date,product,sales,stock_in,stock_out,stock_remaining\n2025-07-01,Kaos,12,50,12,38\n2025-07-02,Celana,8,40,8,32\n2025-07-03,Jaket,5,30,5,25`}
              </pre>
            </div>

            <p className='mb-6 text-lg'>
              Pastikan file memiliki kolom:{' '}
              <span className='font-semibold text-blue-700'>
                date, product, sales, stock_in, stock_out, stock_remaining
              </span>
              .
            </p>

            <div className='bg-blue-50 p-5 rounded-lg border border-blue-200'>
              <h3 className='font-semibold text-blue-800 flex items-center mb-3'>
                <FileText className='mr-2' size={20} />
                Cara menggunakan Google Sheets:
              </h3>
              <ol className='list-decimal ml-6 space-y-2 text-lg'>
                <li>Buat Google Sheets dengan kolom seperti contoh di atas</li>
                <li>
                  Klik <b>File → Share → Publish to the web</b> → pilih format{' '}
                  <b>CSV</b>
                </li>
                <li>Ambil link dalam format CSV</li>
                <li>Masukkan link tersebut ke kolom input di bawah</li>
              </ol>
            </div>
          </motion.section>

          {/* Upload CSV Section */}
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className='mt-16 text-center text-gray-600 text-lg'
      >
        <p>
          © {new Date().getFullYear()} Smart Sales & Inventory Insight. All
          rights reserved.
        </p>
      </motion.footer>
    </motion.main>
  );
}
