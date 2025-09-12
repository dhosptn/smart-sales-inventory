'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Link,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Download,
  X,
  FileCheck,
  Sheet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { normalizeData } from '@/utils/normalizeData';

export default function UploadCSV() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'sheets' | ''>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const simulateProgress = (message: string, duration: number = 2000) => {
    return new Promise<void>((resolve) => {
      setLoadingMessage(message);
      setLoadingProgress(0);

      const interval = 50;
      const steps = duration / interval;
      let currentStep = 0;

      const progressInterval = setInterval(() => {
        currentStep += 1;
        const progress = Math.min(100, Math.round((currentStep / steps) * 100));
        setLoadingProgress(progress);

        if (currentStep >= steps) {
          clearInterval(progressInterval);
          resolve();
        }
      }, interval);
    });
  };

  const handleCSV = async (file: File) => {
    setIsLoading(true);
    setUploadMethod('file');
    setUploadedFileName(file.name);

    try {
      await simulateProgress('Mengupload file...', 1500);
      await simulateProgress('Memvalidasi format CSV...', 1000);
      await simulateProgress('Memproses data...', 2000);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const cleaned = normalizeData(result.data as any[]);
          localStorage.setItem('salesData', JSON.stringify(cleaned));

          setLoadingMessage('Data berhasil diproses! Mengalihkan...');
          setLoadingProgress(100);

          setTimeout(() => {
            setIsLoading(false);
            router.push('/dashboard');
          }, 1000);
        },
        error: () => {
          setIsLoading(false);
          alert('Gagal memproses file CSV. Pastikan formatnya benar.');
        },
      });
    } catch (error) {
      setIsLoading(false);
      alert('Terjadi kesalahan saat memproses file.');
    }
  };

  const normalizeData = (rows: any[]) => {
    return rows
      .map((row) => {
        return {
          date: row.date?.trim() || row['﻿date']?.trim() || '', // handle BOM
          product: row.product?.trim() || '',
          sales: Number(row.sales || 0),
          stock_in: Number(row.stock_in || 0),
          stock_out: Number(row.stock_out || 0),
          stock_remaining: Number(row.stock_remaining || 0),
        };
      })
      .filter((row) => row.date && row.product); // buang baris kosong
  };

  const handleSheet = async () => {
    if (!sheetUrl) {
      alert('Masukkan link Google Sheets terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setUploadMethod('sheets');

    try {
      await simulateProgress('Mengakses Google Sheets...', 1500);
      await simulateProgress('Mengunduh data...', 2000);
      await simulateProgress('Memproses data...', 1500);

      // ambil CSV export dari Google Sheets
      const res = await fetch(sheetUrl);
      const text = await res.text();

      const result = Papa.parse(text, { header: true, skipEmptyLines: true });
      const cleaned = normalizeData(result.data as any[]);

      localStorage.setItem('salesData', JSON.stringify(cleaned));

      setLoadingMessage('Data berhasil diimpor! Mengalihkan...');
      setLoadingProgress(100);

      setTimeout(() => {
        setIsLoading(false);
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      alert('Gagal memuat Google Sheets. Pastikan link CSV benar dan publik.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        handleCSV(file);
      } else {
        alert('Hanya file CSV yang didukung');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleCSV(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,date,product,sales,stock_in,stock_out,stock_remaining\n2025-07-01,Kaos,12,50,12,38\n2025-07-02,Celana,8,40,8,32\n2025-07-03,Jaket,5,30,5,25';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'template_sales_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cancelUpload = () => {
    setIsLoading(false);
    setLoadingProgress(0);
    setLoadingMessage('');
    setUploadMethod('');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#E8F9FF] to-[#C4D9FF] p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className='bg-white rounded-xl shadow-2xl p-6 w-full max-w-md'
              >
                <div className='text-center'>
                  <div className='relative mb-6'>
                    <div className='w-20 h-20 mx-auto relative'>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className='w-full h-full border-4 border-[#C5BAFF] border-t-transparent rounded-full'
                      />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        {uploadMethod === 'file' ? (
                          <FileCheck className='h-8 w-8 text-[#C5BAFF]' />
                        ) : (
                          <Sheet className='h-8 w-8 text-[#C5BAFF]' />
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                    {loadingMessage}
                  </h3>

                  {uploadedFileName && (
                    <p className='text-sm text-gray-600 mb-4 truncate'>
                      File: {uploadedFileName}
                    </p>
                  )}

                  <div className='mb-6'>
                    <Progress
                      value={loadingProgress}
                      className='h-2 bg-gray-200'
                    />
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>0%</span>
                      <span>{loadingProgress}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className='flex justify-center gap-3'>
                    <Button
                      onClick={cancelUpload}
                      variant='outline'
                      className='border-gray-300'
                    >
                      <X className='h-4 w-4 mr-2' /> Batalkan
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='space-y-6'
        >
          <div className='text-center mb-8'>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'
            >
              Import Data Inventori
            </motion.h1>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Unggah data penjualan dan stok Anda untuk mulai menganalisis
              performa inventori
            </p>
          </div>

          <Card className='border-0 shadow-xl bg-white/90 backdrop-blur-sm'>
            <CardHeader className='text-center pb-4'>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className='inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#E8F9FF] to-[#C5BAFF] rounded-full mb-4'
              >
                <UploadCloud className='text-[#C5BAFF]' size={28} />
              </motion.div>
              <CardTitle className='text-2xl'>Unggah Data Penjualan</CardTitle>
              <CardDescription>
                Pilih metode untuk mengimpor data penjualan dan inventori Anda
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
              {/* Upload CSV Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='space-y-4'
              >
                <div className='flex items-center justify-between'>
                  <Label className='text-lg font-medium flex items-center gap-2'>
                    <FileText className='text-[#C5BAFF]' size={20} />
                    Upload File CSV
                  </Label>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={downloadTemplate}
                    className='flex items-center gap-1 border-[#C5BAFF] text-[#C5BAFF] hover:bg-[#C5BAFF] hover:text-white'
                  >
                    <Download size={16} />
                    Template CSV
                  </Button>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`border-2 ${
                    isDragging
                      ? 'border-[#C5BAFF] bg-[#C4D9FF]'
                      : 'border-dashed border-[#C5BAFF]'
                  } rounded-lg p-8 text-center cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#E8F9FF] to-[#C4D9FF]`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type='file'
                    accept='.csv'
                    onChange={handleFileSelect}
                    className='hidden'
                    ref={fileInputRef}
                  />

                  <div className='space-y-4'>
                    <motion.div
                      animate={isDragging ? { y: [0, -5, 0] } : {}}
                      transition={{
                        duration: 0.5,
                        repeat: isDragging ? Infinity : 0,
                      }}
                    >
                      <UploadCloud
                        className='mx-auto text-[#C5BAFF]'
                        size={48}
                      />
                    </motion.div>
                    <div>
                      <p className='font-medium text-gray-800'>
                        {isDragging
                          ? 'Lepaskan file di sini'
                          : 'Klik atau seret file CSV ke sini'}
                      </p>
                      <p className='text-sm text-gray-600 mt-1'>
                        Format yang didukung: CSV dengan struktur kolom yang
                        benar
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Divider */}
              <div className='relative flex items-center justify-center'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative bg-white px-3 text-sm text-gray-500'>
                  ATAU
                </div>
              </div>

              {/* Google Sheets Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='space-y-4'
              >
                <Label className='text-lg font-medium flex items-center gap-2'>
                  <Link className='text-[#C5BAFF]' size={20} />
                  Import dari Google Sheets
                </Label>

                <Card className='bg-gradient-to-r from-[#E8F9FF] to-[#C4D9FF] border-[#C5BAFF]'>
                  <CardContent className='pt-6'>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='sheet-url' className='text-gray-700'>
                          Link Google Sheets (Format CSV)
                        </Label>
                        <Input
                          id='sheet-url'
                          type='text'
                          placeholder='https://docs.google.com/spreadsheets/d/...'
                          value={sheetUrl}
                          onChange={(e) => setSheetUrl(e.target.value)}
                          className='bg-white border-gray-300 focus:border-[#C5BAFF]'
                        />
                      </div>

                      <div className='bg-blue-50 p-4 rounded-md text-sm border border-blue-100'>
                        <p className='font-medium flex items-center gap-2 text-blue-700 mb-2'>
                          <AlertCircle size={16} className='text-blue-500' />
                          Cara mendapatkan link:
                        </p>
                        <ol className='list-decimal ml-5 space-y-1 text-blue-600'>
                          <li>Buka Google Sheets Anda</li>
                          <li>
                            Klik <strong>File → Share → Publish to web</strong>
                          </li>
                          <li>
                            Pilih format <strong>CSV</strong> dan salin link
                            yang dihasilkan
                          </li>
                        </ol>
                      </div>

                      <Button
                        onClick={handleSheet}
                        disabled={isLoading}
                        className='w-full flex items-center justify-center gap-2 bg-[#C5BAFF] hover:bg-[#b5a9ff] text-gray-800 font-medium py-3'
                      >
                        {isLoading ? (
                          <>Memproses...</>
                        ) : (
                          <>
                            Import Data <ArrowRight size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='bg-white p-5 rounded-xl shadow-md border border-gray-200'
          >
            <h3 className='font-medium text-gray-800 flex items-center gap-2 mb-3'>
              <CheckCircle size={18} className='text-green-500' />
              Pastikan data Anda memiliki format yang benar:
            </h3>
            <div className='bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto font-mono'>
              <code className='text-gray-700'>
                date,product,sales,stock_in,stock_out,stock_remaining
                <br />
                2025-07-01,Kaos,12,50,12,38
                <br />
                2025-07-02,Celana,8,40,8,32
                <br />
                2025-07-02,Jaket,5,30,5,25
              </code>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
