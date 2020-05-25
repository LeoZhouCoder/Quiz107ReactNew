/* eslint-disable no-param-reassign */
// mock products
const PRODUCT_TYPES = ['Hardware', 'Software'];

const createProducts = (number) => {
  const products = [];
  for (let i = 0; i < number; i += 1) {
    products.unshift({
      id: i,
      key: i,
      name: `Product${i}`,
      price: parseFloat((100 * Math.random()).toFixed(2)),
      type: PRODUCT_TYPES[parseInt(PRODUCT_TYPES.length * Math.random(), 10)],
      description: `Product${i}: A numeric-only input box whose values can be increased or decreased using a decimal step. The number of decimals (also known as precision) is determined by the step prop.`,
    });
  }
  return products;
};

const allProducts = createProducts(501);

const getProductsBaseOnQuery = (queryOptions) => {
  const { current, pageSize, search, sortKey, sortOrder } = queryOptions;

  let products = [...allProducts];
  if (search) {
    const regex = RegExp(search);
    products = products.filter(
      (product) =>
        regex.test(product.name) || regex.test(product.description) || regex.test(product.type),
    );
  }

  if (sortOrder) {
    const descend = sortOrder === 'descend';
    if (sortKey === 'price') {
      products.sort((a, b) => {
        const aPrice = parseFloat(a.price);
        const bPrice = parseFloat(b.price);
        return descend ? bPrice - aPrice : aPrice - bPrice;
      });
    } else {
      products.sort((a, b) => {
        const aValue = a[sortKey].toUpperCase();
        const bValue = b[sortKey].toUpperCase();
        if (aValue === bValue) return 0;
        const result = aValue < bValue ? -1 : 1;
        return descend ? result * -1 : result;
      });
    }
  }

  const total = products.length;
  const limit = parseInt(pageSize, 10);
  const position = (parseInt(current, 10) - 1) * limit;
  products = products.slice(position, position + limit);
  const tableData = { total, products, queryOptions };
  return tableData;
};

const getProducts = (req, res) => {
  return res.json(getProductsBaseOnQuery(req.body));
};

const addProduct = (req, res) => {
  const { product, queryOptions } = req.body;
  product.id = allProducts.length;
  product.key = allProducts.length;
  allProducts.unshift(product);
  return res.json(getProductsBaseOnQuery(queryOptions));
};

const editProduct = (req, res) => {
  const { product, queryOptions } = req.body;
  let itemIndex = -1;
  allProducts.forEach((item, index) => {
    if (item.id === product.id) {
      itemIndex = index;
      item.name = product.name;
      item.price = product.price;
      item.type = product.type;
      item.description = product.description;
    }
  });
  if (itemIndex !== -1) {
    const [item] = allProducts.splice(itemIndex, 1);
    allProducts.unshift(item);
  }

  return res.json(getProductsBaseOnQuery(queryOptions));
};

export default {
  'POST /api/getProducts': getProducts,
  'POST /api/addProduct': addProduct,
  'POST /api/editProduct': editProduct,
};
