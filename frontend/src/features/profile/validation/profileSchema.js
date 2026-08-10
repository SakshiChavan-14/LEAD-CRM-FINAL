import * as Yup from "yup";

export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .required("Name is required"),
  mobile: Yup.string()
    .min(10, "Mobile number is invalid")
    .max(15, "Mobile number is too long")
    .required("Mobile number is required"),
  email: Yup.string().email("Invalid email address").nullable(),
});
