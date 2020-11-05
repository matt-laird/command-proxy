import { exec, ExecException } from 'child_process';
import { join, resolve } from 'path';
import { CreateScriptDto } from '../dtos/script-dto';
import HttpException from '../exceptions/http-exception';
import { fileExists, isNotSet, noop } from '../utils/util';

export default class ExecutionService {
  private allowScriptArgs: boolean;
  private cwd: string;
  private shell: string;
  constructor() {
    this.allowScriptArgs = Boolean(process.env.ALLOW_SCRIPT_ARGUMENTS);
    this.cwd = resolve(process.env.CWD);
    this.shell = resolve(process.env.SHELL);
  }

  async execute(scriptData: CreateScriptDto): Promise<any> {
    const targetPath = this.resolvePath(scriptData.path);
    const options = {
      args: !isNotSet(scriptData.args) && scriptData.args.length > 0 ? scriptData.args : [],
      waitTillComplete: !isNotSet(scriptData.waitTillComplete) ? scriptData.waitTillComplete : true
    };

    return new Promise((resolve, reject) => {
      const response = {
        exitCode: -1,
        stderr: '',
        stdout: ''
      };

      this.invokeScript(
        targetPath,
        (stdout: string) => {
          response.exitCode = 0;
          response.stdout = stdout;

          resolve(response);
        },
        (stderr: string, error?: ExecException) => {
          if (!isNotSet(error)) {
            let segments = [ `${error.name} ${error.message}` ];

            if (!isNotSet(error.code) ) {
              response.exitCode = error.code;
            }
            if (!isNotSet(error.signal) ) {
              segments.push(`signal: ${error.signal}`);
            }
            if (!isNotSet(error.killed) ) {
              segments.push(`killed: ${error.killed}`);
            }
            if (!isNotSet(error.stack) ) {
              segments.push(`stack: ${error.stack}`);
            }

            segments.push(stderr);
            response.stderr = segments.join('\n');
          } else {
            response.exitCode = 1;
            response.stderr = stderr;
          }

          reject(response);
        },
        options
      );
    });
  }

  private invokeScript(path: string, onSuccess: (stdout: string) => void, onFailure: (stderr: string, error?: ExecException) => void, options: any): void {
    if (options.waitTillComplete === false) {
      onSuccess('Script Invoked, not waiting for completion.');
      // tslint:disable-next-line:no-parameter-reassignment
      onSuccess = noop;
      // tslint:disable-next-line:no-parameter-reassignment
      onFailure = noop;
    }

    let commandString = `"${path}"`;
    if (this.allowScriptArgs && options.args.length > 0) {
      commandString = `${commandString} ${options.args.join(' ')}`;
    }

    exec(commandString, { shell: this.shell },
      (error: ExecException, stdout: string, stderr: string) => {
        if (!isNotSet(error)) {
          onFailure(stderr, error);
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
