from moviepy import *
from moviepy.video.fx import *

v1 = VideoFileClip("videos/Video2.mp4").subclipped(1, 90)
v2 = VideoFileClip("videos/Video1.mp4").subclipped(0)
v2 = v2.with_start(2)
v2 = v2.with_position(('left', 'bottom'))
v2 = v2.resized(width=300)
v2 = v2.resized(height=200)

final_video = CompositeVideoClip([
    v1,
    v2,
])
final_video.write_videofile("my_video.mp4", fps=24)
