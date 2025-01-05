from moviepy import *
from moviepy.video.fx import *

clip_0_0 = VideoFileClip("videos/video3.mp4").subclipped(5, 65)
clip_0_1 = AudioFileClip("audios/audio1.mp3").subclipped(5, 10)
volume_effect = afx.MultiplyVolume(2, start_time=2, end_time=4)
loop_effect = afx.AudioLoop(duration=clip_0_0.duration)
clip_0_1 = clip_0_1.with_effects([volume_effect,loop_effect])
clip_0_0 = clip_0_0.with_audio(clip_0_1)
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
