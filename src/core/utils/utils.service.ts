import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
@Injectable()
export class UtilsService {
  private IV_LENGTH: number;
  private ENCRYPTION_KEY: string;
  constructor(private readonly configService: ConfigService) {
    this.IV_LENGTH = Number(this.configService.get('IV_LENGTH'));
    this.ENCRYPTION_KEY = this.configService.get('ENCRYPTION_KEY') as string;
  }

  encrypt(text: string) {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.ENCRYPTION_KEY,
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedText: string) {
    const [iv, encryptedData] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.ENCRYPTION_KEY,
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
