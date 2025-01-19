from moviepy import *
from moviepy.video.fx import *

<<<<<<< HEAD
v1 = VideoFileClip("videos/video1.mp4").subclipped(1, 5)
v2 = VideoFileClip("videos/video2.mp4").subclipped(0, 3)
layer1 = concatenate_videoclips([
    v1,
    v2,
], method="compose")


final_video = layer1
final_video.write_videofile("myVideo.mp4", fps=24)
=======
custom = TextClip(
            font="font/font.ttf",
            text="Welcome to my video !",
            font_size=48,
            color='#FFFFFF',
            bg_color='#FFC0CB'
        ) .with_duration(5).with_position('left')
        
bg_clip = ColorClip(size=(1300, 750) ,color=(255, 192, 203)).with_duration(5)

custom = CompositeVideoClip([bg_clip,custom]).with_position('left')
v1 = VideoFileClip("videos/video3.mp4").subclipped(1, 60)
v1 = v1.with_effects([vfx.CrossFadeOut(1)])
v2 = VideoFileClip("videos/video2.mp4").subclipped(0, 5)
v2 = v2.with_effects([vfx.CrossFadeIn(1)])
outro = TextClip(
            font="font/font.ttf",
            text="Thank you!",
            font_size=48,
            color='#FFFFFF',
            bg_color='#FFC0CB'
        ) .with_duration(5).with_position('center')
        
bg_clip = ColorClip(size=(1300, 750) ,color=(255, 192, 203)).with_duration(5)

outro = CompositeVideoClip([bg_clip,outro]).with_position('center')
layer1 = concatenate_videoclips([
    custom,
    v1,
    v2,
    outro,
], method="compose")

sub1 = TextClip(
        text="Hello World",
        font="font/font.ttf",
        font_size=24,
        color='black',
        bg_color='#FFFFFF'
    ).with_start(6).with_duration(5).with_position('bottom')
sub2 = TextClip(
        text="Hello fjeijirgjieg",
        font="font/font.ttf",
        font_size=24,
        color='black',
        bg_color='#FFFFFF'
    ).with_start(11).with_duration(5).with_position('bottom')
subtitles = concatenate_videoclips([
    sub1,
    sub2,
], method="compose").with_position( 'bottom').with_start(3)

v3 = VideoFileClip("videos/video1.mp4")
freeze_effect = Freeze(t=2, freeze_duration=1)
v3 = freeze_effect.apply(v3)
v3 = v3.with_position(('left', 'bottom'))
v3 = v3.resized(0.2)
a2 = AudioFileClip("audios/audio2.mp3").subclipped(5, 10)
loop_effect = afx.AudioLoop(duration=5)
a2 = a2.with_effects([loop_effect])
v3 = v3.with_audio(a2)

final_video = CompositeVideoClip([
    layer1,
    subtitles,
    v3,
])
final_video.write_videofile("../generatedVideos/myVideo.mp4", fps=24)
>>>>>>> develop
