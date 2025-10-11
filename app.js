// ===================== MODEL =====================
const Product = Backbone.Model.extend({
  defaults: {
    barcode: "",
    name: "",
    quantity: 0,
  },
});

// ===================== COLLECTION =====================
const ProductCollection = Backbone.Collection.extend({
  model: Product,

  comparator(modelA, modelB) {
    return modelB.get("quantity") - modelA.get("quantity");
  },

  findByBarcode(barcode) {
    return this.findWhere({ barcode });
  },

  saveToLocal() {
    localStorage.setItem("inventoryData", JSON.stringify(this.toJSON()));
  },

  loadFromLocal() {
    const saved = localStorage.getItem("inventoryData");
    if (saved) this.reset(JSON.parse(saved));
  },

  clearLocal() {
    localStorage.removeItem("inventoryData");
  },
});

// ===================== VIEW =====================
const InventoryView = Backbone.View.extend({
  el: ".app-container",

  events: {
    "click #btn-start": "startScanner",
    "click #btn-stop": "stopScanner",
    "click #btn-reset": "resetInventory",
    "keypress #barcode-input": "handleBarcodeEntry",
  },

  initialize() {
    this.input = this.$("#barcode-input");
    this.status = this.$("#scanner-status");
    this.tableBody = this.$("#inventory-body");
    this.scannerActive = false;

    // Example database (mock)
    this.productDatabase = [
      { barcode: "11111", name: "Guitar Strings" },
      { barcode: "22222", name: "Guitar Pick" },
      { barcode: "33333", name: "Capo" },
      { barcode: "44444", name: "Guitar Strap" },
      { barcode: "55555", name: "Guitar Tuner" },
      { barcode: "66666", name: "Guitar Book" },
    ];

    // Load local data
    this.collection.loadFromLocal();

    this.listenTo(this.collection, "update change reset", this.render);
    this.render();
  },

  render() {
    this.tableBody.empty();

    if (this.collection.length === 0) {
      this.tableBody.append(
        `<tr><td colspan="3" class="empty">No products found</td></tr>`
      );
      return this;
    }

    this.collection.each((product) => {
      const row = $(`
        <tr>
          <td>${product.get("barcode")}</td>
          <td>${product.get("name")}</td>
          <td>${product.get("quantity")}</td>
        </tr>
      `);
      this.tableBody.append(row);
    });

    return this;
  },

  // ---------- Scanner Controls ----------
  startScanner() {
    this.scannerActive = true;
    this.status.text("🟢 Scanner: ON").removeClass("off").addClass("on");
    this.input.focus();
    this.flashMessage("Scanner started!");
  },

  stopScanner() {
    this.scannerActive = false;
    this.status.text("🔴 Scanner: OFF").removeClass("on").addClass("off");
    this.flashMessage("Scanner stopped!");
  },

  resetInventory() {
    if (confirm("Are you sure you want to reset the entire inventory?")) {
      this.collection.reset([]);
      this.collection.clearLocal();
      this.flashMessage("Inventory cleared!");
    }
  },

  // ---------- Barcode Entry ----------
  handleBarcodeEntry(e) {
    if (!this.scannerActive) return;
    if (e.key === "Enter") {
      e.preventDefault();
      const barcode = this.input.val().trim();
      if (!barcode) return;

      const productInfo = this.productDatabase.find(
        (p) => p.barcode === barcode
      );

      if (!productInfo) {
        this.flashMessage("⚠️ Product not found in database!", true);
        this.input.val("");
        return;
      }

      const existing = this.collection.findByBarcode(barcode);
      if (existing) {
        existing.set("quantity", existing.get("quantity") + 1);
        this.flashMessage(`✅ Updated ${existing.get("name")} quantity`);
      } else {
        this.collection.add({
          barcode: productInfo.barcode,
          name: productInfo.name,
          quantity: 1,
        });
        this.flashMessage(`🆕 Added ${productInfo.name}`);
      }

      this.collection.sort();
      this.collection.saveToLocal();
      this.input.val("");
    }
  },

  // ---------- Toast Notifications ----------
  flashMessage(msg, isError = false) {
    const toast = $("<div class='toast'></div>").text(msg);
    if (isError) toast.css("background", "#dc3545");
    $("body").append(toast);
    setTimeout(() => toast.addClass("show"), 100);
    setTimeout(() => toast.remove(), 2500);
  },
});

// ---------- Add Toast CSS ----------
$("<style>")
  .prop("type", "text/css")
  .html(`
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #007bff;
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  opacity: 0;
  font-size: 14px;
  transition: all 0.4s ease;
  z-index: 9999;
}
.toast.show {
  opacity: 1;
  bottom: 50px;
}
`)
  .appendTo("head");

// ===================== INITIALIZATION =====================
const products = new ProductCollection([]);
new InventoryView({ collection: products });
