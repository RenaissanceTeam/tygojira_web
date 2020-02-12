export const Order = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING"
};

export class Sort {
  constructor(order, fields) {
    this.order  = order;
    this.fields = fields;
  }
}

export class PageRequest {
  constructor(page, size, sort) {
    this.page = page;
    this.size = size;
    this.sort = sort;
  }
}