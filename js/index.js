window.SPEAKERS = null;
window.DEFAULT_SPEAKER_NAME = 'ずんだもん';
window.DEFAULT_SPEAKER_STYLE = 'ノーマル';

window.FFT_SIZE = 2048;
window.MIC = null;

window.addEventListener('load', async function(){
  window.SPEAKERS = await Api.getSpeakers();
  init_speakers();
  set_default_speaker();

  $('#read_text').on('click', read_text);
  $('#mic_start').on('click', mic_start);
  $('#speaker').on('change', init_styles);
  $('#style').on('change', on_change_style);
});

function on_change_style() {
  const style_id = $('#style').val();
  Api.postInitializeSpeaker(style_id, true);
}

async function mic_start() {
  if (!window.MIC) {
    window.MIC = new Mic();
  }
  await window.MIC.init();
  window.MIC.start();
}

async function read_text() {
  const text = $('#text').val();
  Utl.play_text(text);
}

function set_default_speaker() {
  for (let idx in window.SPEAKERS) {
    const sp = window.SPEAKERS[idx];

    if (sp.name != window.DEFAULT_SPEAKER_NAME) {
      continue;
    }
    for (let idx_sp in sp.styles) {
      const st = sp.styles[idx_sp];
      if (st.name != window.DEFAULT_SPEAKER_STYLE) {
        continue;
      }

      $('#speaker').val(sp.speaker_uuid);
      init_styles();
      $('#style').val(st.id);
      break;
    }
  }
}

async function init_speakers()
{
  for (let idx in window.SPEAKERS) {
    const sp = window.SPEAKERS[idx];
    const option = $('<option>').attr('value', sp.speaker_uuid).html(sp.name);
    $('#speaker').append(option);
  }
}

function init_styles() {
  const speaker_uuid = $('#speaker').val();
  let speaker = null;
  for (let idx in window.SPEAKERS) {
    const sp = window.SPEAKERS[idx];
    if (sp.speaker_uuid != speaker_uuid) {
      continue;
    }
    speaker = sp;
  }

  if (speaker == null) {
    return;
  }

  $('#style').html('');
  for (let idx in speaker.styles) {
    const style = speaker.styles[idx];
    let option = $('<option>')
    option.attr('value', style.id);
    option.html(style.name);
    $('#style').append(option);
  }
  on_change_style();
}