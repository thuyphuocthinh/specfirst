# Tutorial 6: Running Parallel Agent Sessions with Git Worktree

When working with multiple AI Agents (Claude Code, Cursor, Gemini CLI) or juggling multiple tasks (e.g. implementing a new feature, fixing a hotfix, and writing documentation at the same time), running them in the same working directory will cause file collisions and git conflicts.

`speckit-ai` provides built-in Git Worktree integration to create completely isolated workspaces for each feature.

---

## 🌿 Why Git Worktree for AI Agents?

1. **Zero File Collision**: Each agent works in its own physical folder on its own Git branch.
2. **Fresh Context**: You can open separate terminal windows / IDE sessions without branches stepping on each other.
3. **Instant Setup**: `speckit-ai worktree` automatically copies essential config (`.env`, `.speckitrc`), configures stealth mode, and initializes the SDD work structure in the new directory.

---

## 🚀 Step 1: Create a Worktree Session

In your main repository directory, run:

```bash
npx speckit-ai worktree "Add Payment Webhook"
```

### What happens under the hood?
1. Creates a new git branch: `feature/add-payment-webhook`.
2. Creates an isolated worktree folder next to your repo: `../<repo-name>-add-payment-webhook`.
3. Copies `.env` and `.speckitrc` into the worktree.
4. Applies stealth mode (`.git/info/exclude`) inside the worktree.
5. Runs `speckit-ai start "Add Payment Webhook"` inside the new worktree.

---

## 💻 Step 2: Open Agent in the Worktree

Open a new terminal or IDE window and navigate to the worktree:

```bash
cd ../<repo-name>-add-payment-webhook
```

Launch your AI Agent (e.g., Claude Code, Cursor, or Gemini):
```bash
claude
# or open in Cursor:
cursor .
```

The agent will read `.agents/AGENTS.md` and start with the active work in `specs/active/add-payment-webhook/`.

---

## 🏁 Step 3: Finish and Clean Up

When implementation and review are complete:

1. Inside the worktree, run:
   ```bash
   npx speckit-ai done
   git add .
   git commit -m "feat(payment): add webhook handler"
   ```

2. Push your feature branch:
   ```bash
   git push origin feature/add-payment-webhook
   ```

3. Return to your main repo and safely remove the worktree:
   ```bash
   cd ../<repo-name>
   git worktree remove ../<repo-name>-add-payment-webhook
   ```

---

## 💡 Best Practices for Multi-Agent Work

* **Never share `.env` secrets across public git**: The worktree automatically copies local `.env` and ensures it stays ignored.
* **Keep tasks focused**: One worktree per feature or bugfix.
* **Inspect active worktrees**: Run `git worktree list` anytime to see all active sessions.
