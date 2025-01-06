from moviepy import *
from moviepy.video.fx import *


# Load the video clips
clip1 = VideoFileClip("videos/video1.mp4").with_effects([vfx.CrossFadeOut(1)])
clip2 = VideoFileClip("videos/video2.mp4").with_effects([vfx.CrossFadeIn(1)])


# Define the fade-in duration (in seconds)


# Create the final video with the crossfade
final_clip = concatenate_videoclips([clip1, clip2], method="compose")

# Export the final video
final_clip.write_videofile("output_with_fade.mp4", fps=24)