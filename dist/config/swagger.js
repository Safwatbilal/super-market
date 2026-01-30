"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_URL;
// ✅ Direct import of documentation instead of dynamic scanning
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Auth API Documentation',
        version: '1.0.0',
        description: 'Authentication and Verification System API',
        contact: {
            name: 'API Support',
            email: 'support@example.com'
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
                description: 'Enter JWT Token here'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'User ID' },
                    userType: { type: 'string', enum: ['customer', 'supermarket_owner'] },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    role: { type: 'string', enum: ['user', 'admin'] },
                    isVerified: { type: 'boolean' },
                    isActive: { type: 'boolean' }
                }
            },
            SupermarketOwner: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userType: { type: 'string', enum: ['supermarket_owner'] },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    supermarketName: { type: 'string' },
                    location: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['Point'] },
                            coordinates: {
                                type: 'array',
                                items: { type: 'number' },
                                example: [35.2137, 31.7683]
                            },
                            address: { type: 'string' }
                        }
                    },
                    businessLicense: { type: 'string' },
                    description: { type: 'string' },
                    image_url: { type: 'string' },
                    role: { type: 'string' },
                    isVerified: { type: 'boolean' },
                    isActive: { type: 'boolean' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string' },
                    error: { type: 'string' }
                }
            },
            RegisterCustomerRequest: {
                type: 'object',
                required: ['name', 'email', 'phone', 'password'],
                properties: {
                    name: { type: 'string', example: 'Ahmad Mohammad' },
                    email: { type: 'string', example: 'ahmed@example.com' },
                    phone: { type: 'string', example: '0599123456' },
                    password: { type: 'string', minLength: 6, example: 'password123' }
                }
            },
            RegisterSupermarketRequest: {
                type: 'object',
                required: ['name', 'email', 'phone', 'password', 'supermarketName', 'longitude', 'latitude'],
                properties: {
                    name: { type: 'string', example: 'Mohammad Ali' },
                    email: { type: 'string', example: 'supermarket@example.com' },
                    phone: { type: 'string', example: '0599123456' },
                    password: { type: 'string', example: 'password123' },
                    supermarketName: { type: 'string', example: 'Al-Amal Supermarket' },
                    longitude: { type: 'number', example: 35.2137 },
                    latitude: { type: 'number', example: 31.7683 },
                    address: { type: 'string', example: 'University Street, Nablus' },
                    businessLicense: { type: 'string', example: 'BL-12345' },
                    description: { type: 'string', example: 'Comprehensive supermarket' },
                    image_url: { type: 'string', example: 'https://example.com/store.jpg' }
                }
            },
            LoginRequest: {
                type: 'object',
                required: ['emailOrPhone', 'password'],
                properties: {
                    emailOrPhone: { type: 'string', example: 'ahmed@example.com' },
                    password: { type: 'string', example: 'password123' }
                }
            },
            UpdatePasswordRequest: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                    currentPassword: { type: 'string', example: 'oldPassword123' },
                    newPassword: { type: 'string', example: 'newPassword123' }
                }
            }
        }
    },
    tags: [
        { name: 'Authentication', description: 'Authentication and verification operations' },
        { name: 'User', description: 'User operations' },
        { name: 'Supermarket', description: 'Supermarket operations' },
        { name: 'Admin', description: 'Admin operations' }
    ],
    // ✅ Direct endpoint definitions
    paths: {
        '/api/auth/register/customer': {
            post: {
                summary: 'Register new customer',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterCustomerRequest' }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Successfully registered',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: { $ref: '#/components/schemas/User' },
                                                token: { type: 'string' },
                                                refreshToken: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/register/supermarket': {
            post: {
                summary: 'Register supermarket owner',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterSupermarketRequest' }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Successfully registered',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: { $ref: '#/components/schemas/SupermarketOwner' },
                                                token: { type: 'string' },
                                                refreshToken: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/login': {
            post: {
                summary: 'User login',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Successfully logged in',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: {
                                                    oneOf: [
                                                        { $ref: '#/components/schemas/User' },
                                                        { $ref: '#/components/schemas/SupermarketOwner' }
                                                    ]
                                                },
                                                token: { type: 'string' },
                                                refreshToken: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Invalid credentials' }
                }
            }
        },
        '/api/auth/me': {
            get: {
                summary: 'Get current user data',
                tags: ['User'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'User data',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: {
                                                    oneOf: [
                                                        { $ref: '#/components/schemas/User' },
                                                        { $ref: '#/components/schemas/SupermarketOwner' }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'User not found' }
                }
            }
        },
        '/api/auth/update-password': {
            put: {
                summary: 'Update password',
                tags: ['User'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UpdatePasswordRequest' }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Password updated successfully' },
                    '400': { description: 'Invalid data' },
                    '401': { description: 'Current password is incorrect' }
                }
            }
        },
        '/api/auth/update-profile': {
            put: {
                summary: 'Update profile',
                tags: ['User'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    phone: { type: 'string' },
                                    supermarketName: { type: 'string' },
                                    longitude: { type: 'number' },
                                    latitude: { type: 'number' },
                                    address: { type: 'string' },
                                    description: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Updated successfully' },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'User not found' }
                }
            }
        },
        '/api/auth/refresh-token': {
            post: {
                summary: 'Refresh access token',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['refreshToken'],
                                properties: {
                                    refreshToken: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Token refreshed successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                token: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Invalid refresh token' }
                }
            }
        },
        '/api/auth/supermarkets/nearby': {
            get: {
                summary: 'Get nearby supermarkets',
                tags: ['Supermarket'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'query',
                        name: 'longitude',
                        required: true,
                        schema: { type: 'number' },
                        example: 35.2137
                    },
                    {
                        in: 'query',
                        name: 'latitude',
                        required: true,
                        schema: { type: 'number' },
                        example: 31.7683
                    },
                    {
                        in: 'query',
                        name: 'maxDistance',
                        schema: { type: 'number', default: 5000 },
                        example: 5000
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of nearby supermarkets',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        count: { type: 'number' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                supermarkets: {
                                                    type: 'array',
                                                    items: { $ref: '#/components/schemas/SupermarketOwner' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': { description: 'Location data missing' }
                }
            }
        },
        '/api/auth/admin-only': {
            get: {
                summary: 'Admin only endpoint',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Access granted' },
                    '403': { description: 'Forbidden - Admins only' }
                }
            }
        }
    }
};
console.log('🔍 Swagger Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    isVercel,
    isProduction,
    pathsCount: Object.keys(swaggerDefinition.paths).length
});
console.log('✅ Endpoints loaded:', Object.keys(swaggerDefinition.paths));
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
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>Auth API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none; }
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
      window.ui = ui;
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
            res.send(swaggerDefinition);
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
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDefinition, {
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
exports.default = swaggerDefinition;
//# sourceMappingURL=swagger.js.map