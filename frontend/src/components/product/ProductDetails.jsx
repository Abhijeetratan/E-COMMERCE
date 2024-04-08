import React, { useEffect } from 'react';
import { useGetProductDetailQuery } from '../../redux/api/productApi';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import StarRatings from 'react-star-ratings';
import { NotFound } from '../layout/NotFound';

export const ProductDetails = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useGetProductDetailQuery(id);
    const product = data?.product;

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    if (isLoading) {
        return <Loader />;
    }
    if (error & error?.staus == 404) {
        return <NotFound />
    }
    return (
        <div className="row d-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
                <div className="p-3">
                    <img
                        className="d-block w-100"
                        src={product?.images[0]?.url || "./images/default_product.png"}
                        alt=""
                        width="340"
                        height="390"
                    />
                </div>
                {product?.images && product.images.length > 0 && (
                    <div className="row justify-content-start mt-5">
                        <div className="col-2 ms-4 mt-2">
                            <a role="button">
                                <img
                                    className="d-block border rounded p-3 cursor-pointer"
                                    height="100"
                                    width="100"
                                    src={product?.images[0]?.url || "./images/default_product.png"}
                                    alt=""
                                />
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{product?.name}</h3>
                <p id="product_id">Product # {product?._id}</p>

                <hr />

                <div className="d-flex align-items-center">
                    <StarRatings
                        rating={product?.rating || 0}
                        starRatedColor="#ffb829" // Yellow color for filled stars
                        starEmptyColor="#e4e5e9" // Default color for empty stars
                        numberOfStars={5}
                        name='rating'
                        starDimension='22px'
                        starSpacing='1px'
                    />
                    <span id="no-of-reviews" className="pt-1 ps-2"> ({product?.numOfReviews || 0} Review{product?.numOfReviews !== 1 && 's'}) </span>
                </div>
                <hr />

                <p id="product_price">${product?.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus">-</span>
                    <input
                        type="number"
                        className="form-control count d-inline"
                        value="1"
                        readOnly
                    />
                    <span className="btn btn-primary plus">+</span>
                </div>
                <button
                    type="button"
                    id="cart_btn"
                    className="btn btn-primary d-inline ms-4"
                    disabled
                >
                    Add to Cart
                </button>

                <hr />

                <p>
                    Status: <span id="stock_status" className="greenColor">
                        {product?.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                </p>

                <hr />

                <h4 className="mt-2">Description:</h4>
                <p>
                    {product?.description}
                </p>
                <hr />
                <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>

                <div className="alert alert-danger my-5" role="alert">
                    Login to post your review.
                </div>
            </div>
        </div>
    );
};
