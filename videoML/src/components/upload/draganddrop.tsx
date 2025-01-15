import React, { useCallback } from "react";
import DragAndDropZone from "./utils/dragDropZone.tsx";
import FileList from "./utils/fileList.tsx";
import Modal from "./utils/modal.tsx";
import { useVideoStore } from "./stores/videoStore.ts";
import { useAudioStore } from "./stores/audioStore.ts";

export const DragAndDrop: React.FC = () => {
  const {
    videoFiles,
    selectedVideo,
    isVideoModalOpen,
    dragOverVideo,
    addVideo,
    removeVideo,
    setSelectedVideo,
    toggleVideoModal,
    setDragOverVideo,
  } = useVideoStore();

  const {
    audioFiles,
    selectedAudio,
    isAudioModalOpen,
    dragOverAudio,
    addAudio,
    removeAudio,
    setSelectedAudio,
    toggleAudioModal,
    setDragOverAudio,
  } = useAudioStore();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);

      const validVideos = droppedFiles.filter((file) => file.type.startsWith("video/"));
      const validAudios = droppedFiles.filter((file) => file.type.startsWith("audio/"));

      validVideos.forEach((file) => {
        if (!videoFiles.some((video) => video.name === file.name)) {
          addVideo(file);
        }
      });

      validAudios.forEach((file) => {
        if (!audioFiles.some((audio) => audio.name === file.name)) {
          addAudio(file);
        }
      });

      setDragOverVideo(false);
      setDragOverAudio(false);
    },
    [addVideo, addAudio, videoFiles, audioFiles, setDragOverVideo, setDragOverAudio]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDeleteFile = (fileName: string, isVideo: boolean) => {
    if (isVideo) {
      removeVideo(fileName);
    } else {
      removeAudio(fileName);
    }
  };

  const handleClickFile = (file: File, isVideo: boolean) => {
    if (isVideo) {
      setSelectedVideo(file);
      toggleVideoModal();
    } else {
      setSelectedAudio(file);
      toggleAudioModal();
    }
  };

  return (
    <div>
      <DragAndDropZone
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={() => {
          setDragOverVideo(true);
          setDragOverAudio(true);
        }}
        onDragLeave={() => {
          setDragOverVideo(false);
          setDragOverAudio(false);
        }}
        dragOver={dragOverVideo || dragOverAudio}
      />
      <FileList
        videoFiles={videoFiles}
        audioFiles={audioFiles}
        onDeleteVideo={(fileName) => handleDeleteFile(fileName, true)}
        onDeleteAudio={(fileName) => handleDeleteFile(fileName, false)}
        onClickFile={handleClickFile}
      />
      {isVideoModalOpen && selectedVideo && (
        <Modal
          selectedFile={selectedVideo}
          onClose={() => {
            toggleVideoModal();
            setSelectedVideo(null);
          }}
        />
      )}
      {isAudioModalOpen && selectedAudio && (
        <Modal
          selectedFile={selectedAudio}
          onClose={() => {
            toggleAudioModal();
            setSelectedAudio(null);
          }}
        />
      )}
    </div>
  );
};
