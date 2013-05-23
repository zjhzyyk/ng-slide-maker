'use strict';

describe('Service: insertItem', function () {

  // load the service's module
  beforeEach(module('slidesGeneratorApp'));

  // instantiate service
  var insertItem;
  beforeEach(inject(function(_insertItem_) {
    insertItem = _insertItem_;
  }));

  it('should do something', function () {
    expect(!!insertItem).toBe(true);
  });

});
