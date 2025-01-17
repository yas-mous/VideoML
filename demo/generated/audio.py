from moviepy import *
from moviepy.video.fx import *

v1 = VideoFileClip("videos/video1.mp4")
v2 = VideoFileClip("videos/video2.mp4")
layer_0 = concatenate_videoclips([
    v1,
    v2,
], method="compose")

a1 = AudioFileClip("audios/audio1.mp3")
a1 = concatenate_audioclips([a1])
 = .with_audio(a1)
layer_1 = concatenate_videoclips([
], method="compose")


final_video = CompositeVideoClip([
    layer_0,
    layer_1,
])
final_video.write_videofile("../generatedVideos/groupVideo.mp4", fps=24)
