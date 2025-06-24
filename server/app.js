// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import { connectDB } from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json'  assert { type: 'json' };;
dotenv.config();
connectDB();

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API is running...");
})
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/admin', adminRoutes);

export default app;
