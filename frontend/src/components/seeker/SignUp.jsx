import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";

const SignUp = ()=>{
    const {register} = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        password_confirmed: ""
    });
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError(null);

        try{
            await register(form);
            navigate("/login");
        } catch(err){
            console.log(err.response?.data);
            setError("Signup failed")
        }
    };

  return (
    <div style={{ maxWidth: 400, margin: "30px auto" }}>
      <h2>Create an Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Password</label><br />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Confirm Password</label><br />
          <input
            type="password"
            name="password_confirmed"
            value={form.password_confirmed}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: 15 }}>Sign Up</button>
      </form>

      {error && (
        <div style={{ marginTop: 10, color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SignUp;