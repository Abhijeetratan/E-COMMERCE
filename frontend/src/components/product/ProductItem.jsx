import React from 'react';
import { Link } from "react-router-dom";
import StarRatings from 'react-star-ratings';

const ProductItem = ({ product, default_product }) => {
    return (
        <div key={product._id} className="col-sm-12 col-md-6 col-lg-3 my-3">
            <div className="card p-3 rounded">
                <img
                    className="card-img-top mx-auto"
                    src={product?.images?.[0]?.url || default_product} // Provide a default image if the product image is not available
                    alt={product?.name || 'Product Image'}
                />

                <div className="card-body ps-3 d-flex justify-content-center flex-column">
                    <h5 className="card-title">
                        <Link to={`/product/${product?._id}`}>{product?.name || 'Product Name'}</Link>
                    </h5>
                    <div className="ratings mt-auto d-flex">
                        <StarRatings
                            rating={product?.rating || 0} // Default to 0 if rating is not available
                            starRatedColor="#ffb829"
                            numberOfStars={5}
                            name='rating'
                            starDimension='22px'
                            starSpacing='1px'
                        />
                        <span className="pt-2 ps-2"> ({product?.numOfReviews || 0}) </span> {/* Default to 0 if numOfReviews is not available */}
                    </div>
                </div>
                <p className="card-text mt-2">${product?.price || 0}</p> {/* Default to 0 if price is not available */}
                <Link to={`/product/${product?._id}`} id="view_btn" className="btn btn-block">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductItem;
