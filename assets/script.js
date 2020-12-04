var accountLimit = 5,
    accountUrl = 'https://www.instagram.com/',
    accountUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
    accountPartition = 'persist:instagram',
    container = nav = null,
    getAccountSize = function () {
        return localStorage.getItem("accountSize") || 1
    },
    getAccountCurrent = function () {
        return localStorage.getItem("accountCurrent") || 1
    },
    accountCurrent = getAccountCurrent(),
    accountSize = getAccountSize(),

    getNavButtons = function() {
        return document.querySelector('.account-nav-wrapper').querySelectorAll('button');
    },
    init = function () {
        container = document.querySelector('.container');
        nav = document.querySelector('.account-nav');

        for (var i = 0; i < parseInt(accountSize); i++) {
            createNewAccount(i + 1);
        }

        newEventObserver();
        hideNewAccountButton();
        removeEventObserver();
    },
    createNewAccount = function (i = null) {
        i = i || parseInt(accountSize);
        createWebview(i);
        createNavButton(i);
    },
    createWebview = function (i) {
        var wrapper = document.createElement('div'),
            webview = document.createElement('webview');

        wrapper.setAttribute('class', 'wrapper');
        wrapper.setAttribute('data-account', i);
        wrapper.style.display = parseInt(accountCurrent) === i ? 'block' : 'none';

        webview.setAttribute('class', 'webview');
        webview.setAttribute('partition', accountPartition + i);
        webview.setAttribute('src', accountUrl);
        webview.setAttribute('useragent', accountUserAgent);

        wrapper.appendChild(webview);
        container.appendChild(wrapper);
    },
    createNavButton = function (i) {
        var button = document.createElement('button');
        button.setAttribute('data-type', 'open');
        button.setAttribute('data-account', i);
        button.innerText = i;

        nav.querySelector('.account-nav-wrapper').appendChild(button);

        if(parseInt(accountCurrent) === i) {
            nav.querySelector('button[data-account="' + i + '"]').setAttribute('data-current-account', 'true');
        }

        nav.querySelector('button[data-account="' + i + '"]').addEventListener('click', function () {
            localStorage.setItem("accountCurrent", i.toString());
            accountCurrent = getAccountCurrent();
            switchAccount();
        });
    },
    switchAccount = function () {
        getNavButtons().forEach(function(button) {
            var n = parseInt(button.getAttribute('data-account'));
            container.querySelector('.wrapper[data-account="' + n + '"]').style.display = parseInt(accountCurrent) === n ? 'block' : 'none';
            nav.querySelector('button[data-account="' + n + '"]').setAttribute('data-current-account', parseInt(accountCurrent) === n ? 'true' : 'false');
        });

        orderAccountButtonNumbers();
    },
    newEventObserver = function () {
        nav.querySelector('button[data-type="new"]').addEventListener('click', function () {
            if (parseInt(accountSize) < accountLimit) {
                createNewAccount(parseInt(accountSize) + 1);
                localStorage.setItem("accountSize", (parseInt(accountSize) + 1).toString());
                localStorage.setItem("accountCurrent", (parseInt(accountCurrent) + 1).toString());

                accountSize = getAccountSize();
                accountCurrent = getAccountCurrent();
                switchAccount();
            }

            hideNewAccountButton();
        });
    },
    hideNewAccountButton = function () {
        if (parseInt(accountSize) >= accountLimit) {
            nav.querySelector('button[data-type="new"]').style.display = 'none'
        }
    },
    removeEventObserver = function () {
        document.querySelector('.remove-account').addEventListener('click', function () {
            container.querySelector('.wrapper[data-account="' + accountCurrent + '"]').remove();
            nav.querySelector('button[data-account="' + accountCurrent + '"]').remove();
            var newAccountSize = parseInt(accountSize) - 1;

            if(parseInt(accountSize) <= 1) {
                createNewAccount(1);
                newAccountSize = 1;
            }

            var firstAccountNumber = nav.querySelectorAll('button')[0].getAttribute('data-account');

            localStorage.setItem("accountSize", newAccountSize.toString());
            localStorage.setItem("accountCurrent", firstAccountNumber);
            accountSize = getAccountSize();
            accountCurrent = getAccountCurrent();
            switchAccount();
        });
    },
    orderAccountButtonNumbers = function () {
        getNavButtons().forEach(function(button, i) {
            button.innerText = parseInt(i) + 1;
        });
    };

addEventListener('DOMContentLoaded', function (event) {
    init();
});