#!/bin/bash

# $1 is GITHUB_TOKEN, $2 is owner's name and $3 is repo's name

LAST_RELEASE_TAG=$(git tag --sort=-committerdate --list 'v*' | head -2 | tail -1)
CURRENT_RELEASE_TAG=$(git tag --sort=-committerdate --list 'v*' | head -1)

FILTER="$(git rev-list --max-parents=0 HEAD)..$CURRENT_RELEASE_TAG"

if [ $LAST_RELEASE_TAG != $CURRENT_RELEASE_TAG ]; then
  FILTER="$LAST_RELEASE_TAG..$CURRENT_RELEASE_TAG"
fi

CHANGELOG=$(git log $FILTER --no-decorate --pretty=format:"%cs %an | %B")

ISSUE_TITLE = "Release $CURRENT_RELEASE_TAG"

ISSUE_EXISTS = $(curl --write-out '%{http_code}' --silent --output /dev/null \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $1"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$2/$3/issues/$ISSUE_TITLE)
  
ISSUE_EXISTS = $([[ISSUE_EXISTS != 200]])

if ISSUE_EXISTS; then
curl -L \
  -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $1"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$2/$3/issues/ISSUE_NUMBER \
  -d '{"title":"Found a bug","body":"I'\''m having a problem with this.","assignees":["octocat"],"milestone":1,"state":"open","labels":["bug"]}'
else

fi