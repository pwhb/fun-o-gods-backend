import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesService {
  parseTemplate(
    {
      text,
      params,
    }: {
      text: string;
      params: string;
    },
    payload: any,
  ) {
    let result = text;
    for (const p of params) {
      const value = this.getValueFromPayload(payload, p);
      result = result.replace(new RegExp(`{{${p}}}`, 'g'), value);
    }
    return result;
  }

  getValueFromPayload(payload: any, key: string) {
    const keyParts = key.split('.');
    let value = payload;
    for (const part of keyParts) {
      value = value[part];
    }
    return value || '';
  }
}
