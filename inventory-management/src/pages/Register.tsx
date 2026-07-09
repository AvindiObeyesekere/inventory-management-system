import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { registerValidationSchema } from '@/features/auth/services/validationSchemas';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Register</h1>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerValidationSchema}
          onSubmit={async (values) => {
            try {
              await register(values);
              navigate('/dashboard');
            } catch (err) {
              setError((err as Error).message);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <Field
                  type="text"
                  name="firstName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <Field
                  type="text"
                  name="lastName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••"
                />
                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••"
                />
                <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium disabled:bg-gray-400"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
