import { Product } from "./model.js";
import { getProducts, generateId, getIndex } from "./storage.js";
import $ from "https://code.jquery.com/jquery-4.0.0.module.min.js";

export function toggleProductView() {
  const productForm = $("#productForm");
  if (productForm.css("display") == "none" || productForm.css("display") == "") {
    $("#btnNewProduct").hide();
    $("#productList").hide();
    $("#searchFilter").hide()
    $("#productForm").show();
    $("#btnShowProduct").show();
  } else {
    $("#productForm").hide();
    $("#btnShowProduct").hide();
    $("#btnNewProduct").show();
    $("#productList").show();
    $("#searchFilter").show();
  }
}



export function previewProductImage(fileInput) {
  const preview = $("#imgView");
  const file = fileInput.files[0];
  const reader = new FileReader();

  $(reader).on("load" ,function(){
    preview.attr("src",reader.result);

    $(".preview").css("display","block");
  });

  if (file) {
    reader.readAsDataURL(file);
  }
}

export function populateEditForm(editid) {
  const products = getProducts();
  let index = getIndex(editid, products);

  $("#prodName").val(products[index].name);
  $("#prodDesc").val(products[index].desc);
  $("#prodPrice").val(products[index].price);
  $("#preview").css("display","block");
  console.log("inside populate",products[index].image);
  $("#imgView").prop("src",products[index].image);
  // document.getElementById("imgView").src=products[index].image;

}

export function renderProductList(productList = null) {
  let products;
  if (productList == null) {
    products = getProducts();
  } else {
    products = productList;
  }


  let productTableBody = $("#prodItems");
  productTableBody.html("");

  products.forEach((obj) => {
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

  
  $("#productForm").css("display","block");
  toggleProductView();

}

export function addProduct() {
  let products = getProducts();
  const id = generateId();

  const inp_name = $("#prodName").val();
  const inp_desc = $("#prodDesc").val();
  const img_string = $("#imgView").attr("src");
  const inp_Price = $("#prodPrice").val();

  if (!inp_name || !inp_desc || !inp_Price || !img_string) {
    alert("All fields are Required!");
  } else {
    const new_product = new Product(
      id,
      inp_name,
      inp_desc,
      img_string,
      inp_Price,
    );
    products.push(new_product);
    localStorage.setItem("products", JSON.stringify(products));
    renderProductList();
  }
}

export function editProduct(id) {
  let products = getProducts();

  const inp_name = $("#prodName").val();
  const inp_desc = $("#prodDesc").val();
  const inp_Price = $("#prodPrice").val();
  const inp_image = $("#prodImage")[0].files[0];
  if (!inp_name || !inp_desc || !inp_Price) {
    alert("All fields are Required!");
  } else {
    let index = getIndex(id, products);
    products[index].name = inp_name;
    products[index].desc = inp_desc;
    products[index].price = inp_Price;
    if (inp_image) {
      products[index].image = $("#imgView").attr("src");
    }

    localStorage.setItem("products", JSON.stringify(products));
    renderProductList();
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
  renderProductList();
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
