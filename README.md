# stylelint-plugin-display-multi-keyword-syntax

[![MIT License](https://img.shields.io/npm/l/stylelint.svg)](https://opensource.org/licenses/MIT)

A Stylelint plugin that enforces the use of multi-keyword syntax for the `display` property.

## Motivation

The CSS Display Module Level 3 introduces a new multi-keyword syntax for the `display` property. This syntax explicitly separates the outer display type (how the element participates in the parent's layout) from the inner display type (how the element's children are laid out).

For example:

- `display: block` should now be `display: block flow`
- `display: inline-block` should now be `display: inline flow-root`
- `display: grid` should now be `display: block grid`

This plugin helps you modernize your CSS by enforcing the use of these more explicit and descriptive multi-keyword values. Adopting this syntax improves code clarity, consistency, and prepares your codebase for the future of CSS.

## Installation

```bash
npm install --save-dev stylelint-plugin-display-multi-keyword-syntax
```

or

```bash
yarn add --dev stylelint-plugin-display-multi-keyword-syntax
```

## Usage

Add `stylelint-plugin-display-multi-keyword-syntax` to your Stylelint configuration `plugins` array, then add the `plugin/display-multi-keyword` rule to your `rules` object.

```json
{
  "plugins": ["stylelint-plugin-display-multi-keyword-syntax"],
  "rules": {
    "plugin/display-multi-keyword": true
    // ... other rules
  }
}
```

## Options

The `plugin/display-multi-keyword` rule has the following options:

### Primary option: `true`

Setting the primary option to `true` enables the rule. It will report single-keyword `display` values that have multi-keyword equivalents as defined in the CSS Display Module Level 3.

**Example:**

```css
/* With "plugin/display-multi-keyword": true */

/* ❌ Problematic CSS (will be flagged) */
.element1 {
  display: block; /* Should be 'block flow' */
}
.element2 {
  display: inline-block; /* Should be 'inline flow-root' */
}
.element3 {
  display: flex; /* Should be 'block flex' */
}
.element4 {
  display: inline-grid; /* Should be 'inline grid' */
}

/* ✅ Correct CSS (will not be flagged) */
.element1 {
  display: block flow;
}
.element2 {
  display: inline flow-root;
}
.element3 {
  display: block flex;
}
.element4 {
  display: inline grid;
}
```

### Secondary options

These options are provided as an object in the second item of the rule's array:

#### `fix: boolean`

- Default: `false`

If `true`, this rule will automatically fix the reported single-keyword `display` values to their multi-keyword equivalents.

**Configuration Example:**

```json
{
  "rules": {
    "plugin/display-multi-keyword": [true, { "fix": true }]
  }
}
```

**Behavior with `fix: true`:**

```css
/* Input CSS */
.example {
  display: inline-flex;
}

/* Output CSS (after Stylelint --fix) */
.example {
  display: inline flex;
}
```

#### `severity: "warning" | "error"`

- Default: `"error"`

Sets the severity level for this rule. Issues from this rule will be reported as errors by default. You can change this to `"warning"` if you prefer.

**Configuration Example:**

```json
{
  "rules": {
    "plugin/display-multi-keyword": [true, { "severity": "warning" }]
  }
}
```

## Supported Mappings

This plugin uses the following mappings to identify and (if `fix` is enabled) convert single-keyword values to their multi-keyword equivalents. These mappings are based on the CSS Display Module Level 3 specification for common `display` values that have a direct two-value keyword equivalent.

| Single Keyword     | Multi-Keyword Equivalent |
| ------------------ | ------------------------ |
| `block`            | `block flow`             |
| `flow-root`        | `block flow-root`        |
| `inline`           | `inline flow`            |
| `inline-block`     | `inline flow-root`       |
| `run-in`           | `run-in flow`            |
| `list-item`        | `block flow list-item`   |
| `inline list-item` | `inline flow list-item`  |
| `flex`             | `block flex`             |
| `inline-flex`      | `inline flex`            |
| `grid`             | `block grid`             |
| `inline-grid`      | `inline grid`            |
| `ruby`             | `inline ruby`            |
| `table`            | `block table`            |
| `inline-table`     | `inline table`           |

## Ignored Values

The rule is designed to focus on the common single-keyword values that have direct two-keyword (`<outer-display> <inner-display>`) equivalents. Therefore, it will ignore:

- Values that are already multi-keyword (e.g., `block flow`, `inline grid`).
- Special-purpose `display` values like `none` and `contents`.
- Legacy single-keyword `display` values that do not map directly to the `<outer-display> <inner-display>` model (e.g., `table-row-group`, `table-cell`, `table-caption`, etc.). These values remain valid as single keywords.

## License

MIT
