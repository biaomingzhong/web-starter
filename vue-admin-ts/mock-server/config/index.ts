import * as fs from 'fs';
import * as path from 'path';

const serverCert = fs.readFileSync(
  path.join(__dirname, './', 'keys', 'cert.pem'),
  'utf8'
);

const serverKey = fs.readFileSync(
  path.join(__dirname, './', 'keys', 'key.pem'),
  'utf8'
);

const publicKey = fs.readFileSync(
  path.join(__dirname, './', 'cert', 'public_key.pem')
);

const privateKey = fs.readFileSync(
  path.join(__dirname, './', 'cert', 'private_key.pem')
);

// 数据模拟服务
const server = {
  port: 3000, // default: 3000
  host: '0.0.0.0' // default: localhost,
};

export {
  publicKey,
  privateKey,
  serverCert,
  serverKey
};
