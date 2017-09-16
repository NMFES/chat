import axios from 'axios';
import Auth from './auth';

export const HOST = 'http://localhost';
export const PORT = 3000;

/**
 * GET request
 * @param {string} url
 * @returns {axios}
 */
export function get(url) {
    return axios({
        method: 'GET',
        url: HOST + ':' + PORT + url
    });
}

/**
 * POST request
 * @param {string} url
 * @param {object} data
 * @returns {axios}
 */
export function post(url, data) {
    return axios({
        method: 'POST',
        url: HOST + ':' + PORT + url,
        data: data ? data : {},
        headers: {
            'Authorization': `JWT ${Auth.state.token}`
        }
    });
}