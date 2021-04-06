<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <h1>Сообщения</h1>
      </b-col>
      <b-col cols="12">
        <!-- Форма фильтрации -->
        <b-form>

        </b-form>
        <!-- Таблица сообщений -->
        <b-table
          id="tableChats"
          :items="chatsProvider"
          :fields="table.fields"
          :filter="filter"
          :busy.sync="table.busy" 
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="currentPage" 
          :per-page="0" 
          hover responsive
          :api-url="$root.context.env.backendUrl + '/chats'"
          @row-clicked="row_clicked"
        >
          <!-- Автврка -->
          <template #cell(srcAvatar)="">
            <b-img v-bind="{ blank: true, width: 50, height: 50 }" rounded="circle" blank-color="#777" alt="Circle image"></b-img>
          </template>
          <!-- Название беседы -->
          <template #cell(nameChat)="data">
            <template v-if="data.item.type==2">
              {{ data.item.name }}
            </template>
            <template v-else>
              {{ data.item.users.find(user=>( user.id != id_client)).mail }}
            </template>
          </template>
          <!-- Последнее сообщение -->
          <template #cell(lastMsg)="data">
            <p class="p-2 rounded" :style="{backgroundColor:(!data.item.status)?'#e2e3e5':''}">
              <b-img v-bind="{ blank: true, width: 30, height: 30 }" rounded="circle" blank-color="#777" alt="Circle image"></b-img>
              {{data.item.body}}
            </p>
          </template>

          <!-- Загрузка данных-->
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Загрузка...</strong>
            </div>
          </template>

        </b-table>

        <b-pagination v-if="table.totalRows/perPage>=2"
          pills
          align="center"
          v-model.lazy="currentPage"
          :total-rows="table.totalRows"
          :per-page="perPage"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapMutations } from 'vuex'

export default {
  data(){
    return {
      formFilter: {
        mail: null,
        iatFrom: null,
        iatTo: null
      },
      table:{
        busy: false,
        totalRows: 0,
        fields: [
          { key: "srcAvatar", label: "", sortable: false },
          { key: "nameChat", label: "Название беседы", sortable: false },
          { key: "lastMsg", label: "Последнее сообщение", sortable: false },
          { key: "dt", label: "Дата сообщения", sortable: true }         
        ]
      }
    }
  },
  computed: {
    ... mapFields('cache/chatsReqParams',{
      perPage: 'query.perPage',      // Всего элементов на странице
      currentPage: 'query.currentPage',  // Текущая страница
      sortBy: 'query.sortBy',       // Сортировка по столбцу
      sortDesc: 'query.sortDesc',     // Обратная сортировка (bolean)
      filter: 'query.filter'        // Фильрация данныхd
    }),
    id_client(){ return this.$auth.$state.user.id_user }
  },
  methods: {
    ... mapMutations('cache/chatsReqParams',['setQueryDefault']),
    row_clicked(item){
      this.$router.push( '/messages/' + item.id )
    },
    setFilters(){
      this.filter = { ... this.formFilter }
    },
    chatsProvider: function(ctx){
      return this.$axios.get( ctx.apiUrl, {
        params: {
          page: ctx.currentPage,
          perPage: this.perPage,
          sortBy: ctx.sortBy,
          sortDesc: ctx.sortDesc,
          filter: ctx.filter
        }
      })
                .then((res)=>{
                  if(res.data.count && res.data.result){
                    this.table.totalRows = res.data.count
                    return res.data.result
                  }else{
                    this.table.totalRows = 0
                    return []
                  }                  
                })
                .catch((err)=>{
                  console.log(err)
                  this.table.totalRows = 0
                  return []
                })
    }
  },
  created(){
    // При загрузке страницы задаем локальное состояние формы фильтрации, данными из cache
    this.formFilter = { ... this.filter }
  }
}
</script>