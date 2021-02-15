const crypto = require('crypto') 

const hash = crypto.getHashes(); // returns different hash options
// console.log(hash) //e.g. MD5, SHA-1, SHA-2

const msg = "Lets meet at midnight under the clock"
const msg2 = "lets meet at midnight under the clock"

// SHA-1
// The password hash is the final 8 bytes of the resulting string, converted to printable hexadecimal format
const hashMsgSHA1 = crypto.createHash('sha1').update(msg).digest('hex'); 
const hashMsg2SHA1 = crypto.createHash('sha1').update(msg2).digest('hex'); 


console.log(hashMsgSHA1); //1b90a3bfb6e4ba99f21c4d2998de9a5994f93c92
console.log(hashMsg2SHA1); //3c518ae7756f502e918301bdd86dc7503d881a44

// MD5
const hashMsgMD5 = crypto.createHash('md5').update(msg).digest('hex'); 
const hashMsg2MD5 = crypto.createHash('md5').update(msg2).digest('hex'); 

console.log(hashMsgMD5); //b23cd73ad812b66f407a7f3d25b79e2c
console.log(hashMsg2MD5); //e170010139ccef044a1ceaaefc48c716



