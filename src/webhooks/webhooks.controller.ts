import { Controller } from '@nestjs/common';
import { Public } from 'src/auth/auth.guard';
@Public()
@Controller('webhooks')
export class WebhooksController {}
