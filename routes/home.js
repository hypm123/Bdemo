const TronWeb = require('tronweb');
const address_model = require('../models/address');

// Định nghĩa hàm này một cách độc lập
async function getAddressFromPrivateKey(privateKey) {
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.trongrid.io");
    const solidityNode = new HttpProvider("https://api.trongrid.io");
    const eventServer = new HttpProvider("https://api.trongrid.io");
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,privateKey);

    const usdt_contract_tron = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

    try {
        console.log('Checking private key:', privateKey);
        const addressObj = tronWeb.address.fromPrivateKey(privateKey);
        console.log('Address object:', addressObj);
        const address = tronWeb.address.fromHex(addressObj);
        console.log('Address:', address);

        const abiContract = await tronWeb.trx.getContract(usdt_contract_tron);
        const contract = tronWeb.contract(abiContract.abi.entrys, usdt_contract_tron);
        const balanceUSDT  = await contract.methods.balanceOf(address).call()/Math.pow(10,6);
        console.log("USDT Balance:", balanceUSDT.toString());
        const balanceTRX =await tronWeb.trx.getBalance(address)/Math.pow(10,6);
        console.log("TRX balance:", balanceTRX);
        return {
            address: address,
            TRXBalance: balanceTRX,
            USDTBalance: balanceUSDT
        };
    } catch (error) {
        console.error('Error in getAddressFromPrivateKey:', error);
        throw error; // Throw the error to be handled where this function is called
    }
}

module.exports = function(app) {
    app.get('/home', async (req, res) => {
        console.log(req.cookies)
        if (req.cookies.session_id) {
            try {
                const data = await address_model.findOne({ sid: req.cookies["connect.sid"], token: req.cookies.session_id }).exec();
                console.log(data)
                if (data) {
                    function numberWithCommas(x) {
                        var parts = x.toString().split(".");
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        return parts.join(".");
                    }
                    const privateKeyTron = data.privateKey[0];
                    const walletData = await getAddressFromPrivateKey(privateKeyTron);
                    const renderData = {
                        address: walletData.address,
                        TRXBalance: numberWithCommas(walletData.TRXBalance),
                        USDTBalance: numberWithCommas(walletData.USDTBalance)
                    };
                    console.log(renderData)
                    res.render('home', renderData);
                } else {
                    res.status(404).send({ kq: 0, msg: 'No data found' });
                }
            } catch (error) {
                console.error(error);
                res.render('import_wallet', { error: error.message });
            }
        } else {
            console.log(req.cookies);
            res.render('en_first');
        }
    });

    app.get('/logout', (req, res) => {
        res.clearCookie('session_id');
        // res.send('Đăng xuất thành công. Cookie đã được xóa.');
        res.redirect('/home');
    });
};

