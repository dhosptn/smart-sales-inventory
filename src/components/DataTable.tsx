'use client';

import { useState, useMemo } from 'react';
import { parseISO, format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Package,
  TrendingUp,
  Box,
  AlertTriangle,
  CheckCircle,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  data: {
    date: string;
    product: string;
    sales: number;
    stock_in: number;
    stock_out: number;
    stock_remaining: number;
  }[];
}

type SortKey = 'date' | 'sales' | 'stock_remaining' | 'product';

export default function DataTable({ data }: Props) {
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Ambil semua bulan unik
  const months = useMemo(() => {
    const setMonth = new Set(data.map((d) => format(parseISO(d.date), 'MMMM')));
    return Array.from(setMonth);
  }, [data]);

  // Ambil semua tahun unik
  const years = useMemo(() => {
    const setYear = new Set(data.map((d) => format(parseISO(d.date), 'yyyy')));
    return Array.from(setYear);
  }, [data]);

  // Ambil semua produk unik
  const products = useMemo(() => {
    const setProduct = new Set(data.map((d) => d.product));
    return Array.from(setProduct);
  }, [data]);

  // Filter data
  const filteredData = useMemo(() => {
    let result = data.filter((d) => {
      const dt = parseISO(d.date);
      const monthName = format(dt, 'MMMM');
      const year = format(dt, 'yyyy');

      return (
        (monthFilter === 'all' || monthName === monthFilter) &&
        (yearFilter === 'all' || year === yearFilter) &&
        (productFilter === 'all' || d.product === productFilter) &&
        (searchTerm === '' ||
          d.product.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    // Sorting
    result = [...result].sort((a, b) => {
      let valA: number | string = '';
      let valB: number | string = '';

      if (sortKey === 'date') {
        valA = parseISO(a.date).getTime();
        valB = parseISO(b.date).getTime();
      } else if (sortKey === 'sales') {
        valA = a.sales;
        valB = b.sales;
      } else if (sortKey === 'stock_remaining') {
        valA = a.stock_remaining;
        valB = b.stock_remaining;
      } else if (sortKey === 'product') {
        valA = a.product;
        valB = b.product;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    data,
    monthFilter,
    yearFilter,
    productFilter,
    searchTerm,
    sortKey,
    sortOrder,
  ]);

  const stockSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    filteredData.forEach((item) => {
      const currentDate = parseISO(item.date).getTime();
      if (
        !summary[item.product] ||
        currentDate > summary[item.product + '_date']
      ) {
        summary[item.product] = item.stock_remaining;
        summary[item.product + '_date'] = currentDate;
      }
    });

    // hapus key *_date sebelum return
    const cleanSummary: Record<string, number> = {};
    Object.keys(summary).forEach((key) => {
      if (!key.endsWith('_date')) {
        cleanSummary[key] = summary[key];
      }
    });
    return cleanSummary;
  }, [filteredData]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className='ml-1 h-3 w-3' />;
    return sortOrder === 'asc' ? (
      <ChevronUp className='ml-1 h-4 w-4' />
    ) : (
      <ChevronDown className='ml-1 h-4 w-4' />
    );
  };

  const exportToCSV = () => {
    const headers = [
      'Tanggal',
      'Produk',
      'Penjualan',
      'Stok Masuk',
      'Stok Keluar',
      'Sisa Stok',
    ];
    const csvData = filteredData.map((row) => [
      row.date,
      row.product,
      row.sales,
      row.stock_in,
      row.stock_out,
      row.stock_remaining,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data-stok.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='space-y-6 '>
      {/* Header dengan Filter */}
      <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-lg'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <CardTitle className='text-xl flex items-center gap-2'>
                <Box className='h-5 w-5 text-[#C5BAFF]' /> Data Inventori
              </CardTitle>
              <CardDescription>
                Kelola dan pantau data stok dengan filter yang lengkap
              </CardDescription>
            </div>
            <Button
              onClick={exportToCSV}
              variant='outline'
              size='sm'
              className='border-[#C5BAFF] text-[#C5BAFF] hover:bg-[#C5BAFF] hover:text-white'
            >
              <Download className='mr-2 h-4 w-4' /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Cari produk...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 bg-white border-gray-200 focus:border-[#C5BAFF]'
              />
            </div>

            {/* Toggle Filters Button */}
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className='flex items-center gap-2 w-full md:w-auto justify-center bg-white border-gray-200'
            >
              <Filter className='h-4 w-4' />
              {isFiltersOpen ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
            </Button>

            {/* Filters */}
            {isFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200'
              >
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Bulan
                  </label>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className='bg-white border-gray-200'>
                      <SelectValue placeholder='Semua Bulan' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Bulan</SelectItem>
                      {months.map((m, i) => (
                        <SelectItem key={i} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Tahun
                  </label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className='bg-white border-gray-200'>
                      <SelectValue placeholder='Semua Tahun' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Tahun</SelectItem>
                      {years.map((y, i) => (
                        <SelectItem key={i} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Produk
                  </label>
                  <Select
                    value={productFilter}
                    onValueChange={setProductFilter}
                  >
                    <SelectTrigger className='bg-white border-gray-200'>
                      <SelectValue placeholder='Semua Produk' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Produk</SelectItem>
                      {products.map((p, i) => (
                        <SelectItem key={i} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ringkasan Stok */}
      <Card className='bg-gradient-to-r from-[#E8F9FF] to-[#C4D9FF] border-0 shadow-lg'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Package className='h-5 w-5 text-[#C5BAFF]' /> Ringkasan Sisa Stok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Object.entries(stockSummary).map(([product, total], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className='bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-sm'
              >
                <div className='flex justify-between items-start'>
                  <h3 className='font-semibold text-gray-800 truncate'>
                    {product}
                  </h3>
                  <Badge
                    variant={total < 20 ? 'destructive' : 'default'}
                    className={total < 20 ? 'bg-amber-500' : 'bg-green-500'}
                  >
                    {total < 20 ? 'Rendah' : 'Aman'}
                  </Badge>
                </div>
                <p className='text-2xl font-bold mt-2 text-gray-800'>
                  {total} unit
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabel Data */}
      <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-[#E8F9FF] to-[#C5BAFF]'>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' /> Detail Data Inventori
          </CardTitle>
          <CardDescription>
            Menampilkan {filteredData.length} dari {data.length} entri data
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-100/80'>
                <tr>
                  <th
                    className='p-3 text-left font-medium cursor-pointer hover:bg-gray-200/50 transition-colors'
                    onClick={() => handleSort('date')}
                  >
                    <div className='flex items-center'>
                      Tanggal <SortIcon columnKey='date' />
                    </div>
                  </th>
                  <th
                    className='p-3 text-left font-medium cursor-pointer hover:bg-gray-200/50 transition-colors'
                    onClick={() => handleSort('product')}
                  >
                    <div className='flex items-center'>
                      Produk <SortIcon columnKey='product' />
                    </div>
                  </th>
                  <th
                    className='p-3 text-left font-medium cursor-pointer hover:bg-gray-200/50 transition-colors'
                    onClick={() => handleSort('sales')}
                  >
                    <div className='flex items-center'>
                      Penjualan <SortIcon columnKey='sales' />
                    </div>
                  </th>
                  <th className='p-3 text-left font-medium'>Stok Masuk</th>
                  <th className='p-3 text-left font-medium'>Stok Keluar</th>
                  <th
                    className='p-3 text-left font-medium cursor-pointer hover:bg-gray-200/50 transition-colors'
                    onClick={() => handleSort('stock_remaining')}
                  >
                    <div className='flex items-center'>
                      Sisa Stok <SortIcon columnKey='stock_remaining' />
                    </div>
                  </th>
                  <th className='p-3 text-left font-medium'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className='border-b border-gray-100 hover:bg-gray-50/80 transition-colors'
                  >
                    <td className='p-3'>
                      {format(parseISO(row.date), 'dd MMM yyyy')}
                    </td>
                    <td className='p-3 font-medium'>{row.product}</td>
                    <td className='p-3'>{row.sales}</td>
                    <td className='p-3'>{row.stock_in}</td>
                    <td className='p-3'>{row.stock_out}</td>
                    <td className='p-3 font-medium'>{row.stock_remaining}</td>
                    <td className='p-3'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='flex items-center'>
                              {row.stock_remaining < 20 ? (
                                <Badge
                                  variant='destructive'
                                  className='bg-amber-500 gap-1'
                                >
                                  <AlertTriangle className='h-3 w-3' /> Rendah
                                </Badge>
                              ) : (
                                <Badge
                                  variant='outline'
                                  className='text-green-600 border-green-300 gap-1'
                                >
                                  <CheckCircle className='h-3 w-3' /> Aman
                                </Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {row.stock_remaining < 20
                                ? 'Stok menipis, perlu restock'
                                : 'Stok dalam batas aman'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </motion.tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className='text-center p-8 text-gray-500'>
                      <div className='flex flex-col items-center justify-center gap-2'>
                        <Search className='h-12 w-12 text-gray-300' />
                        <p>Tidak ada data yang cocok dengan filter pencarian</p>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setMonthFilter('all');
                            setYearFilter('all');
                            setProductFilter('all');
                            setSearchTerm('');
                          }}
                          className='mt-2'
                        >
                          Reset Filter
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
