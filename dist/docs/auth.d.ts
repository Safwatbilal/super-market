/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterCustomerRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "أحمد محمد"
 *         email:
 *           type: string
 *           format: email
 *           example: "ahmed@example.com"
 *         phone:
 *           type: string
 *           example: "0599123456"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "password123"
 *
 *     RegisterSupermarketRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - password
 *         - supermarketName
 *         - longitude
 *         - latitude
 *       properties:
 *         name:
 *           type: string
 *           example: "محمد علي"
 *         email:
 *           type: string
 *           example: "supermarket@example.com"
 *         phone:
 *           type: string
 *           example: "0599123456"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "password123"
 *         supermarketName:
 *           type: string
 *           example: "سوبرماركت الأمل"
 *         longitude:
 *           type: number
 *           example: 35.2137
 *         latitude:
 *           type: number
 *           example: 31.7683
 *         address:
 *           type: string
 *           example: "شارع الجامعة، نابلس"
 *         businessLicense:
 *           type: string
 *           example: "BL-12345"
 *         description:
 *           type: string
 *           example: "سوبرماركت شامل يقدم جميع المنتجات الغذائية"
 *         image_url:
 *           type: string
 *           example: "https://example.com/store.jpg"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - emailOrPhone
 *         - password
 *       properties:
 *         emailOrPhone:
 *           type: string
 *           example: "ahmed@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: "oldPassword123"
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           example: "newPassword123"
 *
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "أحمد محمد الجديد"
 *         phone:
 *           type: string
 *           example: "0598765432"
 *         supermarketName:
 *           type: string
 *           example: "سوبرماركت الأمل الجديد"
 *         longitude:
 *           type: number
 *           example: 35.2140
 *         latitude:
 *           type: number
 *           example: 31.7690
 *         address:
 *           type: string
 *           example: "شارع فيصل، نابلس"
 *         description:
 *           type: string
 *           example: "وصف محدث للسوبرماركت"
 *
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
/**
 * @swagger
 * /api/auth/register/customer:
 *   post:
 *     summary: تسجيل عميل جديد
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterCustomerRequest'
 *     responses:
 *       201:
 *         description: تم التسجيل بنجاح
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
 *                   example: "Customer registered successfully"
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
 *         description: خطأ في البيانات المدخلة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/register/supermarket:
 *   post:
 *     summary: تسجيل صاحب سوبرماركت
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterSupermarketRequest'
 *     responses:
 *       201:
 *         description: تم التسجيل بنجاح
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
 *         description: خطأ في البيانات
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: تسجيل الدخول
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: تم تسجيل الدخول بنجاح
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
 *         description: بيانات اعتماد خاطئة
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: الحصول على بيانات المستخدم الحالي
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: بيانات المستخدم
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
 *         description: غير مصرح
 *       404:
 *         description: المستخدم غير موجود
 */
/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: تحديث كلمة المرور
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: تم تحديث كلمة المرور بنجاح
 *       400:
 *         description: بيانات غير صحيحة
 *       401:
 *         description: كلمة المرور الحالية خاطئة
 */
/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: تحديث الملف الشخصي
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
 *       401:
 *         description: غير مصرح
 *       404:
 *         description: المستخدم غير موجود
 */
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: تحديث رمز الوصول
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
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
 *         description: رمز تحديث غير صالح
 */
/**
 * @swagger
 * /api/auth/supermarkets/nearby:
 *   get:
 *     summary: الحصول على السوبرماركت القريبة
 *     tags: [Supermarket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: خط الطول
 *         example: 35.2137
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: خط العرض
 *         example: 31.7683
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           default: 5000
 *         description: المسافة القصوى بالمتر
 *         example: 5000
 *     responses:
 *       200:
 *         description: قائمة السوبرماركت القريبة
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
 *         description: بيانات الموقع مفقودة
 */
/**
 * @swagger
 * /api/auth/admin-only:
 *   get:
 *     summary: نقطة نهاية للمسؤولين فقط (مثال)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: نجح الوصول
 *       403:
 *         description: ممنوع - المسؤولون فقط
 */ 
//# sourceMappingURL=auth.d.ts.map