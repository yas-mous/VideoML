import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();
const port = 3000;
app.use(cors({ origin: 'http://localhost:5173' }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); 
    },
});

const upload = multer({ storage });

app.post('/run-python', upload.fields([{ name: 'videos' }, { name: 'audios' }, { name: 'pythonScript' }]), async (req: Request, res: Response) => {
    try {
        console.log("Requête POST reçue sur /run-python");
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const pythonScript = files?.pythonScript;
        const videos = files?.videos || [];
        const audios = files?.audios || []; 

        if (!pythonScript || pythonScript.length === 0) {
            console.error("Le fichier pythonScript est manquant.");
        }

        const scriptPath = path.join(__dirname, '../uploads', pythonScript[0].filename);
        console.log("Chemin du fichier script.py :", scriptPath);

        let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
        console.log('scriptContent avant modification:', scriptContent);

        if (videos.length > 0) {
            videos.forEach((video) => {
                const videoOriginalName = video.originalname;
                const videoPath = path.join(__dirname, '../uploads', video.filename).replace(/\\/g, '/');
                const regex = new RegExp(`VideoFileClip\\("${videoOriginalName}"\\)`, 'g');
                scriptContent = scriptContent.replace(regex, `VideoFileClip("${videoPath}")`);
            });
        } else {
            console.log("Aucun fichier vidéo fourni.");
        }

        if (audios.length > 0) {
            audios.forEach((audio) => {
                const audioOriginalName = audio.originalname;
                const audioPath = path.join(__dirname, '../uploads', audio.filename).replace(/\\/g, '/');
                const regex = new RegExp(`AudioFileClip\\("${audioOriginalName}"\\)`, 'g');
                scriptContent = scriptContent.replace(regex, `AudioFileClip("${audioPath}")`);
            });
        } else {
            console.log("Aucun fichier audio fourni.");
        }
        console.log("scriptContent après modification:\n", scriptContent);

        const scriptPathModified = path.join(__dirname, './scripts', 'script.py');
        fs.writeFileSync(scriptPathModified, scriptContent);

        exec(`python3 ${scriptPathModified}`, (error, stdout, stderr) => {
            console.log("Exécution du script Python...");
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ error: 'Erreur lors de l\'exécution du script Python' });
            }
            if (stderr) {
                console.warn(`Avertissement : ${stderr}`); // Loggez les warnings sans renvoyer une erreur
            }

            console.log(`stdout: ${stdout}`);
            res.status(200).json({ outputUrl: '/uploads/myVideo.mp4' });
        });
    } catch (error) {
        console.error("Erreur lors du traitement des fichiers :", error);
        res.status(500).json({ error: 'Erreur lors du traitement des fichiers' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
