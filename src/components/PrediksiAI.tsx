'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Brain,
  BarChart3,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface ForecastDetail {
  date: string;
  predicted_sales: number;
}

interface ProductPrediction {
  product: string;
  forecast: number[];
  forecast_detail: ForecastDetail[];
  trend: string;
  recommended_stock: number;
}

export default function PrediksiAI() {
  const [predictions, setPredictions] = useState<ProductPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('salesData');
    if (!savedData) {
      setLoading(false);
      return;
    }

    const salesData = JSON.parse(savedData);

    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(salesData),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const result = await res.json();
        setPredictions(result.products || []);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memproses prediksi');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Produk,Tanggal,Prediksi Penjualan\n';
    predictions.forEach((prod) => {
      prod.forecast_detail.forEach((f) => {
        csvContent += `${prod.product},${f.date},${f.predicted_sales}\n`;
      });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'prediksi_penjualan.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'naik':
        return <TrendingUp className='h-4 w-4 text-green-600' />;
      case 'turun':
        return <TrendingDown className='h-4 w-4 text-red-600' />;
      default:
        return <Minus className='h-4 w-4 text-blue-600' />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'naik':
        return 'bg-green-100 text-green-800';
      case 'turun':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className='p-6 bg-[#FBFBFB] min-h-screen'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col gap-6 mb-8'>
            <Skeleton className='h-10 w-1/3' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-2/3' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[1, 2].map((item) => (
              <Card key={item} className='bg-white border-0 shadow-md'>
                <CardHeader>
                  <Skeleton className='h-6 w-1/2' />
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-48 w-full' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6 bg-[#E8F9FF] min-h-screen flex items-center justify-center'>
        <Card className='max-w-md bg-white border-0 shadow-md'>
          <CardHeader className='text-center'>
            <div className='flex justify-center mb-4'>
              <AlertCircle className='h-12 w-12 text-red-500' />
            </div>
            <CardTitle className='text-red-600'>Terjadi Kesalahan</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Button
              onClick={() => window.location.reload()}
              className='bg-[#C5BAFF] hover:bg-[#b4a8ff]'
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-6 bg-gradient-to-br from-[#C4D9FF] to-[#E8F9FF] min-h-screen'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2'>
            <Brain className='h-8 w-8 text-[#C5BAFF]' />
            Prediksi Kecerdasan Buatan
          </h1>
          <p className='text-lg text-gray-700 mb-4'>
            Optimalkan inventaris Anda dengan prediksi AI yang cerdas dan
            akurat. Sistem kami menganalisis data penjualan historis untuk
            meramalkan kebutuhan stok 7 hari ke depan.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <Card className='bg-[#EAEFEF] border-0'>
              <CardContent className='p-4 flex items-center'>
                <div className='rounded-full bg-white p-3 mr-4'>
                  <Package className='h-6 w-6 text-[#C4D9FF]' />
                </div>
                <div>
                  <p className='font-semibold'>Hindari Kehabisan Stok</p>
                  <p className='text-sm text-gray-600'>
                    Antisipasi permintaan sebelum terjadi
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-[#C4D9FF] border-0'>
              <CardContent className='p-4 flex items-center'>
                <div className='rounded-full bg-white p-3 mr-4'>
                  <BarChart3 className='h-6 w-6 text-[#C5BAFF]' />
                </div>
                <div>
                  <p className='font-semibold'>Minimalkan Overstock</p>
                  <p className='text-sm text-gray-600'>
                    Hindari kerugian akibat stok mengendap
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-[#EAEFEF]  border-0'>
              <CardContent className='p-4 flex items-center'>
                <div className='rounded-full bg-white p-3 mr-4'>
                  <TrendingUp className='h-6 w-6 text-[#C5BAFF]' />
                </div>
                <div>
                  <p className='font-semibold'>Tingkatkan Efisiensi</p>
                  <p className='text-sm text-gray-600'>
                    Kelola persediaan dengan lebih pintar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {predictions.length > 0 && (
            <Button
              onClick={exportCSV}
              className='bg-[#A2AADB] hover:bg-[#898AC4] text-white font-medium'
            >
              <Download className='mr-2 h-4 w-4' />
              Ekspor Prediksi ke CSV
            </Button>
          )}
        </motion.div>

        {predictions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='text-center py-12'
          >
            <div className='bg-white rounded-lg p-8 shadow-md max-w-md mx-auto'>
              <BarChart3 className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Belum Ada Data Prediksi
              </h3>
              <p className='text-gray-600 mb-4'>
                Unggah data penjualan Anda di halaman utama untuk menghasilkan
                prediksi AI yang akurat.
              </p>
              <Button
                onClick={() => (window.location.href = '/')}
                className='bg-[#C5BAFF] hover:bg-[#b4a8ff] text-white'
              >
                Ke Halaman Utama
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='grid grid-cols-1 gap-6'
          >
            {predictions.map((prod, i) => (
              <Card
                key={i}
                className='bg-white border-0 shadow-md overflow-hidden'
              >
                <CardHeader className='bg-[#EAEFEF] pb-4'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                    <div>
                      <CardTitle className='mt-5 text-xl text-gray-900'>
                        {prod.product}
                      </CardTitle>
                      <CardDescription>
                        Prediksi 7 Hari Ke Depan
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${getTrendColor(
                        prod.trend
                      )} w-fit flex items-center gap-1`}
                    >
                      {getTrendIcon(prod.trend)}
                      Tren {prod.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='p-5'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div>
                      <div className='mb-5'>
                        <h3 className='font-medium text-gray-700 mb-2'>
                          Rekomendasi Stok Optimal
                        </h3>
                        <div className='text-2xl font-bold text-[#C5BAFF]'>
                          {prod.recommended_stock} unit
                        </div>
                        <p className='text-sm text-gray-500 mt-1'>
                          Jumlah yang disarankan untuk memenuhi permintaan tanpa
                          overstock
                        </p>
                      </div>

                      <div className='mb-5'>
                        <h3 className='font-medium text-gray-700 mb-2'>
                          Prediksi Harian
                        </h3>
                        <div className='bg-gray-50 rounded-lg p-4'>
                          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2'>
                            {prod.forecast.map((value, idx) => (
                              <div key={idx} className='text-center'>
                                <div className='text-xs text-gray-500'>
                                  Hari {idx + 1}
                                </div>
                                <div className='font-semibold text-gray-900'>
                                  {value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className='font-medium text-gray-700 mb-4'>
                        Grafik Prediksi Penjualan
                      </h3>
                      <div className='h-64'>
                        <ResponsiveContainer width='100%' height='100%'>
                          <LineChart data={prod.forecast_detail}>
                            <CartesianGrid
                              strokeDasharray='3 3'
                              stroke='#eee'
                            />
                            <XAxis
                              dataKey='date'
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) =>
                                value.split('-').reverse().join('/')
                              }
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              formatter={(value) => [
                                `${value} unit`,
                                'Prediksi Penjualan',
                              ]}
                              labelFormatter={(value) =>
                                `Tanggal: ${value
                                  .split('-')
                                  .reverse()
                                  .join('/')}`
                              }
                            />
                            <Legend />
                            <Line
                              type='monotone'
                              dataKey='predicted_sales'
                              stroke='#C5BAFF'
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                              name='Prediksi Penjualan'
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6'>
                    <h3 className='font-medium text-gray-700 mb-3'>
                      Detail Prediksi Harian
                    </h3>
                    <div className='overflow-x-auto rounded-lg border border-gray-200'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                          <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Tanggal
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              Prediksi Penjualan (unit)
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {prod.forecast_detail.map((f, idx) => (
                            <tr key={idx} className='hover:bg-gray-50'>
                              <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                                {f.date.split('-').reverse().join('/')}
                              </td>
                              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                                {f.predicted_sales}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
