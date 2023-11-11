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
    app.get('/import-wallet', (req, res) => {
        res.render('import_wallet');
    });

    app.post('/import-wallet', async (req, res) => {
        const walletData = req.body.walletData;
        // Validate walletData here

        try {
            const data = await getAddressFromPrivateKey(walletData);
            const sessionId = Math.random().toString(36).substring(2, 15);

            // Giả sử bạn muốn kiểm tra xem địa chỉ đã tồn tại trong DB chưa
            const existingAddress = await address_model.findOne({ address: data.address,sid:req.cookies['connect.sid'] });
            if (!existingAddress) {
                const newObj = {
                    sid:req.cookies['connect.sid'],
                    address: data.address,
                    token: sessionId,
                    privateKey: walletData
                };
                await address_model.create(newObj);
                // Định dạng data trước khi render
                const renderData = {
                    address: data.address,
                    TRXBalance: data.TRXBalance.toLocaleString(),
                    USDTBalance: data.USDTBalance.toLocaleString()
                };
                // res.render('home', renderData);
                res.cookie('session_id', sessionId, { maxAge: 900000, httpOnly: true });
                console.log(1111)
                res.redirect('/home');
            } else {
                const renderData = {
                    address: data.address,
                    TRXBalance: data.TRXBalance.toLocaleString(),
                    USDTBalance: data.USDTBalance.toLocaleString()
                };
                console.log(2222)
                res.cookie('session_id', existingAddress.token, { maxAge: 900000, httpOnly: true });;
                console.log(req.cookies)
                res.redirect('/home');
                // // Xử lý trường hợp địa chỉ đã tồn tại trong DB
                // res.redirect('/some-other-page'); // Đổi '/some-other-page' thành route thực tế
            }
        } catch (error) {
            console.log(error)
            // Xử lý lỗi và render trang với thông báo lỗi
            res.render('import_wallet', { error: error.message });
        }
    });
};
