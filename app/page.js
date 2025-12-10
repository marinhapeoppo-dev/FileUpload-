'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  Zap, 
  Shield, 
  Globe, 
  Clock,
  FileText,
  Users,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import UploadForm from '@/components/UploadForm';
import FileList from '@/components/FileList';
import { formatFileSize } from '@/lib/utils';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalUploads: '1.2M+',
    totalSize: '45TB+',
    activeUsers: '50K+',
    uptime: '99.9%'
  });

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Super Cepat',
      description: 'Upload dan download dengan kecepatan tinggi menggunakan CDN global',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '100% Aman',
      description: 'File Anda dilindungi dengan enkripsi SSL dan sistem keamanan terbaik',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Akses Global',
      description: 'Akses file dari mana saja dengan server di seluruh dunia',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Tahan Lama',
      description: 'File tersimpan selama 30 hari sejak upload terakhir',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const recentFiles = [
    {
      id: 1,
      name: 'presentation-final.pptx',
      size: 2457600,
      type: 'document',
      uploadDate: '2 jam yang lalu',
      downloads: 45
    },
    {
      id: 2,
      name: 'beach-vacation.jpg',
      size: 3145728,
      type: 'image',
      uploadDate: '1 hari yang lalu',
      downloads: 123
    },
    {
      id: 3,
      name: 'project-backup.zip',
      size: 10485760,
      type: 'archive',
      uploadDate: '3 hari yang lalu',
      downloads: 12
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Unggah & Bagikan File{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dengan Mudah
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Layanan upload file gratis, cepat, dan aman. Bagikan file besar tanpa batas 
              seperti Catbox dan Top4Top.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Upload className="mr-2" size={20} />
                Mulai Unggah Gratis
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700"
              >
                Pelajari Fitur
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Unggah File Sekarang
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Drag & drop file Anda atau klik untuk memilih. Proses upload otomatis dimulai.
            </p>
          </div>
          <UploadForm />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk berbagi file dengan mudah dan aman.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Files Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                File Terbaru
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Lihat file yang baru saja diupload oleh pengguna
              </p>
            </div>
            <Link
              href="/files"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center"
            >
              Lihat Semua
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Nama File
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Ukuran
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Tipe
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Diupload
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <FileText className="text-gray-400" size={18} />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {file.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                        {file.uploadDate}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="text-gray-400" size={16} />
                          <span className="text-gray-900 dark:text-white">
                            {file.downloads}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Mulai Berbagi File?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Bergabung dengan ribuan pengguna yang telah mempercayakan file mereka pada kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              <Upload className="mr-2" size={20} />
              Unggah File Sekarang
            </Link>
            <Link
              href="/files"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-700/30 rounded-xl hover:bg-blue-700/40 transition-all border border-white/20"
            >
              <Users className="mr-2" size={20} />
              Lihat Contoh File
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
