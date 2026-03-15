"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Add this import
const swagger_1 = require("./swagger");
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes/routes"));
const db_1 = __importDefault(require("./config/db"));
// Load environment variables FIRST
dotenv_1.default.config();
(0, db_1.default)();
mongoose_1.default.connection.on('connected', () => {
    console.log('\n📦 MongoDB Connection Details:');
    console.log('=================================');
    console.log(`✅ Status: Connected`);
    console.log(`📊 Database: ${mongoose_1.default.connection.name}`);
    console.log(`🔌 Host: ${mongoose_1.default.connection.host}`);
    console.log(`🎯 Port: ${mongoose_1.default.connection.port}`);
    console.log(`🔄 Connection State: ${mongoose_1.default.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log('=================================\n');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('\n❌ MongoDB Connection Error:');
    console.error('=================================');
    console.error(err);
    console.error('=================================\n');
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('\n⚠️ MongoDB Disconnected');
    console.log('=================================\n');
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
// Make sure to parse JSON for POST requests
app.use(express_1.default.json());
// Setup Swagger
(0, swagger_1.setupSwagger)(app);
// Mount your routes under /api
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'API Server is running',
        docs: `/api-docs`
    });
});
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
});
