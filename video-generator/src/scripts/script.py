from moviepy import *
from moviepy.video.fx import *

V1 = VideoFileClip("C:/Users/annad/Documents/semestre2/DSL/VideoML/video-generator/uploads/video1.mp4")
Audio1 = AudioFileClip("C:/Users/annad/Documents/semestre2/DSL/VideoML/video-generator/uploads/audio1.mp3")
Audio1 = Audio1.with_effects([])
V1 = V1.with_audio(Audio1)

final_video = V1
final_video.write_videofile("C:/Users/annad/Documents/semestre2/DSL/VideoML/demo/generated/videos/myVideo.mp4", fps=24)
