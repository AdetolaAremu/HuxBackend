import { Query } from "mongoose";

class APIFeatures<T> {
  public query: Query<T[], T>;
  public queryString: Record<string, any>;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryStr = { ...this.queryString };
    const excluded = ["sort", "limit", "fields", "page"];
    excluded.forEach((el) => delete queryStr[el]);

    // Advanced filtering
    let filterString = JSON.stringify(queryStr);
    filterString = filterString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(filterString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const limitedFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(limitedFields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
