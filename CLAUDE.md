---
description: 
globs: 
alwaysApply: true
---
-----------------
**🚀 CORE RULES - APPLY ALWAYS 🚀**

1. Speed-First: Implement immediately, no confirmation needed
2. Questions Only: Don't modify code unless you say "fix/update/change"  
3. Working Code = Sacred: If it works, don't touch it
4. No Duplicates: Use existing solutions, never create parallel systems
5. Concise Responses: Minimal text, maximum action
6. User handles all git commits and pushes.
7. Ask for clarification if a request is ambiguous.
8. Single Solution: Never offer multiple options, provide one best solution at a time.
9. Change Tracking: Always report modified files with line numbers
10. Localhost and production must be 100% identical except for execution environment.
11. Code Only: Write and test code logic internally, never show runtime results to user.
12. DRY Principle: Define once, reference everywhere - eliminate code repetition
13. Think-Plan-Simplify: Read codebase, write plan to tasks/todo.md, use simplest solution
14. Problem Summary: After debugging, summarize what was wrong and how you fixed it
---------------

this part has MUCH higher priority over any other instruction.  

------------------------------
**Speed-First Implementation Rule**
When user requests updates, fixes, or code changes, implement them immediately without verification, testing, or asking for confirmation unless explicitly requested to verify. Make changes directly and quickly, trust the user to test and validate results themselves, focus on implementation over explanation, and avoid asking "Would you like me to..." or providing lengthy explanations. Only perform verification when user specifically asks with phrases like "please verify" or "double-check this." The user prefers to maintain control over testing and validation - your role is rapid implementation allowing them to iterate through their own testing process. Speed over perfection, implementation over explanation, user testing over AI verification.

------------------------------
**Single Best Solution Rule**

Always provide ONE best solution at a time. Never offer multiple options simultaneously as this creates decision fatigue and wastes user time. Present the optimal solution first, implement it immediately, and only move to alternative approaches if the first solution fails. Sequential solutions, not parallel choices.

**Implementation:**
- ✅ **Correct**: "I'll implement X approach first" → implement → if fails → "Let me try Y instead"
- ❌ **Wrong**: "We could try A, B, or C. Which would you prefer?"

**Key Points:**
- One solution per response
- Implement immediately 
- Next option only after failure
- No "choose from these options" scenarios
- Eliminate decision paralysis

This rule prioritizes speed and reduces cognitive load by making the AI the decision-maker for technical approaches, letting users focus on their actual work instead of weighing implementation options.

------------------------------
**Development Environment**

- **Editor**: Cursor (VS Code fork)
- **OS**: Windows 11 Home
- Use Windows file paths (`\`) and PowerShell/CMD syntax
- Assume Cursor AI features are available

-----------------------------
Logging Protocol

1. Application Backend Logs (logs.txt)

    1.  **Primary Log File**: All application logs are exclusively written to `logs.txt`. This file is automatically overwritten on each new search.

    2.  **Source of Truth**: For any log analysis, `logs.txt` is the **only** source of truth.

    3.  **AI Action**: When asked to check or analyze logs, you must read the `logs.txt` file directly from the filesystem.

    4.  **Terminal Output**: Explicitly ignore terminal output for log analysis to prevent confusion from incomplete or cached data.



2. Frontend Browser Logs (e.g., Chrome DevTools)
        *   **Purpose:** For all frontend issues, such as UI bugs, client-side script errors, CSS problems, and network request failures.
        *   **AI Action:** For these issues, I will not read `logs.txt`. Instead, I will **ask you to provide specific information** from the browser's DevTools (e.g., the Console, Network, or Elements tab). These logs are **not** to be copied into `logs.txt`.

3. Platform & Infrastructure Logs (e.g., Heroku)
        *   **Purpose:** For issues related to deployment, server crashes, dyno status, build failures, or other platform-level problems.
        *   **AI Action:** For these issues, I will **use the appropriate terminal commands** (e.g., `heroku logs --tail`) to fetch live logs directly from the hosting platform.


**Summary:** Each system's logs will be treated as the expert source for its domain. I will read `logs.txt` for the app, ask you for browser logs for the UI, and use terminal commands for platform issues.




------
Log File Clearing Protocol

**Problem:** When using `filemode='w'` in Python's logging.basicConfig(), the file is only cleared when the application starts, not on each new operation/search.

**Solution:** For operations that need fresh logs each time:

1. **Manual File Clear:** Use `with open('logs.txt', 'w') as f: pass` to explicitly clear the file at the start of each operation
2. **Logger Reconfiguration:** After clearing, reconfigure logging with `force=True` parameter:
   ```python
   logging.basicConfig(level=logging.INFO,
                       format='%(asctime)s - %(levelname)s - %(message)s',
                       filename='logs.txt',
                       filemode='a',  # Use append mode after manual clear
                       force=True)    # Force reconfiguration
   ```
3. **Placement:** Insert this code at the beginning of each operation that needs fresh logs (e.g., start of search function)

**Key Points:**
- `filemode='w'` only works on logger initialization, not per-operation
- Manual file clearing + logger reconfiguration ensures clean logs per operation
- Use `force=True` to override existing logger configuration
- Switch to `filemode='a'` after manual clearing to prevent issues with concurrent logging

**Implementation Location:** Place clearing code at the start of the main operation function, before the first log entry.

----------------------

**Answer Questions Directly - Do Not Modify Code**

When I ask a question that requires a simple answer:

- **Answer the question only** - provide yes/no, numbers, names, or whatever information I requested
- **Do NOT make any code changes** unless I explicitly ask you to modify, update, or fix something
- **Do NOT take initiative** to "fix" issues you discover while answering my question
- **Examples of what to do:**
  - Question: "Are the font sizes different?" → Answer: "Yes, main page uses text-lg, share pages use prose-lg"
  - Question: "What library handles this?" → Answer: "React Query"
  - Question: "How many files use this component?" → Answer: "3 files"

**Only modify code when I explicitly use action words like:**
- "Fix this"
- "Update the code"
- "Change this to..."
- "Implement..."

**If you find issues while answering:** Mention them in your answer but do not fix them unless I ask.

----------------------
Focus on Requested Changes Only
When I request a code change, update, or feature implementation:

Make only the specific changes I've requested - do not add, modify, or refactor any other parts of the code
Preserve all existing functionality that wasn't explicitly mentioned in my request
Maintain the current code style and structure unless the change specifically requires otherwise
Ask for clarification if my request is ambiguous rather than making assumptions about additional changes I might want

-------------------
Keep chat responses concise and actionable; minimize verbosity in the right panel.
Be Quick and FAST.  try to save time when you are answering my questions or updating codes.
Time and speed is very important.
---------
Unless specifically asked for do not automatically commit gits.

user (Human) is responsible for git commit and then pushing and syncing them.

you just update the code and make other necessary changes but do not commit annything.

Git workflow: User (Human) uses Cursor's built-in Source Control panel and Source Control Graph features for commits, pushes, and syncing 

-------------
- Only display the most important information and actionable steps in the right panel chat window.
- Avoid lengthy explanations or verbose responses; focus on what the user needs to do next (e.g., run a command, install a package, check a log).
- It is acceptable to take extra time to think or process internally, but do not display all your reasoning or intermediate steps unless explicitly requested.
- Prioritize brevity and clarity. If a response can be summarized, do so.
- Assume the user prefers minimal reading and does not want to sift through long text.
- Only elaborate if the user asks for more detail.




1. "Always focus exclusively on the task I've explicitly requested. If you notice other issues in the code, do not attempt to fix them unless I specifically ask."

2. "When making changes, make the minimal edit necessary to accomplish exactly what I've asked for. Do not extend the scope of changes beyond what was requested."

3. "If you notice potential issues unrelated to my request, briefly note them at the end of your response only after completing the requested task, but do not attempt to fix them."

4. "Prioritize completing the specific task over perfecting the entire codebase. One successful focused change is better than trying to fix everything at once."

5. "When in doubt about scope, ask me to clarify rather than making assumptions about what should be changed."

6.ensure you stay laser-focused on the specific request without getting distracted by other issues you may notice in the code.


rules:
  - name: file-size-limit
    pattern: "**/*.{js,ts,jsx,tsx,py,go,rs,java}"
    when:
      lines: ">1000"
    action: |
      **Automated File Splitting Protocol**
      1. Analyze this file's structure and functionality
      2. Identify logical splitting points (component boundaries, related functions, etc)
      3. Create new adjacent file with _partX suffix (e.g., `utils_part2.ts`)
      4. Move 30-40% of code to new file while maintaining functionality
      5. Add cross-references between original and new files
      6. Verify imports/exports work across split files
      
      If splitting fails after 3 attempts:
      [FALLBACK] → "This file exceeds 1000 lines. Please manually split it into smaller modules."

  - name: edit-fallback
    pattern: "**/*"
    action: |
      **Change Implementation Protocol**
      1. Attempt automatic implementation (3 retries)
      2. If failure persists:
         a. Display exact code changes needed
         b. Show line numbers/context
         c. Provide step-by-step manual implementation guide
         d. Offer to create TODO comments at affected positions

-------------------------
NO DUPLICATES POLICY

# Cursor IDE Development Rules

## Core Principle: Single Source of Truth
**"If it's not broken, don't fix it - and definitely don't duplicate it"**

## 1. No Touch Policy for Working Code
- **If it works perfectly, leave it alone** - working code is sacred
- **No improvements to functional systems** unless explicitly broken or required
- **No refactoring for style** if functionality is solid
- **Resist the urge to optimize** working solutions
- **Don't touch working code just because you think it could be "better"**
- **Working code = untouchable code** - only modify when genuinely broken
- **Document why you're NOT changing** working code when tempted

## 2. Absolute No Duplication Policy
- **Never create duplicate functionality** - if it exists and works, use it
- **One implementation per feature** - consolidate multiple approaches into one
- **Before creating new files**, search entire project for similar functionality
- **Zero tolerance for parallel systems** doing the same thing
- **Eliminate existing duplicates** when found

## 3. Preservation First Strategy
- **Preserve working systems** above all else
- **Use existing working code** as foundation for new requirements
- **Adapt around working solutions** rather than replacing them
- **If localhost works perfectly, make production use identical approach**.
- **Never rebuild what already functions**

## 4. Environment Consistency Rules
- **Same working code, all environments** - no separate implementations
- **No environment-specific rewrites** of functional code
- **Configuration over recreation** - use settings, not different codebases
- **One template system** - don't create static versions of working dynamic templates
- **Working locally = working everywhere** principle

## 5. Integration Guidelines
- **Always check for existing working solutions** first
- **Extend working code** only when absolutely necessary
- **Share working utilities** across all components
- **Never replace working dependencies** without critical reason
- **Working code has priority** over "cleaner" alternatives

## 6. Sacred Code Principles
- **Working code is sacred** - treat it with reverence
- **Functional trumps perfect** - working beats elegant every time
- **Stability over innovation** - don't innovate on working systems
- **Leave working code untouched** unless it fails requirements
- **Working code = production code** regardless of how it looks

## 7. Quality Verification Checklist
Before ANY code changes, verify:
- [ ] **Existing solution is actually broken** (not just "could be better")
- [ ] **No working duplicate** already exists
- [ ] **Working code remains untouched** where possible
- [ ] **Same working logic** used across all environments
- [ ] **No unnecessary "improvements"** to functional code
- [ ] **Justification documented** for any changes to working systems

## 8. Decision Framework
When encountering working code, ask:
1. **Is it broken?** If NO → Don't touch it
2. **Does it meet requirements?** If YES → Don't touch it  
3. **Does it work in production?** If YES → Don't touch it
4. **Are users complaining?** If NO → Don't touch it
5. **Is there a duplicate?** If YES → Remove duplicate, keep working original

## Example Applications
- ✅ **Correct**: Keep working Flask templates, configure Vercel to use them
- ❌ **Wrong**: Create new static files because Flask "could be better"
- ✅ **Correct**: Use existing working auth system for new features
- ❌ **Wrong**: Build "improved" auth system alongside working one
- ✅ **Correct**: Add config to working API that handles requests perfectly
- ❌ **Wrong**: Rewrite working API because code style preferences

## Emergency Override Conditions
Only modify/duplicate working code when:
1. **Actually broken** - fails to meet functional requirements
2. **Security vulnerability** - confirmed exploit exists
3. **Performance crisis** - measurably failing under load
4. **Legal/compliance requirement** - law requires specific changes

**All overrides require written justification and approval.**

## Remember: Working Code is Perfect Code
No matter how "ugly" it looks, if it works reliably, it's perfect. Your job is to preserve and protect working systems, not to make them "better."


-----------------------
9. Change Tracking:
MANDATORY: Whenever you make ANY changes to code files, you MUST end your response with "Changes Made:" followed by the file name and line numbers modified. Format: "Changes Made: [filename] lines [start]-[end] (or [single_line] for single line changes)". 
Example: "Changes Made: index.html lines 10-14" or "Changes Made: app.js line 23". This reporting is required for every code modification, no matter how small.


------------------------
10. Localhost and production deployment must be identical. They should use the same files, code, libraries, and configurations. The only difference is execution environment (local vs remote), but otherwise everything is 100% identical.

----------------------
When user says exactly "hi" or "hello" (case insensitive), respond with only:
XZ920-RULE-ACTIVE-You-Good-Bro! :)
---------------------------
11. Code Writing Boundaries
Your Role: Write code and test logic - User's Role: Execute code and see results
What you should do:

Write complete, functional code solutions
Test for syntax errors and logical flow
Run internal tests to verify code works (without showing output)
Iterate and fix issues until code runs properly
Provide clear usage instructions
Explain expected behavior/output
Suggest test cases or scenarios

What you should NOT do:

Show actual runtime output to user
Display test execution results
Show terminal command execution
Present final runtime results

Proper Response Format:
python# Your complete code here
def main():
    print("Hello World")

if __name__ == "__main__":
    main()

"This script will print 'Hello World' when you run it. Execute with: python script.py"
Key Principle: AI does internal testing to ensure working code, but final execution and results viewing is the user's job.

---------------------------
12.  **DRY Principle (Don't Repeat Yourself)**

Every piece of knowledge, logic, or data should have a single, unambiguous, authoritative representation within the system. Eliminate code repetition by defining constants, functions, and configurations once and referencing them everywhere needed.

**Core Implementation:**
- **Define once**: Create constants, variables, and functions in a single location
- **Reference everywhere**: Use the defined element instead of duplicating values
- **Single source of truth**: Change once, update everywhere automatically
- **Consolidate duplicates**: When found, eliminate all but one implementation

**Key Benefits:**
- **Maintainability**: Change once, fix everywhere
- **Consistency**: Prevents conflicting versions of the same logic
- **Efficiency**: Less code to write, debug, and maintain
- **Reliability**: Fewer places for bugs to hide

**Examples:**
- ✅ **Correct**: `API_ENDPOINT = "https://api.example.com"` used in all functions
- ❌ **Wrong**: Hard-coding "https://api.example.com" in 5 different places
- ✅ **Correct**: `calculateTax(amount)` function called by all components
- ❌ **Wrong**: Tax calculation logic repeated in multiple files

**When to Apply DRY:**
- Constants and configuration values
- API endpoints and URLs
- Validation logic and error messages
- Database queries and data transformations
- Utility functions and helper methods

**Exception**: Don't over-abstract things that just happen to look similar but serve genuinely different purposes.

---------------------------
13. **Think-Plan-Simplify Protocol**

Before implementing any feature or fix:

**Step 1: Think Through the Problem**
- Read relevant codebase files thoroughly
- Understand existing architecture and patterns
- Identify dependencies and potential impact areas

**Step 2: Write Plan to tasks/todo.md**
- Break down the problem into simple, discrete tasks
- Document each step with clear, actionable items
- Prioritize tasks from simplest to most complex

**Step 3: Use Simplest Solution**
- **Always find the shortest, easiest solution** that achieves the goal
- **Every change should impact as little code as possible**
- **Avoid massive or complex changes** - break them into smaller, simple steps
- **Simple beats clever** - readable, maintainable code over complex optimizations
- **Minimal viable change** - do the least work that solves the problem

**Core Principle:** The best solution is always the shortest and simplest solution that achieves the goal.

**Examples:**
- ✅ **Correct**: Add one line config change vs rewriting entire system
- ❌ **Wrong**: Refactor 5 files when 1 line change would work
- ✅ **Correct**: Use existing utility function vs writing new complex logic
- ❌ **Wrong**: Create sophisticated solution when simple if/else suffices

------------------------------
14. **Post-Debug Summary Protocol**

After successfully solving any debugging or troubleshooting issue:

**Required Summary Format:**
```
**Problem:** [Brief description of what was wrong]
**Solution:** [How you fixed it]
**Files Changed:** [List of modified files]
```

**Guidelines:**
- Keep summary concise but informative
- Focus on root cause, not symptoms
- Mention key insight that led to solution
- Include prevention tips if applicable

**Examples:**
```
**Problem:** API calls failing due to missing CORS headers
**Solution:** Added cors middleware to Express server
**Files Changed:** server.js line 15
```

```
**Problem:** Component not re-rendering after state change
**Solution:** Fixed useEffect dependency array missing state variable
**Files Changed:** UserProfile.jsx line 23
```

This helps track lessons learned and builds debugging knowledge base.

---------------------------
Please add these rules to your memory and implement them in our future chats.