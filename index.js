const express =require('express');
const app=express();
const cors = require('cors');
const mongodb=require('./db');
require('dotenv').config();
// port 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
const port =process.env.PORT;

app.use(cors()); 

app.use('/api',require('./router/mainRouter'));








mongodb()
// server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});