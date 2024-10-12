'use client';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import { useAuthContext } from '../providers/AuthProvider';
import { useAppContext } from '../providers/AppProvider';
import { Button, InputAdornment, TextField } from '@mui/material';
import {
    Policy,
    VisibilityOffOutlined,
    VisibilityOutlined,
} from '@mui/icons-material';
import styles from './Modal.module.css';

const StyledButton = styled(Button)({
    width: '100%',
    fontFamily: 'monospace',
    fontWeight: 'lighter',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: '0px',
    '&:hover': {
        backgroundColor: 'inherit',
    },
    '&:disabled': {
        backgroundColor: '#f0f0f0',
        color: 'gray',
        border: 'none',
        cursor: 'not-allowed'
    },
    '@media (prefers-color-scheme: dark)': {
        color: 'black',
        backgroundColor: 'white',
    },
});

const StyledTextField = styled(TextField)({
    width: '100%',
    '& .MuiInputBase-input': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        color: 'inherit',
    },
    '& label': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        color: 'inherit',
    },
    '& label.Mui-focused': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
        color: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInputBase-input': {
            color: 'white',
        }
    },
});

const LoginModal: React.FC = () => {
    const
        {
            authError,
            clearAuthError,
            createUserAccount,
            logIn,
            sendPasswordReset,
        } = useAuthContext();
    const { isLoginModalOpen, setIsLoginModalOpen } = useAppContext();

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
            return email.trim() !== '' && password.trim() !== '' && password.length > 6;
        } else {
            return email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password.length > 6;
        }
    };

    const clearValues = () => {
        clearAuthError();
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({ email: '', password: '', confirmPassword: '' });
    }
    const handleClose = () => {
        setConfirmPassword('');
        setEmail('');
        setErrors({ email: '', password: '', confirmPassword: '' });
        setIsLoginHelp(false);
        setIsLoginModalOpen(false);
        setPassword('');
    };

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
                // setIsLoginHelp(false);
            } else if (isLogin) {
                if (!password.trim()) {
                    setErrors({ ...errors, password: 'Password is required' });
                    return;
                }

                await logIn(email, password);
                handleClose();
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
                handleClose();
                alert('Account created successfully. Please check your email for a verification link.');

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
        isLoginModalOpen && (
            <div className={styles.containerModalLogin}>
                <div className={styles.containerLogin}>
                    <h1>{isLoginHelp ? 'Log in help' : (isLogin ? 'Log into Paper Take' : 'Create an account')}</h1>
                    <div className={isLoginHelp ? styles.formContainerLoginHelp : styles.formContainerLogin}>
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
                            {errors.email && (<p aria-live="polite" className={styles.textError}>{errors.email}</p>)}

                            {!isLoginHelp && (
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
                                                    {showPassword ? <VisibilityOffOutlined onClick={handleClickShowPassword} /> : <VisibilityOutlined onClick={handleClickShowPassword} />}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                            {errors.password && (<p aria-live="polite" className={styles.textError}>{errors.password}</p>)}
                            {(!isLogin && !isLoginHelp) && (
                                <StyledTextField
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    variant="standard"
                                    label="Confirm Password"
                                    sx={{ width: '100%',
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
                            <>
                                <div className={styles.dividerContainer}>
                                    <Divider flexItem orientation={"vertical"} sx={{ color: 'gray' }}>
                                        OR
                                    </Divider>
                                </div>
                                <div className={styles.dividerContainerMobile}>
                                    <Divider flexItem orientation={"horizontal"} sx={{ color: 'gray' }}>
                                        OR
                                    </Divider>
                                </div>
                                <div className={styles.formLogin}>
                                    <StyledButton className={styles.button} variant="contained" onClick={handleClose} startIcon={<Policy />}>
                                        Continue without an account
                                    </StyledButton>
                                </div>
                            </>
                        )}
                    </div>
                    {(!isLogin && !isLoginHelp) && (
                        <p className={styles.textTerms}>
                            By creating an account, you agree to our <Link href={'/'} className={styles.textTerms}>Terms of Service</Link> & <Link href={'/'} className={styles.textTerms}>Privacy Policy</Link>
                        </p>
                    )}
                    {isLoginHelp && (
                        <>
                            <p className={styles.textTerms}>
                                Enter your email to receive a password reset link
                            </p>
                            <p className={styles.textTerms}>
                                For any other issues, please contact <Link href="mailto:support@machinename.dev?subject=Support%20Request&body=Please%20describe%20your%20issue%20here." className={styles.textTerms}>support</Link>
                            </p>
                        </>
                    )}
                    <div className={styles.textButtonContainer}>
                        {
                            !isLoginHelp && (
                                <Button type="button" className={styles.textButton} onClick={handleSwitch}>
                                    {isLogin ? 'Create an account' : 'Log in'}
                                </Button>
                            )
                        }
                        <Button type="button" className={styles.textButton} onClick={toggleLoginHelp}>
                            {isLoginHelp ? 'Back' : 'Log in Help'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
}

export default LoginModal;
