from moviepy import *
from moviepy.video.fx import *

clip1 = VideoFileClip("videos/video1.mp4")
clip2 = VideoFileClip("videos/video2.mp4").subclipped(13, 14)
freeze_effect = Freeze(t=4, freeze_duration=4)  
clip1 = freeze_effect.apply(clip1)

# Concaténation des clips
final_video = concatenate_videoclips([
    clip1,
    clip2
])
final_video.write_videofile("myVideo.mp4", fps=24)
