<template>
  <div>
  <!-- ---------------------------- ШАПКА ---------------------------- -->
    <b-navbar type="light" variant="light" fixed="top" tag="header">
      <b-navbar-brand to='/'>Unlim</b-navbar-brand>
    </b-navbar>
  <!-- ----------------------------- ТЕЛО ----------------------------- -->
    <nav>
      <b-nav vertical>
        <b-nav-item to='/' exact><b-icon-person-fill></b-icon-person-fill><span>Главная</span></b-nav-item>
        <b-nav-item to='/friends'><b-icon-people-fill></b-icon-people-fill><span>Друзья</span></b-nav-item>
        <b-nav-item to='/messages'><b-icon-chat-fill></b-icon-chat-fill><span>Сообщения</span></b-nav-item>
        <b-nav-item to='/news'><b-icon-grid-fill></b-icon-grid-fill><span>Новости</span></b-nav-item>
        <b-nav-item @click="logout"><span>Выход</span></b-nav-item>
      </b-nav>
    </nav>
    <main>
      <nuxt />
    </main>
  <!-- ---------------------------- ПОДВАЛ ---------------------------- -->
    <b-navbar type="light" variant="light" fixed="bottom" tag="footer" justified>
        <b-row class="w-100 mx-0">
          <b-col class="text-center h4" cols="3"><b-link to='/news'><b-icon-grid-fill></b-icon-grid-fill></b-link></b-col>
          <b-col class="text-center h4" cols="3"><b-link to='/messages'><b-icon-chat-fill></b-icon-chat-fill></b-link></b-col>
          <b-col class="text-center h4" cols="3"><b-link to='/friends'><b-icon-people-fill></b-icon-people-fill></b-link></b-col>
          <b-col class="text-center h4" cols="3"><b-link to='/' exact><b-icon-person-fill></b-icon-person-fill></b-link></b-col>
        </b-row>  
    </b-navbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import io from 'socket.io-client'

export default {
  head: {
    link: [
      { rel: 'stylesheet', href: '/unlimited.css' }
    ]
  },
  async fetch(){
    this.updateGroups()
  },
  computed: {
    token(){
      return this.$auth.$storage._state['_token.local'].substr(7)
    },
    user(){
      return this.$store.$auth.$state.user
    }
  },
  methods: {
    ... mapActions('dict',['updateGroups']),
    logout: async function(){
      this.$auth.logout()
        .then(()=> this.$auth.redirect('login'))
        .catch((err)=> console.log(err))
    },
    toggleSidebar(){
      this.showSidebar = !this.showSidebar
    }
  },
  created(){
    // !!! По идеи объявление сокет соединения должны находиться не здесь
    this.$root.$socket = io(this.$root.context.env.backendUrl, {
      query:{ 
        token: this.token
      },
      transports: ['websocket','polling']
    })
    // При изменении данных group, перезапрашиваем данные
    this.$root.$socket.on('changedGroup', ()=>{
      this.updateGroups()
    })
    this.$root.$socket.on('connect_error', (err)=>{
      console.log(err)
    })
    
  }
}
</script>

