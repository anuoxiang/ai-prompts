import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ILanesDb, IQuestionDb } from './questions.interface';

const ASSETS_PATH = '/assets';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // 赛道数据库
  getLanes(): string[] {
    const lanes = JSON.parse(
      readFileSync(join(process.cwd(), ASSETS_PATH, 'lanes.json'), 'utf-8'),
    ) as ILanesDb;
    return lanes.lanes;
  }

  // 问题数据库
  getQuestions(category: string, lane?: string): string[] {
    const db = JSON.parse(
      readFileSync(join(process.cwd(), ASSETS_PATH, 'questions.json'), 'utf-8'),
    ) as IQuestionDb;
    const questions: string[] = db.coreQuestions
      .map((q: string) => q.replaceAll('{{category}}', category))
      .concat(
        db.questions.map((q: string) => q.replaceAll('{{category}}', category)),
      );

    if (lane && db.lanes[lane]) {
      return questions.concat(
        db.lanes[lane].map((q: string) =>
          q.replaceAll('{{category}}', category),
        ),
      );
    } else {
      return questions;
    }
  }
}
