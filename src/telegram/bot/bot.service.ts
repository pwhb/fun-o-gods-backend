import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update } from 'nestjs-telegraf';
import { VisibilityType } from 'src/configs/configs.schema';
import { ConfigsService } from 'src/configs/configs.service';
import { TemplatesService } from 'src/core/templates/templates.service';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class BotService {
  constructor(
    private readonly configsService: ConfigsService,
    private readonly templatesService: TemplatesService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    const config = await this.configsService.get(
      'TELEGRAM_BOT',
      VisibilityType.PRIVATE,
    );
    const template = config.subConfigs.RESPONSES.START;
    const response = this.templatesService.parseTemplate(
      { text: template.text, params: template.params },
      ctx.message,
    );
    await ctx.reply(response);
  }
}
