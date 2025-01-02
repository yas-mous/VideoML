from moviepy import *
from moviepy.video.fx import *

# Load the background video
background_video = VideoFileClip("videos/video1.mp4") 

# Load the overlay video (e.g., the gamer)
overlay_video = VideoFileClip("videos/video2.mp4")

# Resize and position the overlay video (adjust as needed)
overlay_video = overlay_video.with_effects([vfx.Resize(height=100)])

overlay_video = overlay_video.with_position(("right", "top")) 

# Create the final video with the overlay
final_video = CompositeVideoClip([background_video, overlay_video])

# Export the final video
overlay_video.write_videofile("output_video_stack.mp4", fps=24) 