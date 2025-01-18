import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/run-python', (req: Request, res: Response) => {
    const arg1 = 'Hello';
    const arg2 = 'World';
    
    const scriptPath = path.join(__dirname, 'scripts', 'script.py');
    
    exec(`python3 ${scriptPath} ${arg1} ${arg2}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Error executing Python script' });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: 'Error in Python script' });
        }

        console.log(`stdout: ${stdout}`);
        res.status(200).json({ result: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
