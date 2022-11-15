const core = require("@actions/core");
const github = require("@actions/github");

try {
  const payload = github.context.payload;
  const baseBranchName = payload.pull_request.base.ref;
  const headBranchName = payload.pull_request.head.ref;
  console.log(`Got PR to merge from ${headBranchName} -> ${baseBranchName}`);
  const message = `Running evaluation on ${headBranchName}`;
  core.setOutput("message", message);
} catch (error) {
  core.setFailed(error.message);
}
