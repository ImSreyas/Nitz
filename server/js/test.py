import sys
import json

class Solution:
    def addTwoNumbers(self, a: int, b: int) -> int:
        """
        User will implement this method
        Example implementation shown here
        """
        return a + b

def main():
    # Check if we have exactly 3 arguments (script name + 3 args)
    if len(sys.argv) != 4:
        print(json.dumps({
            "status": "error",
            "message": "Usage: python script.py <num1> <num2> <expected_output>"
        }))
        sys.exit(1)
    
    try:
        # Parse command line arguments
        num1 = int(sys.argv[1])
        num2 = int(sys.argv[2])
        expected_output = int(sys.argv[3])
        
        # Create solution instance and call the method
        solution = Solution()
        result = solution.addTwoNumbers(num1, num2)
        
        # Prepare response
        if result == expected_output:
            response = {
                "status": "pass",
                "input": f"{num1} {num2}",
                "output": str(result),
                "expected": str(expected_output)
            }
        else:
            response = {
                "status": "fail",
                "input": f"{num1} {num2}",
                "output": str(result),
                "expected": str(expected_output)
            }
        
        # Print JSON response
        print(json.dumps(response))
        
    except ValueError as e:
        print(json.dumps({
            "status": "error",
            "message": f"Invalid input: {str(e)}"
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": f"Runtime error: {str(e)}"
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()