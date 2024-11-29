'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import {
    InputAdornment,
    Divider,
} from '@mui/material';
import {
    Google,
    VisibilityOffOutlined,
    VisibilityOutlined,
} from '@mui/icons-material';
import styles from '../page.module.css';
import { StyledButton, FormTextField } from '../components/Styled';
import React from 'react';
import { useAuthContext } from '../providers/AuthProvider';

export default function Login() {
    const
        {
            createUserAccount,
            logIn,
            logInWithGoogle,
            sendPasswordReset,
        } = useAuthContext();

    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoginHelp, setIsLoginHelp] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const isButtonEnabled = () => {
        if (isLoginHelp) {
            return email.trim() !== '';
        } else if (isLogin) {
            return email.trim() !== '' && password.trim() !== '' && password.length > 7;
        } else {
            return email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password.length > 7;
        }
    };

    const clearValues = () => {
        setEmail('');
        setConfirmPassword('');
        setErrors({ email: '', password: '', confirmPassword: '' });
        setPassword('');
    };

    const handleContinueWithGoogle = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            await logInWithGoogle();
            router.push('/');
        } catch (error) {
            console.log(error);
        } finally {
            clearValues();
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ email: '', password: '', confirmPassword: '' });
        try {
            if (isLoginHelp) {
                if (!email) {
                    setErrors({ ...errors, email: 'Email is required' });
                    return;
                }

                await sendPasswordReset(email);
                alert('If the email address is registered, a password reset link will be sent to it.');
                setEmail('');
            } else if (isLogin) {

                if (!password.trim()) {
                    setErrors({ ...errors, password: 'Password is required' });
                    return;
                }

                await logIn(email, password);
                router.push('/');
            } else if (!isLogin && !isLoginHelp) {
                if (!email.trim()) {
                    setErrors({ ...errors, email: 'Email is required' });
                    return;
                }
                if (!password.trim()) {
                    setErrors({ ...errors, password: 'Password is required' });
                    return;
                }
                if (confirmPassword.trim()) {
                    setErrors({ ...errors, confirmPassword: 'Confirm Password is required' });
                    return;
                }
                if (password !== confirmPassword) {
                    setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
                    return;
                }

                await createUserAccount(email, password);
                router.push('/');
            }

        } catch (error) {
            console.log('Error:', error);
        } finally {
            clearValues();
        }
    };

    const toggleLoginHelp = () => {
        setIsLoginHelp(prev => !prev);
        clearValues();
    };

    const handleSwitch = () => {
        setIsLogin(prev => !prev);
        clearValues();
    };

    return (
        <div className={styles.pageLogin}>
            <div className={styles.wrapperLogin}>

                <div className={styles.pageHeaderContainer}>
                    <h2>{isLoginHelp ? 'Log in help' : (isLogin ? 'Log into Machine Name' : 'Create an account')}</h2>
                </div>

                <div className={isLoginHelp ? styles.loginHelp : styles.login}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <FormTextField
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="standard"
                            label="Email"
                            sx={{ width: '100%' }}
                            autoComplete='off'
                        />
                        {errors.email && (<p aria-live="polite" className={styles.textError}>{errors.email}</p>)}
                        {!isLoginHelp && (
                            <FormTextField
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
                                                {showPassword ? <VisibilityOffOutlined
                                                    sx={{
                                                        color: 'gray',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={handleClickShowPassword} /> : <VisibilityOutlined
                                                    sx={{
                                                        color: 'gray',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={handleClickShowPassword} />}
                                            </InputAdornment>
                                        )
                                    },
                                }}
                            />
                        )}
                        {errors.password && (<p aria-live="polite" className={styles.textError}>{errors.password}</p>)}
                        {(!isLogin && !isLoginHelp) && (
                            <FormTextField
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                variant="standard"
                                label="Confirm Password"
                                sx={{
                                    width: '100%',
                                    color: 'inherit',
                                }}
                            />
                        )}
                        {errors.confirmPassword && (<p aria-live="polite" className={styles.textError}>{errors.confirmPassword}</p>)}
                        <StyledButton disabled={!isButtonEnabled()} type="submit">
                            {isLoginHelp ? 'Send' : (isLogin ? 'Log in' : 'Create Account')}
                        </StyledButton>
                    </form>
                    {!isLoginHelp && (
                        <React.Fragment>
                            <div className={styles.divider}>
                                <Divider orientation='vertical'>OR</Divider>
                            </div>
                            <div className={styles.dividerMobile}>
                                <Divider orientation='horizontal'>OR</Divider>
                            </div>
                            <div className={styles.form}>
                                <StyledButton onClick={handleContinueWithGoogle} startIcon={<Google />}>
                                    Continue with Google
                                </StyledButton>
                            </div>
                        </React.Fragment>
                    )}
                </div>
                {
                    <div className={styles.pageFooterContainer}>
                        {!isLoginHelp
                            && (
                                <>
                                    <p onClick={handleSwitch}>
                                        {isLogin ? 'Create account' : 'Log in'}
                                    </p>
                                    <div className={styles.spacer}></div>
                                </>
                            )}
                        <p onClick={toggleLoginHelp}>
                            {isLoginHelp ? 'Back' : 'Can\'t log in?'}
                        </p>
                    </div>
                }
            </div>
        </div>
    );
};