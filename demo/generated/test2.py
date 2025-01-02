from moviepy import *
from moviepy.video.fx import *

clip_0_0 = VideoFileClip("videos/video2.mp4").subclipped(0,8)
crop_effect = Crop(x1=50, y1=50, width=500, height=(500))
cropp= crop_effect.apply(clip_0_0.subclipped(2,5))
print(cropp.size)
print(clip_0_0.size)

final_video = concatenate_videoclips([
    
    cropp,
    clip_0_0
])
final_video.write_videofile("myVideo.mp4", fps=24)
