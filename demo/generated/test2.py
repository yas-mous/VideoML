from moviepy import *
from moviepy.video.fx import *

clip_0_0 = VideoFileClip("videos/video1.mp4").subclipped(2, 7)

clip_0_0_before = clip_0_0.subclipped(0, 1)
clip_0_0_gray = BlackAndWhite(RGB='CRT_phosphor', preserve_luminosity=True).apply(clip_0_0.subclipped(1, 3))
clip_0_0_after = clip_0_0.subclipped(3)
clip_0_0 = concatenate_videoclips([clip_0_0_before, clip_0_0_gray, clip_0_0_after], method="compose")

clip_0_0_before = clip_0_0.subclipped(0, 1)
crop_effect = Crop(x1=50, y1=50, width=500, height=500)
clip_0_0_cropped = crop_effect.apply(clip_0_0.subclipped(1, 2))
clip_0_0_after = clip_0_0.subclipped(2)
clip_0_0 = concatenate_videoclips([clip_0_0_before, clip_0_0_cropped, clip_0_0_after], method="compose")
clip_0_1 = VideoFileClip("videos/video2.mp4").subclipped(3, 10)
layer_0 = concatenate_videoclips([
    clip_0_0,
    clip_0_1,
], method="compose")


final_video = layer_0
final_video.write_videofile("groupVideo.mp4", fps=24)
