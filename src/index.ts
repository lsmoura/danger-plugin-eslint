import * as fs from 'fs';

import { DangerDSLType } from 'danger/distribution/dsl/DangerDSL';

declare var danger: DangerDSLType;

declare function fail(message?: string): void;

declare function warn(message?: string): void;

declare function message(message?: string): void;

type LintMessage = {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  messageId: string;
  endLine: number;
  endColumn: number;
  fix?: {
    range: Array<number>;
    text: string;
  };
};
type LintFileReport = {
  filePath: string;
  messages: Array<LintMessage>;
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  usedDeprecatedRules: any;
};

export interface IPluginConfig {
  jsonPath?: string;
}

function eslint(config: IPluginConfig = {}) {
  const { jsonPath = 'eslint-result.json' } = config;
  try {
    const lintResultsContent = fs.readFileSync(jsonPath, 'utf8');
    const lintResults: Array<LintFileReport> = JSON.parse(lintResultsContent);

    let errorCount = 0;
    const lintRoot = `/home/runner/work/${danger.github.thisPR.repo}/${danger.github.thisPR.repo}/`;
    lintResults.forEach(entry => {
      if (!entry.messages || entry.messages.length < 0) return;

      entry.messages.forEach(msg => {
        if (msg.severity >= 2) errorCount++;

        const entryFilePath = entry.filePath.replace(lintRoot, '');
        const filePath = danger.github.utils.fileLinks([entryFilePath]);

        const errorMsg = `⬣ ${filePath}:${msg.line} [${msg.ruleId}] ${msg.message}`;

        switch (msg.severity) {
          case 0:
            message(errorMsg);
            break;
          case 1:
            warn(errorMsg);
            break;
          case 2:
          default:
            fail(errorMsg);
            break;
        }
      });
    });

    console.log('error count:', errorCount);
  } catch (e) {
    console.error(e);
    fail(
      '[danger-eslint] Could not read lint results. Danger cannot pass or fail the build.'
    );
  }
}

export default eslint;
