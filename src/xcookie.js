if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchStr, Position) {
        if (!(Position < this.length))
            Position = this.length;
        else
            Position |= 0;
        return this.substr(Position - searchStr.length, searchStr.length) === searchStr;
    };
}

function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

function inArray(item, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (item === arr[i]) return i;
    }
    return -1;
}

(function (whitelist, strictMatch) {
    function parseDomain(url) {
        var aTag = window.document.createElement('a');
        aTag.href = url;
        return aTag.hostname;
    }
    var parentHost = parseDomain(window.document.referrer);
    if (strictMatch) {
        if (inArray(parentHost, whitelist) < 0) {
            throw new Error('Host blocked!');
        }
    } else {
        for (var i = 0, len = whitelist.length; i < len; i++) {
            if (parentHost.endsWith(whitelist[i]) || ('.' + parentHost) === whitelist[i]) return true;
        }
        throw new Error('Host blocked!');
    }
})(HostWhitelist);

(function (whitelist, blacklist) {
    var iframexcookie_id = null;

    function parseQueryNames() {
        var r = [];
        var queryStr = window.location.search;
        if (queryStr.length > 0) {
            r = queryStr.substr(1).split('&');
            for (var i = 0, len = r.length; i < len; i++) {
                var kv = r[i].split('=');
                if (kv[0] === 'iframexcookie_id') {
                    iframexcookie_id = kv[1];
                } else {
                    r[i] = decodeURIComponent(kv[0]);
                }
            }
        }
        return r;
    }

    function getCookie(name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        return (arr = window.document.cookie.match(reg)) ? unescape(arr[2]) : null;
    }

    if (!isArray(whitelist) && !isArray(blacklist)) return;
    var cookies = {};
    var cookieNames = parseQueryNames();
    for (var i = 0, len = cookieNames.length; i < len; i++) {
        if (isArray(whitelist)) {
            if (inArray(cookieNames[i], whitelist) < 0) continue;
        }
        if (isArray(blacklist)) {
            if (inArray(cookieNames[i], blacklist) >= 0) continue;
        }
        var v = getCookie(cookieNames[i]);
        if (v !== '') {
            cookies[cookieNames[i]] = v;
        }
    }
    window.parent.postMessage('[iframexcookie:' + iframexcookie_id + ']' + JSON.stringify(cookies), '*');
})(CookieWhitelist);
