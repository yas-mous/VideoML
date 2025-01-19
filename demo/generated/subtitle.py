from moviepy import *
from moviepy.video.fx import *

v1 = VideoFileClip("videos/Video2.mp4").subclipped(3, 10)
v2 = VideoFileClip("videos/video1.mp4").subclipped(0, 9)
layer1 = concatenate_videoclips([
    v1,
    v2,
], method="compose")

sub1 = TextClip(
            text="Hello World",
            font="font/font.ttf",
            font_size=24,
            color='black'
        ).with_start(0).with_duration(5).with_position('bottom')
sub2 = TextClip(
            text="Hello World",
            font="font/font.ttf",
            font_size=24,
            color='#FFFFFF'
        ).with_start(0).with_duration(10).with_position('bottom')

final_video = CompositeVideoClip([
    layer1,
    Invalid layer type,
])
final_video.write_videofile("./my_video.mp4", fps=24)
