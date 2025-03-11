import React, { useState } from 'react';
import { FormField, FormData, FormErrors } from '../types/form';

interface DynamicFormProps {
  schema: FormField[];
  onSubmit: (data: FormData) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (field: FormField, value: any): string => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email address';
      }
    }
    if (field.validation?.pattern && value) {
      const pattern = new RegExp(field.validation.pattern);
      if (!pattern.test(value)) {
        return field.validation.message || 'Invalid format';
      }
    }
    return '';
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    const field = schema.find((f) => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [fieldId]: error,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    const validateFields = (fields: FormField[]) => {
      fields.forEach((field) => {
        if (field.type === 'section' && field.fields) {
          validateFields(field.fields);
        } else {
          const error = validateField(field, formData[field.id]);
          if (error) {
            newErrors[field.id] = error;
          }
        }
      });
    };
    
    validateFields(schema);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      
      case 'select':
        return (
          <select
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.id}
            checked={formData[field.id] || false}
            onChange={(e) => handleChange(field.id, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        );
      
      case 'section':
        return (
          <div className="space-y-4">
            {field.fields?.map((subField) => (
              <div key={subField.id} className="space-y-2">
                <label htmlFor={subField.id} className="block font-medium">
                  {subField.label}
                  {subField.required && <span className="text-red-500">*</span>}
                </label>
                {renderField(subField)}
                {errors[subField.id] && (
                  <p className="text-red-500 text-sm">{errors[subField.id]}</p>
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {schema.map((field) => (
        <div key={field.id} className="space-y-2">
          {field.type !== 'section' && (
            <label htmlFor={field.id} className="block font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
          )}
          {renderField(field)}
          {errors[field.id] && (
            <p className="text-red-500 text-sm">{errors[field.id]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};