export default async function (context) {
    // Если пользователь авторизован
    if(context.$auth.loggedIn){
        try{
            // Перезапрашиваем его данные
            await context.$auth.fetchUser()
        }catch(err){
            console.log(err)
            // Если происходит ошибка убиваем авторизацию
            context.$auth.logout()
            context.redirect(context.env.backendUrl)
        }
    }
}