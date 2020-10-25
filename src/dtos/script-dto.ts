import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateScriptDto {
  @IsString()
  path: string;

  // @IsArray()
  // params: string[];

  @IsBoolean()
  @IsOptional()
  waitTillComplete?: boolean;
}
