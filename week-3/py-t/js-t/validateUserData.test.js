const validateUserData = require('./validateUserData');

describe('validateUserData', () => {
    test('valid user data should pass validation', () => {
        const userData = {
            username: 'ValidUser123',
            email: 'user@example.com',
            password: 'P@ssw0rd!',
            age: 25,
            referralCode: 'ABCDEFGH'
        };
        const result = validateUserData(userData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
    });

    test('missing username should return error', () => {
        const userData = {
            email: 'user@example.com',
            password: 'P@ssw0rd!',
            age: 25
        };
        const result = validateUserData(userData);
        expect(result.isValid).toBe(false);
        expect(result.errors.username).toBe("Username is required");
    });

    test('invalid email format should return error', () => {
        const userData = {
            username: 'ValidUser123',
            email: 'invalid-email',
            password: 'P@ssw0rd!',
            age: 25
        };
        const result = validateUserData(userData);
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBe("Invalid email format");
    });

    test('password missing a number should return error', () => {
        const userData = {
            username: 'ValidUser123',
            email: 'user@example.com',
            password: 'Password!',
            age: 25
        };
        const result = validateUserData(userData);
        expect(result.isValid).toBe(false);
        expect(result.errors.password).toBe("Password must contain at least one number");
    });

    test('age below 18 should return error', () => {
        const userData = {
            username: 'ValidUser123',
            email: 'user@example.com',
            password: 'P@ssw0rd!',
            age: 16
        };
        const result = validateUserData(userData);
        expect(result.isValid).toBe(false);
        expect(result.errors.age).toBe("User must be at least 18 years old");
    });

    test('invalid referral code length should return error', () => {
        const userData = {
            username: 'ValidUser123',
            email: 'user@example.com',
            password: 'P@ssw0rd!',
            referralCode: 'ABC'
        };
        const result = validateUserData(userData);
        expect(result.isValid).toBe(false);
        expect(result.errors.referralCode).toBe("Referral code must be exactly 8 characters");
    });
});
