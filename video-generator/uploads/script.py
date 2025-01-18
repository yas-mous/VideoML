from moviepy import *
from moviepy.video.fx import *

V1 = VideoFileClip("video1.mp4")
Audio1 = AudioFileClip("audio1.mp3")
Audio1 = Audio1.with_effects([])
V1 = V1.with_audio(Audio1)

final_video = V1
final_video.write_videofile("./myVideo.mp4", fps=24)
