'use client';

import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Upload, 
  X, 
  File, 
  Video, 
  Image, 
  Music, 
  Archive,
  Loader2,
  Check,
  AlertCircle,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  formatFileSize, 
  validateFile, 
  createObjectURL, 
  revokeObjectURL,
  getFileIcon,
  getFileExtension,
  generatePassword,
  copyToClipboard
} from '@/lib/utils';

export default function UploadForm() {
  // State
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadOptions, setUploadOptions] = useState({
    public: true,
    password: '',
    expires: 'never',
    showPassword: false,
  });

  // Refs
  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);

  // Handler untuk drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handler untuk drop file
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  // Handler untuk select file
  const handleFileSelect = (selectedFile) => {
    // Hapus preview sebelumnya
    if (previewUrl) {
      revokeObjectURL(previewUrl);
    }
    
    // Validasi file
    const validation = validateFile(selectedFile);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    
    // Reset state sebelumnya
    setFile(selectedFile);
    setUploadResult(null);
    
    // Buat preview untuk gambar
    if (selectedFile.type.startsWith('image/')) {
      const url = createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Generate password otomatis
  const generateRandomPassword = () => {
    const password = generatePassword(8);
    setUploadOptions(prev => ({ ...prev, password }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setUploadOptions(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  // Handler upload
  const handleUpload = async () => {
    if (!file) {
      toast.error('Pilih file terlebih dahulu!');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    
    // Tambahkan metadata jika ada
    if (!uploadOptions.public && uploadOptions.password) {
      formData.append('password', uploadOptions.password);
    }
    if (uploadOptions.expires !== 'never') {
      formData.append('expires', uploadOptions.expires);
    }

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setUploadResult(response.data);
        
        // Reset file input
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Hapus preview
        if (previewUrl) {
          revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        
        toast.success('File berhasil diunggah!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload gagal';
      toast.error(`Upload gagal: ${errorMessage}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Copy URL ke clipboard
  const handleCopyUrl = async () => {
    if (!uploadResult?.url) return;
    
    const success = await copyToClipboard(uploadResult.url);
    if (success) {
      toast.success('URL berhasil disalin!');
    } else {
      toast.error('Gagal menyalin URL');
    }
  };

  // Reset form
  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
    setUploadProgress(0);
    
    if (previewUrl) {
      revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setUploadOptions({
      public: true,
      password: '',
      expires: 'never',
      showPassword: false,
    });
  };

  // Render file icon berdasarkan tipe
  const renderFileIcon = () => {
    if (!file) return <File size={48} className="text-gray-400" />;
    
    const ext = getFileExtension(file.name);
    
    if (file.type.startsWith('image/')) {
      return <Image size={48} className="text-green-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video size={48} className="text-red-500" />;
    } else if (file.type.startsWith('audio/')) {
      return <Music size={48} className="text-purple-500" />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return <Archive size={48} className="text-yellow-500" />;
    } else {
      return <File size={48} className="text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Upload Result */}
      {uploadResult && (
        <div className="mb-8 card p-6 animate-fadeIn highlight">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Check className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Berhasil!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  File berhasil diunggah ke server
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tautan File:
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={uploadResult.url}
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg px-4 py-3 text-sm font-mono truncate"
                />
                <button
                  onClick={handleCopyUrl}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg transition-colors font-medium"
                >
                  Salin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nama File</p>
                <p className="font-medium truncate">{uploadResult.filename}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ukuran</p>
                <p className="font-medium">{uploadResult.formattedSize}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tipe File</p>
                <p className="font-medium capitalize">{uploadResult.fileType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-medium text-green-600 dark:text-green-400">Public</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={uploadResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>Preview</span>
              </a>
              <a
                href={uploadResult.directUrl}
                download
                className="btn-primary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Download</span>
              </a>
              <button
                onClick={() => navigator.share?.({
                  title: uploadResult.filename,
                  text: 'Check out this file',
                  url: uploadResult.url,
                })}
                className="btn-secondary flex items-center space-x-2"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unggah File Anda
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tarik & lepas file atau klik untuk memilih
          </p>
        </div>

        {/* File Dropzone */}
        <div
          ref={dropzoneRef}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`file-dropzone p-8 mb-8 cursor-pointer transition-all ${
            dragActive ? 'active' : ''
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
            accept="*/*"
          />
          
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800">
              {file ? renderFileIcon() : <Upload size={32} className="text-gray-400" />}
            </div>
            
            <div className="space-y-2">
              {file ? (
                <>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center space-x-1"
                  >
                    <X size={14} />
                    <span>Hapus</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Tarik file ke sini atau klik untuk memilih
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Maksimal 100MB • Semua format file didukung
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* File Preview */}
        {previewUrl && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview Gambar
            </h3>
            <div className="relative max-w-md mx-auto">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Upload Options */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Opsi Unggah
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Privacy Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Privasi File
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={uploadOptions.public}
                    onChange={() => setUploadOptions(prev => ({ ...prev, public: true, password: '' }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Globe size={18} className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">Public</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={!uploadOptions.public}
                    onChange={() => setUploadOptions(prev => ({ ...prev, public: false }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Lock size={18} className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">Private dengan Password</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Password Input */}
            {!uploadOptions.public && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type={uploadOptions.showPassword ? 'text' : 'password'}
                      value={uploadOptions.password}
                      onChange={(e) => setUploadOptions(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Masukkan password"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {uploadOptions.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            )}

            {/* Expiration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Masa Berlaku
              </label>
              <select
                value={uploadOptions.expires}
                onChange={(e) => setUploadOptions(prev => ({ ...prev, expires: e.target.value }))}
                className="input-field"
              >
                <option value="never">Tidak pernah kadaluarsa</option>
                <option value="1h">1 Jam</option>
                <option value="1d">1 Hari</option>
                <option value="7d">7 Hari</option>
                <option value="30d">30 Hari</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mengunggah...
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3 text-lg"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Unggah File</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            disabled={uploading}
            className="btn-secondary py-3 px-6"
          >
            Reset
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-3">
            <AlertCircle size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">Perhatian:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>File akan dihapus otomatis setelah 30 hari tidak diakses</li>
                <li>Maksimal ukuran file: 100MB</li>
                <li>File ilegal akan dihapus tanpa pemberitahuan</li>
                <li>Pastikan file tidak mengandung informasi sensitif</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import tambahan
import { Download, Share2 } from 'lucide-react';
