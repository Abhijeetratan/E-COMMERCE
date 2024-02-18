import express from 'express';
import dotenv from 'dotenv';
import ProductRoutes from "./routes/products.js";
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from './middlewares/errors.js';

// Handle Uncaught exception
process.on('uncaughtException', (err) => {
    console.log(`ERROR:,${err}`)
    console.log("Shutting down due to uncaught error");
    process.exit(1);
})


const app = express();
dotenv.config({ path: 'backend/config/config.env' });
app.use(express.json());

// Connecting to the database
connectDatabase();

// Import all Routes
app.use("/api/v1", ProductRoutes);

// Using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandle Promise

process.on('unhandledRejection', (err) => {
    console.log(`Error :,${err}`);
    console.log('Shutting down server due to unhandled promise Rejection')
    server.close(() => {
        process.exit(1);
    })
})