const mongoose = require('mongoose');

const connectWithRetry = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MongoDB URI is not defined. Please set it in your environment variables.');
    return;
  }

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => {
      console.error('Database connection error:', err.message);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

// Call the function to establish a connection
connectWithRetry();

