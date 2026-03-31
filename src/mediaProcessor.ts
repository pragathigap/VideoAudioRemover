// Dynamic imports for FFmpeg to achieve zero-unused JS on initial load
let ffmpeg: any | null = null;
let fetchFile: any | null = null;

const baseURL = window.location.origin + '/ffmpeg';
const CDN_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

export const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  // Lazy load the factory and utility
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const { fetchFile: fetcher } = await import('@ffmpeg/util');
  fetchFile = fetcher;
  
  ffmpeg = new FFmpeg();
  
  try {
    // Try local hosting first (best for privacy and speed)
    await ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });
  } catch (e) {
    console.error('Failed to load local FFmpeg core, falling back to CDN...', e);
    await ffmpeg.load({
      coreURL: `${CDN_URL}/ffmpeg-core.js`,
      wasmURL: `${CDN_URL}/ffmpeg-core.wasm`,
    });
  }
  
  return ffmpeg;
};

export const muteVideo = async (
  file: File,
  onProgress: (p: number) => void
): Promise<string> => {
  const instance = await loadFFmpeg();
  instance.on('progress', ({ progress }: { progress: number }) => {
    onProgress(Math.round(progress * 100));
  });

  try {
    await instance.writeFile('input.mp4', await fetchFile(file));
    await instance.exec(['-i', 'input.mp4', '-an', '-c:v', 'copy', 'output.mp4']);
    const data = await instance.readFile('output.mp4');
    const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array(data as unknown as ArrayBuffer);
    return URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
  } catch (err) {
    if (err instanceof Error && err.message.includes('out of bounds')) ffmpeg = null;
    throw err;
  } finally {
    try { await instance.deleteFile('input.mp4'); } catch (e) { void e; }
    try { await instance.deleteFile('output.mp4'); } catch (e) { void e; }
  }
};

export const extractAudio = async (
  file: File,
  onProgress: (p: number) => void
): Promise<string> => {
  const instance = await loadFFmpeg();
  instance.on('progress', ({ progress }: { progress: number }) => {
    onProgress(Math.round(progress * 100));
  });

  try {
    await instance.writeFile('input.mp4', await fetchFile(file));
    await instance.exec(['-i', 'input.mp4', '-vn', '-acodec', 'libmp3lame', 'output.mp3']);
    const data = await instance.readFile('output.mp3');
    const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array(data as unknown as ArrayBuffer);
    return URL.createObjectURL(new Blob([bytes], { type: 'audio/mp3' }));
  } catch (err) {
    if (err instanceof Error && err.message.includes('out of bounds')) ffmpeg = null;
    throw err;
  } finally {
    try { await instance.deleteFile('input.mp4'); } catch (e) { void e; }
    try { await instance.deleteFile('output.mp3'); } catch (e) { void e; }
  }
};

export const compressVideo = async (
  file: File,
  crf: number,
  onProgress: (p: number) => void,
  preset: string = 'medium'
): Promise<string> => {
  const instance = await loadFFmpeg();
  instance.on('progress', ({ progress }: { progress: number }) => {
    onProgress(Math.round(progress * 100));
  });

  try {
    await instance.writeFile('input.mp4', await fetchFile(file));
    await instance.exec(['-i', 'input.mp4', '-vcodec', 'libx264', '-crf', crf.toString(), '-preset', preset, 'output-compressed.mp4']);
    const data = await instance.readFile('output-compressed.mp4');
    const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array(data as unknown as ArrayBuffer);
    return URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
  } catch (err) {
    if (err instanceof Error && err.message.includes('out of bounds')) ffmpeg = null;
    throw err;
  } finally {
    try { await instance.deleteFile('input.mp4'); } catch (e) { void e; }
    try { await instance.deleteFile('output-compressed.mp4'); } catch (e) { void e; }
  }
};

export const resizeVideo = async (
  file: File,
  width: number,
  height: number,
  onProgress: (p: number) => void,
  preset: string = 'medium'
): Promise<string> => {
  const instance = await loadFFmpeg();
  instance.on('progress', ({ progress }: { progress: number }) => {
    onProgress(Math.round(progress * 100));
  });

  try {
    await instance.writeFile('input.mp4', await fetchFile(file));
    await instance.exec(['-i', 'input.mp4', '-vf', `scale=${width}:${height}`, '-c:v', 'libx264', '-crf', '23', '-preset', preset, '-c:a', 'copy', 'output-resized.mp4']);
    const data = await instance.readFile('output-resized.mp4');
    const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array(data as unknown as ArrayBuffer);
    return URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
  } catch (err) {
    if (err instanceof Error && err.message.includes('out of bounds')) ffmpeg = null;
    throw err;
  } finally {
    try { await instance.deleteFile('input.mp4'); } catch (e) { void e; }
    try { await instance.deleteFile('output-resized.mp4'); } catch (e) { void e; }
  }
};

export const addAudioToVideo = async (
  videoFile: File,
  audioFile: File,
  onProgress: (p: number) => void
): Promise<string> => {
  const instance = await loadFFmpeg();
  instance.on('progress', ({ progress }) => {
    onProgress(Math.round(progress * 100));
  });

  try {
    await instance.writeFile('video.mp4', await fetchFile(videoFile));
    await instance.writeFile('audio.mp3', await fetchFile(audioFile));
    
    // -i video -i audio -c:v copy -map 0:v:0 -map 1:a:0 -shortest
    // This replaces existing audio with new audio, and cuts to the shortest stream
    await instance.exec([
      '-i', 'video.mp4', 
      '-i', 'audio.mp3', 
      '-c:v', 'copy', 
      '-c:a', 'aac',
      '-map', '0:v:0', 
      '-map', '1:a:0', 
      '-shortest', 
      'output-combined.mp4'
    ]);
    
    const data = await instance.readFile('output-combined.mp4');
    const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array(data as unknown as ArrayBuffer);
    return URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
  } catch (err) {
    if (err instanceof Error && err.message.includes('out of bounds')) ffmpeg = null;
    throw err;
  } finally {
    try { await instance.deleteFile('video.mp4'); } catch (e) { void e; }
    try { await instance.deleteFile('audio.mp3'); } catch (e) { void e; }
    try { await instance.deleteFile('output-combined.mp4'); } catch (e) { void e; }
  }
};

