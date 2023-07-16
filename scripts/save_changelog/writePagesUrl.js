const GitHubAPI = require("./gitHubAPI");
const runCommand = require("./runCommand");

async function writePagesUrl() {
  const token = process.argv[2];
  const [owner, repo] = process.argv[3].split("/");
  const ghPagesUrl = process.argv[4];
  const gitHubAPI = new GitHubAPI(token, owner, repo);

  const currentReleaseTag = await runCommand(
    `sh ${__dirname}/get_current_release_tag.sh`
  );

  const issueTitle = `Release ${currentReleaseTag}`;

  const repoIssues = (await gitHubAPI.fetchRepoIssues()).data;
  const currentIssue = repoIssues.find((issue) => issue.title === issueTitle);

  await gitHubAPI.updateIssue({
    issueNumber: currentIssue.number,
    title: currentIssue.title,
    body: currentIssue.body + "\n" + `Deployment: ${ghPagesUrl}`,
    labels: ["RELEASE"],
    state: "closed",
    
  });
}
writePagesUrl();
