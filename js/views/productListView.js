(function(root) {
  root.App = root.App || {};

  root.App.ProductListView = Backbone.View.extend({
    el: "#main-region",
    template: _.template($("#tmpl-products").html()),

    events: {
      "click #btn-add": "showAddForm",
      "click #export": "exportCSV",
      "input #search": "filterList",
      "change #sort": "sortList"
    },

    initialize: function() {
      this.listenTo(this.collection, "add remove change reset", this.render);
    },

    render: function() {
      this.$el.html(this.template());
      const list = this.$("#product-list");
      this.collection.each(model => {
        const itemView = new root.App.ProductItemView({ model });
        list.append(itemView.render().el);
      });
      return this;
    },

    showAddForm: function() {
      const formView = new root.App.ProductFormView({ collection: this.collection });
      this.$("#form-region").html(formView.render().el);
    },

    filterList: function(e) {
      const query = e.target.value.toLowerCase();
      const filtered = this.collection.filter(m => m.get("name").toLowerCase().includes(query));
      const list = this.$("#product-list");
      list.empty();
      filtered.forEach(model => {
        const itemView = new root.App.ProductItemView({ model });
        list.append(itemView.render().el);
      });
    },

    sortList: function(e) {
      const key = e.target.value;
      const sorted = this.collection.sortBy(model => model.get(key));
      this.collection.reset(sorted);
    },

    exportCSV: function() {
      let csv = "Name,SKU,Quantity\n";
      this.collection.each(m => {
        csv += `${m.get("name")},${m.get("sku")},${m.get("quantity")}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inventory.csv";
      a.click();
    }
  });
})(this);
