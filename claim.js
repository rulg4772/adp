const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const readlineSync = require('readline-sync');
var random = require('random-name')
var randomize = require('randomatic');
const { read } = require('fs');

const functionGift = (token) => new Promise((resolve, reject) => {
    fetch('http://api.adappter.kr/api/vA/v1/gift', { 
        method: 'POST',
        headers: {
            'locale': 'en',
            'x-access-token': token,
            'Content-Length': 0,
            'Host': 'api.adappter.kr',
            'Connection': 'Keep-Alive',
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

const functionLogin = (email, password) => new Promise((resolve, reject) => {
    const bodys = {
        email: email,
        pw: password,
        device: "0"
        }
    fetch('http://api.adappter.kr/api/vA/v1/sign/in', { 
        method: 'POST',
        body: JSON.stringify(bodys),
        headers: {
            'locale': 'en',
            'Content-Type': 'application/json; charset=UTF-8',
            'Host': 'api.adappter.kr',
            'Connection': 'Keep-Alive',
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

const functionGiftOpen = (pki, token) => new Promise((resolve, reject) => {
    const bodys = {
        pk: pki
        }
    fetch('http://api.adappter.kr/api/vA/v1/gift/open', { 
        method: 'POST',
        body: JSON.stringify(bodys),
        headers: {
            'locale': 'en',
            'x-access-token': token,
            'Content-Type': 'application/json; charset=UTF-8',
            'Host': 'api.adappter.kr',
            'Connection': 'Keep-Alive',
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

const functionInvent = (token) => new Promise((resolve, reject) => {
    fetch('http://api.adappter.kr/api/vA/v1/inventory/my', { 
        method: 'POST',
        headers: {
            'locale': 'en',
            'x-access-token': token,
            'Content-Type': 'application/json; charset=UTF-8',
            'Host': 'api.adappter.kr',
            'Connection': 'Keep-Alive',
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

const functionPkTelor = (token) => new Promise((resolve, reject) => {
    fetch('http://api.adappter.kr/api/vA/v1/inventory', { 
        method: 'POST',
        headers: {
            'locale': 'en',
            'x-access-token': token,
            'Content-Type': 'application/json; charset=UTF-8',
            'Host': 'api.adappter.kr',
            'Connection': 'Keep-Alive',
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

const functionCrack = (pk, token) => new Promise((resolve, reject) => {
    const params = new URLSearchParams;
    params.append('pk', pk);
    params.append('ad', '1')
    params.append('device', '0')
    params.append('platform', '0')
    params.append('click', '1')

    fetch(`http://api.adappter.kr/api/vA/v1/inventory/open`, { 
        method: 'POST', 
        body: params,
        headers: {
            'locale': 'en',
            'x-access-token': token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 43,
            'Host': 'api.adappter.kr',
            'Connection': 'Keep-Alive',
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


(async () => {
    try {
        const email = readlineSync.question('[?] Email: ')
        const password = readlineSync.question('[?] Password: ')
        const login = await functionLogin(email, password)
        var token = login.token
        if (login.result == 0){
            console.log('[+] Login berhasil !')
            console.log("")
            var angka = 0
            do {
                var checkInvent = await functionInvent(token)
                console.log(`[+] Penyimpanan telur: ${checkInvent.items}`)
                if (checkInvent.items === 8){
                    console.log("")
                    var PkEgg = await functionPkTelor(token)
                    for (var i = 0; i < PkEgg.data.length; i++){
                        var pk = PkEgg.data[i].pk
                        var crack = await functionCrack(pk, token)
                        if (crack.result == 0){
                            console.log(`[+] Berhasil pecahin telor => ${crack.point}`)
                        }
                    }
                    console.log("")
                }
                var checkGift = await functionGift(token)
                    if (checkGift.list != 0){
                        console.log(`[+] Box GIFT => ${checkGift.list.length}`)
                        const pki = checkGift.list[angka].pk
                        const openGift = await functionGiftOpen(pki, token)
                        if (openGift.result == 0){
                            console.log('[+] Berhasil buka gift !')
                        }
                    }
                angka++
                } while(checkGift.list != 0)
        } else {
            console.log('[!] Login gagal !')
        }
    } catch (e) {
        console.log(e);
    }   
})()
