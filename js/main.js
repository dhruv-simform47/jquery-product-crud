import {
  renderProductList,
  toggleProductView,
  previewProductImage,
  populateEditForm,
  addProduct,
  editProduct,
  deleteProduct,
  sortProducts,
} from "./ui.js";
import $ from "https://code.jquery.com/jquery-4.0.0.module.min.js";
import { getProducts } from "./storage.js";
import { debounce } from "./utils.js";


$("#btnCancel").click(function(){
  renderProductList(getProducts());
});

$("#btnNewProduct").click(function(){
  showProductForm(0);
});

$("#btnShowProduct").click(function(){renderProductList(getProducts())});

$(document).ready(function(){
  renderProductList(getProducts());
});

//this handle the new product button and edit button
globalThis.showProductForm = function (flag, editId = 0) { 
  const productTitle = $("#pTitle");
  const btnSubmit = $("#btnSubmit");
  $("#productForm")[0].reset();

  if (flag === 0) {
    productTitle.text ("Add Product Form");
    btnSubmit.off().on("click",addProduct);
    btnSubmit.removeClass("btn-secondary");
    btnSubmit.addClass("btn-success");
    btnSubmit.text("Add");
    $(".preview").css("display","none");
  } else {
    productTitle.text("Edit Product Form");
    btnSubmit.off().on("click",function () {
      editProduct(editId);
    });
    btnSubmit.removeClass("btn-success");
    btnSubmit.addClass("btn-info");
    btnSubmit.text("Update");
    populateEditForm(editId);
  }

  toggleProductView();

  const fileInput = $("#prodImage");
  fileInput.off().on("change",function(){
    previewProductImage(fileInput);
  });
};

globalThis.deleteProduct = deleteProduct;

//sorting function
$("#sortSelect").off().on("change",function () {
  const products = getProducts();
  const sortOption = this.value;
  const sortedProducts = sortProducts(products, sortOption);
  renderProductList(sortedProducts);
});

//filter function
function getFilltered(searchId) {
  if (searchId == "") {
    renderProductList(getProducts());
  } else {
    const products = getProducts();
    const productList = products.filter((prod) => searchId == prod.id);

    if (productList.length > 0) {
      renderProductList(productList);
    } else {
      globalThis.alert("No data for id:  " + searchId);
    }
  }
}

const schedular = debounce(getFilltered, 1000);

$("#searchFilter").keyup(function (e) {
  schedular(e.target.value);
});
