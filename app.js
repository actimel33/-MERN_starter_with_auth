const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use('/auth', require('./routes/auth.routes'));

const PORT = config.get('port');

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

start();

app.listen(PORT || 5000, () => {
    console.log(`Server is tuning on port ${PORT}...`);
});