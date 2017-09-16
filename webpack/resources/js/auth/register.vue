<template>
    <div class="modal fade" id="registerForm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Регистрация</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form @submit.prevent="send">
                    <div class="modal-body">
                        <div class="alert alert-danger" role="alert" v-if="error">
                            {{ error }}
                        </div>
                        <div class="form-group">
                            <label for="login-login" class="form-control-label">Логин:</label>
                            <input type="text" class="form-control form-control-sm" id="login-login" :disabled="sending" v-model="form.login" required="required">
                        </div>
                        <div class="form-group">
                            <label for="login-password" class="form-control-label">Пароль:</label>
                            <input type="password" class="form-control form-control-sm" id="login-password" :disabled="sending" v-model="form.password" required="required">
                        </div>
                        <div class="form-group">
                            <label for="login-password2" class="form-control-label">Повторите:</label>
                            <input type="password" class="form-control form-control-sm" id="login-password2" :disabled="sending" v-model="form.password2" required="required">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary btn-sm" :disabled="sending">Зарегистрироваться</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import {post} from '../helpers/request';
    import Auth from '../helpers/auth';

    export default {
        data() {
            return {
                form: {
                    login: '',
                    password: '',
                    password2: ''
                },
                sending: false,
                error: ''
            };
        },
        methods: {
            send() {
                this.sending = true;

                post('/api/auth/register', this.form)
                        .then(response => {
                            if (!response.data.error) {
                                $(this.$el).modal('hide');

                                Auth.set(response.data.token, response.data.login);
                                
                                this.$parent.connect();
                            } else {
                                this.error = response.data.error;
                            }

                            this.sending = false;
                        });
            },
        },
        mounted() {
            $(this.$el).on('hidden.bs.modal', (e) => {
                this.error = '';
                this.form.login = '';
                this.form.password = '';
                this.form.password2 = '';
            });
        }
    }
</script>
<style lang="scss" scoped>
    
</style>