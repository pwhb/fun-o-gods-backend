import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigsService } from './configs/configs.service';
import { VisibilityType } from './configs/configs.schema';
import { TemplatesService } from './core/templates/templates.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly configsService: ConfigsService,
    private readonly templatesService: TemplatesService,
  ) {}
  getHello(): object {
    const env = this.configService.get('NODE_ENV')
      ? `${this.configService.get('NODE_ENV')}`
      : 'unknown';
    return {
      name: `${this.configService.get('APP_NAME')} (backend)`,
      env,
      version: this.configService.get('VERSION'),
    };
  }

  async testRoute(): Promise<any> {
    const config = await this.configsService.get(
      'TELEGRAM_BOT',
      VisibilityType.ANY,
    );
    const message = {
      message_id: 50,
      from: {
        id: 1425191234,
        is_bot: false,
        first_name: 'broccoli',
        username: 'pwhbdev',
        language_code: 'en',
      },
      chat: {
        id: 1425191234,
        first_name: 'broccoli',
        username: 'pwhbdev',
        type: 'private',
      },
      date: 1730535614,
      text: '/start',
      entities: [{ offset: 0, length: 6, type: 'bot_command' }],
    };
    const template = config.subConfigs.RESPONSES.START;
    return {
      template,
      message,
      result: this.templatesService.parseTemplate(
        { text: template.text, params: template.params },
        message,
      ),
    };
  }
}
