from moviepy import *
from moviepy.video.fx import *

clip_0_0 = concatenate_videoclips([VideoFileClip("videos/video2.mp4").subclipped(7)], method="compose")

clip_0_0_before = clip_0_0.subclipped(0, 4)
clip_0_0_gray = BlackAndWhite(RGB='CRT_phosphor', preserve_luminosity=True).apply(clip_0_0.subclipped(4, 6))
clip_0_0_after = clip_0_0.subclipped(6)
clip_0_0 = concatenate_videoclips([clip_0_0_before, clip_0_0_gray, clip_0_0_after], method="compose")

final_video = clip_0_0
final_video.write_videofile("grayscaleVideo.mp4", fps=24)
