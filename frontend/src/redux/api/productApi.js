import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1" }), // Adjust the base URL as needed
    keepUnusedDataFor: 30,
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: "/products",
                params: params?.page,
                params: params?.keyword,
            })
        }),
        getProductDetail: builder.query({
            query: (id) => `/products/${id}`,
        })
    })
});

export const { useGetProductsQuery, useGetProductDetailQuery } = productApi;

