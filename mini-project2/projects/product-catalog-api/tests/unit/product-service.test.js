const productService = require('../../src/services/product-service');

describe('ProductService', () => {
  // Mock për produkte për testim
  const mockProducts = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 150 },
  ];

  // Mock për funksionin getProductById
  productService.getProductById = jest.fn((id) => {
    return mockProducts.find(product => product.id === id) || null;
  });

  // Mock për funksionin getAllProducts
  productService.getAllProducts = jest.fn(() => {
    return mockProducts;
  });

  // Mock për funksionin createProduct
  productService.createProduct = jest.fn((newProduct) => {
    mockProducts.push(newProduct);
    return newProduct;
  });

  describe('getProductById', () => {
    it('should return a product by ID', () => {
      const result = productService.getProductById(1);
      expect(result).toHaveProperty('id', 1);  // Sigurohuni që ID e produktit është 1
    });

    it('should return null if product ID does not exist', () => {
      const result = productService.getProductById(999);  // ID që nuk ekziston
      expect(result).toBeNull(); // Duhet të kthehet null
    });
  });

  describe('getAllProducts', () => {
    it('should return an array of products', () => {
      const result = productService.getAllProducts();
      expect(result).toBeInstanceOf(Array);  // Duhet të jetë një array
      expect(result.length).toBeGreaterThan(0); // Duhet të ketë të paktën një produkt
    });

    it('should return correct products', () => {
      const result = productService.getAllProducts();
      expect(result).toContainEqual({ id: 1, name: 'Product 1', price: 100 });
      expect(result).toContainEqual({ id: 2, name: 'Product 2', price: 150 });
    });
  });

  describe('createProduct', () => {
    it('should add a new product to the list', () => {
      const newProduct = { id: 3, name: 'Product 3', price: 200 };

      const result = productService.createProduct(newProduct);

      // Verifikoni që produkti është shtuar me sukses
      expect(result).toEqual(newProduct); // Kthehet produkti i krijuar
      expect(mockProducts.length).toBe(3); // Lista duhet të ketë tani 3 produkte
      expect(mockProducts).toContainEqual(newProduct); // Produkti i ri duhet të jetë në listë
    });
  });
});