# xcookie.js

Get cross-domain cookies in "iframe" way.

## Usage

1. Define the invoker-hostname whitelist and the cookie-name whitelist in `dist/xcookie.html`. For example:

    Define the invoker-hostname whitelist:

    > Replace
    > ```js
    > [/* Define a whitelist of host names here. */]
    > ```
    > with
    > ```js
    > ['.invoker.com']
    > ```

    Define the cookie-name whitelist:

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
        doneWith: function (data) {
            alert(JSON.stringify(data));
        }
    });
    ```

## Compatibility

IE7+.

## Thanks

* [js-cookie](https://github.com/js-cookie/js-cookie)
* [JSON-js](https://github.com/douglascrockford/JSON-js)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, [shenfe](https://github.com/shenfe)
