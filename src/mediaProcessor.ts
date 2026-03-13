import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const baseURL = window.location.origin + '/ffmpeg';
let ffmpeg: FFmpeg | null = null;

export const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
  });
  return ffmpeg;
};

export const muteVideo = async (
  file: File,
  onProgress: (p: number) => void
): Promise<string> => {
  const instance = await loadFFmpeg();
  instance.on('progress', ({ progress }) => {
    onProgress(Math.round(progress * 100));
  });

  await instance.writeFile('input.mp4', await fetchFile(file));
  await instance.exec(['-i', 'input.mp4', '-an', '-c:v', 'copy', 'output.mp4']);
  
  const data = await instance.readFile('output.mp4');
  const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array(data as unknown as ArrayBuffer);
  return URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
};

export const extractAudio = async (
  file: File,
  onProgress: (p: number) => void
): Promise<string> => {
  const instance = await loadFFmpeg();
  instance.on('progress', ({ progress }) => {
    onProgress(Math.round(progress * 100));
  });

  await instance.writeFile('input.mp4', await fetchFile(file));
  await instance.exec(['-i', 'input.mp4', '-vn', '-acodec', 'libmp3lame', 'output.mp3']);
  
  const data = await instance.readFile('output.mp3');
  const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array(data as unknown as ArrayBuffer);
  return URL.createObjectURL(new Blob([bytes], { type: 'audio/mp3' }));
};

export const extractAndCompressAudio = async (
  file: File,
  bitrateKbps: number,
  onProgress: (p: number) => void
): Promise<string> => {
  const instance = await loadFFmpeg();
  instance.on('progress', ({ progress }) => {
    onProgress(Math.round(progress * 100));
  });

  await instance.writeFile('input.mp4', await fetchFile(file));
  await instance.exec([
    '-i',
    'input.mp4',
    '-vn',
    '-acodec',
    'libmp3lame',
    '-b:a',
    `${Math.max(16, Math.min(320, Math.round(bitrateKbps)))}k`,
    'output-compressed.mp3',
  ]);

  const data = await instance.readFile('output-compressed.mp3');
  const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array(data as unknown as ArrayBuffer);
  return URL.createObjectURL(new Blob([bytes], { type: 'audio/mp3' }));
};
