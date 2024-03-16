import default_product from './images/default_product.png'; // Import the image
import React from 'react';
import { MetaData } from './layout/MetaData';
import { useGetProductsQuery } from '../redux/api/productApi';
import ProductItem from './product/ProductItem';
import Loader from './layout/Loader';

const Home = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  console.log(data);
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <MetaData title={"Buy Best Product Online"} />
      <div className="row">
        <div className="col-12 col-sm-6 col-md-12">
          <h1 id="products_heading" className="text-secondary">Latest Products</h1>

          <section id="products" className="mt-5">
            <div className="row">
              {data?.products?.map(product => (
                <ProductItem key={product._id} product={product} default_product={default_product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
