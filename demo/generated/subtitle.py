from moviepy import *
from moviepy.editor import *

final_video = concatenate_videoclips([
    CompositeVideoClip([VideoFileClip("video1.mp4").subclip(1, 5), TextClip("Bienvenue !", fontsize=50, color='white')
        .set_position("bottom")
        .set_duration(3)
        .set_start(1)]),
    VideoFileClip("video2.mp4").subclip(0, 6),
])
final_video.write_videofile("output.mp4", fps=24)
