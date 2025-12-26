import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import toast from "react-hot-toast"
import logo from "../assets/logo.png"

const verifyOtp = async (data) => {
    await axios.post(`${serverUrl}/api/auth/verify-otp`, data, { withCredentials: true })
}

const VerifyOTP = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    const primaryColor = "#ff4d2d"
    const bgColor = "#fff9f6"

    const initialValues = { otp: "" }

    const validationSchema = Yup.object({
        otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required")
    })

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
        await verifyOtp({ email, otp: values.otp })
        navigate("/signin")
        } catch (err) {
        toast.error(err.response?.data?.message || "Invalid OTP")
        }
        setSubmitting(false)
    }
    const resendOtp = async (email) => {
      try {
        await axios.post(`${serverUrl}/api/auth/resend-otp`, { email }, { withCredentials: true })
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to resend OTP")
      }
    }
  

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="GoMeal Logo"
            className="h-40 border rounded-b-full mx-auto mb-3"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            OTP Verification
          </h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            We have sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">

              {/* OTP Input */}
              <div>
                <Field
                  name="otp"
                  maxLength="6"
                  placeholder="••••••"
                  className="w-full text-center text-2xl tracking-[0.6em] py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: primaryColor,
                    caretColor: primaryColor
                  }}
                />

                {errors.otp && touched.otp && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    {errors.otp}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend */}
              <div className="text-center text-sm text-gray-500">
                Didn’t receive the code?{" "}
                <span
                  className="font-semibold cursor-pointer"
                  style={{ color: primaryColor }}
                  onClick={() => resendOtp(email)}
                >
                  Resend OTP
                </span>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default VerifyOTP
