import { exec, spawn } from 'child_process';
import { join, resolve } from 'path';
import { CreateScriptDto } from '../dtos/script-dto';
import HttpException from '../exceptions/http-exception';
import { fileExists } from '../utils/util';

export default class ExecutionService {
  private cwd: string;
  private shell: string;
  constructor() {
    this.cwd = resolve(process.env.CWD);
    this.shell = resolve(process.env.SHELL);
  }

  async execute(scriptData: CreateScriptDto): Promise<any> {
    const targetPath = this.resolvePath(scriptData.path);

    return new Promise((resolve, reject) => {
      this.processScript(
        targetPath,
        (stdout: string) => {
          resolve({
            _path: targetPath,
            out: stdout
          });
        },
        reject
      );
    });
  }

  private processScript(path: string, onSuccess: any, onFailure: any): void {
    exec(`"${path}"`,
      { shell: this.shell },
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
    // TODO: path needs to be cleansed directory walking
    const targetPath = resolve(join(this.cwd, path));

    if (!fileExists(targetPath)) {
      throw new HttpException(404, 'Target script can not be found on host.');
    }

    return targetPath;
  }
}
