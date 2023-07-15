#!/bin/bash

LAST_RELEASE_TAG=$(git tag --sort=-committerdate --list 'v*' | head -2 | tail -1)
CURRENT_RELEASE_TAG=$(git tag --sort=-committerdate --list 'v*' | head -1)

FILTER="$(git rev-list --max-parents=0 HEAD)..$CURRENT_RELEASE_TAG"

if [ $LAST_RELEASE_TAG != $CURRENT_RELEASE_TAG ]; then
  FILTER="$LAST_RELEASE_TAG..$CURRENT_RELEASE_TAG"
fi

git log $FILTER --oneline --pretty=format:"%cs %an | %B"