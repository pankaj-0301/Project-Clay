export interface FormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'checkbox' | 'section';
  label: string;
  required?: boolean;
  options?: string[];
  fields?: FormField[];
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}