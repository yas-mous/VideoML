from moviepy import *

layer_0 = CompositeVideoClip([
    VideoFileClip("videos/video1.mp4"),
    VideoFileClip("videos/video2.mp4"),
])
VideoFileClip("videos/video2.mp4")

final_video = concatenate_videoclips([
    layer_0,
    VideoFileClip("videos/video2.mp4"),
])
final_video.write_videofile("myVideo.mp4", fps=24)
