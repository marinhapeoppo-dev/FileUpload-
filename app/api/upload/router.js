import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary, getFileType } from '@/lib/cloudinary';
import { validateFile, generateFileId, formatFileSize } from '@/lib/utils';
import os from 'os';

// Nonaktifkan body parser default Next.js
export const config = {
  api: {
    bodyParser: false,
  },
  runtime: 'nodejs',
};

// Helper untuk parse form data
async function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: false,
      maxFileSize: 100 * 1024 * 1024, // 100MB
      uploadDir: os.tmpdir(), // Gunakan temporary directory
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

export async function POST(request) {
  try {
    console.log('Upload request received');
    
    // Parse form data
    const { fields, files } = await parseFormData(request);
    
    const file = files?.file?.[0];
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('File received:', {
      name: file.originalFilename,
      size: file.size,
      type: file.mimetype,
      path: file.filepath,
    });

    // Validasi file
    const validation = validateFile({
      name: file.originalFilename,
      size: file.size,
      type: file.mimetype,
    });

    if (!validation.isValid) {
      // Hapus file temporary
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
      }
      
      return NextResponse.json(
        { error: 'File validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Baca file buffer
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Upload ke Cloudinary
    console.log('Uploading to Cloudinary...');
    const uploadResult = await uploadToCloudinary(fileBuffer, {
      public_id: `file_${Date.now()}_${generateFileId()}`,
      resource_type: 'auto',
      context: {
        filename: file.originalFilename,
        uploader: 'web',
      },
    });

    console.log('Cloudinary upload result:', {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      size: uploadResult.bytes,
      format: uploadResult.format,
    });

    // Hapus file temporary
    if (fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }

    // Siapkan response
    const fileType = getFileType(uploadResult.resource_type, uploadResult.format);
    const fileId = generateFileId();

    const responseData = {
      success: true,
      fileId,
      url: uploadResult.secure_url,
      directUrl: uploadResult.secure_url, // URL langsung untuk download
      publicId: uploadResult.public_id,
      filename: file.originalFilename,
      fileType,
      size: uploadResult.bytes,
      formattedSize: formatFileSize(uploadResult.bytes),
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration,
      uploadedAt: new Date().toISOString(),
      deleteUrl: `/api/files/${fileId}/delete`,
      shareable: true,
    };

    // Set cache headers untuk response
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    return NextResponse.json(responseData, { headers });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Hapus temporary files jika ada error
    try {
      if (error.filepath && fs.existsSync(error.filepath)) {
        fs.unlinkSync(error.filepath);
      }
    } catch (e) {
      console.error('Error cleaning up temp file:', e);
    }

    const errorMessage = error.message || 'Upload failed';
    const statusCode = error.http_code || 500;

    return NextResponse.json(
      {
        error: 'Upload failed',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: statusCode }
    );
  }
}

// Handle OPTIONS request untuk CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// GET untuk info API
export async function GET() {
  const info = {
    name: 'File Upload API',
    version: '1.0.0',
    description: 'API untuk upload file ke Cloudinary',
    maxFileSize: '100MB',
    allowedTypes: [
      'images (jpg, png, gif, webp, svg)',
      'videos (mp4, webm, mov)',
      'audio (mp3, wav, ogg)',
      'documents (pdf, doc, docx, txt)',
      'archives (zip, rar, 7z)',
    ],
    endpoints: {
      POST: '/api/upload - Upload file',
      GET: '/api/upload - API info',
    },
  };

  return NextResponse.json(info);
}
