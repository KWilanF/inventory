(function(root) {
  root.App = root.App || {};

  root.App.Product = Backbone.Model.extend({
    defaults: {
      name: "",
      sku: "",
      quantity: 0
    }
  });
})(this);
