const express = require('express');
const app = express();

app.use(express.static('.'));

app.listen(4000, function() {
    console.info("Listening on port 4000");
});