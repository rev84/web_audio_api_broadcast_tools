class Api {
  static url_prefix = 'http://127.0.0.1:50021';

  static async getSpeakers() {
    return await this.get('/speakers');
  }

  static async postAudioQuery(text, style_id) {
    return await this.post('/audio_query?text='+text+'&speaker='+style_id);
  }

  static async postSynthesis(style_id, audio_query, context) {
    const ary_buf = await this.post('/synthesis?speaker='+style_id, audio_query, {
      responseType: 'arraybuffer',
      headers: {
          "accept": "audio/wav",
          "Content-Type": "application/json"
      }
    });
    var audio = await context.decodeAudioData(ary_buf);
    return audio;
  }

  static async get(endpoint) {
    let res = await axios.get(this.url_prefix+endpoint);
    if (res.status == 200) {
      return res.data;
    }
    return {};
  }
  static async post(endpoint, params, options) {
    let res = await axios.post(this.url_prefix+endpoint, params, options);

    if (res.status == 200) {
      return res.data;
    }
    return {};
  }
}
