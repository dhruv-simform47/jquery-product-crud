export const PRODUCT_KEY = "products";

export class Product {
    constructor(id, name, desc, image, price) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.image = image;
        this.price = price;
    }
}