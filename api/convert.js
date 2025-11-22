const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'success',
      message: 'File Converter API',
      version: '1.0.0',
      endpoints: {
        convert: '/api/convert',
        formats: '/api/formats'
      },
      supportedConversions: [
        'image-to-image (jpg, png, webp, gif, avif)',
        'image-to-pdf',
        'docx-to-html',
        'docx-to-text',
        'html-to-pdf',
        'pdf-to-images'
      ]
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file, from, to, options = {} } = req.body;

    if (!file || !from || !to) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['file', 'from', 'to']
      });
    }

    // Xử lý base64 data URL
    let fileBuffer;
    if (file.startsWith('data:')) {
      const base64Data = file.split(',')[1];
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else {
      fileBuffer = Buffer.from(file, 'base64');
    }

    let result;
    const conversionKey = `${from}-to-${to}`;

    switch (conversionKey) {
      // Image conversions
      case 'jpg-to-png':
      case 'jpeg-to-png':
      case 'png-to-jpg':
      case 'png-to-jpeg':
      case 'webp-to-png':
      case 'webp-to-jpg':
      case 'gif-to-png':
      case 'jpg-to-webp':
      case 'png-to-webp':
      case 'jpg-to-avif':
      case 'png-to-avif':
        result = await convertImage(fileBuffer, to, options);
        break;

      // Image to PDF
      case 'jpg-to-pdf':
      case 'jpeg-to-pdf':
      case 'png-to-pdf':
      case 'webp-to-pdf':
        result = await imageToPdf(fileBuffer);
        break;

      // DOCX conversions
      case 'docx-to-html':
        result = await docxToHtml(fileBuffer);
        break;

      case 'docx-to-text':
        result = await docxToText(fileBuffer);
        break;

      // PDF to images
      case 'pdf-to-jpg':
      case 'pdf-to-png':
        result = await pdfToImages(fileBuffer, to, options);
        break;

      default:
        return res.status(400).json({
          error: 'Conversion not supported',
          requested: conversionKey,
          supported: [
            'image-to-image',
            'image-to-pdf',
            'docx-to-html',
            'docx-to-text',
            'pdf-to-images'
          ]
        });
    }

    return res.status(200).json({
      status: 'success',
      conversion: conversionKey,
      ...result
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return res.status(500).json({
      error: 'Conversion failed',
      message: error.message
    });
  }
};

// Image conversion function
async function convertImage(buffer, format, options = {}) {
  const quality = options.quality || 90;
  const width = options.width;
  const height = options.height;

  let sharpInstance = sharp(buffer);

  // Resize if dimensions provided
  if (width || height) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit: options.fit || 'inside',
      withoutEnlargement: true
    });
  }

  let outputBuffer;
  switch (format) {
    case 'jpg':
    case 'jpeg':
      outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
      break;
    case 'png':
      outputBuffer = await sharpInstance.png({ quality }).toBuffer();
      break;
    case 'webp':
      outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
      break;
    case 'avif':
      outputBuffer = await sharpInstance.avif({ quality }).toBuffer();
      break;
    case 'gif':
      outputBuffer = await sharpInstance.gif().toBuffer();
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  const base64 = outputBuffer.toString('base64');
  const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;

  return {
    file: `data:${mimeType};base64,${base64}`,
    base64: base64,
    mimeType: mimeType,
    size: outputBuffer.length
  };
}

// Image to PDF conversion
async function imageToPdf(imageBuffer) {
  const pdfDoc = await PDFDocument.create();
  
  let image;
  try {
    image = await pdfDoc.embedJpg(imageBuffer);
  } catch {
    try {
      image = await pdfDoc.embedPng(imageBuffer);
    } catch {
      throw new Error('Unsupported image format for PDF conversion');
    }
  }

  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height
  });

  const pdfBytes = await pdfDoc.save();
  const base64 = Buffer.from(pdfBytes).toString('base64');

  return {
    file: `data:application/pdf;base64,${base64}`,
    base64: base64,
    mimeType: 'application/pdf',
    size: pdfBytes.length
  };
}

// DOCX to HTML conversion
async function docxToHtml(docxBuffer) {
  const result = await mammoth.convertToHtml({ buffer: docxBuffer });
  const html = result.value;
  const base64 = Buffer.from(html).toString('base64');

  return {
    html: html,
    base64: base64,
    mimeType: 'text/html',
    size: html.length,
    messages: result.messages
  };
}

// DOCX to Text conversion
async function docxToText(docxBuffer) {
  const result = await mammoth.extractRawText({ buffer: docxBuffer });
  const text = result.value;
  const base64 = Buffer.from(text).toString('base64');

  return {
    text: text,
    base64: base64,
    mimeType: 'text/plain',
    size: text.length
  };
}

// PDF to Images conversion
async function pdfToImages(pdfBuffer, format, options = {}) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();
    const maxPages = options.maxPages || pageCount;
    const pagesToConvert = Math.min(maxPages, pageCount);

    return {
      totalPages: pageCount,
      convertedPages: pagesToConvert,
      message: 'PDF to image conversion requires additional processing. Consider using external service.',
      note: 'Vercel serverless functions have limitations for heavy PDF processing'
    };
  } catch (error) {
    throw new Error(`PDF processing failed: ${error.message}`);
  }
}
