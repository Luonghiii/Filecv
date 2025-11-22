# 🔄 File Converter API

Công cụ chuyển đổi file đa năng với giao diện web đẹp, deploy lên Vercel.

## ✨ Tính năng

### Chuyển đổi Image
- JPG ↔ PNG ↔ WEBP ↔ GIF ↔ AVIF
- Resize ảnh (width, height)
- Điều chỉnh chất lượng
- Image → PDF

### Chuyển đổi Document
- DOCX → HTML
- DOCX → Text

### Chuyển đổi PDF
- PDF → JPG/PNG (giới hạn do serverless)

## 🚀 Deploy lên Vercel

### Cách 1: Deploy qua Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login vào Vercel
vercel login

# Deploy
cd file-converter
vercel
```

### Cách 2: Deploy qua GitHub

1. Push code lên GitHub repository
2. Vào https://vercel.com
3. Import repository
4. Deploy tự động

### Cách 3: Deploy trực tiếp

```bash
cd file-converter
vercel --prod
```

## 📡 API Endpoints

### GET /api/convert
Thông tin API và các format được hỗ trợ

### POST /api/convert
Chuyển đổi file

**Request Body:**
```json
{
  "file": "data:image/jpeg;base64,/9j/4AAQ...",
  "from": "jpg",
  "to": "png",
  "options": {
    "quality": 90,
    "width": 800,
    "height": 600
  }
}
```

**Response:**
```json
{
  "status": "success",
  "conversion": "jpg-to-png",
  "file": "data:image/png;base64,...",
  "base64": "iVBORw0KG...",
  "mimeType": "image/png",
  "size": 123456
}
```

### GET /api/formats
Danh sách format và conversions được hỗ trợ

## 🌐 Sử dụng

### Web Interface
Truy cập: `https://your-domain.vercel.app`

### API Usage

**JavaScript/Node.js:**
```javascript
const convertFile = async (fileBase64, from, to, options = {}) => {
  const response = await fetch('https://your-domain.vercel.app/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      file: fileBase64,
      from: from,
      to: to,
      options: options
    })
  });
  
  return await response.json();
};

// Example: Convert JPG to PNG
const result = await convertFile('data:image/jpeg;base64,...', 'jpg', 'png', {
  quality: 90
});
```

**cURL:**
```bash
curl -X POST https://your-domain.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "file": "data:image/jpeg;base64,...",
    "from": "jpg",
    "to": "png",
    "options": {
      "quality": 90
    }
  }'
```

**PHP:**
```php
<?php
$data = [
    'file' => 'data:image/jpeg;base64,...',
    'from' => 'jpg',
    'to' => 'png',
    'options' => [
        'quality' => 90
    ]
];

$ch = curl_init('https://your-domain.vercel.app/api/convert');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

$response = json_decode($result, true);
```

## 📝 Options

### Image Conversion Options
- `quality`: Chất lượng ảnh (1-100, mặc định: 90)
- `width`: Chiều rộng (pixels)
- `height`: Chiều cao (pixels)
- `fit`: Resize mode: 'cover', 'contain', 'fill', 'inside', 'outside' (mặc định: 'inside')

### PDF Options
- `maxPages`: Số trang tối đa để convert (mặc định: all)

## 🔧 Cấu trúc Project

```
file-converter/
├── api/
│   ├── convert.js      # Main conversion endpoint
│   └── formats.js      # List supported formats
├── public/
│   └── index.html      # Web interface
├── package.json        # Dependencies
├── vercel.json         # Vercel config
└── README.md
```

## ⚙️ Environment Variables

Không cần thiết lập environment variables. API hoạt động ngay sau khi deploy.

## 🎨 Customization

### Thêm format mới
Edit file `api/convert.js` và thêm case mới vào switch statement:

```javascript
case 'your-format-to-target':
  result = await yourConversionFunction(fileBuffer);
  break;
```

### Tùy chỉnh giao diện
Edit file `public/index.html` để thay đổi màu sắc, layout, v.v.

## ⚠️ Giới hạn

- Vercel serverless functions có giới hạn:
  - Execution time: 60 seconds
  - Memory: 3008 MB
  - Request body: 4.5 MB
- PDF conversion có giới hạn do môi trường serverless
- File lớn có thể cần nhiều thời gian xử lý

## 🐛 Troubleshooting

### File quá lớn
- Giảm kích thước file trước khi upload
- Hoặc resize ảnh trước

### PDF conversion failed
- PDF phức tạp có thể không convert được trong serverless environment
- Khuyến nghị dùng external service cho PDF

### Timeout
- Tăng maxDuration trong vercel.json (tối đa 60s cho free plan)

## 📦 Dependencies

- `sharp`: Image processing
- `pdf-lib`: PDF manipulation
- `mammoth`: DOCX to HTML/text conversion

## 📞 Contact

- Facebook: [facebook.com/luonghiii](https://facebook.com/luonghiii)
- Zalo: 0916508081

## 📄 License

MIT License - Free to use

---

Made with ❤️ by Luonghiii
