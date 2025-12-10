import UploadForm from '@/components/UploadForm';
import { Metadata } from 'next';

export const metadata = {
  title: 'Upload File - FileUpload',
  description: 'Unggah file dengan mudah dan dapatkan tautan langsung untuk dibagikan',
};

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upload File
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Unggah file Anda dan dapatkan tautan langsung untuk dibagikan ke siapa saja
            </p>
          </div>
          <UploadForm />
          
          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 text-2xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Semua Format
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Support gambar, video, audio, dokumen, dan archive. Max 100MB per file.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-green-600 dark:text-green-400 text-2xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cepat & Stabil
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Menggunakan Cloudinary CDN untuk kecepatan upload/download optimal.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-purple-600 dark:text-purple-400 text-2xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Privasi Terjaga
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Opsi password protection untuk file sensitif. Auto-delete setelah 30 hari.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
