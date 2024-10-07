'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import styles from './LoginModal.module.css';
import { useAuthContext } from '../providers/AuthProvider';
import { useAppContext } from '../providers/AppProvider';
import { Close, Policy, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';


const LoginModal: React.FC = () => {
    const { authError, createUserAccount, login } = useAuthContext();
    const { isLoginModalOpen, setIsLoginModalOpen } = useAppContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isLoginButtonEnabled = () => {
        return email.trim() !== '' && password.trim() !== '' && (isLogin || confirmPassword.trim() !== '');
    };

    const handleClose = () => {
        setIsLoginModalOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ email: '', password: '', confirmPassword: '' });

        let hasErrors = false;
        const newErrors = {
            email: '',
            password: '',
            confirmPassword: '',
        };

        if (!email) {
            newErrors.email = 'Email is required';
            hasErrors = true;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email format is invalid';
            hasErrors = true;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            hasErrors = true;
        } else if (!isLogin && password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            hasErrors = true;
        }

        if (!isLogin) {
            if (!confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
                hasErrors = true;
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
                hasErrors = true;
            }
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        try {
            let result;

            if (isLogin) {
                result = await login(email, password);
            } else {
                result = await createUserAccount(email, password);
                alert('Account created successfully. Please verify your email address to access all the available features.');
            }
            if (result) {
                handleClose();
            }
        } catch (error) {
            console.log('Error:', error);   
        }
    };

    const handleSwitch = () => {
        setIsLogin((prev) => !prev);
        setConfirmPassword('');
        setErrors({ email: '', password: '', confirmPassword: '' });
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 720);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        isLoginModalOpen && (
            <div className={styles.containerModal}>
                <div className={styles.loginCloseButtonContainer}>
              
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
                </div>
                <div className={styles.loginContainer}>
                    <h1>{isLogin ? 'Log into Paper Take' : 'Create an account'}</h1>
                    <div className={styles.loginContainerBody}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputContainer}>
                                <input
                                    className={styles.input}
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Email'
                                />
                            </div>
                            {
                                errors.email ? <p aria-live="polite" className={styles.errorText}>{errors.email}</p> : null
                            }
                            <div className={styles.inputContainer}>
                                <input
                                    className={styles.visiblityInput}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Password'
                                />
                                <IconButton onClick={handleClickShowPassword} className={styles.visiblityIcon}>
                                    {
                                        showPassword
                                            ?
                                            <VisibilityOffOutlined />
                                            :
                                            <VisibilityOutlined />
                                    }
                                </IconButton>
                            </div>
                            {
                                errors.password ? <p aria-live="polite" className={styles.errorText}>{errors.password}</p> : null
                            }
                            {
                                authError
                                    ?
                                    <p className={styles.textError} aria-live="polite">{authError}</p>
                                    :
                                    null
                            }
                            {!isLogin && (
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.visiblityInput}
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Confirm Password'
                                    />
                                    <p aria-live="polite" className={styles.errorText}>{errors.confirmPassword}</p>
                                </div>
                            )}
                            <button className={styles.formButton} disabled={!isLoginButtonEnabled()} type="submit">
                                {isLogin ? 'Login' : 'Create Account'}
                            </button>
                        </form>
                        <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem sx={{ color: 'gray' }}>
                            OR
                        </Divider>
                        <div className={styles.form}>
                            {/* <button type="button" className={styles.providerButton}>
                                <Google />
                                <div>Continue with Google</div>
                            </button> */}
                            <button type="button" className={styles.providerButton} onClick={handleClose}>
                                <Policy />
                                <div>Continue without account</div>
                            </button>
                        </div>
                    </div>
                    {isLogin && (
                        <p className={styles.termsText}>
                            By creating an account, you agree to our <Link href={'/'} className={styles.termsText}>Terms of Service</Link> & <Link href={'/'} className={styles.termsText}>Privacy Policy</Link>.
                        </p>
                    )}
                    {/* <p className={styles.termsText}>
                        Secure Login with reCAPTCHA subject to Google <Link className={styles.termsText} href={"https://policies.google.com/terms?hl=en"}>Terms of Service</Link> & <Link className={styles.termsText} href={"https://policies.google.com/privacy?hl=en"}>Privacy Policy</Link>.
                    </p> */}
                    <div className={styles.textButtonContainer}>
                        <button type="button" className={styles.textButton}>
                            FORGOT PASSWORD?
                        </button>
                        <button type="button" className={styles.textButton} onClick={handleSwitch}>
                            {isLogin ? 'CREATE ACCOUNT' : 'LOGIN'}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}

export default LoginModal;