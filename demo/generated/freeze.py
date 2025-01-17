from moviepy import *
from moviepy.video.fx import *

V1 = VideoFileClip("videos/video1.mp4").subclipped(1, 8)
freeze_effect = Freeze(t=2, freeze_duration=1)
V1 = freeze_effect.apply(V1)
v2 = VideoFileClip("videos/video2.mp4").subclipped(10, 14)
freeze_effect = Freeze(t=1, freeze_duration=2)
v2 = freeze_effect.apply(v2)
layer_0 = concatenate_videoclips([
    V1,
    v2,
], method="compose")


final_video = layer_0
final_video.write_videofile("myVideo.mp4", fps=24)
