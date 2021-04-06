<template>
        
  <div id="chat">
    <div class="chat-header border-bottom p-3">
      <h4>Название чата</h4>
      <div class="" style="display: flex; flex-wrap: wrap; min-height: 2.5rem;">
        <b-nav class="w-100" pills v-if="chat.selected">
          <b-nav-item @click="setTypeForm('edit')" :active="form.action=='edit'">Редактировать</b-nav-item>
          <b-nav-item @click="deleteMessage()">Удалить</b-nav-item>
          <b-nav-item @click="selectMessage(chat.selected)" class="ml-auto" link-classes="p-0" style="font-size: 1.7rem !important;"><b-icon-x/></b-nav-item>
        </b-nav>
      </div>
    </div>
    <div class="chat-body" @scroll="scroll">
      <template v-for="msg in chat.list">
        <Message @select="selectMessage(msg.id_message)" :selected="chat.selected==msg.id_message" :avatarSrc="msg.avatarSrc" :id_user="msg.id_user" :f="msg.f" :i="msg.i" :body="msg.body" :dt="msg.dt_add" :key="msg.id_message" :client="msg.id_user==client.id_user"/>
      </template>
    </div>
    <div class="chat-footer p-3 border-top">
      <form @submit.prevent="submitHandler" @reset.prevent="resetHandler">
        <textarea class="form-control w-100 mb-2" v-model="form.body"></textarea>
        <div>
          <button class="btn btn-primary float-right mx-1" type="submit">Отправить</button>
          <button class="btn btn-secondary float-right mx-1" type="reset">Очистить</button>
        </div>
      </form>
    </div>
  </div>
      
</template>

<style>
  #chat{
    height: 100%;
    width: 100%;
    min-width: 25rem;
    max-width: 60rem;
  }
  .chat-body{
    overflow-y: scroll;
    overflow-x: hidden;
    height: 70%;
    width: 100%;
  }
</style>

<script>

export default {
  data(){
    return {
      form: {
        body: '',
        action: 'add'
      },
      chat: {
        limit: 20,
        historyEnd: false,
        selected: null,
        list: []
      }
    }
  },
  computed:{
    client(){ return this.$auth.user },
    last_id(){ return (this.chat.list[0])?this.chat.list[0].id_message:null}
  },
  async fetch(){
    if(!+this.$route.params.id){
      this.$router.replace({ path: '/404' })
    }else{
      let id = this.$route.params.id
      try{
        await this.getMsgs()
        setTimeout(()=>{this.scrollMoveBottom()},90)
      }catch(err){
        console.log(err)
        this.$router.replace({ path: '/404' })
      }
    }
  },
  methods: {
    /**
     * Установка типа формы
     */
    setTypeForm(type){
      if( type == 'add' ){
        this.form.action = 'add'
        this.form.body = ''
      }else if( type == 'edit' ){
        if( this.form.action != 'edit'){
          this.form.action = 'edit'
          this.form.body = this.chat.list.find((el)=>( el.id_message == this.chat.selected)).body
        }else{
          this.setTypeForm('add')
        }
      }
    },
    /**
     * Выбрать сообщение
     */
    selectMessage(id){
      let id_user = this.chat.list.find((el)=>( el.id_message == id)).id_user
      if( id_user == this.client.id_user ){
        if( !this.chat.selected ){
          this.chat.selected = id
        }else if( this.chat.selected == id ){
          this.chat.selected = null
          this.setTypeForm('add')
        }
      }
    },
    /**
     * Метод события прокрутки scroll.
     * Когда scroll доходит до самого верха, вызывается метод плучения сообщений 
     */
    scroll(e){
      var bodyChat = e.currentTarget
      if( bodyChat.scrollTop == 0 ){
        this.getMsgs()
      }
    },
    /**
     * Метод прокрутки scroll до последнего сообщения
     */
    scrollMoveBottom(){
      const chatBody = document.querySelector('#chat .chat-body')
      chatBody.scroll(0,chatBody.scrollHeight)
    },
    /**
     * Метод получения сообщений.
     * Запрашивает новые сообщения чата пока они не закончатся
     */
    async getMsgs(){
      if( this.chat.historyEnd ){
        return false
      }else{
        return this.$axios.get( this.$root.context.env.backendUrl + '/chats/messages/' + this.$route.params.id  , {
          params: {
            last_id: this.last_id,
            limit: this.chat.limit
          }
        })
                .then((res)=>{
                  if( res.data.length > 0 ){
                    this.chat.list.unshift(...res.data.reverse())
                  }
                  
                  if( res.data.length == 0 || res.data.length < this.chat.limit ){
                    this.chat.historyEnd = true
                  }
                  const chatBody = document.querySelector('#chat .chat-body')
                  chatBody.scroll(0,500)
                })
                .catch((err)=>{
                  console.log(err)
                })
      }
    },
    /**
     * Метод отправки нового сообщения
     */
    sendMessage(){
      return this.$axios.post( this.$root.context.env.backendUrl + '/chats/messages/' + this.$route.params.id  , {
        body: this.form.body
      })
              .then((res)=>{
                this.form.body = ''
              })
              .catch((err)=>{
                console.log(err)
              })
    },
    /**
     * Метод редактирования сообщения
     */
    editMessage(){
      return this.$axios.put( this.$root.context.env.backendUrl + '/chats/messages/' + this.$route.params.id + '/' + this.chat.selected  , {
        body: this.form.body
      })
              .then((res)=>{
                this.selectMessage(this.chat.selected)
              })
              .catch((err)=>{
                console.log(err)
              })
    },
    /**
     * Метод удаления сообщения
     */
    deleteMessage(){
      return this.$axios.delete( this.$root.context.env.backendUrl + '/chats/messages/' + this.$route.params.id + '/' + this.chat.selected )
              .then((res)=>{
                this.selectMessage(this.chat.selected)
              })
              .catch((err)=>{
                console.log(err)
              })
    },
    /**
     * Метод обработки формы
     */
    submitHandler(){
      if( this.form.action == 'add' ){
        this.sendMessage()
      }else if( this.form.action == 'edit' ){
        this.editMessage()
      }
    },
    /**
     * Метод очистки формы
     */
    resetHandler(){
      if( this.form.action == 'add' ){
        this.form.body = ''
      }else if( this.form.action == 'edit' ){
        this.form.body = this.form.body = this.chat.list.find((el)=>( el.id_message == this.chat.selected)).body
      }
    }
  },
  created(){
    /**
     * Событие получения нового сообщения
     */
    this.$root.$socket.on('sendMessage', (data)=>{
      if( data.id_chat == this.$route.params.id && data.id_message ){
        this.$axios.get( this.$root.context.env.backendUrl + '/chats/messages/' + this.$route.params.id + '/' + data.id_message)
          .then((res)=>{
            this.chat.list.push(res.data)
          })
          .catch((err)=>{
            console.log(err)
          })
      }
    })
    /**
     * Событие изменения сообщения
     */
    this.$root.$socket.on('editMessage', (data)=>{
      if( data.id_chat == this.$route.params.id && data.id_message ){
        this.$axios.get( this.$root.context.env.backendUrl + '/chats/messages/' + this.$route.params.id + '/' + data.id_message)
          .then((res)=>{
            let index = this.chat.list.findIndex((el)=>( el.id_message == data.id_message))
            this.chat.list[index] = res.data
            this.chat.list = [...this.chat.list]
          })
          .catch((err)=>{
            console.log(err)
          })
      }
    })
    /**
     * Событие удаления сообщения
     */
    this.$root.$socket.on('deleteMessage', (data)=>{
      if( data.id_chat == this.$route.params.id && data.id_message ){
        let index = this.chat.list.findIndex((el)=>( el.id_message == data.id_message))
        this.chat.list.splice(index,1)
        this.chat.list = [...this.chat.list]
      }
    })
  }
}
</script>