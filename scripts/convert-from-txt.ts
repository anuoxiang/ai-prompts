import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { IQuestionDb } from 'src/questions.interface';

function main(txtFile: string) {
  const originTxt = readFileSync(join(__dirname, txtFile), 'utf-8');
  const db: IQuestionDb = { questions: [], coreQuestions: [], lanes: {} };
  const lanes: string[] = [];

  // 按行分割文本
  const lines = originTxt.split('\n').map((line) => line.trim());

  let currentSection: 'core' | 'questions' | 'lanes' | null = null;
  let lane = '';
  const count = {
    coreQuestion: 0,
    question: 0,
    total: 0,
    lane: 0,
  };

  for (const line of lines) {
    // 跳过空行，同时重置当前区域
    if (!line) {
      currentSection = null;
      continue;
    }

    // 检查是否是核心通用问题区域
    if (line.includes('核心通用')) {
      currentSection = 'core';
      continue;
    }

    // 检查是否是通用问题区域
    if (line.includes('通用问题')) {
      currentSection = 'questions';
      continue;
    }

    // 根据当前区域处理内容
    switch (currentSection) {
      case 'core':
        db.coreQuestions.push(line.replace(/\d*\./, ''));
        count.coreQuestion++;
        count.total++;
        break;
      case 'questions':
        db.questions.push(line.replace(/\d*./, ''));
        count.question++;
        count.total++;
        break;
      case 'lanes':
        db.lanes[lane].push(line);
        count.total++;
        break;
      default:
        // 如果不包含 {{xx}} 格式的文本，则视为车道信息
        if (!line.includes('{{') && !line.includes('}}')) {
          count.lane++;
          currentSection = 'lanes';
          lane = line.trim();
          lanes.push(lane);
          db.lanes[lane] = [];
        }
        break;
    }
  }

  // 将结果写入 JSON 文件
  writeFileSync(
    join(__dirname, '../assets/questions.json'),
    JSON.stringify(db, null, 2),
    'utf-8',
  );
  writeFileSync(
    join(__dirname, '../assets/lanes.json'),
    JSON.stringify({ lanes }, null, 2),
    'utf-8',
  );
  console.log('转换完成！');
  console.log(`${count.coreQuestion} 个核心通用问题`);
  console.log(`${count.question} 个通用问题`);
  console.log(`${count.lane} 个赛道`);
  console.log(`${count.total} 个问题`);
}

main(process.argv[2]);
