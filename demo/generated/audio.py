from moviepy import *
from moviepy.video.fx import *

v1 = VideoFileClip("videos/video1.mp4")
v2 = VideoFileClip("videos/video2.mp4")
a3 = AudioFileClip("audios/audio2.mp3").subclipped(5, 10)
loop_effect = afx.AudioLoop(duration=5)
a3 = a3.with_effects([loop_effect])
layer1 = concatenate_videoclips([
    v1,
    v2,
], method="compose")

a1 = AudioFileClip("audios/audio1.mp3").subclipped(0, 10)
volume_effect = afx.MultiplyVolume(2, start_time=2, end_time=4)
a1 = a1.with_effects([volume_effect])
a2 = AudioFileClip("audios/audio2.mp3").subclipped(5, 10)
loop_effect = afx.AudioLoop(duration=5)
a2 = a2.with_effects([loop_effect])
layer2 = concatenate_audioclips([a1,a2])
layer1 = layer1.with_audio(layer2)

final_video = layer1
final_video.write_videofile("../generatedVideos/groupVideo.mp4", fps=24)
