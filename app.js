const express = require('express');
const { mongo } = require('./configs/dbConnect');
const dotenv = require('./configs/env');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order')
const braintreeRoutes = require('./routes/braintree');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path')

const app = express();

//db connection

mongo();

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// route middlewares
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);

__dirname = path.resolve();

if(process.env.NODE_ENV === 'production'){
 
    app.use(express.static(path.join(__dirname,"../frontend/build")))
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,"../frontend","build","index.html"))
    })
}

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log('server is listening on port: ' + port)
})
