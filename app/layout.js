import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FileUpload - Unggah & Bagikan File Gratis',
  description: 'Unggah dan bagikan file dengan mudah seperti Catbox/Top4Top. Gratis, cepat, dan aman.',
  keywords: 'upload file, share file, free file hosting, cloud storage',
  openGraph: {
    title: 'FileUpload - Unggah & Bagikan File Gratis',
    description: 'Unggah dan bagikan file dengan mudah seperti Catbox/Top4Top',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">FileUpload</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Layanan upload file gratis dan cepat
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Privacy
            </a>
            <a
              href="/contact"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Contact
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} FileUpload. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
