class Mic {
  
  constructor() {
    this.conf = {
      // 検知する最低周波数（Hz）
      min_frequency: 80,
      // 検知する最大周波数（Hz）
      max_frequency: 2000,
      // チェックするFPS
      fps: 60,
      // 喋ってる判定のボリューム
      speak_volume: 0.45,
      // 喋ってる判定の秒数
      speak_min_seconds: 0.1,
      // アラートを流す喋ってない秒数
      alert_seconds: 10,
    };
    this.speak_seconds = 0;
    this.alert_seconds = 0;
    this.audio_context = new AudioContext();
  }

  init = async function() {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    this.analyser = this.audio_context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.microphone = this.audio_context.createMediaStreamSource(this.stream);
    this.microphone.connect(this.analyser);
  }

  start = function() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.check_volume.bind(this), this.spf() * 1000);
  }

  alert = function() {
    // ランダムにテキストを選ぶ
    Utl.play_text(this.choice_text());
  }

  choice_text = function() {
    return window.VOICES[Utl.rand_int(0, window.VOICES.length - 1)]+'について話してほしいのだ';
  }

  check_volume = function() {
    const volume = this.get_volume();
    const is_speak = this.is_speak();

    // 話してる継続時間のチェック
    if (is_speak) {
      this.alert_seconds = 0;
    } else {
      this.alert_seconds += this.spf();
    }
    if (this.conf.alert_seconds <= this.alert_seconds) {
      this.alert();
      this.alert_seconds = 0;
    }

    // ボリュームと話してる判定の反映
    $('#mic_volume > .progress-bar').css('width', ''+(volume * 100)+'%')
    $('#mic_volume > .progress-bar').addClass(is_speak ? 'bg-success' : 'bg-warning')
    $('#mic_volume > .progress-bar').removeClass(is_speak ? 'bg-warning' : 'bg-success')
    // デバッグ用：無言継続
    $('#alert_seconds').html(this.alert_seconds)
  }

  is_speak = function(volume) {
    if (volume === undefined) {
      volume = this.get_volume();
    }
    const is_speak_about_volume = this.conf.speak_volume <= volume;
    if (is_speak_about_volume) {
      this.speak_seconds += this.spf();
    }
    else {
      this.speak_seconds = 0;
    }

    return this.conf.speak_min_seconds <= this.speak_seconds;
  }

  spf = function() {
    return 1 / this.conf.fps;
  }

  get_volume = function() {
    const frequency_data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(frequency_data);
    const startIndex = Math.round(this.conf.min_frequency * frequency_data.length / this.audio_context.sampleRate);
    const endIndex = Math.round(this.conf.max_frequency * frequency_data.length / this.audio_context.sampleRate);
    const amplitude_sum = frequency_data.slice(startIndex, endIndex).reduce((sum, value) => sum + value, 0);
    const amplitude_average = amplitude_sum / (endIndex - startIndex);

    return amplitude_average / 256;
  }
}