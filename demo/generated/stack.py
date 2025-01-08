from moviepy import *
from moviepy.video.fx import *

v1 = CompositeVideoClip([
                VideoFileClip("videos/Video2.mp4").subclipped(0),
                VideoFileClip("videos/Video1.mp4").resize(height=200).resize(width=300).with_position(('left', 'bottom'))
            ])

final_video = v1
final_video.write_videofile("my_video.mp4", fps=24)
