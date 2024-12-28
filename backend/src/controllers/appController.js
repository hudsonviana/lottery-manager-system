import 'dotenv/config';
import { exec } from 'child_process';
import { z } from 'zod';

const killServers = async (ports) => {
  ports.forEach((port) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao buscar processos na porta ${port}: ${stderr}`);
        return;
      }

      if (stdout) {
        const lines = stdout.trim().split('\n');
        const processInfo = lines.find((line) => line.includes(`:${port}`));
        const pid = processInfo.trim().split(/\s+/).pop();

        exec(`taskkill /PID ${pid} /F`, (killError, killStdout, killStderr) => {
          if (killError) {
            console.error(`Erro ao encerrar o processo na porta ${port}: ${killStderr}`);
          } else {
            console.log(`Servidor na porta ${port} encerrado (PID: ${pid}).`);
          }
        });
      } else {
        console.log(`Nenhum servidor encontrado na porta ${port}.`);
      }
    });
  });
};

const killNodeProcess = async () => {
  exec('taskkill /F /IM node.exe', (error, stdout, stderr) => {
    if (error) {
      console.error('Erro ao encerrar o processo Node.js:', error);
    } else {
      console.log('Todos os processos Node.js foram encerrados com sucesso.');
    }
  });
};

export const shutdownApplication = async (req, res) => {
  // console.log('---> Encerrando o sistema <---');

  const shutdownAppSchema = z.object({
    ports: z
      .array(z.number({ message: 'Esperado o número da porta' }), {
        message: 'Esperado uma lista (array) com as portas a encerrar os servidores',
      })
      .nonempty({ message: 'Lista de portas vazia' }),
    killNode: z.boolean().default(false).optional(),
  });

  const body = shutdownAppSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const { ports, killNode } = body.data;

  await killServers(ports);

  if (killNode) {
    await killNodeProcess();
  }
};
