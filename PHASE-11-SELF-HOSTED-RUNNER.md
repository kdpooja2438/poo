# Phase 11: GitHub Actions self-hosted runner

## Concepts

A **GitHub-hosted runner** is a temporary virtual machine managed by GitHub. GitHub provisions it for a job, runs the workflow, and usually discards it afterward.

A **self-hosted runner** is a machine managed by you. The runner application is installed on that machine and waits for jobs from GitHub. In this phase, the runner is your local Windows computer.

GitHub does not open a remote shell into the machine. The runner makes an outbound connection to GitHub, receives an eligible job, downloads the repository and actions, and executes the job locally. Logs and status are sent back to GitHub.

Organizations may use self-hosted runners when they need private network access, custom software, special hardware, predictable local capacity, or control over the operating system. The tradeoffs are patching, availability, maintenance, and security responsibility.

## Set up the local Windows runner

1. Open the private repository on GitHub.
2. Go to **Settings > Actions > Runners > New self-hosted runner**.
3. Select **Windows** and **x64**.
4. On your local machine, create a dedicated runner directory, for example:

   ```powershell
   New-Item -ItemType Directory -Force C:\actions-runner | Out-Null
   Set-Location C:\actions-runner
   ```

5. Copy the download and extraction commands shown by GitHub into that directory. GitHub publishes the current runner version, so do not hardcode an old download URL from this document.
6. Copy GitHub's `config.cmd` command and run it in PowerShell. When prompted:
   - accept the default runner name or choose a clear name such as `local-windows-runner`;
   - keep the default labels, including `self-hosted`, `Windows`, and `X64`;
   - use the repository URL shown by GitHub;
   - enter the short-lived registration token shown on that page.
7. Start the runner interactively:

   ```powershell
   .\run.cmd
   ```

   Keep this window open. The runner must be online for a job to execute.

The registration token is temporary and must not be committed, pasted into workflow files, or stored in logs. The runner's connection is outbound; no inbound port-forwarding is required.

## Demonstrate execution on your machine

1. Push this workflow to the default branch.
2. In GitHub, open **Actions > Self-hosted runner verification > Run workflow**.
3. Select the branch and start it.
4. Open the `verify-runner` job. Its log prints the runner name, Windows operating system, machine name, and workspace path.
5. Confirm that the machine name matches your local computer and that the runner window shows the job activity.

The workflow is [`.github/workflows/self-hosted-runner.yml`](.github/workflows/self-hosted-runner.yml). Its `runs-on` value is `[self-hosted, windows, x64]`, so GitHub schedules it only on an online runner carrying all three labels.

## Security implications

A workflow job on a self-hosted machine can execute arbitrary code from the repository, pull requests, actions, and dependencies. That code can read files available to the runner account, use installed tools, consume network access, or leave changes behind. A compromised dependency or untrusted pull request can therefore affect the host and any reachable systems.

For learning, use a disposable or dedicated machine and a least-privileged runner account. Keep secrets out of the host, avoid running untrusted pull requests on this runner, restrict repository access, patch the operating system and runner, and remove the runner when it is no longer needed. Do not run the runner on a workstation containing personal files or production credentials.

## Why this is separate from Phase 10 CI

The existing security workflow uses Linux commands and `ubuntu-latest`. This verification workflow is Windows-specific and proves local execution without changing the Phase 10 security scan behavior. The complete self-hosted CI/CD pipeline can be moved to this runner after its required tools are installed and the Minikube phase is ready.
