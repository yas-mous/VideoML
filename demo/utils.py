import subprocess

video_path = "video1.mp4"

command = ["ffmpeg", "-i", video_path]

try:
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    print(result.stdout)
except Exception as e:
    print(f"Erreur : {e}")
