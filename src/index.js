import { Cookies } from './lib/js-cookie'

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

function listenEvent(event, handler, target) {
    target = target || window;
    if (window.addEventListener) {
        target.addEventListener(event, handler, false);
    } else {
        target.attachEvent('on' + event, handler);
    }
}

function joinQueryNames(list) {
    var r = '';
    if (Object.prototype.toString.call(list) === '[object Array]') {
        for (var i = 0, len = list.length; i < len; i++) {
            if (i === 0) r = encodeURIComponent(list[i]);
            else r += '&' + encodeURIComponent(list[i]);
        }
    } else {
        var i = 0;
        for (var c in list) {
            if (!list.hasOwnProperty(c)) continue;
            if (i === 0) {
                i++;
                r = encodeURIComponent(c);
            } else {
                r += '&' + encodeURIComponent(c);
            }
        }
    }
    return r;
}

var idGen = (function () {
    var id = 0;
    return function () {
        id++;
        return id;
    };
})();

var localDomain = parseDomain(window.location.href);

var callbackIdTable = {};
var cookieNameMapIdTable = {};

function transId(id) {
    return 'xcookie-' + id;
}

function clearTask(id, res) {
    if (callbackIdTable[id]) {
        callbackIdTable[id](res);
        delete callbackIdTable[id];
    }
    delete cookieNameMapIdTable[id];
    window.document.body.removeChild(window.document.getElementById(transId(id)));
}

function messageEventHandler(e) {
    var p0 = '[iframexcookie:'.length;
    if (typeof e.data === 'string' && e.data.substr(0, p0) === '[iframexcookie:') {
        var p1 = e.data.indexOf(']', p0);
        if (p1 < 0) return;
        var iframexcookie_id = e.data.substring(p0, p1);
        var r;
        try {
            r = JSON.parse(e.data.substr(p1 + 1));
            for (var c in r) {
                if (!r.hasOwnProperty(c) || r[c] == null) continue;
                Cookies.set(cookieNameMapIdTable[iframexcookie_id](c), r[c], { expires: 7, domain: localDomain, path: '/' });
            }
        } catch (e) {
            r = {};
        }
        clearTask(iframexcookie_id, r);
    }
}

listenEvent('message', messageEventHandler);

function getIframe(id, src) {
    var iframeId = transId(id);
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

function iframexcookie(option) {
    var iframeSrc = option.src;
    var cookieNames = option.cookieNames;
    var id = idGen();
    
    var callback = option.doneWith;
    if (callback) callbackIdTable[id] = callback;

    cookieNameMapIdTable[id] = function (n) {
        if (Object.prototype.toString.call(cookieNames) === '[object Array]') return n;
        return cookieNames[n];
    };

    var ifr = getIframe(id, iframeSrc + '?' + joinQueryNames(cookieNames) + '&iframexcookie_id=' + id);
    var ifrErr = window.setTimeout(function () {
        clearTask(id, {});
    }, option.timeout || 5000);
    listenEvent('load', function () {
        window.clearTimeout(ifrErr);
    }, ifr);
}

export default iframexcookie
