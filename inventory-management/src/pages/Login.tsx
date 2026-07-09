import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginValidationSchema } from '@/features/auth/services/validationSchemas';
import loginImage from '@/assets/login.jpeg';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Left side - image, hidden on mobile */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      />

      {/* Right side - form, blue background */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 py-12 px-6">
        <div className="max-w-lg w-full">
          {/* Frosted glass card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/20">
            <h1 className="text-4xl font-bold text-center text-white mb-2">Welcome Back</h1>
            <p className="text-center text-blue-100 mb-8">Login to manage your inventory</p>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginValidationSchema}
              onSubmit={async (values, { setFieldError }) => {
                try {
                  setFieldError('email', '');
                  setFieldError('password', '');
                  await login(values);
                  navigate('/dashboard');
                } catch (err) {
                  const message = (err as Error).message;

                  if (message.toLowerCase().includes('email not found')) {
                    setFieldError('email', message);
                    return;
                  }

                  setFieldError('password', message);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-blue-50 mb-1.5">
                      Email <span className="text-white">*</span>
                    </label>
                    <Field
                      id="login-email"
                      type="email"
                      name="email"
                      className="block w-full px-4 py-3 bg-white/90 border border-white/40 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1.5 text-sm text-yellow-200 font-medium" />
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-blue-50 mb-1.5">
                      Password <span className="text-white">*</span>
                    </label>
                    <Field
                      id="login-password"
                      type="password"
                      name="password"
                      className="block w-full px-4 py-3 bg-white/90 border border-white/40 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      placeholder="••••••"
                    />
                    <ErrorMessage name="password" component="div" className="mt-1.5 text-sm text-yellow-200 font-medium" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-blue-700 hover:bg-blue-50 py-3 rounded-lg font-semibold text-base disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-lg mt-2"
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="mt-6 text-center text-sm text-blue-100">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};