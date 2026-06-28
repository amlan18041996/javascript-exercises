export interface BaseField {
    label: string;
    required?: boolean;
}

export interface TextField extends BaseField {
    kind: 'text';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

export interface EmailField extends BaseField {
    kind: 'email';
}

export interface PasswordField extends BaseField {
    kind: 'password';
    minLength?: number;
    match?: string;
}

export interface NumberField extends BaseField {
    kind: 'number';
    min?: number;
    max?: number;
    integer?: boolean;
}

export interface SelectField extends BaseField {
    kind: 'select';
    options: string[];
    optionLabels?: Record<string, string>;
    placeholder?: string;
}

export interface CheckboxField extends BaseField {
    kind: 'checkbox';
}

export type FormField = TextField | EmailField | PasswordField | NumberField | SelectField | CheckboxField;

export type FormSchema = Record<string, FormField>;

export interface ValidationResult {
    valid: boolean;
    data: Record<string, unknown>;
    errors: Record<string, string[]>;
}

export type InferFormType<S extends FormSchema> = {
    [K in keyof S]: S[K] extends NumberField ? number :
    S[K] extends CheckboxField ? boolean :
    S[K] extends SelectField ? string :
    string;
};

export type ValidationMode = 'blur' | 'submit' | 'keydown';
