<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="#"><span class="fa fa-users"></span></a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item" v-if="!auth.authenticated()">
                                <a class="nav-link" href="#" data-toggle="modal" data-target="#loginForm">Вход</a>
                            </li>
                            <li class="nav-item" v-if="!auth.authenticated()">
                                <a class="nav-link" href="#" data-toggle="modal" data-target="#registerForm">Регистрация</a>
                            </li>
                            <li class="nav-item" v-if="auth.authenticated()">
                                <span>{{ auth.state.login }} <span class="fa fa-sign-out logout" @click="logout"></span></span>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-12 col-md-7 my-2">
                        <div class="card log">
                            <div class="card-body" ref="chatlog">
                                <div class="message" v-for="message in messages">
                                    <div>{{ message.date }}</div>
                                    <div>{{ message.login }}:</div>
                                    <div>{{ message.text }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-5 my-2 pl-3 pl-sm-0">
                        <div class="card users">
                            <div class="list">Пользователей: {{ list.users.length }} и гостей: {{ list.guests }}</div>
                            <div class="card-body">
                                <div class="user" v-for="user in list.users">{{ user }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 my-2">
                <div class="card">
                    <div class="card-body">
                        <form @submit.prevent="send">
                            <div class="form-row">
                                <div class="col-12 col-sm-8">
                                    <input type="text" class="form-control mb-2 mb-sm-0" v-model="message" :disabled="sending || !auth.authenticated()" placeholder="Ваше сообщение ... ">
                                </div>
                                <div class="col-12 col-sm-4 btnBlock">
                                    <button type="submit" class="btn btn-primary btn-block ml-0 ml-sm-1" :disabled="sending || !auth.authenticated() || !message"><span class="fa fa-envelope"></span> Отправить</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <login-form></login-form>
        <register-form></register-form>
    </div>
</template>
<script type="text/javascript">
    import 'bootstrap';
    import Auth from './helpers/auth';
    import axios from 'axios';
    import {post, HOST, PORT} from './helpers/request';
    import loginForm from './auth/login.vue';
    import registerForm from './auth/register.vue';

    export default {
        data() {
            return {
                auth: Auth,
                message: '',
                sending: false,
                messages: [],
                list: {users: [], guests: 0},
                socket: null
            }
        },
        components: {loginForm, registerForm},
        created() {
            // try to log in
            Auth.login();

            post('/api/messages/all')
                    .then(response => {
                        if (response.data.messages) {
                            this.messages = response.data.messages;
                        }

                        this.connect();
                    });
        },
        mounted() {
            this.scroll();
        },
        watch: {
            messages: function () {
                this.scroll();
            }
        },
        methods: {
            logout() {
                Auth.remove();

                this.connect();
            },
            scroll() {
                setTimeout(() => {
                    this.$refs.chatlog.scrollTop = this.$refs.chatlog.scrollHeight;
                }, 100);
            },
            connect() {
                // close previous socket
                if (this.socket) {
                    this.socket.close();
                }

                // set token and open new socket
                this.socket = io(HOST + ':' + PORT, {
                    query: {
                        token: Auth.state.token
                    }
                });

                this.socket.on('connect', () => {
                    this.socket.on('list', list => {
                        this.list = list;
                    });

                    this.socket.on('message', data => {
                        this.messages.push(data);
                    });
                });
            },
            send() {
                this.socket.emit('message', {
                    message: this.message,
                    token: Auth.state.token
                });

                this.message = '';
            },

        }
    }
</script>
<style lang="scss">
    $fa-font-path: "~font-awesome/fonts";
    @import "~font-awesome/scss/font-awesome";

    @import "~bootstrap/scss/bootstrap";
    @import "../sass/styles";
</style>