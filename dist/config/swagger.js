"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
// src/config/swagger.ts
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_URL;
// ✅ حدد المسارات بناءً على البيئة
const getApiPaths = () => {
    if (isProduction || isVercel) {
        // في Production، اقرأ من dist
        return [
            path_1.default.join(__dirname, '../docs/**/*.js'),
            path_1.default.join(__dirname, '../routes/**/*.js'),
        ];
    }
    else {
        // في Development، اقرأ من src
        return [
            './src/docs/**/*.ts',
            './src/routes/**/*.ts',
        ];
    }
};
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
            {
                url: '/',
                description: 'Current Server'
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
                        image_url: {
                            type: 'string',
                            description: 'صورة السوبرماركت'
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
    apis: getApiPaths()
};
console.log('🔍 Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    isVercel,
    isProduction,
    __dirname,
    apiPaths: getApiPaths()
});
const specs = (0, swagger_jsdoc_1.default)(options);
// Debug logs
console.log('📋 Found paths:', Object.keys(specs.paths || {}).length);
if (specs.paths && Object.keys(specs.paths).length > 0) {
    console.log('✅ Endpoints loaded:', Object.keys(specs.paths));
}
else {
    console.warn('⚠️ No endpoints found! Check file paths.');
}
const setupSwagger = (app) => {
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.BASE_URL || 'http://localhost:5000';
    if (isVercel) {
        // ✅ Vercel setup with custom HTML
        app.get('/api-docs', (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Auth API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
        deepLinking: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        tryItOutEnabled: true
      });
    };
  </script>
</body>
</html>
      `;
            res.send(html);
        });
        app.get('/api-docs/swagger.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.send(specs);
        });
        app.options('/api-docs/swagger.json', (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.sendStatus(200);
        });
    }
    else {
        // ✅ Local development setup
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'Auth API Documentation',
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                tryItOutEnabled: true
            }
        }));
    }
    console.log(`📚 Swagger Docs available at ${baseUrl}/api-docs`);
};
exports.setupSwagger = setupSwagger;
exports.default = specs;
//# sourceMappingURL=swagger.js.map