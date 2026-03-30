const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Read data fresh on each request so edits are reflected without restart
function loadProducts() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8'));
}
function loadGemstones() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data/gemstones.json'), 'utf8'));
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const products = loadProducts();
  const gemstones = loadGemstones();
  const featured = products.filter(p => p.featured);
  const collections = [...new Set(products.map(p => p.collection))];
  res.render('pages/home', { products, gemstones, featured, collections, currentPage: 'home' });
});

app.get('/product/:slug', (req, res) => {
  const products = loadProducts();
  const gemstones = loadGemstones();
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) return res.status(404).send('Product not found');
  const related = products.filter(p => p.collection === product.collection && p.slug !== product.slug).slice(0, 4);
  res.render('pages/product', { product, related, products, gemstones, pageTitle: product.name, currentPage: 'product' });
});

app.get('/gemstones', (req, res) => {
  const products = loadProducts();
  const gemstones = loadGemstones();
  res.render('pages/gemstones', { gemstones, products, pageTitle: 'Gemstone Collection', currentPage: 'gemstones' });
});

app.get('/instruction', (req, res) => {
  const products = loadProducts();
  const gemstones = loadGemstones();
  res.render('pages/instruction', { products, gemstones, pageTitle: 'Hướng Dẫn Chọn Sản Phẩm', currentPage: 'instruction' });
});

app.get('/collections', (req, res) => {
  const products = loadProducts();
  const gemstones = loadGemstones();
  res.render('pages/home', { products, gemstones, featured: products.filter(p => p.featured), collections: [...new Set(products.map(p => p.collection))], currentPage: 'collections' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`LacLac Jewelry running at http://localhost:${PORT}`);
  });
}

module.exports = app;
