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
  const featured = products.filter(p => p.featured);
  const collections = [...new Set(products.map(p => p.collection))];
  res.render('pages/home', { products, featured, collections, currentPage: 'home' });
});

app.get('/product/:slug', (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) return res.status(404).send('Product not found');
  const related = products.filter(p => p.collection === product.collection && p.slug !== product.slug).slice(0, 4);
  res.render('pages/product', { product, related, currentPage: 'product' });
});

app.get('/gemstones', (req, res) => {
  const products = loadProducts();
  const gemstones = loadGemstones();
  res.render('pages/gemstones', { gemstones, products, currentPage: 'gemstones' });
});

app.get('/instruction', (req, res) => {
  res.render('pages/instruction', { currentPage: 'instruction' });
});

app.get('/collections', (req, res) => {
  const products = loadProducts();
  res.render('pages/home', { products, featured: products.filter(p => p.featured), collections: [...new Set(products.map(p => p.collection))], currentPage: 'collections' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`LacLac Jewelry running at http://localhost:${PORT}`);
  });
}

module.exports = app;
