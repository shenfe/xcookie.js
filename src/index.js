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

function addMessageListener(handler) {
    if (window.addEventListener) {
        window.addEventListener('message', handler, false);
    } else {
        window.attachEvent('onmessage', handler);
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

function messageEventHandler(e) {
    var p0 = '[iframexcookie:'.length;
    if (e.data.substr(0, p0) === '[iframexcookie:') {
        var p1 = e.data.indexOf(']', p0);
        if (p1 < 0) return;
        var iframexcookie_id = e.data.substring(p0, p1);
        try {
            var r = JSON.parse(e.data.substr(p1 + 1));
            for (var c in r) {
                if (!r.hasOwnProperty(c) || r[c] == null) continue;
                Cookies.set(cookieNameMapIdTable[iframexcookie_id](c), r[c], { expires: 7, domain: localDomain, path: '/' });
            }
            if (callbackIdTable[iframexcookie_id]) {
                callbackIdTable[iframexcookie_id](r);
                delete callbackIdTable[iframexcookie_id];
            }
            delete cookieNameMapIdTable[iframexcookie_id];
            window.document.body.removeChild(window.document.getElementById(transId(iframexcookie_id)));
        } catch (e) {}
    }
}

addMessageListener(messageEventHandler);

function transId(id) {
    return 'xcookie-' + id;
}

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

    var iframeError = setTimeout(error, 5000);
    var ifr = getIframe(id, iframeSrc + '?' + joinQueryNames(cookieNames) + '&iframexcookie_id=' + id);
    ifr.addEventListener('load', function () {
        load('ok');
        clearTimeout(iframeError);
    }, false);
}

export default iframexcookie
