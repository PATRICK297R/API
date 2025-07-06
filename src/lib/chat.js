/*
* Base: https://ginigen-deepseek-r1-0528-api.hf.space
* Author: Shannz
* Note: bisa pake websearch bisa nggk 👍
*/

const axios = require('axios');
const { EventSource } = require('eventsource');

async function chat(question, useWebSearch = false) {
  const session_hash = Math.random().toString(36).substring(2);

  const payload = {
    data: [question, [], useWebSearch],
    event_data: null,
    fn_index: 2,
    session_hash: session_hash
  };

  try {
    const res = await axios.post(
      'https://ginigen-deepseek-r1-0528-api.hf.space/gradio_api/queue/join',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return new Promise((resolve, reject) => {
      const es = new EventSource(`https://ginigen-deepseek-r1-0528-api.hf.space/gradio_api/queue/data?session_hash=${session_hash}`);

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.msg === 'process_completed') {
            es.close();
            resolve(data.output);
          }
        } catch (e) {
          es.close();
          reject(new Error(`Failed to parse server response: ${e.message}`));
        }
      };

      es.onerror = (err) => {
        es.close();
        reject(new Error('EventSource connection failed.'));
      };
    });
  } catch (err) {
    throw new Error(`Request failed: ${err.message}`);
  }
}

//contoh
/*
kalo mau pake websearch ubah false jadi true.👇
chat("Apa itu AI?", false)
  .then(result => console.log(JSON.stringify(result, null, 2)))
  .catch(err => console.error(err.message));
*/

module.exports = { chat };