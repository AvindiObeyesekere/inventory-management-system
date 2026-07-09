import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { registerValidationSchema } from '@/features/auth/services/validationSchemas';
import registerImage from '@/assets/register.jpeg';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Left side - form, blue background */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 py-12 px-6 order-2 lg:order-1">
        <div className="max-w-lg w-full">
          {/* Frosted glass card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/20">
            <h1 className="text-4xl font-bold text-center text-white mb-2">Create Account</h1>
            <p className="text-center text-blue-100 mb-8">Sign up to start managing your inventory</p>

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={registerValidationSchema}
              onSubmit={async (values, { setFieldError }) => {
                try {
                  setFieldError('email', '');
                  await register(values);
                  navigate('/login');
                } catch (err) {
                  const message = (err as Error).message;
                  setFieldError('email', message);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="register-first-name" className="block text-sm font-medium text-blue-50 mb-1.5">
                        First Name <span className="text-white">*</span>
                      </label>
                      <Field
                        id="register-first-name"
                        type="text"
                        name="firstName"
                        className="block w-full px-4 py-3 bg-white/90 border border-white/40 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      />
                      <ErrorMessage name="firstName" component="div" className="mt-1.5 text-sm text-yellow-200 font-medium" />
                    </div>

                    <div>
                      <label htmlFor="register-last-name" className="block text-sm font-medium text-blue-50 mb-1.5">
                        Last Name <span className="text-white">*</span>
                      </label>
                      <Field
                        id="register-last-name"
                        type="text"
                        name="lastName"
                        className="block w-full px-4 py-3 bg-white/90 border border-white/40 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      />
                      <ErrorMessage name="lastName" component="div" className="mt-1.5 text-sm text-yellow-200 font-medium" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-blue-50 mb-1.5">
                      Email <span className="text-white">*</span>
                    </label>
                    <Field
                      id="register-email"
                      type="email"
                      name="email"
                      className="block w-full px-4 py-3 bg-white/90 border border-white/40 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1.5 text-sm text-yellow-200 font-medium" />
                  </div>

                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-blue-50 mb-1.5">
                      Password <span className="text-white">*</span>
                    </label>
                    <Field
                      id="register-password"
                      type="password"
                      name="password"
                      className="block w-full px-4 py-3 bg-white/90 border border-white/40 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      placeholder="••••••"
                    />
                    <ErrorMessage name="password" component="div" className="mt-1.5 text-sm text-yellow-200 font-medium" />
                  </div>

                  <div>
                    <label htmlFor="register-confirm-password" className="block text-sm font-medium text-blue-50 mb-1.5">
                      Confirm Password <span className="text-white">*</span>
                    </label>
                    <Field
                      id="register-confirm-password"
                      type="password"
                      name="confirmPassword"
                      className="block w-full px-4 py-3 bg-white/90 border border-white/40 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      placeholder="••••••"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1.5 text-sm text-yellow-200 font-medium" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-blue-700 hover:bg-blue-50 py-3 rounded-lg font-semibold text-base disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-lg mt-2"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="mt-6 text-center text-sm text-blue-100">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - image, hidden on mobile */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center order-1 lg:order-2"
        style={{ backgroundImage: `url(${registerImage})` }}
      />
    </div>
  );
};