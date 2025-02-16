import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import productRoutes from './routes/product-routes.js';
import fileRoutes from './routes/fileUpload-routes.js';
import userRoutes from './routes/user-routes.js';
import orderRoutes from './routes/order-routes.js';

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

config();
connectDB();

app.get('/', (req, res) => {
    console.log('/get');
    res.send('hello');
})

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/file', fileRoutes);

app.listen(port, () => {
    console.log(`Listening to ${port}!!`);
});
