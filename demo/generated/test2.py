from moviepy import *
from moviepy.video.fx import *

clip_0_0 = concatenate_videoclips([VideoFileClip("videos/video2.mp4").subclipped(4)], method="compose")

final_video = clip_0_0
final_video.write_videofile("grayscaleVideo.mp4", fps=24)
