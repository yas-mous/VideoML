from moviepy import *
from moviepy.video.fx import *

custom = TextClip(
            font="Arial",
            text="Welcome to my video !",
            font_size=48,
            color='white',
            bg_color='pink'
        ) .with_duration(5).with_position('left')
Finn = VideoFileClip("result.mp4")
layer_0 = concatenate_videoclips([
    custom,
    Finn,
], method="compose")


final_video = layer_0
final_video.write_videofile("my_video.mp4", fps=24)
