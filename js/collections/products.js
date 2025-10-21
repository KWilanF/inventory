(function(root) {
  root.App = root.App || {};

  root.App.Products = Backbone.Collection.extend({
    model: root.App.Product,
    localStorage: new Backbone.LocalStorage("InventoryDB")
  });
})(this);
