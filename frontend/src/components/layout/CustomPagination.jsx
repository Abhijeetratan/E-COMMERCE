import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from "react-js-pagination";

export const CustomPagination = ({ resPerPage, filteredProductCount }) => {
    const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage state to 1

    let [searchParams] = useSearchParams();

    const page = Number(searchParams.get("Page")) || 1;

    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Optionally, you can update the URL parameters here using react-router-dom
        // For example: history.push(`?Page=${pageNumber}`);
    };

    // Ensure that both filteredProductCount and resPerPage are valid
    if (!filteredProductCount || !resPerPage) {
        return null; // or any fallback UI if needed
    }

    return (
        <div className="d-flex justify-content-center mt-5">
            {filteredProductCount > resPerPage && (
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={filteredProductCount}
                    onChange={handlePageChange} // Pass the handlePageChange function
                    nextPageText={"Next"}
                    prevPageText={"Prev"}
                    firstPageText={"First"}
                    lastPageText={"Last"}
                    itemClass="page-item"
                    linkClass="page-link"
                />
            )}
        </div>
    );
};

