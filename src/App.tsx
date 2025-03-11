import React, { useState } from 'react';
import { DynamicForm } from './components/DynamicForm';
import { FormField, FormData } from './types/form';
import { ClipboardCheck } from 'lucide-react';
import formSchemaData from './schemas/formSchema.json';

const formSchema: FormField[] = formSchemaData.schema;

function App() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleSubmit = (data: FormData) => {
    setSubmittedData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <ClipboardCheck className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Dynamic Form Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Fill out the form below with your information
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <DynamicForm schema={formSchema} onSubmit={handleSubmit} />
        </div>

        {submittedData && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Submitted Data:</h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;