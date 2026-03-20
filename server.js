const express = require('express');
const path = require('path');
const products = require('./data/products.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const featured = products.filter(p => p.featured);
  const collections = [...new Set(products.map(p => p.collection))];
  res.render('pages/home', { products, featured, collections });
});

app.get('/product/:slug', (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) return res.status(404).send('Product not found');
  const related = products.filter(p => p.collection === product.collection && p.slug !== product.slug).slice(0, 4);
  res.render('pages/product', { product, related });
});

app.get('/collections', (req, res) => {
  res.render('pages/home', { products, featured: products.filter(p => p.featured), collections: [...new Set(products.map(p => p.collection))] });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`LacLac Jewelry running at http://localhost:${PORT}`);
  });
}

module.exports = app;
