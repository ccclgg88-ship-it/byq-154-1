import fs from 'node:fs';
import path from 'node:path';

function generateSilentWav(durationSeconds, sampleRate = 22050, channels = 1, bitsPerSample = 16) {
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * channels * (bitsPerSample / 8);
  const bufferSize = 44 + dataSize;
  const buffer = Buffer.alloc(bufferSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(channels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

const baseDir = process.cwd();
const storiesDir = path.join(baseDir, 'public', 'audio', 'stories');
const musicDir = path.join(baseDir, 'public', 'audio', 'music');

const storyFiles = [
  { name: 'fairy-1.wav', duration: 300 },
  { name: 'fairy-2.wav', duration: 320 },
  { name: 'nature-1.wav', duration: 280 },
  { name: 'nature-2.wav', duration: 260 },
  { name: 'whitenoise-1.wav', duration: 600 },
  { name: 'whitenoise-2.wav', duration: 480 },
];

const musicFiles = [
  { name: 'rain.wav', duration: 60 },
  { name: 'fire.wav', duration: 60 },
  { name: 'stars.wav', duration: 60 },
  { name: 'ocean.wav', duration: 60 },
  { name: 'forest.wav', duration: 60 },
  { name: 'wind.wav', duration: 60 },
];

console.log('Generating silent audio placeholders...');
console.log('Base dir:', baseDir);

storyFiles.forEach(file => {
  const wav = generateSilentWav(file.duration);
  const filePath = path.join(storiesDir, file.name);
  fs.writeFileSync(filePath, wav);
  console.log(`  ✅ ${file.name} (${file.duration}s)`);
});

musicFiles.forEach(file => {
  const wav = generateSilentWav(file.duration);
  const filePath = path.join(musicDir, file.name);
  fs.writeFileSync(filePath, wav);
  console.log(`  ✅ ${file.name} (${file.duration}s loop)`);
});

console.log('\nAll audio placeholder files generated successfully!');
