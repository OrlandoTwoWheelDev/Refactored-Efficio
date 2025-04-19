export const add = (a: number, b: number): number => a + b;


export function multiply(a: number, b: number): number {
  return a * b;
}


// Function to check divisibility by 3, 5, or both and return corresponding results
export function fizzybubbly(a: number, b: number): string {
  // Check if the number is divisible by 3
  if (a % b === 0 && b === 3) {
    return "Fizz"; // If divisible by 3, return "Fizz"
  }
  
  // Check if the number is divisible by 5
  if (a % b === 0 && b === 5) {
    return "Buzz"; // If divisible by 5, return "Buzz"
  }
  
  // Check if the number is divisible by both 3 and 5
  if (a % b === 0 && b === 15) {
    return "FizzBuzz"; // If divisible by both 3 and 5, return "FizzBuzz"
  }

  // Return the remainder as a string if none of the conditions are met
  return `${a % b}`;
}

