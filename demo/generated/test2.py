from moviepy import *
from moviepy.video.fx import *

brasil = VideoFileClip("videos/video1.mp4").subclipped(2, 7)

brasil_before = brasil.subclipped(0, 1)
brasil_gray = BlackAndWhite(RGB='CRT_phosphor', preserve_luminosity=True).apply(brasil.subclipped(1, 3))
brasil_after = brasil.subclipped(3)
brasil = concatenate_videoclips([brasil_before, brasil_gray, brasil_after], method="compose")

brasil_before = brasil.subclipped(0, 1)
crop_effect = Crop(x1=50, y1=50, width=500, height=500)
brasil_cropped = crop_effect.apply(brasil.subclipped(1, 2))
brasil_after = brasil.subclipped(2)
brasil = concatenate_videoclips([brasil_before, brasil_cropped, brasil_after], method="compose")
Finn = VideoFileClip("videos/video2.mp4").subclipped(3, 10)
freeze_effect = Freeze(t=2, freeze_duration=3)
Finn = freeze_effect.apply(Finn)
layer_0 = concatenate_videoclips([
    brasil,
    Finn,
], method="compose")


final_video = layer_0
final_video.write_videofile("groupVideo.mp4", fps=24)
