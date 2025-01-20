from moviepy import *
from moviepy.video.fx import *

custom = TextClip(
            font="font/font.ttf",
            text="Welcome to my video !",
            font_size=48,
            color='#FFFFFF',
<<<<<<< HEAD
            bg_color='#FFC0CB',
            size=(1300, 750)
        ) .with_start(0).with_duration(5).with_position('left')
        
custom = CompositeVideoClip([custom]).with_position('left')
=======
            bg_color='#FFC0CB'
        ) .with_duration(5).with_position('left')
        
bg_clip = ColorClip(size=(1300, 750) ,color=(255, 192, 203)).with_duration(5)

custom = CompositeVideoClip([bg_clip,custom]).with_position('left')
>>>>>>> develop
v1 = VideoFileClip("videos/video2.mp4")
outro = TextClip(
            font="font/font.ttf",
            text="Thank you!",
            font_size=48,
            color='#FFFFFF',
<<<<<<< HEAD
            bg_color='#FFC0CB',
            size=(1300, 750)
        ) .with_start(0).with_duration(5).with_position('center')
        
outro = CompositeVideoClip([outro]).with_position('center')

v1=v1.with_start(custom.end)
outro=outro.with_start(v1.end)
layer1 = CompositeVideoClip([custom,v1,outro])
=======
            bg_color='#FFC0CB'
        ) .with_duration(5).with_position('center')
        
bg_clip = ColorClip(size=(1300, 750) ,color=(255, 192, 203)).with_duration(5)

outro = CompositeVideoClip([bg_clip,outro]).with_position('center')
layer1 = concatenate_videoclips([
    custom,
    v1,
    outro,
], method="compose")
>>>>>>> develop


final_video = layer1
final_video.write_videofile("./my_video.mp4", fps=24)
