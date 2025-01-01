from moviepy import *

final_video = concatenate_videoclips([
    CompositeVideoClip([VideoFileClip("videos/video1.mp4").subclipped(1, 5), TextClip(font="font/font.ttf", text="Bienvenue !", font_size=50, color='white')
        .with_position("bottom")
        .with_duration(3)
        .with_start(1)]),
    VideoFileClip("videos/video2.mp4").subclipped(0, 6),
])
final_video.write_videofile("videos/output.mp4", fps=24)
