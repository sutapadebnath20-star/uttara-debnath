import { ChallengeTestCase } from '../types';

export interface TestExecutionResult {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  inputDescription: string;
  error?: string;
  logs: string[];
}

export interface RunResult {
  allPassed: boolean;
  results: TestExecutionResult[];
  consoleLogs: string[];
  executionTimeMs: number;
  runtimeError?: string;
}

/**
 * Safely executes JavaScript code against predefined test cases in a sandboxed Function scope.
 */
export function executeChallengeCode(
  userCode: string,
  functionName: string,
  testCases: ChallengeTestCase[]
): RunResult {
  const startTime = performance.now();
  const consoleLogs: string[] = [];

  // Capture console.log
  const customConsole = {
    log: (...args: any[]) => {
      const formatted = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      consoleLogs.push(formatted);
    },
    error: (...args: any[]) => {
      consoleLogs.push('[ERROR] ' + args.join(' '));
    },
    warn: (...args: any[]) => {
      consoleLogs.push('[WARN] ' + args.join(' '));
    }
  };

  try {
    // Wrap code and instantiate the user function
    // We pass customConsole as `console`
    const wrappedFactory = new Function(
      'console',
      `
      ${userCode}
      if (typeof ${functionName} !== 'function') {
        throw new Error("Function '${functionName}' is not defined. Make sure you defined 'function ${functionName}(...)'");
      }
      return ${functionName};
      `
    );

    const targetFunction = wrappedFactory(customConsole);

    const results: TestExecutionResult[] = testCases.map(tc => {
      const tcLogs: string[] = [];
      const testConsole = {
        log: (...args: any[]) => tcLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
      };

      try {
        // Deep copy inputs to prevent mutation across tests
        const clonedInputs = JSON.parse(JSON.stringify(tc.inputs));
        const rawOutput = targetFunction(...clonedInputs);

        let actualFormatted = '';
        if (rawOutput === undefined) {
          actualFormatted = 'undefined';
        } else if (typeof rawOutput === 'string') {
          actualFormatted = `"${rawOutput}"`;
        } else {
          actualFormatted = JSON.stringify(rawOutput);
        }

        // Compare normalized strings
        const normalizedActual = actualFormatted.trim();
        const normalizedExpected = tc.expectedOutput.trim();

        const passed = normalizedActual === normalizedExpected;

        return {
          passed,
          actualOutput: actualFormatted,
          expectedOutput: tc.expectedOutput,
          inputDescription: tc.inputDescription,
          logs: tcLogs
        };
      } catch (err: any) {
        return {
          passed: false,
          actualOutput: 'Runtime Exception',
          expectedOutput: tc.expectedOutput,
          inputDescription: tc.inputDescription,
          error: err.message || String(err),
          logs: tcLogs
        };
      }
    });

    const allPassed = results.length > 0 && results.every(r => r.passed);
    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      allPassed,
      results,
      consoleLogs,
      executionTimeMs
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      allPassed: false,
      results: [],
      consoleLogs,
      executionTimeMs,
      runtimeError: err.message || 'Syntax error in your code'
    };
  }
}
