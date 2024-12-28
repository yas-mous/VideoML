from moviepy import *

layer_0 = CompositeVideoClip([
    VideoFileClip("video1.mp4"),
])
layer_1 = CompositeVideoClip([
    VideoFileClip("video4.mp4"),
])

final_video = concatenate_videoclips([
    layer_0,
    layer_1,
])
final_video.write_videofile("output.mp4", fps=24)
