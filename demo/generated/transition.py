from moviepy import *
from moviepy.video.fx import *

v1 = VideoFileClip("videos/Video1.mp4")
v1 = v1.with_effects([vfx.CrossFadeOut(1)])
v2 = VideoFileClip("videos/Video2.mp4")
v2 = v2.with_effects([vfx.CrossFadeIn(1)])
layer1 = concatenate_videoclips([
    v1,
    v2,
], method="compose")


final_video = layer1
final_video.write_videofile("my_video.mp4", fps=24)
