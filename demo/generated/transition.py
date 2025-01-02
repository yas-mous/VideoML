from moviepy import *
from moviepy.video.fx import *
clip_0_0 = concatenate_videoclips([VideoFileClip("videos/Video1.mp4")], method="compose")
clip_0_0 = clip_0_0.with_effects([vfx.CrossFadeOut(1)])
clip_0_1 = concatenate_videoclips([VideoFileClip("videos/Video2.mp4")], method="compose")
clip_0_1 = clip_0_1.with_effects([vfx.CrossFadeIn(1)])
layer_0 = concatenate_videoclips([
    clip_0_0,
    clip_0_1,
], method="compose")


final_video = layer_0
final_video.write_videofile("my_video.mp4", fps=24)
