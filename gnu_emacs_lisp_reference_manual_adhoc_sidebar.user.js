// ==UserScript==
// @name         GNU Emacs Lisp Reference Manual Adhoc Sidebar
// @namespace    https://github.com/ysjj/userscript
// @version      0.1
// @description  Adhoc Sidebar for GNU Emacs Lisp Reference Manual
// @author       YAMASHITA,Junji <ysiijj+github@gmail.com>
// @match        https://www.gnu.org/software/emacs/manual/html_node/elisp/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gnu.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const params = new URLSearchParams(location.search);
    if (params.get('_userscript_elisp_sidebar') === '1') return;

    const TOP_URL = location.href + '?_userscript_elisp_sidebar=1';

    const sidebarSetup = () => {
        const frame = document.createElement('iframe');
        frame.name = crypto.randomUUID();
        frame.style.flex = 'auto';
        frame.style.border = 'none';
        frame.src = TOP_URL;

        const content = document.getElementById('content');
        content.style.flex = 'initial';
        const contentStyle = document.createElement('style');
        contentStyle.innerText = `
          #content {
            max-height: 100vh;
            overflow-y: auto;
          }
          #content > p, #content > blockquote {
            display: none;
          }
          table.menu > tbody > tr > td:nth-child(2) {
            display: none;
          }
        `.replaceAll(/^ {8}/mg, '');
        content.append(contentStyle);
        content.querySelectorAll('a').forEach((e, _) => {
            if (e.baseURI === document.baseURI) {
                e.target = frame.name;
            }
        });
        content.querySelector('h1.top ~ table.menu').querySelectorAll('table.menu > tbody > tr > th[colspan="2"]').forEach((e, _) => {
            if (e.innerText === '') e.style.display = 'none';
        });

        const heading = content.querySelector('h1.top');
        const headingText = heading.innerText;
        heading.innerHTML = `<a href="${TOP_URL}" target="${frame.name}">${headingText}</a>`;

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.append(content);
        container.append(frame);

        const body = document.getElementsByTagName('body')[0];
        const bodyStyle = document.createElement('style');
        bodyStyle.innerText = `
          body > hr, body > .header {
            display: none;
          }
        `.replaceAll(/^ {8}/mg, '');
        body.append(bodyStyle);
        body.prepend(container);

        numbering(content);
        detailSetup(content);
    };
    const numbering = (sidebar) => {
        let appendix;
        sidebar.querySelector('h1.top ~ table.menu').querySelectorAll('table.menu > tbody > tr > td:first-child').forEach((e, i) => {
            const anchor = e.querySelector('a');
            const text = anchor.innerText.trim();

            if (text === 'Antinews') {
                appendix = 'A'.charCodeAt(0) - 1;
            }
            if (text !== 'Index') {
                const numbering = document.createElement('span');
                numbering.classList.add('_userscript_elisp_sidebar_numbering');
                numbering.innerText = !appendix ? i + 1 : String.fromCharCode(appendix += 1);
                e.insertBefore(numbering, anchor);
            }
        });

        const style = document.createElement('style');
        style.innerText = `
          span._userscript_elisp_sidebar_numbering {
            display: inline-block;
            min-width: 1rem;
            margin-right: 0.25rem;
            text-align: center;
          }
        `.replaceAll(/^ {8}/mg, '');
        sidebar.append(style);
    };
    const detailSetup = (sidebar) => {
        const details = sidebar.querySelector('h2 ~ table.menu');
        sidebar.querySelector('h2').style.display = 'none';
        details.style.display = 'none';

        const aliases = {
            "Sequences Arrays Vectors": "Sequences, Arrays, and Vectors",
            "Customization": "Customization Settings",
            "Debugging": "Debugging Lisp Programs",
            "Read and Print": "Reading and Printing Lisp Objects",
            "Modes": "Major and Minor Modes",
            "Abbrevs": "Abbrevs and Abbrev Expansion",
            "Display": "Emacs Display",
            "System Interface": "Operating System Interface",
            "Packaging": "Preparing Lisp code for distribution",
            "Tips": "Tips and Conventions",
        };

        let current;
        const groups = {};
        details.querySelectorAll('table.menu > tbody > tr').forEach((e, _) => {
            const heading = e.querySelector('th[colspan="2"]');
            if (heading) {
                groups[heading.innerText.trim()] = current = [];
            } else {
                current.push(e.querySelector('td:first-child > a'));
            }
        });

        const groupSetup = (container) => {
            const anchor = container.querySelector('a');
            const text = anchor.innerText.trim();
            const items = groups[aliases[text] || text];

            if (!items) {
                container.classList.add('_userscript_elisp_sidebar_group_single');
                return;
            }

            container.classList.add('_userscript_elisp_sidebar_group_parent', '_userscript_elisp_sidebar_group_collapsed');

            const numbering = container.querySelector('._userscript_elisp_sidebar_numbering')
            numbering.addEventListener('click', (evt) => container.classList.toggle('_userscript_elisp_sidebar_group_collapsed'));

            const itemsContainer = document.createElement('ul');
            itemsContainer.classList.add('_userscript_elisp_sidebar_group_items');
            items.forEach((e, i) => {
                const childNumbering = document.createElement('span');
                childNumbering.classList.add('_userscript_elisp_sidebar_numbering');
                childNumbering.innerText = `${numbering.innerText}.${i+1}`;

                const itemContainer = document.createElement('li');
                itemContainer.classList.add('_userscript_elisp_sidebar_group_item');
                itemContainer.append(childNumbering);
                itemContainer.append(e);
                itemsContainer.append(itemContainer);
                groupSetup(itemContainer);
            });
            container.append(itemsContainer);
        };
        sidebar.querySelector('h1.top ~ table.menu').querySelectorAll('table.menu > tbody > tr > td:first-child').forEach((e, _) => groupSetup(e));

        const style = document.createElement('style');
        style.innerText = `
          ._userscript_elisp_sidebar_group_single::before {
            content: " ";
            padding-right: 0.25rem;
          }
          ._userscript_elisp_sidebar_group_parent::before {
            content: "\\02c5";
            padding-right: 0;
            font-size: 70%;
            vertical-align: 5%;
          }
          ._userscript_elisp_sidebar_group_parent._userscript_elisp_sidebar_group_collapsed::before {
            content: "\\00bb";
            vertical-align: 15%;
          }
          ._userscript_elisp_sidebar_group_collapsed
          ._userscript_elisp_sidebar_group_items {
            display: none;
          }
          ._userscript_elisp_sidebar_group_items {
            list-style: none;
          }
          li._userscript_elisp_sidebar_group_item {
            line-height: 1em;
          }
        `.replaceAll(/^ {8}/mg, '');
        sidebar.append(style);
    };

    sidebarSetup();
})();
