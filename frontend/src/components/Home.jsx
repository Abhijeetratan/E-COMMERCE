import default_product from './images/default_product.png'; // Import the image
import React, { useEffect } from 'react';
import { MetaData } from './layout/MetaData';
import { useGetProductsQuery } from '../redux/api/productApi';
import ProductItem from './product/ProductItem';
import Loader from './layout/Loader';
import { toast } from 'react-hot-toast';
import { CustomPagination } from './layout/CustomPagination';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  let [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";

  const params = { page, keyword };

  const { data, isLoading, error, iserror } = useGetProductsQuery();

  useEffect(() => {
    if (iserror) {
      toast.error(iserror?.message);
    }
  }, [iserror]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  // const columnsize=keyword?:4:3

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
          <CustomPagination
            resPerPage={data?.resPerPage} // Default to 10 if data?.resPerPage is undefined
            filteredProductCount={data?.filteredProductCount} // Default to 0 if data?.filteredProductCount is undefined
          />
        </div>
      </div>
    </>
  );
};

export default Home;

