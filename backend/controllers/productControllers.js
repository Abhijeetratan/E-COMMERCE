import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js"

//create new products => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {

    const apiFilter = new ApiFilter(Product, req.query).search()


    res.status(200).json({
        products,
    })
})

//update product details => /api/v1/products/:id
export const newProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.create(req.body);
    console.log(product)
    res.status(200).json({
        product,
    }
    )
})

//get single product => /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler('Product not found ', 404))
    }
    console.log(product)
    res.status(200).json({
        product,
    }
    )
})

// Update product details => /api/v1/products/:id
export const UpdateProduct = catchAsyncErrors(async (req, res) => {
    // Find the product by ID
    let product = await Product.findById(req?.params?.id);

    // Check if the product exists
    if (!product) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    // Log the existing product details (for debugging purposes)
    console.log(product);

    try {
        // Update the product with the new data
        product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true });

        // Send the updated product details as a JSON response
        res.status(200).json({
            product,
        });
    } catch (error) {
        // Handle errors that may occur during the update process
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});


// Delete product details => /api/v1/products/:id

export const DeleteProduct = catchAsyncErrors(async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        // Log the existing product details (for debugging purposes)
        console.log("Existing product details:", product);

        // Delete the product
        await product.deleteOne(); // Use deleteOne() instead of delete()

        // Send the deleted product details as a JSON response
        res.status(200).json({
            message: "Product deleted successfully",
            deletedProduct: product,
        });
    } catch (error) {
        // Handle errors that may occur during the deletion process
        console.error("Error deleting product:", error);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});