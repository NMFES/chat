import {post} from './request';

export default {
    state: {
        token: null,
        login: null
    },
    /**
     * Sets up user's data from local storage
     * @returns {void}
     */
    init() {
        this.state.token = localStorage.getItem('token');
        this.state.login = localStorage.getItem('login');
    },
    /**
     * Sets user's data to local storage
     * @param {string} token
     * @param {string} login
     * @returns {void}
     */
    set(token, login) {
        localStorage.setItem('token', token);
        localStorage.setItem('login', login);

        this.init();
    },
    /**
     * Removes user's data from local storage
     * @returns {void}
     */
    remove() {
        localStorage.removeItem('token');
        localStorage.removeItem('login');

        this.init();
    },
    /**
     * Returns if user is authenticated
     * @returns {Boolean}
     */
    authenticated() {
        if (this.state.token) {
            return true;
        }

        return false;
    },
    /**
     * Try to log in the user
     * @returns {void}
     */
    login() {
        let token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        // we have to verify user's token to ensure that token is still valid
        post('/api/auth/verify', {
            token: token
        })
                .then(response => {
                    if (response.data.login) {
                        // refresh login
                        this.set(response.data.token, response.data.login);
                    } else {
                        this.remove();
                    }
                });
    }
}