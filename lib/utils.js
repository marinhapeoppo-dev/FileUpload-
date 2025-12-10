import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import 'moment/locale/id';

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate unique ID untuk file
export const generateFileId = () => {
  return uuidv4().replace(/-/g, '').substring(0, 12);
};

// Format tanggal
export const formatDate = (date, format = 'DD MMM YYYY HH:mm') => {
  return moment(date).locale('id').format(format);
};

// Hitung waktu yang lalu
export const timeAgo = (date) => {
  return moment(date).locale('id').fromNow();
};

// Validasi file
export const validateFile = (file, maxSize = 100 * 1024 * 1024) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'text/plain',
  ];

  const errors = [];

  // Cek ukuran file
  if (file.size > maxSize) {
    errors.push(`Ukuran file terlalu besar. Maksimal: ${formatFileSize(maxSize)}`);
  }

  // Cek tipe file
  if (!allowedTypes.includes(file.type)) {
    errors.push('Tipe file tidak didukung');
  }

  // Cek nama file
  if (file.name.length > 200) {
    errors.push('Nama file terlalu panjang');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Ekstrak ekstensi file
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

// Dapatkan icon berdasarkan tipe file
export const getFileIcon = (filename, fileType) => {
  const ext = getFileExtension(filename);
  
  if (fileType === 'image') {
    return '🖼️';
  } else if (fileType === 'video') {
    return '🎬';
  } else if (fileType === 'audio') {
    return '🎵';
  } else if (fileType === 'document') {
    if (['pdf'].includes(ext)) return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['txt', 'rtf'].includes(ext)) return '📃';
    return '📄';
  } else if (fileType === 'archive') {
    return '📦';
  } else {
    return '📎';
  }
};

// Buat object URL untuk preview
export const createObjectURL = (file) => {
  return URL.createObjectURL(file);
};

// Hapus object URL
export const revokeObjectURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

// Generate password sederhana
export const generatePassword = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Delay function
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
