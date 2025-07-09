const axios = require("axios");
const cheerio = require("cheerio");

async function otakuDesu(search) {
  try {
    const { data: html } = await axios.get(`https://otakudesu.cloud/?s=${search}&post_type=anime`);
    const $ = cheerio.load(html);
    const results = [];
    $("ul.chivsrc > li").each((index, element) => {
      const title = $(element).find("h2 a").text().trim();
      const url = $(element).find("h2 a").attr("href");
      const image = $(element).find("img").attr("src");
      const genres = $(element)
        .find(".set b:contains('Genres') + a")
        .map((_, genre) => $(genre).text().trim())
        .get();
      const status = $(element).find(".set b:contains('Status')").parent().text().replace("Status : ", "").trim();
      const rating = $(element).find(".set b:contains('Rating')").parent().text().replace("Rating : ", "").trim();

      results.push({ title, url, image, genres, status, rating });
    });
    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function otakuDetail(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 100000,
    });

    const $ = cheerio.load(response.data);

    const title = $('.jdlrx h1').text().trim();
    const score = $('.infozingle span:contains("Skor")').text().replace('Skor:', '').trim();
    const status = $('.infozingle span:contains("Status")').text().replace('Status:', '').trim();
    const totalEpisodes = $('.infozingle span:contains("Total Episode")').text().replace('Total Episode:', '').trim();
    const genres = $('.infozingle span:contains("Genre") a')
      .map((i, el) => $(el).text().trim())
      .get();
    const synopsis = $('.sinopc').text().trim();
    const image = $('.fotoanime img').attr('src');

    const episodes = $('.episodelist ul li').map((i, el) => {
      const episodeTitle = $(el).find('a').text().trim();
      const episodeLink = $(el).find('a').attr('href');
      const releaseDate = $(el).find('.zeebr').text().trim();
      return { episodeTitle, episodeLink, releaseDate };
    }).get();

    return {
      title,
      score,
      status,
      totalEpisodes,
      genres,
      synopsis,
      image,
      episodes,
    };
  } catch (error) {
    console.error('Error fetching details:', error.message);
    return null;
  }
}

module.exports = { otakuDesu, otakuDetail };