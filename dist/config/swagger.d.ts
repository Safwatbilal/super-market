import { Application } from 'express';
declare const swaggerDefinition: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
            email: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
        };
        schemas: {
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    userType: {
                        type: string;
                        enum: string[];
                    };
                    name: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    phone: {
                        type: string;
                    };
                    role: {
                        type: string;
                        enum: string[];
                    };
                    isVerified: {
                        type: string;
                    };
                    isActive: {
                        type: string;
                    };
                };
            };
            SupermarketOwner: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    userType: {
                        type: string;
                        enum: string[];
                    };
                    name: {
                        type: string;
                    };
                    email: {
                        type: string;
                    };
                    phone: {
                        type: string;
                    };
                    supermarketName: {
                        type: string;
                    };
                    location: {
                        type: string;
                        properties: {
                            type: {
                                type: string;
                                enum: string[];
                            };
                            coordinates: {
                                type: string;
                                items: {
                                    type: string;
                                };
                                example: number[];
                            };
                            address: {
                                type: string;
                            };
                        };
                    };
                    businessLicense: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    image_url: {
                        type: string;
                    };
                    role: {
                        type: string;
                    };
                    isVerified: {
                        type: string;
                    };
                    isActive: {
                        type: string;
                    };
                };
            };
            Error: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                    };
                    error: {
                        type: string;
                    };
                };
            };
            RegisterCustomerRequest: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                        example: string;
                    };
                    email: {
                        type: string;
                        example: string;
                    };
                    phone: {
                        type: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                        example: string;
                    };
                };
            };
            RegisterSupermarketRequest: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                        example: string;
                    };
                    email: {
                        type: string;
                        example: string;
                    };
                    phone: {
                        type: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        example: string;
                    };
                    supermarketName: {
                        type: string;
                        example: string;
                    };
                    longitude: {
                        type: string;
                        example: number;
                    };
                    latitude: {
                        type: string;
                        example: number;
                    };
                    address: {
                        type: string;
                        example: string;
                    };
                    businessLicense: {
                        type: string;
                        example: string;
                    };
                    description: {
                        type: string;
                        example: string;
                    };
                    image_url: {
                        type: string;
                        example: string;
                    };
                };
            };
            LoginRequest: {
                type: string;
                required: string[];
                properties: {
                    emailOrPhone: {
                        type: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        example: string;
                    };
                };
            };
            UpdatePasswordRequest: {
                type: string;
                required: string[];
                properties: {
                    currentPassword: {
                        type: string;
                        example: string;
                    };
                    newPassword: {
                        type: string;
                        example: string;
                    };
                };
            };
        };
    };
    tags: {
        name: string;
        description: string;
    }[];
    paths: {
        '/api/auth/register/customer': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        message: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                                token: {
                                                    type: string;
                                                };
                                                refreshToken: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '400': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/register/supermarket': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        message: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                                token: {
                                                    type: string;
                                                };
                                                refreshToken: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '400': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/login': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        message: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                user: {
                                                    oneOf: {
                                                        $ref: string;
                                                    }[];
                                                };
                                                token: {
                                                    type: string;
                                                };
                                                refreshToken: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/me': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                user: {
                                                    oneOf: {
                                                        $ref: string;
                                                    }[];
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/update-password': {
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                    '400': {
                        description: string;
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/update-profile': {
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    phone: {
                                        type: string;
                                    };
                                    supermarketName: {
                                        type: string;
                                    };
                                    longitude: {
                                        type: string;
                                    };
                                    latitude: {
                                        type: string;
                                    };
                                    address: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                    '401': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/refresh-token': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    refreshToken: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                token: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/supermarkets/nearby': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                        default?: undefined;
                    };
                    example: number;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                    example: number;
                    required?: undefined;
                })[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        count: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                supermarkets: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '400': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/admin-only': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                };
            };
        };
    };
};
export declare const setupSwagger: (app: Application) => void;
export default swaggerDefinition;
//# sourceMappingURL=swagger.d.ts.map