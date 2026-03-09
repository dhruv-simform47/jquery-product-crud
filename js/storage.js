import { PRODUCT_KEY } from "./model.js";

export function getProducts() {
    return JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];
}

export function generateId() {
  const productArray = getProducts();
    if (productArray.length === 0) {
        return 1;
    }
    const maxId = productArray.reduce((max, product) => {
        const idNum = Number(product.id);
        if (Number.isNaN(idNum)) {
            return max;
        }
        return idNum > max ? idNum : max;
    }, 0);
    return maxId + 1;
}

export function getIndex(id, parray) {
    let index = parray.findIndex((prod) => {
        if (prod.id === id) {
            return true;
        }
    });

    if (index == -1) {
        throw new Error("Product not found for id " + id);
    }
    return index;
}