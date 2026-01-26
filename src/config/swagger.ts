// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
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
  // ✅ مسارات متعددة للتأكد من قراءة الملفات
  apis: [
    './src/docs/**/*.ts',
    './src/routes/**/*.ts',
    './src/models/**/*.ts',
    './dist/docs/**/*.js',
    './dist/routes/**/*.js',
    './dist/models/**/*.js'
  ]
};

const specs = swaggerJsdoc(options);

// Debug logs
console.log('🔍 Swagger loading from:', options.apis);
console.log('📋 Found paths:', Object.keys((specs as any).paths || {}).length);
if ((specs as any).paths) {
  console.log('📄 Endpoints:', Object.keys((specs as any).paths));
}

export const setupSwagger = (app: Application): void => {
  const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_URL;
  
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.BASE_URL || 'http://localhost:5000';

  if (isVercel) {
    app.get('/api-docs', (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Auth API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none }
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
        displayRequestDuration: true
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
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.send(specs);
    });

    app.options('/api-docs/swagger.json', (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.sendStatus(200);
    });
  } else {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Auth API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true
      }
    }));
  }

  console.log(`📚 Swagger Docs available at ${baseUrl}/api-docs`);
};

export default specs;