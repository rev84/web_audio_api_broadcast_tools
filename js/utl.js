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
}