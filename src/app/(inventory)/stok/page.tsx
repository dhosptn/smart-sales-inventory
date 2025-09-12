'use client';

import DataTable from '@/components/DataTable';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Upload,
  AlertCircle,
  Boxes,
  TrendingUp,
  Database,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function StokPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStock: 0,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('salesData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);

      // Hitung statistik
      const totalItems = parsedData.length;
      const totalValue = parsedData.reduce(
        (sum: number, item: any) =>
          sum + parseFloat(item.harga || 0) * parseInt(item.stok || 0),
        0
      );
      const lowStock = parsedData.filter(
        (item: any) => parseInt(item.stok || 0) < 10
      ).length;

      setStats({ totalItems, totalValue, lowStock });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#E8F9FF] to-[#C4D9FF] p-4 md:p-8'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-7xl mx-auto'
      >
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2'>
              <Package className='h-8 w-8 text-[#C5BAFF]' />
              Manajemen Stok
            </h1>
            <p className='text-gray-600 mt-2'>
              Kelola dan pantau inventori Anda dengan mudah dan efisien
            </p>
          </div>

          <Button
            className='bg-[#C5BAFF] hover:bg-[#b5a9ff] text-gray-800 font-medium'
            onClick={() => router.push('/')}
          >
            <Upload className='mr-2 h-4 w-4' /> Upload Data Baru
          </Button>
        </div>

        {data.length > 0 ? (
          <>
            {/* Statistik Cards */}

            {/* Data Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CardContent className='p-0'>
                <DataTable data={data} />
              </CardContent>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className='bg-white/80 backdrop-blur-sm border-0 shadow-md'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Belum ada data stok</AlertTitle>
              <AlertDescription>
                Silakan upload file CSV dari halaman utama untuk mulai mengelola
                inventori Anda. Pantau stok, lacak penjualan, dan optimalkan
                persediaan dengan tools kami.
              </AlertDescription>
            </Alert>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'
            >
              <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-md text-center p-6'>
                <div className='bg-[#E8F9FF] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Upload className='h-6 w-6 text-[#C5BAFF]' />
                </div>
                <h3 className='font-semibold mb-2'>Upload Data</h3>
                <p className='text-sm text-gray-600'>
                  Unggah file CSV dengan mudah untuk memulai
                </p>
              </Card>

              <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-md text-center p-6'>
                <div className='bg-[#E8F9FF] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <TrendingUp className='h-6 w-6 text-[#C5BAFF]' />
                </div>
                <h3 className='font-semibold mb-2'>Analisis Cerdas</h3>
                <p className='text-sm text-gray-600'>
                  Dapatkan insight tentang stok dan penjualan
                </p>
              </Card>

              <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-md text-center p-6'>
                <div className='bg-[#E8F9FF] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Package className='h-6 w-6 text-[#C5BAFF]' />
                </div>
                <h3 className='font-semibold mb-2'>Kelola Inventori</h3>
                <p className='text-sm text-gray-600'>
                  Pantau stok dan terima notifikasi untuk restock
                </p>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
