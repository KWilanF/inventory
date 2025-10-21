var App = App || {};

App.AppRouter = Backbone.Router.extend({
  routes: {
    "": "showProducts",
    "products": "showProducts",
    "dashboard": "showDashboard",
    "reports": "showReports"
  },

  initialize: function(options) {
    this.collection = options.collection;
  },

  showProducts: function() {
    var view = new App.ProductListView({ collection: this.collection });
    view.render();
  },

  showDashboard: function() {
    $("#main-region").html("<h2>📊 Dashboard (coming soon)</h2>");
  },

  showReports: function() {
    $("#main-region").html("<h2>📈 Reports (coming soon)</h2>");
  }
});
