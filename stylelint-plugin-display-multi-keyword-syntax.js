/**
 * @fileoverview Stylelint plugin to enforce multi-keyword syntax for display property
 * @author Takahiro Arai
 */

const stylelint = require("stylelint");

const ruleName = "plugin/display-multi-keyword";
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value, multiValue) =>
    `Use multi-keyword syntax \`${multiValue}\` instead of \`${value}\`.`,
});

// Mapping from single-keyword to multi-keyword display values
const displayValueMap = {
  block: "block flow",
  "flow-root": "block flow-root",
  inline: "inline flow",
  "inline-block": "inline flow-root",
  "run-in": "run-in flow",
  "list-item": "block flow list-item",
  "inline list-item": "inline flow list-item",
  flex: "block flex",
  "inline-flex": "inline flex",
  grid: "block grid",
  "inline-grid": "inline grid",
  ruby: "inline ruby",
  table: "block table",
  "inline-table": "inline table",
};

const meta = {
  url: "https://github.com/tak-dcxi/stylelint-plugin-display-multi-keyword-syntax",
};

/**
 * Rule function that enforces multi-keyword syntax for display property
 * @param {boolean} primaryOption - Whether the rule is enabled
 * @param {Object} secondaryOption - Additional options
 * @param {string} secondaryOption.severity - Severity level ('warning' or 'error')
 * @param {boolean} secondaryOption.fix - Whether to enable auto-fixing
 * @param {Object} context - Stylelint context object
 * @returns {Function} PostCSS plugin function
 */
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
          severity: ["warning", "error"],
          fix: [true, false],
        },
        optional: true,
      }
    );

    if (!validOptions || !primaryOption) {
      return;
    }

    const severity = secondaryOption?.severity || "error";
    const shouldFix = secondaryOption?.fix || false;

    root.walkDecls("display", (decl) => {
      const value = decl.value.trim();

      // Check if conversion to multi-keyword syntax is needed
      if (displayValueMap.hasOwnProperty(value)) {
        const multiKeywordValue = displayValueMap[value];

        if ((shouldFix || context.fix) && context.fix !== false) {
          // Auto-fix mode
          decl.value = multiKeywordValue;
        } else {
          // Report error/warning
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
