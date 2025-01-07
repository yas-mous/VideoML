from moviepy import *
from moviepy.video.fx import *

v1 = VideoFileClip("videos/Video2.mp4")
sub1 = TextClip(
        text="Hello World",
        font="font/font.ttf",
        font_size=24,
        color='white',
        bg_color='black'
    ).with_start(0).with_duration(5).with_position('bottom')

final_video = CompositeVideoClip([
    v1,
    sub1,
])
final_video.write_videofile("my_video.mp4", fps=24)
