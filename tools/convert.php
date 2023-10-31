<?php

define('INPUT_FILEPATH', dirname(__FILE__).'/BCCWJ_frequencylist_luw_ver1_0.tsv');
define('OUTPUT_FILEPATH', dirname(__FILE__).'/../js/voices.js');

$ary = explode("\r\n", file_get_contents(INPUT_FILEPATH));

$results = [];
foreach ($ary as $line) {
  $values = explode("\t", $line);
  if (count($values) < 7) continue;

  $kind = $values[3];
  $frequency = $values[6];
  $word = $values[2];
  if ($frequency < 10 || 10000 <= $frequency) continue;
  if (!preg_match('@固有名詞@', $kind)) continue;
  if (preg_match('@■@', $word)) continue;


  $results[] = $word;
}

$fileBuf = 'window.VOICES = '.json_encode($results, JSON_UNESCAPED_UNICODE).';';

file_put_contents(OUTPUT_FILEPATH, $fileBuf);
