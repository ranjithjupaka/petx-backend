const mongoose = require('mongoose')

//db connection

exports.mongo = async () => {

    await mongoose
      .connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('DB Connected'))

    mongoose.connection.on('error', (err) => {
      console.log(`DB connection error: ${err.message}`)
    })
 
};
