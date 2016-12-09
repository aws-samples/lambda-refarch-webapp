'use strict';

describe('The main view', function () {
  var page;

  beforeEach(function () {
    browser.get('/index.html');
    page = require('./main.po');
  });

  it('should include jumbotron with correct data', function() {
    expect(page.h1El.getText()).toBe('Serverless Blog Engine');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/aws-cloud.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('Amazon Web Services');
  });

  /*
  it('should list more than 5 posts', function () {
    expect(page.thumbnailEls.count()).toBeGreaterThan(5);
  });
  */

});
