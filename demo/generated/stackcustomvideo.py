from moviepy import *
from moviepy.video.fx import *

v2 = VideoFileClip("videos/Video1.mp4").with_start(1).subclipped(2, 7)
custom = TextClip(
            font="font/font.ttf",
            text="Welcome to my video !",
            font_size=48,
            color='#FFFFFF',
            bg_color='#FFC0CB',
            size=(1300, 750)
        ) .with_start(0).with_duration(5).with_position('left')
        
custom = CompositeVideoClip([custom]).with_position('left')
custom = custom.with_position(('left', 'bottom'))
custom = custom.resized(0.2)

final_video = CompositeVideoClip([
    v2,
    custom,
])
final_video.write_videofile("./my_video.mp4", fps=24)
