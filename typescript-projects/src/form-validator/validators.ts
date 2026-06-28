import type { FormSchema, FormField, TextField, EmailField, PasswordField, NumberField, SelectField, CheckboxField, ValidationResult } from './types.js';

export const field = {
    text: (config: Omit<TextField, 'kind'>): TextField => ({ kind: 'text', ...config }),
    email: (config: Omit<EmailField, 'kind'>): EmailField => ({ kind: 'email', ...config }),
    password: (config: Omit<PasswordField, 'kind'>): PasswordField => ({ kind: 'password', ...config }),
    number: (config: Omit<NumberField, 'kind'>): NumberField => ({ kind: 'number', ...config }),
    select: (config: Omit<SelectField, 'kind'>): SelectField => ({ kind: 'select', ...config }),
    checkbox: (config: Omit<CheckboxField, 'kind'>): CheckboxField => ({ kind: 'checkbox', ...config }),
};

function isEmpty(value: unknown): boolean {
    return value === undefined || value === null || value === '';
}

function validateField(fieldDef: FormField, value: unknown, allValues: Record<string, unknown>): string[] {
    const errors: string[] = [];
    const label = fieldDef.label;
    const isMissing = isEmpty(value);

    if (fieldDef.required && isMissing) {
        if (fieldDef.kind === 'checkbox') {
            errors.push(`You must accept the ${label.toLowerCase()}`);
        } else {
            errors.push(`${label} is required`);
        }
        return errors;
    }

    if (!fieldDef.required && isMissing) {
        return errors;
    }

    switch (fieldDef.kind) {
        case 'text': {
            if (typeof value !== 'string') {
                errors.push(`${label} must be text`);
            } else {
                if (fieldDef.minLength !== undefined && value.length < fieldDef.minLength) {
                    errors.push(`${label} must be at least ${fieldDef.minLength} characters`);
                }
                if (fieldDef.maxLength !== undefined && value.length > fieldDef.maxLength) {
                    errors.push(`${label} must be at most ${fieldDef.maxLength} characters`);
                }
                if (fieldDef.pattern && !fieldDef.pattern.test(value)) {
                    errors.push(`${label} format is invalid`);
                }
            }
            break;
        }
        case 'email': {
            if (typeof value !== 'string') {
                errors.push(`${label} must be text`);
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push(`Please enter a valid email address`);
                }
            }
            break;
        }
        case 'password': {
            if (typeof value !== 'string') {
                errors.push(`${label} must be text`);
            } else {
                if (fieldDef.minLength !== undefined && value.length < fieldDef.minLength) {
                    errors.push(`${label} must be at least ${fieldDef.minLength} characters`);
                }
                if (fieldDef.match && allValues[fieldDef.match] !== undefined && value !== allValues[fieldDef.match]) {
                    errors.push(`Passwords do not match`);
                }
            }
            break;
        }
        case 'number': {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            if (typeof num !== 'number' || isNaN(num)) {
                errors.push(`${label} must be a number`);
            } else {
                if (fieldDef.min !== undefined && num < fieldDef.min) {
                    errors.push(`${label} must be at least ${fieldDef.min}`);
                }
                if (fieldDef.max !== undefined && num > fieldDef.max) {
                    errors.push(`${label} must be at most ${fieldDef.max}`);
                }
                if (fieldDef.integer && !Number.isInteger(num)) {
                    errors.push(`${label} must be a whole number`);
                }
            }
            break;
        }
        case 'select': {
            if (typeof value !== 'string' || !fieldDef.options.includes(value)) {
                errors.push(`Please select a valid option for ${label.toLowerCase()}`);
            }
            break;
        }
        case 'checkbox': {
            if (value !== true) {
                errors.push(`You must accept the ${label.toLowerCase()}`);
            }
            break;
        }
    }

    return errors;
}

export function validate(schema: FormSchema, data: Record<string, unknown>): ValidationResult {
    const errors: Record<string, string[]> = {};
    const validData: Record<string, unknown> = {};

    for (const [fieldName, fieldDef] of Object.entries(schema)) {
        const fieldErrors = validateField(fieldDef, data[fieldName], data);
        if (fieldErrors.length > 0) {
            errors[fieldName] = fieldErrors;
        } else if (!isEmpty(data[fieldName])) {
            const raw = data[fieldName];
            if (fieldDef.kind === 'number') {
                validData[fieldName] = typeof raw === 'string' ? parseFloat(raw) : raw;
            } else if (fieldDef.kind === 'checkbox') {
                validData[fieldName] = raw === true;
            } else {
                validData[fieldName] = raw;
            }
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        data: validData,
        errors,
    };
}
