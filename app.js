// ===== MODEL =====
const Product = Backbone.Model.extend({
  defaults: {
    barcode: "",
    name: "",
    quantity: 0
  }
});

// ===== COLLECTION =====
const ProductCollection = Backbone.Collection.extend({
  model: Product,

  // Sort by quantity (descending)
  comparator(modelA, modelB) {
    return modelB.get("quantity") - modelA.get("quantity");
  },

  // Find by barcode
  findByBarcode(barcode) {
    return this.findWhere({ barcode });
  },

  // LocalStorage helpers (optional)
  saveToLocal() {
    localStorage.setItem("inventoryData", JSON.stringify(this.toJSON()));
  },

  loadFromLocal() {
    const saved = localStorage.getItem("inventoryData");
    if (saved) this.reset(JSON.parse(saved));
  },

  clearLocal() {
    localStorage.removeItem("inventoryData");
  }
});

// ===== VIEW =====
const InventoryView = Backbone.View.extend({
  el: "body",

  events: {
    "click #btn-start": "startScanner",
    "click #btn-stop": "stopScanner",
    "click #btn-reset": "resetInventory",
    "keydown #barcode-input": "handleEnter"
  },

  initialize() {
    this.input = this.$("#barcode-input");
    this.status = this.$("#scanner-status");
    this.tableBody = this.$("#inventory-body");
    this.scannerActive = false;

    // Example product database
    this.productDatabase = [
      { barcode: "11111", name: "Guitar Strings" },
      { barcode: "22222", name: "Guitar Pick" },
      { barcode: "33333", name: "Capo" },
      { barcode: "44444", name: "Guitar Strap" },
      { barcode: "55555", name: "Guitar Tuner" },
      { barcode: "66666", name: "Guitar Book" }
    ];

    this.render();
  },

  render() {
    this.tableBody.empty();

    if (this.collection.length === 0) {
      this.tableBody.append("<tr><td colspan='3'>No products</td></tr>");
      return this;
    }

    this.collection.each((product) => {
      const row = $("<tr></tr>");
      row.append(`<td>${product.get("barcode")}</td>`);
      row.append(`<td>${product.get("name")}</td>`);
      row.append(`<td>${product.get("quantity")}</td>`);
      this.tableBody.append(row);
    });

    return this;
  },

  startScanner() {
    this.scannerActive = true;
    this.status.text("Scanner: ON").css("color", "green");
    this.input.focus();
  },

  stopScanner() {
    this.scannerActive = false;
    this.status.text("Scanner: OFF").css("color", "red");
  },

  handleEnter(e) {
    if (!this.scannerActive) return;

    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      const barcode = this.input.val().trim();
      if (!barcode) return;

      const productInfo = this.productDatabase.find(p => p.barcode === barcode);

      if (!productInfo) {
        alert("Product not found in database!");
        this.input.val("");
        return;
      }

      const existing = this.collection.findByBarcode(barcode);

      if (existing) {
        existing.set("quantity", existing.get("quantity") + 1);
      } else {
        this.collection.add({
          barcode: productInfo.barcode,
          name: productInfo.name,
          quantity: 1
        });
      }

      this.collection.sort();
      this.input.val("");
      this.render();
    }
  },

  resetInventory() {
    if (confirm("Reset full inventory list?")) {
      this.collection.reset([]);
      this.collection.clearLocal();
      this.render();
    }
  }
});

// ===== INITIALIZATION =====
const products = new ProductCollection([]);
new InventoryView({ collection: products });
