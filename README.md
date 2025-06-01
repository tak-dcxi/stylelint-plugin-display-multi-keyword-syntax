# stylelint-plugin-display-multi-keyword-syntax

A Stylelint plugin that enforces the use of multi-keyword syntax for the `display` property.

## Why?

CSS Display Module Level 3 introduces a new multi-keyword syntax for the `display` property that explicitly separates the outer display type (how the element participates in the parent's layout) from the inner display type (how the element's children are laid out).

For example:
- `display: block` → `display: block flow`
- `display: inline-block` → `display: inline flow-root`
- `display: flex` → `display: block flex`

This plugin helps you modernize your CSS by enforcing the use of these more explicit multi-keyword values.

## Installation

```bash
npm install --save-dev stylelint-plugin-display-multi-keyword-syntax
```

## Usage

Add the plugin to your Stylelint configuration:

```json
{
  "plugins": ["stylelint-plugin-display-multi-keyword-syntax"],
  "rules": {
    "plugin/display-multi-keyword": true
  }
}
```

### Options

#### `true`

Enables the rule to report single-keyword display values that have multi-keyword equivalents.

```css
/* ❌ Bad */
.element {
  display: block;
  display: inline-block;
  display: flex;
}

/* ✅ Good */
.element {
  display: block flow;
  display: inline flow-root;
  display: block flex;
}
```

#### `[true, { severity: "warning" | "error" }]`

Set the severity level of the rule (default: "error").

```json
{
  "rules": {
    "plugin/display-multi-keyword": [true, { "severity": "warning" }]
  }
}
```

#### `[true, { fix: true }]`

Enable automatic fixing of single-keyword values to their multi-keyword equivalents.

```json
{
  "rules": {
    "plugin/display-multi-keyword": [true, { "fix": true }]
  }
}
```

## Supported Mappings

The following single-keyword values will be converted to their multi-keyword equivalents:

| Single Keyword | Multi-Keyword |
|----------------|---------------|
| `block` | `block flow` |
| `flow-root` | `block flow-root` |
| `inline` | `inline flow` |
| `inline-block` | `inline flow-root` |
| `run-in` | `run-in flow` |
| `list-item` | `block flow list-item` |
| `inline list-item` | `inline flow list-item` |
| `flex` | `block flex` |
| `inline-flex` | `inline flex` |
| `grid` | `block grid` |
| `inline-grid` | `inline grid` |
| `ruby` | `inline ruby` |
| `table` | `block table` |
| `inline-table` | `inline table` |

Values like `none`, `contents`, and multi-keyword values are ignored by this rule.

## License

MIT