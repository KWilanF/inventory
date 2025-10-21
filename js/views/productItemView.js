var App = App || {};

App.ProductItemView = Backbone.View.extend({
  tagName: "li",
  className: "product-item",
  template: _.template($("#tmpl-product-item").html()),

  events: {
    "click .edit": "editProduct",
    "click .delete": "deleteProduct"
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  editProduct: function() {
    alert("Edit feature coming soon!");
  },

  deleteProduct: function() {
    if (confirm("Delete this product?")) {
      this.model.destroy();
    }
  }
});
