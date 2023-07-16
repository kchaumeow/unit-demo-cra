const GitHubAPI = require("./gitHubAPI");

async function writePagesUrl() {
  const token = process.argv[2];
  const [owner, repo] = process.argv[3].split("/");
  const gitHubAPI = new GitHubAPI(token, owner, repo);
  ghPagesUrl = process.argv[4];
  const currentRepoIssue = (await gitHubAPI.fetchRepoIssues())[-1];
  await gitHubAPI.updateIssue({
    issueNumber: currentRepoIssue.number,
    title: currentRepoIssue.title,
    body: currentRepoIssue.body + '\n' + `Deployment: ${ghPagesUrl}`,
    labels: ["RELEASE"],
  });
}
