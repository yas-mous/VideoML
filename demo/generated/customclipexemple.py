from moviepy import *
from moviepy.video.fx import *

custom = TextClip(
            font="font/font.ttf",
            text="Welcome to my video !",
            font_size=48,
            color='#FFFFFF',
            bg_color='#FFC0CB',
            size=(1300, 750)
        ) .with_start(0).with_duration(5).with_position('left')
        
custom = CompositeVideoClip([custom]).with_position('left')
v1 = VideoFileClip("videos/video2.mp4")
outro = TextClip(
            font="font/font.ttf",
            text="Thank you!",
            font_size=48,
            color='#FFFFFF',
            bg_color='#FFC0CB',
            size=(1300, 750)
        ) .with_start(0).with_duration(5).with_position('center')
        
outro = CompositeVideoClip([outro]).with_position('center')

v1=v1.with_start(custom.end)
outro=outro.with_start(v1.end)
layer1 = CompositeVideoClip([custom,v1,outro])


final_video = layer1
final_video.write_videofile("./my_video.mp4", fps=24)
