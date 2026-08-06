#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# Default configuration
DEFAULT_BRANCH="main"
DELETE_MODE=false
CLEANUP_ALL=false

# Print usage instructions
show_help() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  --merged     Only remove branches that have been fully merged into $DEFAULT_BRANCH (default)"
  echo "  --all        Remove ALL branches that are not the default branch ($DEFAULT_BRANCH) or the current branch"
  echo "  --delete     Actually delete the branches (both local and remote). If not specified, performs a dry-run"
  echo "  --help       Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0                 # Dry-run of merged branches cleanup"
  echo "  $0 --delete        # Actually delete merged branches on local and remote"
  echo "  $0 --all --delete  # Actually delete ALL non-default, non-current branches"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --merged)
      CLEANUP_ALL=false
      shift
      ;;
    --all)
      CLEANUP_ALL=true
      shift
      ;;
    --delete)
      DELETE_MODE=true
      shift
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

echo "--------------------------------------------------------"
echo "Git Branch Cleanup Utility"
echo "--------------------------------------------------------"
echo "Target Default Branch : $DEFAULT_BRANCH"
echo "Cleanup Mode          : $([ "$CLEANUP_ALL" = true ] && echo "ALL non-default/non-current branches" || echo "Merged branches only")"
echo "Execution Mode        : $([ "$DELETE_MODE" = true ] && echo "REAL DELETE" || echo "DRY-RUN (No changes will be made)")"
echo "--------------------------------------------------------"

# Ensure we are in a git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: Not inside a git repository."
  exit 1
fi

# Fetch remote branches and update tracking
echo "Fetching latest branch info from origin..."
git fetch origin --prune

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current active branch : $CURRENT_BRANCH"

# List of branches to protect (never delete)
PROTECTED_BRANCHES=("$DEFAULT_BRANCH" "$CURRENT_BRANCH" "master" "develop")

is_protected() {
  local branch="$1"
  for protected in "${PROTECTED_BRANCHES[@]}"; do
    if [[ "$branch" == "$protected" ]]; then
      return 0
    fi
  done
  return 1
}

trim_whitespace() {
  local var="$1"
  var="${var#"${var%%[![:space:]]*}"}"
  var="${var%"${var##*[![:space:]]}"}"
  echo "$var"
}

# 1. Identify branches to delete
declare -a branches_to_delete

if [ "$CLEANUP_ALL" = true ]; then
  echo "Scanning for all remote branches..."
  # Get all remote tracking branches, strip origin/ prefix, and trim whitespace
  while IFS= read -r r_branch; do
    r_branch=$(trim_whitespace "$r_branch")
    if [ -n "$r_branch" ] && ! is_protected "$r_branch"; then
      branches_to_delete+=("$r_branch")
    fi
  done < <(git branch -r | grep -v 'HEAD ->' | sed 's/^[[:space:]]*origin\///')
else
  echo "Scanning for merged remote branches..."
  # Get remote branches merged into origin/main, strip origin/ prefix, and trim whitespace
  while IFS= read -r r_branch; do
    r_branch=$(trim_whitespace "$r_branch")
    if [ -n "$r_branch" ] && ! is_protected "$r_branch"; then
      branches_to_delete+=("$r_branch")
    fi
  done < <(git branch -r --merged "origin/$DEFAULT_BRANCH" | grep -v 'HEAD ->' | sed 's/^[[:space:]]*origin\///')
fi

if [ ${#branches_to_delete[@]} -eq 0 ]; then
  echo "No branches found matching the cleanup criteria."
  exit 0
fi

echo "Found ${#branches_to_delete[@]} branch(es) to clean up:"
for branch in "${branches_to_delete[@]}"; do
  echo "  - $branch"
done
echo ""

if [ "$DELETE_MODE" = false ]; then
  echo "DRY-RUN mode. To execute these deletions, run this script with the --delete flag:"
  if [ "$CLEANUP_ALL" = true ]; then
    echo "  $0 --all --delete"
  else
    echo "  $0 --delete"
  fi
  exit 0
fi

# 2. Perform deletion
echo "Starting deletion..."
LOCAL_DEL_FLAG="-d"
if [ "$CLEANUP_ALL" = true ]; then
  LOCAL_DEL_FLAG="-D"
fi

for branch in "${branches_to_delete[@]}"; do
  echo "Processing branch: $branch"
  
  # Delete remote branch
  echo "  Deleting remote branch 'origin/$branch'..."
  if git push origin --delete "$branch"; then
    echo "  Successfully deleted remote branch 'origin/$branch'."
  else
    echo "  Warning: Failed to delete remote branch 'origin/$branch' (it might have been deleted already or you lack permissions)."
  fi

  # Delete local branch if it exists
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    echo "  Deleting local branch '$branch'..."
    if git branch "$LOCAL_DEL_FLAG" "$branch" >/dev/null 2>&1; then
      echo "  Successfully deleted local branch '$branch' (flag: $LOCAL_DEL_FLAG)."
    else
      echo "  Warning: Failed to delete local branch '$branch' with flag $LOCAL_DEL_FLAG."
    fi
  fi
done

echo ""
echo "Branch cleanup complete!"
