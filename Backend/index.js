const mongoose = require('mongoose');
const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Define the schema for your product
const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
});

// Create a Mongoose model
const Product = mongoose.model('Product', productSchema);



// Function to save each product to the database
async function saveProductsToDB(productsFromAPI) {
    try {
        for (const productData of productsFromAPI) {
            // Create a new Product instance using the fetched data
            const newProduct = new Product(productData);
            // Save the product to the database
            await newProduct.save();
        }
        console.log('Products saved to the database!');
    } catch (error) {
        console.error('Error saving products:', error);
    }
}


async function fetchDataAndSaveToDB() {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

        const productsFromAPI = response.data; // Assuming the response is an array of products

        // Assuming 'Product' is your Mongoose model and saveProductsToDB is your function to save products
        await saveProductsToDB(productsFromAPI);

        // Fetch all products from the database after saving
        const allProducts = await Product.find({}); // Replace 'Product' with your model

        console.log('All products:', allProducts);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Connect to your MongoDB database
mongoose.connect('mongodb+srv://prasannakumarbhursu:1prasanna324@course-selling.wbpwzsr.mongodb.net/Product')
    .then(async () => {
        console.log('Connected to MongoDB');
        // Call the function to save products to the database
        // await fetchDataAndSaveToDB();
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));


app.get('/products', async (req, res) => {
    const allProducts = await Product.find({});
    res.json( allProducts );
});



// app.get('/products', async (req, res) => {
//     try {
//         const { month } = req.query;

//         let aggregationPipeline = [];

//         if (month) {
//             const monthNumber = parseInt(month); // Parse the month from string to number

//             // Add an aggregation stage to match the month across all years
//             aggregationPipeline.push({
//                 $addFields: {
//                     month: { $month: '$dateOfSale' } // Extract month from dateOfSale field
//                 }
//             });

//             aggregationPipeline.push({
//                 $match: {
//                     month: monthNumber // Filter based on the extracted month
//                 }
//             });
//         }

//         const products = await Product.aggregate(aggregationPipeline);

//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });



app.listen(3004, () => console.log('Server running on port 3005'));