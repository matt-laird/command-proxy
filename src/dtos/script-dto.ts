import { IsString } from 'class-validator';

export class CreateScriptDto {
  @IsString()
  path: string;
}
