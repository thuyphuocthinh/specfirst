'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { generate, generateTestCases } = require('../src/generator');
const { checkWork } = require('../src/done');

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-sb-test-'));
}
function cleanupDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('Software Builder Workflow Tests', () => {
  let tmpDir;

  function write(rel, content = '# x\n') {
    const full = path.join(tmpDir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, 'utf8');
    return full;
  }

  function read(rel) {
    return fs.readFileSync(path.join(tmpDir, rel), 'utf8');
  }

  const CONTRACT_TEMPLATE = `# Contract: [Service / Component Name]

> **Provider**: [Name]
> **Consumer**: [Name]
> **Version**: 1.0.0
> **Swagger / OpenAPI**: [Optional link]
> **Status**: Draft

## 1. Overview
API handover.

## 2. Endpoints / Interfaces
### [GET] /api/v1/test
`;

  beforeEach(() => {
    tmpDir = createTempDir();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanupDir(tmpDir);
    jest.restoreAllMocks();
  });

  describe('Contract Handover Generation with Swagger URL', () => {
    test('generate contract with --url sets Swagger / OpenAPI metadata', () => {
      write('specs/contracts/_template.md', CONTRACT_TEMPLATE);

      const dest = generate(
        'contract',
        'User Profile API',
        { url: 'https://api.example.com/swagger/v1.json' },
        tmpDir
      );

      expect(fs.existsSync(dest)).toBe(true);
      const content = read('specs/contracts/user-profile-api.md');
      expect(content).toContain('> **Swagger / OpenAPI**: https://api.example.com/swagger/v1.json');
      expect(content).toContain('# Contract: User Profile API');
    });

    test('generate contract inserts Swagger URL if template only has Version tag', () => {
      const minimalTemplate = '# Contract: [Name]\n\n> **Version**: 1.0.0\n\n## 1. Overview\n';
      write('specs/contracts/_template.md', minimalTemplate);

      generate(
        'contract',
        'Payment API',
        { url: 'https://docs.stripe.com/api' },
        tmpDir
      );

      const content = read('specs/contracts/payment-api.md');
      expect(content).toContain('> **Swagger / OpenAPI**: https://docs.stripe.com/api');
    });
  });

  describe('Contract Verification in Done Gatekeeper', () => {
    test('done check flags error if referenced contract does not exist on disk', () => {
      const specContent = `# Spec: My Feature\n\n> **Contracts**: missing-api\n\n## Overview\nTest\n\n## Feature Type\n- [x] Simple UI / Logic feature\n\n## Acceptance Criteria\n### AC-1: Works\nGiven a\nWhen b\nThen c\n\n## Open Questions\n`;
      write('specs/_template.md', specContent);
      write('specs/active/work-1/targets/my-feature.md', specContent);
      write('specs/active/work-1/work.json', JSON.stringify({ targets: { 'my-feature': null } }));
      write('specs/active/work-1/proposal.md', '# Proposal\n\n## Why\nWhy\n\n## What\nWhat\n');
      write('specs/active/work-1/tasks.md', '# Tasks\n\n## Phase 1: Setup\n- [x] done\n\n## Phase 4: Tests\n- [x] done\n');
      write('specs/active/work-1/review.md', '# Review\n\n## Code\nOK\n\n## Summary\n- AC-1: Pass\n');

      const result = checkWork(tmpDir, 'work-1');
      const contractError = result.errors.find(e => e.code === 'references' && e.message.includes('missing-api'));
      expect(contractError).toBeDefined();
    });

    test('done check passes contract reference check when contract exists on disk', () => {
      const specContent = `# Spec: My Feature\n\n> **Contracts**: auth-api\n\n## Overview\nTest\n\n## Feature Type\n- [x] Simple UI / Logic feature\n\n## Acceptance Criteria\n### AC-1: Works\nGiven a\nWhen b\nThen c\n\n## Open Questions\n`;
      write('specs/_template.md', specContent);
      write('specs/contracts/auth-api.md', '# Contract: Auth API\n');
      write('specs/active/work-2/targets/my-feature.md', specContent);
      write('specs/active/work-2/work.json', JSON.stringify({ targets: { 'my-feature': null } }));
      write('specs/active/work-2/proposal.md', '# Proposal\n\n## Why\nWhy\n\n## What\nWhat\n');
      write('specs/active/work-2/tasks.md', '# Tasks\n\n## Phase 1: Setup\n- [x] done\n\n## Phase 4: Tests\n- [x] done\n');
      write('specs/active/work-2/review.md', '# Review\n\n## Code\nOK\n\n## Summary\n- AC-1: Pass\n');

      const result = checkWork(tmpDir, 'work-2');
      const contractError = result.errors.find(e => e.code === 'references' && e.message.includes('auth-api'));
      expect(contractError).toBeUndefined();
    });
  });

  describe('Test Cases Specification Generation', () => {
    test('generateTestCases creates test-cases.md with Positive, Negative and Boundary rows for each AC', () => {
      write('specs/active/work-tc/targets/feature.md', '# Feature\n\n### AC-1: Login\n### AC-2: Logout\n');
      const dest = generateTestCases('work-tc', tmpDir);
      expect(fs.existsSync(dest)).toBe(true);
      const content = read('specs/active/work-tc/test-cases.md');
      expect(content).toContain('| **TC-01** | AC-1 |');
      expect(content).toContain('| **TC-02** | AC-1 |');
      expect(content).toContain('| **TC-03** | AC-1 |');
      expect(content).toContain('| **TC-04** | AC-2 |');
      expect(content).toContain('Playwright E2E');
    });

    test('generateTestCases throws error if target specs have no ACs', () => {
      write('specs/active/work-empty/targets/feature.md', '# Feature without AC\n');
      expect(() => generateTestCases('work-empty', tmpDir)).toThrow('No Acceptance Criteria');
    });
  });
});
