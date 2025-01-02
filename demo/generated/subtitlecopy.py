from moviepy import *
from moviepy.video.fx import *

clip_0_0 = CompositeVideoClip([VideoFileClip("videos/video1.mp4").subclipped(0, 8),
            TextClip(font="Arial.ttf",text="Bienvenue",font_size=24,color='white')
            .with_start(1)
            .with_duration(5)
            .with_position('center')])
    
clip_1_0 = VideoFileClip("videos/video2.mp4").subclipped(3, 10)


final_video = concatenate_videoclips([
    clip_0_0,
    clip_1_0
], method="compose")

final_video.write_videofile("myVideo.mp4", fps=24)