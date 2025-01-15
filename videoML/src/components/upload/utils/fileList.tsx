import React from "react";

interface FileListProps {
    videoFiles: File[];
    audioFiles: File[];
    onDeleteVideo: (fileName: string) => void;
    onDeleteAudio: (fileName: string) => void;
    onClickFile: (file: File, isVideo: boolean) => void;
  }
  
  const FileList: React.FC<FileListProps> = ({
    videoFiles,
    audioFiles,
    onDeleteVideo,
    onDeleteAudio,
    onClickFile,
  }) => {
    return (
      <div>
        <h3>Videos</h3>
        <ul>
          {videoFiles.map((file) => (
            <li key={file.name}>
              <span onClick={() => onClickFile(file, true)}>{file.name}</span>
              <button onClick={() => onDeleteVideo(file.name)}>X</button>
            </li>
          ))}
        </ul>
        <h3>Audios</h3>
        <ul>
          {audioFiles.map((file) => (
            <li key={file.name}>
              <span onClick={() => onClickFile(file, false)}>{file.name}</span>
              <button onClick={() => onDeleteAudio(file.name)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FileList;
  