import React, {useContext, useEffect, useState} from 'react';
import './authPage.css';
import {useHttp}                                from '../../hooks/http.hook';
import {useMessage}                             from '../../hooks/message.hook';
import {AuthContext}                            from '../../context/AuthContext';


const AuthPage = () => {
    const {login} = useContext(AuthContext);
    const showMessage = useMessage();
    const {loading, error, request, clearError} = useHttp();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        showMessage(error);
        clearError();
    }, [error, showMessage, clearError]);

    const changeHandler = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const registerHandler = async () => {
        try {
            const data = await request('/auth/register', 'POST', {...form});
            showMessage(data.message)
        } catch (e) {}
    };

    const loginHandler = async () => {
        try {
            const data = await request('/auth/login', 'POST', {...form});
            login(data.token, data.userId)
            showMessage(data.message)
        } catch (e) {}
    };

    return (
        <div>
            <h1 className='center'>Auth page</h1>
            <div className="row">
                <div className="col s12 m6 offset-m3">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title center">Authorization</span>

                            <div className="input-field">
                                <input
                                    id='email'
                                    type='text'
                                    name='email'
                                    className='yellow-input'
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                                <label htmlFor='email'>Enter email</label>
                            </div>
                            <div className="input-field">
                                <input
                                    id='password'
                                    type='password'
                                    name='password'
                                    className='yellow-input'
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor='password'>Enter password</label>
                            </div>
                        </div>
                        <div className="card-action buttons-container">
                            <button
                                disabled={loading}
                                className='btn yellow darken-4'
                                onClick={loginHandler}
                            >Sign In
                            </button>
                            <button
                                onClick={registerHandler}
                                disabled={loading}
                                className='btn grey lighten-1'
                            >Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

