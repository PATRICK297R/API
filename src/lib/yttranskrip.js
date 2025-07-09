const fetch = require('node-fetch');

/**
 * Ambil transkrip dari video YouTube
 * @param {string} videoIdOrUrl - ID atau URL YouTube
 * @returns {Promise<string>} - Teks transkrip
 */
async function getYoutubeTranscript(videoIdOrUrl) {
  const isFullUrl = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=/.test(videoIdOrUrl);
  const videoId = isFullUrl
    ? new URL(videoIdOrUrl).searchParams.get('v')
    : videoIdOrUrl;

  if (!videoId) throw new Error('Video ID tidak valid.');

  const response = await fetch('https://kome.ai/api/transcript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://kome.ai',
      'Referer': 'https://kome.ai/tools/youtube-transcript-generator',
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json, text/plain, */*'
    },
    body: JSON.stringify({
      video_id: videoId,
      format: true
    })
  });

  const json = await response.json();

  if (!json.transcript) {
    throw new Error('Transkrip tidak ditemukan.');
  }

  return json.transcript;
}

module.exports = { getYoutubeTranscript };