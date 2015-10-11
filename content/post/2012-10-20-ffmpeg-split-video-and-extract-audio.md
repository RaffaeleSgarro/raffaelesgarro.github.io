---
author: admin
comments: false
date: 2012-10-20 13:25:08+00:00
slug: ffmpeg-split-video-and-extract-audio
title: 'ffmpeg: split video and extract audio'
wordpress_id: 271
tags:
- ffmpeg
---

This is the command to extract a piece from a video file in the most efficient manner:

    
    ffmpeg -ss $START -i "My 21st Birthday" -t $DURATION -c:v copy -c:a copy "Funny moment.webm"


Where



	
  * `$START` is the start moment, in `hh:mm:ss[.mmm]` format

	
  * `$DURATION` is the length in the same format as above


Note that in this case the order of parameters matters! If the input file is given before `-ss`, ffmpeg will still decode the streams from the beginning of the file. Instead, if `-ss` is given first, the streams are first seek'd, and only after the start point decoding begins.

<!--more-->

The `-c` switch is parameterized with a stream index, which is a number like 0, 1, 2. In this case `-c:v` is a special syntax for all video streams. Following the swich, one should name an explicit decoder; in this case, the special word `copy` is used to keep the source format instead of decoding/encoding again.

To extract the audio stream from a video file, one can use

    
    ffmpeg -i "my video.webm" -map 0:a -c:a copy "soundtrack.ogg"


The `-map` switch [explained](http://ffmpeg.org/ffmpeg.html#toc-Advanced-options):



	
  *  the first number is a 0 (zero) which identifies the source file id. In this case only one file is given, so its index will be zero

	
  * the second character is a stream identifier. Again, here we use the special character a to identify all audio streams

	
  * `-c:a copy` has the same meaning as above: keep the audio encoding


This little Ruby function can help to compute the `$DURATION` parameter

    
    # first argument is start time, second is end time
    def time_diff(start, end)
      t = Time.at( Time.parse(end) - Time.parse(start) )
      (t - t.gmt_offset).strftime("%H:%M:%S.%L")
    end
