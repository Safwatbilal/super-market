/**
 * @swagger
 * /api/auth/register/customer:
 *   post:
 *     summary: Register a new customer
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Customer registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/register/supermarket:
 *   post:
 *     summary: Register a new supermarket owner
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - supermarketName
 *               - longitude
 *               - latitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Ali
 *               image_url:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@supermarket.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *               supermarketName:
 *                 type: string
 *                 example: Ahmed's Fresh Market
 *               longitude:
 *                 type: number
 *                 example: 35.2137
 *               latitude:
 *                 type: number
 *                 example: 31.7683
 *               address:
 *                 type: string
 *                 example: 123 Main Street, Amman, Jordan
 *               businessLicense:
 *                 type: string
 *                 example: BL-2024-12345
 *               description:
 *                 type: string
 *                 example: Fresh vegetables and groceries
 *     responses:
 *       201:
 *         description: Supermarket owner registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/SupermarketOwner'
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login (for both customers and supermarket owners)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrPhone
 *               - password
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 description: Email or phone number
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/User'
 *                         - $ref: '#/components/schemas/SupermarketOwner'
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
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
 *                     user:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/User'
 *                         - $ref: '#/components/schemas/SupermarketOwner'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: Update password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newpassword456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Current password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               phone:
 *                 type: string
 *                 example: "9999999999"
 *               supermarketName:
 *                 type: string
 *                 description: Only for supermarket owners
 *                 example: Ahmed's Premium Market
 *               longitude:
 *                 type: number
 *                 description: Only for supermarket owners
 *                 example: 35.2200
 *               latitude:
 *                 type: number
 *                 description: Only for supermarket owners
 *                 example: 31.7700
 *               address:
 *                 type: string
 *                 description: Only for supermarket owners
 *                 example: 456 New Street, Amman
 *               description:
 *                 type: string
 *                 description: Only for supermarket owners
 *                 example: Premium quality groceries
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/supermarkets/nearby:
 *   get:
 *     summary: Get nearby supermarkets
 *     tags: [Supermarket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: User's longitude
 *         example: 35.2137
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: User's latitude
 *         example: 31.7683
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           default: 5000
 *         description: Maximum distance in meters
 *         example: 5000
 *     responses:
 *       200:
 *         description: List of nearby supermarkets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     supermarkets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SupermarketOwner'
 *       400:
 *         description: Missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/admin-only:
 *   get:
 *     summary: Admin only route (example)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export {};
//# sourceMappingURL=auth.d.ts.map