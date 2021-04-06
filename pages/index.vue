<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" md="6" lg="5" xl="4">
        <!-- Данные пользователя -->
        <div class="avatar_block">
          <b-row>
            <b-col cols="12" sm="3" md="4" lg="5" xl="5">
              <b-avatar id="avatar" class="avatar" variant="light" :src="avatarSRC"></b-avatar>
              <a class="upload_avatar" id="upload_avatar"><b-icon-upload/></a>
              <avatar-cropper 
                trigger="#upload_avatar"
                :upload-url="$root.context.env.backendUrl + '/files/upload_avatar'"
                :upload-headers="{'Authorization': $auth.$storage._state['_token.local'] }"
                :upload-form-data="{ id_user: user.id_user }"
                :labels="{submit:'Загрузить',cancel:'Закрыть'}"
                :cropper-options="{movable: true, zoomable: true}"
              />
            </b-col>
            <b-col cols="12" sm="9" md="8" lg="7" xl="7">
              <div>
                <strong>{{user.f}} <br> {{user.i}} {{user.o}}</strong>
              </div>
              <div>
                <strong :class="(status)?'text-success':'text-danger'">{{(status)?'online':'offline'}}</strong>  
              </div>            
            </b-col>
            <b-col class="text-center" cols="12">
              <b-button to="edit" class="m-2" variant="outline-success">Редактировать</b-button>
            </b-col>
          </b-row>
        </div>

        <b-list-group class="w-100">
          <b-list-group-item to="/friends" class="border-0">
            <div class="mb-1 font-weight-bold">Друзья:</div>
            <b-row>
              <b-col v-for="friend in user.friends.slice(0,6)" :key="friend.id_user" class="text-center" >
                <b-avatar :to="'/user/' + friend.id_user" :id="'a_'+friend.id_user" variant="light" :src="friend.avatarSRC"></b-avatar>
                <b-tooltip :target="'a_'+friend.id_user" triggers="hover" placement="bottom">
                  {{friend.f}} {{friend.i}} {{friend.o}}
                </b-tooltip>
              </b-col>
              <b-col class="text-center" >
                <b-avatar to="/friends"  variant="light" icon="three-dots"></b-avatar>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>

      </b-col>
      <b-col  cols="12" md="6" lg="7" xl="8">
        <!-- Новостная лента -->
        Тут набор card с пагинацией
      </b-col>
    </b-row>
  </b-container>
</template>

<style>
  .avatar_block {
    padding: 0.5rem 1.5rem 0.5rem 1.5rem !important;
    border-top-left-radius: 0.25rem !important;
    border-top-right-radius: 0.25rem !important;
    background-color: #f8f9fa !important;
  }
  .avatar{
    height: 100px !important;
    width: 100px !important;
    min-width: 100px !important;

  }
  .upload_avatar {
    display: none;
    position: absolute;
    top: +2.3rem;
    left: 3.1rem;
    padding: 0.1rem 0.4rem;
    border-radius: 0.25rem !important;
    color: #fff !important;
    background-color: #007bff;
    border-color: #007bff;
  }
  .avatar:hover + .upload_avatar {
    display: block;
  }
  .upload_avatar:hover {
    display: block;
    background-color: #0069d9;
    border-color: #0062cc;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
  }
</style>

<script>
import AvatarCropper from 'vue-avatar-cropper'

export default {
  components: {AvatarCropper},
  data(){
    return {
      user: {
        id_user: null,
        mail: null,
        f: null,
        i: null,
        o: null,
        dt_birth: null,
        id_avatar: null,
        friends: []
      },
      status: false,
      avatarSRC: null
    }
  },
  computed: {
    client(){ return this.$auth.$state.user }
  },
  async fetch(){
    this.getStatus()
    await this.getUserData()
    this.avatarSRC = await this.getAvatar( this.user.id_avatar )
    await this.getUserFriends()
  },
  methods: {
    // Получение текущее состояние подключения пользователя по socket io
    getStatus(){
      this.$root.$socket.emit('client_status',this.client.id_user,(status)=>{
        this.status = status
      })
    },
    // Запрос аватарки пользователя
    async getAvatar( id_avatar ){
      try{
        if( id_avatar ){
          let res = await this.$axios.get( this.$root.context.env.backendUrl + '/files/' + id_avatar, { responseType: 'arraybuffer'})

          var blob = new Blob([res.data],{ type: res.headers['content-type']} )
          return  URL.createObjectURL(blob).toString()
        }
      }catch( err ){
        console.log( err )
      }     
    },
    // Запрос общих данных пользователя
    getUserData(){
      return this.$axios.get( this.$root.context.env.backendUrl + '/users/' + this.$auth.user.id_user)
        .then((res)=>{
          if ( res.data.id_user ){
            this.user = { ... this.user, ... res.data }
          }else{
            throw new Error('Не удалость получить данные поьзователя')
          }        
        })
        .catch((err)=>{
          console.log(err)
        })
    },
    // Запрос списка друзей пользователя
    getUserFriends(){
      return this.$axios.get( this.$root.context.env.backendUrl + '/users/' + this.$auth.user.id_user + '/friends')
        .then(async (res)=>{
          for( var index in res.data){
            console.log(res.data[index].id_avatar)
            res.data[index]['avatarSRC'] = await this.getAvatar( res.data[index].id_avatar )
          }
          this.user.friends = [ ... res.data ]
        })
        .catch((err)=>{
          console.log(err)
        })
    }
  },
  mounted(){
    this.$root.$socket.on('changedUser', async (id)=>{
      if(id == this.$auth.$state.user.id_user){
        await this.getUserData()
        this.avatarSRC = await this.getAvatar( this.user.id_avatar )
      }
    })
    
  }

}
</script>