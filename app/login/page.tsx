'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../providers/AuthProvider';
import {
    styled, Button,
    //  Divider, 
    InputAdornment, TextField,
    Divider,
    IconButton
} from '@mui/material';
import {
    Close,
    Policy,
    VisibilityOffOutlined,
    VisibilityOutlined,
} from '@mui/icons-material';
import styles from '../page.module.css';

const StyledButton = styled(Button)({
    width: '100%',
    fontFamily: 'monospace',
    fontWeight: 'lighter',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: '0px',

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
        '& .MuiInput-underline': {
            '&:before': {
                borderBottom: '1px solid gray',
            },
            '&:hover:before': {
                borderBottom: '2px solid gray',
            }
        },
        '& .MuiInputBase-input': {
            color: 'white',
        },
        '& label': {
            color: 'white',
        },
        '& label.Mui-focused': {
            color: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: '1px solid gray',
            },
        },
    },
});


export default function Login() {
    const
        {
            authError,
            clearAuthError,
            createUserAccount,
            logIn,
            sendPasswordReset,
        } = useAuthContext();

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
            return email.trim() !== '' && password.trim() !== '' && password.length > 6;
        } else {
            return email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password.length > 6;
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
        router.back();
    };

    const handleCloseButton = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        clearValues();
        router.push('/');
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
            } else if (isLogin) {
                if (!password.trim()) {
                    setErrors({ ...errors, password: 'Password is required' });
                    return;
                }

                await logIn(email, password);
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
        <div className={styles.page}>
            <div className={styles.closeButtonContainer}>
                <IconButton onClick={handleCloseButton} sx={{ color: 'gray'}}> 
                    <Close/>
                </IconButton>
            </div>
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
                            <StyledTextField
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
                    <div className={styles.divider}>
                        <Divider  orientation='vertical'>OR</Divider>
                    </div>
                    <div className={styles.dividerMobile}>
                        <Divider orientation='horizontal'>OR</Divider>
                    </div>
                    {!isLoginHelp && (
                        <div className={styles.formLogin}>
                            <StyledButton className={styles.button} onClick={handleContinueWithoutAccount} startIcon={<Policy />}>
                                Continue without an account
                            </StyledButton>
                        </div>
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
                {
                    isLogin && (
                            <p className={styles.textTerms}>
                                Don&apos;t have an account?
                            </p>
                    )
                }
                <div className={styles.textButtonContainer}>
                    {
                        !isLoginHelp && (
                            <Button type="button" className={styles.textButton} onClick={handleSwitch}>
                                {isLogin ? 'Create an account' : 'Already have an account?'}
                            </Button>
                        )
                    }
                    <Button type="button" className={styles.textButton} onClick={toggleLoginHelp}>
                        {isLoginHelp ? 'Back' : 'Log in Help'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
