'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { toKebabCase } = require('./features');
const { startWork } = require('./lifecycle');
const stealth = require('./stealth');

function getGitEnv() {
  const env = { ...process.env };
  delete env.GIT_DIR;
  delete env.GIT_WORK_TREE;
  delete env.GIT_INDEX_FILE;
  delete env.GIT_OBJECT_DIRECTORY;
  delete env.GIT_COMMON_DIR;
  delete env.GIT_PREFIX;
  return env;
}

const getGitOpts = () => ({ encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'], env: getGitEnv() });

/**
 * Kiểm tra xem targetDir có thuộc git repo hay không
 * @param {string} targetDir
 * @returns {boolean}
 */
function isGitRepo(targetDir) {
  try {
    const res = execSync('git rev-parse --is-inside-work-tree', { cwd: targetDir, ...getGitOpts() });
    return res.trim() === 'true';
  } catch {
    return false;
  }
}

/**
 * Kiểm tra xem branch git đã tồn tại chưa
 * @param {string} branchName
 * @param {string} targetDir
 * @returns {boolean}
 */
function branchExists(branchName, targetDir) {
  try {
    const res = execSync(`git branch --list "${branchName}"`, { cwd: targetDir, ...getGitOpts() });
    return res.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Sao chép các file cấu hình quan trọng sang worktree mới nếu có
 * @param {string} sourceDir
 * @param {string} destDir
 */
function copyConfigFiles(sourceDir, destDir) {
  const filesToCopy = ['.env', '.speckitrc', 'speckit.config.json'];
  for (const file of filesToCopy) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        console.warn(`[speckit-ai] ⚠️ Failed to copy ${file}: ${err.message}`);
      }
    }
  }
}

/**
 * Tạo một Git Worktree mới cho feature và khởi tạo work SDD
 * @param {string} title - Tiêu đề của feature
 * @param {string} targetDir - Thư mục gốc của repo
 * @returns {{ branch: string, worktreeDir: string, slug: string }}
 */
function createWorktree(title, targetDir = process.cwd()) {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error('Title is required. Example: speckit-ai worktree "Add payment integration"');
  }

  const slug = toKebabCase(title);
  if (!slug) {
    throw new Error(`Title "${title}" does not produce a valid name.`);
  }

  if (!isGitRepo(targetDir)) {
    throw new Error(`Not a git repository at ${targetDir}. Please run "git init" first.`);
  }

  const branchName = `feature/${slug}`;
  if (branchExists(branchName, targetDir)) {
    throw new Error(`Git branch "${branchName}" already exists. Choose a different title or delete the branch first.`);
  }

  const parentDir = path.dirname(path.resolve(targetDir));
  const repoName = path.basename(path.resolve(targetDir));
  const worktreeDir = path.join(parentDir, `${repoName}-${slug}`);

  if (fs.existsSync(worktreeDir)) {
    throw new Error(`Target worktree directory "${worktreeDir}" already exists. Remove it first or choose a different title.`);
  }

  const gitSafeWorktreeDir = worktreeDir.replace(/\\/g, '/');

  // 1. Tạo git worktree kèm branch mới từ HEAD
  try {
    execSync(`git worktree add -b "${branchName}" "${gitSafeWorktreeDir}" HEAD`, { cwd: targetDir, ...getGitOpts() });
  } catch (err) {
    throw new Error(`Failed to create git worktree: ${err.message}`);
  }

  // 2. Sao chép file config (.env, .speckitrc)
  copyConfigFiles(targetDir, worktreeDir);

  // 3. Áp dụng stealth mode trong worktree
  stealth.apply(worktreeDir);

  // 4. Khởi tạo SDD work bên trong worktree mới
  startWork(title, {}, worktreeDir);

  console.log(`[speckit-ai] 🌿 Created Git Worktree successfully!`);
  console.log(`[speckit-ai]   → Branch: ${branchName}`);
  console.log(`[speckit-ai]   → Directory: ${worktreeDir}`);
  console.log(`[speckit-ai] 👉 To start working in this session, run:`);
  console.log(`[speckit-ai]   cd "${worktreeDir}"\n`);

  return { branch: branchName, worktreeDir, slug };
}

module.exports = {
  createWorktree,
  isGitRepo,
  branchExists,
  copyConfigFiles,
};
