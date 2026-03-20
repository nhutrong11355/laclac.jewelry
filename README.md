# LẠC LẠC - Lab Fine Jewelry 💎

Website trang sức cao cấp cho thương hiệu LacLac Jewelry — Kim cương nhân tạo, Moissanite, Vàng & Bạc theo yêu cầu. Chế tác thủ công tại Thảo Điền, TP.HCM.

🌐 **Live:** [https://laclacjewelry.com](https://laclacjewelry.com)

## Yêu Cầu Hệ Thống

- [Node.js](https://nodejs.org/) >= 18.x
- npm >= 9.x

## Cài Đặt

```bash
# Clone repository
git clone https://github.com/your-username/laclac.jewelry.git
cd laclac.jewelry

# Cài đặt dependencies
npm install
```

## Chạy Trên Local

```bash
# Chạy dev server (mặc định port 3001)
npm run dev
```

Mở trình duyệt tại **http://localhost:3001**

Để thay đổi port, sử dụng biến môi trường:

```bash
PORT=4000 npm run dev
```

## Build Static Site

```bash
# Build ra thư mục dist/
npm run build
```

Thư mục `dist/` chứa toàn bộ HTML/CSS/JS tĩnh, sẵn sàng deploy.

## Deploy Lên Netlify

```bash
# Cài Netlify CLI (nếu chưa có)
npm install -g netlify-cli

# Deploy production
netlify deploy --prod
```

## Cấu Trúc Thư Mục

```
laclac.jewelry/
├── data/
│   ├── products.json        # Dữ liệu sản phẩm
│   └── gemstones.json       # Dữ liệu đá quý
├── views/
│   ├── layouts/main.ejs     # Layout chính (HTML head, body)
│   ├── pages/
│   │   ├── home.ejs         # Trang chủ
│   │   ├── product.ejs      # Chi tiết sản phẩm
│   │   └── gemstones.ejs    # Bộ sưu tập đá quý
│   └── partials/
│       ├── header.ejs       # Header & navigation
│       ├── footer.ejs       # Footer
│       └── product-card.ejs # Card sản phẩm
├── public/
│   ├── css/style.css        # Stylesheet
│   ├── js/main.js           # JavaScript
│   ├── images/              # Logo & hình ảnh
│   └── products/gemstones/  # Hình đá quý
├── dist/                    # Output build (static HTML)
├── server.js                # Express dev server
├── build.js                 # Static site generator
├── netlify.toml             # Cấu hình Netlify
└── package.json
```

## Công Nghệ

- **Server:** Node.js + Express
- **Template:** EJS
- **Build:** Custom static site generator
- **Hosting:** Netlify
- **Fonts:** Cormorant Garamond + Montserrat (Google Fonts)

## Liên Hệ

- 📷 Instagram: [@laclac.jewelry](https://www.instagram.com/laclac.jewelry/)
- 📘 Facebook: [LacLac Jewelry](https://www.facebook.com/profile.php?id=61579703409647)
- 📍 Thảo Điền, TP. Hồ Chí Minh
