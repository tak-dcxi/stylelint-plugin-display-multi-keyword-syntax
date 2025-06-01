const stylelint = require('stylelint');
const postcss = require('postcss');

const ruleName = 'plugin/display-multi-keyword';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value, multiValue) => `Use multi-keyword syntax for \`display\` (\`${value}\` → \`${multiValue}\`)`,
});

// 単一キーワードから複数キーワードへのマッピング
const displayValueMap = {
  'block': 'block flow',
  'flow-root': 'block flow-root',
  'inline': 'inline flow',
  'inline-block': 'inline flow-root',
  'run-in': 'run-in flow',
  'list-item': 'block flow list-item',
  'inline list-item': 'inline flow list-item',
  'flex': 'block flex',
  'inline-flex': 'inline flex',
  'grid': 'block grid',
  'inline-grid': 'inline grid',
  'ruby': 'inline ruby',
  'table': 'block table',
  'inline-table': 'inline table',
};

const meta = {
  url: 'https://github.com/your-username/stylelint-plugin-display-multi-keyword',
};

const ruleFunction = (primaryOption, secondaryOption, context) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption,
        possible: [true, false],
      },
      {
        actual: secondaryOption,
        possible: {
          severity: ['warning', 'error'],
          fix: [true, false],
        },
        optional: true,
      }
    );

    if (!validOptions || !primaryOption) {
      return;
    }

    const severity = secondaryOption?.severity || 'error';
    const shouldFix = secondaryOption?.fix || false;

    root.walkDecls('display', (decl) => {
      const value = decl.value.trim();

      // 複数キーワード構文への変換が必要かチェック
      if (displayValueMap.hasOwnProperty(value)) {
        const multiKeywordValue = displayValueMap[value];

        if ((shouldFix || context.fix) && context.fix !== false) {
          // 自動修正モード
          decl.value = multiKeywordValue;
        } else {
          // エラー/警告を報告
          stylelint.utils.report({
            message: messages.rejected(value, multiKeywordValue),
            node: decl,
            result,
            ruleName,
            severity,
          });
        }
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
