(function (root) {
  root.App = root.App || {};

  document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ App starting...");

    // Define Model
    App.Product = Backbone.Model.extend({
      defaults: {
        name: "",
        sku: "",
        quantity: 0
      }
    });

    // Define Collection (use localStorage)
    App.Products = Backbone.Collection.extend({
      model: App.Product,
      localStorage: new Backbone.LocalStorage("InventoryDB"),
      comparator: "name"
    });

    // Define Item View
    App.ProductItemView = Backbone.View.extend({
      tagName: "li",
      template: _.template($("#tmpl-product-item").html()),
      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      }
    });

    // Define List View
    App.ProductListView = Backbone.View.extend({
      el: "#main-region",
      template: _.template($("#tmpl-products").html()),
      render: function () {
        console.log("🧩 Rendering product list...");
        this.$el.html(this.template());
        const list = this.$("#product-list");

        if (this.collection.length === 0) {
          list.html("<li>No products found</li>");
        } else {
          this.collection.each(model => {
            const item = new App.ProductItemView({ model });
            list.append(item.render().el);
          });
        }
        return this;
      }
    });

    // Define Router
    App.AppRouter = Backbone.Router.extend({
      routes: {
        "": "showProducts",
        "products": "showProducts"
      },
      showProducts: function () {
        console.log("📦 showProducts route triggered");
        const view = new App.ProductListView({ collection: products });
        view.render();
      }
    });

    // Start App
    const products = new App.Products();
    products.fetch({ reset: true }).then(() => {
      console.log("✅ Products fetched:", products.length);

      // Seed data if empty
      if (products.length === 0) {
        products.create({ name: "Sample Product A", sku: "SAMPLE-A", quantity: 10 });
        products.create({ name: "Sample Product B", sku: "SAMPLE-B", quantity: 5 });
      }

      const router = new App.AppRouter();
      Backbone.history.start();
    });
  });
})(this);
