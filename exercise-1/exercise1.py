# Import necessary module for date and time
import datetime

def get_user_name():
    """
    Prompt the user for their name with proper error handling.
    Ensures the user enters a non-empty name.
    """
    while True:
        try:
            name = input("Please enter your name: ").strip()
            if name:  # Check if name is not empty
                return name
            else:
                print("Error: Name cannot be empty. Please try again.")
        except KeyboardInterrupt:
            # Handle case where user cancels input (Ctrl+C)
            print("\nInput canceled. Exiting program.")
            exit()

def main():
    # Print initial greeting
    print("Hello, World!")
    
    # Get user's name with error handling
    user_name = get_user_name()
    
    # Personalized greeting
    print(f"Hello, {user_name}!")
    
    # Get current date and time
    current_time = datetime.datetime.now()
    
    # Format and display date/time in a readable format
    print("Current date and time:", current_time.strftime("%Y-%m-%d %H:%M:%S"))

if __name__ == "__main__":
    main()