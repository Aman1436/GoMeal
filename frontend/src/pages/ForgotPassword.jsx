import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import toast from "react-hot-toast"
import logo from "../assets/logo.png"

const sendResetLink = async (data) => {
  await axios.post(`${serverUrl}/api/auth/forgot-password`, data)
}

const ForgotPassword = () => {
  const navigate = useNavigate()

  const primaryColor = "#ff4d2d"
  const bgColor = "#fff9f6"

  const initialValues = {
    email: ""
  }

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email required")
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await sendResetLink(values)
      toast.success("Password reset link sent to your email")
      navigate("/signin")
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong")
    }
    setSubmitting(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="grid md:grid-cols-2 bg-white shadow-xl rounded-2xl overflow-hidden max-w-3xl w-full border">

        <div
          className="hidden md:flex flex-col justify-center p-10 text-white"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, #ff6a4d)`
          }}
        >
          <img src={logo} alt="GoMeal" className="rounded-b-full w-fit mb-6" />
          <h1 className="text-3xl font-bold mb-3">Forgot Password?</h1>
          <p className="text-sm opacity-90 leading-relaxed">
            Don’t worry! We’ll send you a link to reset your password securely.
          </p>
        </div>

        <div className="p-8 sm:p-10" align="center">
          <img src={logo} alt="GoMeal" className="w-30 mb-4 md:hidden" />

          <h2 className="text-2xl font-bold mb-1">Reset Password</h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter your registered email address
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">

                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="input"
                  />
                  <ErrorMessage name="email" component="p" className="error" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 
                  hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

              </Form>
            )}
          </Formik>

          <p className="text-center text-sm text-gray-500 mt-6">
            Remembered your password?{" "}
            <Link to="/signin" className="font-semibold" style={{ color: primaryColor }}>
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>

      <style>
        {`
          .input {
            width: 100%;
            height: 44px;
            padding: 12px 14px;
            border-radius: 12px;
            border: 1px solid #ddd;
            outline: none;
            transition: all 0.2s;
          }
          .input:focus {
            border-color: ${primaryColor};
            box-shadow: 0 0 0 2px rgba(255,77,45,0.15);
          }
          .error {
            font-size: 12px;
            margin-top: 4px;
            color: #e11d48;
          }
        `}
      </style>
    </div>
  )
}

export default ForgotPassword
