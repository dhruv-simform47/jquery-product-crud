import { Product } from "./model.js";
import {
  getProducts,
  generateId,
  getIndex,
  getProductById,
} from "./storage.js";
import $ from "https://code.jquery.com/jquery-4.0.0.module.min.js";

export function toggleProductView() {
  const productForm = $("#productForm");
  if (
    productForm.css("display") == "none" ||
    productForm.css("display") == ""
  ) {
    $("#btnNewProduct, #productList ,#searchFilter").hide();
    $("#productForm, #btnShowProduct").show();
  } else {
    $("#productForm, #btnShowProduct").hide();
    $("#btnNewProduct, #productList, #searchFilter").show();
  }
}

export function previewProductImage(fileInput) {
  const preview = $("#imgView");
  const file = fileInput[0].files[0];
  const reader = new FileReader();

  $(reader)
    .off()
    .on("load", function () {
      preview.attr("src", reader.result);
      $(".preview").css("display", "block");
    });

  if (file) {
    reader.readAsDataURL(file);
  }
}

export function populateEditForm(editId) {
  //call get index by id
  const product = getProductById(editId);

  $("#prodName").val(product.name);
  $("#prodDesc").val(product.desc);
  $("#prodPrice").val(product.price);
  $("#imgView").prop("src", product.image);
}

export function renderProductList(productList) {
  let productTableBody = $("#prodItems");
  productTableBody.html("");

  if (!productList || productList == "") {
    let tableRow = $("<tr class='fs-5'></tr>");
    tableRow.html("No data Available");
    tableRow.addClass("table-light");
    productTableBody.append(tableRow);
  } 
  else {
    productList.forEach((obj) => {
      let tableRow = $("<tr>");

      tableRow.html(`
    <td scope="row">${obj.id}</td>
            <td>${obj.name}</td>
            <td>${obj.desc}</td>
            <td><img src="${obj.image}" class="object-fit-cover" style="height:80px"></td>
            <td>${obj.price} $</td>
               <td class="pEdit"><button class="btn btn-warning btnEdit" onclick="showProductForm(1,${obj.id})">Edit</button></td>
        <td class="pDelete"><button class="btn btn-danger btnDelete" onclick="deleteProduct(${obj.id})">Delete</button></td>
            `);

      tableRow.addClass("table-light");
      productTableBody.append(tableRow);
    });
  }

  $("#productForm").css("display", "block");
  toggleProductView();
}

export function addProduct() {
  let products = getProducts();
  const id = generateId();

  const inpName = $("#prodName").val();
  const inpDesc = $("#prodDesc").val();
  const imgString = $("#imgView").attr("src");
  const inpPrice = $("#prodPrice").val();

  if (!inpName || !inpDesc || !inpPrice || !imgString) {
    alert("All fields are Required!");
  } else {
    const newProduct = new Product(id, inpName, inpDesc, imgString, inpPrice);
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    renderProductList(getProducts());
  }
}

export function editProduct(id) {
  let products = getProducts();

  const inpName = $("#prodName").val();
  const inpDesc = $("#prodDesc").val();
  const inpPrice = $("#prodPrice").val();
  const inpImage = $("#prodImage")[0].files[0];
  if (!inpName || !inpDesc || !inpPrice) {
    alert("All fields are Required!");
  } else {
    let index = getIndex(id, products);
    products[index].name = inpName;
    products[index].desc = inpDesc;
    products[index].price = inpPrice;
    if (inpImage) {
      products[index].image = $("#imgView").attr("src");
    }

    localStorage.setItem("products", JSON.stringify(products));
    renderProductList(getProducts());
  }
}

export function deleteProduct(id) {
  let isConfirmed = confirm("Are you sure you want to delete?");
  if (isConfirmed) {
    let products = getProducts();
    let index = getIndex(id, products);
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
  }
  renderProductList(getProducts());
}

export function sortProducts(products, sortOption) {
  let sortedProducts;
  switch (sortOption) {
    case "id-asc":
      sortedProducts = products.toSorted((a, b) => a.id - b.id);
      break;
    case "id-desc":
      sortedProducts = products.toSorted((a, b) => b.id - a.id);
      break;
    case "name-asc":
      sortedProducts = products.toSorted((a, b) =>
        a.name.localeCompare(b.name),
      );
      break;
    case "name-desc":
      sortedProducts = products.toSorted((a, b) =>
        b.name.localeCompare(a.name),
      );
      break;
    case "price-asc":
      sortedProducts = products.toSorted((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sortedProducts = products.toSorted((a, b) => b.price - a.price);
      break;
    default:
      sortedProducts = products;
  }
  return sortedProducts;
}
