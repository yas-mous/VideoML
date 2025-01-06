from moviepy import *
from moviepy.video.fx import *
clip_0_0 = concatenate_videoclips([VideoFileClip("videos/Video.mp4")], method="compose")
clip_1_0 = concatenate_videoclips([CompositeVideoClip([
                VideoFileClip("videos/Video2.mp4").subclipped(0),
                VideoFileClip("background.mp4").resize(height=200).resize(width=300).with_position(('left', 'bottom'))
            ])], method="compose")

final_video = CompositeVideoClip([
    clip_0_0,
    clip_1_0,
])
final_video.write_videofile("my_video.mp4", fps=24)
