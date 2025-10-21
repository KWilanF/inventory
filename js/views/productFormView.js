(function(root) {
  root.App = root.App || {};

  root.App.ProductFormView = Backbone.View.extend({
    tagName: "div",
    template: _.template($("#tmpl-product-form").html()),

    events: {
      "submit #product-form": "saveProduct",
      "click .cancel": "cancelForm"
    },

    initialize: function(options) {
      this.collection = options.collection;
      this.model = this.model || new root.App.Product();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    saveProduct: function(e) {
      e.preventDefault();
      const data = {
        name: this.$("input[name='name']").val().trim(),
        sku: this.$("input[name='sku']").val().trim(),
        quantity: parseInt(this.$("input[name='quantity']").val()) || 0
      };

      if (!data.name || !data.sku) {
        alert("Please complete all fields.");
        return;
      }

      if (this.model.isNew()) {
        this.collection.create(data);
      } else {
        this.model.set(data);
        this.model.save();
      }

      this.remove();
    },

    cancelForm: function() {
      this.remove();
    }
  });
})(this);
