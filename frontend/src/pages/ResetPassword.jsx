import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate, useParams, Link } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import toast from "react-hot-toast"
import logo from "../assets/logo.png"

const resetPassword = async (token, data) => {
  await axios.post(`${serverUrl}/api/auth/reset-password/${token}`, data)
}

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const primaryColor = "#ff4d2d"
  const bgColor = "#fff9f6"

  const initialValues = {
    password: "",
    confirmPassword: ""
  }

  const validationSchema = Yup.object({
    password: Yup.string().min(6, "Min 6 chars").required("Password required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password required")
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await resetPassword(token, { password: values.password })
      toast.success("Password reset successful")
      navigate("/signin")
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired link")
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
          <h1 className="text-3xl font-bold mb-3">Reset Password</h1>
          <p className="text-sm opacity-90 leading-relaxed">
            Create a new password to secure your account.
          </p>
        </div>

        <div className="p-8 sm:p-10" align="center">
          <img src={logo} alt="GoMeal" className="w-30 mb-4 md:hidden" />

          <h2 className="text-2xl font-bold mb-1">New Password</h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter and confirm your new password
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
                    name="password"
                    type="password"
                    placeholder="New Password"
                    className="input"
                  />
                  <ErrorMessage name="password" component="p" className="error" />
                </div>

                <div>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="input"
                  />
                  <ErrorMessage name="confirmPassword" component="p" className="error" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 
                  hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>

              </Form>
            )}
          </Formik>

          <p className="text-center text-sm text-gray-500 mt-6">
            Back to{" "}
            <Link to="/signin" className="font-semibold" style={{ color: primaryColor }}>
              Sign In
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

export default ResetPassword
