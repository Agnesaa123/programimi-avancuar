import pytest
from validate_user_data import validate_user_data

def test_valid_user_data():
    user_data = {
        "username": "ValidUser123",
        "email": "user@example.com",
        "password": "P@ssw0rd!",
        "age": 25,
        "referral_code": "ABCDEFGH"
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] is True
    assert result["errors"] == {}

def test_missing_username():
    user_data = {
        "email": "user@example.com",
        "password": "P@ssw0rd!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] is False
    assert result["errors"]["username"] == "Username is required"

def test_invalid_email():
    user_data = {
        "username": "ValidUser123",
        "email": "invalid-email",
        "password": "P@ssw0rd!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] is False
    assert result["errors"]["email"] == "Invalid email format"

def test_password_missing_number():
    user_data = {
        "username": "ValidUser123",
        "email": "user@example.com",
        "password": "Password!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] is False
    assert result["errors"]["password"] == "Password must contain at least one number"

def test_age_below_18():
    user_data = {
        "username": "ValidUser123",
        "email": "user@example.com",
        "password": "P@ssw0rd!",
        "age": 16
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] is False
    assert result["errors"]["age"] == "User must be at least 18 years old"

def test_invalid_referral_code():
    user_data = {
        "username": "ValidUser123",
        "email": "user@example.com",
        "password": "P@ssw0rd!",
        "referral_code": "ABC"
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] is False
    assert result["errors"]["referral_code"] == "Referral code must be exactly 8 characters"
