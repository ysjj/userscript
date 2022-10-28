// ==UserScript==
// @name         Ruby lang docs version switch
// @namespace    https://github.com/ysjj/userscript
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.ruby-lang.org/ja/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ruby-lang.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const versionSwitcherSetup = () => {
        let header = document.querySelector("header > nav > ol.inline-breadcrumb-list > li:first-child");
        if (!header) return;
        if (header.children[0]) header = header.children[0]; // anchor content

        const [_, currentVersion] = header.innerText.match(/(\d\.\d(?:\.\d)?)/);

        const versions = document.createElement('span');
        versions.classList.add('_userscript_ruby_lang_version_content');

        const reVerInPath = new RegExp(`${currentVersion.replaceAll('.', '\\.')}|latest`);
        [...(new Set(['2.7.0', '3.0', '3.1', currentVersion]))].sort().forEach((ver, _) => {
            if (ver != currentVersion) {
                const anchor = document.createElement('a');
                anchor.innerText = ver;
                anchor.href = location.pathname.replace(reVerInPath, ver);
                versions.append(anchor);
            }
        });

        const version = document.createElement('span');
        version.classList.add('_userscript_ruby_lang_version');
        version.innerText = currentVersion;
        version.append(versions);

        const style = document.createElement('style');
        style.innerText = `
          ._userscript_ruby_lang_version {
            position: relative;
            display: inline-block;
          }
          ._userscript_ruby_lang_version_content {
            display: none;
            position: absolute;
            background-color: white;
            padding: 0 0.5rem;
            left: -0.5rem;
            z-index: 1;
          }
          ._userscript_ruby_lang_version_content a {
            display: block;
            font-weight: unset;
            text-decoration: none;
          }
          ._userscript_ruby_lang_version:hover ._userscript_ruby_lang_version_content {
            display: block;
          }
        `;

        const text = header.innerText;
        const index = text.indexOf(currentVersion);
        header.replaceChildren(
            text.substring(0, index),
            version,
            text.substring(index + currentVersion.length),
            style
        );
    };

    versionSwitcherSetup();
})();
