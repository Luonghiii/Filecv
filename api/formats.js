module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formats = {
    image: {
      input: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'],
      output: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'pdf'],
      features: ['resize', 'quality', 'format conversion']
    },
    document: {
      input: ['docx'],
      output: ['html', 'text'],
      features: ['text extraction', 'html conversion']
    },
    pdf: {
      input: ['pdf'],
      output: ['jpg', 'png', 'text'],
      features: ['page extraction', 'image conversion'],
      note: 'Limited support in serverless environment'
    }
  };

  const conversions = [
    { from: 'jpg/jpeg/png/webp/gif', to: 'jpg/png/webp/avif', category: 'Image Format' },
    { from: 'jpg/jpeg/png/webp', to: 'pdf', category: 'Image to PDF' },
    { from: 'docx', to: 'html', category: 'Document to HTML' },
    { from: 'docx', to: 'text', category: 'Document to Text' },
    { from: 'pdf', to: 'jpg/png', category: 'PDF to Image', note: 'Limited' }
  ];

  res.status(200).json({
    status: 'success',
    formats,
    conversions,
    usage: {
      endpoint: '/api/convert',
      method: 'POST',
      body: {
        file: 'base64 encoded file or data URL',
        from: 'source format (e.g., jpg, png, docx)',
        to: 'target format (e.g., png, pdf, html)',
        options: {
          quality: 'image quality 1-100 (default: 90)',
          width: 'resize width in pixels',
          height: 'resize height in pixels',
          fit: 'resize fit mode: cover, contain, fill, inside, outside (default: inside)',
          maxPages: 'max PDF pages to convert (default: all)'
        }
      }
    },
    examples: [
      {
        description: 'Convert JPG to PNG',
        request: {
          file: 'data:image/jpeg;base64,...',
          from: 'jpg',
          to: 'png'
        }
      },
      {
        description: 'Convert and resize image',
        request: {
          file: 'data:image/jpeg;base64,...',
          from: 'jpg',
          to: 'webp',
          options: {
            quality: 85,
            width: 800,
            height: 600
          }
        }
      },
      {
        description: 'Convert DOCX to HTML',
        request: {
          file: 'base64_encoded_docx',
          from: 'docx',
          to: 'html'
        }
      }
    ]
  });
};
