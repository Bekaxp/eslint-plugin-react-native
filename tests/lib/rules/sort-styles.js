/**
 * @fileoverview Require StyleSheet object keys to be sorted
 * @author Mats Byrkjeland
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/sort-styles');
const RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const tests = {
  valid: [
    {
      code: `
        const styles = StyleSheet.create({
          a: {},
          b: {},
          c: {},
        });
      `,
    },
    {
      code: `
        const styles = {
          c: {},
          b: {},
          a: {},
        }
      `,
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            x: 1,
            y: 2,
            z: 3,
          },
        })
      `,
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            x: 1,
            y: 2,
          },
          b: {
            a: 1,
            b: 2,
          },
        })
      `,
    },
    {
      code: `
        const styles = StyleSheet.create({
          b: {
            y: 1,
            x: 2,
          },
          a: {
            b: 1,
            a: 2,
          },
        })
      `,
      options: ['desc'],
    },
    {
      code: `
        const styles = StyleSheet.create({
          b: {
            y: 1,
            x: 2,
          },
          a: {
            b: 1,
            a: 2,
          },
        })
      `,
      options: ['asc', { ignoreClassNames: true, ignoreStyleProperties: true }],
    },
    {
      code: `
        const styles = StyleSheet.create({
          headerWrapper: {
              backgroundColor: COLORS.WHITE,
              marginTop: -350,
              padding: UNITS.BASE_UNIT * 3,
              paddingTop: 375,
          },
          bodyWrapper: {
              padding: UNITS.BASE_UNIT * 3,
          },
          voidMessageWrapper: {
              marginTop: 20,
          },
          headerMeta: {
              paddingBottom: 10,
              paddingTop: 20,
          },
          bigText: {
              fontSize: 22,
              fontWeight: '600',
          },
        })
      `,
      options: ['asc', { ignoreClassNames: true }],
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            x: 1,
            y: 2,
            ...c,
            a: 1,
            c: 2,
            ...g,
            b: 5,
          },
          c: {},
          ...g,
          b: {
            a: 1,
            b: 2,
          },
        })
      `,
    },
  ],
  invalid: [
    {
      code: `
          const styles = StyleSheet.create({
            myClass: {
              y: 2,
              x: 1,
              z: 3,
            },
          })
          `,
      output: `
          const styles = StyleSheet.create({
            myClass: {
              x: 1,
              y: 2,
              z: 3,
            },
          })
          `,
      errors: [
        {
          message: "Expected style properties to be in ascending order. 'x' should be before 'y'.",
        },
      ],
    },
    {
      code: `
          const styles = StyleSheet.create({
            b: {
              x: 1,
              y: 2,
            },
            a: {
              a: 1,
              b: 2,
            },
          })
        `,
      output: `
          const styles = StyleSheet.create({
            a: {
              a: 1,
              b: 2,
            },
            b: {
              x: 1,
              y: 2,
            },
          })
        `,
      errors: [
        {
          message: "Expected class names to be in ascending order. 'a' should be before 'b'.",
        },
      ],
    },
    {
      code: `
          const styles = StyleSheet.create({
            'd': {},
            'c': {},
            'a': {},
            'e': {},
            'b': {},
          })
        `,

      output: `
          const styles = StyleSheet.create({
            'a': {},
            'b': {},
            'c': {},
            'd': {},
            'e': {},
          })
        `,
      errors: [
        {
          message: "Expected class names to be in ascending order. 'c' should be before 'd'.",
        },
      ],
    },
    {
      code: `
          const styles = StyleSheet.create({
            ['b']: {},
            [\`a\`]: {},
          })
        `,
      output: `
          const styles = StyleSheet.create({
            [\`a\`]: {},
            ['b']: {},
          })
        `,
      errors: [
        {
          message: "Expected class names to be in ascending order. 'a' should be before 'b'.",
        },
      ],
    },
    {
      code: `
          const a = 'a';
          const b = 'b';
          const styles = StyleSheet.create({
            [\`\${a}-\${b}-b\`]: {},
            [\`a-\${b}-a\`]: {},
          })
        `,
      output: `
          const a = 'a';
          const b = 'b';
          const styles = StyleSheet.create({
            [\`a-\${b}-a\`]: {},
            [\`\${a}-\${b}-b\`]: {},
          })
        `,
      errors: [
        {
          message:
            "Expected class names to be in ascending order. 'a-b-a' should be before 'a-b-b'.",
        },
      ],
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            y: 2,
            x: 1,
            ...c,
            d: 3,
            c: 2,
            a: 1,
            ...g,
            b: 5,
          },
          d: {},
          c: {},
          ...g,
          b: {
            a: 1,
            b: 2,
          },
        })
      `,
      output: `
        const styles = StyleSheet.create({
          a: {
            x: 1,
            y: 2,
            ...c,
            a: 1,
            c: 2,
            d: 3,
            ...g,
            b: 5,
          },
          c: {},
          d: {},
          ...g,
          b: {
            a: 1,
            b: 2,
          },
        })
      `,
      errors: [
        {
          message: "Expected style properties to be in ascending order. 'x' should be before 'y'.",
        },
        {
          message: "Expected style properties to be in ascending order. 'c' should be before 'd'.",
        },
        {
          message: "Expected class names to be in ascending order. 'c' should be before 'd'.",
        },
      ],
    },
  ],
};

const config = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      classes: true,
      jsx: true,
    },
  },
  settings: {
    'react-native/style-sheet-object-names': ['StyleSheet', 'OtherStyleSheet'],
  },
};

tests.valid.forEach(t => Object.assign(t, config));
tests.invalid.forEach(t => Object.assign(t, config));

ruleTester.run('no-unused-styles', rule, tests);
