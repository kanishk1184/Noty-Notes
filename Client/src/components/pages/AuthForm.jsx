import React, {  useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../features/auth/authSlice'
import { Helmet } from 'react-helmet';
import SubmitBtn from '../common/SubmitBtn'
import InputField from '../common/InputField'
import TextField from '../common/TextField'
import AuthErrorText from '../common/AuthErrorText'
import API from '../../axios'

const AuthForm = () => {
    const [step, setStep] = useState("email");
    const [inputFocused, setInputFocused] = useState(false);
    const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting }, setValue, reset } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmitEmail = async (data) => {
        try {
            const res = await API.post("/auth/checkMail", { email: data.email });
            setStep(res.data.exists ? "Login" : "SignUp");
        }
        catch (err) {
            if (err.response) {
                setError("serverError", { message: err.response.data.message });
            }
            else {
                setError("clientError", { message: "Please try again" });
            }
        }
    }

    const onSubmitLogin = async (data) => {
        try {
            const res = await API.post("/auth/login", { email: data.email, password: data.password });
            const authToken = res.data.token;
            dispatch(setToken(authToken));
            localStorage.setItem("token", authToken);

            navigate('/');
            reset();
        } catch (err) {
            if (err.response) {
                setError("serverError", { message: err.response.data.message });
            } else {
                setError("clientError", { message: "Please try again" });
            }
            setValue('password', '');
        }
    }

    const onSubmitSignup = async (data) => {
        try {
            const res = await API.post("/auth/signup", { username: data.username, email: data.email, password: data.password });
            const authToken = res.data.token;
            dispatch(setToken(authToken));
            localStorage.setItem("token", authToken);

            navigate('/');
            reset();
        } catch (err) {
            if (err.response) {
                setError("serverError", { message: err.response.data.message });
            } else {
                setError("clientError", { message: "Please try again" });
            }
            setValue('password', '');
            setValue('username', '');
        }
    }

    return (
        <>
        <Helmet>
            <title>Authentication</title>
        </Helmet>
        {/* Login/Signup Form */}
            <div className={`card w-[27.5vw] height-max-66vh-500px border bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border-[rgba(255,255,255,0.1)] flex flex-col relative rounded-3xl hover:bg-[rgba(0,0,0,0.15)] hover:backdrop-blur-[30px] hover:border-[rgba(255,255,255,0.3)] hover:scale-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-500 ease-out p-10 max-xl:w-[35vw] max-lg:w-[45vw] max-md:w-[65vw] max-sm:w-[80vw] max-sm:min-h-[450px] gap-5 ${inputFocused? "max-md:bg-[rgba(0,0,0,0.15)] max-md:backdrop-blur-[30px] max-md:border-[rgba(255,255,255,0.3)] max-md:scale-[1.1] max-md:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]": "max-md:focus:bg-[rgba(0,0,0,0.15)] max-md:focus:backdrop-blur-[30px] max-md:focus:border-[rgba(255,255,255,0.3)] max-md:focus:scale-[1.1] max-md:focus:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]"}`} tabIndex={0}>
                {/* Greetings text and underline */}
                <div className="textAndLine flex flex-col gap-[5px]">
                    <p className='font-bold text-4xl text-white font-roboto max-sm:text-3xl'>Hey there👋</p>
                    <div className='w-[90px] bg-white h-[2px] opacity-80'></div>
                </div>
                {/* Form */}
                <div className='flex items-center flex-1'>
                    <div className={"form flex flex-col gap-2 w-full"}>
                        {/* Friendly text */}
                        {step == "email" && (<TextField text="What's your email?" />)}
                        {step == "Login" && (<TextField text="Welcome backk!!" />)}
                        {step == "SignUp" && (<TextField text="Never seen you before :(" />)}
                        {/* Actual form whose handleSubmit change based on the action */}
                        <form onSubmit={e => {
                            clearErrors();
                            handleSubmit(step == "email" ? onSubmitEmail : (step == "Login" ? onSubmitLogin : onSubmitSignup))(e);
                        }} className='flex flex-col gap-6 items-center'>
                            <AnimatePresence>
                                {/* Only show username field for Signup */}
                                {step == "SignUp" && (
                                    <motion.div layout key="username-field" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className='w-full' >
                                        <InputField clearErrors={clearErrors} setValue={setValue} register={register} type="text" placeholder="username" name="username" rules={{ required: { value: true, message: "This field is required" } }} onFocus={()=>{setInputFocused(true)}} onBlur={()=>{setInputFocused(false)}}/>
                                        {/* Error related to usernmae*/}
                                        {errors.username && (<AuthErrorText text={errors.username.message} />)}
                                    </motion.div>
                                )}
                                {/* Email Field */}
                                <motion.div layout className='w-full' key="email-field">
                                    <InputField clearErrors={clearErrors} setValue={setValue} register={register} type="email" placeholder="email" name="email" rules={{ required: { value: true, message: "This field is required" } }} onFocus={()=>{setInputFocused(true)}} onBlur={()=>{setInputFocused(false)}} />
                                    {/* Email errors */}
                                    {errors.email && <AuthErrorText text={errors.email.message} />}
                                </motion.div>
                                {/* Only show password field for Login/Signup */}
                                {(step == "SignUp" || step == "Login") && (
                                    <motion.div layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className='w-full' >
                                        <InputField clearErrors={clearErrors} setValue={setValue} register={register} type="password" placeholder="password" name="password" rules={{ required: { value: true, message: "This field is required" }, minLength: { value: 8, message: "Password must be atleast 8 letters" } }} onFocus={()=>{setInputFocused(true)}} onBlur={()=>{setInputFocused(false)}} />
                                        {/* Errors related to pwd */}
                                        {errors.password && (<AuthErrorText text={errors.password.message} />)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <motion.div layout>
                                {/* Any other error that may generate */}
                                {errors.serverError && <AuthErrorText text={errors.serverError.message} />}
                                {errors.clientError && <AuthErrorText text={errors.clientError.message} />}
                                {/* Submit button */}
                                <SubmitBtn value={step == "email" ? "Continue" : step} disabled={isSubmitting} />
                            </motion.div>
                        </form>
                        {/* Change the login to signup page and vice versa */}
                        {step !== 'email' && <button onClick={() => {
                            clearErrors();
                            setValue('password', '');
                            setStep(step === "Login" ? "SignUp" : "Login")
                        }} className=' text-white text-2xl self-end underline cursor-pointer'>{step === "Login" ? "SignUp" : "Login"}</button>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthForm