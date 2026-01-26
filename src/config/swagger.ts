// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_URL;

// ✅ استيراد التوثيق مباشرة بدلاً من المسح الديناميكي
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Auth API Documentation',
    version: '1.0.0',
    description: 'نظام المصادقة والتحقق - Authentication System API',
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
        description: 'أدخل الـ JWT Token هنا'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'معرف المستخدم' },
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
          name: { type: 'string', example: 'أحمد محمد' },
          email: { type: 'string', example: 'ahmed@example.com' },
          phone: { type: 'string', example: '0599123456' },
          password: { type: 'string', minLength: 6, example: 'password123' }
        }
      },
      RegisterSupermarketRequest: {
        type: 'object',
        required: ['name', 'email', 'phone', 'password', 'supermarketName', 'longitude', 'latitude'],
        properties: {
          name: { type: 'string', example: 'محمد علي' },
          email: { type: 'string', example: 'supermarket@example.com' },
          phone: { type: 'string', example: '0599123456' },
          password: { type: 'string', example: 'password123' },
          supermarketName: { type: 'string', example: 'سوبرماركت الأمل' },
          longitude: { type: 'number', example: 35.2137 },
          latitude: { type: 'number', example: 31.7683 },
          address: { type: 'string', example: 'شارع الجامعة، نابلس' },
          businessLicense: { type: 'string', example: 'BL-12345' },
          description: { type: 'string', example: 'سوبرماركت شامل' },
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
    { name: 'Authentication', description: 'عمليات المصادقة والتحقق' },
    { name: 'User', description: 'عمليات المستخدم' },
    { name: 'Supermarket', description: 'عمليات السوبرماركت' },
    { name: 'Admin', description: 'عمليات المدير' }
  ],
  // ✅ تعريف الـ endpoints مباشرة
  paths: {
    '/api/auth/register/customer': {
      post: {
        summary: 'تسجيل عميل جديد',
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
            description: 'تم التسجيل بنجاح',
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
            description: 'خطأ في البيانات',
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
        summary: 'تسجيل صاحب سوبرماركت',
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
            description: 'تم التسجيل بنجاح',
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
            description: 'خطأ في البيانات',
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
        summary: 'تسجيل الدخول',
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
            description: 'تم تسجيل الدخول بنجاح',
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
          '401': { description: 'بيانات اعتماد خاطئة' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'الحصول على بيانات المستخدم الحالي',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'بيانات المستخدم',
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
          '401': { description: 'غير مصرح' },
          '404': { description: 'المستخدم غير موجود' }
        }
      }
    },
    '/api/auth/update-password': {
      put: {
        summary: 'تحديث كلمة المرور',
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
          '200': { description: 'تم تحديث كلمة المرور بنجاح' },
          '400': { description: 'بيانات غير صحيحة' },
          '401': { description: 'كلمة المرور الحالية خاطئة' }
        }
      }
    },
    '/api/auth/update-profile': {
      put: {
        summary: 'تحديث الملف الشخصي',
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
          '200': { description: 'تم التحديث بنجاح' },
          '401': { description: 'غير مصرح' },
          '404': { description: 'المستخدم غير موجود' }
        }
      }
    },
    '/api/auth/refresh-token': {
      post: {
        summary: 'تحديث رمز الوصول',
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
            description: 'تم التحديث بنجاح',
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
          '401': { description: 'رمز تحديث غير صالح' }
        }
      }
    },
    '/api/auth/supermarkets/nearby': {
      get: {
        summary: 'الحصول على السوبرماركت القريبة',
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
            description: 'قائمة السوبرماركت القريبة',
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
          '400': { description: 'بيانات الموقع مفقودة' }
        }
      }
    },
    '/api/auth/admin-only': {
      get: {
        summary: 'نقطة نهاية للمسؤولين فقط',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'نجح الوصول' },
          '403': { description: 'ممنوع - المسؤولون فقط' }
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

export const setupSwagger = (app: Application): void => {
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
<html lang="ar" dir="rtl">
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
  } else {
    // ✅ Local development setup
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition, {
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

export default swaggerDefinition;