from moviepy import *
from moviepy.video.fx import *

clip_0_0 = VideoFileClip("videos/video1.mp4").subclipped(5, 8)
clip_0_1 = AudioFileClip("audios/audio1.mp3").subclipped(5, 8)
clip_0_0 = clip_0_0.set_audio(clip_0_1)
clip_1_0 = VideoFileClip("videos/video2.mp4").subclipped(10, 14)
freeze_effect = Freeze(t=2, freeze_duration=3)
clip_1_0 = freeze_effect.apply(clip_1_0)
clip_2_0 = VideoFileClip("videos/video1.mp4").subclipped(0, 5)

final_video = concatenate_videoclips([
    clip_0_0,
    clip_1_0,
    clip_2_0,
])
final_video.write_videofile("myVideo.mp4", fps=24)
