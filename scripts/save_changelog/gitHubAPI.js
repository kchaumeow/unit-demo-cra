const { Octokit } = require("@octokit/rest");

module.exports = class GitHubAPI {
  constructor(token, owner, repo) {
    this.octokit = new Octokit({
      auth: token,
    });
    this.owner = owner;
    this.repo = repo;
  }

  fetchRepoIssues = () =>
    this.octokit.rest.issues.listForRepo({
      owner: this.owner,
      repo: this.repo,
    });

  updateIssue = ({ issueNumber, labels, title, body, state }) =>
    this.octokit.rest.issues.update({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      state,
      assignees: [this.owner],
      labels,
      issue_number: issueNumber,
    });

  createIssue = ({ title, body, labels }) =>
    this.octokit.rest.issues.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      assignees: [this.owner],
      labels,
    });
};
