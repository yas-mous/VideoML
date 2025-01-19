from moviepy import *
from moviepy.video.fx import *

custom = TextClip(
            font="font/font.ttf",
            text="Welcome to my video !",
            font_size=48,
            color='#FFFFFF',
            bg_color='#FFC0CB',
            size=(1300, 750)
        ) .with_start(0).with_duration(10).with_position('center')
        
bg_clip = ColorClip(size=(1300, 750) ,color=(255, 192, 203)).with_duration(10)

custom = CompositeVideoClip([bg_clip,custom]).with_position('center')
clip1a = VideoFileClip("videos/video3.mp4").subclipped(0, 23)
clip1b = VideoFileClip("videos/video2.mp4").subclipped(1, 13)
layer1 = CompositeVideoClip([
    clip1a.with_start(custom.end),
    clip1b.with_start(custom.end),
])

s1 = TextClip(
            text="Hello World",
            font="font/font.ttf",
            font_size=24,
            color='#FFFFFF'
        ).with_start(0).with_duration(4).with_position('bottom')
s2 = TextClip(
            text="Hello World2",
            font="font/font.ttf",
            font_size=24,
            color='#FFFFFF'
        ).with_start(s1.start + s1.duration+ 4).with_duration(5).with_position('bottom')
s3 = TextClip(
            text="Hello World3",
            font="font/font.ttf",
            font_size=24,
            color='#FFFFFF'
        ).with_start(clip1b.start - 2).with_duration(2).with_position('bottom')
custom = TextClip(
            font="font/font.ttf",
            text="Good bye guys !",
            font_size=48,
            color='#FFFFFF',
            bg_color='#FFC0CB',
            size=(1300, 750)
        ) .with_start(clip1b.start + clip1b.duration+ 0).with_duration(5).with_position('left')
        
bg_clip = ColorClip(size=(1300, 750) ,color=(255, 192, 203)).with_duration(5)

custom = CompositeVideoClip([bg_clip,custom]).with_position('left')
custom = custom.resized(1)

final_video = CompositeVideoClip([
    layer1,
    s1,s2,s3,
    custom,
])
final_video.write_videofile("./my_video.mp4", fps=24)
