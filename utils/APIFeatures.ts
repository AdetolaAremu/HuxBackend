class APIFeatures {
  public query: any;
  public queryString: any;

  constructor(query: string | number, queryString: string | object) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    if (typeof this.queryString !== "object" || this.queryString === null) {
      throw new Error("queryString must be an object");
    }

    const queryStr: Record<string, any> = { ...this.queryString };
    const excluded = ["sort", "limit", "fields", "page"];
    excluded.forEach((el) => delete queryStr[el]);

    let stringifyObjs = JSON.stringify(queryStr);
    stringifyObjs = stringifyObjs.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(stringifyObjs));

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
    const limit = parseInt(this.queryString.limit, 20) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
