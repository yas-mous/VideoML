from moviepy import *
from moviepy.video.fx import *
clip_0_0 = VideoFileClip("videos/video2.mp4")
freeze_effect = Freeze(t=2, freeze_duration=3)
clip_0_0 = freeze_effect.apply(clip_0_0)
crop_effect = Crop(x1=50, y1=50, width=200, height=200)
crop_effect.apply(clip_0_0)
clip_0_1 = VideoFileClip("videos/video1.mp4")
layer_0 = concatenate_videoclips([
    clip_0_0,
    clip_0_1,
])
clip_1_0 = VideoFileClip("videos/video1.mp4")

final_video = CompositeVideoClip([
    layer_0,
    clip_1_0,
])
final_video.write_videofile("myVideo.mp4", fps=24)
