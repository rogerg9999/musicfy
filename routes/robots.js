var crawlPage = function(idx, arr) {
  // location = window.location
  if (idx < arr.length) {
    var uri = arr[idx];
    var browser = new Browser(browserOpts);
    var promise = browser.visit(uri)
    .then(function() {

      // Turn links into absolute links
      // and save them, if we need to
      // and we haven't already crawled them
      var links = browser.queryAll('a');
      links.forEach(function(link) {
        var href = link.getAttribute('href');
        var absUrl = url.resolve(uri, href);
        link.setAttribute('href', absUrl);
        if (arr.indexOf(absUrl) < 0) {
          arr.push(absUrl);
        }
      });

      // Save
      saveSnapshot(uri, browser.html());
      // Call again on the next iteration
      crawlPage(idx+1, arr);
    });
  }
}