import 'dotenv/config';
import { exec } from 'child_process';

const teste = async (req, res) => {
  console.log('testando encerramento');

  // Encerrar backend e frontend
  // Encerra o backend (processo atual)
  // process.exit(0);

  // Encerra o servidor frontend

  exec('taskkill /F /IM node.exe', (error, stdout, stderr) => {
    if (error) {
      console.error('Erro ao encerrar o servidor frontend:', error);
    } else {
      console.log('Servidor frontend encerrado com sucesso.');
    }
  });
};

// teste();

function killServers() {
  const ports = [3000, 4173];

  ports.forEach((port) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao buscar processos na porta ${port}: ${stderr}`);
        return;
      }

      // Se houver saída do comando, significa que há um processo usando a porta
      if (stdout) {
        const lines = stdout.trim().split('\n');
        lines.forEach((line) => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1]; // O PID é a última coluna

          // Encerrar o processo usando o PID encontrado
          exec(`taskkill /PID ${pid} /F`, (killError, killStdout, killStderr) => {
            if (killError) {
              console.error(`Erro ao encerrar o processo na porta ${port}: ${killStderr}`);
            } else {
              console.log(`Servidor na porta ${port} encerrado (PID: ${pid}).`);
            }
          });
        });
      } else {
        console.log(`Nenhum servidor encontrado na porta ${port}.`);
      }
    });
  });
}

// Chame a função para encerrar os servidores
killServers();
