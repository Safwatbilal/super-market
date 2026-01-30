// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

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
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'أحمد محمد الجديد' },
          phone: { type: 'string', example: '0598765432' },
          supermarketName: { type: 'string', example: 'سوبرماركت الأمل الجديد' },
          longitude: { type: 'number', example: 35.2140 },
          latitude: { type: 'number', example: 31.7690 },
          address: { type: 'string', example: 'شارع فيصل، نابلس' },
          description: { type: 'string', example: 'وصف محدث للسوبرماركت' }
        }
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
        }
      },
      Category: {
        type: 'object',
        required: ['name'],
        properties: {
          _id: { type: 'string', description: 'Category ID' },
          name: { type: 'string', example: 'Electronics' },
          image_url: { type: 'string', example: 'https://example.com/electronics.jpg' },
          status: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Size: {
        type: 'object',
        required: ['name', 'weight', 'price'],
        properties: {
          name: { type: 'string', description: 'Size name (e.g., Small, Medium, Large)', example: 'Medium' },
          weight: { type: 'number', description: 'Weight in kilograms', example: 2.5 },
          price: { type: 'number', description: 'Price for this size', example: 150 }
        }
      },
      Product: {
        type: 'object',
        required: ['name', 'category_id', 'currency'],
        properties: {
          _id: { type: 'string', description: 'Product ID' },
          name: { type: 'string', description: 'Product name', example: 'Premium Coffee Beans' },
          category_id: { type: 'string', description: 'Category ID reference', example: '507f1f77bcf86cd799439011' },
          image_url: { type: 'string', description: 'Product image URL', example: 'https://example.com/coffee.jpg' },
          weight: { type: 'number', description: 'Base weight (required if no sizes)', example: 1.0 },
          currency: { type: 'string', enum: ['USD', 'SAR', 'SYP'], description: 'Currency type', example: 'USD' },
          price: { type: 'number', description: 'Base price (required if no sizes)', example: 99.99 },
          sizes: {
            type: 'array',
            items: { $ref: '#/components/schemas/Size' },
            description: 'Multiple sizes with different prices'
          },
          status: { type: 'string', enum: ['published', 'unpublished'], description: 'Product status', example: 'published' },
          is_featured: { type: 'boolean', description: 'Whether product is featured', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  tags: [
    { name: 'Authentication', description: 'Authentication and verification operations' },
    { name: 'User', description: 'User operations' },
    { name: 'Supermarket', description: 'Supermarket operations' },
    { name: 'Admin', description: 'Admin operations' },
    { name: 'Categories', description: 'Category management operations' },
    { name: 'Products', description: 'Product management operations' }
  ],
  // ✅ Direct endpoint definitions - Combined from all docs
  paths: {
    // ========== AUTH ENDPOINTS ==========
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
              schema: { $ref: '#/components/schemas/UpdateProfileRequest' }
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
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' }
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
    },

    // ========== CATEGORIES ENDPOINTS ==========
    '/api/categories': {
      get: {
        summary: 'Get all categories',
        tags: ['Categories'],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Page number'
          },
          {
            in: 'query',
            name: 'pageSize',
            schema: { type: 'integer', default: 10 },
            description: 'Number of items per page'
          },
          {
            in: 'query',
            name: 'name',
            schema: { type: 'string' },
            description: 'Filter by category name (case-insensitive)'
          },
          {
            in: 'query',
            name: 'status',
            schema: { type: 'boolean' },
            description: 'Filter by status (true/false)'
          }
        ],
        responses: {
          '200': {
            description: 'List of all categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'number' },
                    page: { type: 'number' },
                    pageSize: { type: 'number' },
                    totalPages: { type: 'number' },
                    totalCategories: { type: 'number' },
                    data: {
                      type: 'object',
                      properties: {
                        categories: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Category' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '500': { description: 'Server error' }
        }
      },
      post: {
        summary: 'Create a new category',
        tags: ['Categories'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Electronics' },
                  image_url: { type: 'string', example: 'https://example.com/electronics.jpg' },
                  status: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Category created successfully' },
          '400': { description: 'Bad request' },
          '401': { description: 'Not authorized' }
        }
      }
    },
    '/api/categories/{id}': {
      get: {
        summary: 'Get category by ID',
        tags: ['Categories'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Category found' },
          '404': { description: 'Category not found' }
        }
      },
      put: {
        summary: 'Update a category',
        tags: ['Categories'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  image_url: { type: 'string' },
                  status: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Category updated successfully' },
          '404': { description: 'Category not found' },
          '401': { description: 'Not authorized' }
        }
      },
      delete: {
        summary: 'Delete a category',
        tags: ['Categories'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Category deleted successfully' },
          '404': { description: 'Category not found' },
          '401': { description: 'Not authorized' }
        }
      }
    },

    // ========== PRODUCTS ENDPOINTS ==========
    '/api/products': {
      get: {
        summary: 'Get all products with filters',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Page number'
          },
          {
            in: 'query',
            name: 'pageSize',
            schema: { type: 'integer', default: 10 },
            description: 'Number of items per page'
          },
          {
            in: 'query',
            name: 'name',
            schema: { type: 'string' },
            description: 'Filter by product name (case-insensitive)'
          },
          {
            in: 'query',
            name: 'status',
            schema: { type: 'string', enum: ['published', 'unpublished'] },
            description: 'Filter by status'
          },
          {
            in: 'query',
            name: 'category_id',
            schema: { type: 'string' },
            description: 'Filter by category ID'
          },
          {
            in: 'query',
            name: 'is_featured',
            schema: { type: 'boolean' },
            description: 'Filter by featured products'
          },
          {
            in: 'query',
            name: 'currency',
            schema: { type: 'string', enum: ['USD', 'SAR', 'SYP'] },
            description: 'Filter by currency'
          },
          {
            in: 'query',
            name: 'min_price',
            schema: { type: 'number' },
            description: 'Minimum price filter'
          },
          {
            in: 'query',
            name: 'max_price',
            schema: { type: 'number' },
            description: 'Maximum price filter'
          }
        ],
        responses: {
          '200': {
            description: 'List of all products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'number' },
                    page: { type: 'number' },
                    pageSize: { type: 'number' },
                    totalPages: { type: 'number' },
                    totalProducts: { type: 'number' },
                    data: {
                      type: 'object',
                      properties: {
                        products: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Product' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { description: 'Not authorized' },
          '500': { description: 'Server error' }
        }
      },
      post: {
        summary: 'Create a new product',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'category_id', 'currency'],
                properties: {
                  name: { type: 'string', example: 'Premium Coffee Beans' },
                  category_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                  image_url: { type: 'string', example: 'https://example.com/coffee.jpg' },
                  weight: { type: 'number', description: 'Required if sizes not provided', example: 1.0 },
                  currency: { type: 'string', enum: ['USD', 'SAR', 'SYP'], example: 'USD' },
                  price: { type: 'number', description: 'Required if sizes not provided', example: 99.99 },
                  sizes: {
                    type: 'array',
                    description: 'Optional - multiple sizes with prices',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'Small' },
                        weight: { type: 'number', example: 0.5 },
                        price: { type: 'number', example: 50 }
                      }
                    }
                  },
                  status: { type: 'string', enum: ['published', 'unpublished'], example: 'published' },
                  is_featured: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Product created successfully' },
          '400': { description: 'Bad request (validation error)' },
          '401': { description: 'Not authorized' },
          '404': { description: 'Category not found' }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        summary: 'Get product by ID',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID'
          }
        ],
        responses: {
          '200': {
            description: 'Product found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        product: { $ref: '#/components/schemas/Product' }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': { description: 'Product not found' },
          '401': { description: 'Not authorized' }
        }
      },
      put: {
        summary: 'Update a product',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  category_id: { type: 'string' },
                  image_url: { type: 'string' },
                  weight: { type: 'number' },
                  currency: { type: 'string', enum: ['USD', 'SAR', 'SYP'] },
                  price: { type: 'number' },
                  sizes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        weight: { type: 'number' },
                        price: { type: 'number' }
                      }
                    }
                  },
                  status: { type: 'string', enum: ['published', 'unpublished'] },
                  is_featured: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Product updated successfully' },
          '404': { description: 'Product not found' },
          '401': { description: 'Not authorized' }
        }
      },
      delete: {
        summary: 'Delete a product',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Product deleted successfully' },
          '404': { description: 'Product not found' },
          '401': { description: 'Not authorized' }
        }
      }
    },
    '/api/products/featured': {
      get: {
        summary: 'Get all featured products (public)',
        tags: ['Products'],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 }
          },
          {
            in: 'query',
            name: 'pageSize',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'List of featured products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count: { type: 'number' },
                    page: { type: 'number' },
                    pageSize: { type: 'number' },
                    totalPages: { type: 'number' },
                    totalProducts: { type: 'number' },
                    data: {
                      type: 'object',
                      properties: {
                        products: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Product' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '500': { description: 'Server error' }
        }
      }
    },
    '/api/products/category/{categoryId}': {
      get: {
        summary: 'Get all products in a category (public)',
        tags: ['Products'],
        parameters: [
          {
            in: 'path',
            name: 'categoryId',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID'
          },
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 }
          },
          {
            in: 'query',
            name: 'pageSize',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': { description: 'List of products in category' },
          '404': { description: 'Category not found' },
          '500': { description: 'Server error' }
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