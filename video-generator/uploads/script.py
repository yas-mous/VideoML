from moviepy import *
from moviepy.video.fx import *

v1 = VideoFileClip("video1.mp4").subclipped(1, 5)
v2 = VideoFileClip("video2.mp4").subclipped(0, 3)
layer1 = concatenate_videoclips([
    v1,
    v2,
], method="compose")


final_video = layer1
final_video.write_videofile("C:/Users/annad/Documents/semestre2/DSL/test/VideoML/demo/generated/videos/myVideo.mp4", fps=24)
