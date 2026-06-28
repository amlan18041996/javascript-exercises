import { field, validate } from './index.js';

const registrationSchema = {
    fullName: field.text({ label: 'Full Name', required: true, minLength: 2 }),
    email: field.email({ label: 'Email Address', required: true }),
    password: field.password({ label: 'Password', required: true, minLength: 8 }),
    confirmPassword: field.password({ label: 'Confirm Password', required: true, match: 'password' }),
    age: field.number({ label: 'Age', required: true, min: 18, max: 120, integer: true }),
    country: field.select({ label: 'Country', required: true, options: ['US', 'UK', 'CA', 'AU'] }),
    terms: field.checkbox({ label: 'Terms & Conditions', required: true }),
};

// Example 1: Valid data
const validData = {
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'securePass1',
    confirmPassword: 'securePass1',
    age: 28,
    country: 'US',
    terms: true,
};
console.log('=== Valid Registration ===');
console.log(validate(registrationSchema, validData));

// Example 2: Empty form
console.log('\n=== Empty Form ===');
console.log(validate(registrationSchema, {}));

// Example 3: Partial errors
const partialData = {
    fullName: 'A',
    email: 'invalid',
    password: 'short',
    confirmPassword: 'different',
    age: 15,
    country: '',
    terms: false,
};
console.log('\n=== Validation Errors ===');
const result = validate(registrationSchema, partialData);
console.log(JSON.stringify(result.errors, null, 2));

// Example 4: Missing optional fields
const optionalSchema = {
    fullName: field.text({ label: 'Full Name', required: true, minLength: 2 }),
    email: field.email({ label: 'Email', required: true }),
    bio: field.text({ label: 'Bio', required: false, maxLength: 200 }),
};
console.log('\n=== Optional Field ===');
console.log(validate(optionalSchema, { fullName: 'Bob', email: 'bob@test.com' }));

// Example 5: Select with custom options
const orderSchema = {
    product: field.select({ label: 'Product', required: true, options: ['laptop', 'phone', 'tablet'], placeholder: 'Choose a product' }),
    quantity: field.number({ label: 'Quantity', required: true, min: 1, max: 99, integer: true }),
};
console.log('\n=== Order Form ===');
console.log(validate(orderSchema, { product: 'laptop', quantity: 2 }));
console.log(validate(orderSchema, { product: '', quantity: 0 }));
