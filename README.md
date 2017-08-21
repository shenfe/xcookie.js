# xcookie.js
Get cross-domain cookies in "iframe" way.

## Usage
1. Define the whitelist or blacklist of cookie names in `dist/xcookie.html`. For example:
  > Replace
  > ```js
  > [/* Define a whitelist of cookie names here. */]
  > ```
  > with
  > ```js
  > ['name1', 'name2']
  > ```
2. Place the `xcookie.html` page file somewhere under the target domain (e.g. "www.target.com") whose cookie you would like to get.
3. Import the `dist/xcookie.js` script file in your page, and use it like this:
  ```js
  iframexcookie({
      src: 'http://www.target.com/path/to/xcookie.html',
      cookieNames: ['name1'],
      callback: function () {
          alert(window.document.cookie);
      }
  });
  ```

## Compatibility
IE8+.

## License
[MIT](http://opensource.org/licenses/MIT)
Copyright (c) 2017-present, [shenfe](https://github.com/shenfe)
