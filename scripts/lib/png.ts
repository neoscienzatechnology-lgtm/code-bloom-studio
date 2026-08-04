/**
 * Codificador de PNG RGBA (32 bits), sem dependência externa.
 *
 * Existe por um motivo específico: a Play Console exige o ícone do app como
 * **PNG de 32 bits com canal alfa**, e o encoder do Chromium descarta o alfa
 * quando a imagem é inteiramente opaca — mesmo capturando com `omitBackground`.
 * Então pegamos os pixels crus (RGBA) e escrevemos o arquivo aqui, forçando o
 * color type 6.
 */
import { deflateSync } from "node:zlib";

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([length, typeAndData, crc]);
}

/** `rgba` tem width*height*4 bytes, na ordem R,G,B,A por pixel. */
export function encodeRgbaPng(width: number, height: number, rgba: Uint8Array): Buffer {
  const expected = width * height * 4;
  if (rgba.length !== expected) {
    throw new Error(`esperava ${expected} bytes de RGBA, recebi ${rgba.length}`);
  }

  // Cada linha começa com o byte de filtro (0 = None) e segue com os pixels.
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const src = y * width * 4;
    const dst = y * (1 + width * 4);
    raw[dst] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + src, width * 4).copy(raw, dst + 1);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bits por canal
  ihdr[9] = 6; // color type 6 = RGBA (é isto que a Play espera no ícone)
  ihdr[10] = 0; // compressão deflate
  ihdr[11] = 0; // filtro adaptativo
  ihdr[12] = 0; // sem entrelaçamento

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Lê largura, altura e color type do cabeçalho de um PNG já gravado. */
export function readPngHeader(buf: Buffer): { width: number; height: number; colorType: number } {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), colorType: buf[25] };
}
