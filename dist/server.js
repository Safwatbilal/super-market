"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
const swagger_1 = require("./config/swagger");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, database_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
(0, swagger_1.setupSwagger)(app);
app.use('/api/auth', authRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
const getBaseUrl = (req) => {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.BASE_URL) {
        return process.env.BASE_URL;
    }
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}`;
};
app.get('/', (req, res) => {
    const baseUrl = getBaseUrl(req);
    res.json({
        success: true,
        message: 'Welcome to Marketplace API',
        version: '1.0.0',
        documentation: `${baseUrl}/api-docs`,
        endpoints: {
            registerCustomer: 'POST /api/auth/register/customer',
            registerSupermarketOwner: 'POST /api/auth/register/supermarket',
            login: 'POST /api/auth/login',
            refreshToken: 'POST /api/auth/refresh-token',
            getMe: 'GET /api/auth/me',
            updatePassword: 'PUT /api/auth/update-password',
            updateProfile: 'PUT /api/auth/update-profile',
            nearbySupermarkets: 'GET /api/auth/supermarkets/nearby',
            adminOnly: 'GET /api/auth/admin-only'
        }
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
exports.default = app;
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
        console.log(`📚 API Documentation: ${baseUrl}/api-docs`);
    });
}
//# sourceMappingURL=server.js.map