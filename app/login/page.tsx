'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import {
    InputAdornment,
    Divider
} from '@mui/material';
import {
    // Close,
    Policy,
    VisibilityOffOutlined,
    VisibilityOutlined,
} from '@mui/icons-material';
import styles from '../page.module.css';
import { StyledButton, FormTextField, StyledTextButton } from '../components/Styled';
import React from 'react';
import { useAppContext } from '../providers/AppProvider';
import { useAuthContext } from '../providers/AuthProvider';

export default function Login() {
    const
        {
            authError,
            clearAuthError,
            createUserAccount,
            logIn,
            sendPasswordReset,
        } = useAuthContext();

    const { notes, setInfo } = useAppContext();

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginHelp, setIsLoginHelp] = useState(false);
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
        if (isLoginHelp) {
            return email.trim() !== '';
        } else if (isLogin) {
            return email.trim() !== '' && password.trim() !== '' && password.length > 7;
        } else {
            return email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password.length > 7;
        }
    };

    const clearValues = () => {
        clearAuthError();
        setEmail('');
        setConfirmPassword('');
        setErrors({ email: '', password: '', confirmPassword: '' });
        setPassword('');
    }

    const handleContinueWithoutAccount = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        clearValues();
        router.push('/');
    };

    // const handleCloseButton = (event: React.FormEvent<HTMLButtonElement>) => {
    //     event.preventDefault();
    //     clearValues();
    //     router.push('/');
    // };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearAuthError();
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
                const offlineNotes = notes;
   
                if (!password.trim()) {
                    setErrors({ ...errors, password: 'Password is required' });
                    return;
                }

                console.log('Logging in' +
                    'offlineIdeas:', offlineNotes,
        
                );
   
                await logIn(email, password);
                // await addOfflineIdeasToFirebase(offlineIdeas, offlineIdeasIds);
                clearValues();
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
                if (!confirmPassword.trim()) {
                    setErrors({ ...errors, confirmPassword: 'Confirm Password is required' });
                    return;
                }
                if (password !== confirmPassword) {
                    setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
                    return;
                }

                await createUserAccount(email, password);
                setInfo('Account successfully created. Please check your email for a verification link. Confirm your email to enable full account functionality.');
                clearValues();
                router.push('/');
            }
        } catch (error) {
            console.log('Error:', error);
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
            {/* <div className={styles.closeButtonContainer}>
                <StyledIconButton onClick={handleCloseButton}>
                    <Close />
                </StyledIconButton>
            </div> */}
            <div className={styles.wrapperLogin}>
                <h1>{isLoginHelp ? 'Log in help' : (isLogin ? 'Log into Paper Take' : 'Create an account')}</h1>
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
                                        ),
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
                        {authError && (<p className={styles.textError} aria-live="polite">{authError}</p>)}
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
                                <StyledButton onClick={handleContinueWithoutAccount} startIcon={<Policy />}>
                                    Continue without an account
                                </StyledButton>
                            </div>
                        </React.Fragment>
                    )}
                </div>
                {(!isLogin && !isLoginHelp) && (
                    <p>
                        By creating an account, you agree to our <Link href={'/login'} className={styles.textTerms}>Terms of Service</Link> & <Link href={'/login'} className={styles.textTerms}>Privacy Policy</Link>
                    </p>
                )}
                {isLoginHelp && (
                    <React.Fragment>
                        <p className={styles.textTerms}>
                            Enter your email to receive a password reset link
                        </p>
                        <p className={styles.textTerms}>
                            For any other issues, please contact <Link href="mailto:support@machinename.dev?subject=Support%20Request&body=Please%20describe%20your%20issue%20here." className={styles.textTerms}>support</Link>
                        </p>
                    </React.Fragment>
                )}
                <div className={styles.textButtonContainer}>
                    {!isLoginHelp
                        && (
                            <StyledTextButton type="button"
                                // disableRipple={true}
                                disableTouchRipple={true}
                                // disableElevation={true}
                                onClick={handleSwitch}>
                                {isLogin ? 'Create an account' : 'Already have an account?'}
                            </StyledTextButton>
                        )}
                    <StyledTextButton type="button"
                        // disableRipple={true}
                        disableTouchRipple={true}
                        // disableElevation={true}
                        onClick={toggleLoginHelp}>
                        {isLoginHelp ? 'Back' : 'Log in Help'}
                    </StyledTextButton>
                </div>
            </div>
        </div>
    );
};