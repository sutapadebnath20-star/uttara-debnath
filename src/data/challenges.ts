import { CodingChallenge } from '../types';

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'ch-var-1',
    title: '1. Hello Variable World',
    category: 'Variables',
    difficulty: 'Easy',
    xpReward: 50,
    description: 'Create a function `formatGreeting(name)` that takes a student\'s name and returns the greeting: "Hello, [name]! Welcome to AI coding."\n\nVariables store values so we can reuse and customize messages!',
    conceptExplainer: 'A variable in JavaScript can be created using `const` or `let`. String concatenation or template literals (` `${name}` `) let you insert variables into text.',
    functionName: 'formatGreeting',
    starterCode: `function formatGreeting(name) {
  // Your code here
  // Return "Hello, " + name + "! Welcome to AI coding."
  
}`,
    testCases: [
      {
        inputDescription: '("Ada")',
        expectedOutput: '"Hello, Ada! Welcome to AI coding."',
        inputs: ['Ada']
      },
      {
        inputDescription: '("Alex")',
        expectedOutput: '"Hello, Alex! Welcome to AI coding."',
        inputs: ['Alex']
      },
      {
        inputDescription: '("Byte")',
        expectedOutput: '"Hello, Byte! Welcome to AI coding."',
        inputs: ['Byte']
      }
    ],
    solutionCode: `function formatGreeting(name) {
  return \`Hello, \${name}! Welcome to AI coding.\`;
}`,
    hints: [
      'Remember you can use string template literals like `Hello, ${name}! Welcome to AI coding.`',
      'Make sure punctuation matches exactly: exclamation mark after name and period at the end.',
      'Check that you are using the `return` keyword to output the result.'
    ]
  },
  {
    id: 'ch-cond-1',
    title: '2. Pass or Needs Practice',
    category: 'Conditionals',
    difficulty: 'Easy',
    xpReward: 75,
    description: 'Write a function `checkGrade(score)` that takes a test score (0 to 100). If the score is 60 or higher, return "Pass". If the score is below 60, return "Needs Practice".',
    conceptExplainer: 'Conditionals (`if` and `else`) allow your code to make decisions based on whether a condition is true or false.',
    functionName: 'checkGrade',
    starterCode: `function checkGrade(score) {
  // Use an if/else condition to check if score >= 60
  
}`,
    testCases: [
      {
        inputDescription: '(85)',
        expectedOutput: '"Pass"',
        inputs: [85]
      },
      {
        inputDescription: '(60)',
        expectedOutput: '"Pass"',
        inputs: [60]
      },
      {
        inputDescription: '(42)',
        expectedOutput: '"Needs Practice"',
        inputs: [42]
      }
    ],
    solutionCode: `function checkGrade(score) {
  if (score >= 60) {
    return "Pass";
  } else {
    return "Needs Practice";
  }
}`,
    hints: [
      'Use the `>=` comparison operator to check if score is greater than or equal to 60.',
      'Return "Pass" if true, otherwise in the else block return "Needs Practice".'
    ]
  },
  {
    id: 'ch-cond-2',
    title: '3. Movie Ticket Price',
    category: 'Conditionals',
    difficulty: 'Easy',
    xpReward: 90,
    description: 'Write `getTicketPrice(age)`:\n- Children under 12: $8\n- Seniors 65 and older: $10\n- Everyone else (12 to 64): $15\nReturn the number (e.g. 8, 10, or 15).',
    conceptExplainer: 'You can chain conditionals using `if`, `else if`, and `else` to test multiple conditions in order.',
    functionName: 'getTicketPrice',
    starterCode: `function getTicketPrice(age) {
  // Return 8 for under 12, 10 for 65+, 15 otherwise
  
}`,
    testCases: [
      {
        inputDescription: '(9)',
        expectedOutput: '8',
        inputs: [9]
      },
      {
        inputDescription: '(70)',
        expectedOutput: '10',
        inputs: [70]
      },
      {
        inputDescription: '(25)',
        expectedOutput: '15',
        inputs: [25]
      }
    ],
    solutionCode: `function getTicketPrice(age) {
  if (age < 12) {
    return 8;
  } else if (age >= 65) {
    return 10;
  } else {
    return 15;
  }
}`,
    hints: [
      'Start with `if (age < 12)`, followed by `else if (age >= 65)`.',
      'The final `else` handles anyone between 12 and 64 inclusive.'
    ]
  },
  {
    id: 'ch-loop-1',
    title: '4. Sum Numbers with a Loop',
    category: 'Loops',
    difficulty: 'Medium',
    xpReward: 100,
    description: 'Write a function `sumUpTo(n)` that calculates the sum of all whole numbers from 1 up to `n` (inclusive) using a loop.\nFor example, `sumUpTo(4)` should calculate 1 + 2 + 3 + 4 = 10.',
    conceptExplainer: 'Loops repeat code! A `for` loop has three parts: `for (let i = 1; i <= n; i++)`. An accumulator variable `let total = 0;` collects the sum on each cycle.',
    functionName: 'sumUpTo',
    starterCode: `function sumUpTo(n) {
  let total = 0;
  // Write a for loop that adds each number from 1 to n into total
  
  return total;
}`,
    testCases: [
      {
        inputDescription: '(4)',
        expectedOutput: '10',
        inputs: [4]
      },
      {
        inputDescription: '(1)',
        expectedOutput: '1',
        inputs: [1]
      },
      {
        inputDescription: '(10)',
        expectedOutput: '55',
        inputs: [10]
      }
    ],
    solutionCode: `function sumUpTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}`,
    hints: [
      'Start your loop variable `i` at 1, and loop while `i <= n`.',
      'Inside the loop, do `total += i;` or `total = total + i;`.'
    ]
  },
  {
    id: 'ch-loop-2',
    title: '5. Student FizzBuzz',
    category: 'Loops',
    difficulty: 'Medium',
    xpReward: 120,
    description: 'Write a function `fizzBuzzItem(num)`:\n- If `num` is divisible by both 3 and 5, return "FizzBuzz"\n- If `num` is divisible by 3, return "Fizz"\n- If `num` is divisible by 5, return "Buzz"\n- Otherwise, return the number as a string (e.g. "7")',
    conceptExplainer: 'The modulo operator `%` calculates the remainder of division. `num % 3 === 0` means `num` is divisible by 3 with no remainder.',
    functionName: 'fizzBuzzItem',
    starterCode: `function fizzBuzzItem(num) {
  // Check for divisibility by 3 and 5 first!
  
}`,
    testCases: [
      {
        inputDescription: '(15)',
        expectedOutput: '"FizzBuzz"',
        inputs: [15]
      },
      {
        inputDescription: '(9)',
        expectedOutput: '"Fizz"',
        inputs: [9]
      },
      {
        inputDescription: '(10)',
        expectedOutput: '"Buzz"',
        inputs: [10]
      },
      {
        inputDescription: '(7)',
        expectedOutput: '"7"',
        inputs: [7]
      }
    ],
    solutionCode: `function fizzBuzzItem(num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return "FizzBuzz";
  } else if (num % 3 === 0) {
    return "Fizz";
  } else if (num % 5 === 0) {
    return "Buzz";
  } else {
    return String(num);
  }
}`,
    hints: [
      'Always check `num % 3 === 0 && num % 5 === 0` FIRST so 15 is caught as FizzBuzz before being caught as just Fizz.',
      'Remember to convert plain numbers to strings using `String(num)` or `"" + num`.'
    ]
  },
  {
    id: 'ch-func-1',
    title: '6. Temperature Converter',
    category: 'Functions',
    difficulty: 'Easy',
    xpReward: 80,
    description: 'Write a function `celsiusToFahrenheit(celsius)` that converts Celsius to Fahrenheit using the formula:\n`F = (C * 9/5) + 32`.\nRound the result to 1 decimal place using `Math.round(val * 10) / 10`.',
    conceptExplainer: 'Functions encapsulate reusable calculations. They take parameters as inputs and return a computed result.',
    functionName: 'celsiusToFahrenheit',
    starterCode: `function celsiusToFahrenheit(celsius) {
  // Apply formula: (celsius * 9/5) + 32
  
}`,
    testCases: [
      {
        inputDescription: '(0)',
        expectedOutput: '32',
        inputs: [0]
      },
      {
        inputDescription: '(100)',
        expectedOutput: '212',
        inputs: [100]
      },
      {
        inputDescription: '(25)',
        expectedOutput: '77',
        inputs: [25]
      }
    ],
    solutionCode: `function celsiusToFahrenheit(celsius) {
  const f = (celsius * 9 / 5) + 32;
  return Math.round(f * 10) / 10;
}`,
    hints: [
      'Order of operations: multiply celsius by 9, divide by 5, then add 32.',
      'Store in a variable and return it.'
    ]
  },
  {
    id: 'ch-arr-1',
    title: '7. Find the Highest Score',
    category: 'Arrays',
    difficulty: 'Medium',
    xpReward: 110,
    description: 'Write a function `findHighestScore(scores)` that receives an array of numbers and returns the highest score in the array.\nIf the array is empty, return `0`.',
    conceptExplainer: 'Arrays hold ordered collections of values. You can iterate through an array with a loop or `Math.max(...scores)`.',
    functionName: 'findHighestScore',
    starterCode: `function findHighestScore(scores) {
  if (scores.length === 0) return 0;
  // Loop through scores to find the highest value
  
}`,
    testCases: [
      {
        inputDescription: '([45, 92, 78, 99, 64])',
        expectedOutput: '99',
        inputs: [[45, 92, 78, 99, 64]]
      },
      {
        inputDescription: '([12, 5, 20])',
        expectedOutput: '20',
        inputs: [[12, 5, 20]]
      },
      {
        inputDescription: '([])',
        expectedOutput: '0',
        inputs: [[]]
      }
    ],
    solutionCode: `function findHighestScore(scores) {
  if (scores.length === 0) return 0;
  let max = scores[0];
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > max) {
      max = scores[i];
    }
  }
  return max;
}`,
    hints: [
      'Initialize `let max = scores[0];`.',
      'For each element in the array, if `scores[i] > max`, update `max = scores[i]`.',
      'Alternatively, `Math.max(...scores)` works cleanly.'
    ]
  },
  {
    id: 'ch-algo-1',
    title: '8. AI Sentiment Keyword Matcher',
    category: 'Algorithms',
    difficulty: 'Hard',
    xpReward: 150,
    description: 'Build a mini AI sentiment analyzer! Write `analyzeSentiment(sentence)`:\n- Positive words: "great", "love", "awesome", "fantastic", "good"\n- Negative words: "bad", "hate", "terrible", "awful", "buggy"\n\nCount occurrences in the lowercase sentence.\n- If positive count > negative count: return "Positive"\n- If negative count > positive count: return "Negative"\n- If counts are equal: return "Neutral"',
    conceptExplainer: 'Natural Language Processing (NLP) in AI starts with tokenizing words and measuring word frequencies to classify text.',
    functionName: 'analyzeSentiment',
    starterCode: `function analyzeSentiment(sentence) {
  const lower = sentence.toLowerCase();
  const positiveWords = ["great", "love", "awesome", "fantastic", "good"];
  const negativeWords = ["bad", "hate", "terrible", "awful", "buggy"];
  
  // Count how many positive and negative words occur, then return verdict
  
}`,
    testCases: [
      {
        inputDescription: '("I love this awesome coding app!")',
        expectedOutput: '"Positive"',
        inputs: ['I love this awesome coding app!']
      },
      {
        inputDescription: '("This code is bad and buggy.")',
        expectedOutput: '"Negative"',
        inputs: ['This code is bad and buggy.']
      },
      {
        inputDescription: '("Today we learn loops and variables.")',
        expectedOutput: '"Neutral"',
        inputs: ['Today we learn loops and variables.']
      }
    ],
    solutionCode: `function analyzeSentiment(sentence) {
  const lower = sentence.toLowerCase();
  const positiveWords = ["great", "love", "awesome", "fantastic", "good"];
  const negativeWords = ["bad", "hate", "terrible", "awful", "buggy"];
  
  let pos = 0;
  let neg = 0;
  
  for (const word of positiveWords) {
    if (lower.includes(word)) pos++;
  }
  for (const word of negativeWords) {
    if (lower.includes(word)) neg++;
  }
  
  if (pos > neg) return "Positive";
  if (neg > pos) return "Negative";
  return "Neutral";
}`,
    hints: [
      'Loop through `positiveWords` and check if `lower.includes(word)` to increment your positive counter.',
      'Do the same for `negativeWords`, then compare `pos` and `neg`.'
    ]
  }
];
