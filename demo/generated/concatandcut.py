from moviepy import *
from moviepy.editor import *


final_video = concatenate_videoclips([
    VideoFileClip("video1.mp4").subclip(1, 3),
    VideoFileClip("video2.mp4").subclip(0, 4),
])
final_video.write_videofile("output.mp4", fps=24)
