module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*|[\u4e00-\u9fa5]*)(?:[\(\（](.*)[\)\）])?[\:\：] (.*)/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      referenceActions: [
        'close',
        'closes',
        'closed',
        'fix',
        'fixes',
        'fixed',
        'resolve',
        'resolves',
        'resolved',
      ],
      issuePrefixes: ['#'],
      noteKeywords: ['BREAKING CHANGE'],
      fieldPattern: /^-(.*?)-$/,
      revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
      revertCorrespondence: ['header', 'hash'],
      warn() {},
      mergePattern: null,
      mergeCorrespondence: null,
    },
  },
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'subject-max-length': [2, 'always', 108],// header最大长度，超出只会警告，不阻止提交
    'subject-empty': [2, 'never'],// subject（简短得描述）不能为空
    'type-empty': [2, 'never'], // type不能为空
    "type-case": [0, "always", "lower-case"], // type不限制大小写
    'type-enum': [
      2,
      'always',
      [
        'feat',// 新特性
        'fix',// 修补bug
        'perf',// 性能提升
        'style',// 样式更新
        'docs',// 文档修改
        'test', //单元测试
        'refactor',// 既不修复bug也不添加新功能的更改
        'build',// 影响构建系统或外部依赖项的更改(示例范围:gulp、broccoli、npm)
        'ci',// ci
        'chore',// 其他修改,比如构建流程,或者依赖管理
        'revert',// 版本回退
        'wip',// 开发中
        'stash',//暂存文件
        'delete',//删除文件
        'conflict',//修改冲突
        'font',//字体文件更新
      ],
    ],
  },
};
