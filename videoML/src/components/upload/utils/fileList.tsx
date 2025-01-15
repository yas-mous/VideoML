import React from "react";

interface FileListProps {
  fileNames: string[];
  files: File[];
  onClickVideo: (file: File) => void;
  onDeleteFile: (fileName: string) => void;
}

const FileList: React.FC<FileListProps> = ({ fileNames, files, onClickVideo, onDeleteFile }) => {
  return (
    <div>
      {fileNames.length > 0 && (
        <>
          <h3>Fichiers déposés :</h3>
          <ul>
            {fileNames.map((fileName, index) => {
              const file = files.find((f) => f.name === fileName);
              return (
                <li key={index}>
                  <span
                    onClick={() => file && onClickVideo(file)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {fileName}
                  </span>
                  <button
                    onClick={() => onDeleteFile(fileName)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => alert("Générer la vidéo")}>Générer la vidéo</button>
        </>
      )}
    </div>
  );
};

export default FileList;
