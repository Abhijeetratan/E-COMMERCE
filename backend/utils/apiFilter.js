import { json } from "express";

class ApiFilter {
    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr || {}; // Set a default empty object if querystr is undefined
    }

    search() {
        const keywordFilter = this.querystr.keyword
            ? {
                name: {
                    $regex: this.querystr.keyword,
                    $options: 'i',
                },
            }
            : {};

        // Update the query object directly
        this.query = { ...this.query, ...keywordFilter };

        return this;
    }

    filters() {
        const queryCopy = { ...this.querystr };

        // Fields to remove
        const fieldsToRemove = ["keyword", "page"];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);

        // Fields tp remove
        let querystr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        // Advance filter for price, rating, etc.

        console.log("============================");
        console.log(queryCopy);
        console.log("============================");

        // Use queryCopy instead of this.querystr in the find method
        this.query = this.query.find(JSON.parse(querystr));

        return this; // Return the modified query if needed
    }
    pagination(resPerPage) {
        const currentPage = Number(this.querystr.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}


export default ApiFilter;