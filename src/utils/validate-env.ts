import { bool, cleanEnv, json, port, str } from 'envalid';

export default  function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    API_KEY: str(),
    CWD: str(),
    SHELL: str({ default: '/bin/sh' }),
    CORS_ORIGINS: json({ default: [ 'http://localhost' ] }),
    ALLOW_SCRIPT_ARGUMENTS: bool({ default: false }),
    EXPOSE_SWAGGER: bool({ default: false }),
    PORT: port({ default: 3000 })
  });
}
