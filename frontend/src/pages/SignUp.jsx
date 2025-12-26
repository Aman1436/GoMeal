import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import toast from "react-hot-toast"
import logo from "../assets/logo.png"

const signup = async (data) => {
  await axios.post(`${serverUrl}/api/auth/signup`, data, { withCredentials: true })
}

const SignUp = () => {
  const navigate = useNavigate()

  const primaryColor = "#ff4d2d"
  const bgColor = "#fff9f6"

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    role: "user"
  }

  const validationSchema = Yup.object({
    fullName: Yup.string().min(3).required("Full name required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().min(6, "Min 6 chars").required("Password required"),
    mobile: Yup.string().min(10, "Invalid mobile").required("Mobile required"),
    role: Yup.string().required()
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await signup(values)
      navigate("/verify-otp", { state: { email: values.email } })
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed")
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
          <h1 className="text-3xl font-bold mb-3">Welcome to GoMeal</h1>
          <p className="text-sm opacity-90 leading-relaxed">
            Smart food ordering platform with fast delivery, real-time tracking
            and seamless user experience.
          </p>
        </div>
        <div className="p-8 sm:p-10" align="center">
          <img src={logo} alt="GoMeal" className="w-30 mb-4  md:hidden" />

          <h2 className="text-2xl font-bold mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-6">
            Sign up and start ordering instantly
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">

                <div>
                  <Field name="fullName" placeholder="Full Name" className="input" />
                  <ErrorMessage name="fullName" component="p" className="error" />
                </div>

                <div>
                  <Field name="email" type="email" placeholder="Email Address" className="input" />
                  <ErrorMessage name="email" component="p" className="error" />
                </div>

                <div>
                  <Field name="password" type="password" placeholder="Password" className="input" />
                  <ErrorMessage name="password" component="p" className="error" />
                </div>

                <div>
                  <Field name="mobile" placeholder="Mobile Number" className="input" />
                  <ErrorMessage name="mobile" component="p" className="error" />
                </div>

                <Field as="select" name="role" className="input cursor-pointer">
                  <option value="user">User</option>
                  <option value="owner">Restaurant Owner</option>
                  <option value="deliveryBoy">Delivery Partner</option>
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 
                  hover:scale-[1.02]
                  hover:opacity-90 active:scale-[0.98] cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? "Creating Account..." : "Sign Up"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Already have an account?{" "}
                  <Link to="/signin" className="font-semibold" style={{ color: primaryColor }}>
                    Sign in here
                  </Link>
                </p>

              </Form>
            )}
          </Formik>
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

export default SignUp
