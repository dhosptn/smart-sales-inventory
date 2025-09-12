'use client';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  Download,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  Filter,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  data: { label: string; [product: string]: number | string }[];
  products: string[];
}

// Warna yang sesuai dengan palet yang diminta
const colors = ['#C5BAFF', '#C4D9FF', '#8FD3FF', '#A3E7D9', '#FFD6A5'];
const areaColors = [
  'rgba(197, 186, 255, 0.3)',
  'rgba(196, 217, 255, 0.3)',
  'rgba(143, 211, 255, 0.3)',
  'rgba(163, 231, 217, 0.3)',
  'rgba(255, 214, 165, 0.3)',
];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
        <p className='font-semibold text-gray-800 mb-2'>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className='flex items-center gap-2'
            style={{ color: entry.color }}
          >
            <span
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: entry.color }}
            ></span>
            {entry.name}: <span className='font-bold'>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Legend
const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className='flex flex-wrap justify-center gap-3 mt-4 px-2'>
      {payload.map((entry: any, index: number) => (
        <div
          key={`legend-${index}`}
          className='flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full'
        >
          <div
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className='text-xs font-medium'>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function SalesChart({ data, products }: Props) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Animasi untuk chart container
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={chartVariants}
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}
    >
      <Card className='border-[#E8F9FF] shadow-lg overflow-hidden h-full'>
        <CardHeader className='bg-gradient-to-r from-[#E8F9FF] to-[#C4D9FF] py-4'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-white rounded-lg shadow-sm'>
                <TrendingUp className='h-5 w-5 text-[#C5BAFF]' />
              </div>
              <div>
                <CardTitle className='text-xl'>Grafik Penjualan</CardTitle>
                <CardDescription>
                  Visualisasi performa penjualan produk
                </CardDescription>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Select
                value={chartType}
                onValueChange={(value: any) => setChartType(value)}
              >
                <SelectTrigger className='w-[120px] h-9 bg-white border-[#C4D9FF]'>
                  <SelectValue placeholder='Tipe Chart' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='line'>Line</SelectItem>
                  <SelectItem value='area'>Area</SelectItem>
                  <SelectItem value='bar'>Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-3 md:p-6'>
          {/* Device Indicator - hanya tampil di mobile */}

          <div className='h-64 sm:h-80 md:h-96'>
            <ResponsiveContainer width='100%' height='100%'>
              <ComposedChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <defs>
                  {products.map((_, idx) => (
                    <linearGradient
                      key={idx}
                      id={`colorUv${idx}`}
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop
                        offset='5%'
                        stopColor={colors[idx % colors.length]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset='95%'
                        stopColor={colors[idx % colors.length]}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#E8F9FF'
                  vertical={false}
                />
                <XAxis
                  dataKey='label'
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickMargin={10}
                  angle={-45}
                  textAnchor='end'
                  height={60}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickMargin={10}
                  tickFormatter={(value) => {
                    if (value >= 1000) return `${value / 1000}k`;
                    return value;
                  }}
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />

                {chartType === 'area' &&
                  products.map((product, idx) => (
                    <Area
                      key={product}
                      type='monotone'
                      dataKey={product}
                      name={product}
                      stroke={colors[idx % colors.length]}
                      fill={`url(#colorUv${idx})`}
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  ))}

                {chartType === 'line' &&
                  products.map((product, idx) => (
                    <Line
                      key={`line-${product}`}
                      type='monotone'
                      dataKey={product}
                      name={product}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        fill: colors[idx % colors.length],
                        strokeWidth: 2,
                        stroke: '#fff',
                      }}
                      activeDot={{
                        r: 6,
                        fill: colors[idx % colors.length],
                        stroke: '#fff',
                        strokeWidth: 2,
                      }}
                    />
                  ))}

                {chartType === 'bar' &&
                  products.map((product, idx) => (
                    <Bar
                      key={`bar-${product}`}
                      dataKey={product}
                      name={product}
                      fill={colors[idx % colors.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Summary - Responsif */}
          <div className='mt-6 grid grid-cols-2 md:grid-cols-3 gap-3'>
            <div className='bg-[#F7F9FF] p-3 rounded-lg'>
              <p className='text-xs md:text-sm text-gray-500'>
                Total Penjualan
              </p>
              <p className='text-lg md:text-2xl font-bold text-[#C5BAFF]'>
                12,458
              </p>
            </div>
            <div className='bg-[#F7F9FF] p-3 rounded-lg'>
              <p className='text-xs md:text-sm text-gray-500'>
                Produk Terlaris
              </p>
              <p className='text-base md:text-xl font-bold text-[#C5BAFF] truncate'>
                {products[0] || '-'}
              </p>
            </div>
            <div className='col-span-2 md:col-span-1 bg-[#F7F9FF] p-3 rounded-lg'>
              <p className='text-xs md:text-sm text-gray-500'>Periode</p>
              <p className='text-base md:text-xl font-bold text-[#C5BAFF]'>
                {data.length} titik data
              </p>
            </div>
          </div>

          {/* Device Icons - hanya tampil di mobile */}
        </CardContent>
      </Card>

      {isFullscreen && (
        <div className='fixed bottom-4 right-4 z-50'>
          <Button
            onClick={toggleFullscreen}
            className='rounded-full h-12 w-12 bg-[#C5BAFF] hover:bg-[#B0A3FF] shadow-lg'
          >
            ✕
          </Button>
        </div>
      )}
    </motion.div>
  );
}
