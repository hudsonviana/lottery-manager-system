import fs from 'fs';

const sourceFile = '.env';
const destinationFile = '.env.example';

fs.readFile(sourceFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`Erro ao ler o arquivo ${sourceFile}:`, err);
    return;
  }

  const lines = data.split('\n');
  const exampleLines = lines.map((line) => {
    const [key] = line.split('=');
    return key ? `${key}=` : '';
  });

  fs.writeFile(destinationFile, exampleLines.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error(`Erro ao escrever o arquivo ${destinationFile}:`, err);
    }
  });
});
