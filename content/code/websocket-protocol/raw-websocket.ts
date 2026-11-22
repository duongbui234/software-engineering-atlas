// Một server WebSocket viết tay, không thư viện, để nhìn tận mắt
// handshake, frame, masking, ping/pong và close code (RFC 6455).
// Client là WebSocket có sẵn trong Node 22+ (giống trong trình duyệt).
// Chạy: node raw-websocket.ts
import http from 'node:http';
import { createHash } from 'node:crypto';
import type { Duplex } from 'node:stream';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'; // hằng số cố định trong RFC 6455
const accept = (key: string) => createHash('sha1').update(key + GUID).digest('base64');

console.log('1) Kiểm tra công thức với ví dụ trong RFC 6455');
console.log(`   key "dGhlIHNhbXBsZSBub25jZQ==" → accept "${accept('dGhlIHNhbXBsZSBub25jZQ==')}"`);
console.log('   RFC ghi:                        "s3pPLMBiTxaQ9kYGzzhZRbK+xOo="\n');

// Dựng một frame server → client: không bao giờ có mask
function frame(opcode: number, payload: Buffer): Buffer {
  const len = payload.length;
  const head = len < 126 ? Buffer.from([0x80 | opcode, len])
    : len < 65536 ? Buffer.from([0x80 | opcode, 126, len >> 8, len & 0xff])
    : (() => { const b = Buffer.alloc(10); b[0] = 0x80 | opcode; b[1] = 127; b.writeBigUInt64BE(BigInt(len), 2); return b; })();
  return Buffer.concat([head, payload]);
}

const OPS: Record<number, string> = { 0: 'continuation', 1: 'text', 2: 'binary', 8: 'close', 9: 'ping', 10: 'pong' };

// Đọc một frame client → server từ buffer; trả null nếu chưa đủ byte
function parse(buf: Buffer) {
  if (buf.length < 2) return null;
  const fin = (buf[0] & 0x80) !== 0, opcode = buf[0] & 0x0f;
  const masked = (buf[1] & 0x80) !== 0;
  let len = buf[1] & 0x7f, off = 2;
  if (len === 126) { len = buf.readUInt16BE(2); off = 4; }
  else if (len === 127) { len = Number(buf.readBigUInt64BE(2)); off = 10; }
  const maskKey = masked ? buf.subarray(off, off + 4) : null;
  off += masked ? 4 : 0;
  if (buf.length < off + len) return null;
  const raw = Buffer.from(buf.subarray(off, off + len));
  const data = Buffer.from(raw);
  if (maskKey) for (let i = 0; i < data.length; i++) data[i] ^= maskKey[i % 4]; // bỏ mặt nạ
  return { fin, opcode, masked, len, maskKey, raw, data, size: off + len };
}

const server = http.createServer((_, res) => res.end('chỉ nhận WebSocket'));
let step = 0;
server.on('upgrade', (req, socket: Duplex) => {
  console.log('2) Request mở kết nối mà client gửi (một GET HTTP/1.1 bình thường)');
  console.log(`   GET ${req.url} HTTP/${req.httpVersion}`);
  for (const h of ['upgrade', 'connection', 'sec-websocket-version', 'sec-websocket-key', 'sec-websocket-protocol', 'origin'])
    console.log(`   ${h}: ${req.headers[h] ?? '(không có)'}`);

  const key = req.headers['sec-websocket-key'] as string;
  const offered = String(req.headers['sec-websocket-protocol'] ?? '').split(/,\s*/);
  const chosen = offered.includes('stock.v2') ? 'stock.v2' : offered[0];
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept(key)}\r\nSec-WebSocket-Protocol: ${chosen}\r\n\r\n`,
  );
  console.log(`   → server trả 101, accept = ${accept(key)}, chọn subprotocol "${chosen}"\n`);

  let buf = Buffer.alloc(0);
  socket.on('data', (chunk: Buffer) => {
    buf = Buffer.concat([buf, chunk]);
    for (let f = parse(buf); f; f = parse(buf)) {
      buf = buf.subarray(f.size);
      if (step === 0) {
        console.log('4) Frame đầu tiên client gửi lên, từng byte');
        console.log(`   hex: ${chunk.subarray(0, 6 + f.len).toString('hex').replace(/(..)/g, '$1 ')}`);
        console.log(`   FIN=${f.fin ? 1 : 0}  opcode=${f.opcode} (${OPS[f.opcode]})  MASK=${f.masked ? 1 : 0}  độ dài=${f.len}`);
        console.log(`   mask key: ${f.maskKey!.toString('hex')}`);
        console.log(`   payload trên dây: ${f.raw.toString('hex')}  (đọc thẳng ra: "${f.raw.toString('latin1').replace(/[^\x20-\x7e]/g, '.')}")`);
        console.log(`   sau khi XOR với mask key: "${f.data.toString()}"\n`);
        step = 1;
        socket.write(frame(9, Buffer.from('con-song-khong'))); // ping
      } else if (f.opcode === 10) {
        console.log(`5) Server gửi ping "con-song-khong", client tự trả pong (opcode ${f.opcode}): "${f.data}"`);
        console.log('   (trong trình duyệt không có API để tự gửi ping; trình duyệt tự trả pong)\n');
        const big = Buffer.alloc(300, 'a');
        console.log(`6) Độ dài payload: 5 byte → byte thứ 2 = ${frame(1, Buffer.alloc(5))[1]}; 300 byte → ${frame(1, big)[1]} + 2 byte độ dài; 70.000 byte → ${frame(2, Buffer.alloc(70000))[1]} + 8 byte\n`);
        // đóng có lý do: 2 byte mã + chữ UTF-8
        const reason = Buffer.from('token hết hạn');
        const body = Buffer.concat([Buffer.from([1008 >> 8, 1008 & 0xff]), reason]);
        socket.write(frame(8, body));
      } else if (f.opcode === 8) {
        console.log(`   server nhận close đáp lại: mã ${f.data.readUInt16BE(0)}`);
        socket.end();
      }
    }
  });
});

server.listen(0, async () => {
  const { port } = server.address() as { port: number };
  // 1. đóng có chủ đích
  await new Promise<void>((resolve) => {
    const ws = new WebSocket(`ws://localhost:${port}/flash-sale`, ['stock.v1', 'stock.v2']);
    ws.onopen = () => {
      console.log(`3) Client: onopen, protocol đã chọn = "${ws.protocol}"\n`);
      ws.send('mua');
    };
    ws.onclose = (e) => {
      console.log(`7) Client: onclose code=${e.code} reason="${e.reason}" wasClean=${e.wasClean}\n`);
      resolve();
    };
  });
  // 2. đứt kết nối không có frame close
  server.removeAllListeners('upgrade');
  server.on('upgrade', (req, socket: Duplex) => {
    socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n' +
      `Sec-WebSocket-Accept: ${accept(req.headers['sec-websocket-key'] as string)}\r\n\r\n`);
    setTimeout(() => socket.destroy(), 50); // giả lập pod chết, dây đứt
  });
  const ws2 = new WebSocket(`ws://localhost:${port}`);
  ws2.onclose = (e) => {
    console.log(`8) Dây đứt, không có frame close: code=${e.code} wasClean=${e.wasClean}`);
    console.log('   1006 không bao giờ được gửi trên dây; client tự gán khi kết nối mất bất thường');
    server.close();
  };
});
