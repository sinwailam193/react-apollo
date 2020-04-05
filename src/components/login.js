import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { AUTH_TOKEN } from "../constants";

const SIGNUP_MUTATION = gql`
    mutation SignupMutation($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
            token
        }
    }
`;

const LOGIN_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;

export default function Login(props) {
    const { push } = props.history;
    const [login, setLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [mutation] = useMutation(login ? LOGIN_MUTATION : SIGNUP_MUTATION, {
        onError: error => alert(error.toString()),
        variables: { email, password, name },
        onCompleted: data => confirm(data)
    })

    function confirm(data) {
        const { token } = login ? data.login : data.signup;
        saveUserData(token);
        push("/");
    }

    function saveUserData(token) {
        localStorage.setItem(AUTH_TOKEN, token);
    }

    return (
        <div>
            <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
            <div className="flex flex-column">
                {!login && (
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        type="text"
                        placeholder="Your name"
                    />
                )}
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="text"
                    placeholder="Your email address"
                />
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="Choose a safe password"
                />
            </div>
            <div className="flex mt3">
                <div className="pointer mr2 button" onClick={mutation}>
                    {login ? 'login' : 'create account'}
                </div>
                <div
                    className="pointer button"
                    onClick={() => setLogin(!login)}
                >
                    {login
                    ? 'need to create an account?'
                    : 'already have an account?'}
                </div>
            </div>
        </div>
    )
}