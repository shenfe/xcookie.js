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

var callbackIdTable = {};

function iframexcookie(option) {
    var iframeSrc = option.src;
    var cookieNames = option.cookieNames;
    var callback = option.doneWith;
    var id = idGen();
    if (callback) callbackIdTable[id] = callback;
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

    function cookieNameTrans(n) {
        if (Object.prototype.toString.call(cookieNames) === '[object Array]') return n;
        return cookieNames[n];
    }

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
                    Cookies.set(cookieNameTrans(c), r[c], { expires: 7, domain: localDomain, path: '/' });
                }
                if (callbackIdTable[iframexcookie_id]) {
                    callbackIdTable[iframexcookie_id](r);
                    delete callbackIdTable[iframexcookie_id];
                }
            } catch (e) {}
        }
    }

    addMessageListener(messageEventHandler);

    getIframe(targetDomain, iframeSrc + '?' + joinQueryNames(cookieNames) + '&iframexcookie_id=' + id);
}

export default iframexcookie
