'use client';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import styles from './Modal.module.css';
import { useAuthContext } from '../providers/AuthProvider';
import { useAppContext } from '../providers/AppProvider';
import { Button, InputAdornment, TextField } from '@mui/material';
import {
    Policy,
    VisibilityOffOutlined,
    VisibilityOutlined
} from '@mui/icons-material';

const StyledTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
    '& label': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
    '& label.Mui-focused': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
});

const LoginModal: React.FC = () => {
    const {
        authError,
        resetPassword,
        createUserAccount, login, setAuthError } = useAuthContext();
    const { isLoginModalOpen, setIsLoginModalOpen } = useAppContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const isButtonEnabled = () => {
        if (isForgotPassword) {
            return email.trim() !== '';
        } else if (isLogin) {
            return email.trim() !== '' && password.trim() !== '' && password.length > 6;
        } else {
            return email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password.length > 6;
        }
    };

    const handleClose = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({ email: '', password: '', confirmPassword: '' });
        setAuthError(null);
        setIsForgotPassword(false);
        setIsLoginModalOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ email: '', password: '', confirmPassword: '' });

        let authAction = false;

        try {
            if (isForgotPassword) {
                if (!email) {
                    setErrors({ ...errors, email: 'Email is required' });
                    return;
                }

                authAction = await resetPassword(email);

                if (authAction) {
                    alert('If the email address is registered, a password reset link will be sent to it.');
                    setEmail('');
                    setIsForgotPassword(false);
                }
            } else if (isLogin && !isForgotPassword) {
                if (password.trim() === '') {
                    setErrors({ ...errors, password: 'Password is required' });
                    return;
                }

                if (email.trim() === '') {
                    setErrors({ ...errors, email: 'Email is required' });
                    return;
                }

                authAction = await login(email, password);

                if (authAction) {
                    handleClose();
                }
            } else if (!isLogin && !isForgotPassword) {
                if (email.trim() === '') {
                    setErrors({ ...errors, email: 'Email is required' });
                    return;
                }

                if (password.trim() === '') {
                    setErrors({ ...errors, password: 'Password is required' });
                    return;
                }

                if (confirmPassword.trim() === '') {
                    setErrors({ ...errors, confirmPassword: 'Confirm Password is required' });
                    return;
                }

                if (password !== confirmPassword) {
                    setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
                    return;
                }

                authAction = await createUserAccount(email, password);

                if (authAction) {
                    alert('Account created successfully. Please verify your email address to access all the available features.');
                    handleClose();
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleShowForgotPassword = () => {
        setAuthError(null);
        setIsForgotPassword(true);
        setPassword('');
        setConfirmPassword('');
        setErrors({ email: '', password: '', confirmPassword: '' });
    }

    const handleSwitch = () => {
        setAuthError(null);
        setIsLogin((prev) => !prev);
        setConfirmPassword('');
        setErrors({ email: '', password: '', confirmPassword: '' });
    };

    return (
        isLoginModalOpen && (
            <div className={styles.containerModalLogin}>
                {/* <div className={styles.closeButtonContainer}>
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
                </div> */}
                <div className={styles.containerLogin}>
                    <h1>{isLogin ? 'Log into Paper Take' : 'Create an account'}</h1>
                    <div className={isForgotPassword ? styles.formContainerLoginHelp : styles.formContainerLogin}>
                        <form className={styles.formLogin} onSubmit={handleSubmit}>
                            <StyledTextField
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="standard"
                                label="Email"
                                sx={{ width: '100%' }}
                                autoComplete='off'
                            />
                            {
                                errors.email && (<p aria-live="polite" className={styles.errorText}>{errors.email}</p>)
                            }
                            {
                                !isForgotPassword && (
                                    <StyledTextField
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        variant="standard"
                                        label="Password"
                                        autoComplete='off'
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {
                                                            showPassword
                                                                ?
                                                                <VisibilityOffOutlined onClick={handleClickShowPassword} />
                                                                :
                                                                <VisibilityOutlined onClick={handleClickShowPassword} />
                                                        }
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                )
                            }
                            {
                                errors.password && (<p aria-live="polite" className={styles.errorText}>{errors.password}</p>)
                            }
                            {
                                authError && (<p className={styles.textError} aria-live="polite">{authError}</p>)
                            }
                            {(!isLogin && !isForgotPassword) && (
                                <StyledTextField
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    variant="standard"
                                    label="Confirm Password"
                                    sx={{ width: '100%' }}
                                />
                            )}
                            {
                                errors.confirmPassword && (<p aria-live="polite" className={styles.errorText}>{errors.confirmPassword}</p>)
                            }
                            <Button className={styles.button} disabled={!isButtonEnabled()} type="submit">
                                {isForgotPassword ? 'Send' : (isLogin ? 'Log in' : 'Create Account')}
                            </Button>
                        </form>

                        {
                            !isForgotPassword && (
                                <>
                                    <div className={styles.dividerContainer}>
                                        <Divider flexItem
                                            orientation={"vertical"}
                                            sx={{ color: 'gray' }}>
                                            OR
                                        </Divider>
                                    </div>
                                    <div className={styles.dividerContainerMobile}>
                                        <Divider flexItem
                                            orientation={"horizontal"}
                                            sx={{ color: 'gray' }}>
                                            OR
                                        </Divider>
                                    </div>
                                    <div className={styles.formLogin}>
                                        <Button className={styles.button} variant="contained" onClick={handleClose} startIcon={<Policy />}>
                                            Continue without an account
                                        </Button>
                                    </div>
                                </>
                            )
                        }

                    </div>
                    {/* {(isLogin && !isForgotPassword) && (
                        <p className={styles.textTerms}>
                            Enter your email and password to access your account
                        </p>
                    )} */}
                    {(!isLogin && !isForgotPassword) && (
                        <p className={styles.textTerms}>
                            By creating an account, you agree to our <Link href={'/'} className={styles.textTerms}>Terms of Service</Link> & <Link href={'/'} className={styles.textTerms}>Privacy Policy</Link>
                        </p>
                    )}
                    {isForgotPassword && (
                        <>
                            <p className={styles.textTerms}>
                                Enter your email to receive a password reset link
                            </p>

                            <p className={styles.textTerms}>
                                For any other issues, please contact <Link href="mailto:support@machinename.dev?subject=Support%20Request&body=Please%20describe%20your%20issue%20here." className={styles.textTerms}>support</Link>
                            </p>
                        </>

                    )}
                    {/* <p className={styles.textTerms}>
                        Secure Login with reCAPTCHA subject to Google <Link className={styles.textTerms} href={"https://policies.google.com/terms?hl=en"}>Terms of Service</Link> & <Link className={styles.textTerms} href={"https://policies.google.com/privacy?hl=en"}>Privacy Policy</Link>.
                    </p> */}
                    <div className={styles.textButtonContainer}>
                        {
                            !isForgotPassword ?
                                <>
                                    <Button type="button" className={styles.textButton} onClick={handleSwitch}>
                                        {isLogin ? 'Create Account' : 'Already have an account?'}
                                    </Button>
                                    {
                                        isLogin && (
                                            <Button type="button" className={styles.textButton} onClick={handleShowForgotPassword}>
                                                Login Help
                                            </Button>
                                        )
                                    }
                                </>
                                :
                                <Button type="button" className={styles.textButton} onClick={() => setIsForgotPassword(false)}>
                                    Back
                                </Button>
                        }
                    </div>
                </div>
            </div>
        )
    );
}

export default LoginModal;