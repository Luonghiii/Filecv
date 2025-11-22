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
      input: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg', 'tiff'],
      output: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'pdf'],
      features: ['resize', 'quality', 'format conversion']
    },
    document: {
      input: ['docx'],
      output: ['html', 'text', 'pdf'],
      features: ['text extraction', 'html conversion', 'pdf generation']
    },
    spreadsheet: {
      input: ['xlsx', 'csv'],
      output: ['csv', 'json', 'html', 'xlsx'],
      features: ['data conversion', 'table formatting']
    },
    data: {
      input: ['json', 'csv', 'xml'],
      output: ['json', 'csv', 'xml', 'html', 'xlsx'],
      features: ['structured data conversion', 'format transformation']
    },
    pdf: {
      input: ['pdf'],
      output: ['jpg', 'png', 'text'],
      features: ['page extraction', 'image conversion', 'text extraction'],
      note: 'Limited support in serverless environment'
    },
    web: {
      input: ['html', 'text'],
      output: ['pdf', 'text', 'html'],
      features: ['web content conversion', 'markup processing']
    }
  };

  const conversions = [
    { from: 'jpg/jpeg/png/webp/gif/svg', to: 'jpg/png/webp/avif/pdf', category: 'Image Format' },
    { from: 'docx', to: 'html/text/pdf', category: 'Document Conversion' },
    { from: 'xlsx', to: 'csv/json/html', category: 'Spreadsheet Export' },
    { from: 'csv', to: 'json/xlsx/html', category: 'Data Conversion' },
    { from: 'json', to: 'csv/xlsx/xml/html', category: 'JSON Export' },
    { from: 'xml', to: 'json', category: 'XML Processing' },
    { from: 'html', to: 'pdf/text', category: 'Web Content' },
    { from: 'text', to: 'pdf', category: 'Text Processing' },
    { from: 'pdf', to: 'jpg/png/text', category: 'PDF Export', note: 'Limited in serverless' }
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
