import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
    query: {
        perPage: 25,
        currentPage: 1,
        sortBy: "id",
        sortDesc: true,
        filter: {
            mail: null,
            iatFrom: null,
            iatTo: null
        }
    }  
})

export const getters = {
    getField
}

export const mutations = {
    updateField,
    setQueryDefault( state ){
        state.query = {
            perPage: 25,
            currentPage: 1,
            sortBy: "id",
            sortDesc: true,
            filter: {
                mail: null,
                iatFrom: null,
                iatTo: null
            }
        }
    }
}