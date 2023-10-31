class Utl {
  static play_audio_buffer(audio_buffer, context) {
    var source = context.createBufferSource();
    source.buffer = audio_buffer;
    source.loop               = false;
    source.loopStart          = 0;
    source.loopEnd            = audio_buffer.duration;
    source.playbackRate.value = 1.0;

    source.connect(context.destination);
    source.start = source.start || source.noteOn;
    source.stop  = source.stop  || source.noteOff;

    source.start(0);
  }

  static async play_text(text) {
    var start = Date.now();
    const context = new AudioContext();
  
    const style_id = $('#style').val();
  
    const audio_query = await Api.postAudioQuery(text, style_id);
    const audio = await Api.postSynthesis(style_id, audio_query, context);
    Utl.play_audio_buffer(audio, context);
    console.log('「'+text+'」の音声生成: '+((Date.now() - start) / 1000)+'秒')
  }

  static rand_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}