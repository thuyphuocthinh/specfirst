'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');
const { createWorktree, isGitRepo, branchExists, copyConfigFiles } = require('../src/worktree');
const scaffolder = require('../src/scaffolder');

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-worktree-test-'));
}

function cleanupDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    // ignore on windows lock
  }
}

describe('worktree.js', () => {
  let tmpDir;
  const savedGitEnv = {};
  const gitVars = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY', 'GIT_COMMON_DIR', 'GIT_PREFIX'];

  beforeEach(() => {
    tmpDir = createTempDir();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    for (const v of gitVars) {
      if (process.env[v]) {
        savedGitEnv[v] = process.env[v];
        delete process.env[v];
      }
    }
  });

  afterEach(() => {
    cleanupDir(tmpDir);
    jest.restoreAllMocks();
    for (const v of gitVars) {
      if (savedGitEnv[v]) {
        process.env[v] = savedGitEnv[v];
      }
    }
  });

  describe('isGitRepo()', () => {
    test('trả về false với thư mục rỗng không có git', () => {
      expect(isGitRepo(tmpDir)).toBe(false);
    });

    test('trả về true với thư mục đã git init', () => {
      execSync('git init', { cwd: tmpDir, stdio: 'ignore' });
      expect(isGitRepo(tmpDir)).toBe(true);
    });
  });

  describe('branchExists()', () => {
    test('trả về false khi branch chưa tồn tại', () => {
      execSync('git init', { cwd: tmpDir, stdio: 'ignore' });
      expect(branchExists('feature/non-existent', tmpDir)).toBe(false);
    });
  });

  describe('copyConfigFiles()', () => {
    test('sao chép đúng các file config (.env, .speckitrc) sang destDir', () => {
      const destDir = path.join(tmpDir, 'dest');
      fs.mkdirSync(destDir, { recursive: true });

      fs.writeFileSync(path.join(tmpDir, '.env'), 'SECRET=123');
      fs.writeFileSync(path.join(tmpDir, '.speckitrc'), '{"templatesDir": "./tmpl"}');

      copyConfigFiles(tmpDir, destDir);

      expect(fs.existsSync(path.join(destDir, '.env'))).toBe(true);
      expect(fs.readFileSync(path.join(destDir, '.env'), 'utf8')).toBe('SECRET=123');
      expect(fs.existsSync(path.join(destDir, '.speckitrc'))).toBe(true);
    });

    test('không ghi đè nếu file ở destDir đã tồn tại', () => {
      const destDir = path.join(tmpDir, 'dest');
      fs.mkdirSync(destDir, { recursive: true });

      fs.writeFileSync(path.join(tmpDir, '.env'), 'NEW_SECRET');
      fs.writeFileSync(path.join(destDir, '.env'), 'OLD_SECRET');

      copyConfigFiles(tmpDir, destDir);
      expect(fs.readFileSync(path.join(destDir, '.env'), 'utf8')).toBe('OLD_SECRET');
    });
  });

  describe('createWorktree()', () => {
    test('báo lỗi khi không truyền title', () => {
      expect(() => createWorktree('', tmpDir)).toThrow('Title is required');
      expect(() => createWorktree(null, tmpDir)).toThrow('Title is required');
    });

    test('báo lỗi khi thư mục không phải git repo', () => {
      expect(() => createWorktree('My Feature', tmpDir)).toThrow('Not a git repository');
    });

    test('tạo Git Worktree thành công kèm branch và khởi tạo SDD work', () => {
      // Setup git repo
      execSync('git init', { cwd: tmpDir, stdio: 'ignore' });
      execSync('git config user.email "test@example.com"', { cwd: tmpDir, stdio: 'ignore' });
      execSync('git config user.name "Test User"', { cwd: tmpDir, stdio: 'ignore' });
      execSync('git commit --allow-empty -m "initial commit"', { cwd: tmpDir, stdio: 'ignore' });

      // Scaffold project structure so startWork has templates
      scaffolder.scaffold({ targetDir: tmpDir, projectConfig: { type: 'single', framework: 'generic', packageManager: 'npm' } });
      execSync('git add -A', { cwd: tmpDir, stdio: 'ignore' });
      execSync('git commit -m "scaffold project"', { cwd: tmpDir, stdio: 'ignore' });
      fs.writeFileSync(path.join(tmpDir, '.env'), 'TEST_VAR=abc');

      const result = createWorktree('Payment Integration', tmpDir);

      expect(result.branch).toBe('feature/payment-integration');
      expect(result.slug).toBe('payment-integration');
      expect(fs.existsSync(result.worktreeDir)).toBe(true);
      expect(fs.existsSync(path.join(result.worktreeDir, '.env'))).toBe(true);
      expect(fs.existsSync(path.join(result.worktreeDir, 'specs', 'active', 'payment-integration'))).toBe(true);

      // Clean up worktree
      try {
        const safeWorktree = result.worktreeDir.replace(/\\/g, '/');
        execSync(`git worktree remove --force "${safeWorktree}"`, { cwd: tmpDir, stdio: 'ignore' });
        cleanupDir(result.worktreeDir);
      } catch (e) {
        // ignore
      }
    });

    test('báo lỗi khi branch đã tồn tại', () => {
      execSync('git init', { cwd: tmpDir, stdio: 'ignore' });
      execSync('git config user.email "test@example.com"', { cwd: tmpDir, stdio: 'ignore' });
      execSync('git config user.name "Test User"', { cwd: tmpDir, stdio: 'ignore' });
      execSync('git commit --allow-empty -m "initial commit"', { cwd: tmpDir, stdio: 'ignore' });
      execSync('git branch feature/existing-branch', { cwd: tmpDir, stdio: 'ignore' });

      expect(() => createWorktree('Existing Branch', tmpDir)).toThrow('already exists');
    });
  });
});
