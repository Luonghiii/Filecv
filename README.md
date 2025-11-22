# 🔄 File Converter API v1.1

Công cụ chuyển đổi file đa năng với giao diện web đẹp, hỗ trợ download file được cải thiện, deploy lên Vercel.

## 🆕 Cải tiến mới (v1.1)
- ✅ **Sửa lỗi nút tải xuống không hoạt động**
- ✅ **Sử dụng Blob URLs cho download hiệu quả hơn**
- ✅ **Thêm nút copy text/HTML vào clipboard**
- ✅ **Notification thông báo thành công**
- ✅ **Giao diện responsive tốt hơn**

## ✨ Tính năng

### Chuyển đổi Image
- JPG ↔ PNG ↔ WEBP ↔ GIF ↔ AVIF
- Resize ảnh (width, height)
- Điều chỉnh chất lượng (1-100)
- Image → PDF

### Chuyển đổi Document
- DOCX → HTML
- DOCX → Text
- Copy text/HTML vào clipboard

### Chuyển đổi PDF
- PDF → JPG/PNG (giới hạn do serverless)
- Xem thông tin PDF

## 🚀 Deploy lên Vercel

### Cách 1: Deploy qua Vercel CLI (Khuyến nghị)

```bash
# Install Vercel CLI
npm install -g vercel

# Clone hoặc download project
cd file-converter

# Login vào Vercel
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

### Cách 2: Deploy qua GitHub

1. Push code lên GitHub repository
2. Vào https://vercel.com
3. Import repository
4. Deploy tự động

### Cấu trúc file cần deploy

```
file-converter/
├── api/
│   ├── convert.js      # Main conversion endpoint
│   └── formats.js      # List supported formats
├── public/
│   └── index.html      # Web interface (đã sửa lỗi download)
├── package.json        # Dependencies
├── vercel.json         # Vercel config
└── README.md
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

**Response (đã cải thiện):**
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
- Truy cập: `https://your-domain.vercel.app`
- Upload file bằng drag & drop hoặc click chọn
- Chọn format chuyển đổi
- **Tải xuống file dễ dàng với nút download mới**
- **Copy text/HTML trực tiếp vào clipboard**

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
  
  const result = await response.json();
  
  // Download file using blob
  if (result.base64) {
    const byteCharacters = atob(result.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: result.mimeType });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted.${to}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  
  return result;
};
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

// Save file
if ($response['base64']) {
    file_put_contents('converted.png', base64_decode($response['base64']));
}
?>
```

## 📝 Options

### Image Conversion Options
- `quality`: Chất lượng ảnh (1-100, mặc định: 90)
- `width`: Chiều rộng (pixels)
- `height`: Chiều cao (pixels)
- `fit`: Resize mode: 'cover', 'contain', 'fill', 'inside', 'outside' (mặc định: 'inside')

### PDF Options
- `maxPages`: Số trang tối đa để convert (mặc định: all)

## 🎨 Tính năng mới

### Download được cải thiện
- Sử dụng Blob URLs thay vì data URLs
- Tương thích tốt hơn với tất cả trình duyệt
- Xử lý file lớn hiệu quả hơn
- Tự động cleanup memory

### Copy to Clipboard
- Copy text content trực tiếp
- Copy HTML content với formatting
- Fallback cho trình duyệt cũ
- Notification thông báo thành công

### UI/UX improvements
- Animation mượt mà hơn
- Responsive design tốt hơn
- Success notifications
- Error handling tốt hơn

## ⚙️ Environment Variables

Không cần thiết lập environment variables. API hoạt động ngay sau khi deploy.

## ⚠️ Giới hạn Vercel

- Execution time: 60 seconds (Hobby plan)
- Memory: 3008 MB (tăng từ 1024 MB)
- Request body: 4.5 MB
- PDF conversion có giới hạn do môi trường serverless

## 🐛 Troubleshooting

### ❌ Nút download không hoạt động (ĐÃ SỬA)
**Vấn đề:** Data URLs quá lớn hoặc trình duyệt chặn
**Giải pháp:** Đã chuyển sang sử dụng Blob URLs

### File quá lớn
- Giảm kích thước file trước khi upload
- Hoặc resize ảnh trước

### PDF conversion failed
- PDF phức tạp có thể không convert được
- Khuyến nghị dùng external service cho PDF nặng

### Timeout
- Tăng maxDuration trong vercel.json (đã set 60s)
- Sử dụng memory cao hơn (đã set 3008MB)

## 📦 Dependencies

```json
{
  "sharp": "^0.33.0",      // Image processing
  "pdf-lib": "^1.17.1",   // PDF manipulation  
  "mammoth": "^1.6.0",    // DOCX to HTML/text
  "html-pdf-node": "^1.0.8", // HTML to PDF
  "jszip": "^3.10.1"      // ZIP handling
}
```

## 🔧 Cấu hình Vercel

```json
{
  "version": 2,
  "functions": {
    "api/convert.js": {
      "maxDuration": 60,
      "memory": 3008
    }
  }
}
```

## 🎯 Demo

Sau khi deploy, bạn có thể test:

1. **Truy cập web interface:** `https://your-domain.vercel.app`
2. **Test API:** `https://your-domain.vercel.app/api/formats`
3. **Upload và convert file**
4. **Tải xuống kết quả với nút download mới**

## 📞 Contact

- Facebook: [facebook.com/luonghiii](https://facebook.com/luonghiii)
- Zalo: 0916508081
- Email: Liên hệ qua Facebook

## 📄 License

MIT License - Free to use

---

Made with ❤️ by Luonghiii

### Changelog v1.1
- ✅ Fixed download button not working
- ✅ Added Blob URL support for better file handling
- ✅ Added copy to clipboard functionality
- ✅ Improved UI with success notifications
- ✅ Better error handling and user feedback
- ✅ Increased Vercel memory limit to 3008MB
- ✅ Enhanced API response format
