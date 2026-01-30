"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=products.js.map