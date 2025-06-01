const { lint } = require('stylelint');
const plugin = require('../stylelint-plugin-display-multi-keyword-syntax');

const config = {
  plugins: [plugin],
  rules: {
    'plugin/display-multi-keyword-syntax': true,
  },
};

describe('plugin/display-multi-keyword-syntax', () => {
  it('should report single keyword display values', async () => {
    const css = `
      .block { display: block; }
      .inline { display: inline; }
      .flex { display: flex; }
      .grid { display: grid; }
      .inline-block { display: inline-block; }
    `;
    
    const result = await lint({
      code: css,
      config,
    });
    
    expect(result.errored).toBe(true);
    expect(result.results[0].warnings).toHaveLength(5);
    expect(result.results[0].warnings[0].text).toContain('Use multi-keyword syntax `block flow` instead of `block`');
    expect(result.results[0].warnings[1].text).toContain('Use multi-keyword syntax `inline flow` instead of `inline`');
    expect(result.results[0].warnings[2].text).toContain('Use multi-keyword syntax `block flex` instead of `flex`');
    expect(result.results[0].warnings[3].text).toContain('Use multi-keyword syntax `block grid` instead of `grid`');
    expect(result.results[0].warnings[4].text).toContain('Use multi-keyword syntax `inline flow-root` instead of `inline-block`');
  });

  it('should not report multi-keyword display values', async () => {
    const css = `
      .block { display: block flow; }
      .inline { display: inline flow; }
      .flex { display: block flex; }
      .grid { display: block grid; }
      .inline-block { display: inline flow-root; }
    `;
    
    const result = await lint({
      code: css,
      config,
    });
    
    expect(result.errored).toBe(false);
    expect(result.results[0].warnings).toHaveLength(0);
  });

  it.skip('should fix single keyword display values with fix option', async () => {
    const css = `
      .block { display: block; }
      .inline { display: inline; }
      .flex { display: flex; }
    `;
    
    const result = await lint({
      code: css,
      config,
      fix: true,
    });
    
    const output = result.results[0]._postcssResult.css || result.code;
    expect(output).toContain('display: block flow');
    expect(output).toContain('display: inline flow');
    expect(output).toContain('display: block flex');
  });

  it('should handle all display value mappings', async () => {
    const css = `
      .flow-root { display: flow-root; }
      .list-item { display: list-item; }
      .inline-flex { display: inline-flex; }
      .inline-grid { display: inline-grid; }
      .table { display: table; }
      .inline-table { display: inline-table; }
      .ruby { display: ruby; }
    `;
    
    const result = await lint({
      code: css,
      config,
    });
    
    expect(result.errored).toBe(true);
    const warnings = result.results[0].warnings;
    expect(warnings.find(w => w.text.includes('Use multi-keyword syntax `block flow-root` instead of `flow-root`'))).toBeTruthy();
    expect(warnings.find(w => w.text.includes('Use multi-keyword syntax `block flow list-item` instead of `list-item`'))).toBeTruthy();
    expect(warnings.find(w => w.text.includes('Use multi-keyword syntax `inline flex` instead of `inline-flex`'))).toBeTruthy();
    expect(warnings.find(w => w.text.includes('Use multi-keyword syntax `inline grid` instead of `inline-grid`'))).toBeTruthy();
    expect(warnings.find(w => w.text.includes('Use multi-keyword syntax `block table` instead of `table`'))).toBeTruthy();
    expect(warnings.find(w => w.text.includes('Use multi-keyword syntax `inline table` instead of `inline-table`'))).toBeTruthy();
    expect(warnings.find(w => w.text.includes('Use multi-keyword syntax `inline ruby` instead of `ruby`'))).toBeTruthy();
  });

  it('should handle values not in the mapping', async () => {
    const css = `
      .none { display: none; }
      .contents { display: contents; }
    `;
    
    const result = await lint({
      code: css,
      config,
    });
    
    expect(result.errored).toBe(false);
    expect(result.results[0].warnings).toHaveLength(0);
  });

  it('should respect severity option', async () => {
    const css = `.block { display: block; }`;
    
    const result = await lint({
      code: css,
      config: {
        ...config,
        rules: {
          'plugin/display-multi-keyword-syntax': [true, { severity: 'error' }],
        },
      },
    });
    
    expect(result.errored).toBe(true);
    expect(result.results[0].warnings[0].severity).toBe('error');
  });
});