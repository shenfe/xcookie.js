import { Cookies } from './js-cookie'

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
        }
    }
    window.addEventListener('message', messageEventHandler, false);

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

export default iframexcookie
