from moviepy import *
from moviepy.video.fx import *

clip_0_0 = VideoFileClip("videos/video2.mp4").subclipped(0, 7)
freeze_effect = Freeze(t=2, freeze_duration=3)
clip_0_0 = freeze_effect.apply(clip_0_0)
clip_0_1 = VideoFileClip("videos/video1.mp4")

clip_0_1_before = clip_0_1.subclipped(0, 2)
crop_effect = Crop(x1=200, y1=200, width=200, height=200)
clip_0_1_cropped = crop_effect.apply(clip_0_1.subclipped(2, 4))
clip_0_1_after = clip_0_1.subclipped(4)
clip_0_1 = concatenate_videoclips([clip_0_1_before, clip_0_1_cropped, clip_0_1_after], method="compose")
layer_0 = concatenate_videoclips([
    clip_0_0,
    clip_0_1,
], method="compose")


final_video = layer_0
final_video.write_videofile("freezeAndCropVideo.mp4", fps=24)
