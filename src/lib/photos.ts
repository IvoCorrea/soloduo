export const MAX_PHOTOS = 6;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_EDGE = 1080;

export type ImageMime = 'image/jpeg' | 'image/png' | 'image/webp';

/** Tipo real pelo conteúdo (magic bytes), não pela extensão nem pelo `file.type`. */
export function sniffImageType(b: Uint8Array): ImageMime | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v)) return 'image/png';
  const ascii = (from: number, to: number) => String.fromCharCode(...Array.from(b.slice(from, to)));
  if (b.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  return null;
}

export class PhotoError extends Error {}

/**
 * Pré-processamento no navegador: valida tipo real e tamanho, aplica a orientação EXIF,
 * reduz para no máximo 1080px e reexporta em JPEG. Reexportar pelo canvas descarta todos
 * os metadados (inclusive localização GPS).
 *
 * Isto NÃO é moderação. Na Fase 2 o servidor repete validação e limpeza e envia a foto
 * para quarentena privada + serviço de moderação antes de qualquer publicação.
 */
export async function preparePhoto(file: File): Promise<string> {
  if (file.size > MAX_PHOTO_BYTES) throw new PhotoError('A foto passa de 10 MB. Escolha uma menor.');
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!sniffImageType(head)) throw new PhotoError('Formato não suportado. Use JPEG, PNG ou WebP.');

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new PhotoError('Não conseguimos ler essa imagem. O arquivo pode estar corrompido.');
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}
