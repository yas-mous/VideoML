from moviepy import *



final_video = concatenate_videoclips([
    VideoFileClip("videos/video1.mp4"),
    VideoFileClip("videos/video2.mp4"),
])
final_video.write_videofile("videos/output.mp4", fps=24)
