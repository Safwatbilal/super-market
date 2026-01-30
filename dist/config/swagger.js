"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth API Documentation',
            version: '1.0.0',
            description: 'نظام المصادقة والتحقق - Authentication System API',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            ...(process.env.VERCEL_URL ? [{
                    url: `https://${process.env.VERCEL_URL}`,
                    description: 'Vercel Production Server'
                }] : []),
            ...(process.env.BASE_URL ? [{
                    url: process.env.BASE_URL,
                    description: 'Custom Base URL'
                }] : []),
            {
                url: process.env.BASE_URL || 'http://localhost:5000',
                description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'أدخل الـ JWT Token هنا'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'معرف المستخدم'
                        },
                        userType: {
                            type: 'string',
                            enum: ['customer', 'supermarket_owner'],
                            description: 'نوع المستخدم'
                        },
                        name: {
                            type: 'string',
                            description: 'اسم المستخدم'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'البريد الإلكتروني'
                        },
                        phone: {
                            type: 'string',
                            description: 'رقم الهاتف'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'دور المستخدم'
                        },
                        isVerified: {
                            type: 'boolean',
                            description: 'حالة التحقق'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'حالة الحساب (نشط/غير نشط)'
                        }
                    }
                },
                SupermarketOwner: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'معرف المستخدم'
                        },
                        userType: {
                            type: 'string',
                            enum: ['supermarket_owner'],
                            description: 'نوع المستخدم'
                        },
                        name: {
                            type: 'string',
                            description: 'اسم صاحب السوبرماركت'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'البريد الإلكتروني'
                        },
                        phone: {
                            type: 'string',
                            description: 'رقم الهاتف'
                        },
                        supermarketName: {
                            type: 'string',
                            description: 'اسم السوبرماركت'
                        },
                        location: {
                            type: 'object',
                            properties: {
                                type: {
                                    type: 'string',
                                    enum: ['Point'],
                                    example: 'Point'
                                },
                                coordinates: {
                                    type: 'array',
                                    items: {
                                        type: 'number'
                                    },
                                    minItems: 2,
                                    maxItems: 2,
                                    description: '[longitude, latitude]',
                                    example: [35.2137, 31.7683]
                                },
                                address: {
                                    type: 'string',
                                    description: 'العنوان'
                                }
                            },
                            description: 'موقع السوبرماركت'
                        },
                        businessLicense: {
                            type: 'string',
                            description: 'رخصة العمل'
                        },
                        description: {
                            type: 'string',
                            description: 'وصف السوبرماركت'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'دور المستخدم'
                        },
                        isVerified: {
                            type: 'boolean',
                            description: 'حالة التحقق'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'حالة الحساب (نشط/غير نشط)'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'رسالة الخطأ'
                        },
                        error: {
                            type: 'string',
                            description: 'تفاصيل الخطأ'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'عمليات المصادقة والتحقق'
            },
            {
                name: 'User',
                description: 'عمليات المستخدم'
            },
            {
                name: 'Supermarket',
                description: 'عمليات السوبرماركت'
            },
            {
                name: 'Admin',
                description: 'عمليات المدير'
            }
        ]
    },
    apis: [path_1.default.join(__dirname, '../docs/**/*.ts')]
};
const specs = (0, swagger_jsdoc_1.default)(options);
console.log('🔍 Swagger API paths:', options.apis);
console.log('📋 Swagger specs paths:', Object.keys(specs.paths || {}));
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Auth API Documentation',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true
        }
    }));
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.BASE_URL || 'http://localhost:5000';
    console.log(`📚 Swagger Docs available at ${baseUrl}/api-docs`);
};
exports.setupSwagger = setupSwagger;
exports.default = specs;
//# sourceMappingURL=swagger.js.map