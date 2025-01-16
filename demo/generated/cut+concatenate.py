from moviepy import *
from moviepy.video.fx import *

v1 = VideoFileClip("videos/video1.mp4")
v2 = VideoFileClip("videos/video2.mp4").subclipped(0, 5)
layer_0 = concatenate_videoclips([
    v1,
    v2,
], method="compose")


final_video = layer_0
final_video.write_videofile("myVideo.mp4", fps=24)
