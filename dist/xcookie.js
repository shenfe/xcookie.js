(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.iframexcookie = factory());
}(this, (function () { 'use strict';

/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

function extend () {
    var i = 0;
    var result = {};
    for (; i < arguments.length; i++) {
        var attributes = arguments[ i ];
        for (var key in attributes) {
            result[key] = attributes[key];
        }
    }
    return result;
}

function init (converter) {
    function api (key, value, attributes) {
        var result;
        if (typeof document === 'undefined') {
            return;
        }

        // Write

        if (arguments.length > 1) {
            attributes = extend({
                path: '/'
            }, api.defaults, attributes);

            if (typeof attributes.expires === 'number') {
                var expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                attributes.expires = expires;
            }

            // We're using "expires" because "max-age" is not supported by IE
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

            try {
                result = JSON.stringify(value);
                if (/^[\{\[]/.test(result)) {
                    value = result;
                }
            } catch (e) {}

            if (!converter.write) {
                value = encodeURIComponent(String(value))
                    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
            } else {
                value = converter.write(value, key);
            }

            key = encodeURIComponent(String(key));
            key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
            key = key.replace(/[\(\)]/g, escape);

            var stringifiedAttributes = '';

            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }
                stringifiedAttributes += '; ' + attributeName;
                if (attributes[attributeName] === true) {
                    continue;
                }
                stringifiedAttributes += '=' + attributes[attributeName];
            }
            return (document.cookie = key + '=' + value + stringifiedAttributes);
        }

        // Read

        if (!key) {
            result = {};
        }

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling "get()"
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var rdecode = /(%[0-9A-Z]{2})+/g;
        var i = 0;

        for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var cookie = parts.slice(1).join('=');

            if (cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
            }

            try {
                var name = parts[0].replace(rdecode, decodeURIComponent);
                cookie = converter.read ?
                    converter.read(cookie, name) : converter(cookie, name) ||
                    cookie.replace(rdecode, decodeURIComponent);

                if (this.json) {
                    try {
                        cookie = JSON.parse(cookie);
                    } catch (e) {}
                }

                if (key === name) {
                    result = cookie;
                    break;
                }

                if (!key) {
                    result[name] = cookie;
                }
            } catch (e) {}
        }

        return result;
    }

    api.set = api;
    api.get = function (key) {
        return api.call(api, key);
    };
    api.getJSON = function () {
        return api.apply({
            json: true
        }, [].slice.call(arguments));
    };
    api.defaults = {};

    api.remove = function (key, attributes) {
        api(key, '', extend(attributes, {
            expires: -1
        }));
    };

    api.withConverter = init;

    return api;
}

var Cookies = init(function () {});

function iframexcookie(option) {
    function parseDomain(url) {
        var aTag = window.document.createElement('a');
        aTag.href = url;
        var hostname = aTag.hostname;
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(hostname))
            return hostname;
        var hostParts = hostname.split('.');
        if (hostParts.length > 2) return '.' +  hostParts.slice(hostParts.length - 2).join('.');
        else return hostParts.join('.');
    }

    var iframeSrc = option.src;
    var cookieNames = option.cookieNames;
    var callback = option.callback;
    var targetDomain = parseDomain(iframeSrc);
    var localDomain = parseDomain(window.location.href);

    function getIframe(domain, src) {
        var iframeId = 'xcookie-' + domain.replace(/\./g, '_');
        var ifr = window.document.getElementById(iframeId);
        if (!ifr) {
            ifr = window.document.createElement('iframe');
            ifr.id = iframeId;
            ifr.style.display = 'none';
            window.document.body.appendChild(ifr);
        }
        if (src !== undefined) {
            ifr.src = src;
        } else {
            ifr.src = '';
        }
        return ifr;
    }

    var iframe = getIframe(targetDomain);

    function messageEventHandler(e) {
        if (e.data.substr(0, '[iframexcookie]'.length) === '[iframexcookie]') {
            var r = JSON.parse(e.data.substr('[iframexcookie]'.length));
            for (var c in r) {
                if (!r.hasOwnProperty(c)) continue;
                Cookies.set(c, r[c], { expires: 7, path: '/' });
            }
            callback && callback();
        }
    }

    if (window.addEventListener) {
        window.addEventListener('message', messageEventHandler, false);
    } else {
        window.attachEvent('onmessage', messageEventHandler);
    }

    function joinQueryNames(list) {
        var r = '';
        for (var i = 0, len = list.length; i < len; i++) {
            if (i === 0) r = encodeURIComponent(list[i]);
            else r += '&' + encodeURIComponent(list[i]);
        }
        return r;
    }

    getIframe(targetDomain, iframeSrc + '?' + joinQueryNames(cookieNames));
}

return iframexcookie;

})));
