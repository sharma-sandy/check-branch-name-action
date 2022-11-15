const core = require("@actions/core");
const github = require("@actions/github");

try {
  const payload = github.context.payload;
  const prNumber = payload.pull_request.number;
  const prBody = payload.pull_request.body;
  const prTitle = payload.pull_request.title;
  const github_token = core.getInput("token");
  const octokit = github.getOctokit(github_token);
  if (prTitle === null) {
    octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: prNumber,
      body: "PR title is missing",
    });
    core.setFailed("PR title is not provided");
  }
  if (prBody === null) {
    octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: prNumber,
      body: "PR title is missing",
    });
    core.setFailed("PR Description is not provided");
  }
  const baseBranchName = payload.pull_request.base.ref;
  const headBranchName = payload.pull_request.head.ref;
  console.log(`Got PR to merge from ${headBranchName} -> ${baseBranchName}`);
  const message = `Running evaluation on ${headBranchName}`;
  core.setOutput("message", message);
} catch (error) {
  core.setFailed(error.message);
}
