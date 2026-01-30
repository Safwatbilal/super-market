/**
 * @swagger
 * components:
 *   schemas:
 *     Size:
 *       type: object
 *       required:
 *         - name
 *         - weight
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Size name (e.g., Small, Medium, Large)
 *           example: Medium
 *         weight:
 *           type: number
 *           description: Weight in kilograms
 *           example: 2.5
 *         price:
 *           type: number
 *           description: Price for this size
 *           example: 150
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category_id
 *         - currency
 *       properties:
 *         _id:
 *           type: string
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *           example: Premium Coffee Beans
 *         category_id:
 *           type: string
 *           description: Category ID reference
 *           example: 507f1f77bcf86cd799439011
 *         image_url:
 *           type: string
 *           description: Product image URL
 *           example: https://example.com/coffee.jpg
 *         weight:
 *           type: number
 *           description: Base weight (required if no sizes)
 *           example: 1.0
 *         currency:
 *           type: string
 *           enum: [USD, SAR, SYP]
 *           description: Currency type
 *           example: USD
 *         price:
 *           type: number
 *           description: Base price (required if no sizes)
 *           example: 99.99
 *         sizes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Size'
 *           description: Multiple sizes with different prices
 *         status:
 *           type: string
 *           enum: [published, unpublished]
 *           description: Product status
 *           example: published
 *         is_featured:
 *           type: boolean
 *           description: Whether product is featured
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filters
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name (case-insensitive)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [published, unpublished]
 *         description: Filter by status
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured products
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [USD, SAR, SYP]
 *         description: Filter by currency
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                 page:
 *                   type: number
 *                 pageSize:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalProducts:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Not authorized
 */
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category_id
 *               - currency
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Coffee Beans
 *               category_id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               image_url:
 *                 type: string
 *                 example: https://example.com/coffee.jpg
 *               weight:
 *                 type: number
 *                 description: Required if sizes not provided
 *                 example: 1.0
 *               currency:
 *                 type: string
 *                 enum: [USD, SAR, SYP]
 *                 example: USD
 *               price:
 *                 type: number
 *                 description: Required if sizes not provided
 *                 example: 99.99
 *               sizes:
 *                 type: array
 *                 description: Optional - multiple sizes with prices
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Small
 *                     weight:
 *                       type: number
 *                       example: 0.5
 *                     price:
 *                       type: number
 *                       example: 50
 *               status:
 *                 type: string
 *                 enum: [published, unpublished]
 *                 example: published
 *               is_featured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Category not found
 */
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category_id:
 *                 type: string
 *               image_url:
 *                 type: string
 *               weight:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [USD, SAR, SYP]
 *               price:
 *                 type: number
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     weight:
 *                       type: number
 *                     price:
 *                       type: number
 *               status:
 *                 type: string
 *                 enum: [published, unpublished]
 *               is_featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Not authorized
 */
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Not authorized
 */
/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get all featured products (public)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of featured products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 page:
 *                   type: number
 *                 pageSize:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalProducts:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Get all products in a category (public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of products in category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
export {};
//# sourceMappingURL=products.d.ts.map