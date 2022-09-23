// ==UserScript==
// @name         Ruby on Rails API switch versions
// @namespace    https://github.com/ysjj/userscript
// @version      0.1
// @description  Add version selector on 'Ruby on Rails API'
// @author       YAMASHITA,Junji <ysiijj+github@gmail.com>
// @match        https://api.rubyonrails.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rubyonrails.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const versionSwitcherSetup = () => {
        const banner = document.querySelector('.banner');
        if (!banner) return;

        const heading = banner.querySelector('span');
        const currentVersion = heading.innerText.replace('Ruby on Rails ', '');

        const stylize = (elem) => {
            elem.style.border = '0 none';
            elem.style.color = '#FFF';
            elem.style.backgroundColor = '#B61D1D';
            elem.style.fontSize = 'inherit';
            elem.style.fontFamily = 'inherit';
            return elem;
        };

        const select = stylize(document.createElement('select'));
        [...(new Set(['6.0.6', '6.1.7', '7.0.4', currentVersion]))].sort().forEach((ver, _) => {
            const option = document.createElement('option');
            if (ver == currentVersion) option.setAttribute('selected', 'selected');
            option.value = ver;
            option.innerText = ver;
            select.append(option);
        });

        select.addEventListener('change', (evt) => {
            const newVersion = select.value;
            const escape = (s) => s.replaceAll('.', '\.');
            const newPath = location.pathname.replace(new RegExp(`^/(?:v${escape(currentVersion)}/)?`), `/v${newVersion}/`);
            // currentVersion >= '6.1' では window.parent === window
            // newVersion     <  '6.1' ではフレームによるサイドバー非対応
            window.parent.location.href = newPath;
        });

        heading.innerText = 'Ruby on Rails';
        heading.append(select);
    };

    // Rails on Rails API navigate pages with javascript.
    // https://stackoverflow.com/a/39508954
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            versionSwitcherSetup();
        }
    }).observe(document, { subtree: true, childList: true });

    versionSwitcherSetup();
})();
