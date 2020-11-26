const fetch = require('node-fetch');
var random = require('random-name')
var randomize = require('randomatic')
const readlineSync = require('readline-sync');
const cheerio = require('cheerio');
const delay = require('delay')

const functionSendOtp = (email) => new Promise((resolve, reject) => {
    const params = new URLSearchParams;
    params.append('email', email);
    params.append('lang', 'en')

    fetch(`http://api.adappter.kr/api/vA/v1/sign/auth/mail_send`, { 
        method: 'POST', 
        body: params,
        headers: {
            'locale': 'en',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'api.adappter.kr',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/4.8.1'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionVerifOtp = (email, otp) => new Promise((resolve, reject) => {
    const params = new URLSearchParams;
    params.append('email', email);
    params.append('a_num', otp)

    fetch(`http://api.adappter.kr/api/vA/v1/sign/auth/mail_check`, { 
        method: 'POST', 
        body: params,
        headers: {
            'locale': 'en',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'api.adappter.kr',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/4.8.1'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionRegist = (email, nick, name, reff) => new Promise((resolve, reject) => {
    const bodys = {
        email:email,
        pw: "Berak321#",
        nick: nick,
        name: name,
        code: reff
        }

    fetch('http://api.adappter.kr/api/vA/v1/sign/up', { 
        method: 'POST', 
        body: JSON.stringify(bodys),
        headers: {
            'locale': 'en',
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': 107,
            'Host': 'api.adappter.kr',
            "Connection": 'Keep-Alive',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/4.8.1'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionGetLink = (nickname) =>
   new Promise((resolve, reject) => {
       fetch(`https://generator.email/`, {
           method: "get",
           headers: {
               'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
               'accept-encoding': 'gzip, deflate, br',
               'accept-language': 'en-US,en;q=0.9',
               'cookie': `_ga=GA1.2.1434039633.1579610017; _gid=GA1.2.374838364.1579610017; _gat=1; surl=mixalo.com%2F${nickname}`,
               'sec-fetch-mode': 'navigate',
               'sec-fetch-site': 'same-origin',
               'upgrade-insecure-requests': 1,
               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'
           }
       })
       .then(res => res.text())
           .then(text => {
               const $ = cheerio.load(text);
               const src = $("h1").text()
               resolve(src);
           })
           .catch(err => reject(err));
   });


(async () => {
    var reff = readlineSync.question('[?] REff: ')
    const jumlah = readlineSync.question('[?] Jumlah reff: ')
    console.log("")
    for (var i = 0; i < jumlah; i++){
    try {
        var nama = random.first()
        const last = random.last()
        var rand = randomize('0', 5)
        var email = `${nama}${rand}@mixalo.com`
        var nick = `${nama}${rand}`
        const name = `${nama}${last}`
        console.log(`[+] Email ${email}`)
        const sendOtp = await functionSendOtp(email)
        if (sendOtp.result == 0){
            console.log('[+] Send OTP sukses !')
            await delay(3000)
            const getOtp = await functionGetLink(`${nama}${rand}`)
            var otp = getOtp.match(/(\d+)/)[0]
            console.log(`[+] OTP ${otp}`)
            const verifOtp = await functionVerifOtp(email, otp)
            if (verifOtp.result == 0){
                console.log('[+] Verif OTP sukses !')
                const regist = await functionRegist(email, nick, name, reff)
                if (regist.result == 0){
                    console.log('[+] Regist sukses !')
                    console.log("")
                } else {
                    console.log('[!] Regist gagal !')
                    console.log("")
                }
            } else {
                console.log('[!] Verif OTP gagal !')
                console.log("")
            }
        } else {
            console.log('[!] Gagal kirim OTP !')
            console.log("")
        }
    } catch (e) {
        console.log(e);
    }   
}
})()