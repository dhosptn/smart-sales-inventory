'use client';

import { useEffect, useState } from 'react';
import SalesChart from '@/components/SalesChart';
import { parseISO, isValid, format, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  Upload,
  Package,
  BarChart3,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Box,
  ShoppingCart,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

// Define the data structure based on CSV columns
interface SalesData {
  date: string;
  product: string;
  sales: number;
  stock_in: number;
  stock_out: number;
  stock_remaining: number;
}

export default function Dashboard() {
  const [data, setData] = useState<SalesData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [period, setPeriod] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('daily');
  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem('salesData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // Aggregate data sesuai periode dan produk
  useEffect(() => {
    if (!data || data.length === 0) return;

    const productSet = new Set(data.map((row) => row.product));
    setProducts(Array.from(productSet));

    const aggregated: { [label: string]: { [product: string]: number } } = {};

    data.forEach((row) => {
      // Pastikan ada row.date
      if (!row || !row.date) return;

      const parsedDate = parseISO(row.date.trim());

      // Pastikan valid date
      if (!isValid(parsedDate)) return;

      let label = '';
      switch (period) {
        case 'daily':
          label = format(parsedDate, 'yyyy-MM-dd');
          break;
        case 'weekly':
          label = `${format(startOfWeek(parsedDate), 'MMM dd')} - ${format(
            endOfWeek(parsedDate),
            'MMM dd, yyyy'
          )}`;
          break;
        case 'monthly':
          label = format(parsedDate, 'yyyy-MM');
          break;
        case 'yearly':
          label = format(parsedDate, 'yyyy');
          break;
      }

      if (!aggregated[label]) aggregated[label] = {};
      aggregated[label][row.product] =
        (aggregated[label][row.product] || 0) + Number(row.sales);
    });

    const result = Object.entries(aggregated).map(([label, sales]) => ({
      label,
      ...sales,
    }));

    setChartData(result);
  }, [data, period]);

  // Calculate metrics for dashboard
  const totalSales = data.reduce((sum, item) => sum + Number(item.sales), 0);
  const totalStockIn = data.reduce(
    (sum, item) => sum + Number(item.stock_in),
    0
  );
  const totalStockOut = data.reduce(
    (sum, item) => sum + Number(item.stock_out),
    0
  );

  // Find best selling product
  const productSales: { [product: string]: number } = {};
  data.forEach((item) => {
    productSales[item.product] =
      (productSales[item.product] || 0) + Number(item.sales);
  });

  const bestSellingProduct =
    Object.keys(productSales).length > 0
      ? Object.keys(productSales).reduce((a, b) =>
          productSales[a] > productSales[b] ? a : b
        )
      : 'N/A';

  const bestSellingCount =
    bestSellingProduct !== 'N/A' ? productSales[bestSellingProduct] : 0;

  // Find low stock products
  const lowStockProducts = data.filter(
    (item) => Number(item.stock_remaining) < 10
  );
  const lowStockCount = lowStockProducts.length;

  // Calculate sales growth (compared to previous period)
  const currentPeriodSales = totalSales;
  const previousPeriodSales = Math.round(totalSales * 0.85); // Simulated previous period data
  const salesGrowth =
    ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100;

  // Animasi untuk container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animasi untuk item
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
    <motion.div
      className='min-h-screen bg-gradient-to-br from-[#C4D9FF] to-[#E8F9FF] p-4 md:p-6'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <motion.div variants={itemVariants} className='mb-6 md:mb-8'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold flex items-center gap-2'>
                <div className='p-2 bg-white rounded-lg shadow-sm'>
                  <BarChart3 className='h-6 w-6 md:h-8 md:w-8 text-[#C5BAFF]' />
                </div>
                Dashboard Penjualan
              </h1>
              <p className='text-gray-600 mt-2 max-w-3xl text-sm md:text-base'>
                Pantau tren penjualan setiap produk, lihat performa
                harian/mingguan/bulanan, dan identifikasi stok yang menipis
                secara real-time.
              </p>
            </div>
            <Button
              className='bg-[#C5BAFF] hover:bg-[#B0A3FF] text-white gap-2'
              onClick={() => router.push('/')}
            >
              <Upload className='h-4 w-4' />
              Upload Data Baru
            </Button>
          </div>
        </motion.div>

        {data.length > 0 ? (
          <>
            {/* Stats Overview */}
            <motion.div
              variants={itemVariants}
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'
            >
              <Card className='bg-white border-[#E8F9FF] shadow-sm'>
                <CardContent className='p-4 md:p-6'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='text-sm text-gray-500'>Total Penjualan</p>
                      <h3 className='text-2xl font-bold mt-1'>
                        {totalSales.toLocaleString()}
                      </h3>
                      <div className='flex items-center mt-2'>
                        {salesGrowth > 0 ? (
                          <ArrowUpRight className='h-4 w-4 text-green-500' />
                        ) : (
                          <ArrowDownRight className='h-4 w-4 text-red-500' />
                        )}
                        <span
                          className={`text-sm ml-1 ${
                            salesGrowth > 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {salesGrowth > 0 ? '+' : ''}
                          {salesGrowth.toFixed(1)}% dari periode sebelumnya
                        </span>
                      </div>
                    </div>
                    <div className='p-2 bg-[#E8F9FF] rounded-lg'>
                      <ShoppingCart className='h-5 w-5 text-[#C5BAFF]' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white border-[#E8F9FF] shadow-sm'>
                <CardContent className='p-4 md:p-6'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='text-sm text-gray-500'>Produk Terlaris</p>
                      <h3 className='text-xl font-bold mt-1 truncate'>
                        {bestSellingProduct}
                      </h3>
                      <p className='text-sm text-gray-500 mt-2'>
                        {bestSellingCount.toLocaleString()} terjual
                      </p>
                    </div>
                    <div className='p-2 bg-[#E8F9FF] rounded-lg'>
                      <Package className='h-5 w-5 text-[#C5BAFF]' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white border-[#E8F9FF] shadow-sm'>
                <CardContent className='p-4 md:p-6'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='text-sm text-gray-500'>Manajemen Stok</p>
                      <h3 className='text-2xl font-bold mt-1'>
                        {totalStockIn.toLocaleString()}
                      </h3>
                      <p className='text-sm text-gray-500 mt-2'>
                        {totalStockIn.toLocaleString()} masuk /{' '}
                        {totalStockOut.toLocaleString()} keluar
                      </p>
                    </div>
                    <div className='p-2 bg-[#E8F9FF] rounded-lg'>
                      <Box className='h-5 w-5 text-[#C5BAFF]' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white border-[#E8F9FF] shadow-sm'>
                <CardContent className='p-4 md:p-6'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='text-sm text-gray-500'>Peringatan Stok</p>
                      <h3 className='text-2xl font-bold mt-1'>
                        {lowStockCount}
                      </h3>
                      <p className='text-sm text-gray-500 mt-2'>
                        Produk hampir habis
                      </p>
                    </div>
                    <div className='p-2 bg-[#E8F9FF] rounded-lg'>
                      <AlertTriangle className='h-5 w-5 text-amber-500' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className='flex flex-col lg:flex-row gap-6'>
              {/* Left Column - Chart */}
              <div className='w-full lg:w-2/3'>
                <motion.div variants={itemVariants} className='mb-4'>
                  <Card className='bg-white border-[#E8F9FF] shadow-sm'>
                    <CardHeader className='pb-3'>
                      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                          <CardTitle>Grafik Penjualan</CardTitle>
                          <CardDescription>
                            Performa penjualan berdasarkan periode
                          </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4 text-[#C5BAFF]' />
                          <Select
                            value={period}
                            onValueChange={(value: any) => setPeriod(value)}
                          >
                            <SelectTrigger className='w-[130px] bg-white border-[#C4D9FF]'>
                              <SelectValue placeholder='Pilih Periode' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='daily'>Harian</SelectItem>
                              <SelectItem value='weekly'>Mingguan</SelectItem>
                              <SelectItem value='monthly'>Bulanan</SelectItem>
                              <SelectItem value='yearly'>Tahunan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <SalesChart data={chartData} products={products} />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Additional Info */}
              <div className='w-full lg:w-1/3'>
                <motion.div variants={itemVariants} className='mb-4'>
                  <Card className='bg-white border-[#E8F9FF] shadow-sm h-full'>
                    <CardHeader>
                      <CardTitle>Ringkasan Stok</CardTitle>
                      <CardDescription>
                        Status stok produk terkini
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {products.slice(0, 5).map((product, index) => {
                          const productData = data.filter(
                            (item) => item.product === product
                          );
                          const latestStock =
                            productData.length > 0
                              ? productData[productData.length - 1]
                                  .stock_remaining
                              : 0;
                          const totalSold = productData.reduce(
                            (sum, item) => sum + Number(item.sales),
                            0
                          );
                          const stockPercentage =
                            (Number(latestStock) /
                              (Number(latestStock) + totalSold)) *
                            100;

                          return (
                            <div key={index} className='space-y-2'>
                              <div className='flex justify-between items-center'>
                                <span className='font-medium'>{product}</span>
                                <Badge
                                  variant={
                                    latestStock < 10 ? 'destructive' : 'outline'
                                  }
                                  className={
                                    latestStock < 10
                                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                      : 'bg-green-100 text-green-800 hover:bg-green-100'
                                  }
                                >
                                  {latestStock < 10 ? 'Rendah' : 'Aman'}
                                </Badge>
                              </div>
                              <Progress
                                value={stockPercentage}
                                className={
                                  latestStock < 10
                                    ? 'bg-amber-200'
                                    : 'bg-green-200'
                                }
                              />
                              <div className='flex justify-between text-sm text-gray-500'>
                                <span>
                                  Terjual: {totalSold.toLocaleString()}
                                </span>
                                <span>
                                  Stok: {latestStock.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {lowStockCount > 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className='bg-white border-[#E8F9FF] shadow-sm'>
                      <CardHeader>
                        <CardTitle>Peringatan Stok</CardTitle>
                        <CardDescription>
                          Produk yang perlu perhatian
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-3'>
                        {lowStockProducts.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className='p-3 bg-amber-50 border border-amber-200 rounded-lg'
                          >
                            <div className='flex items-start gap-3'>
                              <AlertTriangle className='h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0' />
                              <div>
                                <p className='font-medium'>
                                  Stok {item.product} hampir habis!
                                </p>
                                <p className='text-sm text-amber-700 mt-1'>
                                  Hanya tersisa {item.stock_remaining} unit.
                                  Segera lakukan restok.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </>
        ) : (
          <motion.div
            variants={itemVariants}
            className='flex flex-col items-center justify-center py-12 px-4 text-center'
          >
            <div className='bg-[#E8F9FF] p-4 rounded-full mb-4'>
              <Upload className='h-12 w-12 text-[#C5BAFF]' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>Belum ada data</h2>
            <p className='text-gray-600 max-w-md mb-6'>
              Silakan upload CSV dari halaman utama agar dashboard bisa
              menampilkan informasi lengkap.
            </p>
            <Button
              className='bg-[#C5BAFF] hover:bg-[#B0A3FF] text-white gap-2'
              onClick={() => router.push('/')}
            >
              <Upload className='h-4 w-4' />
              Upload Data CSV
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
