

let _publicKey;
let _domain;
let _sign;

module.exports = {
    getCertificate:()=>({publicKey:_publicKey,domain:_domain,sign:_sign}),
    setCertificate:(publicKey,domain,sign)=>{
        _publicKey = publicKey;
        _domain = domain;
        _sign = sign;
    }
}