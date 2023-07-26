import cypto from 'crypto';
const secret = cypto.randomBytes(6).toString('hex');
console.log(secret);
