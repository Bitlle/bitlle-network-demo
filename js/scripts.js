const contractAbi = '[{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"txHash","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_msg","type":"bytes"},{"name":"_from","type":"address"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"wrapVerify","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"val","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address[]"},{"name":"_value","type":"uint256[]"},{"name":"_fee","type":"uint256[]"},{"name":"_unxTime","type":"uint256[]"},{"name":"_v","type":"uint8[]"},{"name":"_r","type":"bytes32[]"},{"name":"_s","type":"bytes32[]"}],"name":"multiTransferFor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_fee","type":"uint256"},{"name":"_unxTime","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"transferFor","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"KillMe","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_fee","type":"uint256"},{"name":"_nonce","type":"uint256"}],"name":"GetHashMessage","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_hashMsg","type":"bytes32"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"getSigner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"pure","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';
const contractAddr = '0x87f3453110179620D5d816d8fDD139699955d1C3';
const apiUrl = '/api';
const feePercent = 0.01;
const ticker = 'LT';
const publicRPC = 'https://ropsten.infura.io/metamask';
let typeAuth,
    address,
    contract,
    eth,
    decimals;

let metamaskProvider = null;

if (typeof web3 !== 'undefined' && web3.currentProvider !== 'undefined' && web3.currentProvider.isMetaMask === true) {
    metamaskProvider = web3.currentProvider;
}

const apiRequest = (url, type = 'GET', data) => {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.timeout = 10000;
        req.open(type, apiUrl + url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onload = () => req.status === 200 ? resolve(JSON.parse(req.response)) : (req.status === 400 ? reject(JSON.parse(req.response)) : reject(req.statusText));
        req.onerror = (e) => reject(e);
        if (data)
            req.send(JSON.stringify(data));
        else
            req.send(data);
    });
};

const closeModal = () => {
    if (document.querySelector('#modal') !== null) {
        document.querySelector('#modal').classList.remove('md-show');

        setTimeout(() => {
            document.querySelector('#modal').remove();
            document.querySelector('.md-overlay').remove();
            document.querySelector('.content').classList.remove("blur");
        }, 400);
    }
};

const showModal = (description, close = false) => {
    let container = document.createElement('div');
    container.className = "md-modal md-effect-1";
    container.id = "modal";

    let overlay = document.createElement('div');
    overlay.className = "md-overlay";

    let html = `<div class="md-content"><div><p>` + description +
        `</p>` + (close === true ? '<br/><button class="btn btn__default modalClose">Close</button>' : '') +
        `</div></div></div>`;

    if (document.querySelector('#modal') === null) {
        document.body.appendChild(container);
        document.body.appendChild(overlay);
    }

    document.querySelector('#modal').innerHTML = html;

    setTimeout(() => {
        document.querySelector('#modal').classList.add('md-show');
        document.querySelector('.content').classList.add("blur");

        if (close) {
            let modalClose = document.querySelectorAll('.modalClose');

            for (let i = 0; i < modalClose.length; i++) {
                modalClose[i].addEventListener('click', (event) => {
                    event.preventDefault();
                    closeModal();
                    document.querySelector('.modalClose').removeEventListener('click', () => {
                    });
                });
            }
        }
    }, 100);

    return false;
};

const printHtml = (selector, html) => document.querySelector(selector).innerHTML = html;

const markTypeAuth = (num) => {
    document.querySelector('.non-authorized__types > li:nth-child(' + num + ') input').checked = true;

    let elem = document.querySelectorAll('.non-authorized__item > .tab__content');
    for (let i = 0; i < elem.length; i++) {
        let e = elem[i];
        e.classList.remove('tab__active');
    }

    document.querySelector('.non-authorized__item > .tab__content:nth-child(' + num + ')').classList.add('tab__active');
};

const updateBalance = () => {
    web3.eth.getBalance(address, function (err, balance) {
        if (!err)
            printHtml('#eth-balance', web3.fromWei(balance).toNumber().toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + ' <span class="ethblock__small">ETH</span>');
    });
    contract.balanceOf(address, function (err, balance) {
        if (!err)
            printHtml('#lt-balance', web3.fromWei(balance).toNumber().toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + ' <span class="ethblock__small">LT</span>');
    });
};

const init = () => {
    console.log('Start auth');

    typeAuth = Cookies.get('authType');
    let metamaskTimerId = false;
    let metamaskActive = false;

    const auth = () => {
        let tabBtns = document.querySelectorAll('.tab__btn');

        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].addEventListener('click', function (event) {
                let tabContent = document.querySelectorAll('.tab__content');

                for (let i = 0; i < tabContent.length; i++) {
                    tabContent[i].style.display = 'none';
                }
                document.querySelector('#' + tabBtns[i].getAttribute('data-tab')).style.display = 'block';
            });
        }

        authWithMetamask.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('web3');
            console.log(web3);
            console.log('web3.currentProvider');
            console.log(web3.currentProvider);
            console.log('web3.currentProvider.isMetaMask');
            console.log(metamaskProvider);

            btnLoading(document.querySelector('#authWithMetamask'));

            if (typeof web3 !== 'undefined') {
                web3 = new Web3(metamaskProvider);
                if (web3.currentProvider !== 'undefined' && web3.currentProvider.isMetaMask === true) {
                    console.log('Metamask is found');

                    web3.version.getNetwork((err, netId) => {
                        if (parseInt(netId) === 3 && web3.eth.defaultAccount) {
                            address = web3.eth.defaultAccount;
                            Cookies.set('authType', 'metamask', {expires: 1});
                            console.log('Account address:' + address);

                            btnLoading(document.querySelector('#authWithMetamask'), 'stop');
                            metamaskActive = true;
                            start();
                        }
                        else {
                            metamaskActive = false;
                            btnLoading(document.querySelector('#authWithMetamask'), 'stop');
                            showModal('Please login to MetaMask and select Ropsten Testnet', true);
                        }
                    });
                }
                else {
                    console.log('Metamask not found');
                    metamaskActive = false;
                    btnLoading(document.querySelector('#authWithMetamask'), 'stop');
                    showModal('Please install Metamask <a href="https://metamask.io" target="_blank">https://metamask.io</a>', true);
                }
            }
            else {
                console.log('Metamask not found');
                metamaskActive = false;
                btnLoading(document.querySelector('#authWithMetamask'), 'stop');
                showModal('Please install Metamask <a href="https://metamask.io" target="_blank">https://metamask.io</a>', true);
            }
        });

        authWithPrivateKey.addEventListener('click', function (event) {
            event.preventDefault();
            let parent = document.querySelector('#authWithPrivateKey').parentNode.parentNode;
            let privateKeyUser = parent.querySelector('#inputPrivateKey').value;

            btnLoading(document.querySelector('#authWithPrivateKey'));

            if (privateKeyUser) {
                if (privateKeyUser.length === 64 || privateKeyUser.length === 66) {
                    web3 = new Web3();
                    web3.setProvider(new web3.providers.HttpProvider(publicRPC, 5000));

                    if (web3.isConnected()) {
                        let clientAddress = ethUtil.privateToAddress((privateKeyUser.length === 64 ? '0x' : '') + privateKeyUser);
                        address = "0x" + clientAddress.toString('hex');

                        Cookies.set('authType', 'privateKey', {expires: 1});
                        Cookies.set('privateKey', privateKeyUser, {expires: 1});

                        window.scrollTo(0, 0);

                        btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
                        start();
                    }
                    else {
                        showModal('Could not connected to RPC', true);
                        btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
                    }
                }
                else {
                    showModal('Private Key length is invalid', true);
                    btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
                }
            }
            else {
                showModal('Please enter the Private Key', true);
                btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
            }
        });

        authWithPassword.addEventListener('click', function (event) {
            event.preventDefault();
            const parent = document.querySelector('#authWithPassword').parentNode.parentNode;
            const passwordUser = parent.querySelector('#inputPassword').value;

            btnLoading(document.querySelector('#authWithPassword'));

            if (passwordUser) {
                web3 = new Web3();
                web3.setProvider(new web3.providers.HttpProvider(publicRPC, 5000));

                if (web3.isConnected()) {
                    const PrivateKeyUser = web3.sha3(passwordUser, "BitlleSecreT");
                    const clientAddress = ethUtil.privateToAddress(PrivateKeyUser);
                    address = "0x" + clientAddress.toString('hex');

                    Cookies.set('authType', 'password', {expires: 1});
                    Cookies.set('password', passwordUser, {expires: 1});

                    window.scrollTo(0, 0);

                    btnLoading(document.querySelector('#authWithPassword'), 'stop');
                    start();
                }
                else {
                    showModal('Could not connected to RPC', true);
                    btnLoading(document.querySelector('#authWithPassword'), 'stop');
                }
            }
            else {
                showModal('Please enter the Password', true);
                btnLoading(document.querySelector('#authWithPassword'), 'stop');
            }
        });

        logout.addEventListener('click', function (event) {
            event.preventDefault();

            Cookies.remove('privateKey');
            Cookies.remove('password');
            Cookies.set('authType', 'startScreen', {expires: 1});

            document.querySelector('.non-authorized').style.display = 'block';
            document.querySelector('.authorized').style.display = 'none';
        });
    };

    const connection = () => {
        return new Promise(function (resolve, reject) {
            metamaskActive = false;

            if (typeAuth === 'startScreen') {
                document.querySelector('.non-authorized').style.display = 'block';
                document.querySelector('.authorized').style.display = 'none';

                return resolve('startScreen');
            }
            else if (typeAuth === 'privateKey') {
                let privateKeyUser = Cookies.get('privateKey');

                markTypeAuth(2);

                btnLoading(document.querySelector('#authWithPrivateKey'));
                if (privateKeyUser !== undefined) {
                    if (privateKeyUser.length === 64 || privateKeyUser.length === 66) {

                        setTimeout(() => {
                            web3 = new Web3();
                            web3.setProvider(new web3.providers.HttpProvider(publicRPC));

                            if (web3.isConnected()) {
                                let clientAddress = ethUtil.privateToAddress((privateKeyUser.length === 64 ? '0x' : '') + privateKeyUser);
                                const clientStringAddress = "0x" + clientAddress.toString('hex');

                                Cookies.set('authType', 'privateKey', {expires: 1});
                                Cookies.set('privateKey', privateKeyUser, {expires: 1});
                                typeAuth = 'privateKey';

                                web3.version.getNetwork((err, netId) => {
                                    if (parseInt(netId) === 3 && clientStringAddress) {
                                        address = clientStringAddress;
                                        console.log('ETH address:' + address);

                                        btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
                                        return resolve('privateKey');
                                    }
                                    else {
                                        btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
                                        return reject('Please use the Ropsten Testnet');
                                    }
                                });
                            }
                            else {
                                btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
                                return reject('Could not connected to RPC');
                            }
                        }, 100);
                    }
                    else {
                        btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
                        return reject('Private Key length is invalid');
                    }
                }
                else {
                    btnLoading(document.querySelector('#authWithPrivateKey'), 'stop');
                    return reject();
                }
            }
            else if (typeAuth === 'password') {
                const passwordUser = Cookies.get('password');

                markTypeAuth(3);

                btnLoading(document.querySelector('#authWithPassword'));

                if (passwordUser !== undefined) {
                    setTimeout(() => {
                        web3 = new Web3();
                        web3.setProvider(new web3.providers.HttpProvider(publicRPC));

                        if (web3.isConnected()) {
                            const privateKeyUser = web3.sha3(passwordUser, "BitlleSecreT");
                            const clientAddress = ethUtil.privateToAddress((privateKeyUser.length === 64 ? '0x' : '') + privateKeyUser);
                            const clientStringAddress = "0x" + clientAddress.toString('hex');

                            Cookies.set('authType', 'password', {expires: 1});
                            typeAuth = 'password';

                            web3.version.getNetwork((err, netId) => {
                                if (parseInt(netId) === 3 && clientStringAddress) {
                                    address = clientStringAddress;
                                    console.log('ETH address:' + address);

                                    btnLoading(document.querySelector('#authWithPassword'), 'stop');
                                    return resolve('password');
                                }
                                else {
                                    return reject('Please use the Ropsten Testnet');
                                }
                            });
                        }
                        else {
                            return reject('Not connected to RPC');
                        }
                    }, 100);
                }
                else {
                    return reject('Password length is invalid');
                }
            }
            else {
                if (device.mobile()) {
                    document.querySelector('.non-authorized__types > li:nth-child(2) input').checked = true;
                    document.querySelector('.non-authorized__item:nth-child(2) > .tab__content:nth-child(1)').classList.remove('tab__active');
                    document.querySelector('.non-authorized__item:nth-child(2) > .tab__content:nth-child(2)').classList.add('tab__active');
                }

                if (device.desktop()) {
                    if (typeof web3 !== 'undefined' && web3.currentProvider !== 'undefined' && web3.currentProvider.isMetaMask === true) {

                        setTimeout(() => {
                            web3 = new Web3(web3.currentProvider);
                            console.log('Metamask is found');

                            Cookies.set('authType', 'metamask', {expires: 1});
                            typeAuth = 'metamask';

                            web3.version.getNetwork((err, netId) => {
                                if (parseInt(netId) === 3 && web3.eth.defaultAccount) {
                                    address = web3.eth.defaultAccount;
                                    console.log('Account address:' + address);

                                    metamaskActive = true;
                                    btnLoading(document.querySelector('#authWithMetamask'), 'stop');
                                    return resolve('metamask');
                                }
                                else {
                                    btnLoading(document.querySelector('#authWithMetamask'), 'stop');
                                    return reject('Please login to MetaMask and select Ropsten Testnet');
                                }
                            });
                        }, 100);
                    }
                    else {
                        return reject('Please install Metamask <a href="https://metamask.io" target="_blank">https://metamask.io</a><br/>or</br/> Enter your <a href="" class="modalClose" onclick="markTypeAuth(2)">Private Key</a>');
                    }
                }
            }
        });
    };

    const initSettings = () => {
        eth = new Eth(web3.currentProvider);
        contract = web3.eth.contract(JSON.parse(contractAbi)).at(contractAddr);

        contract.decimals(function (err, dec) {
            if (!err)
                decimals = dec.toNumber();
        });

        updateBalance();

        printHtml('#feePercent', feePercent * 100 + '%');
        printHtml('#ethAddress', '<a href="https://ropsten.etherscan.io/address/' + address + '" target="_blank">' + address + '</a>');

        console.log('get settings');
    };

    const metamaskCheck = () => {
        console.log('metamask checker start');

        metamaskTimerId = setInterval(function () {
            typeAuth = Cookies.get('authType');
            if (typeAuth === 'metamask' && metamaskActive === true) {
                console.log('metamask checker reload');

                if (typeof web3 !== 'undefined' && web3.currentProvider !== 'undefined' && web3.currentProvider.isMetaMask === true) {
                    web3 = new Web3(web3.currentProvider);
                    console.log('Metamask is found');

                    Cookies.set('authType', 'metamask', {expires: 1});
                    typeAuth = 'metamask';

                    web3.version.getNetwork((err, netId) => {
                        if (parseInt(netId) === 3 && web3.eth.defaultAccount) {
                            address = web3.eth.defaultAccount;
                            console.log('Account address:' + address);

                            btnLoading(document.querySelector('#authWithMetamask'), 'stop');
                            start();
                        }
                        else {
                            btnLoading(document.querySelector('#authWithMetamask'), 'stop');
                            return showModal('Please login to MetaMask and select Ropsten Testnet', true);
                        }
                    });
                }
            }
        }, 3000);
    };

    const start = () => {
        initSettings();
        startApp();
        transactions();
    };

    connection()
        .then((type) => {
            closeModal();
            if (type !== 'startScreen') {
                start();
            }
        })
        .catch((err) => {
            console.log('err');
            console.log(err);
            if (err) showModal(err, true);
        });

    auth();
    metamaskCheck();
};

const btnLoading = (object, type = 'start') => {
    if (object) {
        if (type === 'stop') {
            object.classList.remove('btn-loading');
            object.removeAttribute('disabled');
        }
        else {
            object.classList.add('btn-loading');
            object.setAttribute('disabled', 'disabled');
        }
    }
};

const transactions = () => {
    let html = '';

    printHtml('.transactions__notfound', '');

    const getTransaction = (tx => {
        return new Promise(function (resolve, reject) {
            web3.eth.getTransaction(tx, function (err, response) {
                if (err) {
                    reject(err);
                }
                else {
                    if (typeof response === 'object') {
                        if (response.blockNumber !== null && response.blockNumber) {
                            resolve(response.gas);
                        }
                        else {
                            reject('Transaction ' + tx + ' is pending');
                        }
                    }
                    else {
                        reject('Unknown answer');
                    }
                }
            });
        });
    });

    const updateTransactionStatus = () => {
        let timerId = setInterval(() => {
            let pendingTransactions = document.querySelectorAll('.transactions__pending');
            let queueTransactions = document.querySelectorAll('.transactions__queue');

            [].forEach.call(pendingTransactions, (item) => {
                let tx = item.querySelector('.transactions__tx').getElementsByTagName('a')[0].text;
                let id = item.querySelector('.transactions__created').getAttribute('data-id');
                let msg = item.querySelector('.transactions__created').getAttribute('data-msg');
                let from = item.querySelector('.transactions__created').getAttribute('data-from');

                getTransaction(tx)
                    .then((gas) => {
                        web3.eth.getTransactionReceipt(tx, (err, receipt) => {
                            if (!err) {
                                if (receipt.status === '0x1') {
                                    item.classList.remove('transactions__pending');

                                    contract.txHash(msg, (err, exist) => {
                                        if (exist) {
                                            updateBalance();
                                        }
                                        else {
                                            item.classList.add('transactions__rejected');
                                        }
                                    });

                                    apiRequest('/transactions/' + id, 'PUT', {'status': 'approved'})
                                        .then((response) => {
                                            if (response !== 'undefined' && response.status !== 'undefined' && response.status === 'success') {
                                                item.querySelector('.transactions__created').innerHTML = item.querySelector('.transactions__created').getAttribute('data-created');
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });

                                }
                            }
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });

            [].forEach.call(queueTransactions, (item) => {
                let id = item.querySelector('.transactions__created').getAttribute('data-id');

                apiRequest('/transactions/' + id, 'GET')
                    .then((response) => {
                        if (response !== 'undefined' && response.status !== 'undefined' && response.status === 'success') {
                            if (response.items && response.items.length === 1 && response.items[0].hash) {
                                item.querySelector('.transactions__tx').innerHTML = '<a href="https://ropsten.etherscan.io/tx/' + response.items[0].hash + '" target="_blank">' + response.items[0].hash + '</a>';
                                item.classList.remove('transactions__queue');
                                item.classList.add('transactions__pending');
                                item.querySelector('.transactions__created').innerHTML = 'pending';
                                item.querySelector('.transactions__created').setAttribute('data-msg', response.items[0].msg);

                                updateTransactionStatus();
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            });
        }, 5000);
    };

    apiRequest('/account/' + address)
        .then((response) => {
            if (response.items && response.items.length > 0) {
                const transactions = (response.items);

                transactions.forEach((item, i, arr) => {
                    let date = new Date(item.created);
                    html += '<tr' + (item.status === 'pending' ? ' class="transactions__pending"' : (item.status === 'queue' ? ' class="transactions__queue"' : (item.status === 'rejected' ? ' class="transactions__rejected"' : (item.status === 'double' ? ' class="transactions__double"' : '')))) + ' title="' + item.status + '">' +
                        '<td class="transactions__created" data-id="' + item.id + '" data-msg="' + item.msg + '" data-from="' + item.address_from + '" data-created="' + date.toLocaleString() + '">' + (item.status === 'pending' ? 'pending' : (item.status === 'queue' ? 'queue' : date.toLocaleString())) + '</td>' +
                        '<td class="transactions__amount">' + (item.amount ? (item.amount - 0).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + ' ' + ticker : '-') + '</td>' +
                        '<td class="transactions__fee">' + (item.fee ? (item.fee - 0).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + ' ' + ticker : '-') + '</td>' +
                        '<td class="transactions__type">' + (item.type ? item.type : '-') + '</td>' +
                        '<td class="transactions__tx">' + (item.hash ? '<a href="https://ropsten.etherscan.io/tx/' + item.hash + '" target="_blank">' + item.hash + '</a>' : '') + '</td>' +
                        '</tr>';
                });

                printHtml('#transactions', html);
                document.querySelector('.transactions__table').style.display = 'table';

                if (transactions.length > 5) {
                    document.querySelector('.transactions__footer').style.display = 'block';

                    showAllTransactions.addEventListener('click', (event) => {
                        event.preventDefault();
                        document.querySelector('.transactions__table').classList.remove('transactions__show5');
                        document.querySelector('.transactions__footer').remove();
                    });
                }

                updateTransactionStatus();
            }
            else {
                html = 'Transactions missing';
                printHtml('.transactions__notfound', html);

                showModal('To try our demo you need Test Loyalty Tokens (LT) <br/><br/><button class="btn btn__default" id="depositBtnPopup">Get <span class="text__big">100 LT</span></button>');

                depositBtnPopup.addEventListener('click', (event) => {
                    event.preventDefault();
                    depositAccount(document.querySelector('#depositBtnPopup'));
                });
            }
            if (document.querySelector('#transactionsPreloader') !== null) {
                document.querySelector('#transactionsPreloader').remove();
            }
        })
        .catch((err) => {
            // html = 'Transactions missing';
            // printHtml('.transactions__notfound', html);


            if (document.querySelector('#transactionsPreloader') !== null) {
                document.querySelector('#transactionsPreloader').remove();
            }
        });
};

const depositAccount = (btnObject) => {
    const _to = address;

    if (!_to) showModal("Enter receiver's address", true);
    else if (!web3.isAddress(_to)) showModal("Incorrect receiver’s address", true);

    btnLoading(btnObject);

    apiRequest('/deposit', 'POST', {"to": _to})
        .then((response) => {
            if (response.success !== 'undefined') {
                showModal(response.description, true);
                transactions();
            }
            else if (response.error) {
                showModal(response.error, true);
            }
            btnLoading(btnObject, 'stop');
        })
        .catch((err) => {
            showModal(err, true);
            btnLoading(btnObject, 'stop');
        });
};

const startApp = () => {
    console.log('start demo app..');

    document.querySelector('.non-authorized').style.display = 'none';
    document.querySelector('.authorized').style.display = 'block';

    inputAmount.addEventListener('keyup', (event) => {
        const _value = document.querySelector('#inputAmount').value;
        const fee = _value * feePercent;

        printHtml('#labelFee', fee.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + ' ' + ticker);
        document.querySelector('#inputFee').value = fee;
    });

    depositBtn.addEventListener('click', (event) => {
        event.preventDefault();

        depositAccount(document.querySelector('#depositBtn'));
    });

    sendLTForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const _from = address;
        const _to = document.querySelector('#inputAddress').value;
        const _value = document.querySelector('#inputAmount').value;
        const _fee = document.querySelector('#inputFee').value;
        const _nonce = Date.now();

        if (!_to) return showModal('Please enter Recepient address', true);
        else if (!web3.isAddress(_to)) return showModal('Recepient address is not valid', true);

        if (!_value) return showModal('Please enter the amount', true);

        btnLoading(document.querySelector('#transferBtn'));

        contract.balanceOf(_from, (err, balance) => {
            balance = web3.fromWei(balance.toString());

            if (!balance || parseFloat(balance) < 0) {
                btnLoading(document.querySelector('#transferBtn'), 'stop');

                return showModal('Insufficient funds', true);
            }
            else if (parseFloat(balance) < parseFloat(parseFloat(_value) + parseFloat(_fee))) {
                btnLoading(document.querySelector('#transferBtn'), 'stop');

                return showModal('Insufficient funds', true);
            }
            else {
                let value = _value * Math.pow(10, decimals);
                let fee = _fee * Math.pow(10, decimals);

                contract.GetHashMessage(_to.toString(), value, fee, _nonce.toString(), (err, msg) => {
                    console.log('msg');
                    console.log(msg);
                    console.log(typeof msg);
                    console.log('----------');

                    if (!err) {
                        if (typeAuth === 'metamask') {
                            let ethMsg = ethUtil.bufferToHex(msg);
                            eth.personal_sign(ethMsg, _from, (err, signature) => {
                                if (!err) {

                                    apiRequest('/transactions', 'POST', {
                                        "from": _from,
                                        "to": _to,
                                        "value": _value,
                                        "fee": _fee,
                                        "nonce": _nonce.toString(),
                                        "signature": signature,
                                    })
                                        .then((response) => {
                                            if (response.success !== 'undefined') {
                                                showModal(response.description, true);
                                                transactions();
                                            }

                                            btnLoading(document.querySelector('#transferBtn'), 'stop');
                                        })
                                        .catch((err) => {
                                            if (typeof err.error === 'object') {
                                                showModal(err.error.join(','), true);
                                            }
                                            else
                                                showModal(err, true);

                                            btnLoading(document.querySelector('#transferBtn'), 'stop');
                                        });
                                }
                                else {
                                    btnLoading(document.querySelector('#transferBtn'), 'stop');

                                    return showModal(err, true);
                                }
                            });
                        }
                        else {
                            let passwordUser = Cookies.get('password');
                            let privateKeyUser = Cookies.get('privateKey');

                            if (typeAuth === 'undefined') {
                                typeAuth = Cookies.get('authType');
                            }

                            if (typeAuth === 'password') {
                                const passwordUser = Cookies.get('password');

                                if (passwordUser !== undefined) {
                                    privateKeyUser = web3.sha3(passwordUser, "BitlleSecreT");
                                }
                            }
                            else if (typeAuth === 'privateKey') {
                                privateKeyUser = Cookies.get('privateKey');
                            }
                            else {
                                if (privateKeyUser === 'undefined') {
                                    if (passwordUser !== 'undefined') {
                                        privateKeyUser = web3.sha3(passwordUser, "BitlleSecreT");
                                    }
                                }
                            }

                            if (privateKeyUser) {
                                privateKeyUser = privateKeyUser.length === 66 ? privateKeyUser.slice(2) : privateKeyUser;
                                let pkInBuffer = new Buffer(privateKeyUser, 'hex');
                                let ethMsg = ethUtil.hashPersonalMessage(new Buffer(msg.slice(2), 'hex'));
                                const {r, s, v} = ethUtil.ecsign(ethMsg, pkInBuffer);
                                const signature = ethUtil.bufferToHex(Buffer.concat([r, s, Buffer.from([v])]));

                                apiRequest('/transactions', 'POST', {
                                    "from": _from,
                                    "to": _to,
                                    "value": _value,
                                    "fee": _fee,
                                    "nonce": _nonce.toString(),
                                    "signature": signature
                                })
                                    .then((response) => {
                                        if (response.success !== 'undefined') {
                                            showModal(response.description, true);
                                            transactions();
                                        }

                                        btnLoading(document.querySelector('#transferBtn'), 'stop');
                                    })
                                    .catch((err) => {
                                        if (typeof err.error === 'object')
                                            showModal(err.error.join(','), true);
                                        else
                                            showModal(err, true);

                                        btnLoading(document.querySelector('#transferBtn'), 'stop');
                                    });
                            }
                            else {
                                btnLoading(document.querySelector('#transferBtn'), 'stop');
                                return showModal('Not Found Private Key or Password.<br/>Please reload page', true);
                            }
                        }
                    }
                    else {
                        btnLoading(document.querySelector('#transferBtn'), 'stop');

                        return showModal(err, true);
                    }
                });
            }
        });
    });
};

window.onload = init();