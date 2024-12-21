const app = require('./index.js'); // ارجاع به فایل اصلی پروژه

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
module.exports = app;