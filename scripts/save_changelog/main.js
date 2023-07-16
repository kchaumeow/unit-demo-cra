const runCommand = require("./runCommand");
const GitHubAPI = require("./gitHubAPI");

async function main() {
  const token = process.argv[2];
  const workflowUrl = process.argv[4];
  const [owner, repo] = process.argv[3].split("/");
  const gitHubAPI = new GitHubAPI(token, owner, repo);

  const lastReleaseTag = await runCommand(
    `sh ${__dirname}/get_last_release_tag.sh`
  );

  const currentReleaseTag = await runCommand(
    `sh ${__dirname}/get_current_release_tag.sh`
  );

  let commitsFilter;

  if (lastReleaseTag == currentReleaseTag) {
    const firstCommit = await runCommand(`sh ${__dirname}/get_first_commit.sh`);
    commitsFilter = `${firstCommit}..${currentReleaseTag}`;
  } else {
    commitsFilter = `${lastReleaseTag}..${currentReleaseTag}`;
  }

  const changelogText = await runCommand(
    `sh ${__dirname}/get_changelog_for_range.sh ${commitsFilter} ${workflowUrl}`
  );

  const issueTitle = `Release ${currentReleaseTag}`;
  const repoIssues = await gitHubAPI.fetchRepoIssues();
  const alreadyCreatedIssue = repoIssues.data.find(
    (issue) => issue.title === issueTitle
  );

  if (alreadyCreatedIssue) {
    console.log(
      `Found already created issue: ${alreadyCreatedIssue.title}/${alreadyCreatedIssue.id}`
    );
    await gitHubAPI.updateIssue({
      issueNumber: alreadyCreatedIssue.number,
      title: issueTitle,
      body: changelogText,
      labels: ["RELEASE"],
    });
    console.log("Updated the issue");
  } else {
    console.log("No already created issue found");
    await gitHubAPI.createIssue({
      title: issueTitle,
      body: changelogText,
      labels: ["RELEASE"],
    });
    console.log(`Created new issue ${issueTitle}`);
  }
}

main();
