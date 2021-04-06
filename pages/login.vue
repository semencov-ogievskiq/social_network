<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" 
        sm="10" offset-sm="1" 
        md="8" offset-md="2"
        lg="6" offset-lg="3"
        xl="4" offset-xl="4"
      >
        <b-nav class="mb-4" tabs justified>
          <b-nav-item :active="!toggle" @click="toggleClick(false)"  >Авторизация</b-nav-item>
          <b-nav-item :active="toggle" @click="toggleClick(true)" >Регистрация</b-nav-item>
        </b-nav>

        <!-- Авторизация -->
        <b-form v-if="!toggle" @submit.prevent="onSubmitSignIn">
          <b-form-group id='login-group' label='Почта'  label-for='login'>
            <b-form-input id='login' v-model.trim='$v.signIn.login.username.$model' :disabled="Boolean(signIn.loading)" type='email' required placeholder='Почта' :state=" ( $v.signIn.login.username.$dirty )? !$v.signIn.login.username.$invalid : null "></b-form-input>
          </b-form-group>
          <b-form-group id='password-group' label='Пароль' :state="!signIn.err" label-for='password'>
            <b-form-input id='password' v-model.trim='$v.signIn.login.password.$model' :disabled="Boolean(signIn.loading)" type='password' required placeholder='Пароль' :state=" ( $v.signIn.login.password.$dirty )? !$v.signIn.login.password.$invalid : null "></b-form-input>
          </b-form-group>
          <div class='mt-4'>
            <b-link to='/recovery_password'>Забыли пароль?</b-link>
            <b-button style='width: 150px' class='float-right' variant='primary' type="submit">Вход</b-button>
          </div>
        </b-form>

        <!-- Регистрация -->
        <b-form v-else @submit.prevent="onSubmitSignUp" @reset="onResetSignUp">
          <!-- Шкала загрузки -->
          <div style="height: 2rem ">
              <b-progress v-if="signUp.loading" :value="signUp.loading" max="100" show-progress animated>
                  <b-progress-bar :value="signUp.loading" :label=" signUp.loading + '%' "/>
              </b-progress>
          </div>
          <!-- Alert -->
          <b-alert v-if="signUp.alert" show :variant=" (signUp.typeAlert)? signUp.typeAlert : null ">
              <h4>{{signUp.msgAlert.head}}</h4>
              <p>{{signUp.msgAlert.body}}</p>
          </b-alert>
          <!-- Form -->
          <b-form-group label="Email" label-for="Email">
              <b-form-input id="Email" v-model.trim="$v.signUp.form.mail.$model" :disabled="Boolean(signUp.loading)" type="email" :state=" ( $v.signUp.form.mail.$dirty )? !$v.signUp.form.mail.$invalid : null "/>
              <b-form-invalid-feedback id="F">
                  Поле должно содержать корректный email адрес
              </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Пароль" label-for="Password">
              <b-form-input id="Password" v-model.trim="$v.signUp.form.password.$model" :disabled="Boolean(signUp.loading)" type="password" :state=" ( $v.signUp.form.password.$dirty )? !$v.signUp.form.password.$invalid : null " />
              <b-form-invalid-feedback id="Password">
                  Пароль должен быть не менее 6 символов
              </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Повторите пароль" label-for="RepeatPassword">
              <b-form-input id="RepeatPassword" v-model.trim="$v.signUp.form.repeatPassword.$model" :disabled="Boolean(signUp.loading)" type="password" :state=" ( $v.signUp.form.repeatPassword.$dirty )? !$v.signUp.form.repeatPassword.$invalid : null " />
              <b-form-invalid-feedback id="RepeatPassword">
                  Пароли не совпадают
              </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Фамилия" label-for="F">
              <b-form-input id="F" v-model.trim="$v.signUp.form.f.$model" :disabled="Boolean(signUp.loading)" type="text" :state=" ( $v.signUp.form.f.$dirty )? !$v.signUp.form.f.$invalid : null " />
              <b-form-invalid-feedback id="F">
                  Поле должно содержать хотя бы два символа
              </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Имя" label-for="I">
              <b-form-input id="I" v-model.trim="$v.signUp.form.i.$model" :disabled="Boolean(signUp.loading)" type="text" :state=" ( $v.signUp.form.i.$dirty )? !$v.signUp.form.i.$invalid : null " />
              <b-form-invalid-feedback id="I">
                  Поле должно содержать хотя бы два символа
              </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Дата рожденья"  label-for="DB">
              <b-form-datepicker id="DB" v-model.trim="$v.signUp.form.dt_birth.$model" :disabled="Boolean(signUp.loading)" :state=" ( $v.signUp.form.dt_birth.$dirty )? !$v.signUp.form.dt_birth.$invalid : null " placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
              <b-form-invalid-feedback id="DB">
                  Поле обязательно для заполнения
              </b-form-invalid-feedback>
          </b-form-group>
          
          <div>
            <b-button class="mx-2" type="reset" variant="secondary">Сбросить</b-button>
            <b-button class="mx-2" type="submit" variant="primary">Отправить</b-button>
          </div>
        </b-form>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

export default {
  layout: 'unauthorized',
  data: function(){
    return {
      toggle: false, 
      signIn:{
        login: {
          username: '',
          password: ''
        },
        loading: false
      },
      signUp:{
        form: {
          mail: null,
          password: null,
          repeatPassword: null,
          f: null,
          i: null,
          dt_birth: null
        },
        loading: null
      },
    }
  },
  validations: {
    signIn: {
      login: {
        username: { required, email },
        password: { required }
      }
    },
    signUp: {
      form: {
        mail: { required, email },
        password: { required, minLength: minLength(6) },
        repeatPassword: { required, sameAs: sameAs('password') },
        f: { required, minLength: minLength(2) },
        i: { required, minLength: minLength(2) },
        dt_birth: { required }
      },
      loading: null,
      typeAlert: null,
      alert: false,
      msgAlert: { head: null, body: null }
    }
  },
  methods: {
    toggleClick(e){
      if( e != this.toggle ){
        this.toggle = !this.toggle
      }
    },
    async onSubmitSignIn(){
      if( !this.signIn.loading ){
        this.signIn.loading = true
        let res = await this.$auth.loginWith('local', { data: this.signIn.login })
          .then( () => { this.signIn.loading = false })
          .catch( (err) => { 
            if( err.response.data.typeErr ){
              this.signIn.err = err.response.data
              this.signIn.loading = false
              this.signIn.login.password = ''
            }
          })
      }
    },
    autoLogin(){
      this.toggleClick(true)
      this.signIn.login.username = this.signUp.form.mail
      this.signIn.login.password = this.signUp.form.password
      this.onResetSignUp()
      this.onSubmitSignIn()
    },
    onResetSignUp(){
      this.signUp.form = {
        mail: null,
        password: null,
        repeatPassword: null,
        f: null,
        i: null,
        dt_birth: null,
      }
      this.$v.signUp.form.$reset()
    },
    async onSubmitSignUp(){
      this.hideAlertRegForm()
      if ( 
        !this.$v.signUp.form.mail.$dirty || !this.$v.signUp.form.password.$dirty || 
        !this.$v.signUp.form.repeatPassword.$dirty || !this.$v.signUp.form.f.$dirty ||
        !this.$v.signUp.form.i.$dirty || !this.$v.signUp.form.dt_birth.$dirty
      ){
        this.showAlertRegForm( 'danger', 'Внимание', 'Заполните все обязательные поля' )
      }else{
        // Адрес запроса
        let url = this.$root.context.env.backendUrl + '/registration'
        // Данные формы
        let formData = { ...this.signUp.form, dt_birth: moment( this.signUp.form.dt_birth ).format( 'DD.MM.YYYY' ) }
        let options = { 
          onUploadProgress: function( e ){ this.signUp.loading = parseInt( Math.round( ( e.loaded / e.total ) * 100) ) }.bind( this ),
          validateStatus: function( status ){ return status >= 200 && status < 500 }  
        }
        try{
          let res = await this.$axios.post( url, formData, options )
          if( res.status >= 400 ) throw new Error( res.status + ' - ' + res.statusText )
          if( !res.data.id ) throw new Error( 'Не пришел идентификатор пользователя' )
          this.signUp.loading = null
          this.showAlertRegForm( 'success', 'Внимание', 'Пользоатель зарегистрирован' )
          this.autoLogin()
        }catch( err ){
          this.signUp.loading = null
          this.showAlertRegForm( 'danger', 'Внимание', 'В результате регистрации пользователя произошла ошибка. Проверте введенные данные в форму и повторите попытку' )
          console.log( err )
        }
      }
    },
    showAlertRegForm( _type, _head, _body ){
      this.signUp.typeAlert = _type,
      this.signUp.alert = true,
      this.signUp.msgAlert = { head: _head, body: _body }
    },
    hideAlertRegForm(){
      this.signUp.typeAlert = null,
      this.signUp.alert = false,
      this.signUp.msgAlert = { head: null, body: null }
    },
  }
}
</script>