import { add } from './utils';

describe('add function', () => {
  it('adds two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
  });
});



// 1. Import the function you want to test
import { multiply } from './utils';

// 2. Group related tests using "describe" (optional but helpful for organizing)
describe('multiply function', () => {
  
  // 3. Write a single test using "it" or "test"
  it('multiplies two positive numbers correctly', () => {
    // 4. Call the function and check the result using "expect"
    const result = multiply(3, 4);

    // 5. Use Jest's "expect" to assert the output
    expect(result).toBe(12); // ✅ should pass if multiply is correct
  });

  // Bonus: try testing a negative case
  it('multiplies with a negative number', () => {
    const result = multiply(-2, 5);
    expect(result).toBe(-10);
  });

  // Extra bonus: zero!
  it('multiplies any number by 0', () => {
    expect(multiply(1000, 0)).toBe(0);
  });
});


import { fizzybubbly } from './utils';

describe('fizzybubbly function', () => {
  it('should return "Fizz" when divisible by 3', () => {
    const result = fizzybubbly(9, 3); // 9 is divisible by 3
    expect(result).toBe("Fizz");
  });

  it('should return "Buzz" when divisible by 5', () => {
    const result = fizzybubbly(10, 5); // 10 is divisible by 5
    expect(result).toBe("Buzz");
  });

  it('should return "FizzBuzz" when divisible by both 3 and 5', () => {
    const result = fizzybubbly(15, 15); // 15 is divisible by both 3 and 5
    expect(result).toBe("FizzBuzz");
  });

  it('should return the remainder when not divisible by 3 or 5', () => {
    const result = fizzybubbly(7, 3); // 7 % 3 is 1
    expect(result).toBe("1");
  });
});

