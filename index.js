const core = require("@actions/core");
const github = require("@actions/github");

try {
  const payload = github.context.payload;
  //console.log(payload);
  const prNumber = payload.pull_request.number;
  const prBody = payload.pull_request.body;
  const prTitle = payload.pull_request.title;
  const github_token = core.getInput("token");
  const octokit = github.getOctokit(github_token);
  const baseBranchName = payload.pull_request.base.ref;
  const headBranchName = payload.pull_request.head.ref;
  console.log(`Got PR to merge from ${headBranchName} -> ${baseBranchName}`);

  // core.error(new Error("message"), {
  //   title: "A title",
  //   file: "README.md",
  //   startColumn: 1,
  //   endColumn: 2,
  //   startLine: 1,
  //   endLine: 2,
  // });

  // check if PR title is provided
  if (prTitle === null) {
    octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: prNumber,
      body: "PR title is missing",
    });
    core.setFailed("PR title is not provided");
  }
  // check if PR description is provided
  if (prBody === null) {
    octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: prNumber,
      body: "PR Description is missing",
    });

    core.setFailed("PR Description is not provided");
  }

  octokit.rest.pulls.createReviewComment({
    ...github.context.repo,
    pull_number: prNumber,
    body: "Some comment",
    commit_id: payload.pull_request.head.sha,
    path: "README.md",
    line: 2,
  });
  const message = `Running evaluation on ${headBranchName}`;
  core.setOutput("message", message);
} catch (error) {
  core.setFailed(error.message);
}
