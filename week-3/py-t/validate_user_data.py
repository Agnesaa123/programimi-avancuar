import re

def validate_user_data(user_data):
    """
    Validates user registration data
    
    Args:
        user_data (dict): The user data to validate with the following keys:
            - username (str): Required, 3-20 chars, alphanumeric
            - email (str): Required, valid format
            - password (str): Required, min 8 chars, at least 1 number and 1 special char
            - age (int, optional): The user's age, must be 18+ if provided
            - referral_code (str, optional): Must be exactly 8 chars if provided
            
    Returns:
        dict: Object with is_valid flag and any error messages
    """
    result = {
        "is_valid": True,
        "errors": {}
    }
    
    # Check if user_data exists and is a dictionary
    if not isinstance(user_data, dict):
        return {"is_valid": False, "errors": {"global": "Invalid user data format"}}
    
    # Validate username
    username = user_data.get("username")
    if not username:
        result["is_valid"] = False
        result["errors"]["username"] = "Username is required"
    elif not (3 <= len(username) <= 20):
        result["is_valid"] = False
        result["errors"]["username"] = "Username must be between 3 and 20 characters"
    elif not re.match(r'^[a-zA-Z0-9_]+$', username):
        result["is_valid"] = False
        result["errors"]["username"] = "Username can only contain letters, numbers, and underscores"
    
    # Validate email
    email = user_data.get("email")
    if not email:
        result["is_valid"] = False
        result["errors"]["email"] = "Email is required"
    elif not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        result["is_valid"] = False
        result["errors"]["email"] = "Invalid email format"
    
    # Validate password
    password = user_data.get("password")
    if not password:
        result["is_valid"] = False
        result["errors"]["password"] = "Password is required"
    elif len(password) < 8:
        result["is_valid"] = False
        result["errors"]["password"] = "Password must be at least 8 characters long"
    elif not re.search(r'\d', password):
        result["is_valid"] = False
        result["errors"]["password"] = "Password must contain at least one number"
    elif not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        result["is_valid"] = False
        result["errors"]["password"] = "Password must contain at least one special character"
    
    # Validate age (optional)
    age = user_data.get("age")
    if age is not None:
        if not isinstance(age, int):
            result["is_valid"] = False
            result["errors"]["age"] = "Age must be a number"
        elif age < 18:
            result["is_valid"] = False
            result["errors"]["age"] = "User must be at least 18 years old"
    
    # Validate referral code (optional)
    referral_code = user_data.get("referral_code")
    if referral_code is not None:
        if not isinstance(referral_code, str):
            result["is_valid"] = False
            result["errors"]["referral_code"] = "Referral code must be a string"
        elif len(referral_code) != 8:
            result["is_valid"] = False
            result["errors"]["referral_code"] = "Referral code must be exactly 8 characters"
    
    return result
