export const state = () => ({
    groups: {}
})

export const mutations = {
    setGroups( state, _groups ) {
        state.groups = { ... _groups }
    }
}

export const actions = {
    async updateGroups( context ) {
        try{
            let res = await $nuxt.$axios.get($nuxt.$root.context.env.backendUrl + '/users_old/groups')
            let data = res.data.groups
            let result = {}
            for (var key in data) {
                result[data[key].id] = data[key]
            }
            context.commit('setGroups', result)
        }catch( err ){
            console.log( err )
        }
    }
}