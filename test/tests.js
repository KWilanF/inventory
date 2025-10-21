QUnit.module('Product Model and Collection', {
  beforeEach: function() {
    localStorage.clear();
    this.products = new App.Products();
  }
});

QUnit.test('Create product and persist', function(assert){
  const done = assert.async();
  const col = this.products;
  col.create({name:'Test', sku:'TST-1', quantity:2}, {
    success: function(model) {
      assert.ok(model.id, 'Model created with id');
      col.fetch({
        success: function(){
          assert.equal(col.length, 1, 'Collection fetched 1 item from localStorage');
          done();
        }
      });
    }
  });
});

QUnit.test('Validation rejects bad data', function(assert){
  const p = new App.Product();
  const errors = p.validate({name:'', sku:'', quantity:-1});
  assert.ok(errors.name && errors.sku && errors.quantity, 'Validation returns errors for name, sku and quantity');
});
