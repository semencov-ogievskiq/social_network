<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <h1 class="mb-4">Друзья</h1>
      </b-col>
      <b-col cols="12">
        
        <b-table
          id="tableFriends"
          :items="friendsProvider"
          :fields="table.fields"
          :filter="filter"
          :busy.sync="table.busy" 
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="currentPage" 
          :per-page="0" 
          hover responsive
          :api-url="$root.context.env.backendUrl + '/users/' + id_client + '/friendsByCondition'"
        >
        </b-table>

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
          { key: "id_avatar", label: "", sortable: false },
          { key: "mail", label: "email", sortable: false },
          { key: "fio", label: "ФИО", sortable: false },
          { key: "dt_birth", label: "День рождения", sortable: true },
          { key: "status", label: "Статус дружбы", sortable: false },  
        ]
      }
    }
  },
  computed: {
    ... mapFields('cache/friendsReqParams',{
      perPage: 'query.perPage',      // Всего элементов на странице
      currentPage: 'query.currentPage',  // Текущая страница
      sortBy: 'query.sortBy',       // Сортировка по столбцу
      sortDesc: 'query.sortDesc',     // Обратная сортировка (bolean)
      filter: 'query.filter'        // Фильрация данныхd
    }),
    id_client(){ return this.$auth.$state.user.id_user }
  },
  methods: {
    friendsProvider(ctx){
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
  }
}
</script>