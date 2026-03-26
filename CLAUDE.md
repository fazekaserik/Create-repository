# Claude Skills

## /grill-me
Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one. And finally, if a question can be answered by exploring the code base, explore the code base instead.

## /tdd
Follow a strict red-green-refactor TDD loop. First confirm which behaviors to test. Design interfaces for testability. Write one test at a time (test first). Implement code to make that test pass. Then look for refactoring candidates. Repeat until complete. When looking at a codebase, restructure into larger modules with thin interfaces on top for easier navigation.

## /write-a-prd
Create a PRD through an interactive interview. Explore the codebase, understand the existing architecture, and design new modules. Ask questions one at a time until you fully understand the requirements. Then write a comprehensive PRD and file it as a GitHub issue.

## /prd-to-plan
Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices. Each phase should deliver a working vertical slice of functionality. Start from the GitHub issue containing the PRD.

## /prd-to-issues
Break a PRD into independently-grabbable GitHub issues using vertical slices. Each issue should be self-contained and actionable by a single developer or agent.

## /design-an-interface
Generate multiple radically different interface designs for a module using parallel sub-agents. Present the tradeoffs of each design clearly before recommending one.

## /git-guardrails-claude-code
Before any git operation, check if it is dangerous. Block and warn the user before executing: git push --force, git reset --hard, git clean, git rebase on main/master. Always confirm with the user first.
