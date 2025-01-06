from moviepy import *
from moviepy.video.fx import *
clip_0_0 = concatenate_videoclips([CompositeVideoClip([
            VideoFileClip("videos/video1.mp4").subclipped(0),
            TextClip(
                font="font/font.ttf",
                text="Bienvenue",
                font_size=24,
                color='white',
                bg_color='black'
            )
            .with_start(1)
            .with_duration(5)
            .with_position('bottom')
        ])
    ], method="compose")
clip_0_1 = VideoFileClip("videos/video2.mp4").subclipped(3, 10)
layer_0 = concatenate_videoclips([
    clip_0_0,
    clip_0_1,
], method="compose")


final_video = layer_0
final_video.write_videofile("myVideo.mp4", fps=24)
