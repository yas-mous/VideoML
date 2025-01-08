from moviepy import *
from moviepy.video.fx import *

clip_0_0 = VideoFileClip("videos/video1.mp4").subclipped(5, 8)
clip_1_0 = VideoFileClip("videos/video2.mp4").subclipped(0, 5)

final_video = concatenate_videoclips([
    clip_0_0,
    clip_1_0,
])
final_video.write_videofile("myVideo.mp4", fps=24)
