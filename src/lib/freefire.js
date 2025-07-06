const axios = require('axios');
const moment = require('moment');

/**
 * Ambil data akun Free Fire berdasarkan UID
 * @param {string} uid - UID akun Free Fire
 * @returns {Promise<Object>} - Data profil lengkap
 */
async function FFAcount(uid) {
  const url = `https://discordbot.freefirecommunity.com/player_info_api?uid=${uid}&region=id`;

  try {
    const res = await axios.get(url, {
      headers: {
        'Origin': 'https://www.freefirecommunity.com',
        'Referer': 'https://www.freefirecommunity.com/ff-account-info/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K)',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    const d = res.data.player_info || {};
    const b = d.basicInfo || {};
    const c = d.creditScoreInfo || {};
    const p = d.petInfo || {};
    const prof = d.profileInfo || {};
    const s = d.socialInfo || {};

    const safe = (val, fallback = 'N/A') => val !== undefined && val !== null ? val : fallback;
    const formatTime = (unix) => unix ? moment.unix(unix).format('YYYY-MM-DD HH:mm:ss') : 'N/A';

    const tags = Array.isArray(s.battleTag) ? s.battleTag : [];
    const tagCounts = Array.isArray(s.battleTagCount) ? s.battleTagCount : [];

    const battleTagsText = tags.length > 0
      ? tags.map((tag, i) => `${tag} (${tagCounts[i] || 0}x)`).join('\n')
      : 'N/A';

    return {
      nickname: safe(b.nickname),
      accountId: safe(b.accountId),
      region: safe(b.region),
      level: safe(b.level),
      liked: safe(b.liked),
      rank: safe(b.rank),
      maxRank: safe(b.maxRank),
      csRank: safe(b.csRank),
      exp: safe(b.exp),
      createAt: formatTime(b.createAt),
      lastLoginAt: formatTime(b.lastLoginAt),
      rankingPoints: safe(b.rankingPoints),
      releaseVersion: safe(b.releaseVersion),
      seasonId: safe(b.seasonId),
      primeLevel: safe(b.primeLevel?.level, '-'),
      diamondCost: safe(d.diamondCostRes?.diamondCost, '-'),

      petName: safe(p.name, '-'),
      petLevel: safe(p.level, '-'),
      petExp: safe(p.exp, '-'),
      petSkinId: safe(p.skinId, '-'),
      petSkillId: safe(p.selectedSkillId, '-'),

      avatarId: safe(prof.avatarId),
      clothes: Array.isArray(prof.clothes) ? prof.clothes.join(', ') : '-',
      equipedSkills: Array.isArray(prof.equipedSkills) ? prof.equipedSkills.join(', ') : '-',

      battleTags: battleTagsText,
      language: safe(s.language),
      rankShow: safe(s.rankShow),
      signature: safe(s.signature),
      creditScore: safe(c.creditScore),
      rewardState: safe(c.rewardState),

      bannerImage: `https://discordbot.freefirecommunity.com/banner_image_api?uid=${uid}&region=id`,
      outfitImage: `https://discordbot.freefirecommunity.com/outfit_image_api?uid=${uid}&region=id`
    };

  } catch (e) {
    throw new Error(`Gagal mengambil data: ${e.message}`);
  }
}

module.exports = { FFAcount };