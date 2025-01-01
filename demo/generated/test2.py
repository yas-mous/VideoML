from moviepy import *


final_video = concatenate_videoclips([
    VideoFileClip("videos/video1.mp4").subclipped(5, 8),
    VideoFileClip("videos/video2.mp4").subclipped(13, 14),
    VideoFileClip("videos/video1.mp4").subclipped(0, 5),
])
final_video.write_videofile("myVideo.mp4", fps=24)
