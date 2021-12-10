import { PartialType } from '@nestjs/swagger';
import { CreateRedashDto } from './create-redash.dto';

export class UpdateRedashDto extends PartialType(CreateRedashDto) {}
