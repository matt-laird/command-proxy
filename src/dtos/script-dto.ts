import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateScriptDto {
  @IsString()
  path: string;

  @IsOptional()
  @IsArray()
  args?: string[];

  @IsOptional()
  @IsBoolean()
  waitTillComplete?: boolean;
}
