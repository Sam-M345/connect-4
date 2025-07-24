# Diagnostic Mode: Root Cause Analysis

## Objective

Identify the exact root cause of the issue without implementing any fixes, including potential cache-related problems. Use step isolation to systematically narrow down the problematic component.

## Investigation Process

### Phase 1: Step Isolation and Breakdown

**Step up the vibe: Break down your request into independently testable steps**

Before diving into detailed code analysis, decompose the problematic functionality to isolate the exact failing component:

1. **Workflow Decomposition**
   - Map out all major steps/modules involved in the failing process
   - Identify clear input/output boundaries for each step
   - List dependencies between steps
   - Create a visual or written flow diagram of the process

2. **Independent Step Testing**
   - Design minimal test cases for each isolated component
   - Test each step independently with known good inputs
   - Document which steps pass/fail with confidence levels
   - Focus remaining diagnostic effort only on failing steps

3. **Boundary Analysis**
   - Examine data flow between working and failing steps
   - Verify assumptions about data format/state at step boundaries
   - Log intermediate states at critical handoff points
   - Identify where expectations diverge from reality

4. **Scope Reduction**
   - Eliminate working components from further investigation
   - Laser focus on the 1-2 problematic steps identified
   - Document confirmed working components to avoid re-testing

### Phase 2: Detailed Analysis of Problematic Steps

1. Analyze relevant code files and execution paths for identified failing steps only
2. Trace data flow to identify where behavior deviates from expectations
3. Insert strategic logging statements with clear identifiers (e.g., [DIAG-1])
4. Examine environment variables and configuration that might impact behavior
5. Investigate potential cache issues:
   - Check server-side caching configuration
   - Verify browser cache state
   - Examine cache headers in responses
   - Compare development vs production caching behavior

## Cache Investigation Steps

1. **Server Cache Check**
   - Verify deployment status
   - Check server cache configuration
   - Examine static file serving settings
   - Review server logs for cache-related issues

2. **Browser Cache Analysis**
   - Check browser's cache storage
   - Verify cache headers in network requests
   - Compare cached vs server file versions
   - Test with different browsers to isolate issues

3. **Environment-Specific Checks**
   - Compare development vs production behavior
   - Verify auto-reload settings
   - Check static file serving configuration
   - Examine build process impact on caching

## Constraints

- Do not modify existing code functionality
- Do not implement or suggest fixes at this stage
- Focus solely on accurate diagnosis and evidence collection
- Document all cache-related findings separately
- Test steps independently before examining interactions

## Output Requirements

- Clear the terminal first (CLS) to avoid confusion with previous logs
- **Step Isolation Results**: Document which steps work vs fail before detailed analysis
- Add detailed, timestamped logs with contextual information
- Identify any potential failure points with confidence levels
- Document system state at critical moments in execution flow
- Include cache-specific diagnostic information:
  - Server cache status
  - Browser cache state
  - Cache headers present
  - Environment-specific caching behavior

### Confidence Level Reporting

- **Initial Assessment**: State the initial confidence level in understanding the problem and potential solutions (e.g., "Initial Confidence: 3/10")
- **Post-Step Isolation**: Update confidence after identifying working vs failing steps (e.g., "Post-Isolation Confidence: 7/10 - narrowed down to authentication module")
- **Progressive Updates**: Periodically provide updated confidence levels after significant findings (e.g., "Confidence Update: 9/10 - logs show exact failure point in data validation")
- **Scale**: 0 (no idea) to 10 (full understanding and clear path to solution)
- This helps gauge AI's current understanding and diagnostic progress

### Step Isolation Documentation Template

```
## Step Breakdown Analysis

### Identified Steps:
1. [Step Name] - [Brief Description]
2. [Step Name] - [Brief Description]
...

### Test Results:
✅ Step 1: [Name] - WORKING (Confidence: X/10)
✅ Step 2: [Name] - WORKING (Confidence: X/10)
❌ Step 3: [Name] - FAILING (Confidence: X/10)
✅ Step 4: [Name] - WORKING (Confidence: X/10)

### Focus Area:
Laser focusing on Step 3: [Name] as other components verified working.

### Next Actions:
Detailed analysis of [failing step] including [specific areas to investigate]
```

### Log Location Guidance

**CRITICAL REQUIREMENT**: When logging is implemented as part of this diagnostic process, the AI MUST clearly specify the exact location where logs will appear. Never assume the user knows where to find diagnostic output.

#### Common Log Locations:

- **VS Code/Cursor Integrated Terminal:** For Python scripts, Node.js applications, or any server-side processes that print to standard output/error, logs will typically appear here. If the AI instructs you to run a command that produces console output, this is where you'll find it.

- **Browser Developer Console:** For client-side issues (e.g., JavaScript errors, front-end behavior), logs will be found in your browser's Developer Console (usually accessed by pressing F12 and going to the "Console" tab).

- **Cloud Platform Dashboards:**
  - **Heroku Dashboard:** Check the "View logs" section in your Heroku app dashboard
  - **Google Cloud Dashboard:** Navigate to Cloud Logging in the Google Cloud Console
  - **AWS CloudWatch:** Check CloudWatch Logs in your AWS console
  - **Vercel Dashboard:** Check the "Functions" tab for serverless function logs
  - **Netlify Dashboard:** Check the "Functions" or "Deploy" logs section

- **Local Log Files:** If the application writes to specific files:
  - **@logs.txt** in VS Code root directory
  - **application.log** in project directory
  - **debug.log** in project root
  - Custom log files as specified by the application

- **Container/Service Logs:**
  - **Docker:** Use `docker logs [container-name]` command
  - **PM2:** Use `pm2 logs` command
  - **Systemd:** Use `journalctl -u [service-name]` command

#### Mandatory Log Location Specification

_The AI performing the diagnostics MUST clearly state where the logs are expected to appear. For example:_

- "After running the script, please copy the output from the **Cursor / VSCode Integrated Terminal**."
- "Open your browser's Developer Tools (F12), go to the **Console tab**, reproduce the issue, and then copy any new log messages that appear."
- "Check your **Heroku Dashboard** → [App Name] → More → View logs for the diagnostic output."
- "Navigate to **Google Cloud Console** → Logging → Logs Explorer to find the diagnostic messages."
- "I've added logging that will write to **@logs.txt** file in your VS Code root directory. Please check this file after performing the action."
- "The diagnostic output will be printed directly to your **VS Code terminal** below."
- "Check the **Vercel Dashboard** → [Project Name] → Functions tab for serverless function logs."

#### Multiple Log Sources

When diagnostics involve multiple components, specify ALL relevant log locations:

```
Diagnostic logs will appear in multiple locations:
1. Frontend errors: Browser Developer Console (F12 → Console tab)
2. API logs: Heroku Dashboard → View logs
3. Database queries: @logs.txt file in VS Code root directory
4. Build process: VS Code Integrated Terminal

Please check ALL these locations and provide the relevant log outputs.
```

This ensures the user knows exactly where to look for the requested information and doesn't miss critical diagnostic data.

## Benefits of Step Isolation Approach

- **Efficiency**: Avoid debugging working code
- **Clarity**: Eliminate noise from functioning components
- **Focus**: Concentrate efforts on actual problem areas
- **Speed**: Faster resolution by reducing scope
- **Confidence**: Higher certainty about which components are reliable

## Note

All findings will be used to develop a targeted solution in the next phase. Cache-related issues should be documented separately to help distinguish between code and caching problems. Step isolation results should clearly identify the minimal set of components requiring detailed investigation.