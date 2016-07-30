$.get("http://cors-anywhere.herokuapp.com/https://jsonhost-d6ae1.firebaseapp.com/inventory.json")
  .then((data) => {
    products = data;
    setUpInventory();
  })

categories = []; //category names
brands = []; //brand names
kinds = [];//different product kinds (maybe rename this because its confusing as fuck)
inventoryBySKU = {}; //product inventory where keys are product SKU's
inventoryByCategory = {}; //keys are category names with values of arrays containing different product objects
inventoryByBrand = {};
inventoryByKind = {};

//this is gonna fill up our inventory objects and the category array
function setUpInventory() {
    for (p of products) {
      p.Category = p.Category.replace(" ", "_"); //gets rid of spaces in category names and replaces them with _'s
      p.Brand = p.Brand.replace(" ", "_");
      p.Kind = p.Kind.replace(" ", "_");

      categories.push(p.Category);
      brands.push(p.Brand);
      kinds.push(p.Kind);

      inventoryBySKU[p.SKU] = p; //puts the product into inventory w/ the SKU as a key

      if (inventoryByCategory[p.Category] === undefined) {
        inventoryByCategory[p.Category] = [];
      };
      inventoryByCategory[p.Category].push(p);

      if (inventoryByBrand[p.Brand] === undefined) {
        inventoryByBrand[p.Brand] = [];
      };
      inventoryByBrand[p.Brand].push(p);

      if (inventoryByKind[p.Kind] === undefined) {
        inventoryByKind[p.Kind] = [];
      };
      inventoryByKind[p.Kind].push(p);
    };
};
