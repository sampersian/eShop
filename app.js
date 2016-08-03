products = {};
$.get("https://galvanize-cors-proxy.herokuapp.com/https://jsonhost-d6ae1.firebaseapp.com/inventory.json")
  .then((data) => {
    products = data;
    setUpInventory();
    addNavCategories();
    $("#enterStore").click(function() {
      $(".jumbotron").hide();
      $("main").show();
    })
    $('.navCat').click(function() {
      $(".threeFour").empty();
      showCategory(getRidOfSpaces(this.innerHTML));
    })
    $('.searchButton').click(function() {
      searchForSomething($(".myInput").val());
      $(".myInput").val('');
    })
    $('.searchButton2').click(function() {
      $(".jumbotron").hide();
      $("main").show();
      searchForSomething($(".myInput2").val());
      $(".myInput").val('');
    })
  })

categories = []; //category names
brands = []; //brand names
kinds = [];//different product kinds (maybe rename this because its confusing as fuck)
inventoryBySKU = {}; //product inventory where keys are product SKU's
inventoryByCategory = {}; //keys are category names with values of arrays containing different product objects
inventoryByBrand = {};
inventoryByKind = {};


function getRidOfSpaces(str) {
  let arr = []
  for (s in str.split("")) {
    if (str[s] === " ") {
      arr.push("_")
    } else {
      arr.push(str[s])
    }
  }
  return arr.join("")
}

function getRidOfUnderscores(str) {
  let arr = []
  for (s in str.split("")) {
    if (str[s] === "_") {
      arr.push(" ")
    } else {
      arr.push(str[s])
    }
  }
  return arr.join("")
}

//this is gonna fill up our inventory objects and the category array
function setUpInventory() {
    for (p of products) {
      p.Category = getRidOfSpaces(p.Category); //gets rid of spaces in category names and replaces them with _'s
      p.Brand = getRidOfSpaces(p.Brand);
      if (p.Kind === undefined) {
        p.Kind = "";
      } else {
        p.Kind = getRidOfSpaces(p.Kind);
      }


      inventoryBySKU[p.SKU] = p; //puts the product into inventory w/ the SKU as a key

      if (inventoryByCategory[p.Category] === undefined) {
        categories.push(p.Category);
        inventoryByCategory[p.Category] = [];
      };
      inventoryByCategory[p.Category].push(p);

      if (inventoryByBrand[p.Brand] === undefined) {
        brands.push(p.Brand);
        inventoryByBrand[p.Brand] = [];
      };
      inventoryByBrand[p.Brand].push(p);

      if (inventoryByKind[p.Kind] === undefined) {
        kinds.push(p.Kind);
        inventoryByKind[p.Kind] = [];
      };
      inventoryByKind[p.Kind].push(p);
    };
};

function makeItemObject(sku) {
    item = inventoryBySKU[sku];
    itemObject = $('<div class="card col-lg-4 col-md-6 col-sm-8 col-xs-12">\
      <div class="myCard">\
        <div class="cardPhotoHolder">\
          <img class="card-img-top cardPhoto" src="images/'+item.SKU+'.jpg" alt="Card image cap" width="200px">\
        </div>\
        <div class="card-block">\
          <div class="row">\
            <div class="myLeftLogo">\
              <img class="cardLogo" src="logos/'+item.Brand+'.png" alt="Card image cap" height="40px" width="40px">\
            </div>\
            <div class="myRightTitle">\
              <h4 class="card-title itemTitle">'+item.Type+' '+item.Kind+'</h4>\
            </div>\
          </div>\
          <p class="card-text">$'+item.Price+'.99</p>\
          <input type="number" class="form-control" value="1">\
          <button type="button" class="btn btn-primary form-control itemAdder" onclick="addItemToCart('+item.SKU+');">Add to Cart</button>\
        </div>\
      </div>\
    </div>');

    return itemObject;
}

function addNavCategories() {
  for (let c in categories.sort()) {
    let newobj = $('<li class="nav-item navCat">'+getRidOfUnderscores(categories[c])+'</li>');
     $('.catSelector').append(newobj);
  }
}


function showCategory(cat) {
  let theWholeCategory = inventoryByCategory[cat];
  for (let c of theWholeCategory) {
    let obj = makeItemObject(c.SKU);
    $(".threeFour").append(obj);
  }
  $(".pageTitle").text(getRidOfUnderscores(cat));
}

function changeTitleAndEmpty(str) {
  $('.pageTitle').text(str);
  $(".threeFour").empty();
}

function showAllOfBrand(brand) {
  let theWholeBrand = inventoryByBrand[brand];
  for (let b of theWholeBrand) {
    let obj = makeItemObject(b.SKU);
    $(".threeFour").append(obj);
  }
}

function showAllOfKind(kind) {
  let theWholeKind = inventoryByKind[kind];
  for (let k of theWholeKind) {
    let obj = makeItemObject(k.SKU);
    $(".threeFour").append(obj);
  }
}

function showSKU(sku) {
  let obj = makeItemObject(sku);
  $(".threeFour").append(obj);
}

function searchForSomething(sVal) {
  $(".threeFour").empty();
  var searchMethod = $("#select").val();
  var searchValue = sVal;
  console.log("searching for the term '"+searchValue+"'");
  console.log("searching by "+searchMethod)
  switch (searchMethod) {
    case 'Brand':
      for (brand of brands) {
        if (getRidOfUnderscores(brand).toLowerCase() == searchValue.toLowerCase()) {
          changeTitleAndEmpty(brand);
          showAllOfBrand(brand);
          break;
        }
      }
      console.error("No brand of '"+searchValue+"' was found.")
      break;
    case 'Kind':
      for (kind of kinds) {
        if (getRidOfUnderscores(kind).toLowerCase() == searchValue.toLowerCase()) {
          changeTitleAndEmpty(kind);
          showAllOfKind(kind);
          break;
        }
      }
      console.error("No kind of '"+searchValue+"' was found.");
      break;
    case 'SKU':
        if (inventoryBySKU[searchValue] === undefined) {
          console.error("No SKU of '"+searchValue+"' was found.'");
        } else {
          changeTitleAndEmpty("SKU");
          showSKU(searchValue);
        }
      break;
    case 'Everything':
      let k = false;
      let b = false;
      let s = false;
      for (brand of brands) {
        if (getRidOfUnderscores(brand).toLowerCase() == searchValue.toLowerCase()) {
          b = brand;
        }
      }
      for (kind of kinds) {
        if (getRidOfUnderscores(kind).toLowerCase() == searchValue.toLowerCase()) {
          k = kind;
        }
      }
      if (inventoryBySKU[searchValue]) {
        s = searchValue;
      }
      if (b !== false || k !== false || s !== false) {
        changeTitleAndEmpty("All Results");
        if (b !== false) {
          showAllOfBrand(b);
        }
        if (k !== false) {
          showAllOfKind(k);
        }
        if (s !== false) {
          showSKU(s);
        }
      } else {
        console.error("Nothing was found matching the term '"+searchValue+"'.")
      }
      break;
    default:
      console.error("Search error. Invalid Method.")
    }
}

function addItemToCart(sku) {

}
