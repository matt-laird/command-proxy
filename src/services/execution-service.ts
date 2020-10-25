import { exec } from 'child_process';
import { join, resolve } from 'path';
import { CreateScriptDto } from '../dtos/script-dto';
import HttpException from '../exceptions/http-exception';
import { fileExists, noop } from '../utils/util';

export default class ExecutionService {
  private cwd: string;
  private shell: string;
  constructor() {
    this.cwd = resolve(process.env.CWD);
    this.shell = resolve(process.env.SHELL);
  }

  async execute(scriptData: CreateScriptDto): Promise<any> {
    const targetPath = this.resolvePath(scriptData.path);
    const options = {
      // params: [''],
      waitTillComplete: scriptData.waitTillComplete != null ? scriptData.waitTillComplete : true
    };

    return new Promise((resolve, reject) => {
      this.invokeScript(
        targetPath,
        (stdout: string) => {
          resolve({
            _: targetPath,
            message: stdout
          });
        },
        reject,
        options
      );
    });
  }

  private invokeScript(path: string, onSuccess: (stdout: string) => void, onFailure: (stderr: string) => void, options: any): void {
    if (options.waitTillComplete === false) {
      onSuccess('Invoked, not waiting for completion.');
      // tslint:disable-next-line:no-parameter-reassignment
      onSuccess = noop;
      // tslint:disable-next-line:no-parameter-reassignment
      onFailure = noop;
    }

    exec(`"${path}"`, { shell: this.shell },
      (error: Error, stdout: string, stderr: string) => {
        if (error !== null) {
          onFailure(stderr);
          return;
        }

        onSuccess(stdout);
      }
    );
  }

  private resolvePath(path: string): string {
    const cleansedPath = path.replace(/\.+[\/\\]/g, '');
    const targetPath = resolve(join(this.cwd, cleansedPath));

    if (!fileExists(targetPath)) {
      throw new HttpException(404, 'Target script can not be found on host.');
    }

    return targetPath;
  }
}
