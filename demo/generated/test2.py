from moviepy import *

layer_0 = CompositeVideoClip([
    VideoFileClip("video1.mp4"),
    VideoFileClip("audio1.mp4"),
])
VideoFileClip("video4.mp4")

final_video = concatenate_videoclips([
    layer_0,
    VideoFileClip("video4.mp4"),
])
final_video.write_videofile("output.mp4", fps=24)
