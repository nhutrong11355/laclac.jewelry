const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const products = require('./data/products.json');
const gemstones = require('./data/gemstones.json');

const DIST = path.join(__dirname, 'dist');
const VIEWS = path.join(__dirname, 'views');
const PUBLIC = path.join(__dirname, 'public');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function renderTemplate(templatePath, data) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, data, {
    filename: templatePath,
    views: [VIEWS]
  });
}

async function build() {
  console.log('🔨 Building LacLac Jewelry static site...');

  // Clean dist
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  // Copy public assets
  copyDir(PUBLIC, DIST);
  console.log('  ✓ Copied public assets');

  // Render homepage
  const featured = products.filter(p => p.featured);
  const collections = [...new Set(products.map(p => p.collection))];
  const homeHtml = renderTemplate(
    path.join(VIEWS, 'pages', 'home.ejs'),
    { products, featured, collections }
  );
  fs.writeFileSync(path.join(DIST, 'index.html'), homeHtml);
  console.log('  ✓ Built index.html');

  // Render product pages
  const productDir = path.join(DIST, 'product');
  fs.mkdirSync(productDir, { recursive: true });

  for (const product of products) {
    const related = products
      .filter(p => p.collection === product.collection && p.slug !== product.slug)
      .slice(0, 4);
    const html = renderTemplate(
      path.join(VIEWS, 'pages', 'product.ejs'),
      { product, related, pageTitle: product.name }
    );
    const productPageDir = path.join(productDir, product.slug);
    fs.mkdirSync(productPageDir, { recursive: true });
    fs.writeFileSync(path.join(productPageDir, 'index.html'), html);
    console.log(`  ✓ Built product/${product.slug}/index.html`);
  }

  // Render gemstones page
  const gemstonesDir = path.join(DIST, 'gemstones');
  fs.mkdirSync(gemstonesDir, { recursive: true });
  const gemstonesHtml = renderTemplate(
    path.join(VIEWS, 'pages', 'gemstones.ejs'),
    { gemstones, products, pageTitle: 'Gemstone Collection' }
  );
  fs.writeFileSync(path.join(gemstonesDir, 'index.html'), gemstonesHtml);
  console.log('  ✓ Built gemstones/index.html');

  // Render instruction page
  const instructionDir = path.join(DIST, 'instruction');
  fs.mkdirSync(instructionDir, { recursive: true });
  const instructionHtml = renderTemplate(
    path.join(VIEWS, 'pages', 'instruction.ejs'),
    { pageTitle: 'Hướng Dẫn Chọn Sản Phẩm' }
  );
  fs.writeFileSync(path.join(instructionDir, 'index.html'), instructionHtml);
  console.log('  ✓ Built instruction/index.html');

  console.log('\n✅ Build complete! Output in ./dist/');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
